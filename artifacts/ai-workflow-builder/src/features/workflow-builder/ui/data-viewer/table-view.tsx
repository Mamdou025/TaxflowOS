import { cn } from "@/lib/utils";
import { getAggregationRuleModeLabel } from "../source-viewers/aggregation-rule-modes";
import {
  asRecord,
  compactJson,
  formatCell,
  getDataKind,
  getRecordArray,
  humanizeKey,
  TABLE_KEYS_BY_KIND,
  unwrapPrimaryValue,
} from "./data-preview-utils";
import { JsonView } from "./json-view";

type TableRows = {
  keys: string[];
  rows: Record<string, unknown>[];
};

const EMPTY_TABLE_ROWS: TableRows = { keys: [], rows: [] };

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

function isNumericMap(record: Record<string, unknown>) {
  const values = Object.values(record);
  return (
    values.length > 0 &&
    values.every((value) => typeof value === "number" && Number.isFinite(value))
  );
}

function numericMapRows({
  labelKey,
  record,
  valueKey = "value",
}: {
  labelKey: string;
  record: Record<string, unknown> | null;
  valueKey?: string;
}) {
  if (!record) {
    return [];
  }
  return Object.entries(record).map(([key, value]) => ({
    [labelKey]: key,
    [valueKey]: value,
  }));
}

function formatTraceInputs(value: unknown) {
  const records = Array.isArray(value)
    ? value.map(asRecord).filter(Boolean)
    : [];
  if (records.length === 0) {
    return formatCell(value);
  }
  return records
    .map((record) => {
      const label =
        record?.label ||
        record?.categoryId ||
        record?.operand ||
        record?.refId ||
        record?.refType ||
        "input";
      const inputValue = record?.signedValue ?? record?.value ?? "-";
      return `${String(label)}=${String(inputValue)}`;
    })
    .join(", ");
}

function getFormulaTraceTableRows(
  primaryRecord: Record<string, unknown> | null,
  contextData?: Record<string, unknown>
): TableRows {
  const trace = primaryRecord || asRecord(contextData?.formulaTrace);
  return {
    keys: [
      "nodeId",
      "formula",
      "inputValues",
      "computation",
      "result",
      "warnings",
    ],
    rows: trace
      ? Object.entries(trace).map(([nodeId, value]) => {
          const record = asRecord(value);
          return {
            computation:
              asStringList(record?.inputRefs).join(", ") ||
              record?.operation ||
              "-",
            formula: record?.expression || "-",
            inputValues: formatTraceInputs(record?.inputValues),
            nodeId: record?.nodeId || nodeId,
            result: record?.result ?? "-",
            warnings: asStringList(record?.warnings).join(", ") || "-",
          };
        })
      : [],
  };
}

function getCategoryTotalTableRows(
  primaryRecord: Record<string, unknown> | null,
  contextData?: Record<string, unknown>
): TableRows {
  const details = asRecord(contextData?.categoryTotalDetails);
  return {
    keys: ["categoryId", "categoryLabel", "total", "rowCount", "sourceRows"],
    rows:
      details && Object.keys(details).length > 0
        ? Object.entries(details).map(([categoryId, value]) => {
            const record = asRecord(value);
            return {
              categoryId: record?.categoryId || categoryId,
              categoryLabel: record?.categoryLabel || categoryId,
              rowCount: record?.rowCount ?? "-",
              sourceRows: asStringList(record?.includedRows).join(", "),
              total: record?.value ?? record?.amount ?? "-",
            };
          })
        : numericMapRows({
            labelKey: "categoryId",
            record: primaryRecord,
            valueKey: "total",
          }),
  };
}

function getNodeTotalTableRows(
  primaryRecord: Record<string, unknown> | null,
  contextData?: Record<string, unknown>
): TableRows {
  const details = asRecord(contextData?.nodeTotalDetails);
  return {
    keys: [
      "nodeId",
      "label",
      "mode",
      "operation",
      "result",
      "resultName",
      "warnings",
    ],
    rows:
      details && Object.keys(details).length > 0
        ? Object.entries(details).map(([nodeId, value]) => {
            const record = asRecord(value) || {};
            return {
              label: record.label || nodeId,
              mode: getAggregationRuleModeLabel(record),
              nodeId: record.nodeId || nodeId,
              operation: record.operation || "-",
              result: record.value ?? record.amount ?? "-",
              resultName: record.resultName || "-",
              warnings: asStringList(record.warnings).join(", ") || "-",
            };
          })
        : numericMapRows({
            labelKey: "nodeId",
            record: primaryRecord,
            valueKey: "result",
          }),
  };
}

function getNamedTotalTableRows(
  primaryRecord: Record<string, unknown> | null,
  outputType?: string
): TableRows {
  let labelKey = "resultName";
  if (outputType?.includes("group_totals")) {
    labelKey = "nodeId";
  } else if (outputType?.includes("rollup_totals")) {
    labelKey = "rollupId";
  } else if (outputType?.includes("named_values")) {
    labelKey = "name";
  }
  return {
    keys: [labelKey, "value"],
    rows: numericMapRows({ labelKey, record: primaryRecord }),
  };
}

function getAggregationTableRows({
  contextData,
  outputType,
  primary,
}: {
  contextData?: Record<string, unknown>;
  outputType?: string;
  primary: unknown;
}): TableRows {
  const primaryRecord = asRecord(primary);
  if (
    outputType?.includes("formula_trace") ||
    outputType?.includes("rollup_formula_trace")
  ) {
    return getFormulaTraceTableRows(primaryRecord, contextData);
  }
  if (outputType?.includes("category_totals")) {
    return getCategoryTotalTableRows(primaryRecord, contextData);
  }
  if (outputType?.includes("node_totals")) {
    return getNodeTotalTableRows(primaryRecord, contextData);
  }
  if (
    outputType?.includes("group_totals") ||
    outputType?.includes("rollup_totals") ||
    outputType?.includes("named_values") ||
    outputType?.includes("calculated_results") ||
    outputType?.includes("final_totals") ||
    outputType?.includes("official_line_values")
  ) {
    return getNamedTotalTableRows(primaryRecord, outputType);
  }
  return primaryRecord && isNumericMap(primaryRecord)
    ? {
        keys: ["name", "value"],
        rows: numericMapRows({ labelKey: "name", record: primaryRecord }),
      }
    : EMPTY_TABLE_ROWS;
}

function getScrollFrameHeightClass({
  expanded,
  fill,
}: {
  expanded?: boolean;
  fill?: boolean;
}) {
  if (fill) {
    return "min-h-0 flex-1";
  }
  if (expanded) {
    return "max-h-[62vh]";
  }
  return "max-h-64";
}

export function SimpleTable({
  expanded,
  fill,
  keys,
  rows,
}: {
  expanded?: boolean;
  fill?: boolean;
  keys: string[];
  rows: Record<string, unknown>[];
}) {
  return (
    <div
      className={cn(
        "overflow-auto rounded border bg-background/70",
        getScrollFrameHeightClass({ expanded, fill })
      )}
    >
      <table className="w-full min-w-[520px] text-left text-xs">
        <thead className="sticky top-0 bg-background">
          <tr className="border-b">
            {keys.map((key) => (
              <th className="px-2 py-1 font-medium" key={key}>
                {humanizeKey(key)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              className="border-b last:border-b-0"
              key={String(
                row.rowId || row.ruleId || row.id || compactJson(row)
              )}
            >
              {keys.map((key) => (
                <td
                  className={cn(
                    "px-2 py-1 align-top",
                    expanded
                      ? "max-w-[28rem] whitespace-normal break-words"
                      : "max-w-64 truncate"
                  )}
                  key={key}
                >
                  {formatCell(row[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DefinitionList({ value }: { value: Record<string, unknown> }) {
  return (
    <div className="divide-y rounded border text-xs">
      {Object.entries(value).map(([key, fieldValue]) => (
        <div
          className="grid grid-cols-[8rem_1fr] gap-2 bg-background/50 px-2 py-1.5"
          key={key}
        >
          <span className="text-muted-foreground">{humanizeKey(key)}</span>
          <span className="break-words font-medium">
            {formatCell(fieldValue)}
          </span>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({ children }: { children: string }) {
  return (
    <div className="rounded border bg-muted/20 p-3 text-muted-foreground text-xs">
      {children}
    </div>
  );
}

function AggregationTableView({
  contextData,
  expanded,
  fill,
  outputType,
  primary,
  record,
}: {
  contextData?: Record<string, unknown>;
  expanded?: boolean;
  fill?: boolean;
  outputType?: string;
  primary: unknown;
  record: Record<string, unknown> | null;
}) {
  const aggregationTable = getAggregationTableRows({
    contextData,
    outputType,
    primary,
  });
  return (
    <div className={cn("space-y-2", fill && "flex h-full min-h-0 flex-col")}>
      {aggregationTable.rows.length > 0 ? (
        <SimpleTable
          expanded={expanded}
          fill={fill}
          keys={aggregationTable.keys}
          rows={aggregationTable.rows}
        />
      ) : (
        <DefinitionList value={record || { value: primary }} />
      )}
      {Array.isArray(contextData?.includedRows) && (
        <>
          <div className="font-medium text-xs">Included rows</div>
          <SimpleTable
            expanded={expanded}
            fill={fill}
            keys={["rowId", "label", "categoryId", "categoryLabel", "amount"]}
            rows={getRecordArray(contextData.includedRows)}
          />
        </>
      )}
      {Array.isArray(contextData?.excludedRows) && (
        <>
          <div className="font-medium text-xs">Excluded rows</div>
          <SimpleTable
            expanded={expanded}
            fill={fill}
            keys={["rowId", "label", "categoryId", "categoryLabel", "amount"]}
            rows={getRecordArray(contextData.excludedRows)}
          />
        </>
      )}
    </div>
  );
}

function getRowsForKind(kind: string, primary: unknown) {
  if (kind !== "aggregation_rules") {
    return getRecordArray(primary);
  }
  return getRecordArray(primary).map((row) => ({
    ...row,
    mode: getAggregationRuleModeLabel(row),
  }));
}

export function TableView({
  contextData,
  expanded,
  fill,
  outputType,
  value,
}: {
  contextData?: Record<string, unknown>;
  expanded?: boolean;
  fill?: boolean;
  outputType?: string;
  value: unknown;
}) {
  const kind = getDataKind(outputType, value);
  const primary = unwrapPrimaryValue(value);
  const record = asRecord(primary);

  if (kind === "evidence_preview" && typeof value === "string") {
    return (
      <pre
        className={cn(
          "whitespace-pre-wrap rounded border bg-muted/20 p-3 text-xs",
          fill && "min-h-0 flex-1 overflow-auto"
        )}
      >
        {value}
      </pre>
    );
  }

  if (kind === "aggregation") {
    return (
      <AggregationTableView
        contextData={contextData}
        expanded={expanded}
        fill={fill}
        outputType={outputType}
        primary={primary}
        record={record}
      />
    );
  }

  if (kind === "canonical_json") {
    const finalResult = asRecord(record?.finalResult);
    return finalResult ? (
      <DefinitionList value={finalResult} />
    ) : (
      <JsonView value={value} />
    );
  }

  const rows = getRowsForKind(kind, primary);
  if (rows.length > 0) {
    return (
      <SimpleTable
        expanded={expanded}
        fill={fill}
        keys={TABLE_KEYS_BY_KIND[kind] || Object.keys(rows[0]).slice(0, 8)}
        rows={rows}
      />
    );
  }

  if (record) {
    return <DefinitionList value={record} />;
  }

  return <EmptyState>No table preview available.</EmptyState>;
}
