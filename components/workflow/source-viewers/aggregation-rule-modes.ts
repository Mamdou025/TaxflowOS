export const SUPPORTED_AGGREGATION_OPERATIONS = [
  "sum",
  "sum_abs",
  "add",
  "subtract",
  "multiply",
  "divide",
  "pass_through",
  "max_subtract_zero",
  "min_multiply_cap",
] as const;

export type AggregationRuleMode =
  | "constant"
  | "final_result"
  | "formula"
  | "official_line"
  | "rollup";

export const AGGREGATION_RULE_MODE_LABELS: Record<AggregationRuleMode, string> =
  {
    constant: "Constant",
    final_result: "Final result",
    formula: "Formula",
    official_line: "Official line",
    rollup: "Rollup",
  };

export const AGGREGATION_RULE_MODE_DESCRIPTIONS: Record<
  AggregationRuleMode,
  string
> = {
  constant: "Provides a reusable numeric value.",
  final_result: "Exposes a named result to Protected and Output blocks.",
  formula:
    "Combines categories, nodes, inputs, constants, or expressions with calculator operations.",
  official_line: "Exposes a fiscal or worksheet line value for downstream use.",
  rollup: "Groups mapped categories or child nodes into a subtotal.",
};

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

export function getAggregationRuleMode(
  rule: Record<string, unknown>
): AggregationRuleMode {
  const nodeType = asString(rule.nodeType).toLowerCase();
  const outputRole = asString(rule.outputRole).toLowerCase();
  const resultName = asString(rule.resultName);
  const formulaExpression = asString(rule.formulaExpression || rule.expression);

  if (outputRole === "official_line") {
    return "official_line";
  }
  if (nodeType === "final_result") {
    return "final_result";
  }
  if (nodeType === "constant") {
    return "constant";
  }
  if (nodeType === "formula" || formulaExpression) {
    return "formula";
  }
  if (resultName && outputRole) {
    return "official_line";
  }
  return "rollup";
}

export function getAggregationRuleModeLabel(rule: Record<string, unknown>) {
  return AGGREGATION_RULE_MODE_LABELS[getAggregationRuleMode(rule)];
}

export function getAggregationRuleModeDescription(
  rule: Record<string, unknown>
) {
  return AGGREGATION_RULE_MODE_DESCRIPTIONS[getAggregationRuleMode(rule)];
}
