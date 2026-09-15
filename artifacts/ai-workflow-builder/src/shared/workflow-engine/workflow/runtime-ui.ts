import {
  type WorkflowBlock,
  type RuntimeUiRow,
  type WorkflowStructure,
  type RuntimeUiConfig,
  type WorkflowDefinition,
  type WorkflowEdge,
  type OutputMappingPreviewItem,
  isGovernedOutputRelationshipType,
  isCandidateOutputRelationshipType,
  type OutputMappingPreview,
  isOutputMappingRelationshipType,
  LOGIC_OUTPUT_GOVERNANCE_WARNING,
} from './contracts';

function getRuntimeAudience(block: WorkflowBlock) {
  return String(block.config.runtimeAudience || block.config.visibility || '');
}

function getAllowedRuntimeActions(block: WorkflowBlock): string[] {
  if (block.family === 'Source') {
    return ['view_source_trace', 'create_downstream_logic'];
  }
  if (block.family === 'Field') {
    return ['view_result', 'view_trace'];
  }
  if (block.family === 'Output') {
    return ['preview_output', 'mock_download'];
  }
  if (block.family === 'Review / Validation') {
    return ['view_check_result', 'mock_sign_off'];
  }
  if (block.family === 'AI / Agent') {
    return ['view_proposal'];
  }
  return ['view_result'];
}

function createRuntimeUiRow(block: WorkflowBlock): RuntimeUiRow {
  const audience = getRuntimeAudience(block);
  const sourceReadOnly = block.family === 'Source';

  return {
    id: `runtime-row-${block.id}`,
    blockId: block.id,
    label: block.label,
    family: block.family,
    subtype: block.subtype,
    visible: block.runtime.visible,
    readOnly: sourceReadOnly || !block.runtime.editableInRuntime || block.family === 'Logic',
    locked: block.runtime.generatedUiLocked,
    reviewerOnly: audience === 'reviewer-only',
    advancedOnly: audience === 'advanced-only',
    sourceReadOnly,
    protectedLocked: false,
    outputKey: block.runtime.outputKey,
    allowedActions: getAllowedRuntimeActions(block),
  };
}

export function generateRuntimeUiConfigFromParts({
  blocks,
  generatedAt = new Date().toISOString(),
  sourceSnapshotId,
  sourceWorkflowId,
  structure,
}: {
  blocks: WorkflowBlock[];
  generatedAt?: string;
  sourceSnapshotId?: string;
  sourceWorkflowId: string;
  structure: WorkflowStructure;
}): RuntimeUiConfig {
  const blockMap = new Map(blocks.map((block) => [block.id, block]));
  const sections = structure.columns.map((column) => ({
    id: `runtime-section-${column.id}`,
    label: column.label,
    family: column.family,
    rows: column.blockIds
      .map((blockId) => blockMap.get(blockId))
      .filter((block): block is WorkflowBlock => Boolean(block))
      .map(createRuntimeUiRow),
  }));
  const rows = sections.flatMap((section) => section.rows);

  return {
    runtimeConfigId: `runtime-config-${sourceSnapshotId || sourceWorkflowId}`,
    sourceWorkflowId,
    sourceSnapshotId,
    generatedAt,
    sections,
    visibleRows: rows.filter((row) => row.visible).map((row) => row.blockId),
    hiddenRows: rows.filter((row) => !row.visible).map((row) => row.blockId),
    reviewerOnlyRows: rows.filter((row) => row.reviewerOnly).map((row) => row.blockId),
    advancedRows: rows.filter((row) => row.advancedOnly).map((row) => row.blockId),
    allowedActions: [
      'view_read_only_sources',
      'view_locked_protected_fields',
      'preview_outputs',
      'run_mock_only',
    ],
  };
}

export function generateRuntimeUiConfig(
  definition: WorkflowDefinition,
  sourceSnapshotId?: string,
): RuntimeUiConfig {
  return generateRuntimeUiConfigFromParts({
    blocks: definition.blocks,
    sourceSnapshotId,
    sourceWorkflowId: definition.id,
    structure: definition.structure,
  });
}

function getActiveGovernedOutputMappings(
  outputEdges: WorkflowEdge[],
  blockMap: Map<string, WorkflowBlock>,
): OutputMappingPreviewItem['mappedProtectedValues'] {
  return outputEdges
    .filter((edge) => edge.status === 'active')
    .map((edge) => {
      const protectedBlock = blockMap.get(edge.sourceBlockId);
      if (
        protectedBlock?.family !== 'Field' ||
        !isGovernedOutputRelationshipType(edge.relationshipType)
      ) {
        return null;
      }

      return {
        edgeId: edge.id,
        protectedBlockId: protectedBlock.id,
        protectedLabel: protectedBlock.label,
        relationshipType: edge.relationshipType,
      };
    })
    .filter((item): item is OutputMappingPreviewItem['mappedProtectedValues'][number] =>
      Boolean(item),
    );
}

function getActiveCandidateOutputMappings(
  outputEdges: WorkflowEdge[],
  blockMap: Map<string, WorkflowBlock>,
): OutputMappingPreviewItem['candidateLogicMappings'] {
  return outputEdges
    .filter((edge) => edge.status === 'active')
    .map((edge) => {
      const logicBlock = blockMap.get(edge.sourceBlockId);
      if (
        logicBlock?.family !== 'Logic' ||
        !isCandidateOutputRelationshipType(edge.relationshipType)
      ) {
        return null;
      }

      return {
        edgeId: edge.id,
        logicBlockId: logicBlock.id,
        logicLabel: logicBlock.label,
        relationshipType: edge.relationshipType,
      };
    })
    .filter((item): item is OutputMappingPreviewItem['candidateLogicMappings'][number] =>
      Boolean(item),
    );
}

function getOutputReadinessStatus({
  candidateMappingCount,
  governedMappingCount,
  ignoredRelationshipCount,
}: {
  governedMappingCount: number;
  candidateMappingCount: number;
  ignoredRelationshipCount: number;
}): OutputMappingPreviewItem['readinessStatus'] {
  if (governedMappingCount > 0 && candidateMappingCount === 0) {
    return ignoredRelationshipCount === 0 ? 'ready' : 'warning';
  }

  if (governedMappingCount > 0 || candidateMappingCount > 0) {
    return 'warning';
  }

  return ignoredRelationshipCount > 0 ? 'warning' : 'missing';
}

export function generateOutputMappingPreviewFromParts({
  blocks,
  edges,
  generatedAt = new Date().toISOString(),
  sourceSnapshotId,
  sourceWorkflowId,
}: {
  blocks: WorkflowBlock[];
  edges: WorkflowEdge[];
  generatedAt?: string;
  sourceSnapshotId?: string;
  sourceWorkflowId: string;
}): OutputMappingPreview {
  const blockMap = new Map(blocks.map((block) => [block.id, block]));
  const outputBlocks = blocks.filter((block) => block.family === 'Output');
  const outputs = outputBlocks.map((outputBlock) => {
    const outputEdges = edges.filter(
      (edge) =>
        edge.targetBlockId === outputBlock.id &&
        isOutputMappingRelationshipType(edge.relationshipType),
    );
    const activeGovernedMappings = getActiveGovernedOutputMappings(outputEdges, blockMap);
    const activeCandidateMappings = getActiveCandidateOutputMappings(outputEdges, blockMap);

    const ignoredRelationshipCount =
      outputEdges.length - activeGovernedMappings.length - activeCandidateMappings.length;
    const governanceWarnings =
      activeCandidateMappings.length > 0 ? [LOGIC_OUTPUT_GOVERNANCE_WARNING] : [];
    const missingRequirements = [
      outputEdges.length === 0 ? 'No output mapping relationship' : '',
      activeGovernedMappings.length === 0 ? 'No active Protected value mapping' : '',
      activeGovernedMappings.length === 0 && activeCandidateMappings.length === 0
        ? 'No active output input mapping'
        : '',
    ].filter(Boolean);
    const readinessStatus = getOutputReadinessStatus({
      candidateMappingCount: activeCandidateMappings.length,
      governedMappingCount: activeGovernedMappings.length,
      ignoredRelationshipCount,
    });

    return {
      outputBlockId: outputBlock.id,
      outputLabel: outputBlock.label,
      outputSubtype: outputBlock.subtype,
      readinessStatus,
      mappedProtectedValues: activeGovernedMappings,
      candidateLogicMappings: activeCandidateMappings,
      governanceWarnings,
      ignoredRelationshipCount,
      missingRequirements,
      includedSourceTraceSetting: String(
        outputBlock.config.sourceTraceSetting || 'include summary',
      ),
      mockPayloadPreview: {
        mockOnly: true,
        outputSubtype: outputBlock.subtype,
        mappedValues: activeGovernedMappings.map((mapping) => mapping.protectedLabel),
        candidateLogicInputs: activeCandidateMappings.map((mapping) => mapping.logicLabel),
        noLiveExport: true,
      },
    };
  });

  return {
    id: `output-mapping-${sourceSnapshotId || sourceWorkflowId}`,
    sourceWorkflowId,
    sourceSnapshotId,
    generatedAt,
    outputs,
  };
}

export function generateOutputMappingPreview(
  definition: WorkflowDefinition,
  sourceSnapshotId?: string,
): OutputMappingPreview {
  return generateOutputMappingPreviewFromParts({
    blocks: definition.blocks,
    edges: definition.edges,
    sourceSnapshotId,
    sourceWorkflowId: definition.id,
  });
}
