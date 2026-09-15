import {
  type KeywordRule,
  type ToolExecutionContext,
  type EvidenceRef,
  type SourceTraceRef,
  type FiscalRow,
  type KeywordMapperConflict,
} from './types';
import { asStringArray, parseNumber, asRecord } from './primitives';
import { getStringField, getKeywordRuleMatchMode } from './rows';
import { DEFAULT_KEYWORD_RULES } from './samples';

function keywordRuleFromConfigRecord(
  record: Record<string, unknown>,
  index: number,
): KeywordRule | null {
  const exactKeywords = asStringArray(record.exactKeywords);
  const containsKeywords = asStringArray(record.containsKeywords);
  const hasExplicitBuckets = exactKeywords.length + containsKeywords.length > 0;
  const legacyKeywords = asStringArray(record.keywords || record.keyword);
  const keywords = hasExplicitBuckets ? [...exactKeywords, ...containsKeywords] : legacyKeywords;
  const categoryId = String(
    record.categoryId || record.category || record.target || record.subsectionId || '',
  ).trim();
  if (keywords.length === 0) {
    return null;
  }
  if (!categoryId) {
    return null;
  }

  return {
    categoryId,
    categoryLabel: String(record.categoryLabel || record.label || categoryId.replaceAll('_', ' ')),
    comment: getStringField(record, 'comment'),
    containsKeywords,
    confidence: parseNumber(record.confidence) ?? 0.85,
    description: getStringField(record, 'description'),
    exactKeywords,
    excludeKeywords: asStringArray(record.excludeKeywords),
    keywords,
    lineId: getStringField(record, 'lineId'),
    matchMode: getKeywordRuleMatchMode(record.matchMode),
    ruleId: String(record.ruleId || record.id || `keyword-rule-${String(categoryId || index + 1)}`),
    sectionId: getStringField(record, 'sectionId'),
    scope: getStringField(record, 'scope'),
    suggestedLine: getStringField(record, 'suggestedLine') || getStringField(record, 'lineId'),
    suggestedSection:
      getStringField(record, 'suggestedSection') || getStringField(record, 'sectionId'),
    suggestedSubsection:
      getStringField(record, 'suggestedSubsection') || getStringField(record, 'subsectionId'),
    suggestedUse: getStringField(record, 'suggestedUse'),
    subsectionId: getStringField(record, 'subsectionId'),
    tags: asStringArray(record.tags),
    target: getStringField(record, 'target'),
  };
}

export function parseKeywordRules(value: unknown): KeywordRule[] {
  if (!Array.isArray(value)) {
    return DEFAULT_KEYWORD_RULES;
  }

  const rules = value
    .map((item, index) => {
      const record = asRecord(item);
      return record ? keywordRuleFromConfigRecord(record, index) : null;
    })
    .filter((item): item is KeywordRule => Boolean(item));

  return rules.length > 0 ? rules : DEFAULT_KEYWORD_RULES;
}

export function collectKeywordRules(context: ToolExecutionContext): KeywordRule[] {
  const fromUpstream = context.upstreamResults.flatMap((result) => {
    if (!Array.isArray(result.output.keywordRules)) {
      return [];
    }

    return parseKeywordRules(result.output.keywordRules).map((rule) => ({
      ...rule,
      evidenceRefs: Array.isArray(
        (result.output.keywordRuleEvidence as Record<string, unknown>)?.[rule.ruleId],
      )
        ? ((result.output.keywordRuleEvidence as Record<string, unknown>)[
            rule.ruleId
          ] as EvidenceRef[])
        : result.evidenceRefs.filter((ref) => ref.rowId === rule.ruleId),
      sourceTrace: Array.isArray(
        (result.output.keywordRuleTrace as Record<string, unknown>)?.[rule.ruleId],
      )
        ? ((result.output.keywordRuleTrace as Record<string, unknown>)[
            rule.ruleId
          ] as SourceTraceRef[])
        : result.sourceTrace.filter((trace) => trace.rowId === rule.ruleId),
    }));
  });

  if (fromUpstream.length > 0) return fromUpstream;

  if (Array.isArray(context.config.keywordRules) && context.config.keywordRules.length > 0) {
    return parseKeywordRules(context.config.keywordRules);
  }

  return [];
}

export function findKeywordRuleMatches(row: FiscalRow, rules: KeywordRule[]) {
  return rules.filter((rule) => Boolean(getRuleMatchedKeyword(row, rule)));
}

export function getMatchedKeyword(row: FiscalRow, rule: KeywordRule) {
  return getRuleMatchedKeyword(row, rule) || rule.keywords[0] || '';
}

function getRuleMatchedKeyword(row: FiscalRow, rule: KeywordRule) {
  const fields = getKeywordSearchFields(row);
  const excluded = (rule.excludeKeywords || []).some((keyword) =>
    keywordMatchesFields(fields, keyword, 'contains'),
  );
  if (excluded) {
    return;
  }

  return getKeywordCandidates(rule).find((candidate) =>
    keywordMatchesFields(fields, candidate.keyword, candidate.mode),
  )?.keyword;
}

function normalizeKeywordText(value: string) {
  return value.trim().toLowerCase();
}

function getKeywordSearchFields(row: FiscalRow) {
  return [row.account, row.label, row.description]
    .filter((value): value is string => typeof value === 'string')
    .map(normalizeKeywordText);
}

function keywordMatchesFields(
  fields: string[],
  keyword: string,
  mode: KeywordRule['matchMode'] = 'contains',
) {
  const normalizedKeyword = normalizeKeywordText(keyword);

  if (mode === 'exact') {
    return fields.some((field) => field === normalizedKeyword);
  }

  if (mode === 'starts_with') {
    return fields.some((field) => field.startsWith(normalizedKeyword));
  }

  return fields.some((field) => field.includes(normalizedKeyword));
}

function getKeywordCandidates(rule: KeywordRule) {
  const exactKeywords = rule.exactKeywords || [];
  const containsKeywords = rule.containsKeywords || [];
  const hasExplicitBuckets = exactKeywords.length + containsKeywords.length > 0;

  if (hasExplicitBuckets) {
    return [
      ...exactKeywords.map((keyword) => ({
        keyword,
        mode: 'exact' as const,
      })),
      ...containsKeywords.map((keyword) => ({
        keyword,
        mode: 'contains' as const,
      })),
    ];
  }

  return rule.keywords.map((keyword) => ({
    keyword,
    mode: rule.matchMode || 'contains',
  }));
}

export function createMappedKeywordRow({
  matchedKeyword,
  row,
  rule,
}: {
  matchedKeyword: string;
  row: FiscalRow;
  rule: KeywordRule;
}): FiscalRow {
  const rowTrace = row.sourceTrace || [];
  const ruleTrace = rule.sourceTrace || [];
  const mappedRow: FiscalRow = {
    ...row,
    categoryId: rule.categoryId,
    categoryLabel: rule.categoryLabel,
    confidence: rule.confidence,
    matchedKeyword,
    matchedRuleId: rule.ruleId,
    ruleId: rule.ruleId,
    sourceRow: { ...row },
    status: 'mapped',
    target: rule.target || rule.categoryId,
  };

  if (rule.lineId) {
    mappedRow.lineId = rule.lineId;
  }
  if (rule.sectionId) {
    mappedRow.sectionId = rule.sectionId;
  }
  if (ruleTrace.length > 0) {
    mappedRow.ruleTrace = ruleTrace;
    mappedRow.ruleSourceTrace = ruleTrace;
  }
  if (rowTrace.length + ruleTrace.length > 0) {
    mappedRow.sourceTrace = [...rowTrace, ...ruleTrace];
  }
  if (rule.subsectionId) {
    mappedRow.subsectionId = rule.subsectionId;
  }
  if (rule.suggestedLine) {
    mappedRow.suggestedLine = rule.suggestedLine;
  }
  if (rule.suggestedSection) {
    mappedRow.suggestedSection = rule.suggestedSection;
  }
  if (rule.suggestedSubsection) {
    mappedRow.suggestedSubsection = rule.suggestedSubsection;
  }

  return mappedRow;
}

export function createKeywordMapperWarnings({
  conflicts,
  lowConfidenceRows,
  rules,
  threshold,
  unmatchedRows,
}: {
  conflicts: KeywordMapperConflict[];
  lowConfidenceRows: FiscalRow[];
  rules: KeywordRule[];
  threshold: number;
  unmatchedRows: FiscalRow[];
}) {
  return [
    rules.length === 0 ? 'Keyword Mapper needs a connected Keyword Rulebook.' : '',
    unmatchedRows.length > 0
      ? `${unmatchedRows.length} row(s) were not matched by keyword rules.`
      : '',
    lowConfidenceRows.length > 0
      ? `${lowConfidenceRows.length} mapped row(s) are below confidence ${threshold}.`
      : '',
    conflicts.length > 0 ? `${conflicts.length} row(s) matched more than one keyword rule.` : '',
  ].filter(Boolean);
}

export function getKeywordRuleSourceLabels(context: ToolExecutionContext) {
  return context.upstreamBlocks
    .filter((block) => block.config.sourceKind === 'keyword_rules')
    .map((block) => block.label);
}

export function average(values: number[]) {
  if (values.length === 0) {
    return;
  }
  return values.reduce((total, value) => total + value, 0) / values.length;
}
