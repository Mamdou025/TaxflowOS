import {
  asNumber,
  asString,
  asStringArray,
  DEFAULT_MATCH_FIELDS,
  inputSummary,
  lines,
  pretty,
} from "./preview-utils";
import type {
  BlockCodePreview,
  GenerateBlockCodePreviewOptions,
} from "./types";

export function keywordMapperCodePreview({
  config,
  inputBindings,
}: GenerateBlockCodePreviewOptions): BlockCodePreview {
  const matchFields = asStringArray(config.matchFields, DEFAULT_MATCH_FIELDS);
  const matchMode = asString(config.matchMode, "contains");
  const threshold = asNumber(config.lowConfidenceThreshold, 0.75);
  const conflictStrategy = asString(
    config.conflictStrategy,
    "highest_confidence"
  );
  const unmatchedStrategy = asString(
    config.unmatchedStrategy || config.unmatchedBehavior,
    "send_to_review"
  );

  return {
    code: lines(
      "const rows = inputs.data_rows;",
      "const rules = inputs.keyword_rules;",
      `const matchFields = ${pretty(matchFields)};`,
      `const matchMode = ${pretty(matchMode)};`,
      `const lowConfidenceThreshold = ${threshold};`,
      `const conflictStrategy = ${pretty(conflictStrategy)};`,
      `const unmatchedStrategy = ${pretty(unmatchedStrategy)};`,
      "",
      "for (const row of rows) {",
      "  const searchText = matchFields",
      "    .map((field) => row[field])",
      "    .filter(Boolean)",
      "    .join(' ')",
      "    .toLowerCase();",
      "",
      "  const matches = rules.filter((rule) =>",
      "    rule.keywords.some((keyword) =>",
      "      keywordMatches(searchText, keyword, matchMode)",
      "    )",
      "  );",
      "",
      "  if (matches.length === 0) {",
      "    outputs.unmatched_rows.push({ ...row, unmatchedStrategy });",
      "    continue;",
      "  }",
      "",
      "  const selectedRule = selectBestRule(matches, conflictStrategy);",
      "  const matchedKeyword = selectedRule.keywords.find((keyword) =>",
      "    keywordMatches(searchText, keyword, matchMode)",
      "  );",
      "",
      "  const mappedRow = {",
      "    rowId: row.rowId,",
      "    sourceRow: row,",
      "    categoryId: selectedRule.categoryId,",
      "    categoryLabel: selectedRule.categoryLabel,",
      "    matchedKeyword,",
      "    matchedRuleId: selectedRule.ruleId,",
      "    confidence: selectedRule.confidence,",
      "    amount: row.amount,",
      "    suggestedSection: selectedRule.suggestedSection,",
      "    suggestedLine: selectedRule.suggestedLine,",
      "    suggestedSubsection: selectedRule.suggestedSubsection,",
      "    status:",
      "      selectedRule.confidence < lowConfidenceThreshold",
      "        ? 'low_confidence'",
      "        : 'mapped',",
      "    sourceTrace: [row.sourceTrace, selectedRule.sourceTrace].flat(),",
      "    ruleTrace: selectedRule.sourceTrace,",
      "  };",
      "",
      "  outputs.mapped_rows.push(mappedRow);",
      "  if (mappedRow.status === 'low_confidence') {",
      "    outputs.low_confidence_rows.push(mappedRow);",
      "  }",
      "}",
      "",
      "outputs.mapping_summary = summarizeCategories(outputs);"
    ),
    editable: false,
    explanation:
      "This block reads data rows and connected keyword rules, classifies rows into atomic categories, and emits mapped, unmatched, low-confidence, and conflict outputs with Source and rule lineage.",
    language: "typescript_preview",
    resolvedConfig: {
      conflictStrategy,
      lowConfidenceThreshold: threshold,
      matchFields,
      matchMode,
      unmatchedStrategy,
    },
    resolvedInputs: inputSummary(inputBindings),
    title: "Generated Keyword Mapper Logic",
  };
}
