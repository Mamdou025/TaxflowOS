

// Setup panel for the API / HTTP Request source — a real request builder.
//
// The engine half of this block was already real (server-side fetch, SSRF guard,
// headers, timeout and size limits, payload→rows mapping) but nothing in the
// builder drove it: the block hit SourceSetupPanel's "no panel registered" fallback,
// so an API source could only ever replay its offline fixture. This is the missing
// half — compose the request, send it for real, read the actual response.
//
// Two things keep it honest rather than decorative:
//   • Send calls POST /api/http-source, which performs the network call from the
//     api-server. What you see under "Response" is that endpoint's real body, its
//     real HTTP status and its real timing — not a shaped preview.
//   • A successful send PINS the mapped rows + response metadata into block config.
//     The run then replays exactly that payload (run.ts is pure), so the workflow
//     reproduces its figures and the evidence pack can name the response they came
//     from. Un-pinned, the block runs on the fixture and says so.

import { useEffect, useState } from "react";
import { Loader2, Play, Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { WorkflowBlock } from "@/shared/workflow-engine/local-fiscal-workflow";
import {
  API_CONNECTORS,
  apiRequestToBlockConfig,
  buildApiRequest,
  CUSTOM_CONNECTOR_ID,
  getApiConnector,
  withParamDefaults,
  type ApiParam,
  type ApiParamValues,
} from "@/shared/workflow-engine/execution/blocks/source/http-json/connectors";
import { useParamOptions } from "@/features/workflow-builder/ui/source-viewers/use-param-options";

type HttpJsonSourcePanelProps = {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  disabled?: boolean;
  onConfigPatch: (patch: Record<string, unknown>) => void;
  sourceLocked: boolean;
  sourceVersion: number;
};

type HeaderRow = { id: string; name: string; value: string };

type SendResult = {
  ok: boolean;
  reason?: string;
  missingSecrets?: string[];
  preview?: string;
  rows?: unknown[];
  rowCount?: number;
  skipped?: number;
  samplePayload?: unknown;
  responseMeta?: {
    status?: number;
    url?: string;
    method?: string;
    fetchedAt?: string;
    durationMs?: number;
    recordCount?: number;
    truncated?: boolean;
    totalBytes?: number;
  };
};

/** The row fields the mapper understands; blank means "guess from the payload". */
const FIELD_MAP_KEYS = [
  { hint: "e.g. recipient_name", key: "label", label: "Label" },
  { hint: "e.g. obligated_amount", key: "amount", label: "Amount" },
  { hint: "e.g. currency", key: "currency", label: "Currency field" },
  { hint: "e.g. awarding_agency", key: "account", label: "Account" },
  { hint: "e.g. internal_id", key: "rowId", label: "Row id" },
  { hint: "e.g. description", key: "description", label: "Description" },
] as const;

function stringValue(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function headersToRows(value: unknown): HeaderRow[] {
  return Object.entries(asRecord(value)).map(([name, raw], index) => ({
    id: `h${index}`,
    name,
    value: typeof raw === "string" ? raw : "",
  }));
}

function rowsToHeaders(rows: HeaderRow[]): Record<string, string> {
  return Object.fromEntries(
    rows
      .filter((row) => row.name.trim())
      .map((row) => [row.name.trim(), row.value])
  );
}

function formatBytes(bytes?: number) {
  if (!bytes && bytes !== 0) {
    return "—";
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * One connector parameter. A parameter that declares an `optionsSource` gets a
 * menu of whatever that source publishes; one with fixed `options` gets those;
 * anything else is a plain field. No per-parameter special-casing here — that is
 * the whole point of declaring the source on the parameter.
 */
function ParamField({
  connectorId,
  disabled,
  onChange,
  param,
  value,
}: {
  connectorId: string;
  disabled: boolean;
  onChange: (next: string | number) => void;
  param: ApiParam;
  value: string | number;
}) {
  const { options: liveOptions } = useParamOptions(
    param.optionsSource ? connectorId : undefined,
    param.optionsSource ? param.key : undefined
  );

  if (param.optionsSource) {
    if (liveOptions === null) {
      return (
        <div className="flex h-9 items-center gap-2 rounded-md border px-3 text-muted-foreground text-xs">
          <Loader2 className="size-3.5 animate-spin" /> Loading…
        </div>
      );
    }
    if (liveOptions.length > 0) {
      return (
        <Select
          disabled={disabled}
          onValueChange={onChange}
          value={String(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${param.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {liveOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }
    // Lookup failed — fall through to free text rather than an empty menu.
  }

  if (param.options) {
    return (
      <Select disabled={disabled} onValueChange={onChange} value={String(value)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {param.options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  const numeric = param.kind === "year" || param.kind === "number";
  return (
    <Input
      disabled={disabled}
      inputMode={numeric ? "numeric" : undefined}
      onChange={(event) =>
        onChange(
          numeric && event.target.value !== ""
            ? Number(event.target.value)
            : event.target.value
        )
      }
      value={String(value ?? "")}
    />
  );
}

function Field({
  children,
  hint,
  label,
}: {
  children: React.ReactNode;
  hint?: string;
  label: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-muted-foreground text-xs">{label}</Label>
      {children}
      {hint ? (
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function MetaRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground tabular-nums">{value}</span>
    </div>
  );
}

export function HttpJsonSourcePanel({
  config,
  disabled,
  onConfigPatch,
  sourceLocked,
  sourceVersion,
}: HttpJsonSourcePanelProps) {
  const readOnly = Boolean(disabled) || sourceLocked;
  const method = stringValue(config.method, "GET").toUpperCase() === "POST"
    ? "POST"
    : "GET";
  const fieldMap = asRecord(config.fieldMap);

  const [headerRows, setHeaderRows] = useState<HeaderRow[]>(() =>
    headersToRows(config.headers)
  );
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<SendResult | null>(null);
  const [showBody, setShowBody] = useState(false);
  const [showRequest, setShowRequest] = useState(true);

  // ── Connector layer ────────────────────────────────────────────────────────
  // `connectorId` picks a named upstream; `connectorParams` holds the business
  // inputs (year, currency, agency). Everything the engine reads — url, method,
  // body, fieldMap — is DERIVED from those and written back into config, so this
  // is purely how the config gets authored. "custom" drops to the raw editor.
  const connectorId = stringValue(config.connectorId, CUSTOM_CONNECTOR_ID);
  const connector = getApiConnector(connectorId);
  const connectorParams = (config.connectorParams ?? {}) as ApiParamValues;
  const paramValues = connector
    ? withParamDefaults(connector, connectorParams)
    : {};
  const built = connector ? buildApiRequest(connector.id, paramValues) : null;

  /** Re-derive the whole request from a changed parameter, and store both. */
  const setParam = (key: string, value: string | number) => {
    if (!connector) {
      return;
    }
    const nextParams = { ...paramValues, [key]: value };
    const next = buildApiRequest(connector.id, nextParams);
    if (next.ok) {
      onConfigPatch(
        apiRequestToBlockConfig(connector.id, next.params, next.spec)
      );
    } else {
      // Keep the edit even while invalid, so a half-typed year isn't reverted.
      onConfigPatch({ connectorParams: nextParams });
    }
  };

  const selectConnector = (nextId: string) => {
    if (nextId === CUSTOM_CONNECTOR_ID) {
      onConfigPatch({ connectorId: CUSTOM_CONNECTOR_ID, connectorParams: {} });
      return;
    }
    const next = buildApiRequest(nextId, {});
    if (next.ok) {
      onConfigPatch(apiRequestToBlockConfig(nextId, next.params, next.spec));
    }
    setResult(null);
  };

  // Re-seed the header editor when the block selection changes underneath it.
  const headersKey = JSON.stringify(asRecord(config.headers));
  useEffect(() => {
    setHeaderRows(headersToRows(config.headers));
    setResult(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headersKey]);

  const commitHeaders = (rows: HeaderRow[]) => {
    setHeaderRows(rows);
    onConfigPatch({ headers: rowsToHeaders(rows) });
  };

  const pinnedRowCount = Array.isArray(config.fetchedRows)
    ? config.fetchedRows.length
    : 0;
  const pinnedMeta = asRecord(config.responseMeta);

  const send = async () => {
    setSending(true);
    setResult(null);
    try {
      const response = await fetch("/api/http-source", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: stringValue(config.url),
          method,
          headers: rowsToHeaders(headerRows),
          body: method === "POST" ? stringValue(config.body) : undefined,
          resultsPath: stringValue(config.resultsPath),
          fieldMap,
          currency: stringValue(config.currency),
          maxRows: Number(config.maxRows) || 250,
        }),
      });
      const data = (await response.json()) as SendResult;
      setResult(data);

      // Pin the response so the run replays it. Only on a clean, mapped result —
      // a failed or unmapped call must not silently replace working evidence.
      if (data.ok && Array.isArray(data.rows) && data.rows.length > 0) {
        onConfigPatch({
          fetchedRows: data.rows,
          responseMeta: data.responseMeta,
          samplePayload: data.samplePayload,
        });
      }
    } catch (error) {
      setResult({
        ok: false,
        reason:
          error instanceof Error
            ? error.message
            : "The request could not be sent.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-foreground text-sm">
          API / HTTP Request
        </h3>
        <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
          The call runs on the server, so there is no CORS limit and no key in the
          browser. A successful send pins the response into this block — the run
          then replays that exact payload instead of calling out again.
        </p>
      </div>

      {/* ── Which API ───────────────────────────────────────────────────────── */}
      <Field
        hint={
          connector
            ? `${connector.description} Provider: ${connector.provider}.`
            : "Compose the request by hand. Pick a named API instead to fill in business parameters and let it build the request."
        }
        label="API"
      >
        <Select
          disabled={readOnly}
          onValueChange={selectConnector}
          value={connectorId}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {API_CONNECTORS.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.provider} — {item.name}
              </SelectItem>
            ))}
            <SelectItem value={CUSTOM_CONNECTOR_ID}>
              Custom endpoint (raw URL)
            </SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {/* ── Parameters (connector mode) ─────────────────────────────────────── */}
      {connector ? (
        <div className="space-y-3 rounded-md border bg-muted/20 p-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="font-medium text-foreground text-xs">
                Parameters
              </h4>
              <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
                What to ask for — the request below is built from these. Sina
                fills the same fields when it sets this block up from chat.
              </p>
            </div>
            <Button
              className="shrink-0"
              disabled={readOnly || sending || !built?.ok}
              onClick={send}
              size="sm"
            >
              {sending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Play className="size-3.5" />
              )}
              {sending ? "Sending…" : "Send"}
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {connector.params.map((param) => (
              <Field hint={param.hint} key={param.key} label={param.label}>
                <ParamField
                  connectorId={connector.id}
                  disabled={readOnly}
                  onChange={(next) => setParam(param.key, next)}
                  param={param}
                  value={paramValues[param.key] ?? ""}
                />
              </Field>
            ))}
          </div>
          {built && !built.ok ? (
            <div className="rounded-md border border-red-500/40 bg-red-500/10 p-2 text-xs">
              {built.errors.map((error) => (
                <div key={error}>{error}</div>
              ))}
            </div>
          ) : null}
          {connector.docsUrl ? (
            <p className="text-[11px] text-muted-foreground">
              API docs:{" "}
              <span className="font-mono">{connector.docsUrl}</span>
            </p>
          ) : null}
        </div>
      ) : null}

      {/* ── The real request ────────────────────────────────────────────────── */}
      {/* Always visible, in both modes. In connector mode this is the whole point:
          parameters are convenient, but the request they resolve to is the thing
          that actually gets sent, so it must never be hidden behind them. */}
      <div className="rounded-md border">
        <button
          className="flex w-full items-center justify-between p-2.5 text-left"
          onClick={() => setShowRequest((open) => !open)}
          type="button"
        >
          <span className="font-medium text-foreground text-xs">
            Real request
          </span>
          <span className="text-[11px] text-muted-foreground">
            {showRequest ? "Hide" : "Show"}
          </span>
        </button>
        {showRequest ? (
          <pre className="max-h-64 overflow-auto border-t bg-muted/40 p-3 font-mono text-[11px] leading-relaxed">
            {`${method} ${stringValue(config.url) || "(no URL)"}`}
            {headerRows
              .filter((row) => row.name.trim())
              .map((row) => `\n${row.name}: ${row.value}`)
              .join("")}
            {config.body !== undefined && config.body !== ""
              ? `\n\n${
                  typeof config.body === "string"
                    ? config.body
                    : JSON.stringify(config.body, null, 2)
                }`
              : ""}
          </pre>
        ) : null}
      </div>

      {/* ── Raw request editor (custom mode) ────────────────────────────────── */}
      {connector ? null : (
        <div className="flex gap-2">
          <div className="w-24 shrink-0">
            <Select
              disabled={readOnly}
              onValueChange={(next) => onConfigPatch({ method: next })}
              value={method}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Input
            className="font-mono text-xs"
            disabled={readOnly}
            onChange={(event) => onConfigPatch({ url: event.target.value })}
            placeholder="https://api.example.com/v2/records"
            value={stringValue(config.url)}
          />
          <Button
            className="shrink-0"
            disabled={readOnly || sending || !stringValue(config.url)}
            onClick={send}
            size="sm"
          >
            {sending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Play className="size-3.5" />
            )}
            {sending ? "Sending…" : "Send"}
          </Button>
        </div>
      )}

      {/* ── Headers ─────────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-muted-foreground text-xs">Headers</Label>
          <Button
            disabled={readOnly}
            onClick={() =>
              commitHeaders([
                ...headerRows,
                { id: `h${Date.now()}`, name: "", value: "" },
              ])
            }
            size="sm"
            variant="ghost"
          >
            <Plus className="size-3.5" /> Add
          </Button>
        </div>
        {headerRows.map((row, index) => (
          <div className="flex gap-2" key={row.id}>
            <Input
              className="w-1/3 font-mono text-xs"
              disabled={readOnly}
              onChange={(event) => {
                const next = [...headerRows];
                next[index] = { ...row, name: event.target.value };
                commitHeaders(next);
              }}
              placeholder="Authorization"
              value={row.name}
            />
            <Input
              className="font-mono text-xs"
              disabled={readOnly}
              onChange={(event) => {
                const next = [...headerRows];
                next[index] = { ...row, value: event.target.value };
                commitHeaders(next);
              }}
              placeholder="Bearer {{env:MY_API_KEY}}"
              value={row.value}
            />
            <Button
              disabled={readOnly}
              onClick={() =>
                commitHeaders(headerRows.filter((item) => item.id !== row.id))
              }
              size="icon"
              variant="ghost"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </div>
        ))}
        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Block config is saved with the workflow, so a literal key here is a key
          stored in the workflow. Write{" "}
          <code className="rounded bg-muted px-1">{"{{env:NAME}}"}</code> instead
          to pull the value from the api-server's environment at call time — the
          workflow then holds only the name. Works in the URL and POST body too.
        </p>
      </div>

      {method === "POST" ? (
        <Field
          hint="Sent as-is with content-type: application/json."
          label="Request body"
        >
          <Textarea
            className="min-h-24 font-mono text-xs"
            disabled={readOnly}
            onChange={(event) => onConfigPatch({ body: event.target.value })}
            placeholder='{ "filters": { "fiscal_year": 2025 } }'
            value={stringValue(config.body)}
          />
        </Field>
      ) : null}

      {/* ── Mapping ─────────────────────────────────────────────────────────── */}
      {/* A connector owns its mapping (it knows the payload shape it asked for),
          so in connector mode this is shown as derived fact rather than offered
          as a setting — editing it by hand would just be overwritten on the next
          parameter change. */}
      <div className="space-y-3 rounded-md border bg-muted/20 p-3">
        <div>
          <h4 className="font-medium text-foreground text-xs">
            Response → rows
          </h4>
          <p className="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
            {connector
              ? `Set by ${connector.provider} — these are the fields its ${connector.recordLabel} map onto.`
              : "Where the records live in the payload, and which of their fields become each row. Leave a field blank and the mapper infers it from the first record."}
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <Field
            hint="Dotted path, e.g. results or data.items. Blank = search the payload."
            label="Results path"
          >
            <Input
              className="font-mono text-xs"
              disabled={readOnly || Boolean(connector)}
              onChange={(event) =>
                onConfigPatch({ resultsPath: event.target.value })
              }
              placeholder="results"
              value={stringValue(config.resultsPath)}
            />
          </Field>
          <Field hint="Applied to rows with no currency field." label="Default currency">
            <Input
              disabled={readOnly || Boolean(connector)}
              onChange={(event) =>
                onConfigPatch({ currency: event.target.value })
              }
              placeholder="USD"
              value={stringValue(config.currency)}
            />
          </Field>
          {FIELD_MAP_KEYS.map((entry) => (
            <Field hint={entry.hint} key={entry.key} label={entry.label}>
              <Input
                className="font-mono text-xs"
                disabled={readOnly || Boolean(connector)}
                onChange={(event) =>
                  onConfigPatch({
                    fieldMap: { ...fieldMap, [entry.key]: event.target.value },
                  })
                }
                placeholder="auto"
                value={stringValue(fieldMap[entry.key])}
              />
            </Field>
          ))}
          <Field hint="Hard cap 1000." label="Max rows">
            <Input
              disabled={readOnly || Boolean(connector)}
              inputMode="numeric"
              onChange={(event) =>
                onConfigPatch({ maxRows: Number(event.target.value) || 250 })
              }
              value={String(Number(config.maxRows) || 250)}
            />
          </Field>
        </div>
      </div>

      {/* ── Response ────────────────────────────────────────────────────────── */}
      {result ? (
        <div className="space-y-3">
          <div
            className={`rounded-md border p-3 text-xs ${
              result.ok
                ? "border-emerald-500/40 bg-emerald-500/10"
                : "border-red-500/40 bg-red-500/10"
            }`}
          >
            <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
              {result.ok ? "Response" : "Request failed"}
              {result.responseMeta?.status ? (
                <span className="rounded bg-background/60 px-1.5 py-0.5 font-mono text-[11px]">
                  HTTP {result.responseMeta.status}
                </span>
              ) : null}
            </div>
            {result.ok ? (
              <div className="space-y-1">
                <MetaRow
                  label="Records in payload"
                  value={result.responseMeta?.recordCount ?? "—"}
                />
                <MetaRow label="Rows mapped" value={result.rowCount ?? 0} />
                {result.skipped ? (
                  <MetaRow
                    label="Skipped (no numeric amount)"
                    value={result.skipped}
                  />
                ) : null}
                <MetaRow
                  label="Duration"
                  value={
                    result.responseMeta?.durationMs
                      ? `${result.responseMeta.durationMs} ms`
                      : "—"
                  }
                />
                <MetaRow
                  label="Payload size"
                  value={formatBytes(result.responseMeta?.totalBytes)}
                />
                {result.responseMeta?.truncated ? (
                  <p className="pt-1 text-amber-700 dark:text-amber-400">
                    Truncated at the row cap — raise Max rows to pin the rest.
                  </p>
                ) : null}
              </div>
            ) : (
              <p className="leading-relaxed text-foreground">{result.reason}</p>
            )}
          </div>

          {result.ok && Array.isArray(result.rows) && result.rows.length > 0 ? (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-xs">
                <thead className="bg-muted/50 text-muted-foreground">
                  <tr>
                    <th className="p-2 text-left font-medium">Label</th>
                    <th className="p-2 text-left font-medium">Account</th>
                    <th className="p-2 text-right font-medium">Amount</th>
                    <th className="p-2 text-left font-medium">Cur.</th>
                  </tr>
                </thead>
                <tbody>
                  {(result.rows as Record<string, unknown>[])
                    .slice(0, 10)
                    .map((row, index) => (
                      <tr className="border-t" key={index}>
                        <td className="max-w-[18rem] truncate p-2">
                          {stringValue(row.label)}
                        </td>
                        <td className="p-2 text-muted-foreground">
                          {stringValue(row.account, "—")}
                        </td>
                        <td className="p-2 text-right tabular-nums">
                          {typeof row.amount === "number"
                            ? row.amount.toLocaleString()
                            : "—"}
                        </td>
                        <td className="p-2 text-muted-foreground">
                          {stringValue(row.currency, "—")}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              {result.rows.length > 10 ? (
                <div className="border-t bg-muted/30 p-2 text-[11px] text-muted-foreground">
                  Showing 10 of {result.rows.length} pinned rows.
                </div>
              ) : null}
            </div>
          ) : null}

          {Boolean(result.preview || result.samplePayload) && (
            <div>
              <Button
                onClick={() => setShowBody((open) => !open)}
                size="sm"
                variant="ghost"
              >
                {showBody ? "Hide" : "Show"} raw response
              </Button>
              {showBody ? (
                <pre className="mt-2 max-h-72 overflow-auto rounded-md bg-muted/50 p-3 font-mono text-[11px] leading-relaxed">
                  {result.preview ??
                    JSON.stringify(result.samplePayload, null, 2)}
                </pre>
              ) : null}
            </div>
          )}
        </div>
      ) : null}

      {/* ── What the run will actually use ──────────────────────────────────── */}
      <div className="rounded-md bg-muted/40 p-3 text-muted-foreground text-xs">
        {pinnedRowCount > 0 ? (
          <>
            <div className="font-medium text-foreground">
              {pinnedRowCount} rows pinned — the run replays this response.
            </div>
            <div className="mt-1">
              Fetched:{" "}
              {pinnedMeta.fetchedAt
                ? new Date(String(pinnedMeta.fetchedAt)).toLocaleString()
                : "unknown"}
            </div>
            <div>Endpoint: {stringValue(pinnedMeta.url, "not recorded")}</div>
          </>
        ) : (
          <div className="text-amber-700 dark:text-amber-400">
            Nothing pinned yet — the run falls back to the offline sample rows and
            warns. Send the request to pin a real response.
          </div>
        )}
        <div className="mt-1">Source version: v{sourceVersion}</div>
        <div>Status: {sourceLocked ? "locked evidence" : "draft"}</div>
      </div>
    </div>
  );
}
