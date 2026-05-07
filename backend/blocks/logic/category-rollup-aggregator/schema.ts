import type { RollupRule } from "../../source/rollup-rules/schema";
import { normalizeRollupRule } from "../../source/rollup-rules/schema";
import type { HierarchyMappedRow } from "../hierarchy-aggregator/schema";
import { collectMappedRowsFromBackendInput } from "../hierarchy-aggregator/schema";

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function rollupRuleFromRecord(
  record: Record<string, unknown>,
  index: number
): RollupRule | null {
  const rule = normalizeRollupRule(record, index);
  return rule
    ? {
        ...rule,
        evidenceRefs: Array.isArray(record.evidenceRefs)
          ? (record.evidenceRefs as RollupRule["evidenceRefs"])
          : undefined,
        sourceTrace: Array.isArray(record.sourceTrace)
          ? (record.sourceTrace as RollupRule["sourceTrace"])
          : undefined,
      }
    : null;
}

export function collectRollupRulesFromBackendInput(
  value: unknown
): RollupRule[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => asRecord(item))
      .filter((item): item is Record<string, unknown> => Boolean(item))
      .map(rollupRuleFromRecord)
      .filter((rule): rule is RollupRule => Boolean(rule));
  }

  const record = asRecord(value);
  if (!record) {
    return [];
  }

  for (const key of [
    "rollupRules",
    "rollup_rules",
    "aggregationRules",
    "aggregation_rules",
    "rules",
  ]) {
    const rules = record[key];
    if (Array.isArray(rules)) {
      return collectRollupRulesFromBackendInput(rules);
    }
  }

  return [];
}

export function collectMappedRowsFromRollupInput(
  value: unknown
): HierarchyMappedRow[] {
  return collectMappedRowsFromBackendInput(value);
}
