import type {
  CalculationOperand,
  CalculationRule,
} from "../../source/calculation-rules/schema";
import { normalizeCalculationRule } from "../../source/calculation-rules/schema";

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
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

function calculationRuleFromRecord(
  record: Record<string, unknown>,
  index: number
): CalculationRule | null {
  const rule = normalizeCalculationRule(record, index);
  return rule
    ? {
        ...rule,
        evidenceRefs: Array.isArray(record.evidenceRefs)
          ? (record.evidenceRefs as CalculationRule["evidenceRefs"])
          : undefined,
        sourceTrace: Array.isArray(record.sourceTrace)
          ? (record.sourceTrace as CalculationRule["sourceTrace"])
          : undefined,
      }
    : null;
}

export function collectCalculationRulesFromBackendInput(
  value: unknown
): CalculationRule[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => asRecord(item))
      .filter((item): item is Record<string, unknown> => Boolean(item))
      .map(calculationRuleFromRecord)
      .filter((rule): rule is CalculationRule => Boolean(rule));
  }

  const record = asRecord(value);
  if (!record) {
    return [];
  }

  for (const key of [
    "calculationRules",
    "calculation_rules",
    "rules",
    "nodes",
  ]) {
    const rules = record[key];
    if (Array.isArray(rules)) {
      return collectCalculationRulesFromBackendInput(rules);
    }
  }

  return [];
}

function collectNumericEntries(target: Record<string, number>, value: unknown) {
  const record = asRecord(value);
  if (!record) {
    return;
  }

  for (const [key, item] of Object.entries(record)) {
    const numberValue = parseNumber(item);
    // Skip null AND undefined — an absent value must not clobber a value
    // supplied by an earlier input role (e.g. rollup-derived named values).
    if (numberValue !== null && numberValue !== undefined) {
      target[key] = numberValue;
    }
  }
}

function collectNumericEntryGroups(
  target: Record<string, number>,
  record: Record<string, unknown>
) {
  for (const key of [
    "namedValues",
    "named_values",
    "categoryTotals",
    "category_totals",
    "rollupTotals",
    "rollup_totals",
    "calculatedResults",
    "calculated_results",
    "finalTotals",
    "final_totals",
    "officialLineValues",
    "official_line_values",
    "fapiInputs",
    "fapi_inputs",
  ]) {
    collectNumericEntries(target, record[key]);
    const nestedRecord = asRecord(record[key]);
    if (nestedRecord) {
      collectInputAliases(target, nestedRecord);
      collectRateAliases(target, nestedRecord);
    }
  }
}

function collectInputAliases(
  target: Record<string, number>,
  record: Record<string, unknown>
) {
  const fatPaid = parseNumber(record.fatPaid) ?? parseNumber(record.FAT_PAID);
  if (fatPaid !== null) {
    target.FAT_PAID = fatPaid;
    target.fatPaid = fatPaid;
  }

  const rtf = parseNumber(record.rtf) ?? parseNumber(record.RTF);
  if (rtf !== null) {
    target.RTF = rtf;
    target.rtf = rtf;
  }

  const inclusionRate =
    parseNumber(record.inclusionRate) ?? parseNumber(record.INCLUSION_RATE);
  if (inclusionRate !== null) {
    target.INCLUSION_RATE = inclusionRate;
    target.inclusionRate = inclusionRate;
  }
}

function collectRateAliases(
  target: Record<string, number>,
  record: Record<string, unknown>
) {
  const rate =
    parseNumber(record.rate) ??
    parseNumber(record.exchange_rate) ??
    parseNumber(record.exchangeRate) ??
    parseNumber(record.overrideRate) ??
    parseNumber(record.fxRate) ??
    parseNumber(record.FX_RATE);
  if (rate !== null) {
    target.FX_RATE = rate;
    target.fxRate = rate;
  }
}

function getProtectedResultName(protectedResult: Record<string, unknown>) {
  if (typeof protectedResult.name === "string") {
    return protectedResult.name;
  }
  if (typeof protectedResult.resultName === "string") {
    return protectedResult.resultName;
  }
  return "";
}

function collectProtectedResultValue(
  target: Record<string, number>,
  record: Record<string, unknown>
) {
  const protectedResult = asRecord(record.protectedResult);
  if (!protectedResult) {
    return;
  }
  const protectedName = getProtectedResultName(protectedResult);
  const protectedValue = parseNumber(protectedResult.value);
  if (protectedName && protectedValue !== null) {
    target[protectedName] = protectedValue;
  }
}

export function collectNamedValuesFromBackendInput(value: unknown) {
  const namedValues: Record<string, number> = {};

  if (Array.isArray(value)) {
    for (const item of value) {
      for (const [key, itemValue] of collectNamedValuesFromBackendInput(item)) {
        namedValues[key] = itemValue;
      }
    }
    return Object.entries(namedValues);
  }

  const record = asRecord(value);
  if (!record) {
    return [];
  }

  collectNumericEntryGroups(namedValues, record);
  collectNumericEntries(namedValues, record);
  collectInputAliases(namedValues, record);
  collectProtectedResultValue(namedValues, record);
  collectRateAliases(namedValues, record);

  return Object.entries(namedValues);
}

export type ResolvedOperand = {
  operand: CalculationOperand;
  value: number;
  missing: boolean;
};
