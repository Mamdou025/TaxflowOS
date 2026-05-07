import type { EvidenceRef, SourceTraceRef } from "../../../runtime/types";

const LIST_DELIMITER_REGEX = /[,;\n|]/;

export type RollupOperation = "sum" | "sum_abs";

export type RollupRule = {
  rollupId: string;
  label: string;
  operation: RollupOperation;
  includeCategoryIds: string[];
  description?: string;
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
      .flatMap((item) => String(item).split(LIST_DELIMITER_REGEX))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(LIST_DELIMITER_REGEX)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parseOperation(value: unknown): RollupOperation {
  return value === "sum_abs" ? "sum_abs" : "sum";
}

function humanizeId(value: string) {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function normalizeRollupRule(
  value: unknown,
  index: number
): RollupRule | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const rollupId =
    optionalString(record.rollupId) ||
    optionalString(record.nodeId) ||
    optionalString(record.id);
  const includeCategoryIds = asStringArray(
    record.includeCategoryIds || record.categories || record.categoryIds
  );

  if (!(rollupId && includeCategoryIds.length > 0)) {
    return null;
  }

  return {
    description: optionalString(record.description),
    includeCategoryIds,
    label:
      optionalString(record.label) ||
      optionalString(record.name) ||
      humanizeId(rollupId || `rollup_${index + 1}`),
    operation: parseOperation(record.operation),
    rollupId,
  };
}

export function parseRollupRules({
  config,
  fallbackRules,
}: {
  config: Record<string, unknown>;
  fallbackRules: RollupRule[];
}) {
  const ruleSource =
    config.rollupRules ||
    config.rollup_rules ||
    config.aggregationRules ||
    config.rules;

  if (!Array.isArray(ruleSource)) {
    return fallbackRules.map((rule) => ({
      ...rule,
      includeCategoryIds: [...rule.includeCategoryIds],
    }));
  }

  const rules = ruleSource
    .map(normalizeRollupRule)
    .filter((rule): rule is RollupRule => Boolean(rule));

  return rules.length > 0
    ? rules
    : fallbackRules.map((rule) => ({
        ...rule,
        includeCategoryIds: [...rule.includeCategoryIds],
      }));
}
