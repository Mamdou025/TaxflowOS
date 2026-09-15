import {
  type ToolSchemaField,
  type ToolInputSchema,
  type ToolOutputSchema,
  type ToolInputRole,
  type ToolOutputRole,
} from './types';

export function getToolInputSchema(fields: ToolSchemaField[]): ToolInputSchema {
  return { fields };
}

export function getToolOutputSchema(fields: ToolSchemaField[]): ToolOutputSchema {
  return { fields };
}

export const DATA_ROWS_INPUT_ROLE: ToolInputRole = {
  acceptedFamilies: ['Logic', 'Source'],
  acceptedOutputTypes: ['rows', 'mapped_rows', 'parsed_table'],
  acceptedSourceKinds: [
    'excel_template_mock',
    'manual_table',
    'parsed_table',
    'uploaded_rows_mock',
  ],
  allowMultiple: true,
  description: 'Tabular fiscal rows from a Source or upstream Logic tool.',
  id: 'data_rows',
  label: 'Data rows',
  required: true,
};

export const KEYWORD_RULES_INPUT_ROLE: ToolInputRole = {
  acceptedFamilies: ['Source'],
  acceptedSourceKinds: ['keyword_rules'],
  allowMultiple: true,
  description: 'Keyword-to-category rules from a Keyword Rulebook.',
  id: 'keyword_rules',
  label: 'Keyword rules',
  required: true,
};

export const MAPPED_ROWS_INPUT_ROLE: ToolInputRole = {
  acceptedFamilies: ['Logic'],
  acceptedOutputTypes: ['mapped_rows'],
  allowMultiple: true,
  description: 'Rows already classified or mapped by upstream Logic.',
  id: 'mapped_rows',
  label: 'Mapped rows',
  required: true,
};

export const CHECKED_ITEMS_INPUT_ROLE: ToolInputRole = {
  acceptedFamilies: ['Logic', 'Review / Validation'],
  acceptedOutputTypes: [
    'aggregation_summary',
    'calculated_results',
    'calculation_summary',
    'conflicts',
    'final_totals',
    'low_confidence_rows',
    'mapped_rows',
    'node_totals',
    'official_line_values',
    'unmatched_rows',
  ],
  allowMultiple: true,
  description: 'Rows or findings that should be reviewed.',
  id: 'checked_items',
  label: 'Checked items',
  required: true,
};

export const REVIEW_FINDINGS_INPUT_ROLE: ToolInputRole = {
  acceptedFamilies: ['Logic', 'Review / Validation'],
  acceptedOutputTypes: ['aggregation_summary', 'calculation_summary', 'review_status'],
  allowMultiple: true,
  description: 'Review findings and upstream results considered by the gate.',
  id: 'review_findings',
  label: 'Review findings',
  required: false,
};

export const APPROVED_VALUE_INPUT_ROLE: ToolInputRole = {
  acceptedFamilies: ['Logic', 'Review / Validation'],
  acceptedOutputTypes: ['calculated_results', 'final_totals', 'subtotal', 'value', 'review_status'],
  allowMultiple: true,
  description: 'Approved or review-ready upstream value.',
  id: 'approved_value',
  label: 'Approved value',
  required: true,
};

export const VALUE_TO_APPROVE_INPUT_ROLE: ToolInputRole = {
  acceptedFamilies: ['Logic', 'Source', 'Protected'],
  acceptedOutputTypes: [
    'calculated_results',
    'exchange_rate',
    'final_totals',
    'governed_value',
    'subtotal',
    'value',
  ],
  allowMultiple: false,
  description: 'Candidate Logic value that the gate is approving.',
  id: 'value_to_approve',
  label: 'Value to approve',
  required: true,
};

export const VALIDATION_RESULT_INPUT_ROLE: ToolInputRole = {
  acceptedFamilies: ['Review / Validation'],
  acceptedOutputTypes: ['validation_result', 'review_status'],
  allowMultiple: true,
  description: 'Validation result considered by this review gate.',
  id: 'validation_result',
  label: 'Validation result',
  required: false,
};

export const CANDIDATE_VALUE_INPUT_ROLE: ToolInputRole = {
  acceptedFamilies: ['Logic'],
  acceptedOutputTypes: ['calculated_results', 'final_totals', 'subtotal', 'value'],
  allowMultiple: false,
  description: 'Candidate Logic result that may become protected.',
  id: 'candidate_value',
  label: 'Candidate value',
  required: true,
};

export const APPROVAL_STATUS_INPUT_ROLE: ToolInputRole = {
  acceptedFamilies: ['Review / Validation'],
  acceptedOutputTypes: ['approval_status', 'review_status'],
  allowMultiple: false,
  description: 'Approval status required before final locking.',
  id: 'approval_status',
  label: 'Approval status',
  required: false,
};

export const PROTECTED_VALUES_INPUT_ROLE: ToolInputRole = {
  acceptedFamilies: ['Logic', 'Protected'],
  acceptedOutputTypes: [
    'calculated_results',
    'final_totals',
    'governed_value',
    'mapped_rows',
    'protected_result',
  ],
  allowMultiple: true,
  description: 'Governed values and candidate Logic outputs for preview.',
  id: 'protected_values',
  label: 'Protected values',
  required: false,
};

export const PROTECTED_RESULT_INPUT_ROLE: ToolInputRole = {
  acceptedFamilies: ['Protected'],
  acceptedOutputTypes: ['protected_result', 'governed_value'],
  allowMultiple: true,
  description: 'Final or draft protected result for output preview.',
  id: 'protected_result',
  label: 'Protected result',
  required: true,
};

export const SOURCE_TRACE_INPUT_ROLE: ToolInputRole = {
  acceptedFamilies: ['Logic', 'Protected', 'Source'],
  acceptedOutputTypes: ['protected_result', 'source_trace'],
  allowMultiple: true,
  description: 'Lineage metadata to include in the output artifact.',
  id: 'source_trace',
  label: 'Source trace',
  required: false,
};

export const ROWS_OUTPUT_ROLE: ToolOutputRole = {
  canRouteToFamilies: ['Logic'],
  description: 'Immutable source rows with evidence references.',
  id: 'rows',
  label: 'Rows',
  outputKey: 'rows',
  outputType: 'rows',
  samplePreview: '5 source rows',
};

export const KEYWORD_RULES_OUTPUT_ROLE: ToolOutputRole = {
  canRouteToFamilies: ['Logic'],
  description: 'Keyword rules for downstream mapping tools.',
  id: 'keyword_rules',
  label: 'Keyword rules',
  outputKey: 'keywordRules',
  outputType: 'keyword_rules',
  samplePreview: '5 keyword rules',
};

export const VALUE_OUTPUT_ROLE: ToolOutputRole = {
  canRouteToFamilies: ['Logic', 'Protected'],
  description: 'Immutable scalar source value.',
  id: 'value',
  label: 'Value',
  outputKey: 'value',
  outputType: 'value',
  samplePreview: 1,
};

export const MAPPED_ROWS_OUTPUT_ROLE: ToolOutputRole = {
  canRouteToFamilies: ['Logic', 'Output', 'Review / Validation'],
  description: 'Rows mapped to atomic categories.',
  id: 'mapped_rows',
  label: 'Mapped rows',
  outputKey: 'mappedRows',
  outputType: 'mapped_rows',
  samplePreview: '5 mapped rows',
};

export const UNMATCHED_ROWS_OUTPUT_ROLE: ToolOutputRole = {
  canRouteToFamilies: ['Review / Validation'],
  description: 'Rows that did not match any keyword rule.',
  id: 'unmatched_rows',
  label: 'Unmatched rows',
  outputKey: 'unmatchedRows',
  outputType: 'unmatched_rows',
  samplePreview: '0 rows',
};

export const LOW_CONFIDENCE_ROWS_OUTPUT_ROLE: ToolOutputRole = {
  canRouteToFamilies: ['Review / Validation'],
  description: 'Rows below the configured confidence threshold.',
  id: 'low_confidence_rows',
  label: 'Low-confidence rows',
  outputKey: 'lowConfidenceRows',
  outputType: 'low_confidence_rows',
  samplePreview: '1 row',
};

export const CONFLICTS_OUTPUT_ROLE: ToolOutputRole = {
  canRouteToFamilies: ['Review / Validation'],
  description: 'Rows that matched multiple mapping rules.',
  id: 'conflicts',
  label: 'Conflicts',
  outputKey: 'conflicts',
  outputType: 'conflicts',
  samplePreview: '0 conflicts',
};

export const SUBTOTAL_OUTPUT_ROLE: ToolOutputRole = {
  canRouteToFamilies: ['Protected', 'Review / Validation'],
  description: 'Deterministic aggregation subtotal.',
  id: 'subtotal',
  label: 'Subtotal',
  outputKey: 'subtotal',
  outputType: 'subtotal',
  samplePreview: 23_000,
};

export const INCLUDED_ROWS_OUTPUT_ROLE: ToolOutputRole = {
  canRouteToFamilies: ['Output', 'Review / Validation'],
  description: 'Rows included in the aggregation.',
  id: 'included_rows',
  label: 'Included rows',
  outputKey: 'includedRows',
  outputType: 'included_rows',
};

export const EXCLUDED_ROWS_OUTPUT_ROLE: ToolOutputRole = {
  canRouteToFamilies: ['Output', 'Review / Validation'],
  description: 'Rows excluded from the aggregation.',
  id: 'excluded_rows',
  label: 'Excluded rows',
  outputKey: 'excludedRows',
  outputType: 'excluded_rows',
};

export const REVIEW_STATUS_OUTPUT_ROLE: ToolOutputRole = {
  canRouteToFamilies: ['Protected', 'Output'],
  description: 'Pass, warning, or approval status from local review.',
  id: 'review_status',
  label: 'Review status',
  outputType: 'review_status',
  samplePreview: 'pass',
};

export const VALIDATION_RESULT_OUTPUT_ROLE: ToolOutputRole = {
  canRouteToFamilies: ['Review / Validation', 'Protected', 'Output'],
  description: 'Structured validation result from a review check.',
  id: 'validation_result',
  label: 'Validation result',
  outputKey: 'validationResult',
  outputType: 'validation_result',
  samplePreview: 'pass',
};

export const APPROVAL_STATUS_OUTPUT_ROLE: ToolOutputRole = {
  canRouteToFamilies: ['Protected', 'Output'],
  description: 'Explicit approval decision for a candidate value.',
  id: 'approval_status',
  label: 'Approval status',
  outputKey: 'approvalStatus',
  outputType: 'approval_status',
  samplePreview: 'approved',
};

export const REVIEWED_EXCHANGE_RATE_OUTPUT_ROLE: ToolOutputRole = {
  canRouteToFamilies: ['Logic', 'Protected', 'Output'],
  description: 'Reviewed FX rate, including override metadata when used.',
  id: 'reviewed_exchange_rate',
  label: 'Reviewed exchange rate',
  outputKey: 'exchangeRateInfo',
  outputType: 'exchange_rate',
  samplePreview: 'USD -> CAD 1.35',
};

export const GOVERNED_VALUE_OUTPUT_ROLE: ToolOutputRole = {
  canRouteToFamilies: ['Output'],
  description: 'Governed value with runtime lock metadata when final.',
  id: 'governed_value',
  label: 'Governed value',
  outputKey: 'governedValue',
  outputType: 'governed_value',
  samplePreview: 23_000,
};

export const PROTECTED_RESULT_OUTPUT_ROLE: ToolOutputRole = {
  canRouteToFamilies: ['Output'],
  description: 'Named protected result with finality and runtime lock state.',
  id: 'protected_result',
  label: 'Protected result',
  outputKey: 'protectedResult',
  outputType: 'protected_result',
  samplePreview: 'Z = 100 USD',
};

export const OUTPUT_PACKAGE_ROLE: ToolOutputRole = {
  canRouteToFamilies: [],
  description: 'Local preview package only; no external export.',
  id: 'output_package',
  label: 'Output package',
  outputType: 'output_package',
  samplePreview: 'local preview',
};
