import type { EvidenceRef, SourceTraceRef } from '../../../runtime/types';

const KEYWORD_LIST_DELIMITER_REGEX = /[,;\n|]/;

// The default instructions a new block starts with — validated against a synthetic
// test set (scripts/src/classification-eval.ts) before this block existed: 9/9 recall
// on rows with no literal keyword overlap, 0/10 false FAPI-income flags on rows that
// merely share a word with a category in the wrong direction (expense vs income,
// paid vs received), and correctly LOWERED confidence (not a confident wrong answer)
// on a genuine FAPI-law nuance (a CFA-to-CFA dividend that may be surplus-excluded
// despite containing the word "dividend"). Editable per block instance — this is the
// "customize the instructions" knob the block exists to expose.
export const DEFAULT_SYSTEM_PROMPT = `You are classifying general-ledger rows for a Canadian corporate FAPI (Foreign Accrual Property Income) worksheet. You are given a KEYWORD RULEBOOK of known categories with example phrasing, and a list of GL rows that a deterministic keyword mapper could NOT confidently classify.

The rulebook's keywords are EXAMPLES of each category's phrasing, not an exhaustive list — use judgment to recognize the same concept in different wording.

For EACH row, decide:
- suggestedCategoryId: the single best-matching category id from the rulebook, or null if none applies.
- confidence: 0 to 1, calibrated — do not default to a high number. Reserve >=0.85 for cases you are quite sure of.
- rationale: one sentence, concrete, naming what in the row text drove the decision.
- matchedSignal: the word/phrase/concept that drove the match (or "" if suggestedCategoryId is null).

Rules you must apply:
1. Direction matters. "Interest income", "dividend income", "royalty income", "rental income" are things the company RECEIVED. If a row is an EXPENSE or something PAID OUT (interest expense, dividends paid, royalty paid, rent expense), it is NOT a match for that income category, even though it shares a word with the rulebook. suggestedCategoryId must be null for those, or the correct EXPENSE category if the rulebook has one that genuinely matches the row's own subject.
2. Word overlap is not meaning overlap. A legal/accounting expense that merely mentions a FAPI category's word in its description is not that category's income.
3. Recognize the same underlying concept in different wording (e.g. "coupon receipts" = interest income, "distribution received from shares" = dividends, "licensing fee" = royalties, "lease payment received" = rental income). Do not require a literal keyword match.
4. If a row touches on a real FAPI tax-law nuance you are not certain about (e.g. whether a specific type of income is excluded from FAPI by a surplus/exemption rule, or whether services income qualifies), do NOT silently guess with high confidence. Lower your confidence and say so in the rationale, so a human reviews it.
5. Never fabricate certainty you don't have. It is better to return a lower confidence or null than to confidently mislabel a row.

Return your answer for every row given, preserving rowRef.`;

export const DEFAULT_MODEL = 'anthropic/claude-sonnet-5';
export const DEFAULT_CONFIDENCE_THRESHOLD = 0.7;

export type AiMappingSuggestion = {
  rowRef: string;
  suggestedCategoryId: string | null;
  confidence: number;
  rationale: string;
  matchedSignal: string;
};

export type AiClassificationSuggestionConfig = {
  systemPrompt: string;
  model: string;
  confidenceThreshold: number;
  toolId: 'ai.classification_suggestion';
  // Pinned by the block's config panel after a server-side generation call — the
  // executor only replays this, it never calls a model itself (same split
  // currency-rate/http-json use: `execute` stays synchronous and reproducible).
  proposal?: {
    suggestions: AiMappingSuggestion[];
    model: string;
    generatedAt: string;
  };
  proposalAccepted?: boolean;
  proposalAcceptedAt?: string;
};

export type ClassifiableRow = {
  rowId: string;
  account?: string;
  label?: string;
  description?: string;
  amount?: number;
  currency?: string;
  evidenceRefs?: EvidenceRef[];
  sourceTrace?: SourceTraceRef[];
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .flatMap((item) => String(item).split(KEYWORD_LIST_DELIMITER_REGEX))
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (typeof value === 'string') {
    return value
      .split(KEYWORD_LIST_DELIMITER_REGEX)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function parseNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== 'string') {
    return null;
  }
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function optionalString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

export function parseAiClassificationConfig(
  config: Record<string, unknown>,
): AiClassificationSuggestionConfig {
  const threshold = parseNumber(config.confidenceThreshold);
  return {
    confidenceThreshold:
      threshold !== null && threshold >= 0 && threshold <= 1
        ? threshold
        : DEFAULT_CONFIDENCE_THRESHOLD,
    model: optionalString(config.model) || DEFAULT_MODEL,
    proposal: parsePinnedProposal(config.proposal),
    proposalAccepted: config.proposalAccepted === true,
    proposalAcceptedAt: optionalString(config.proposalAcceptedAt),
    systemPrompt: optionalString(config.systemPrompt) || DEFAULT_SYSTEM_PROMPT,
    toolId: 'ai.classification_suggestion',
  };
}

function parseSuggestion(value: unknown): AiMappingSuggestion | null {
  const record = asRecord(value);
  if (!record) {
    return null;
  }
  const rowRef = optionalString(record.rowRef) || optionalString(record.rowId);
  if (!rowRef) {
    return null;
  }
  const confidence = parseNumber(record.confidence);
  return {
    confidence: confidence !== null ? Math.min(1, Math.max(0, confidence)) : 0,
    matchedSignal: optionalString(record.matchedSignal) || '',
    rationale: optionalString(record.rationale) || '',
    rowRef,
    suggestedCategoryId: optionalString(record.suggestedCategoryId) ?? null,
  };
}

function parsePinnedProposal(value: unknown): AiClassificationSuggestionConfig['proposal'] {
  const record = asRecord(value);
  if (!record || !Array.isArray(record.suggestions)) {
    return undefined;
  }
  const suggestions = record.suggestions
    .map(parseSuggestion)
    .filter((item): item is AiMappingSuggestion => Boolean(item));
  return {
    generatedAt: optionalString(record.generatedAt) || new Date(0).toISOString(),
    model: optionalString(record.model) || DEFAULT_MODEL,
    suggestions,
  };
}

function rowFromRecord(record: Record<string, unknown>, index: number): ClassifiableRow {
  return {
    account: optionalString(record.account),
    amount: parseNumber(record.amount) ?? undefined,
    currency: optionalString(record.currency),
    description: optionalString(record.description),
    evidenceRefs: Array.isArray(record.evidenceRefs)
      ? (record.evidenceRefs as EvidenceRef[])
      : undefined,
    label: optionalString(record.label),
    rowId: String(record.rowId || record.id || `row-${index + 1}`),
    sourceTrace: Array.isArray(record.sourceTrace)
      ? (record.sourceTrace as SourceTraceRef[])
      : undefined,
  };
}

/** Mirrors keyword-mapper's collectRowsFromBackendInput: accepts a raw array, or an
 * object exposing rows under one of a few conventional keys (unmatchedRows,
 * lowConfidenceRows, mappedRows, rows), since this block is meant to sit downstream
 * of a Keyword Mapper's unmatched/low-confidence output. */
export function collectClassifiableRows(value: unknown): ClassifiableRow[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => asRecord(item))
      .filter((item): item is Record<string, unknown> => Boolean(item))
      .map(rowFromRecord);
  }

  const record = asRecord(value);
  if (!record) {
    return [];
  }

  for (const key of ['unmatchedRows', 'lowConfidenceRows', 'mappedRows', 'rows']) {
    const rows = record[key];
    if (Array.isArray(rows)) {
      return collectClassifiableRows(rows);
    }
  }

  return [];
}

export type ReferenceKeywordRule = {
  categoryId: string;
  categoryLabel: string;
  keywords: string[];
};

function ruleFromRecord(record: Record<string, unknown>): ReferenceKeywordRule | null {
  const categoryId = optionalString(record.categoryId) || optionalString(record.category);
  if (!categoryId) {
    return null;
  }
  return {
    categoryId,
    categoryLabel: optionalString(record.categoryLabel) || categoryId,
    keywords: asStringArray(record.keywords || record.keyword),
  };
}

/** Reference rulebook for prompt context only — this block never matches rows
 * against it mechanically, that is the Keyword Mapper's job. */
export function collectReferenceRulebook(value: unknown): ReferenceKeywordRule[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => asRecord(item))
      .filter((item): item is Record<string, unknown> => Boolean(item))
      .map(ruleFromRecord)
      .filter((rule): rule is ReferenceKeywordRule => Boolean(rule));
  }

  const record = asRecord(value);
  if (!record) {
    return [];
  }

  for (const key of ['keywordRules', 'keyword_rules', 'rules']) {
    const rules = record[key];
    if (Array.isArray(rules)) {
      return collectReferenceRulebook(rules);
    }
  }

  return [];
}
