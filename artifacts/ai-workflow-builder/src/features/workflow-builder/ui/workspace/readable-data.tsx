import { useState } from "react";

export const dataLabel = (key: string) =>
  key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ");
export const hasValue = (value: unknown): boolean =>
  value !== undefined &&
  value !== null &&
  value !== "" &&
  (typeof value !== "object" || Object.keys(value).length > 0);
const DETAIL_FIELDS = new Set(['primaryOutputRole', 'evidenceRefs', 'sourceTrace', 'ruleTrace', 'ruleSourceTrace', 'immutable', 'readOnlyEvidence', 'raw', 'metadata', 'backendOutputs', 'bindingValidation', 'upstreamBlockIds', 'rowSourceTrace', 'sourceRow', 'matchedRuleId', 'ruleId', 'categoryId', 'rowId', 'matchedKeyword', 'target']);
function Value({ value, depth = 0, showDetails = false }: { value: unknown; depth?: number; showDetails?: boolean }) {
  if (value == null || (typeof value === "number" && !Number.isFinite(value)))
    return <span className="text-muted-foreground">Awaiting data</span>;
  if (typeof value !== "object")
    return (
      <span className="whitespace-pre-wrap break-words">
        {typeof value === "number" ? value.toLocaleString(undefined, { maximumSignificantDigits: 21 }) : String(value)}
      </span>
    );
  if (depth > 4)
    return (
      <details>
        <summary>View details</summary>
        <pre>{JSON.stringify(value, null, 2)}</pre>
      </details>
    );
  if (Array.isArray(value)) {
    if (!value.length)
      return <span className="text-muted-foreground">No records</span>;
    if (
      value.every(
        (row) => row && typeof row === "object" && !Array.isArray(row),
      )
    ) {
      return <RecordTable rows={value} depth={depth} showDetails={showDetails} />;
    }

    return (
      <ul className="space-y-1">
        {value.slice(0, 100).map((item, i) => (
          <li key={i}>
            <Value value={item} depth={depth + 1} showDetails={showDetails} />
          </li>
        ))}
      </ul>
    );
  }
  const entries = Object.entries(value).filter(([key, item]) => (showDetails || !DETAIL_FIELDS.has(key)) && hasValue(item));
  if (!entries.length)
    return <span className="text-muted-foreground">No values produced</span>;
  return (
    <div className="space-y-3">
      {entries.map(([key, item]) => (
        <div key={key} className={typeof item !== 'object' ? 'flex items-start justify-between gap-4 border-b pb-1' : undefined}>
          <div className="mb-1 shrink-0 text-xs font-medium text-muted-foreground">
            {dataLabel(key)}
          </div>
          <Value value={item} depth={depth + 1} showDetails={showDetails} />
        </div>
      ))}
    </div>
  );
}
function RecordTable({ rows, depth, showDetails }: { rows: Record<string, unknown>[]; depth: number; showDetails: boolean }) {
  const [page, setPage] = useState(0);
  const keys = [...new Set(rows.flatMap(Object.keys))].filter(key => (showDetails || !DETAIL_FIELDS.has(key)) && rows.some(row => hasValue(row[key])));
  const current = Math.min(page, Math.max(0, Math.ceil(rows.length / 100) - 1));
  return <div className="space-y-2">
    <div className="max-h-96 overflow-auto"><table className="w-full text-left text-xs"><thead><tr>{keys.map(key => <th className="sticky top-0 border-b bg-background p-2" key={key}>{dataLabel(key)}</th>)}</tr></thead><tbody>{rows.slice(current * 100, current * 100 + 100).map((row, index) => <tr key={index}>{keys.map(key => <td className="border-b p-2 align-top" key={key}><Value value={row[key]} depth={depth + 1} showDetails={showDetails} /></td>)}</tr>)}</tbody></table></div>
    {rows.length > 100 && <div className="flex gap-3 text-xs"><button disabled={current === 0} onClick={() => setPage(current - 1)}>Previous 100 records</button><span>Records {current * 100 + 1}-{Math.min(rows.length, current * 100 + 100)} of {rows.length}</span><button disabled={(current + 1) * 100 >= rows.length} onClick={() => setPage(current + 1)}>Next 100 records</button></div>}
  </div>;
}
function usefulData(value: unknown): unknown {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return value;
  const data = value as Record<string, unknown>;
  if (data.canonicalJson) return usefulData(data.canonicalJson);
  if (data.calculatedResults) return { calculatedResults: data.calculatedResults };
  if (data.calculated_results) return usefulData(data.calculated_results);
  if (data.rollupTotals || data.categoryTotals) return { ...(hasValue(data.categoryTotals) ? { categoryTotals: data.categoryTotals } : {}), ...(hasValue(data.rollupTotals) ? { rollupTotals: data.rollupTotals } : {}) };
  if (data.mappedRows) return { mappedRows: data.mappedRows, ...(hasValue(data.unmatchedRows) ? { unmatchedRows: data.unmatchedRows } : {}) };
  if (data.rows) return { rows: data.rows };
  return value;
}
export function ReadableData({ value }: { value: unknown }) {
  const [json, setJson] = useState(false);
  const [details, setDetails] = useState(false);
  return (
    <div className="min-w-0 space-y-2 text-sm">
      <div className="flex gap-3">
        <button
          type="button"
          className={!json ? "font-semibold" : "text-muted-foreground"}
          onClick={() => { setJson(false); setDetails(false); }}
        >
          Values
        </button>
        <button
          type="button"
          className={json ? "font-semibold" : "text-muted-foreground"}
          onClick={() => setJson(true)}
        >
          JSON
        </button>
        <button type="button" onClick={() => { setDetails(true); setJson(false); }}>All details</button>
      </div>
      {json ? (
        <pre className="max-h-96 overflow-auto rounded bg-muted/30 p-3 text-xs">
          {JSON.stringify(value ?? null, null, 2)}
        </pre>
      ) : (
        <Value value={details ? value : usefulData(value)} showDetails={details} />
      )}
    </div>
  );
}
