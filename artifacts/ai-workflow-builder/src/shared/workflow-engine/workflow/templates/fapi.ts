import {
  FAPI_TEMPLATE_BLOCK_SPECS,
  FAPI_TEMPLATE_EDGE_SPECS,
} from '@/shared/workflow-engine/templates/sample-workflows/fapi-template';
import {
  type LocalWorkflowSnapshot,
  SAMPLE_CREATED_AT,
  type WorkflowRelationshipType,
  LOCAL_WORKFLOW_ID,
  type WorkflowVersionSnapshot,
  SYSTEM_USER,
  LOCAL_WORKFLOW_SCHEMA_VERSION,
  type AiProposal,
} from '../contracts';
import { createWorkflowBlockFromCatalog } from '../block-factory';
import { cloneJson, createWorkflowEvent } from '../events';
import { createWorkflowEdgeRecord } from '../edges';
import { getWorkflowStructure } from '../canvas';
import {
  generateRuntimeUiConfigFromParts,
  generateOutputMappingPreviewFromParts,
} from '../runtime-ui';
import {
  getSampleBlockRuns,
  getFapiSampleBlockSpecs,
  getFapiSampleEdges,
} from './fapi-sample-data';

export function createFapiTemplateWorkflow(): LocalWorkflowSnapshot {
  const blocks = FAPI_TEMPLATE_BLOCK_SPECS.map((spec) =>
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
  const edges = FAPI_TEMPLATE_EDGE_SPECS.map((spec) =>
    createWorkflowEdgeRecord({
      bindingLabel: spec.bindingLabel,
      bindingStatus: 'valid',
      confidence: 1,
      createdAt: SAMPLE_CREATED_AT,
      id: `fapi-edge-${spec.sourceBlockId}-${spec.targetBlockId}-${spec.sourceOutputRole}`,
      reason: spec.reason,
      relationshipType: spec.relationshipType as WorkflowRelationshipType,
      sourceBlockId: spec.sourceBlockId,
      sourceOutputRole: spec.sourceOutputRole,
      targetBlockId: spec.targetBlockId,
      targetInputRole: spec.targetInputRole,
    }),
  );
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
    blockIds: blocks.map((b) => b.id),
    blocks: cloneJson(blocks),
    changeSummary:
      'FAPI template: Excel source → keyword mapping → rollup → two-stage calculation → Field displays → output.',
    createdAt: SAMPLE_CREATED_AT,
    createdBy: SYSTEM_USER,
    edgeCount: edges.length,
    edgeIds: edges.map((e) => e.id),
    edges: cloneJson(edges),
    id: 'version-fapi-template-v1',
    label: 'FAPI Template v1',
    mockRuns: cloneJson(mockRuns),
    notes:
      'No validation or rulebook blocks — core pipeline only. Add Review/Validation and Rulebook blocks once the base numbers are confirmed.',
    outputMappingPreview: cloneJson(outputMappingPreview),
    runtimeUiConfig: cloneJson(runtimeUiConfig),
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: 'draft',
    structure: cloneJson(structure),
    validationWarnings: [],
    versionNumber: 1,
    workflowId: LOCAL_WORKFLOW_ID,
    workflowName: 'FAPI Calculation Template',
  };

  return {
    aiProposals: [],
    blocks,
    description:
      'Core FAPI pipeline: upload a trial balance, classify rows, roll up categories, compute lines A–H then summary totals, and display results in Field blocks.',
    edges,
    events: [
      createWorkflowEvent({
        createdAt: SAMPLE_CREATED_AT,
        message: 'FAPI Calculation Template initialized.',
        type: 'reset_sample',
      }),
    ],
    id: LOCAL_WORKFLOW_ID,
    metadata: {
      createdAt: SAMPLE_CREATED_AT,
      createdBy: SYSTEM_USER,
      kind: 'generic-fiscal-workflow',
      notes:
        'Rulebook and validation blocks intentionally excluded from v1 — add them once base FAPI numbers are confirmed.',
      sampleWorkflow: {
        description:
          'Core FAPI pipeline: trial balance → keyword mapping → rollup → calculation → Field display → output.',
        id: 'fapi-calculation-template',
        label: 'FAPI Calculation Template',
      },
      tags: ['local', 'fapi', 'fapi-calculation-template'],
      updatedAt: new Date().toISOString(),
      updatedBy: SYSTEM_USER,
    },
    mockRuns,
    name: 'FAPI Calculation Template',
    outputMappingPreview,
    runtimeUiConfig,
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: 'draft',
    structure,
    versionSnapshots: [initialSnapshot],
  };
}

export function createFapiSampleWorkflow(): LocalWorkflowSnapshot {
  const blockSpecs = getFapiSampleBlockSpecs();
  const blocks = blockSpecs.map((spec) =>
    createWorkflowBlockFromCatalog(spec.catalogId, {
      id: spec.id,
      label: spec.label,
      description: spec.description,
      position: spec.position,
      config: spec.config,
      status: spec.status || 'configured',
      createdAt: SAMPLE_CREATED_AT,
      updatedAt: SAMPLE_CREATED_AT,
      sample: true,
    }),
  );
  const edges = getFapiSampleEdges();
  const proposalBlock = createWorkflowBlockFromCatalog('ai:ai-workflow-proposal', {
    id: 'proposal-ai-review-pack-improvements',
    label: 'AI Proposal: Evidence Pack Improvements',
    description: 'Proposal object only. Approval would be required before mutating the graph.',
    position: { x: 1420, y: 740 },
    createdAt: SAMPLE_CREATED_AT,
    updatedAt: SAMPLE_CREATED_AT,
    sample: true,
  });
  const proposalEdge = createWorkflowEdgeRecord({
    id: 'proposal-edge-mapping-suggestion',
    sourceBlockId: proposalBlock.id,
    targetBlockId: 'logic-classify-source-rows',
    relationshipType: 'suggests_mapping',
    reason: 'AI proposal suggests a mapping refinement for classified rows.',
    status: 'proposed',
    confidence: 0.72,
    createdAt: SAMPLE_CREATED_AT,
  });
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
  const aiProposals: AiProposal[] = [
    {
      id: 'ai-proposal-fapi-review-pack',
      title: 'Evidence pack refinement',
      originalPrompt: 'Suggest a stronger review pack for the FAPI sample workflow.',
      interpretedPlan: 'Add a proposal-only evidence pack refinement after output readiness.',
      selectedTools: ['local block catalog', 'mock proposal writer'],
      generatedBlocks: [proposalBlock],
      generatedEdges: [proposalEdge],
      generatedCodeOrFormulas: [
        {
          blockId: proposalBlock.id,
          kind: 'code',
          value: "return { success: true, data: { proposedArtifact: 'enhancedEvidencePack' } };",
        },
      ],
      status: 'proposed',
      createdAt: SAMPLE_CREATED_AT,
      createdBy: 'mock-ai-panel',
      confidence: 0.72,
      notes: 'Sample proposal object only. Approval is required before graph changes.',
      history: [
        {
          id: 'ai-proposal-fapi-review-pack-created',
          action: 'created',
          by: 'mock-ai-panel',
          at: SAMPLE_CREATED_AT,
          notes: 'Seeded sample proposal.',
        },
      ],
    },
  ];
  const initialSnapshot: WorkflowVersionSnapshot = {
    id: 'version-fapi-sample-v1',
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    workflowId: LOCAL_WORKFLOW_ID,
    workflowName: 'Executable Mapping Demo - FAPI-inspired sample',
    versionNumber: 1,
    label: 'Initial FAPI-inspired sample',
    status: 'draft',
    createdBy: SYSTEM_USER,
    createdAt: SAMPLE_CREATED_AT,
    changeSummary:
      'Initial schema-driven sample with source, logic, validation, protected, output, and AI proposal objects.',
    blockCount: blocks.length,
    edgeCount: edges.length,
    blockIds: blocks.map((block) => block.id),
    edgeIds: edges.map((edge) => edge.id),
    blocks: cloneJson(blocks),
    edges: cloneJson(edges),
    structure: cloneJson(structure),
    runtimeUiConfig: cloneJson(runtimeUiConfig),
    outputMappingPreview: cloneJson(outputMappingPreview),
    aiProposals: cloneJson(aiProposals),
    mockRuns: cloneJson(mockRuns),
    notes: 'Original local sample workflow.',
    validationWarnings: [],
  };

  return {
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    id: LOCAL_WORKFLOW_ID,
    name: 'Executable Mapping Demo - FAPI-inspired sample',
    description: 'Schema-driven local prototype sample for a generic fiscal workflow studio.',
    status: 'draft',
    metadata: {
      kind: 'generic-fiscal-workflow',
      sampleWorkflow: {
        id: 'fapi-inspired-sample',
        label: 'FAPI-inspired sample',
        description: 'First sample workflow only. The studio model remains generic.',
      },
      tags: ['local', 'prototype', 'sample', 'fapi-inspired'],
      createdBy: SYSTEM_USER,
      createdAt: SAMPLE_CREATED_AT,
      updatedBy: SYSTEM_USER,
      updatedAt: new Date().toISOString(),
      notes: 'No live OCR, AI, Taxprep, ONESOURCE, or backend integration is included.',
    },
    blocks,
    edges,
    structure,
    runtimeUiConfig,
    outputMappingPreview,
    mockRuns,
    versionSnapshots: [initialSnapshot],
    aiProposals,
    events: [
      createWorkflowEvent({
        type: 'reset_sample',
        message: 'FAPI-inspired sample workflow initialized locally.',
        createdAt: SAMPLE_CREATED_AT,
      }),
    ],
  };
}
