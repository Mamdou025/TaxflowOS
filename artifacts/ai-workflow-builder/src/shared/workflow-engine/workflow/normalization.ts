import {
  type WorkflowBlock,
  type WorkflowEdge,
  SYSTEM_USER,
  type AiProposalHistoryEntry,
  type AiProposal,
  type WorkflowEvent,
  WORKFLOW_EVENT_TYPES,
  type WorkflowEventType,
  type WorkflowVersionSnapshot,
  type WorkflowDefinition,
  type BlockRun,
  type WorkflowStructure,
  LOCAL_WORKFLOW_SCHEMA_VERSION,
  LOCAL_WORKFLOW_ID,
} from './contracts';
import { normalizeWorkflowEdgeRecord, getWorkflowStructure } from './canvas';
import {
  getWorkflowRelationshipForValue,
  getEdgeBindingStatusFromValue,
  getEdgeStatusFromValue,
  getAiProposalStatusFromValue,
} from './edges';
import {
  getBlockCatalogItem,
  getBlockCatalogItemBySubtype,
  getDefaultCatalogItemForFamily,
} from './visuals';
import { createWorkflowBlockFromCatalog } from './block-factory';
import {
  generateRuntimeUiConfigFromParts,
  generateOutputMappingPreviewFromParts,
} from './runtime-ui';
import { cloneJson, createWorkflowEvent } from './events';

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Import migration normalizes old and current edge shapes in one place.
function getTypedEdgeFromUnknown(
  value: unknown,
  blockMap?: Map<string, WorkflowBlock>,
): WorkflowEdge | null {
  if (!(typeof value === 'object' && value !== null)) {
    return null;
  }
  const edge = value as Partial<WorkflowEdge>;
  if (!(edge.sourceBlockId && edge.targetBlockId)) {
    return null;
  }

  const sourceBlock = blockMap?.get(edge.sourceBlockId);
  const targetBlock = blockMap?.get(edge.targetBlockId);
  const migratedMetadata = !(
    edge.relationshipType &&
    edge.status &&
    edge.createdAt &&
    edge.createdBy &&
    Array.isArray(edge.history) &&
    edge.history.length > 0
  );
  const edgeId = edge.id || `edge-${edge.sourceBlockId}-${edge.targetBlockId}`;
  const createdAt = edge.createdAt || new Date().toISOString();
  return normalizeWorkflowEdgeRecord({
    edge: {
      id: edgeId,
      sourceBlockId: edge.sourceBlockId,
      targetBlockId: edge.targetBlockId,
      relationshipType: getWorkflowRelationshipForValue({
        sourceBlock,
        targetBlock,
        value: edge.relationshipType,
      }),
      reason: edge.reason || 'Imported relationship',
      ...(typeof edge.sourceOutputRole === 'string'
        ? { sourceOutputRole: edge.sourceOutputRole }
        : {}),
      ...(typeof edge.targetInputRole === 'string'
        ? { targetInputRole: edge.targetInputRole }
        : {}),
      ...(typeof edge.bindingLabel === 'string' ? { bindingLabel: edge.bindingLabel } : {}),
      bindingStatus: getEdgeBindingStatusFromValue(edge.bindingStatus),
      status: getEdgeStatusFromValue(edge.status),
      createdBy: edge.createdBy || SYSTEM_USER,
      createdAt,
      confidence: typeof edge.confidence === 'number' ? edge.confidence : 1,
      notes: edge.notes || '',
      history:
        Array.isArray(edge.history) && edge.history.length > 0
          ? edge.history
          : [
              {
                id: `${edgeId}-metadata-migrated`,
                action: 'migrated',
                by: SYSTEM_USER,
                at: createdAt,
                notes: migratedMetadata
                  ? 'Imported edge metadata was completed with local defaults.'
                  : 'Imported edge normalized for local Workflow Studio.',
              },
            ],
    },
    sourceBlock,
    targetBlock,
  });
}

function normalizeAiGeneratedBlock(value: unknown, index: number): WorkflowBlock | null {
  if (!(typeof value === 'object' && value !== null)) {
    return null;
  }

  const block = value as Partial<WorkflowBlock>;
  const family = block.family || 'Logic';
  const item =
    (block.catalogId ? getBlockCatalogItem(block.catalogId) : undefined) ||
    getBlockCatalogItemBySubtype(block.subtype) ||
    getDefaultCatalogItemForFamily(family);
  const createdBlock = createWorkflowBlockFromCatalog(item.id, {
    id: block.id || `ai-proposed-block-${index + 1}`,
    label: block.label || item.label,
    description: block.description || item.description,
    position: block.position || { x: index * 260, y: 0 },
    config: block.config,
    status: block.status,
    createdAt: block.createdAt,
    updatedAt: block.updatedAt,
    createdBy: block.createdBy,
    updatedBy: block.updatedBy,
    sample: block.sample,
  });

  return {
    ...createdBlock,
    ...block,
    config: { ...createdBlock.config, ...block.config },
    runtime: { ...createdBlock.runtime, ...block.runtime },
    source: block.source || createdBlock.source,
    governance: block.governance || createdBlock.governance,
  };
}

function normalizeAiProposalHistory(
  proposalId: string,
  value: unknown,
  createdAt: string,
  createdBy: string,
): AiProposalHistoryEntry[] {
  if (Array.isArray(value)) {
    const entries = value
      .map((entry): AiProposalHistoryEntry | null => {
        if (!(typeof entry === 'object' && entry !== null)) {
          return null;
        }
        const item = entry as Partial<AiProposalHistoryEntry>;
        if (!(
          item.action && ['created', 'revised', 'approved', 'rejected'].includes(item.action)
        )) {
          return null;
        }

        return {
          id: item.id || `${proposalId}-history-${Date.now()}`,
          action: item.action,
          by: item.by || createdBy,
          at: item.at || createdAt,
          notes: item.notes,
        };
      })
      .filter((entry): entry is AiProposalHistoryEntry => entry !== null);

    if (entries.length > 0) {
      return entries;
    }
  }

  return [
    {
      id: `${proposalId}-created`,
      action: 'created',
      by: createdBy,
      at: createdAt,
      notes: 'Imported AI proposal history was completed locally.',
    },
  ];
}

function normalizeGeneratedCodeOrFormulas(value: unknown): AiProposal['generatedCodeOrFormulas'] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!(typeof item === 'object' && item !== null)) {
        return null;
      }
      const generated = item as Partial<AiProposal['generatedCodeOrFormulas'][number]>;
      if (!(
        generated.blockId &&
        generated.value &&
        (generated.kind === 'code' || generated.kind === 'formula')
      )) {
        return null;
      }

      return {
        blockId: generated.blockId,
        kind: generated.kind,
        value: generated.value,
      };
    })
    .filter((item): item is AiProposal['generatedCodeOrFormulas'][number] => item !== null);
}

function normalizeAiProposal(
  value: unknown,
  index: number,
  blockMap?: Map<string, WorkflowBlock>,
): AiProposal | null {
  if (!(typeof value === 'object' && value !== null)) {
    return null;
  }

  const proposal = value as Partial<AiProposal>;
  const createdAt = proposal.createdAt || new Date().toISOString();
  const createdBy = proposal.createdBy || SYSTEM_USER;
  const id = proposal.id || `ai-proposal-imported-${index + 1}-${Date.now()}`;
  const generatedBlocks = Array.isArray(proposal.generatedBlocks)
    ? proposal.generatedBlocks
        .map((block, blockIndex) => normalizeAiGeneratedBlock(block, blockIndex))
        .filter((block): block is WorkflowBlock => Boolean(block))
    : [];
  const proposalBlockMap = new Map(blockMap);
  for (const block of generatedBlocks) {
    proposalBlockMap.set(block.id, block);
  }
  const generatedEdges = Array.isArray(proposal.generatedEdges)
    ? proposal.generatedEdges
        .map((edge) => getTypedEdgeFromUnknown(edge, proposalBlockMap))
        .filter((edge): edge is WorkflowEdge => Boolean(edge))
    : [];

  return {
    id,
    title: proposal.title || `AI proposal ${index + 1}`,
    originalPrompt: proposal.originalPrompt || 'Imported local AI proposal.',
    interpretedPlan:
      proposal.interpretedPlan || 'Review imported proposal details before approval.',
    selectedTools: Array.isArray(proposal.selectedTools)
      ? proposal.selectedTools.filter((tool): tool is string => typeof tool === 'string')
      : ['local mock assistant'],
    generatedBlocks,
    generatedEdges,
    generatedCodeOrFormulas: normalizeGeneratedCodeOrFormulas(proposal.generatedCodeOrFormulas),
    status: getAiProposalStatusFromValue(proposal.status),
    approvalResult: proposal.approvalResult,
    rejectionResult: proposal.rejectionResult,
    createdAt,
    createdBy,
    relatedSelectedBlockId: proposal.relatedSelectedBlockId,
    relatedSelectedEdgeId: proposal.relatedSelectedEdgeId,
    confidence: typeof proposal.confidence === 'number' ? proposal.confidence : undefined,
    notes: proposal.notes,
    history: normalizeAiProposalHistory(id, proposal.history, createdAt, createdBy),
  };
}

function normalizeWorkflowEvent(value: unknown): WorkflowEvent | null {
  if (!(typeof value === 'object' && value !== null)) {
    return null;
  }

  const event = value as Partial<WorkflowEvent>;
  if (!(
    event.type &&
    WORKFLOW_EVENT_TYPES.includes(event.type as WorkflowEventType) &&
    event.message
  )) {
    return null;
  }

  return {
    id: event.id || `event-imported-${Date.now()}`,
    type: event.type as WorkflowEventType,
    message: event.message,
    createdAt: event.createdAt || new Date().toISOString(),
    createdBy: event.createdBy || SYSTEM_USER,
    details: event.details,
  };
}

function getPublishedVersionReference(
  snapshots: WorkflowVersionSnapshot[],
): WorkflowDefinition['publishedVersion'] {
  const latest = snapshots
    .filter((snapshot) => snapshot.status === 'published')
    .sort((a, b) => b.versionNumber - a.versionNumber)[0];

  if (!latest) {
    return;
  }

  return {
    id: latest.id,
    versionNumber: latest.versionNumber,
    createdAt: latest.createdAt,
  };
}

function normalizeVersionSnapshots({
  aiProposals,
  blocks,
  edges,
  mockRuns,
  snapshots,
  structure,
  workflowId,
  workflowName,
}: {
  aiProposals: AiProposal[];
  blocks: WorkflowBlock[];
  edges: WorkflowEdge[];
  mockRuns: BlockRun[];
  snapshots: Partial<WorkflowVersionSnapshot>[] | undefined;
  structure: WorkflowStructure;
  workflowId: string;
  workflowName: string;
}): WorkflowVersionSnapshot[] {
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Snapshot migration fills many optional v1 fields from older local exports.
  return (snapshots || []).map((snapshot, index) => {
    const versionNumber = snapshot.versionNumber || index + 1;
    const snapshotId = snapshot.id || `snapshot-imported-v${versionNumber}-${Date.now()}`;
    const snapshotBlocks = snapshot.blocks || blocks;
    const snapshotEdges = snapshot.edges || edges;
    const snapshotStructure = snapshot.structure || structure;
    const runtimeUiConfig =
      snapshot.runtimeUiConfig ||
      generateRuntimeUiConfigFromParts({
        blocks: snapshotBlocks,
        sourceSnapshotId: snapshotId,
        sourceWorkflowId: workflowId,
        structure: snapshotStructure,
      });
    const outputMappingPreview = generateOutputMappingPreviewFromParts({
      blocks: snapshotBlocks,
      edges: snapshotEdges,
      generatedAt:
        snapshot.outputMappingPreview?.generatedAt ||
        snapshot.createdAt ||
        new Date().toISOString(),
      sourceSnapshotId: snapshotId,
      sourceWorkflowId: workflowId,
    });
    const snapshotBlockMap = new Map<string, WorkflowBlock>(
      snapshotBlocks.map((block) => [block.id, block]),
    );
    const snapshotAiProposals = ((snapshot.aiProposals as unknown[] | undefined) || aiProposals)
      .map((proposal, proposalIndex) =>
        normalizeAiProposal(proposal, proposalIndex, snapshotBlockMap),
      )
      .filter((proposal): proposal is AiProposal => Boolean(proposal));

    return {
      id: snapshotId,
      schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
      workflowId: snapshot.workflowId || workflowId,
      workflowName: snapshot.workflowName || workflowName,
      versionNumber,
      label: snapshot.label || `Imported version ${versionNumber}`,
      status: snapshot.status || 'draft',
      createdBy: snapshot.createdBy || SYSTEM_USER,
      createdAt: snapshot.createdAt || new Date().toISOString(),
      changeSummary: snapshot.changeSummary || 'Imported version snapshot.',
      blockCount: snapshot.blockCount || snapshotBlocks.length,
      edgeCount: snapshot.edgeCount || snapshotEdges.length,
      blockIds: snapshot.blockIds || snapshotBlocks.map((block) => block.id),
      edgeIds: snapshot.edgeIds || snapshotEdges.map((edge) => edge.id),
      blocks: cloneJson(snapshotBlocks),
      edges: cloneJson(snapshotEdges),
      structure: cloneJson(snapshotStructure),
      runtimeUiConfig: cloneJson(runtimeUiConfig),
      outputMappingPreview: cloneJson(outputMappingPreview),
      aiProposals: cloneJson(snapshotAiProposals),
      mockRuns: cloneJson(snapshot.mockRuns || mockRuns),
      notes: snapshot.notes,
      validationWarnings: snapshot.validationWarnings || [],
    };
  });
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Local import migration intentionally handles typed and older partial schemas together.
export function normalizeWorkflowDefinition(
  parsed: Partial<WorkflowDefinition>,
): WorkflowDefinition {
  const now = new Date().toISOString();
  const blocks = (parsed.blocks || []).map((block, index) => {
    const family = block.family || 'Logic';
    const item =
      (block.catalogId ? getBlockCatalogItem(block.catalogId) : undefined) ||
      getBlockCatalogItemBySubtype(block.subtype) ||
      getDefaultCatalogItemForFamily(family);
    const createdBlock = createWorkflowBlockFromCatalog(item.id, {
      id: block.id || `block-${index + 1}`,
      label: block.label || item.label,
      description: block.description || item.description,
      position: block.position || { x: index * 260, y: 0 },
      config: block.config,
      status: block.status,
      createdAt: block.createdAt,
      updatedAt: block.updatedAt || now,
      createdBy: block.createdBy,
      updatedBy: block.updatedBy,
      sample: block.sample,
    });

    return {
      ...createdBlock,
      ...block,
      config: { ...createdBlock.config, ...block.config },
      runtime: { ...createdBlock.runtime, ...block.runtime },
      source: block.source || createdBlock.source,
      governance: block.governance || createdBlock.governance,
    };
  });
  const blockMap = new Map(blocks.map((block) => [block.id, block]));
  const edges = (parsed.edges || [])
    .map((edge) => getTypedEdgeFromUnknown(edge, blockMap))
    .filter((edge): edge is WorkflowEdge => Boolean(edge));
  const structure = parsed.structure || getWorkflowStructure(blocks);
  const runtimeUiConfig =
    parsed.runtimeUiConfig ||
    generateRuntimeUiConfigFromParts({
      blocks,
      sourceWorkflowId: LOCAL_WORKFLOW_ID,
      structure,
    });
  const outputMappingPreview = generateOutputMappingPreviewFromParts({
    blocks,
    edges,
    generatedAt: parsed.outputMappingPreview?.generatedAt,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
  });
  const aiProposals = ((parsed.aiProposals as unknown[] | undefined) || [])
    .map((proposal, index) => normalizeAiProposal(proposal, index, blockMap))
    .filter((proposal): proposal is AiProposal => Boolean(proposal));
  const mockRuns = parsed.mockRuns || [];
  const versionSnapshots = normalizeVersionSnapshots({
    aiProposals,
    blocks,
    edges,
    mockRuns,
    snapshots: parsed.versionSnapshots,
    structure,
    workflowId: LOCAL_WORKFLOW_ID,
    workflowName: parsed.name || 'Imported Fiscal Workflow',
  });
  const publishedVersion =
    parsed.publishedVersion || getPublishedVersionReference(versionSnapshots);

  return {
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    id: LOCAL_WORKFLOW_ID,
    name: parsed.name || 'Imported Fiscal Workflow',
    description: parsed.description || 'Imported local workflow.',
    status: parsed.status || 'draft',
    metadata: {
      kind: 'generic-fiscal-workflow',
      sampleWorkflow: parsed.metadata?.sampleWorkflow,
      tags: parsed.metadata?.tags || ['imported', 'local'],
      createdBy: parsed.metadata?.createdBy || SYSTEM_USER,
      createdAt: parsed.metadata?.createdAt || now,
      updatedBy: SYSTEM_USER,
      updatedAt: now,
      notes: parsed.metadata?.notes,
    },
    blocks,
    edges,
    structure,
    runtimeUiConfig,
    outputMappingPreview,
    mockRuns,
    versionSnapshots,
    latestPublishedVersionId: parsed.latestPublishedVersionId || publishedVersion?.id,
    publishedVersion,
    aiProposals,
    events: [
      ...((parsed.events || [])
        .map(normalizeWorkflowEvent)
        .filter((event): event is WorkflowEvent => Boolean(event)) || []),
      ...(parsed.schemaVersion !== LOCAL_WORKFLOW_SCHEMA_VERSION
        ? [
            createWorkflowEvent({
              type: 'migration',
              message: 'Imported workflow was migrated to the local v1 schema.',
            }),
          ]
        : []),
    ],
  };
}
