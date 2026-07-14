import type { EvidenceRef, SourceTraceRef } from "../../../runtime/types";

const KEYWORD_LIST_DELIMITER_REGEX = /[,;\n|]/;

export type KeywordRuleMatchMode =
  | "contains"
  | "exact"
  | "starts_with"
  | "all_words";

export type KeywordRule = {
  ruleId: string;
  categoryId: string;
  categoryLabel: string;
  keywords: string[];
  exactKeywords?: string[];
  containsKeywords?: string[];
  excludeKeywords?: string[];
  confidence: number;
  description?: string;
  comment?: string;
  scope?: string;
  suggestedUse?: string;
  suggestedLine?: string;
  suggestedSection?: string;
  suggestedSubsection?: string;
  tags?: string[];
  priority?: number;
  matchMode: KeywordRuleMatchMode;
  metadata?: Record<string, unknown>;
  target?: string;
  lineId?: string;
  sectionId?: string;
  subsectionId?: string;
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

function parseMatchMode(value: unknown): KeywordRuleMatchMode {
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

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function humanizeCategoryId(categoryId: string) {
  return categoryId
    .replaceAll("_", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getKeywordBuckets(record: Record<string, unknown>) {
  const exactKeywords = asStringArray(record.exactKeywords);
  const containsKeywords = asStringArray(record.containsKeywords);
  const excludeKeywords = asStringArray(record.excludeKeywords);
  const legacyKeywords = asStringArray(record.keywords || record.keyword);
  const hasExplicitBuckets = exactKeywords.length + containsKeywords.length > 0;

  if (hasExplicitBuckets) {
    return {
      containsKeywords,
      exactKeywords,
      excludeKeywords,
      keywords: [...exactKeywords, ...containsKeywords],
    };
  }

  if (record.matchMode === "exact") {
    return {
      containsKeywords: [],
      exactKeywords: legacyKeywords,
      excludeKeywords,
      keywords: legacyKeywords,
    };
  }

  // all_words: keep the phrases in `keywords` (no exact/contains bucket) so the
  // mapper's candidate list carries the rule's matchMode ("all_words").
  if (record.matchMode === "all_words") {
    return {
      containsKeywords: [],
      exactKeywords: [],
      excludeKeywords,
      keywords: legacyKeywords,
    };
  }

  return {
    containsKeywords: legacyKeywords,
    exactKeywords: [],
    excludeKeywords,
    keywords: legacyKeywords,
  };
}

export function normalizeKeywordRule(
  value: unknown,
  index: number
): KeywordRule | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }

  const keywordBuckets = getKeywordBuckets(record);
  const categoryId =
    optionalString(record.categoryId) ||
    optionalString(record.category) ||
    optionalString(record.target) ||
    optionalString(record.subsectionId);
  if (!categoryId || keywordBuckets.keywords.length === 0) {
    return null;
  }
  const categoryLabel =
    optionalString(record.categoryLabel) ||
    optionalString(record.label) ||
    humanizeCategoryId(categoryId);

  return {
    categoryId,
    categoryLabel,
    comment: optionalString(record.comment),
    containsKeywords: keywordBuckets.containsKeywords,
    confidence: parseNumber(record.confidence) ?? 0.85,
    description: optionalString(record.description),
    exactKeywords: keywordBuckets.exactKeywords,
    excludeKeywords: keywordBuckets.excludeKeywords,
    keywords: keywordBuckets.keywords,
    lineId: optionalString(record.lineId),
    matchMode: parseMatchMode(record.matchMode),
    metadata: asRecord(record.metadata) || undefined,
    priority: parseNumber(record.priority),
    ruleId: String(record.ruleId || record.id || `keyword-rule-${index + 1}`),
    sectionId: optionalString(record.sectionId),
    scope: optionalString(record.scope),
    suggestedLine:
      optionalString(record.suggestedLine) || optionalString(record.lineId),
    suggestedSection:
      optionalString(record.suggestedSection) ||
      optionalString(record.sectionId),
    suggestedSubsection:
      optionalString(record.suggestedSubsection) ||
      optionalString(record.subsectionId),
    suggestedUse: optionalString(record.suggestedUse),
    subsectionId: optionalString(record.subsectionId),
    tags: asStringArray(record.tags),
    target: optionalString(record.target),
  };
}

export function parseKeywordRules({
  config,
  fallbackRules,
}: {
  config: Record<string, unknown>;
  fallbackRules: KeywordRule[];
}): KeywordRule[] {
  const ruleSource =
    config.keywordRules || config.rules || config.rows || config.manualRules;
  if (!Array.isArray(ruleSource)) {
    return fallbackRules.map((rule) => ({
      ...rule,
      containsKeywords: rule.containsKeywords
        ? [...rule.containsKeywords]
        : undefined,
      exactKeywords: rule.exactKeywords ? [...rule.exactKeywords] : undefined,
      excludeKeywords: rule.excludeKeywords
        ? [...rule.excludeKeywords]
        : undefined,
      keywords: [...rule.keywords],
    }));
  }

  const rules = ruleSource
    .map(normalizeKeywordRule)
    .filter((rule): rule is KeywordRule => Boolean(rule));

  return rules.length > 0
    ? rules
    : fallbackRules.map((rule) => ({
        ...rule,
        containsKeywords: rule.containsKeywords
          ? [...rule.containsKeywords]
          : undefined,
        exactKeywords: rule.exactKeywords ? [...rule.exactKeywords] : undefined,
        excludeKeywords: rule.excludeKeywords
          ? [...rule.excludeKeywords]
          : undefined,
        keywords: [...rule.keywords],
      }));
}
