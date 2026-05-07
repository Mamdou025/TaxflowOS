import type { EvidenceRef, SourceTraceRef } from "../../../runtime/types";

const SIGN_PREFIX_REGEX = /^[+-]/;

export type AggregationNodeType =
  | "category_total"
  | "constant"
  | "final_result"
  | "formula"
  | "group";

export type AggregationOperation =
  | "add"
  | "divide"
  | "max_subtract_zero"
  | "min_multiply_cap"
  | "multiply"
  | "pass_through"
  | "subtract"
  | "sum"
  | "sum_abs";

export type AggregationOperand = {
  refType: "category" | "constant" | "input" | "node";
  refId?: string;
  value?: number;
  sign?: 1 | -1;
  label?: string;
};

export type AggregationRule = {
  nodeId: string;
  label: string;
  nodeType: AggregationNodeType;
  operation: AggregationOperation;
  children: string[];
  includeCategoryIds?: string[];
  operands?: AggregationOperand[];
  formulaExpression?: string;
  value?: number;
  outputRole?: string;
  resultName?: string;
  description?: string;
  order?: number;
  evidenceRefs?: EvidenceRef[];
  sourceTrace?: SourceTraceRef[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parseNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== "string") {
    return;
  }
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseNodeType(value: unknown): AggregationNodeType {
  if (
    value === "category_total" ||
    value === "constant" ||
    value === "final_result" ||
    value === "formula" ||
    value === "group"
  ) {
    return value;
  }
  if (value === "category") {
    return "category_total";
  }
  return "group";
}

function parseOperation(value: unknown): AggregationOperation {
  if (
    value === "add" ||
    value === "divide" ||
    value === "max_subtract_zero" ||
    value === "min_multiply_cap" ||
    value === "multiply" ||
    value === "pass_through" ||
    value === "subtract" ||
    value === "sum" ||
    value === "sum_abs"
  ) {
    return value;
  }
  return "sum";
}

function normalizeStringOperand(value: string): AggregationOperand | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const sign = trimmed.startsWith("-") ? -1 : 1;
  const token = trimmed.replace(SIGN_PREFIX_REGEX, "").trim();
  const [prefix, ...rest] = token.split(":");
  const body = rest.length > 0 ? rest.join(":").trim() : prefix.trim();
  const normalizedPrefix = rest.length > 0 ? prefix.trim().toLowerCase() : "";
  if (normalizedPrefix === "category") {
    return { refId: body, refType: "category", sign };
  }
  if (normalizedPrefix === "constant" || normalizedPrefix === "value") {
    return { refType: "constant", sign, value: parseNumber(body) ?? 0 };
  }
  if (normalizedPrefix === "input") {
    return { refId: body, refType: "input", sign };
  }
  return { refId: body, refType: "node", sign };
}

function normalizeRecordOperand(
  record: Record<string, unknown>
): AggregationOperand | null {
  const refType =
    record.refType === "category" ||
    record.refType === "constant" ||
    record.refType === "input"
      ? record.refType
      : "node";
  const operand: AggregationOperand = {
    label: optionalString(record.label),
    refId: optionalString(record.refId),
    refType,
    sign: record.sign === -1 || record.sign === "-1" ? -1 : 1,
    value: parseNumber(record.value),
  };

  return operand.refId || operand.value !== undefined ? operand : null;
}

function normalizeOperand(value: unknown): AggregationOperand | null {
  if (typeof value === "string") {
    return normalizeStringOperand(value);
  }
  if (typeof value === "number" && Number.isFinite(value)) {
    return { refType: "constant", value };
  }

  const record = asRecord(value);
  return record ? normalizeRecordOperand(record) : null;
}

function parseOperands(value: unknown): AggregationOperand[] {
  if (Array.isArray(value)) {
    return value
      .map(normalizeOperand)
      .filter((operand): operand is AggregationOperand => Boolean(operand));
  }

  const refs = asStringArray(value);
  return refs.map((refId) => ({ refId, refType: "node" }));
}

export function normalizeAggregationRule(
  value: unknown,
  index: number
): AggregationRule | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const nodeId = optionalString(record.nodeId) || optionalString(record.id);
  if (!nodeId) {
    return null;
  }

  return {
    children: asStringArray(record.children),
    description: optionalString(record.description),
    includeCategoryIds: asStringArray(record.includeCategoryIds),
    label: optionalString(record.label) || `Aggregation node ${index + 1}`,
    nodeId,
    nodeType: parseNodeType(record.nodeType),
    operands: parseOperands(record.operands),
    formulaExpression:
      optionalString(record.formulaExpression) ||
      optionalString(record.expression),
    operation: parseOperation(record.operation),
    order: parseNumber(record.order),
    outputRole: optionalString(record.outputRole),
    resultName: optionalString(record.resultName),
    value: parseNumber(record.value),
  };
}

export function parseAggregationRules({
  config,
  fallbackRules,
}: {
  config: Record<string, unknown>;
  fallbackRules: AggregationRule[];
}): AggregationRule[] {
  const ruleSource =
    config.aggregationRules ||
    config.aggregation_rules ||
    config.rules ||
    config.nodes;

  if (!Array.isArray(ruleSource)) {
    return fallbackRules.map((rule) => ({
      ...rule,
      children: [...rule.children],
      includeCategoryIds: [...(rule.includeCategoryIds || [])],
      operands: [...(rule.operands || [])],
      formulaExpression: rule.formulaExpression,
    }));
  }

  const rules = ruleSource
    .map(normalizeAggregationRule)
    .filter((rule): rule is AggregationRule => Boolean(rule));

  return rules.length > 0
    ? rules
    : fallbackRules.map((rule) => ({
        ...rule,
        children: [...rule.children],
        includeCategoryIds: [...(rule.includeCategoryIds || [])],
        operands: [...(rule.operands || [])],
        formulaExpression: rule.formulaExpression,
      }));
}
