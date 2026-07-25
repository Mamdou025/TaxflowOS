const CAMEL_CASE_REGEX = /([a-z])([A-Z])/g;
const FIRST_LETTER_REGEX = /^./;
const TRACE_SPLIT_REGEX = /\n|->/;

export const TABLE_KEYS_BY_KIND: Record<string, string[]> = {
  approval: ["approved", "reviewer", "notes", "status"],
  keyword_rules: [
    "ruleId",
    "categoryId",
    "categoryLabel",
    "keywords",
    "matchMode",
    "confidence",
    "priority",
    "description",
  ],
  aggregation_rules: [
    "nodeId",
    "label",
    "mode",
    "nodeType",
    "operation",
    "includeCategoryIds",
    "children",
    "operands",
    "formulaExpression",
    "value",
    "outputRole",
    "resultName",
    "order",
    "description",
  ],
  calculation_rules: [
    "calculationId",
    "label",
    "operation",
    "operands",
    "resultKey",
    "description",
  ],
  calculated_results: ["resultName", "value"],
  mapped_rows: [
    "rowId",
    "account",
    "label",
    "amount",
    "categoryId",
    "categoryLabel",
    "matchedKeyword",
    "confidence",
    "ruleId",
    "status",
  ],
  named_values: ["name", "value"],
  protected_result: [
    "name",
    "value",
    "currency",
    "status",
    "final",
    "runtimeLocked",
    "approvedBy",
  ],
  rows: ["rowId", "account", "label", "description", "amount", "currency"],
  rollup_rules: [
    "rollupId",
    "label",
    "operation",
    "includeCategoryIds",
    "description",
  ],
  validation: ["status", "threshold", "checkedCount", "failedCount", "message"],
};

export function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

export function compactJson(value: unknown) {
  if (value === undefined) {
    return "undefined";
  }
  return JSON.stringify(value, null, 2);
}

export function getRecordArray(value: unknown): Record<string, unknown>[] {
  if (!Array.isArray(value)) {
    return [];
  }
  return value
    .map(asRecord)
    .filter((item): item is Record<string, unknown> => Boolean(item));
}

export function unwrapPrimaryValue(value: unknown): unknown {
  const record = asRecord(value);
  if (!record) {
    return value;
  }

  for (const key of [
    "rows",
    "keywordRules",
    "aggregationRules",
    "rollupRules",
    "calculationRules",
    "mappedRows",
    "lowConfidenceRows",
    "unmatchedRows",
    "conflicts",
    "includedRows",
    "categoryTotals",
    "nodeTotals",
    "groupTotals",
    "rollupTotals",
    "namedValues",
    "calculatedResults",
    "finalTotals",
    "formulaTrace",
    "protectedResult",
    "canonicalJson",
    "validationResult",
    "approvalStatus",
  ]) {
    if (record[key] !== undefined) {
      return record[key];
    }
  }

  return value;
}

function isNumericMap(record: Record<string, unknown>) {
  const values = Object.values(record);
  return (
    values.length > 0 &&
    values.every((value) => typeof value === "number" && Number.isFinite(value))
  );
}

function formatNumericMapPreview(record: Record<string, unknown>) {
  const entries = Object.entries(record)
    .slice(0, 4)
    .map(([key, value]) => `${key}=${value}`);
  return `${entries.join(", ")}${Object.keys(record).length > entries.length ? ", ..." : ""}`;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Central detector keeps payload-specific display logic in one place.
export function getDataKind(outputType: string | undefined, value: unknown) {
  if (outputType?.includes("keyword_rules")) {
    return "keyword_rules";
  }
  if (outputType?.includes("aggregation_rules")) {
    return "aggregation_rules";
  }
  if (outputType?.includes("rollup_rules")) {
    return "rollup_rules";
  }
  if (outputType?.includes("calculation_rules")) {
    return "calculation_rules";
  }
  if (outputType?.includes("mapped_rows")) {
    return "mapped_rows";
  }
  if (outputType?.includes("validation")) {
    return "validation";
  }
  if (outputType?.includes("approval")) {
    return "approval";
  }
  if (outputType?.includes("protected")) {
    return "protected_result";
  }
  if (outputType?.includes("canonical")) {
    return "canonical_json";
  }
  if (outputType?.includes("preview") || outputType?.includes("package")) {
    return "evidence_preview";
  }
  if (
    outputType?.includes("subtotal") ||
    outputType?.includes("aggregation") ||
    outputType?.includes("category_totals") ||
    outputType?.includes("rollup_totals") ||
    outputType?.includes("named_values") ||
    outputType?.includes("calculated_results") ||
    outputType?.includes("calculation_summary") ||
    outputType?.includes("node_totals") ||
    outputType?.includes("group_totals") ||
    outputType?.includes("final_totals") ||
    outputType?.includes("formula_trace") ||
    outputType?.includes("rollup_formula_trace")
  ) {
    return "aggregation";
  }
  if (outputType?.includes("row") || outputType?.includes("table")) {
    return "rows";
  }

  const primary = unwrapPrimaryValue(value);
  const first = Array.isArray(primary)
    ? asRecord(primary[0])
    : asRecord(primary);
  if (first?.nodeId && first.nodeType) {
    return "aggregation_rules";
  }
  if (first?.rollupId && first.includeCategoryIds) {
    return "rollup_rules";
  }
  if (first?.calculationId && first.resultKey) {
    return "calculation_rules";
  }
  if (first?.ruleId && first.keywords) {
    return "keyword_rules";
  }
  if ((first?.categoryId || first?.target) && first.matchedKeyword) {
    return "mapped_rows";
  }
  if (first?.rowId && first.amount !== undefined) {
    return "rows";
  }
  if (first?.runtimeLocked || first?.approvedBy) {
    return "protected_result";
  }
  if (first?.checkedCount || first?.failedCount) {
    return "validation";
  }
  if (first?.approved !== undefined && first?.reviewer) {
    return "approval";
  }
  return "generic";
}

export function formatCell(value: unknown) {
  if (Array.isArray(value)) {
    return value.join(", ");
  }
  if (value === undefined || value === null) {
    return "";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

export function humanizeKey(key: string) {
  return key
    .replaceAll("_", " ")
    .replace(CAMEL_CASE_REGEX, "$1 $2")
    .replace(FIRST_LETTER_REGEX, (letter) => letter.toUpperCase());
}

export function getItemCount(
  value: unknown,
  contextData?: Record<string, unknown>
) {
  const primary = unwrapPrimaryValue(value);
  if (Array.isArray(primary)) {
    return primary.length;
  }
  if (typeof value === "string" && value.trim()) {
    return 1;
  }
  const record = asRecord(value);
  const context = contextData || {};
  for (const key of [
    "rowCount",
    "ruleCount",
    "mappedRowsCount",
    "includedCount",
    "checkedCount",
  ]) {
    const count = record?.[key] ?? context[key];
    if (typeof count === "number") {
      return count;
    }
  }
  if (record && isNumericMap(record)) {
    return Object.keys(record).length;
  }
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Preview copy is intentionally tailored to each fiscal payload kind.
export function getPreviewText({
  contextData,
  outputType,
  value,
}: {
  contextData?: Record<string, unknown>;
  outputType?: string;
  value: unknown;
}) {
  const kind = getDataKind(outputType, value);
  const primary = unwrapPrimaryValue(value);
  const first = Array.isArray(primary)
    ? asRecord(primary[0])
    : asRecord(primary);

  if (kind === "rows" && first) {
    return `${first.rowId || "row"} | ${first.account || ""} | ${first.label || ""} | ${first.amount ?? ""} ${first.currency || ""}`.trim();
  }
  if (kind === "keyword_rules" && first) {
    return `${first.ruleId || "rule"} | ${formatCell(first.keywords)} -> ${first.categoryLabel || first.categoryId || ""} | confidence ${first.confidence ?? ""}`;
  }
  if (kind === "aggregation_rules" && first) {
    return `${first.nodeId || "node"} | ${first.label || ""} | ${first.nodeType || ""}`;
  }
  if (kind === "rollup_rules" && first) {
    return `${first.rollupId || "rollup"} | ${first.label || ""} | ${first.operation || ""}`;
  }
  if (kind === "calculation_rules" && first) {
    return `${first.calculationId || "calculation"} | ${first.operation || ""} -> ${first.resultKey || ""}`;
  }
  if (kind === "mapped_rows" && first) {
    return `${first.rowId || "row"} -> ${first.categoryLabel || first.categoryId || ""} | confidence ${first.confidence ?? ""}`;
  }
  if (kind === "aggregation" && first) {
    if (isNumericMap(first)) {
      return formatNumericMapPreview(first);
    }
    return `${first.value ?? first.subtotal ?? contextData?.subtotalValue ?? ""} ${first.currency || ""}`.trim();
  }
  if (kind === "validation" && first) {
    return `${first.status || "result"} | ${first.message || ""}`.trim();
  }
  if (kind === "approval" && first) {
    return `${first.approved ? "approved" : "not approved"} | ${first.reviewer || ""}`.trim();
  }
  if (kind === "protected_result" && first) {
    return `${first.name || "Protected result"} = ${first.value ?? ""} ${first.currency || ""} | ${first.status || ""}`.trim();
  }
  if (typeof value === "string") {
    return value.split("\n").find(Boolean) || value;
  }
  if (value === undefined || value === null) {
    return "No latest data yet";
  }
  return compactJson(value).slice(0, 160);
}

function getSchemaType(value: unknown): string {
  if (Array.isArray(value)) {
    const first = value[0];
    return `${getSchemaType(first)}[]`;
  }
  if (value === null) {
    return "null";
  }
  return typeof value;
}

export function inferSchemaRows(value: unknown) {
  const primary = unwrapPrimaryValue(value);
  const sample = Array.isArray(primary) ? primary[0] : primary;
  const record = asRecord(sample);
  if (!record) {
    return [];
  }
  return Object.entries(record).map(([key, fieldValue]) => ({
    field: key,
    type: getSchemaType(fieldValue),
  }));
}

function traceItemFromRecord(record: Record<string, unknown>) {
  const sourceLabel =
    record.sourceLabel || record.sourceBlockId || record.blockLabel || "Trace";
  const itemId =
    record.rowId ||
    record.ruleId ||
    String(record.evidenceRefId || "")
      .split(":")
      .at(-1);
  return itemId ? `${sourceLabel}.${itemId}` : String(sourceLabel);
}

function traceLinesFromPreview(value: string) {
  const traceIndex = value.indexOf("Trace:");
  if (traceIndex < 0) {
    return [];
  }
  return value
    .slice(traceIndex + "Trace:".length)
    .split(TRACE_SPLIT_REGEX)
    .map((line) => line.trim())
    .filter(Boolean);
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Trace extraction accepts multiple local run payload shapes.
export function collectTraceLines(
  value: unknown,
  contextData?: Record<string, unknown>
) {
  const lines = new Set<string>();
  const values = [value, contextData].filter(Boolean);

  for (const candidate of values) {
    if (typeof candidate === "string") {
      for (const line of traceLinesFromPreview(candidate)) {
        lines.add(line);
      }
      continue;
    }

    const record = asRecord(candidate);
    if (!record) {
      continue;
    }

    for (const key of [
      "sourceTrace",
      "rowSourceTrace",
      "ruleSourceTrace",
      "trace",
    ]) {
      const traceValue = record[key];
      if (Array.isArray(traceValue)) {
        for (const item of traceValue) {
          const traceRecord = asRecord(item);
          lines.add(
            traceRecord ? traceItemFromRecord(traceRecord) : String(item)
          );
        }
      }
    }

    for (const key of ["protectedResult", "canonicalJson"]) {
      const nested = asRecord(record[key]);
      if (nested) {
        for (const line of collectTraceLines(nested)) {
          lines.add(line);
        }
      }
    }
  }

  const primary = unwrapPrimaryValue(value);
  if (Array.isArray(primary)) {
    for (const item of primary) {
      for (const line of collectTraceLines(item)) {
        lines.add(line);
      }
    }
  }

  return [...lines].filter((line) => line !== "undefined");
}

export function getDefaultView(outputType?: string) {
  return outputType?.includes("canonical") ? "json" : "table";
}
