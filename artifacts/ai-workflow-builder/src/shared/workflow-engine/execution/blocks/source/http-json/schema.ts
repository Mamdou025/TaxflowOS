// ─────────────────────────────────────────────────────────────────────────────
// HTTP / JSON Source — config parsing, the live fetcher, and payload→rows mapping.
//
// Mirrors the currency-rate block's split (see ../currency-rate/schema.ts):
//   • `fetchJsonSource()` is IMPURE — it performs the network call. It runs on the
//     api-server (routes/http-source.ts) so the browser never hits CORS and no
//     credential ever reaches the client.
//   • `run.ts` stays PURE and deterministic — it replays whatever rows were pinned
//     into block config by a previous fetch. A run therefore records the exact
//     payload it used, which is what makes the evidence pack meaningful.
//
// The mapping layer is deliberately generic: point `url` at any JSON API, say
// where the array lives (`resultsPath`) and which record fields become the row's
// label/amount/etc (`fieldMap`), and any public API becomes engine rows.
// ─────────────────────────────────────────────────────────────────────────────

import type { ManualTableRow } from "../manual-table/schema";

export type HttpJsonFieldMap = {
  rowId?: string;
  label?: string;
  description?: string;
  amount?: string;
  currency?: string;
  account?: string;
};

export type HttpJsonResponseMeta = {
  status?: number;
  url?: string;
  method?: string;
  fetchedAt?: string;
  durationMs?: number;
  recordCount?: number;
  truncated?: boolean;
  totalBytes?: number;
};

export type HttpJsonSourceConfig = {
  url: string;
  method: "GET" | "POST";
  headers: Record<string, string>;
  body?: unknown;
  resultsPath?: string;
  fieldMap: HttpJsonFieldMap;
  currency?: string;
  maxRows: number;
  /** Unit weight for records with no numeric field — see mapRecordsToRows. */
  defaultAmount?: number;
  /** Rows pinned into config by a prior live fetch — the deterministic replay set. */
  fetchedRows?: ManualTableRow[];
  responseMeta?: HttpJsonResponseMeta;
};

export const HTTP_JSON_MAX_ROWS = 1000;
export const HTTP_JSON_MAX_BYTES = 8 * 1024 * 1024;
export const HTTP_JSON_TIMEOUT_MS = 30_000;

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function parseStringMap(value: unknown): Record<string, string> {
  const record = asRecord(value);
  if (!record) {
    return {};
  }
  const entries = Object.entries(record).flatMap(([key, raw]) =>
    typeof raw === "string" ? [[key, raw] as const] : []
  );
  return Object.fromEntries(entries);
}

export function parseHttpJsonConfig(
  config: Record<string, unknown>
): HttpJsonSourceConfig {
  const rawMethod = optionalString(config.method)?.toUpperCase();
  const maxRows = Number(config.maxRows);

  return {
    body: config.body,
    currency: optionalString(config.currency),
    defaultAmount: Number.isFinite(Number(config.defaultAmount))
      ? Number(config.defaultAmount)
      : undefined,
    fetchedRows: Array.isArray(config.fetchedRows)
      ? (config.fetchedRows as ManualTableRow[])
      : undefined,
    fieldMap: {
      account: optionalString(asRecord(config.fieldMap)?.account),
      amount: optionalString(asRecord(config.fieldMap)?.amount),
      currency: optionalString(asRecord(config.fieldMap)?.currency),
      description: optionalString(asRecord(config.fieldMap)?.description),
      label: optionalString(asRecord(config.fieldMap)?.label),
      rowId: optionalString(asRecord(config.fieldMap)?.rowId),
    },
    headers: parseStringMap(config.headers),
    maxRows:
      Number.isFinite(maxRows) && maxRows > 0
        ? Math.min(maxRows, HTTP_JSON_MAX_ROWS)
        : HTTP_JSON_MAX_ROWS,
    method: rawMethod === "POST" ? "POST" : "GET",
    resultsPath: optionalString(config.resultsPath),
    responseMeta: asRecord(config.responseMeta) as
      | HttpJsonResponseMeta
      | undefined,
    url: optionalString(config.url) || optionalString(config.sourceLocator) || "",
  };
}

// ── SSRF guard ───────────────────────────────────────────────────────────────
// This block is reachable from an HTTP route AND from a chat tool the model can
// call, so an attacker-influenced URL must never be able to reach the private
// network or a cloud metadata endpoint.

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "metadata.google.internal",
  "metadata.goog",
]);

const BLOCKED_IPV4 =
  /^(0\.|10\.|127\.|169\.254\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\.)/;

export function assertPublicHttpUrl(rawUrl: string): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error(`"${rawUrl}" is not a valid URL.`);
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new Error(
      `Only http and https URLs can be called — got "${url.protocol}".`
    );
  }

  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");

  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith(".localhost")) {
    throw new Error("Requests to localhost are not allowed.");
  }
  if (BLOCKED_IPV4.test(hostname)) {
    throw new Error("Requests to private network addresses are not allowed.");
  }
  // IPv6 loopback / link-local / unique-local
  if (
    hostname === "::1" ||
    hostname.startsWith("fe80:") ||
    hostname.startsWith("fc") ||
    hostname.startsWith("fd")
  ) {
    throw new Error("Requests to private network addresses are not allowed.");
  }

  return url;
}

// ── payload → rows ───────────────────────────────────────────────────────────

/** Walk a dotted path ("data.items", "results.0.rows") into a payload. */
export function extractAtPath(payload: unknown, path?: string): unknown {
  if (!path) {
    return payload;
  }
  let cursor: unknown = payload;
  for (const segment of path.split(".")) {
    if (!segment) {
      continue;
    }
    if (Array.isArray(cursor)) {
      const index = Number(segment);
      cursor = Number.isInteger(index) ? cursor[index] : undefined;
      continue;
    }
    const record = asRecord(cursor);
    cursor = record ? record[segment] : undefined;
    if (cursor === undefined) {
      return;
    }
  }
  return cursor;
}

/** Find the most plausible array of records when no explicit path is given. */
export function findRecordArray(payload: unknown): unknown[] | null {
  if (Array.isArray(payload)) {
    return payload;
  }
  const record = asRecord(payload);
  if (!record) {
    return null;
  }
  // Prefer conventional envelope keys, then any array of objects.
  const preferred = ["results", "data", "items", "records", "rows", "features"];
  for (const key of preferred) {
    if (Array.isArray(record[key])) {
      return record[key] as unknown[];
    }
  }
  for (const value of Object.values(record)) {
    if (Array.isArray(value) && value.some((item) => asRecord(item))) {
      return value;
    }
  }
  return null;
}

function readField(
  record: Record<string, unknown>,
  key: string | undefined
): unknown {
  if (!key) {
    return;
  }
  return key.includes(".") ? extractAtPath(record, key) : record[key];
}

function coerceNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value.replaceAll(/[,$\s]/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function coerceText(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  // Real APIs routinely put a classification in a small array — tags, categories,
  // region codes (`counties: ["CA-MB"]`). Joining makes that field matchable by
  // the keyword mapper instead of silently becoming undefined.
  if (Array.isArray(value)) {
    const parts = value
      .map((item) =>
        typeof item === "string" || typeof item === "number"
          ? String(item).trim()
          : ""
      )
      .filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : undefined;
  }
  return;
}

/** Guess which field holds the label / amount when no fieldMap is supplied. */
const LABEL_HINTS = ["name", "label", "title", "description", "id"];
const AMOUNT_HINTS = ["amount", "value", "total", "cost", "price", "sum"];

function guessKey(
  record: Record<string, unknown>,
  hints: string[],
  predicate: (value: unknown) => boolean
): string | undefined {
  const keys = Object.keys(record);
  for (const hint of hints) {
    const hit = keys.find(
      (key) => key.toLowerCase().includes(hint) && predicate(record[key])
    );
    if (hit) {
      return hit;
    }
  }
  return keys.find((key) => predicate(record[key]));
}

export function mapRecordsToRows({
  records,
  fieldMap,
  currency,
  maxRows,
  defaultAmount,
}: {
  records: unknown[];
  fieldMap: HttpJsonFieldMap;
  currency?: string;
  maxRows: number;
  /**
   * Weight for records that carry no numeric field at all. Plenty of useful APIs
   * return a list of THINGS rather than a list of money — public holidays,
   * events, inspections — and every one of those rows would otherwise be dropped
   * as "no numeric amount". Set it to 1 and each record counts once, which is
   * exactly what a count-then-multiply calculation needs. Left unset, the strict
   * behaviour stands: a row with no parseable amount is skipped, not invented.
   */
  defaultAmount?: number;
}): { rows: ManualTableRow[]; skipped: number; truncated: boolean } {
  const truncated = records.length > maxRows;
  const slice = truncated ? records.slice(0, maxRows) : records;

  const first = slice.map(asRecord).find(Boolean) || {};
  const labelKey =
    fieldMap.label ||
    guessKey(first, LABEL_HINTS, (value) => typeof value === "string");
  const amountKey =
    fieldMap.amount ||
    guessKey(first, AMOUNT_HINTS, (value) => coerceNumber(value) !== null);

  let skipped = 0;
  const rows: ManualTableRow[] = [];

  slice.forEach((entry, index) => {
    const record = asRecord(entry);
    if (!record) {
      skipped += 1;
      return;
    }

    const amount =
      coerceNumber(readField(record, amountKey)) ?? defaultAmount ?? null;
    if (amount === null) {
      skipped += 1;
      return;
    }

    const label =
      coerceText(readField(record, labelKey)) || `Record ${index + 1}`;

    rows.push({
      account: coerceText(readField(record, fieldMap.account)),
      amount,
      currency:
        coerceText(readField(record, fieldMap.currency)) || currency || "USD",
      description: coerceText(readField(record, fieldMap.description)),
      label,
      raw: record,
      rowId:
        coerceText(readField(record, fieldMap.rowId)) || `api-row-${index + 1}`,
      rowNumber: index + 1,
    });
  });

  return { rows, skipped, truncated };
}

// ── the live fetch (impure — server-side only) ───────────────────────────────

export type FetchJsonSourceResult = {
  rows: ManualTableRow[];
  responseMeta: HttpJsonResponseMeta;
  skipped: number;
  /** A small slice of the raw payload, kept for the evidence pack. */
  samplePayload: unknown;
};

export type FetchJsonPayloadResult = {
  payload: unknown;
  responseMeta: HttpJsonResponseMeta;
  rawText: string;
};

/**
 * Fetch + parse only — no row mapping. Shared by the workflow block (which then
 * maps to rows) and the `callApi` assistant tool (which just shows the response).
 */
export async function fetchJsonPayload(
  config: Pick<HttpJsonSourceConfig, "url" | "method" | "headers" | "body">
): Promise<FetchJsonPayloadResult> {
  const url = assertPublicHttpUrl(config.url);
  const startedAt = Date.now();

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), HTTP_JSON_TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(url, {
      body:
        config.method === "POST" && config.body !== undefined
          ? typeof config.body === "string"
            ? config.body
            : JSON.stringify(config.body)
          : undefined,
      headers: {
        accept: "application/json",
        ...(config.method === "POST"
          ? { "content-type": "application/json" }
          : {}),
        ...config.headers,
      },
      method: config.method,
      redirect: "follow",
      signal: controller.signal,
    });
  } catch (cause) {
    clearTimeout(timeout);
    const reason = cause instanceof Error ? cause.message : "request failed";
    throw new Error(`Request to ${url.host} failed: ${reason}`);
  }
  clearTimeout(timeout);

  const text = await response.text();
  if (text.length > HTTP_JSON_MAX_BYTES) {
    throw new Error(
      `Response is ${Math.round(text.length / 1024 / 1024)}MB — larger than the ${
        HTTP_JSON_MAX_BYTES / 1024 / 1024
      }MB limit.`
    );
  }

  if (!response.ok) {
    throw new Error(
      `${config.method} ${url.pathname} returned HTTP ${response.status}. ${text.slice(0, 300)}`
    );
  }

  let payload: unknown;
  try {
    payload = JSON.parse(text);
  } catch {
    throw new Error(
      `Response was not JSON (starts with: ${text.slice(0, 120)}…).`
    );
  }

  return {
    payload,
    rawText: text,
    responseMeta: {
      durationMs: Date.now() - startedAt,
      fetchedAt: new Date().toISOString(),
      method: config.method,
      status: response.status,
      totalBytes: text.length,
      url: url.toString(),
    },
  };
}

export async function fetchJsonSource(
  config: HttpJsonSourceConfig
): Promise<FetchJsonSourceResult> {
  const { payload, responseMeta } = await fetchJsonPayload(config);

  const located = extractAtPath(payload, config.resultsPath);
  const records = Array.isArray(located)
    ? located
    : findRecordArray(located) || findRecordArray(payload);

  if (!records) {
    throw new Error(
      config.resultsPath
        ? `No array found at "${config.resultsPath}".`
        : "Could not find an array of records in the response — set resultsPath."
    );
  }

  const { rows, skipped, truncated } = mapRecordsToRows({
    currency: config.currency,
    defaultAmount: config.defaultAmount,
    fieldMap: config.fieldMap,
    maxRows: config.maxRows,
    records,
  });

  return {
    responseMeta: {
      ...responseMeta,
      recordCount: records.length,
      truncated,
    },
    rows,
    samplePayload: records.slice(0, 3),
    skipped,
  };
}
