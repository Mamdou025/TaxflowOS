import {
  EXPANDED_MAPPING_PIPELINE_BLOCK_SPECS,
  EXPANDED_MAPPING_PIPELINE_EDGE_SPECS,
} from '@/shared/workflow-engine/templates/sample-workflows/expanded-mapping-pipeline-demo';
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

function createExpandedMappingPipelineBlocks() {
  return EXPANDED_MAPPING_PIPELINE_BLOCK_SPECS.map((spec) =>
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

function getExpandedMappingPipelineDemoEdges(): WorkflowEdge[] {
  return EXPANDED_MAPPING_PIPELINE_EDGE_SPECS.map((spec) =>
    createWorkflowEdgeRecord({
      bindingLabel: spec.bindingLabel,
      bindingStatus: 'valid',
      confidence: 1,
      createdAt: SAMPLE_CREATED_AT,
      id: `expanded-edge-${spec.sourceBlockId}-${spec.targetBlockId}-${spec.sourceOutputRole}-${spec.targetInputRole}`,
      reason: spec.reason,
      relationshipType: spec.relationshipType as WorkflowRelationshipType,
      sourceBlockId: spec.sourceBlockId,
      sourceOutputRole: spec.sourceOutputRole,
      targetBlockId: spec.targetBlockId,
      targetInputRole: spec.targetInputRole,
    }),
  );
}

export function createExpandedMappingPipelineDemoWorkflow(): LocalWorkflowSnapshot {
  const blocks = createExpandedMappingPipelineBlocks();
  const edges = getExpandedMappingPipelineDemoEdges();
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
      'Expanded generic local demo that maps 15 rows, aggregates Z and W, validates warnings, and produces protected outputs.',
    createdAt: SAMPLE_CREATED_AT,
    createdBy: SYSTEM_USER,
    edgeCount: edges.length,
    edgeIds: edges.map((edge) => edge.id),
    edges: cloneJson(edges),
    id: 'version-expanded-mapping-pipeline-demo-v1',
    label: 'Initial Expanded Mapping Pipeline Demo',
    mockRuns: cloneJson(mockRuns),
    notes: 'Local deterministic expanded mapping demo. No external integrations.',
    outputMappingPreview: cloneJson(outputMappingPreview),
    runtimeUiConfig: cloneJson(runtimeUiConfig),
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: 'draft',
    structure: cloneJson(structure),
    validationWarnings: [],
    versionNumber: 1,
    workflowId: LOCAL_WORKFLOW_ID,
    workflowName: 'Expanded Mapping Pipeline Demo',
  };

  return {
    aiProposals: [],
    blocks,
    description:
      'Generic local stress-test that maps many Excel-like rows with Source rules, aggregates section results into protected Z and W, and produces local output previews.',
    edges,
    events: [
      createWorkflowEvent({
        createdAt: SAMPLE_CREATED_AT,
        message: 'Expanded Mapping Pipeline Demo initialized locally.',
        type: 'reset_sample',
      }),
    ],
    id: LOCAL_WORKFLOW_ID,
    metadata: {
      createdAt: SAMPLE_CREATED_AT,
      createdBy: SYSTEM_USER,
      kind: 'generic-fiscal-workflow',
      notes:
        'No live OCR, AI, Taxprep, ONESOURCE, Excel parser, PDF parser, or backend integration is included.',
      sampleWorkflow: {
        description:
          'Generic executable stress-test demo. The final protected results are Z and W.',
        id: 'expanded-mapping-pipeline-demo',
        label: 'Expanded Mapping Pipeline Demo',
      },
      tags: ['local', 'prototype', 'expanded-mapping-demo'],
      updatedAt: new Date().toISOString(),
      updatedBy: SYSTEM_USER,
    },
    mockRuns,
    name: 'Expanded Mapping Pipeline Demo',
    outputMappingPreview,
    runtimeUiConfig,
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: 'draft',
    structure,
    versionSnapshots: [initialSnapshot],
  };
}
