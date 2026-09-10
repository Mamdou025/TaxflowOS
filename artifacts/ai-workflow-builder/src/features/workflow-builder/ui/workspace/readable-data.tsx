import { useState } from "react";

export const dataLabel = (key: string) =>
  key.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/_/g, " ");
export const hasValue = (value: unknown): boolean =>
  value !== undefined &&
  value !== null &&
  value !== "" &&
  (typeof value !== "object" || Object.keys(value).length > 0);
const DETAIL_FIELDS = new Set(['primaryOutputRole', 'evidenceRefs', 'sourceTrace', 'ruleTrace', 'ruleSourceTrace', 'immutable', 'readOnlyEvidence', 'raw', 'metadata', 'backendOutputs', 'bindingValidation', 'upstreamBlockIds']);
function Value({ value, depth = 0 }: { value: unknown; depth?: number }) {
  if (value == null || (typeof value === "number" && !Number.isFinite(value)))
    return <span className="text-muted-foreground">Awaiting data</span>;
  if (typeof value !== "object")
    return (
      <span className="whitespace-pre-wrap break-words">
        {typeof value === "number" ? value.toLocaleString() : String(value)}
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
      const keys = [
        ...new Set(value.flatMap((row) => Object.keys(row))),
      ].filter((key) => !DETAIL_FIELDS.has(key) && value.some((row) => hasValue(row[key])));
      return (
        <div className="overflow-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr>
                {keys.map((key) => (
                  <th className="border-b bg-muted/40 p-2" key={key}>
                    {dataLabel(key)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {value.slice(0, 100).map((row, i) => (
                <tr key={i}>
                  {keys.map((key) => (
                    <td className="border-b p-2 align-top" key={key}>
                      <Value value={row[key]} depth={depth + 1} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {value.length > 100 && (
            <p>
              Showing 100 of {value.length} records. JSON contains all records.
            </p>
          )}
        </div>
      );
    }
    return (
      <ul className="space-y-1">
        {value.slice(0, 100).map((item, i) => (
          <li key={i}>
            <Value value={item} depth={depth + 1} />
          </li>
        ))}
      </ul>
    );
  }
  const entries = Object.entries(value).filter(([key, item]) => !DETAIL_FIELDS.has(key) && hasValue(item));
  if (!entries.length)
    return <span className="text-muted-foreground">No values produced</span>;
  return (
    <div className="space-y-3">
      {entries.map(([key, item]) => (
        <div key={key} className={typeof item !== 'object' ? 'flex items-start justify-between gap-4 border-b pb-1' : undefined}>
          <div className="mb-1 shrink-0 text-xs font-medium text-muted-foreground">
            {dataLabel(key)}
          </div>
          <Value value={item} depth={depth + 1} />
        </div>
      ))}
    </div>
  );
}
export function ReadableData({ value }: { value: unknown }) {
  const [json, setJson] = useState(false);
  return (
    <div className="min-w-0 space-y-2 text-sm">
      <div className="flex gap-3">
        <button
          type="button"
          className={!json ? "font-semibold" : "text-muted-foreground"}
          onClick={() => setJson(false)}
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
      </div>
      {json ? (
        <pre className="max-h-96 overflow-auto rounded bg-muted/30 p-3 text-xs">
          {JSON.stringify(value ?? null, null, 2)}
        </pre>
      ) : (
        <Value value={value} />
      )}
    </div>
  );
}
