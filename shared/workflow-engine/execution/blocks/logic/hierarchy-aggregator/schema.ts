import type { SourceTraceRef } from "../../../runtime/types";
import {
  type AggregationRule,
  normalizeAggregationRule,
} from "../../source/aggregation-rules/schema";
import type { ManualTableRow } from "../../source/manual-table/schema";

export type HierarchyMappedRow = ManualTableRow & {
  categoryId: string;
  categoryLabel: string;
  confidence?: number;
  matchedKeyword?: string;
  matchedRuleId?: string;
  ruleId?: string;
  sourceRow?: ManualTableRow;
  ruleTrace?: SourceTraceRef[];
  ruleSourceTrace?: SourceTraceRef[];
  status?: string;
};

const NUMBER_PATTERN = /-?\d+(\.\d+)?/;

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

  const match = value.trim().match(NUMBER_PATTERN);
  if (!match) {
    return null;
  }

  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalTraceArray(value: unknown) {
  return Array.isArray(value) ? (value as SourceTraceRef[]) : undefined;
}

function optionalRowNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function rowFromRecord(
  record: Record<string, unknown>,
  index: number
): HierarchyMappedRow | null {
  const amount =
    parseNumber(record.amount) ??
    parseNumber(record.value) ??
    parseNumber(record.subtotal);
  const categoryId =
    optionalString(record.categoryId) ||
    optionalString(record.target) ||
    optionalString(record.subsectionId);

  if (amount === null || !categoryId) {
    return null;
  }

  return {
    account: optionalString(record.account),
    amount,
    categoryId,
    categoryLabel:
      optionalString(record.categoryLabel) || categoryId.replaceAll("_", " "),
    confidence: parseNumber(record.confidence) ?? undefined,
    currency: optionalString(record.currency),
    description: optionalString(record.description),
    evidenceRefs: Array.isArray(record.evidenceRefs)
      ? (record.evidenceRefs as HierarchyMappedRow["evidenceRefs"])
      : undefined,
    label: String(record.label || record.name || `Mapped row ${index + 1}`),
    matchedKeyword: optionalString(record.matchedKeyword),
    matchedRuleId: optionalString(record.matchedRuleId),
    metadata: asRecord(record.metadata) || undefined,
    raw: asRecord(record.raw) || undefined,
    rowId: String(record.rowId || record.id || `mapped-row-${index + 1}`),
    rowNumber: optionalRowNumber(record.rowNumber),
    ruleId: optionalString(record.ruleId),
    ruleSourceTrace: optionalTraceArray(record.ruleSourceTrace),
    ruleTrace: optionalTraceArray(record.ruleTrace),
    sourceRow: asRecord(record.sourceRow) as ManualTableRow | undefined,
    sourceTrace: optionalTraceArray(record.sourceTrace),
    status: optionalString(record.status),
  };
}

export function collectMappedRowsFromBackendInput(
  value: unknown
): HierarchyMappedRow[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => asRecord(item))
      .filter((item): item is Record<string, unknown> => Boolean(item))
      .map(rowFromRecord)
      .filter((row): row is HierarchyMappedRow => Boolean(row));
  }

  const record = asRecord(value);
  if (!record) {
    return [];
  }

  for (const key of ["mappedRows", "mapped_rows", "rows"]) {
    const rows = record[key];
    if (Array.isArray(rows)) {
      return collectMappedRowsFromBackendInput(rows);
    }
  }

  return [];
}

function aggregationRuleFromRecord(
  record: Record<string, unknown>,
  index: number
): AggregationRule | null {
  const rule = normalizeAggregationRule(record, index);

  return rule
    ? {
        ...rule,
        evidenceRefs: Array.isArray(record.evidenceRefs)
          ? (record.evidenceRefs as AggregationRule["evidenceRefs"])
          : undefined,
        sourceTrace: optionalTraceArray(record.sourceTrace),
      }
    : null;
}

export function collectAggregationRulesFromBackendInput(
  value: unknown
): AggregationRule[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => asRecord(item))
      .filter((item): item is Record<string, unknown> => Boolean(item))
      .map(aggregationRuleFromRecord)
      .filter((rule): rule is AggregationRule => Boolean(rule));
  }

  const record = asRecord(value);
  if (!record) {
    return [];
  }

  for (const key of [
    "aggregationRules",
    "aggregation_rules",
    "rules",
    "nodes",
  ]) {
    const rules = record[key];
    if (Array.isArray(rules)) {
      return collectAggregationRulesFromBackendInput(rules);
    }
  }

  return [];
}
