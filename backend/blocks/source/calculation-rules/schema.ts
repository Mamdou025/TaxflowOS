import type { EvidenceRef, SourceTraceRef } from "../../../runtime/types";

const LIST_DELIMITER_REGEX = /[,;\n|]/;

export type CalculationOperation =
  | "abs"
  | "add"
  | "divide"
  | "max"
  | "max_subtract_zero"
  | "min"
  | "min_multiply_cap"
  | "multiply"
  | "pass_through"
  | "round"
  | "subtract";

export type CalculationOperand = string | number;

export type CalculationRule = {
  calculationId: string;
  label: string;
  operation: CalculationOperation;
  operands: CalculationOperand[];
  resultKey: string;
  description?: string;
  evidenceRefs?: EvidenceRef[];
  formulaExpression?: string;
  sourceTrace?: SourceTraceRef[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== "string") {
    return null;
  }
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function parseOperand(value: unknown): CalculationOperand | null {
  const numericValue = parseNumber(value);
  if (numericValue !== null) {
    return numericValue;
  }
  return optionalString(value) || null;
}

function parseOperands(value: unknown): CalculationOperand[] {
  if (Array.isArray(value)) {
    return value
      .map(parseOperand)
      .filter((operand): operand is CalculationOperand => operand !== null);
  }

  if (typeof value === "string") {
    return value
      .split(LIST_DELIMITER_REGEX)
      .map(parseOperand)
      .filter((operand): operand is CalculationOperand => operand !== null);
  }

  return [];
}

function parseOperation(value: unknown): CalculationOperation {
  if (
    value === "abs" ||
    value === "add" ||
    value === "divide" ||
    value === "max" ||
    value === "max_subtract_zero" ||
    value === "min" ||
    value === "min_multiply_cap" ||
    value === "multiply" ||
    value === "pass_through" ||
    value === "round" ||
    value === "subtract"
  ) {
    return value;
  }
  return "add";
}

function humanizeId(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function normalizeCalculationRule(
  value: unknown,
  index: number
): CalculationRule | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const calculationId =
    optionalString(record.calculationId) ||
    optionalString(record.nodeId) ||
    optionalString(record.id);
  const resultKey =
    optionalString(record.resultKey) ||
    optionalString(record.resultName) ||
    calculationId;
  const operands = parseOperands(record.operands);

  if (!(calculationId && resultKey)) {
    return null;
  }

  return {
    calculationId,
    description: optionalString(record.description),
    formulaExpression:
      optionalString(record.formulaExpression) ||
      optionalString(record.expression),
    label:
      optionalString(record.label) ||
      optionalString(record.name) ||
      humanizeId(calculationId || `calculation_${index + 1}`),
    operands,
    operation: parseOperation(record.operation),
    resultKey,
  };
}

export function parseCalculationRules({
  config,
  fallbackRules,
}: {
  config: Record<string, unknown>;
  fallbackRules: CalculationRule[];
}) {
  const ruleSource =
    config.calculationRules ||
    config.calculation_rules ||
    config.rules ||
    config.nodes;

  if (!Array.isArray(ruleSource)) {
    return fallbackRules.map((rule) => ({
      ...rule,
      operands: [...rule.operands],
    }));
  }

  const rules = ruleSource
    .map(normalizeCalculationRule)
    .filter((rule): rule is CalculationRule => Boolean(rule));

  return rules.length > 0
    ? rules
    : fallbackRules.map((rule) => ({
        ...rule,
        operands: [...rule.operands],
      }));
}
