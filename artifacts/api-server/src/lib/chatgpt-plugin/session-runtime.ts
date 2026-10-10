import { randomUUID } from 'node:crypto';
import { LOCAL_TOOL_REGISTRY } from '@workspace/workflow-executors/tools/registry';
import { getToolIdForBlock } from '@workspace/workflow-core/tool-resolution';
import type { GraphRuntime } from '@workspace/workflow-core/ports';

// Explicit local/captured-data executors. Network, database, agent delegation and
// remote connector acquisition require their own authenticated server adapters.
const allowed = new Set([
  'trigger.manual',
  'source.manual_value',
  'source.manual_table',
  'source.fapi_inputs',
  'source.currency_rate',
  'source.http_json',
  'source.pdf_document',
  'source.keyword_rules',
  'source.aggregation_rules',
  'source.rollup_rules',
  'source.calculation_rules',
  'logic.keyword_mapper',
  'logic.keyword_classifier',
  'logic.category_rollup_aggregator',
  'logic.calculation_engine',
  'logic.hierarchy_aggregator',
  'logic.aggregation',
  'logic.formula',
  'logic.transformation',
  'logic.excel_table_reader',
  'logic.pdf_text_parser',
  'logic.pdf_table_parser',
  'logic.api_response_parser',
  'field.field_block',
  'review.required_input_check',
  'review.unmatched_rows_check',
  'review.low_confidence_warning',
  'review.confidence_check',
  'review.formula_consistency_check',
  'review.fx_rate_review',
  'review.approval_gate',
  'review.output_readiness_check',
  'output.canonical_json',
  'output.csv_export',
  'output.excel_export',
  'output.evidence_pack_preview',
]);

export const sessionRuntime: GraphRuntime = {
  createId: (prefix) => `${prefix}:${randomUUID()}`,
  resolveToolId: getToolIdForBlock,
  getTool: (id) => (allowed.has(id) ? (LOCAL_TOOL_REGISTRY[id] ?? null) : null),
};
