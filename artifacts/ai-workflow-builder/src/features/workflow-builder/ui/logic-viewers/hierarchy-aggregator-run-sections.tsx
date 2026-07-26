import type { ReactNode } from "react";
import {
  getAggregationRuleMode,
  getAggregationRuleModeLabel,
} from "../source-viewers/aggregation-rule-modes";

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function asStringList(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function formatValue(value: unknown): string {
  if (Array.isArray(value)) {
    return value.map(formatValue).join(", ");
  }
  if (value === undefined || value === null || value === "") {
    return "-";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

function formatInputValues(value: unknown) {
  const records = Array.isArray(value)
    ? value.map(asRecord).filter(Boolean)
    : [];
  if (records.length === 0) {
    return formatValue(value);
  }
  return records
    .map((record) => {
      const label =
        record?.label || record?.refId || record?.refType || "input";
      const inputValue =
        record?.signedValue ?? record?.value ?? record?.amount ?? "-";
      return `${String(label)}=${String(inputValue)}`;
    })
    .join(", ");
}

function getNumericMapRows({
  labelKey,
  mode,
  record,
  valueKey,
}: {
  labelKey: string;
  mode?: string;
  record: Record<string, unknown> | null;
  valueKey: string;
}): Record<string, unknown>[] {
  if (!record) {
    return [];
  }
  return Object.entries(record).map(([key, value]) => ({
    [labelKey]: key,
    mode,
    [valueKey]: value,
  }));
}

function getCategoryRows(
  output: Record<string, unknown>
): Record<string, unknown>[] {
  const categoryTotals = asRecord(output.categoryTotals);
  const details = asRecord(output.categoryTotalDetails);
  if (!details || Object.keys(details).length === 0) {
    return getNumericMapRows({
      labelKey: "categoryId",
      record: categoryTotals,
      valueKey: "total",
    });
  }

  return Object.entries(details).map(([categoryId, detail]) => {
    const record = asRecord(detail);
    return {
      categoryId: record?.categoryId || categoryId,
      categoryLabel: record?.categoryLabel || categoryId,
      rowCount: record?.rowCount ?? "-",
      sourceRows: asStringList(record?.includedRows).join(", ") || "-",
      total: record?.value ?? record?.amount ?? categoryTotals?.[categoryId],
    };
  });
}

function getNodeDetailRows(
  output: Record<string, unknown>
): Record<string, unknown>[] {
  const details = asRecord(output.nodeTotalDetails);
  if (!details || Object.keys(details).length === 0) {
    return [];
  }

  const rows: Record<string, unknown>[] = [];
  for (const [nodeId, detail] of Object.entries(details)) {
    const record = asRecord(detail);
    if (!record) {
      continue;
    }
    const mode = getAggregationRuleMode(record);
    const formulaTrace = asRecord(record.formulaTrace);
    rows.push({
      expression: formulaTrace?.expression,
      inputRefs: asStringList(formulaTrace?.inputRefs).join(", ") || "-",
      label: record.label || nodeId,
      mode: getAggregationRuleModeLabel(record),
      nodeId: record.nodeId || nodeId,
      operation: record.operation || "-",
      result: record.value ?? record.amount ?? "-",
      resultName: record.resultName || "-",
      warnings: asStringList(record.warnings).join(", ") || "-",
      _mode: mode,
    });
  }
  return rows;
}

function getRollupRows(output: Record<string, unknown>) {
  const detailRows = getNodeDetailRows(output).filter(
    (row) => row._mode === "rollup"
  );
  if (detailRows.length > 0) {
    return detailRows;
  }
  return getNumericMapRows({
    labelKey: "nodeId",
    mode: "Rollup",
    record: asRecord(output.groupTotals),
    valueKey: "result",
  });
}

function getFormulaRows(output: Record<string, unknown>) {
  const detailRows = getNodeDetailRows(output).filter(
    (row) => row._mode !== "rollup"
  );
  const finalRows = getNumericMapRows({
    labelKey: "resultName",
    mode: "Final result",
    record: asRecord(output.finalTotals),
    valueKey: "result",
  });
  const officialLineRows = getNumericMapRows({
    labelKey: "resultName",
    mode: "Official line",
    record: asRecord(output.officialLineValues),
    valueKey: "result",
  });

  if (detailRows.length > 0) {
    return [...detailRows, ...officialLineRows];
  }
  return [...finalRows, ...officialLineRows];
}

function getFormulaTraceRows(output: Record<string, unknown>) {
  const trace = asRecord(output.formulaTrace);
  if (!trace || Object.keys(trace).length === 0) {
    return [];
  }
  return Object.entries(trace).map(([nodeId, value]) => {
    const record = asRecord(value);
    return {
      computation:
        asStringList(record?.inputRefs).join(", ") || record?.operation || "-",
      formula: record?.expression || "-",
      inputValues: formatInputValues(record?.inputValues),
      nodeId: record?.nodeId || nodeId,
      result: record?.result ?? "-",
      warnings: asStringList(record?.warnings).join(", ") || "-",
    };
  });
}

function getWarnings(output: Record<string, unknown>) {
  const summary = asRecord(output.aggregationSummary);
  return asStringList(summary?.warnings);
}

function ProofTable({
  compact,
  columns,
  emptyLabel,
  rows,
}: {
  columns: string[];
  compact?: boolean;
  emptyLabel: string;
  rows: Record<string, unknown>[];
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-md bg-muted/20 p-3 text-muted-foreground text-xs">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div
      className={`overflow-auto rounded-md bg-background/70 ${compact ? "max-h-56" : "max-h-72"}`}
    >
      <table className="w-full min-w-[720px] text-left text-xs">
        <thead className="sticky top-0 bg-background">
          <tr className="border-b">
            {columns.map((column) => (
              <th className="px-2 py-1 font-medium" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              className="border-b last:border-b-0"
              key={String(
                row.nodeId || row.categoryId || row.resultName || index
              )}
            >
              {columns.map((column) => (
                <td className="max-w-72 truncate px-2 py-1" key={column}>
                  {formatValue(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Section({ children, title }: { children: ReactNode; title: string }) {
  return (
    <details className="rounded-md bg-muted/10" open>
      <summary className="cursor-pointer select-none p-3 font-medium text-sm hover:bg-muted/20">
        {title}
      </summary>
      <div className="space-y-2 px-3 pb-3">{children}</div>
    </details>
  );
}

export function HierarchyAggregatorRunSections({
  compact,
  output,
}: {
  compact?: boolean;
  output: Record<string, unknown>;
}) {
  const categoryRows = getCategoryRows(output);
  const rollupRows = getRollupRows(output);
  const formulaRows = getFormulaRows(output);
  const formulaTraceRows = getFormulaTraceRows(output);
  const warnings = getWarnings(output);

  return (
    <div className="space-y-3">
      <Section title="Category totals">
        <ProofTable
          columns={[
            "categoryId",
            "categoryLabel",
            "total",
            "rowCount",
            "sourceRows",
          ]}
          compact={compact}
          emptyLabel="Run the Rollup & Calculation Engine to see mapped category totals."
          rows={categoryRows}
        />
      </Section>

      <Section title="Rollup / group totals">
        <ProofTable
          columns={[
            "nodeId",
            "label",
            "mode",
            "operation",
            "inputRefs",
            "result",
            "warnings",
          ]}
          compact={compact}
          emptyLabel="No rollup totals are available yet."
          rows={rollupRows}
        />
      </Section>

      <Section title="Formula / final totals">
        <ProofTable
          columns={[
            "nodeId",
            "label",
            "mode",
            "expression",
            "inputRefs",
            "result",
            "resultName",
          ]}
          compact={compact}
          emptyLabel="No formula or final totals are available yet."
          rows={formulaRows}
        />
      </Section>

      <Section title="Formula trace">
        <ProofTable
          columns={[
            "nodeId",
            "formula",
            "inputValues",
            "computation",
            "result",
            "warnings",
          ]}
          compact={compact}
          emptyLabel="No formula trace is available yet."
          rows={formulaTraceRows}
        />
      </Section>

      {warnings.length > 0 && (
        <Section title="Warnings">
          <ul className="space-y-1 text-muted-foreground text-xs">
            {warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
