import { SUPPORTED_AGGREGATION_OPERATIONS } from "../../source-viewers/aggregation-rule-modes";
import { inputSummary, lines } from "./preview-utils";
import type {
  BlockCodePreview,
  GenerateBlockCodePreviewOptions,
} from "./types";

export function hierarchyAggregatorCodePreview({
  inputBindings,
}: GenerateBlockCodePreviewOptions): BlockCodePreview {
  return {
    code: lines(
      "// A. Category grouping",
      "const mappedRows = inputs.mapped_rows;",
      "const aggregationRules = inputs.aggregation_rules;",
      "const optionalInputs = {",
      "  ...inputs.fapi_inputs,",
      "  ...inputs.protected_inputs,",
      "};",
      "",
      "const rowsByCategory = groupBy(mappedRows, 'categoryId');",
      "const categoryTotals = sumEachCategory(rowsByCategory);",
      "",
      "// B. Rollup node evaluation",
      "const rollupNodes = aggregationRules.filter(isRollupNode);",
      "const rollupTotals = evaluateNodesInDependencyOrder({",
      "  categoryTotals,",
      "  rules: rollupNodes,",
      "  supportedOperations: [",
      ...SUPPORTED_AGGREGATION_OPERATIONS.map(
        (operation) => `    '${operation}',`
      ),
      "  ],",
      "  onMissingReference: 'warn_and_zero',",
      "  onDivideByZero: 'warn_and_mark_needs_review',",
      "});",
      "",
      "// C. Formula node evaluation",
      "const formulaNodes = aggregationRules.filter(isFormulaOrConstantNode);",
      "const nodeTotals = evaluateFormulaNodes({",
      "  categoryTotals,",
      "  rollupTotals,",
      "  rules: formulaNodes,",
      "  inputs: optionalInputs,",
      "  formulaExpressionRefs: ['category:', 'node:', 'input:', 'fapi:'],",
      "});",
      "",
      "// Example supported formulas:",
      "const incomeAfterExpenses = node('income_base') - node('expense_base');",
      "const fapiBrut = Math.max(node('Gross') - node('Deductions'), 0);",
      "const fatDeduction = Math.min(Math.max(input('fatPaid'), 0) * input('rtf'), fapiBrut);",
      "",
      "// D. Final result output",
      "const officialLineValues = pickOfficialLineOutputs(nodeTotals, aggregationRules);",
      "const finalTotals = pickFinalResults(nodeTotals, aggregationRules);",
      "",
      "// E. Formula trace",
      "const formulaTrace = traceFormulaForEachNode(nodeTotals, {",
      "  includeInputs: true,",
      "  includeWarnings: true,",
      "});",
      "",
      "outputs.category_totals = categoryTotals;",
      "outputs.node_totals = nodeTotals;",
      "outputs.group_totals = rollupTotals;",
      "outputs.official_line_values = officialLineValues;",
      "outputs.final_totals = finalTotals;",
      "outputs.aggregation_tree = buildAggregationTree(aggregationRules, nodeTotals);",
      "outputs.included_rows_by_node = collectIncludedRows(nodeTotals);",
      "outputs.excluded_rows = findRowsOutsideFinalResults(mappedRows, finalTotals);",
      "outputs.formula_trace = formulaTrace;",
      "outputs.aggregation_summary = summarizeAggregation(outputs);"
    ),
    editable: false,
    explanation:
      "This Logic block is the v1 Rollup & Calculation Engine. It groups mapped categories, evaluates rollup/formula/constant/final-result nodes, and emits category totals, node totals, final totals, official line values, and formula trace.",
    language: "typescript_preview",
    resolvedConfig: {
      operation: "sum",
    },
    resolvedInputs: inputSummary(inputBindings),
    title: "Generated Rollup & Calculation Logic",
  };
}
