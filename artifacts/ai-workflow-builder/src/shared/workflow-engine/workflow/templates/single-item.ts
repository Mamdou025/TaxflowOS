import { createWorkflowBlockFromCatalog } from '../block-factory';
import {
  SAMPLE_CREATED_AT,
  type WorkflowEdge,
  type WorkflowRelationshipType,
  type LocalWorkflowSnapshot,
  LOCAL_WORKFLOW_ID,
  type WorkflowVersionSnapshot,
  LOCAL_WORKFLOW_SCHEMA_VERSION,
  SYSTEM_USER,
} from '../contracts';
import { createWorkflowEdgeRecord } from '../edges';
import { getWorkflowStructure } from '../canvas';
import {
  generateRuntimeUiConfigFromParts,
  generateOutputMappingPreviewFromParts,
} from '../runtime-ui';
import { getSampleBlockRuns } from './fapi-sample-data';
import { cloneJson, createWorkflowEvent } from '../events';

const SINGLE_ITEM_PIPELINE_ROWS = [
  {
    account: '4000',
    amount: 100,
    currency: 'USD',
    description: 'Interest earned on deposit account',
    label: 'Interest income',
    rowId: 'row-001',
  },
];

const SINGLE_ITEM_PIPELINE_RULES = [
  {
    confidence: 0.95,
    description: 'Classifies interest-related income rows.',
    keywords: ['interest income', 'interest earned', 'deposit interest'],
    matchMode: 'contains',
    priority: 10,
    ruleId: 'rule-001',
    sectionId: 'income',
    subsectionId: 'interest',
    target: 'income_interest',
  },
];

function createSingleItemPipelineBlocks() {
  const specs = [
    {
      catalogId: 'source:excel-workbook',
      config: {
        outputs: 'rows',
        rows: SINGLE_ITEM_PIPELINE_ROWS,
        sourceKind: 'manual_table',
        sourceLocator: 'excel-template-mock://single-item/row-001',
        toolId: 'source.manual_table',
      },
      description: 'Immutable Excel-like source row. The demo follows row-001 end to end.',
      id: 'single-source-excel-row',
      label: 'Excel Template Row Source',
      position: { x: 80, y: 140 },
    },
    {
      catalogId: 'source:keyword-rules',
      config: {
        keywordRules: SINGLE_ITEM_PIPELINE_RULES,
        outputs: 'keyword_rules',
        sourceKind: 'keyword_rules',
        sourceLocator: 'manual-source://single-item-mapping-rules',
        toolId: 'source.keyword_rules',
      },
      description:
        'Editable Keyword Rulebook used by the mapper. Rules are not hardcoded in Logic.',
      id: 'single-source-mapping-rules',
      label: 'Keyword Rulebook',
      position: { x: 80, y: 380 },
    },
    {
      catalogId: 'logic:classification-mapping',
      config: {
        conflictStrategy: 'highest_confidence',
        inputs: 'data_rows, keyword_rules',
        lowConfidenceThreshold: 0.75,
        matchFields: ['label', 'description'],
        matchMode: 'contains',
        outputs: 'mapped_rows',
        toolId: 'logic.keyword_mapper',
        unmatchedStrategy: 'send_to_review',
      },
      description:
        'Reusable no-code Logic tool that maps source rows with connected keyword rules.',
      id: 'single-logic-keyword-mapper',
      label: 'Keyword Mapper',
      position: { x: 380, y: 250 },
    },
    {
      catalogId: 'logic:aggregation',
      config: {
        aggregationMethod: 'sum',
        amountField: 'amount',
        includeSectionIds: ['income'],
        includeSubsectionIds: ['interest'],
        includeTargets: ['income_interest'],
        inputs: 'mapped_rows',
        outputs: 'subtotal',
        toolId: 'logic.aggregation',
      },
      description: 'Aggregates the mapped single item into the income / interest subtotal.',
      id: 'single-logic-section-aggregator',
      label: 'Section Aggregator',
      position: { x: 700, y: 250 },
    },
    {
      catalogId: 'review:low-confidence-warning',
      config: {
        blocking: true,
        inputs: 'mapped_rows',
        outputs: 'validation_result',
        threshold: 0.75,
        toolId: 'review.confidence_check',
      },
      description:
        'Review / Validation checkpoint that decides whether the mapping is trustworthy.',
      id: 'single-review-confidence-check',
      label: 'Confidence Check',
      position: { x: 700, y: 470 },
    },
    {
      catalogId: 'review:approval-gate',
      config: {
        approved: true,
        inputs: 'value_to_approve, validation_result',
        notes: 'Approved for single item pipeline demo.',
        outputs: 'approval_status',
        reviewer: 'demo-reviewer',
        toolId: 'review.approval_gate',
      },
      description: 'Local mock approval gate that lets the candidate subtotal become governed.',
      id: 'single-review-approval-gate',
      label: 'Approval Gate',
      position: { x: 1020, y: 360 },
    },
    {
      catalogId: 'protected:protected-result',
      config: {
        inputs: 'candidate_value, approval_status',
        outputs: 'protected_result',
        resultName: 'Z',
        runtimeLocked: true,
        toolId: 'protected.protected_result',
      },
      description:
        'Governed final result. If approval is removed, Z becomes draft and needs review.',
      id: 'single-protected-result-z',
      label: 'Protected Result Z',
      position: { x: 1340, y: 250 },
    },
    {
      catalogId: 'output:evidence-pack',
      config: {
        inputs: 'protected_result, mapped_rows, validation_result, approval_status',
        outputs: 'preview',
        toolId: 'output.evidence_pack_preview',
      },
      description: 'Human-readable local evidence preview for the final Z result.',
      id: 'single-output-z-evidence-preview',
      label: 'Z Evidence Preview',
      position: { x: 1660, y: 160 },
    },
    {
      catalogId: 'output:canonical-json',
      config: {
        inputs: 'protected_result, source_trace',
        outputs: 'canonical_json',
        toolId: 'output.canonical_json',
      },
      description: 'Structured local JSON package for the final Z result and trace.',
      id: 'single-output-z-canonical-json',
      label: 'Z Canonical JSON',
      position: { x: 1660, y: 380 },
    },
  ];

  return specs.map((spec) =>
    createWorkflowBlockFromCatalog(spec.catalogId, {
      config: spec.config,
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

function getSingleItemPipelineDemoEdges(): WorkflowEdge[] {
  // biome-ignore lint/nursery/useMaxParams: Compact demo-edge DSL keeps the single-item path readable.
  const edge = (
    sourceBlockId: string,
    targetBlockId: string,
    relationshipType: WorkflowRelationshipType,
    reason: string,
    binding: Pick<
      WorkflowEdge,
      'bindingLabel' | 'bindingStatus' | 'sourceOutputRole' | 'targetInputRole'
    >,
  ) =>
    createWorkflowEdgeRecord({
      id: `single-edge-${sourceBlockId}-${targetBlockId}-${binding.sourceOutputRole || 'out'}-${binding.targetInputRole || 'in'}`,
      sourceBlockId,
      targetBlockId,
      relationshipType,
      reason,
      confidence: 1,
      ...binding,
      createdAt: SAMPLE_CREATED_AT,
    });

  return [
    edge(
      'single-source-excel-row',
      'single-logic-keyword-mapper',
      'provides_data_to',
      'Keyword Mapper needs data rows.',
      {
        bindingLabel: 'Rows to classify',
        bindingStatus: 'valid',
        sourceOutputRole: 'rows',
        targetInputRole: 'data_rows',
      },
    ),
    edge(
      'single-source-mapping-rules',
      'single-logic-keyword-mapper',
      'referenced_by',
      'Keyword Mapper applies this versioned rulebook.',
      {
        bindingLabel: 'Rules used for classification',
        bindingStatus: 'valid',
        sourceOutputRole: 'keyword_rules',
        targetInputRole: 'keyword_rules',
      },
    ),
    edge(
      'single-logic-keyword-mapper',
      'single-logic-section-aggregator',
      'transforms_into',
      'Aggregator sums mapped rows by section/subsection.',
      {
        bindingLabel: 'Mapped rows to aggregate',
        bindingStatus: 'valid',
        sourceOutputRole: 'mapped_rows',
        targetInputRole: 'mapped_rows',
      },
    ),
    edge(
      'single-logic-keyword-mapper',
      'single-review-confidence-check',
      'triggers_validation',
      'Confidence Check reviews the mapped row confidence.',
      {
        bindingLabel: 'Mapped rows to validate',
        bindingStatus: 'valid',
        sourceOutputRole: 'mapped_rows',
        targetInputRole: 'checked_items',
      },
    ),
    edge(
      'single-logic-section-aggregator',
      'single-review-approval-gate',
      'triggers_validation',
      'Approval Gate reviews the candidate subtotal for Z.',
      {
        bindingLabel: 'Candidate subtotal',
        bindingStatus: 'valid',
        sourceOutputRole: 'subtotal',
        targetInputRole: 'value_to_approve',
      },
    ),
    edge(
      'single-review-confidence-check',
      'single-review-approval-gate',
      'depends_on',
      'Approval Gate considers the validation result.',
      {
        bindingLabel: 'Confidence validation',
        bindingStatus: 'valid',
        sourceOutputRole: 'validation_result',
        targetInputRole: 'validation_result',
      },
    ),
    edge(
      'single-logic-section-aggregator',
      'single-protected-result-z',
      'feeds_protected_result',
      'Subtotal becomes the candidate value for Z.',
      {
        bindingLabel: 'Candidate Z value',
        bindingStatus: 'valid',
        sourceOutputRole: 'subtotal',
        targetInputRole: 'candidate_value',
      },
    ),
    edge(
      'single-review-approval-gate',
      'single-protected-result-z',
      'approves_for',
      'Approval Gate determines whether Z can become final.',
      {
        bindingLabel: 'Approval for Z',
        bindingStatus: 'valid',
        sourceOutputRole: 'approval_status',
        targetInputRole: 'approval_status',
      },
    ),
    edge(
      'single-protected-result-z',
      'single-output-z-evidence-preview',
      'maps_to_output',
      'Evidence preview displays the final protected result.',
      {
        bindingLabel: 'Final Z output',
        bindingStatus: 'valid',
        sourceOutputRole: 'protected_result',
        targetInputRole: 'protected_result',
      },
    ),
    edge(
      'single-logic-keyword-mapper',
      'single-output-z-evidence-preview',
      'included_in_output_preview',
      'Evidence preview lists the mapped row and rule.',
      {
        bindingLabel: 'Mapped row trace',
        bindingStatus: 'valid',
        sourceOutputRole: 'mapped_rows',
        targetInputRole: 'mapped_rows',
      },
    ),
    edge(
      'single-review-confidence-check',
      'single-output-z-evidence-preview',
      'included_in_output_preview',
      'Evidence preview includes validation status.',
      {
        bindingLabel: 'Validation result',
        bindingStatus: 'valid',
        sourceOutputRole: 'validation_result',
        targetInputRole: 'validation_result',
      },
    ),
    edge(
      'single-review-approval-gate',
      'single-output-z-evidence-preview',
      'included_in_output_preview',
      'Evidence preview includes approval status.',
      {
        bindingLabel: 'Approval status',
        bindingStatus: 'valid',
        sourceOutputRole: 'approval_status',
        targetInputRole: 'approval_status',
      },
    ),
    edge(
      'single-protected-result-z',
      'single-output-z-canonical-json',
      'maps_to_output',
      'Canonical JSON includes the final protected Z result.',
      {
        bindingLabel: 'Final Z JSON',
        bindingStatus: 'valid',
        sourceOutputRole: 'protected_result',
        targetInputRole: 'protected_result',
      },
    ),
    edge(
      'single-protected-result-z',
      'single-output-z-canonical-json',
      'maps_to_output',
      'Canonical JSON includes the trace carried by Z.',
      {
        bindingLabel: 'Z source trace',
        bindingStatus: 'valid',
        sourceOutputRole: 'protected_result',
        targetInputRole: 'source_trace',
      },
    ),
  ];
}

export function createSingleItemPipelineDemoWorkflow(): LocalWorkflowSnapshot {
  const blocks = createSingleItemPipelineBlocks();
  const edges = getSingleItemPipelineDemoEdges();
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
    id: 'version-single-item-pipeline-demo-v1',
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    workflowId: LOCAL_WORKFLOW_ID,
    workflowName: 'Single Item Pipeline Demo',
    versionNumber: 1,
    label: 'Initial Single Item Pipeline Demo',
    status: 'draft',
    createdBy: SYSTEM_USER,
    createdAt: SAMPLE_CREATED_AT,
    changeSummary:
      'Tiny executable local demo that carries row-001 through Source, Logic, Review, Protected, and Output.',
    blockCount: blocks.length,
    edgeCount: edges.length,
    blockIds: blocks.map((block) => block.id),
    edgeIds: edges.map((edge) => edge.id),
    blocks: cloneJson(blocks),
    edges: cloneJson(edges),
    structure: cloneJson(structure),
    runtimeUiConfig: cloneJson(runtimeUiConfig),
    outputMappingPreview: cloneJson(outputMappingPreview),
    aiProposals: [],
    mockRuns: cloneJson(mockRuns),
    notes: 'Local deterministic single item demo. No external integrations.',
    validationWarnings: [],
  };

  return {
    schemaVersion: LOCAL_WORKFLOW_SCHEMA_VERSION,
    id: LOCAL_WORKFLOW_ID,
    name: 'Single Item Pipeline Demo',
    description:
      'Generic local proof that one Source item can flow through reusable Logic, Review / Validation, Protected governance, and Output artifacts.',
    status: 'draft',
    metadata: {
      kind: 'generic-fiscal-workflow',
      sampleWorkflow: {
        id: 'single-item-pipeline-demo',
        label: 'Single Item Pipeline Demo',
        description: 'Generic executable demo. The final protected result is Z.',
      },
      tags: ['local', 'prototype', 'single-item-demo'],
      createdBy: SYSTEM_USER,
      createdAt: SAMPLE_CREATED_AT,
      updatedBy: SYSTEM_USER,
      updatedAt: new Date().toISOString(),
      notes:
        'No live OCR, AI, Taxprep, ONESOURCE, Excel parser, PDF parser, or backend integration is included.',
    },
    blocks,
    edges,
    structure,
    runtimeUiConfig,
    outputMappingPreview,
    mockRuns,
    versionSnapshots: [initialSnapshot],
    aiProposals: [],
    events: [
      createWorkflowEvent({
        type: 'reset_sample',
        message: 'Single Item Pipeline Demo initialized locally.',
        createdAt: SAMPLE_CREATED_AT,
      }),
    ],
  };
}
