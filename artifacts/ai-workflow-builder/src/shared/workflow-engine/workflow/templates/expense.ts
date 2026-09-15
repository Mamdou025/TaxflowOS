import {
  EXPENSE_TEMPLATE_BLOCK_SPECS,
  EXPENSE_TEMPLATE_EDGE_SPECS,
} from '@/shared/workflow-engine/templates/sample-workflows/expense-reimbursement-template';
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

export function createExpenseReimbursementWorkflow(): LocalWorkflowSnapshot {
  const blocks = EXPENSE_TEMPLATE_BLOCK_SPECS.map((spec) =>
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
  const edges = EXPENSE_TEMPLATE_EDGE_SPECS.map((spec) =>
    createWorkflowEdgeRecord({
      bindingLabel: spec.bindingLabel,
      bindingStatus: 'valid',
      confidence: 1,
      createdAt: SAMPLE_CREATED_AT,
      id: `expense-edge-${spec.sourceBlockId}-${spec.targetBlockId}-${spec.sourceOutputRole}`,
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
      'Expense reimbursement: expense report → classify receipts → category totals → policy engine → summary → approval pack + payroll export.',
    createdAt: SAMPLE_CREATED_AT,
    createdBy: SYSTEM_USER,
    edgeCount: edges.length,
    edgeIds: edges.map((e) => e.id),
    edges: cloneJson(edges),
    id: 'version-expense-reimbursement-v1',
    label: 'Expense Reimbursement v1',
    mockRuns: cloneJson(mockRuns),
    notes:
      'Non-fiscal demo — four source types, keyword classification, per-category policy caps, and a CAD conversion. No review/validation blocks in v1.',
    outputMappingPreview: cloneJson(outputMappingPreview),
    runtimeUiConfig: cloneJson(runtimeUiConfig),
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: 'draft',
    structure: cloneJson(structure),
    validationWarnings: [],
    versionNumber: 1,
    workflowId: LOCAL_WORKFLOW_ID,
    workflowName: 'Employee Expense Reimbursement',
  };

  return {
    aiProposals: [],
    blocks,
    description:
      'Process an employee expense report: upload receipts, classify each into a policy category, total per category, apply per-diem caps and reimbursement policy, and compute the net amount payable (with a CAD conversion).',
    edges,
    events: [
      createWorkflowEvent({
        createdAt: SAMPLE_CREATED_AT,
        message: 'Employee Expense Reimbursement initialized.',
        type: 'reset_sample',
      }),
    ],
    id: LOCAL_WORKFLOW_ID,
    metadata: {
      createdAt: SAMPLE_CREATED_AT,
      createdBy: SYSTEM_USER,
      kind: 'generic-fiscal-workflow',
      notes:
        'Business-operations demo (non-tax): expense report → classify → total → policy → net payable.',
      sampleWorkflow: {
        description:
          'Expense report → classify receipts → category totals → policy caps → net payable.',
        id: 'expense-reimbursement-template',
        label: 'Employee Expense Reimbursement',
      },
      tags: ['local', 'expense', 'reimbursement', 'expense-reimbursement-template'],
      updatedAt: new Date().toISOString(),
      updatedBy: SYSTEM_USER,
    },
    mockRuns,
    name: 'Employee Expense Reimbursement',
    outputMappingPreview,
    runtimeUiConfig,
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: 'draft',
    structure,
    versionSnapshots: [initialSnapshot],
  };
}
