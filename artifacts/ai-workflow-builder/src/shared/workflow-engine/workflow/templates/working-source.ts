import {
  WORKING_SOURCE_DEMO_BLOCK_SPECS,
  WORKING_SOURCE_DEMO_EDGE_SPECS,
} from '@/shared/workflow-engine/templates/sample-workflows/working-source-rules-demo';
import { createWorkflowBlockFromCatalog } from '../block-factory';
import { cloneJson, createWorkflowEvent } from '../events';
import {
  SAMPLE_CREATED_AT,
  type WorkflowEdge,
  type WorkflowRelationshipType,
  type LocalWorkflowSnapshot,
  LOCAL_WORKFLOW_ID,
  type WorkflowVersionSnapshot,
  SYSTEM_USER,
  LOCAL_WORKFLOW_SCHEMA_VERSION,
} from '../contracts';
import { createWorkflowEdgeRecord } from '../edges';
import { getWorkflowStructure } from '../canvas';
import {
  generateRuntimeUiConfigFromParts,
  generateOutputMappingPreviewFromParts,
} from '../runtime-ui';
import { getSampleBlockRuns } from './fapi-sample-data';

function createWorkingSourceRulesDemoBlocks() {
  return WORKING_SOURCE_DEMO_BLOCK_SPECS.map((spec) =>
    createWorkflowBlockFromCatalog(spec.catalogId, {
      config: cloneJson(spec.config) as Record<string, unknown>,
      createdAt: SAMPLE_CREATED_AT,
      description: spec.description,
      id: spec.id,
      label: spec.label,
      position: spec.position,
      sample: true,
      status: 'configured',
      updatedAt: SAMPLE_CREATED_AT,
    }),
  );
}

function getWorkingSourceRulesDemoEdges(): WorkflowEdge[] {
  return WORKING_SOURCE_DEMO_EDGE_SPECS.map((spec) =>
    createWorkflowEdgeRecord({
      bindingLabel: spec.bindingLabel,
      bindingStatus: 'valid',
      confidence: 1,
      createdAt: SAMPLE_CREATED_AT,
      id: `working-edge-${spec.sourceBlockId}-${spec.targetBlockId}-${spec.sourceOutputRole}-${spec.targetInputRole}`,
      reason: spec.reason,
      relationshipType: spec.relationshipType as WorkflowRelationshipType,
      sourceBlockId: spec.sourceBlockId,
      sourceOutputRole: spec.sourceOutputRole,
      targetBlockId: spec.targetBlockId,
      targetInputRole: spec.targetInputRole,
    }),
  );
}

export function createWorkingSourceRulesDemoWorkflow(): LocalWorkflowSnapshot {
  const blocks = createWorkingSourceRulesDemoBlocks();
  const edges = getWorkingSourceRulesDemoEdges();
  const structure = getWorkflowStructure(blocks);
  const runtimeUiConfig = generateRuntimeUiConfigFromParts({
    blocks,
    generatedAt: SAMPLE_CREATED_AT,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
    structure,
  });
  const outputMappingPreview = generateOutputMappingPreviewFromParts({
    blocks,
    edges,
    generatedAt: SAMPLE_CREATED_AT,
    sourceWorkflowId: LOCAL_WORKFLOW_ID,
  });
  const mockRuns = getSampleBlockRuns(blocks);
  const initialSnapshot: WorkflowVersionSnapshot = {
    aiProposals: [],
    blockCount: blocks.length,
    blockIds: blocks.map((block) => block.id),
    blocks: cloneJson(blocks),
    changeSummary:
      'Working local FAPI-style preparation demo with Excel Source rows, imported rulebooks, calculator validation, and protected outputs.',
    createdAt: SAMPLE_CREATED_AT,
    createdBy: SYSTEM_USER,
    edgeCount: edges.length,
    edgeIds: edges.map((edge) => edge.id),
    edges: cloneJson(edges),
    id: 'version-working-source-rules-demo-v1',
    label: 'Initial Working FAPI Workbook Preparation Demo',
    mockRuns: cloneJson(mockRuns),
    notes:
      'Local deterministic working demo. Uploaded Excel rows and draft mapping rules stay local.',
    outputMappingPreview: cloneJson(outputMappingPreview),
    runtimeUiConfig: cloneJson(runtimeUiConfig),
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: 'draft',
    structure: cloneJson(structure),
    validationWarnings: [],
    versionNumber: 1,
    workflowId: LOCAL_WORKFLOW_ID,
    workflowName: 'Working FAPI Workbook Preparation Demo',
  };

  return {
    aiProposals: [],
    blocks,
    description:
      'Practical generic local demo for preparing a FAPI-style workflow from an uploaded Excel workbook with editable rulebooks and protected outputs.',
    edges,
    events: [
      createWorkflowEvent({
        createdAt: SAMPLE_CREATED_AT,
        message: 'Working Excel Source + Rulebooks Demo initialized locally.',
        type: 'reset_sample',
      }),
    ],
    id: LOCAL_WORKFLOW_ID,
    metadata: {
      createdAt: SAMPLE_CREATED_AT,
      createdBy: SYSTEM_USER,
      kind: 'generic-fiscal-workflow',
      notes: 'No live OCR, AI, Taxprep, ONESOURCE, PDF parser, or backend integration is included.',
      sampleWorkflow: {
        description:
          'Generic practical local demo for Excel source rows, editable rulebooks, FAPI-style calculations, and output previews.',
        id: 'working-source-rules-demo',
        label: 'Working FAPI Workbook Preparation Demo',
      },
      tags: ['local', 'prototype', 'working-source-rules-demo'],
      updatedAt: new Date().toISOString(),
      updatedBy: SYSTEM_USER,
    },
    mockRuns,
    name: 'Working FAPI Workbook Preparation Demo',
    outputMappingPreview,
    runtimeUiConfig,
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: 'draft',
    structure,
    versionSnapshots: [initialSnapshot],
  };
}
