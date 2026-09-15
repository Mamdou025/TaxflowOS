import type {
  WorkflowEdge as CanvasWorkflowEdge,
  WorkflowNode,
} from '@/shared/workflow-engine/state/workflow-store';
import {
  type WorkflowBlock,
  type WorkflowDefinition,
  type OutputMappingPreview,
  isOutputMappingRelationshipType,
  isCandidateOutputRelationshipType,
  LOGIC_OUTPUT_GOVERNANCE_WARNING,
  type WorkflowVersionSnapshot,
  LOCAL_WORKFLOW_SCHEMA_VERSION,
  SYSTEM_USER,
} from './contracts';
import { getWorkflowStructure, createWorkflowDefinitionFromCanvas } from './canvas';
import {
  generateRuntimeUiConfigFromParts,
  generateOutputMappingPreviewFromParts,
} from './runtime-ui';
import { cloneJson, appendWorkflowEvent, createWorkflowEvent } from './events';
import { readStoredWorkflowDefinition, saveWorkflowDefinitionSnapshot } from './storage';

function lockProtectedBlocksForRuntime(blocks: WorkflowBlock[]): WorkflowBlock[] {
  return blocks;
}

function validateLocalPublish({
  definition,
  outputMappingPreview,
}: {
  definition: WorkflowDefinition;
  outputMappingPreview: OutputMappingPreview;
}): string[] {
  const warnings: string[] = [];
  if (definition.blocks.length === 0) {
    warnings.push('Workflow has no typed blocks.');
  }

  const outputBlocks = definition.blocks.filter((block) => block.family === 'Output');
  if (outputBlocks.length === 0) {
    warnings.push('No Output blocks are represented in the workflow.');
  }

  const blockIds = new Set(definition.blocks.map((block) => block.id));
  const invalidEdges = definition.edges.filter(
    (edge) => !(blockIds.has(edge.sourceBlockId) && blockIds.has(edge.targetBlockId)),
  );
  if (invalidEdges.length > 0) {
    warnings.push(`${invalidEdges.length} relationship(s) reference missing blocks.`);
  }

  const proposedOutputEdges = definition.edges.filter(
    (edge) => edge.status !== 'active' && isOutputMappingRelationshipType(edge.relationshipType),
  );
  if (proposedOutputEdges.length > 0) {
    warnings.push(
      'Proposed, rejected, or disabled output mapping relationships were excluded from readiness.',
    );
  }

  const candidateLogicOutputEdges = definition.edges.filter(
    (edge) => edge.status === 'active' && isCandidateOutputRelationshipType(edge.relationshipType),
  );
  if (candidateLogicOutputEdges.length > 0) {
    warnings.push(LOGIC_OUTPUT_GOVERNANCE_WARNING);
  }

  for (const output of outputMappingPreview.outputs) {
    if (output.readinessStatus !== 'ready') {
      warnings.push(
        `${output.outputLabel} is ${output.readinessStatus}: ${output.missingRequirements.join(', ')}`,
      );
    }
  }

  return warnings;
}

export function publishWorkflowDefinition(
  definition: WorkflowDefinition,
  options: { notes?: string } = {},
): {
  snapshot: WorkflowVersionSnapshot;
  workflow: WorkflowDefinition;
  warnings: string[];
} {
  const now = new Date().toISOString();
  const lockedBlocks = lockProtectedBlocksForRuntime(definition.blocks);
  const structure = getWorkflowStructure(lockedBlocks);
  const nextVersionNumber =
    Math.max(0, ...definition.versionSnapshots.map((item) => item.versionNumber)) + 1;
  const snapshotId = `version-${definition.id}-v${nextVersionNumber}-${Date.now()}`;
  const runtimeUiConfig = generateRuntimeUiConfigFromParts({
    blocks: lockedBlocks,
    generatedAt: now,
    sourceSnapshotId: snapshotId,
    sourceWorkflowId: definition.id,
    structure,
  });
  const outputMappingPreview = generateOutputMappingPreviewFromParts({
    blocks: lockedBlocks,
    edges: definition.edges,
    generatedAt: now,
    sourceSnapshotId: snapshotId,
    sourceWorkflowId: definition.id,
  });
  const workflowForValidation: WorkflowDefinition = {
    ...definition,
    blocks: lockedBlocks,
    outputMappingPreview,
    runtimeUiConfig,
    status: 'published',
    structure,
  };
  const warnings = validateLocalPublish({
    definition: workflowForValidation,
    outputMappingPreview,
  });
  const snapshot: WorkflowVersionSnapshot = {
    id: snapshotId,
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    workflowId: definition.id,
    workflowName: definition.name,
    versionNumber: nextVersionNumber,
    label: `Published v${nextVersionNumber}`,
    status: 'published',
    createdBy: SYSTEM_USER,
    createdAt: now,
    changeSummary:
      options.notes ||
      `Local publish frozen with ${lockedBlocks.length} blocks and ${definition.edges.length} relationships.`,
    blockCount: lockedBlocks.length,
    edgeCount: definition.edges.length,
    blockIds: lockedBlocks.map((block) => block.id),
    edgeIds: definition.edges.map((edge) => edge.id),
    blocks: cloneJson(lockedBlocks),
    edges: cloneJson(definition.edges),
    structure: cloneJson(structure),
    runtimeUiConfig: cloneJson(runtimeUiConfig),
    outputMappingPreview: cloneJson(outputMappingPreview),
    aiProposals: cloneJson(definition.aiProposals),
    mockRuns: cloneJson(definition.mockRuns),
    notes: options.notes,
    validationWarnings: warnings,
  };
  const workflow: WorkflowDefinition = {
    ...workflowForValidation,
    metadata: {
      ...definition.metadata,
      updatedBy: SYSTEM_USER,
      updatedAt: now,
    },
    versionSnapshots: [...definition.versionSnapshots, snapshot],
    latestPublishedVersionId: snapshot.id,
    publishedVersion: {
      id: snapshot.id,
      versionNumber: snapshot.versionNumber,
      createdAt: snapshot.createdAt,
    },
    events: appendWorkflowEvent(
      definition,
      createWorkflowEvent({
        type: 'publish_snapshot',
        message: `Published local version ${snapshot.versionNumber}.`,
        createdAt: now,
        details: {
          outputPreviewCount: outputMappingPreview.outputs.length,
          runtimeSectionCount: runtimeUiConfig.sections.length,
          validationWarnings: warnings,
        },
      }),
    ),
  };

  return { snapshot, workflow, warnings };
}

export function publishLocalWorkflowSnapshot({
  description,
  edges,
  name,
  nodes,
  notes,
}: {
  description?: string;
  edges: CanvasWorkflowEdge[];
  name: string;
  nodes: WorkflowNode[];
  notes?: string;
}): {
  snapshot: WorkflowVersionSnapshot;
  workflow: WorkflowDefinition;
  warnings: string[];
} {
  const draft = createWorkflowDefinitionFromCanvas({
    description,
    edges,
    existing: readStoredWorkflowDefinition(),
    name,
    nodes,
    status: 'published',
  });
  const result = publishWorkflowDefinition(draft, { notes });
  saveWorkflowDefinitionSnapshot(result.workflow);
  return result;
}
