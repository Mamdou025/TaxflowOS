import type {
  WorkflowEdge as CanvasWorkflowEdge,
  WorkflowNode,
} from '@/shared/workflow-engine/state/workflow-store';
import {
  type WorkflowDefinition,
  type WorkflowBlock,
  type WorkflowStructure,
  FISCAL_STAGE_OPTIONS,
  type BlockCatalogItem,
  type BlockFamily,
  BLOCK_FAMILY_STAGE,
  SYSTEM_USER,
  type WorkflowEdge,
  type WorkflowDefinitionStatus,
  LOCAL_WORKFLOW_ID,
  LOCAL_WORKFLOW_SCHEMA_VERSION,
} from './contracts';
import { createWorkflowNodeFromBlock, createWorkflowBlockFromCatalog } from './block-factory';
import {
  createCanvasEdgeFromWorkflowEdge,
  getWorkflowRelationshipForValue,
  getEdgeStatusFromValue,
  getEdgeBindingStatusFromValue,
  getWorkflowEdgeDefaults,
  createWorkflowEdgeRecord,
} from './edges';
import {
  getBlockCatalogItem,
  getFamilyForStage,
  getSubtypeFromValue,
  getDefaultCatalogItemForFamily,
  getBlockCatalogItemBySubtype,
} from './visuals';
import {
  generateRuntimeUiConfigFromParts,
  generateOutputMappingPreviewFromParts,
} from './runtime-ui';

export function workflowDefinitionToCanvas(definition: WorkflowDefinition): {
  nodes: WorkflowNode[];
  edges: CanvasWorkflowEdge[];
} {
  const entryBlockId = definition.structure.entryBlockId || definition.blocks[0]?.id;

  return {
    nodes: definition.blocks.map((block, index) =>
      createWorkflowNodeFromBlock(block, {
        selected: index === 0,
        type:
          block.id === entryBlockId || block.config.canvasNodeType === 'trigger'
            ? 'trigger'
            : 'action',
      }),
    ),
    edges: definition.edges.map(createCanvasEdgeFromWorkflowEdge),
  };
}

export function getWorkflowStructure(blocks: WorkflowBlock[]): WorkflowStructure {
  const columns = FISCAL_STAGE_OPTIONS.map((option) => ({
    id: option.stage,
    family: option.family,
    label: option.label,
    blockIds: blocks.filter((block) => block.family === option.family).map((block) => block.id),
  })).filter((column) => column.blockIds.length > 0);

  return {
    layout: 'canvas-columns',
    entryBlockId: blocks[0]?.id,
    blockOrder: blocks.map((block) => block.id),
    columns,
  };
}

function resolveCatalogItemForNode(node: WorkflowNode): BlockCatalogItem {
  const config = node.data.config || {};
  const existingCatalogId =
    (node.data.block?.catalogId as string | undefined) || (config.catalogId as string | undefined);
  const existingCatalogItem = existingCatalogId
    ? getBlockCatalogItem(existingCatalogId)
    : undefined;
  if (existingCatalogItem) {
    return existingCatalogItem;
  }

  const family =
    node.data.block?.family ||
    ((config.blockFamily as BlockFamily | undefined) ??
      getFamilyForStage(config.fiscalStage as string | undefined));
  const subtype = getSubtypeFromValue(
    config.blockSubtype as string | undefined,
    getDefaultCatalogItemForFamily(family).subtype,
  );
  return getBlockCatalogItemBySubtype(subtype) || getDefaultCatalogItemForFamily(family);
}

function canvasNodeToWorkflowBlock(node: WorkflowNode, index: number): WorkflowBlock {
  const item = resolveCatalogItemForNode(node);
  const existingBlock = node.data.block;
  const label = node.data.label || existingBlock?.label || item.label;
  const config: Record<string, unknown> = {
    ...item.defaultConfig,
    ...existingBlock?.config,
    ...node.data.config,
    fiscalStage: BLOCK_FAMILY_STAGE[item.family],
    blockFamily: item.family,
    blockSubtype: item.subtype,
    catalogId: item.id,
    canvasNodeType: node.data.type,
  };

  const block = createWorkflowBlockFromCatalog(item.id, {
    id: node.id,
    label,
    description: node.data.description || existingBlock?.description || item.description,
    position: node.position,
    config,
    status: existingBlock?.status || (index === 0 ? 'configured' : 'draft'),
    createdAt: existingBlock?.createdAt,
    updatedAt: new Date().toISOString(),
    createdBy: existingBlock?.createdBy,
    updatedBy: SYSTEM_USER,
    sample: existingBlock?.sample,
  });

  return {
    ...block,
    source: existingBlock?.source || block.source,
    governance: existingBlock?.governance
      ? {
          ...existingBlock.governance,
          editIntent:
            typeof config.protectedEditIntent === 'string'
              ? config.protectedEditIntent
              : existingBlock.governance.editIntent,
        }
      : block.governance,
    runtime: { ...block.runtime, ...existingBlock?.runtime },
  };
}

export function normalizeWorkflowEdgeRecord({
  edge,
  sourceBlock,
  targetBlock,
}: {
  edge: WorkflowEdge;
  sourceBlock?: WorkflowBlock;
  targetBlock?: WorkflowBlock;
}): WorkflowEdge {
  return {
    ...edge,
    relationshipType: getWorkflowRelationshipForValue({
      sourceBlock,
      targetBlock,
      value: edge.relationshipType,
    }),
    status: getEdgeStatusFromValue(edge.status),
    bindingStatus: getEdgeBindingStatusFromValue(edge.bindingStatus),
    confidence: typeof edge.confidence === 'number' ? edge.confidence : 1,
    notes: edge.notes || '',
    history: Array.isArray(edge.history) ? edge.history : [],
  };
}

function canvasEdgeToWorkflowEdge(
  edge: CanvasWorkflowEdge,
  blockMap: Map<string, WorkflowBlock>,
): WorkflowEdge {
  const sourceBlock = blockMap.get(edge.source);
  const targetBlock = blockMap.get(edge.target);
  const existing = edge.data?.workflowEdge;
  if (existing) {
    return normalizeWorkflowEdgeRecord({
      edge: {
        ...existing,
        id: edge.id,
        sourceBlockId: edge.source,
        targetBlockId: edge.target,
      },
      sourceBlock,
      targetBlock,
    });
  }

  const defaults =
    sourceBlock && targetBlock ? getWorkflowEdgeDefaults({ sourceBlock, targetBlock }) : null;

  return createWorkflowEdgeRecord({
    id: edge.id,
    sourceBlockId: edge.source,
    targetBlockId: edge.target,
    relationshipType: defaults?.relationshipType || 'provides_data_to',
    reason: defaults?.reason || 'Canvas connection created by builder',
    sourceOutputRole: defaults?.sourceOutputRole,
    targetInputRole: defaults?.targetInputRole,
    bindingLabel: defaults?.bindingLabel,
    bindingStatus: defaults?.bindingStatus || 'missing',
    confidence: 1,
  });
}

export function createWorkflowDefinitionFromCanvas({
  description,
  edges,
  existing,
  name,
  nodes,
  status,
}: {
  name: string;
  description?: string;
  nodes: WorkflowNode[];
  edges: CanvasWorkflowEdge[];
  status?: WorkflowDefinitionStatus;
  existing?: WorkflowDefinition | null;
}): WorkflowDefinition {
  const now = new Date().toISOString();
  const blocks = nodes
    .filter(
      (node) =>
        node.type !== 'add' && Boolean(node.data.block) && !node.data.config?.blockCandidate,
    )
    .map(canvasNodeToWorkflowBlock);
  const blockMap = new Map(blocks.map((block) => [block.id, block]));
  const workflowEdges = edges
    .filter((edge) => blockMap.has(edge.source) && blockMap.has(edge.target))
    .map((edge) => canvasEdgeToWorkflowEdge(edge, blockMap));
  const structure = getWorkflowStructure(blocks);
  const runtimeUiConfig = generateRuntimeUiConfigFromParts({
    blocks,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
    structure,
  });
  const outputMappingPreview = generateOutputMappingPreviewFromParts({
    blocks,
    edges: workflowEdges,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
  });

  return {
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    id: LOCAL_WORKFLOW_ID,
    name: name || existing?.name || 'Fiscal Workflow Studio',
    description:
      description || existing?.description || 'Local prototype workflow stored in this browser.',
    status: status || existing?.status || 'draft',
    metadata: {
      kind: 'generic-fiscal-workflow',
      sampleWorkflow: existing?.metadata.sampleWorkflow,
      tags: existing?.metadata.tags || ['local', 'prototype'],
      createdBy: existing?.metadata.createdBy || SYSTEM_USER,
      createdAt: existing?.metadata.createdAt || now,
      updatedBy: SYSTEM_USER,
      updatedAt: now,
      notes: existing?.metadata.notes,
    },
    blocks,
    edges: workflowEdges,
    structure,
    runtimeUiConfig,
    outputMappingPreview,
    mockRuns: existing?.mockRuns || [],
    versionSnapshots: existing?.versionSnapshots || [],
    latestPublishedVersionId: existing?.latestPublishedVersionId,
    publishedVersion: existing?.publishedVersion,
    aiProposals: existing?.aiProposals || [],
    events: existing?.events || [],
  };
}
