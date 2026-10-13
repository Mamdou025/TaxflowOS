import {
  FOREIGN_TAX_CALC_BLOCK_SPECS,
  FOREIGN_TAX_CALC_EDGE_SPECS,
} from '@/shared/workflow-engine/templates/fapi/foreign-tax-calculator-template';
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

// Mirrors createFapiTemplateWorkflow (./fapi.ts) exactly, including keeping
// block ids UNPREFIXED (unlike the generic createPortfolioWorkflow, which
// prefixes every id with `${def.id}--`). This template's declared Workpaper
// worksheetLines reference calculationBlockId by the raw spec id
// ('foreign-tax-logic-lines-engine' etc.) — prefixing would break that
// reference, so this can't go through the generic portfolio builder.
export function createForeignTaxCalculatorWorkflow(): LocalWorkflowSnapshot {
  const blocks = FOREIGN_TAX_CALC_BLOCK_SPECS.map((spec) =>
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
  const edges = FOREIGN_TAX_CALC_EDGE_SPECS.map((spec) =>
    createWorkflowEdgeRecord({
      bindingLabel: spec.bindingLabel,
      bindingStatus: 'valid',
      confidence: 1,
      createdAt: SAMPLE_CREATED_AT,
      id: `foreign-tax-edge-${spec.sourceBlockId}-${spec.targetBlockId}-${spec.sourceOutputRole}`,
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
      'Foreign Tax Calculator: Excel source → widened keyword mapping → confidence/unmatched review → rollup → two-stage calculation → declared Workpapers → output.',
    createdAt: SAMPLE_CREATED_AT,
    createdBy: SYSTEM_USER,
    edgeCount: edges.length,
    edgeIds: edges.map((e) => e.id),
    edges: cloneJson(edges),
    id: 'version-foreign-tax-calculator-v1',
    label: 'Foreign Tax Calculator v1',
    mockRuns: cloneJson(mockRuns),
    notes:
      'Rebuilt from the FAPI Calculation template with wider keyword coverage, non-blocking confidence/unmatched-row flags, and declared Workpaper worksheet lines in place of undeclared legacy Field blocks.',
    outputMappingPreview: cloneJson(outputMappingPreview),
    runtimeUiConfig: cloneJson(runtimeUiConfig),
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: 'draft',
    structure: cloneJson(structure),
    validationWarnings: [],
    versionNumber: 1,
    workflowId: LOCAL_WORKFLOW_ID,
    workflowName: 'Foreign Tax Calculator',
  };

  return {
    aiProposals: [],
    blocks,
    description:
      'Calculate FAPI from a trial balance using a widened keyword rulebook, with low-confidence and unmatched rows flagged for review before the figures are relied on.',
    edges,
    events: [
      createWorkflowEvent({
        createdAt: SAMPLE_CREATED_AT,
        message: 'Foreign Tax Calculator initialized.',
        type: 'reset_sample',
      }),
    ],
    id: LOCAL_WORKFLOW_ID,
    metadata: {
      createdAt: SAMPLE_CREATED_AT,
      createdBy: SYSTEM_USER,
      kind: 'generic-fiscal-workflow',
      notes:
        'Same FAPI math as the FAPI Calculation template — see foreign-tax-calculator-template.ts for what changed and why.',
      sampleWorkflow: {
        description:
          'Trial balance → widened keyword mapping → confidence review → rollup → calculation → declared Workpaper display → output.',
        id: 'foreign-tax-calculator',
        label: 'Foreign Tax Calculator',
      },
      tags: ['local', 'fapi', 'foreign-tax-calculator'],
      updatedAt: new Date().toISOString(),
      updatedBy: SYSTEM_USER,
    },
    mockRuns,
    name: 'Foreign Tax Calculator',
    outputMappingPreview,
    runtimeUiConfig,
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    status: 'draft',
    structure,
    versionSnapshots: [initialSnapshot],
  };
}
