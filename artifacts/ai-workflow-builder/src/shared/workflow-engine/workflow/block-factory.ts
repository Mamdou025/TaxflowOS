import type { WorkflowNode, WorkflowNodeType } from '@/shared/workflow-engine/state/workflow-store';
import { SourceMetadataSchema } from '@workspace/workflow-contracts/generated-schemas';
import {
  type BlockFamily,
  type RuntimeVisibility,
  type BlockCatalogItem,
  type SourceMetadata,
  type GovernanceMetadata,
  type BlockSubtype,
  type WorkflowFormulaField,
  type WorkflowCodeField,
  type WorkflowPosition,
  type BlockStatus,
  type WorkflowBlock,
  BLOCK_FAMILY_STAGE,
  SYSTEM_USER,
  type PendingWorkflowConnection,
} from './contracts';
import {
  getBlockCatalogItem,
  getDefaultCatalogItemForFamily,
  getFiscalVisualForFamily,
} from './visuals';

function getRuntimeDefaults(family: BlockFamily, outputKey: string): RuntimeVisibility {
  return {
    visible: true,
    editableInRuntime: false,
    generatedUiLocked: family === 'Source',
    masked: false,
    showInRuns: true,
    outputKey,
  };
}

function getSourceMetadata(
  item: BlockCatalogItem,
  config: Record<string, unknown>,
): SourceMetadata | undefined {
  if (item.family !== 'Source') {
    return;
  }

  return SourceMetadataSchema.parse({
    sourceType: item.subtype,
    locator: String(config.sourceLocator || item.defaultConfig.sourceLocator),
    valuePreview: typeof config.valuePreview === 'string' ? config.valuePreview : undefined,
    immutable: true,
    treatedAsEvidence: true,
    labelLocked: true,
    locatorLocked: true,
    valuesLocked: true,
  });
}

function getGovernanceMetadata(
  _item: BlockCatalogItem,
  _config: Record<string, unknown>,
): GovernanceMetadata | undefined {
  return undefined;
}

function getFormulaForSubtype(
  subtype: BlockSubtype,
  config: Record<string, unknown>,
): WorkflowFormulaField | undefined {
  if (subtype !== 'Formula') {
    return;
  }

  return {
    expression: String(config.formula || 'upstreamValue'),
    outputKey: String(config.outputs || 'formulaResult'),
    inputs: String(config.inputs || 'upstreamValue')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  };
}

function getCodeForSubtype(
  subtype: BlockSubtype,
  config: Record<string, unknown>,
): WorkflowCodeField | undefined {
  if (subtype !== 'Script' && subtype !== 'Condition') {
    return;
  }

  return {
    language: 'typescript',
    body: String(
      config.code || (subtype === 'Condition' ? 'return Boolean(input.ready);' : 'return input;'),
    ),
    entrypoint: subtype === 'Condition' ? 'evaluateCondition' : 'runScript',
  };
}

export function createWorkflowBlockFromCatalog(
  catalogId: string,
  options: {
    id?: string;
    label?: string;
    description?: string;
    position?: WorkflowPosition;
    config?: Record<string, unknown>;
    status?: BlockStatus;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
    sample?: boolean;
  } = {},
): WorkflowBlock {
  const item = getBlockCatalogItem(catalogId) || getDefaultCatalogItemForFamily('Logic');
  const stage = BLOCK_FAMILY_STAGE[item.family];
  const config: Record<string, unknown> = {
    ...item.defaultConfig,
    ...options.config,
    fiscalStage: stage,
    blockFamily: item.family,
    blockSubtype: item.subtype,
    catalogId: item.id,
  };
  const outputKey = String(config.outputs || item.defaultConfig.outputs);

  return {
    id: options.id || item.id.replace(':', '-'),
    family: item.family,
    subtype: item.subtype,
    label: options.label || item.label,
    description: options.description || item.description,
    status: options.status || 'configured',
    position: options.position || { x: 0, y: 0 },
    config,
    code: getCodeForSubtype(item.subtype, config),
    formula: getFormulaForSubtype(item.subtype, config),
    source: getSourceMetadata(item, config),
    governance: getGovernanceMetadata(item, config),
    runtime: getRuntimeDefaults(item.family, outputKey),
    catalogId: item.id,
    sample: options.sample,
    createdBy: options.createdBy || SYSTEM_USER,
    createdAt: options.createdAt || new Date().toISOString(),
    updatedBy: options.updatedBy || options.createdBy || SYSTEM_USER,
    updatedAt: options.updatedAt || new Date().toISOString(),
  };
}

export function createWorkflowNodeFromBlock(
  block: WorkflowBlock,
  options: { selected?: boolean; type?: WorkflowNodeType } = {},
): WorkflowNode {
  const visual = getFiscalVisualForFamily(block.family);
  const nodeType =
    options.type || ((block.config.canvasNodeType as WorkflowNodeType | undefined) ?? 'action');

  return {
    id: block.id,
    type: nodeType,
    position: block.position,
    selected: options.selected,
    data: {
      label: block.label,
      description: block.description,
      type: nodeType,
      visualLevel: visual.visualLevel,
      visualRole: visual.visualRole,
      config: block.config,
      status: block.status === 'running' ? 'running' : 'idle',
      block,
    },
  };
}

export function createDefaultWorkflowBlockCandidate({
  id,
  pendingConnection,
  position,
}: {
  id: string;
  pendingConnection?: PendingWorkflowConnection;
  position: WorkflowPosition;
}): WorkflowNode {
  return {
    id,
    type: 'action',
    position,
    data: {
      label: 'New Block',
      description: 'Choose a typed block from the catalog',
      type: 'action',
      config: {
        blockCandidate: true,
        pendingConnection,
      },
      status: 'idle',
    },
    selected: true,
  };
}
