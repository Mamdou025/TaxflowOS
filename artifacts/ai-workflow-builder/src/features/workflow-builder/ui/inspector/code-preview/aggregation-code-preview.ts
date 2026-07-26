import {
  asString,
  asStringArray,
  DEFAULT_AMOUNT_FIELD,
  inputSummary,
  lines,
  pretty,
} from "./preview-utils";
import type {
  BlockCodePreview,
  GenerateBlockCodePreviewOptions,
} from "./types";

export function aggregationCodePreview({
  config,
  inputBindings,
}: GenerateBlockCodePreviewOptions): BlockCodePreview {
  const includeTargets = asStringArray(config.includeTargets);
  const includeSectionIds = asStringArray(config.includeSectionIds);
  const includeSubsectionIds = asStringArray(config.includeSubsectionIds);
  const excludeTargets = asStringArray(config.excludeTargets);
  const amountField = asString(config.amountField, DEFAULT_AMOUNT_FIELD);
  const method = asString(config.aggregationMethod, "sum");

  return {
    code: lines(
      "const rows = inputs.mapped_rows;",
      `const includeTargets = ${pretty(includeTargets)};`,
      `const includeSectionIds = ${pretty(includeSectionIds)};`,
      `const includeSubsectionIds = ${pretty(includeSubsectionIds)};`,
      `const excludeTargets = ${pretty(excludeTargets)};`,
      `const amountField = ${pretty(amountField)};`,
      `const aggregationMethod = ${pretty(method)};`,
      "",
      "const includedRows = rows.filter((row) => {",
      "  const targetMatches =",
      "    includeTargets.length === 0 || includeTargets.includes(row.target);",
      "  const sectionMatches =",
      "    includeSectionIds.length === 0 ||",
      "    includeSectionIds.includes(row.sectionId);",
      "  const subsectionMatches =",
      "    includeSubsectionIds.length === 0 ||",
      "    includeSubsectionIds.includes(row.subsectionId);",
      "  const excluded = excludeTargets.includes(row.target);",
      "",
      "  return targetMatches && sectionMatches && subsectionMatches && !excluded;",
      "});",
      "",
      "const subtotal = includedRows.reduce(",
      "  (sum, row) => sum + Number(row[amountField] ?? 0),",
      "  0",
      ");",
      "",
      "outputs.subtotal = {",
      "  value: subtotal,",
      "  currency: includedRows.find((row) => row.currency)?.currency,",
      "  includedRows: includedRows.map((row) => row.rowId),",
      "  excludedRows: rows",
      "    .filter((row) => !includedRows.includes(row))",
      "    .map((row) => row.rowId),",
      "  formulaTrace:",
      "    includedRows.map((row) => row[amountField]).join(' + ') +",
      "    ' = ' +",
      "    subtotal,",
      "  sourceTrace: includedRows.flatMap((row) => row.sourceTrace ?? []),",
      "};",
      "",
      "outputs.aggregation_summary = {",
      "  includedCount: includedRows.length,",
      "  excludedCount: rows.length - includedRows.length,",
      "  subtotal,",
      "};"
    ),
    editable: false,
    explanation:
      "This block filters mapped rows by target, section, and subsection, then sums the configured amount field into a subtotal.",
    language: "typescript_preview",
    resolvedConfig: {
      aggregationMethod: method,
      amountField,
      excludeTargets,
      includeSectionIds,
      includeSubsectionIds,
      includeTargets,
    },
    resolvedInputs: inputSummary(inputBindings),
    title: "Generated Aggregation Logic",
  };
}
