import { error, info, warning } from "../../../runtime/events";
import {
  dedupeEvidenceRefs,
  dedupeSourceTrace,
} from "../../../runtime/lineage";
import type {
  EvidenceRef,
  SourceTraceRef,
  ToolExecutionContext,
  ToolRunResult,
} from "../../../runtime/types";
import type { KeywordRule } from "../../source/keyword-rules/schema";
import type { ManualTableRow } from "../../source/manual-table/schema";
import {
  collectRowsFromBackendInput,
  collectRulesFromBackendInput,
  type KeywordMapperConfig,
  type KeywordMapperConflict,
  type MappedKeywordRow,
  parseKeywordMapperConfig,
  type UnmatchedKeywordRow,
} from "./schema";

type RuleMatch = {
  rule: KeywordRule;
  matchedKeyword: string;
};

type KeywordCandidate = {
  keyword: string;
  mode: "contains" | "exact" | "starts_with";
};

const DIACRITIC_REGEX = /[\u0300-\u036f]/g;
const MATCH_SEPARATOR_REGEX = /[^\p{L}\p{N}]+/gu;

function getRoleInputs(context: ToolExecutionContext, role: string) {
  return context.inputsByRole[role] || [];
}

function getRows(context: ToolExecutionContext): ManualTableRow[] {
  return getRoleInputs(context, "data_rows").flatMap((input) =>
    collectRowsFromBackendInput(input)
  );
}

function getRules(context: ToolExecutionContext): KeywordRule[] {
  const fromUpstream = getRoleInputs(context, "keyword_rules").flatMap((input) =>
    collectRulesFromBackendInput(input)
  );
  if (fromUpstream.length > 0) return fromUpstream;
  return collectRulesFromBackendInput(context.config);
}

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(DIACRITIC_REGEX, "")
    .toLowerCase()
    .replace(MATCH_SEPARATOR_REGEX, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function getFieldValues(
  row: ManualTableRow,
  fields: KeywordMapperConfig["matchFields"]
) {
  return fields
    .map((field) => row[field])
    .filter((value): value is string => typeof value === "string")
    .map(normalize);
}

function keywordMatches({
  fieldValues,
  keyword,
  mode,
}: {
  fieldValues: string[];
  keyword: string;
  mode: "contains" | "exact" | "starts_with";
}) {
  const normalizedKeyword = normalize(keyword);

  if (mode === "exact") {
    return fieldValues.some((value) => value === normalizedKeyword);
  }

  if (mode === "starts_with") {
    return fieldValues.some((value) => value.startsWith(normalizedKeyword));
  }

  return fieldValues.some((value) => value.includes(normalizedKeyword));
}

function getKeywordCandidates(
  rule: KeywordRule,
  fallbackMode: KeywordMapperConfig["matchMode"]
): KeywordCandidate[] {
  const exactKeywords = rule.exactKeywords || [];
  const containsKeywords = rule.containsKeywords || [];
  const hasExplicitBuckets = exactKeywords.length + containsKeywords.length > 0;

  if (hasExplicitBuckets) {
    return [
      ...exactKeywords.map((keyword) => ({
        keyword,
        mode: "exact" as const,
      })),
      ...containsKeywords.map((keyword) => ({
        keyword,
        mode: "contains" as const,
      })),
    ];
  }

  return rule.keywords.map((keyword) => ({
    keyword,
    mode: rule.matchMode || fallbackMode,
  }));
}

function hasExcludedKeyword(rule: KeywordRule, fieldValues: string[]) {
  return (rule.excludeKeywords || []).some((keyword) =>
    keywordMatches({ fieldValues, keyword, mode: "contains" })
  );
}

function findMatches({
  config,
  row,
  rules,
}: {
  config: KeywordMapperConfig;
  row: ManualTableRow;
  rules: KeywordRule[];
}): RuleMatch[] {
  const fieldValues = getFieldValues(row, config.matchFields);

  return rules.flatMap((rule) => {
    if (hasExcludedKeyword(rule, fieldValues)) {
      return [];
    }

    const matchedKeyword = getKeywordCandidates(rule, config.matchMode).find(
      (candidate) =>
        keywordMatches({
          fieldValues,
          keyword: candidate.keyword,
          mode: candidate.mode,
        })
    );

    return matchedKeyword
      ? [{ matchedKeyword: matchedKeyword.keyword, rule }]
      : [];
  });
}

function chooseMatch(
  matches: RuleMatch[],
  strategy: KeywordMapperConfig["conflictStrategy"]
) {
  const sorted = [...matches].sort((a, b) => {
    if (strategy === "highest_priority") {
      const priorityA = a.rule.priority ?? Number.MAX_SAFE_INTEGER;
      const priorityB = b.rule.priority ?? Number.MAX_SAFE_INTEGER;
      return priorityA - priorityB || b.rule.confidence - a.rule.confidence;
    }

    return b.rule.confidence - a.rule.confidence;
  });

  return sorted[0];
}

function traceForRow(row: ManualTableRow): SourceTraceRef[] {
  return row.sourceTrace || [];
}

function traceForRule(rule: KeywordRule): SourceTraceRef[] {
  return rule.sourceTrace || [];
}

function evidenceForRow(row: ManualTableRow): EvidenceRef[] {
  return row.evidenceRefs || [];
}

function evidenceForRule(rule: KeywordRule): EvidenceRef[] {
  return rule.evidenceRefs || [];
}

function createMappedRow({
  matchedKeyword,
  row,
  rule,
}: {
  matchedKeyword: string;
  row: ManualTableRow;
  rule: KeywordRule;
}): MappedKeywordRow {
  const rowSourceTrace = traceForRow(row);
  const ruleSourceTrace = traceForRule(rule);
  const mappedRow: MappedKeywordRow = {
    ...row,
    confidence: rule.confidence,
    evidenceRefs: [...evidenceForRow(row), ...evidenceForRule(rule)],
    categoryId: rule.categoryId,
    categoryLabel: rule.categoryLabel,
    matchedKeyword,
    matchedRuleId: rule.ruleId,
    rowSourceTrace,
    ruleId: rule.ruleId,
    ruleTrace: ruleSourceTrace,
    ruleSourceTrace,
    sourceRow: { ...row },
    sourceTrace: [...rowSourceTrace, ...ruleSourceTrace],
    status: "mapped",
    target: rule.target || rule.categoryId,
  };

  if (rule.suggestedLine) {
    mappedRow.suggestedLine = rule.suggestedLine;
  }
  if (rule.suggestedSection) {
    mappedRow.suggestedSection = rule.suggestedSection;
  }
  if (rule.suggestedSubsection) {
    mappedRow.suggestedSubsection = rule.suggestedSubsection;
  }

  if (rule.lineId) {
    mappedRow.lineId = rule.lineId;
  }
  if (rule.sectionId) {
    mappedRow.sectionId = rule.sectionId;
  }
  if (rule.subsectionId) {
    mappedRow.subsectionId = rule.subsectionId;
  }

  return mappedRow;
}

function getCategoryCounts(rows: MappedKeywordRow[]) {
  return rows.reduce<Record<string, number>>((counts, row) => {
    counts[row.categoryId] = (counts[row.categoryId] || 0) + 1;
    return counts;
  }, {});
}

function getCategoryAmountTotals(rows: MappedKeywordRow[]) {
  return rows.reduce<Record<string, number>>((totals, row) => {
    totals[row.categoryId] = (totals[row.categoryId] || 0) + row.amount;
    return totals;
  }, {});
}

function averageConfidence(rows: MappedKeywordRow[]) {
  if (rows.length === 0) {
    return;
  }

  return rows.reduce((total, row) => total + row.confidence, 0) / rows.length;
}

function createErrorResult({
  context,
  errors,
}: {
  context: ToolExecutionContext;
  errors: string[];
}): ToolRunResult {
  return {
    blockId: context.block.id,
    completedAt: new Date().toISOString(),
    errors,
    evidenceRefs: [],
    logs: errors.map((message) => error(message)),
    outputs: {
      conflicts: { conflictCount: 0, conflicts: [] },
      low_confidence_rows: { lowConfidenceRows: [], rowCount: 0 },
      mapped_rows: { mappedRows: [], rowCount: 0 },
      mapping_summary: {
        categoryAmountTotals: {},
        categoryCounts: {},
        conflictCount: 0,
        lowConfidenceCount: 0,
        mappedCount: 0,
        ruleSourceCount: 0,
        rulesUsedCount: 0,
        totalRows: 0,
        unmatchedCount: 0,
      },
      unmatched_rows: { rowCount: 0, unmatchedRows: [] },
    },
    primaryOutputRole: "mapping_summary",
    runId: context.runId,
    sourceTrace: [],
    startedAt: context.startedAt,
    status: "error",
    toolId: "logic.keyword_mapper",
    warnings: [],
  };
}

function getMissingInputErrors({
  rows,
  rules,
}: {
  rows: ManualTableRow[];
  rules: KeywordRule[];
}) {
  return [
    rows.length === 0 ? "Keyword Mapper needs Data rows input." : "",
    rules.length === 0 ? "Keyword Mapper needs Keyword rules input." : "",
  ].filter(Boolean);
}

export function runKeywordMapper(context: ToolExecutionContext): ToolRunResult {
  const rows = getRows(context);
  const rules = getRules(context);
  const config = parseKeywordMapperConfig(context.config);
  const missingErrors = getMissingInputErrors({ rows, rules });

  if (missingErrors.length > 0) {
    return createErrorResult({ context, errors: missingErrors });
  }

  const mappedRows: MappedKeywordRow[] = [];
  const unmatchedRows: UnmatchedKeywordRow[] = [];
  const conflicts: KeywordMapperConflict[] = [];

  for (const row of rows) {
    const matches = findMatches({ config, row, rules });
    const chosenMatch = chooseMatch(matches, config.conflictStrategy);

    if (!chosenMatch) {
      if (config.unmatchedStrategy !== "ignore") {
        unmatchedRows.push({
          ...row,
          categoryId: "unmatched",
          categoryLabel: "Unmatched",
          confidence: 0.35,
          status: "unmatched",
        });
      }
      continue;
    }

    if (matches.length > 1) {
      conflicts.push({
        label: row.label,
        matchedRuleIds: matches.map((match) => match.rule.ruleId),
        rowId: row.rowId,
        strategy: config.conflictStrategy,
      });
    }

    mappedRows.push(
      createMappedRow({
        matchedKeyword: chosenMatch.matchedKeyword,
        row,
        rule: chosenMatch.rule,
      })
    );
  }

  const lowConfidenceRows = mappedRows.filter(
    (row) => row.confidence < config.lowConfidenceThreshold
  );
  for (const row of lowConfidenceRows) {
    row.status = "low_confidence";
  }
  const warnings = [
    unmatchedRows.length > 0
      ? `${unmatchedRows.length} row(s) were not matched by keyword rules.`
      : "",
    lowConfidenceRows.length > 0
      ? `${lowConfidenceRows.length} mapped row(s) are below confidence ${config.lowConfidenceThreshold}.`
      : "",
    conflicts.length > 0
      ? `${conflicts.length} row(s) matched more than one keyword rule.`
      : "",
  ].filter(Boolean);
  const evidenceRefs = dedupeEvidenceRefs([
    ...mappedRows.flatMap((row) => row.evidenceRefs || []),
    ...unmatchedRows.flatMap((row) => row.evidenceRefs || []),
  ]);
  const sourceTrace = dedupeSourceTrace([
    ...mappedRows.flatMap((row) => row.sourceTrace || []),
    ...unmatchedRows.flatMap((row) => row.sourceTrace || []),
  ]);
  const mappingSummary = {
    conflictCount: conflicts.length,
    categoryAmountTotals: getCategoryAmountTotals(mappedRows),
    categoryCounts: getCategoryCounts(mappedRows),
    lowConfidenceCount: lowConfidenceRows.length,
    mappedCount: mappedRows.length,
    rulesUsedCount: new Set(mappedRows.map((row) => row.ruleId)).size,
    ruleSourceCount: new Set(
      rules.map((rule) => rule.sourceTrace?.[0]?.sourceBlockId || rule.ruleId)
    ).size,
    totalRows: rows.length,
    unmatchedCount: unmatchedRows.length,
  };

  return {
    blockId: context.block.id,
    completedAt: new Date().toISOString(),
    confidence: averageConfidence(mappedRows),
    errors: [],
    evidenceRefs,
    logs: [
      warnings.length > 0
        ? warning("Keyword mapping completed with review findings.", {
            ...mappingSummary,
          })
        : info("Keyword mapping completed from connected Source rules.", {
            ...mappingSummary,
          }),
    ],
    outputs: {
      conflicts: {
        conflictCount: conflicts.length,
        conflicts,
      },
      low_confidence_rows: {
        lowConfidenceRows,
        rowCount: lowConfidenceRows.length,
      },
      mapped_rows: {
        mappedRows,
        rowCount: mappedRows.length,
      },
      mapping_summary: {
        ...mappingSummary,
        rulesUsed: rules.map((rule) => ({
          categoryId: rule.categoryId,
          categoryLabel: rule.categoryLabel,
          confidence: rule.confidence,
          keywords: rule.keywords,
          matchMode: rule.matchMode,
          priority: rule.priority,
          ruleId: rule.ruleId,
          suggestedLine: rule.suggestedLine,
          suggestedSection: rule.suggestedSection,
          suggestedSubsection: rule.suggestedSubsection,
        })),
      },
      unmatched_rows: {
        rowCount: unmatchedRows.length,
        unmatchedRows,
      },
    },
    primaryOutputRole: "mapped_rows",
    runId: context.runId,
    sourceTrace,
    startedAt: context.startedAt,
    status: warnings.length > 0 ? "warning" : "success",
    toolId: "logic.keyword_mapper",
    warnings,
  };
}
