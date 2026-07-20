import type { SourceTraceRef } from "../../../runtime/types";
import type { KeywordRule } from "../../source/keyword-rules/schema";
import type { ManualTableRow } from "../../source/manual-table/schema";

const KEYWORD_LIST_DELIMITER_REGEX = /[,;\n|]/;

export type KeywordMapperMatchField = "account" | "description" | "label";

export type KeywordMapperConflictStrategy =
  | "highest_confidence"
  | "highest_priority"
  | "send_conflict_to_review";

export type KeywordMapperUnmatchedStrategy =
  | "ignore"
  | "mark_as_unmapped"
  | "send_to_review";

export type KeywordMapperConfig = {
  matchFields: KeywordMapperMatchField[];
  matchMode: "contains" | "exact" | "starts_with" | "all_words";
  lowConfidenceThreshold: number;
  conflictStrategy: KeywordMapperConflictStrategy;
  unmatchedStrategy: KeywordMapperUnmatchedStrategy;
};

export type MappedKeywordRow = ManualTableRow & {
  categoryId: string;
  categoryLabel: string;
  confidence: number;
  matchedKeyword: string;
  matchedRuleId: string;
  ruleId: string;
  sourceRow: ManualTableRow;
  status: "mapped" | "low_confidence";
  suggestedSection?: string;
  suggestedLine?: string;
  suggestedSubsection?: string;
  target?: string;
  lineId?: string;
  sectionId?: string;
  subsectionId?: string;
  rowSourceTrace: SourceTraceRef[];
  ruleTrace: SourceTraceRef[];
  ruleSourceTrace: SourceTraceRef[];
};

export type UnmatchedKeywordRow = ManualTableRow & {
  categoryId: "unmatched";
  categoryLabel: "Unmatched";
  confidence: number;
  status: "unmatched";
};

export type KeywordMapperConflict = {
  rowId: string;
  label: string;
  matchedRuleIds: string[];
  strategy: KeywordMapperConflictStrategy;
};

export type KeywordMappingSummary = {
  totalRows: number;
  mappedCount: number;
  unmatchedCount: number;
  lowConfidenceCount: number;
  conflictCount: number;
  rulesUsedCount: number;
  categoryCounts: Record<string, number>;
  categoryAmountTotals: Record<string, number>;
  ruleSourceCount: number;
};

function humanizeCategoryId(categoryId: string) {
  return categoryId
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function optionalTraceArray(value: unknown) {
  return Array.isArray(value) ? (value as SourceTraceRef[]) : undefined;
}

function getSuggestedString(
  record: Record<string, unknown>,
  suggestedKey: string,
  fallbackKey: string
) {
  return (
    optionalString(record[suggestedKey]) || optionalString(record[fallbackKey])
  );
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => String(item).split(KEYWORD_LIST_DELIMITER_REGEX))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(KEYWORD_LIST_DELIMITER_REGEX)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
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

function parseMatchFields(value: unknown): KeywordMapperMatchField[] {
  const allowed = new Set<KeywordMapperMatchField>([
    "account",
    "description",
    "label",
  ]);
  const fields = asStringArray(value).filter(
    (field): field is KeywordMapperMatchField =>
      allowed.has(field as KeywordMapperMatchField)
  );

  return fields.length > 0 ? fields : ["account", "label", "description"];
}

function parseConflictStrategy(value: unknown): KeywordMapperConflictStrategy {
  if (
    value === "highest_priority" ||
    value === "highest priority wins" ||
    value === "highest priority"
  ) {
    return "highest_priority";
  }

  if (
    value === "send_conflict_to_review" ||
    value === "send conflict to review"
  ) {
    return "send_conflict_to_review";
  }

  return "highest_confidence";
}

function parseUnmatchedStrategy(
  value: unknown
): KeywordMapperUnmatchedStrategy {
  if (value === "ignore") {
    return "ignore";
  }

  if (value === "mark_as_unmapped" || value === "mark as unmapped") {
    return "mark_as_unmapped";
  }

  return "send_to_review";
}

function parseMatchMode(value: unknown): KeywordMapperConfig["matchMode"] {
  if (value === "exact" || value === "starts_with" || value === "all_words") {
    return value;
  }

  if (value === "starts with") {
    return "starts_with";
  }

  if (value === "all words") {
    return "all_words";
  }

  return "contains";
}

export function parseKeywordMapperConfig(
  config: Record<string, unknown>
): KeywordMapperConfig {
  return {
    conflictStrategy: parseConflictStrategy(config.conflictStrategy),
    lowConfidenceThreshold: parseNumber(config.lowConfidenceThreshold) ?? 0.75,
    matchFields: parseMatchFields(config.matchFields),
    matchMode: parseMatchMode(config.matchMode),
    unmatchedStrategy: parseUnmatchedStrategy(config.unmatchedStrategy),
  };
}

function manualRowFromRecord(
  rowRecord: Record<string, unknown>,
  index: number
): ManualTableRow {
  return {
    account:
      typeof rowRecord.account === "string" ? rowRecord.account : undefined,
    amount: parseNumber(rowRecord.amount) ?? parseNumber(rowRecord.value) ?? 0,
    currency:
      typeof rowRecord.currency === "string" ? rowRecord.currency : undefined,
    description:
      typeof rowRecord.description === "string"
        ? rowRecord.description
        : undefined,
    evidenceRefs: Array.isArray(rowRecord.evidenceRefs)
      ? (rowRecord.evidenceRefs as ManualTableRow["evidenceRefs"])
      : undefined,
    label: String(
      rowRecord.label || rowRecord.name || `Input row ${index + 1}`
    ),
    rowId: String(rowRecord.rowId || rowRecord.id || `input-row-${index + 1}`),
    sourceTrace: Array.isArray(rowRecord.sourceTrace)
      ? (rowRecord.sourceTrace as SourceTraceRef[])
      : undefined,
  };
}

function keywordRuleFromRecord(
  ruleRecord: Record<string, unknown>,
  index: number
): KeywordRule {
  const exactKeywords = asStringArray(ruleRecord.exactKeywords);
  const containsKeywords = asStringArray(ruleRecord.containsKeywords);
  const hasExplicitBuckets = exactKeywords.length + containsKeywords.length > 0;
  const legacyKeywords = asStringArray(
    ruleRecord.keywords || ruleRecord.keyword
  );
  const keywords = hasExplicitBuckets
    ? [...exactKeywords, ...containsKeywords]
    : legacyKeywords;
  const categoryId = String(
    ruleRecord.categoryId ||
      ruleRecord.category ||
      ruleRecord.target ||
      ruleRecord.subsectionId ||
      "mapped"
  );
  return {
    categoryId,
    categoryLabel: String(
      ruleRecord.categoryLabel ||
        ruleRecord.label ||
        humanizeCategoryId(categoryId)
    ),
    comment: optionalString(ruleRecord.comment),
    confidence: parseNumber(ruleRecord.confidence) ?? 0.85,
    containsKeywords,
    description: optionalString(ruleRecord.description),
    evidenceRefs: Array.isArray(ruleRecord.evidenceRefs)
      ? (ruleRecord.evidenceRefs as KeywordRule["evidenceRefs"])
      : undefined,
    exactKeywords,
    excludeKeywords: asStringArray(ruleRecord.excludeKeywords),
    keywords,
    lineId: optionalString(ruleRecord.lineId),
    matchMode: parseMatchMode(ruleRecord.matchMode),
    priority: parseNumber(ruleRecord.priority) ?? undefined,
    ruleId: String(
      ruleRecord.ruleId || ruleRecord.id || `keyword-rule-${index + 1}`
    ),
    sectionId: optionalString(ruleRecord.sectionId),
    scope: optionalString(ruleRecord.scope),
    sourceTrace: optionalTraceArray(ruleRecord.sourceTrace),
    suggestedLine: getSuggestedString(ruleRecord, "suggestedLine", "lineId"),
    suggestedSection: getSuggestedString(
      ruleRecord,
      "suggestedSection",
      "sectionId"
    ),
    suggestedSubsection: getSuggestedString(
      ruleRecord,
      "suggestedSubsection",
      "subsectionId"
    ),
    suggestedUse: optionalString(ruleRecord.suggestedUse),
    subsectionId: optionalString(ruleRecord.subsectionId),
    tags: asStringArray(ruleRecord.tags),
    target: optionalString(ruleRecord.target),
  };
}

export function collectRowsFromBackendInput(value: unknown): ManualTableRow[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => asRecord(item))
      .filter((item): item is Record<string, unknown> => Boolean(item))
      .map(manualRowFromRecord);
  }

  const record = asRecord(value);
  if (!record) {
    return [];
  }

  for (const key of ["rows", "mappedRows", "transformedRows"]) {
    const rows = record[key];
    if (Array.isArray(rows)) {
      return collectRowsFromBackendInput(rows);
    }
  }

  return [];
}

export function collectRulesFromBackendInput(value: unknown): KeywordRule[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => asRecord(item))
      .filter((item): item is Record<string, unknown> => Boolean(item))
      .map(keywordRuleFromRecord)
      .filter(
        (rule) => rule.keywords.length > 0 && rule.categoryId !== "mapped"
      );
  }

  const record = asRecord(value);
  if (!record) {
    return [];
  }

  for (const key of ["keywordRules", "keyword_rules", "rules"]) {
    const rules = record[key];
    if (Array.isArray(rules)) {
      return collectRulesFromBackendInput(rules);
    }
  }

  return [];
}
