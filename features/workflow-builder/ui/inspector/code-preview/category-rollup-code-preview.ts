import { inputSummary, lines } from "./preview-utils";
import type {
  BlockCodePreview,
  GenerateBlockCodePreviewOptions,
} from "./types";

export function categoryRollupCodePreview({
  inputBindings,
}: GenerateBlockCodePreviewOptions): BlockCodePreview {
  return {
    code: lines(
      "const mappedRows = inputs.mapped_rows;",
      "const rollupRules = inputs.rollup_rules;",
      "",
      "const rowsByCategory = groupBy(mappedRows, 'categoryId');",
      "const categoryTotals = Object.fromEntries(",
      "  Object.entries(rowsByCategory).map(([categoryId, rows]) => [",
      "    categoryId,",
      "    sum(rows.map((row) => row.amount)),",
      "  ])",
      ");",
      "",
      "const rollupTotals = {};",
      "const rollupFormulaTrace = {};",
      "",
      "for (const rule of rollupRules) {",
      "  const values = rule.includeCategoryIds.map((categoryId) => ({",
      "    categoryId,",
      "    value: categoryTotals[categoryId] ?? 0,",
      "  }));",
      "  rollupTotals[rule.rollupId] = values.reduce((total, item) => {",
      "    return total + (rule.operation === 'sum_abs' ? Math.abs(item.value) : item.value);",
      "  }, 0);",
      "  rollupFormulaTrace[rule.rollupId] = { operation: rule.operation, inputValues: values, result: rollupTotals[rule.rollupId] };",
      "}",
      "",
      "outputs.category_totals = categoryTotals;",
      "outputs.rollup_totals = rollupTotals;",
      "outputs.named_values = { ...categoryTotals, ...rollupTotals };",
      "outputs.rollup_formula_trace = rollupFormulaTrace;"
    ),
    editable: false,
    explanation:
      "This Logic block groups mapped rows by category and applies rollup rules. It does not evaluate final formulas, caps, FX, or protected-result logic.",
    language: "typescript_preview",
    resolvedConfig: {
      supportedOperations: ["sum", "sum_abs"],
    },
    resolvedInputs: inputSummary(inputBindings),
    title: "Generated Category Rollup Logic",
  };
}
