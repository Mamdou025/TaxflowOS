import type { BlockFamily, BlockSubtype } from '@workspace/workflow-contracts/domain/block-types';
import type { WorkflowBlock } from '@workspace/workflow-contracts/domain/workflow-types';

const TABLE_SOURCE_CATALOG_IDS = new Set(['source:database-query', 'source:excel-workbook']);
const TABLE_SOURCE_SUBTYPES = new Set<BlockSubtype>(['Database Query', 'Excel / Workbook']);

const LOGIC_TOOL_BY_SUBTYPE: Partial<Record<BlockSubtype, string>> = {
  Aggregation: 'logic.aggregation',
  'API Response Parser': 'logic.api_response_parser',
  'Calculation Engine': 'logic.calculation_engine',
  'Category Rollup Aggregator': 'logic.category_rollup_aggregator',
  'Classification / Mapping': 'logic.keyword_mapper',
  'Excel Table Reader': 'logic.excel_table_reader',
  Formula: 'logic.formula',
  'Hierarchy Aggregator': 'logic.hierarchy_aggregator',
  'OCR Extractor': 'logic.ocr_extract',
  'PDF Table Parser': 'logic.pdf_table_parser',
  'PDF Text Parser': 'logic.pdf_text_parser',
  Transformation: 'logic.transformation',
};

const REVIEW_TOOL_BY_SUBTYPE: Partial<Record<BlockSubtype, string>> = {
  'Approval Gate': 'review.approval_gate',
  'Formula Consistency Check': 'review.formula_consistency_check',
  'Low Confidence Warning': 'review.low_confidence_warning',
  'Output Readiness Check': 'review.output_readiness_check',
  'Unmatched Rows Check': 'review.unmatched_rows_check',
};

const OUTPUT_TOOL_BY_SUBTYPE: Partial<Record<BlockSubtype, string>> = {
  'Canonical JSON': 'output.canonical_json',
  'CSV Export': 'output.csv_export',
  'Excel Export': 'output.excel_export',
  'PDF Report': 'output.pdf_report',
  'Taxprep Handoff': 'output.taxprep_handoff',
  'ONESOURCE Handoff': 'output.onesource_handoff',
};

const TRIGGER_TOOL_BY_SUBTYPE: Partial<Record<BlockSubtype, string>> = {
  'Manual / On Demand': 'trigger.manual',
  'Schedule / Cron': 'trigger.schedule',
  'Webhook / API Event': 'trigger.webhook',
};

function getSourceToolId(block: WorkflowBlock) {
  if (block.config.sourceKind === 'fapi_inputs' || block.config.toolId === 'source.fapi_inputs')
    return 'source.fapi_inputs';
  if (block.config.sourceKind === 'currency_rate' || block.catalogId === 'source:currency-rate')
    return 'source.currency_rate';
  if (
    block.config.sourceKind === 'http_json' ||
    block.config.toolId === 'source.http_json' ||
    block.catalogId === 'source:api-http-request'
  )
    return 'source.http_json';
  if (
    block.config.sourceKind === 'aggregation_rules' ||
    block.catalogId === 'source:aggregation-rules'
  )
    return 'source.aggregation_rules';
  if (block.config.sourceKind === 'rollup_rules' || block.catalogId === 'source:rollup-rules')
    return 'source.rollup_rules';
  if (
    block.config.sourceKind === 'calculation_rules' ||
    block.catalogId === 'source:calculation-rules'
  )
    return 'source.calculation_rules';
  if (block.config.sourceKind === 'keyword_rules' || block.catalogId === 'source:keyword-rules')
    return 'source.keyword_rules';

  const specialised: [string, BlockSubtype, string][] = [
    ['web_url', 'Web / URL', 'source.web_url'],
    ['pdf_document', 'PDF / Document', 'source.pdf_document'],
    ['database_query', 'Database Query', 'source.database_query'],
    ['ai_search', 'AI Search Result', 'source.ai_search'],
  ];
  for (const [sourceKind, subtype, toolId] of specialised)
    if (block.config.sourceKind === sourceKind || block.subtype === subtype) return toolId;

  if (
    TABLE_SOURCE_CATALOG_IDS.has(block.catalogId || '') ||
    TABLE_SOURCE_SUBTYPES.has(block.subtype)
  )
    return 'source.manual_table';
  return 'source.manual_value';
}

const TOOL_RESOLVERS_BY_FAMILY: Partial<Record<BlockFamily, (block: WorkflowBlock) => string>> = {
  Field: () => 'field.field_block',
  Logic: (block) => LOGIC_TOOL_BY_SUBTYPE[block.subtype] || 'logic.transformation',
  Output: (block) => OUTPUT_TOOL_BY_SUBTYPE[block.subtype] || 'output.evidence_pack_preview',
  Protected: (block) =>
    block.subtype === 'Protected Input' || block.subtype === 'Locked Rate'
      ? 'protected.protected_input'
      : 'protected.protected_result',
  'Review / Validation': (block) =>
    REVIEW_TOOL_BY_SUBTYPE[block.subtype] || 'review.required_input_check',
  Source: getSourceToolId,
  Trigger: (block) => TRIGGER_TOOL_BY_SUBTYPE[block.subtype] || 'trigger.manual',
};

export function getToolIdForBlock(block: WorkflowBlock): string {
  if (typeof block.config.toolId === 'string') return block.config.toolId;
  return TOOL_RESOLVERS_BY_FAMILY[block.family]?.(block) || 'ai.proposal_only';
}
