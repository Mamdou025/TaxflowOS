import {
  HOLIDAY_TEMPLATE_BLOCK_SPECS,
  HOLIDAY_TEMPLATE_EDGE_SPECS,
} from '@/shared/workflow-engine/templates/sample-workflows/holiday-payroll-template';
import {
  type LocalWorkflowSnapshot,
  SAMPLE_CREATED_AT,
  type WorkflowRelationshipType,
  LOCAL_WORKFLOW_ID,
  type WorkflowVersionSnapshot,
  SYSTEM_USER,
  LOCAL_WORKFLOW_SCHEMA_VERSION,
} from '../contracts';
import { createWorkflowBlockFromCatalog } from '../block-factory';
import { cloneJson, createWorkflowEvent } from '../events';
import { createWorkflowEdgeRecord } from '../edges';
import { getWorkflowStructure } from '../canvas';
import {
  generateRuntimeUiConfigFromParts,
  generateOutputMappingPreviewFromParts,
} from '../runtime-ui';
import { getSampleBlockRuns } from './fapi-sample-data';

export function createHolidayPayrollWorkflow(): LocalWorkflowSnapshot {
  const blocks = HOLIDAY_TEMPLATE_BLOCK_SPECS.map((spec) =>
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
  const edges = HOLIDAY_TEMPLATE_EDGE_SPECS.map((spec) =>
    createWorkflowEdgeRecord({
      bindingLabel: spec.bindingLabel,
      bindingStatus: 'valid',
      confidence: 1,
      createdAt: SAMPLE_CREATED_AT,
      id: `holiday-edge-${spec.sourceBlockId}-${spec.targetBlockId}-${spec.sourceOutputRole}`,
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
  const description =
    'Pull the published public-holiday calendar, classify each holiday as national or specific to one province, count the days, and accrue the payroll cost from headcount, hourly rate and the statutory premium.';
  const initialSnapshot: WorkflowVersionSnapshot = {
    aiProposals: [],
    blockCount: blocks.length,
    blockIds: blocks.map((b) => b.id),
    blocks: cloneJson(blocks),
    changeSummary:
      'Statutory holiday accrual: live holiday API -> classify scope -> day counts + calendar hierarchy -> accrual formulas -> review gates -> schedule, workbook, canonical JSON and evidence pack.',
    createdAt: SAMPLE_CREATED_AT,
    createdBy: SYSTEM_USER,
    edgeCount: edges.length,
    edgeIds: edges.map((e) => e.id),
    edges: cloneJson(edges),
    id: 'version-holiday-payroll-v1',
    label: 'Statutory Holiday Payroll Accrual v1',
    mockRuns: cloneJson(mockRuns),
    notes:
      'Non-tax demo on live keyless public data. Every block executes; the API response is pinned into the run so the figures are reproducible.',
    outputMappingPreview: cloneJson(outputMappingPreview),
    runtimeUiConfig: cloneJson(runtimeUiConfig),
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: 'draft',
    structure: cloneJson(structure),
    validationWarnings: [],
    versionNumber: 1,
    workflowId: LOCAL_WORKFLOW_ID,
    workflowName: 'Statutory Holiday Payroll Accrual',
  };

  return {
    aiProposals: [],
    blocks,
    description,
    edges,
    events: [
      createWorkflowEvent({
        createdAt: SAMPLE_CREATED_AT,
        message: 'Statutory Holiday Payroll Accrual initialized.',
        type: 'reset_sample',
      }),
    ],
    id: LOCAL_WORKFLOW_ID,
    metadata: {
      createdAt: SAMPLE_CREATED_AT,
      createdBy: SYSTEM_USER,
      kind: 'generic-fiscal-workflow',
      notes:
        'Business-operations demo (non-tax): public holiday API -> classify scope -> day counts -> payroll accrual.',
      sampleWorkflow: {
        description,
        id: 'holiday-payroll-template',
        label: 'Statutory Holiday Payroll Accrual',
      },
      tags: ['local', 'payroll', 'holidays', 'holiday-payroll-template'],
      updatedAt: new Date().toISOString(),
      updatedBy: SYSTEM_USER,
    },
    mockRuns,
    name: 'Statutory Holiday Payroll Accrual',
    outputMappingPreview,
    runtimeUiConfig,
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: 'draft',
    structure,
    versionSnapshots: [initialSnapshot],
  };
}
