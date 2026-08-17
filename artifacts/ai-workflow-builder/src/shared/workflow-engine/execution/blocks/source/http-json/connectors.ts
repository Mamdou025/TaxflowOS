// ─────────────────────────────────────────────────────────────────────────────
// API connectors — the semantic layer over a raw HTTP request.
//
// A connector is a named upstream ("Bank of Canada daily FX", "USAspending
// awards") that declares the BUSINESS parameters it needs — a year, a currency,
// an agency — and knows how to turn them into the real request: URL, method,
// headers, body, and the mapping that turns the response into engine rows.
//
// Why this exists: composing a URL is not a thing to ask a person or a model to
// do. Sina hand-writing `?start_date=2024-01-01&end_date=2024-12-31` is a
// plausible-looking string that silently returns the wrong window, and nothing
// downstream can tell. Picking `boc.fx_observations` and filling `{year: 2024}`
// cannot go wrong that way — and it stays legible, because the block renders the
// exact request the parameters resolved to.
//
// Deliberately a CONFIG-AUTHORING layer, not a runtime one: `buildApiRequest`
// writes ordinary `url`/`method`/`body`/`fieldMap` keys into block config, so the
// engine, the api-server route and the pinned-replay path are all unchanged and
// unaware. A connector is how config gets *written*, never a second way to run.
//
// PURE — no fetch, no env, no DOM. Imported by the builder panel, the chat tools
// and the run flow alike.
// ─────────────────────────────────────────────────────────────────────────────

import type { HttpJsonFieldMap } from "./schema";

export type ApiParamKind = "year" | "currency" | "text" | "number" | "enum";

export type ApiParamOption = { value: string; label: string };

/**
 * Where a parameter's choices come from, when they are published by an API
 * rather than hardcoded.
 *
 * This exists so "what can I pick?" is a declarative property of the parameter,
 * served by the same guarded transport as everything else. The currency list used
 * to be a bespoke `/api/fx-currencies` route plus a bespoke `useFxCurrencies`
 * hook plus a `kind === "currency"` branch in the panel — three special cases for
 * one dropdown. A second connector needing a live list would have added three
 * more. Now a parameter just says where its options live.
 *
 * `mode` covers the two shapes real APIs use: a plain array of records, or an
 * object keyed by id (which is what the Bank of Canada's series group returns,
 * and which no generic array-finder would locate).
 */
export type ApiParamOptionsSource = {
  url: string;
  method?: "GET" | "POST";
  /** Dotted path to the array or object holding the options. */
  resultsPath?: string;
  mode: "array" | "objectKeys";
  /** Field holding the option value (array mode). */
  valueKey?: string;
  /** Field holding the human label; falls back to the value. */
  labelKey?: string;
  /**
   * Applied to the value (the key, in objectKeys mode). Capture group 1 becomes
   * the option value; a key that doesn't match is skipped. Lets one series list
   * yield just the currency codes it publishes.
   */
  valuePattern?: string;
};

export type ApiParam = {
  key: string;
  label: string;
  kind: ApiParamKind;
  /** Shown under the field, and given to the model as the argument description. */
  hint?: string;
  required?: boolean;
  default?: string | number;
  /** Fixed choices, known up front. */
  options?: ApiParamOption[];
  /** Live choices, published by an API. Takes precedence over `options`. */
  optionsSource?: ApiParamOptionsSource;
  min?: number;
  max?: number;
};

/** The real HTTP request a connector's parameters resolve to. */
export type ApiRequestSpec = {
  url: string;
  method: "GET" | "POST";
  headers?: Record<string, string>;
  body?: unknown;
  resultsPath?: string;
  fieldMap?: HttpJsonFieldMap;
  currency?: string;
  maxRows?: number;
  /** Unit weight for records with no numeric field (see mapRecordsToRows). */
  defaultAmount?: number;
};

export type ApiConnector = {
  id: string;
  /** Human name of the upstream, e.g. "Bank of Canada". */
  provider: string;
  name: string;
  description: string;
  /** What one row is, e.g. "daily exchange rates". */
  recordLabel: string;
  docsUrl?: string;
  /**
   * Env var holding this upstream's key, when it needs one. The panel writes
   * `{{env:NAME}}` into the header rather than the literal value — see the
   * api-server's http-source route.
   */
  keyEnvVar?: string;
  params: ApiParam[];
  build: (params: Record<string, string | number>) => ApiRequestSpec;
};

export type ApiParamValues = Record<string, string | number>;

const currentYear = () => new Date().getFullYear();

function text(params: ApiParamValues, key: string, fallback = ""): string {
  const value = params[key];
  return value === undefined || value === null || value === ""
    ? fallback
    : String(value);
}

function int(params: ApiParamValues, key: string, fallback: number): number {
  const parsed = Number(params[key]);
  return Number.isFinite(parsed) ? Math.trunc(parsed) : fallback;
}

// ── Bank of Canada — daily FX observations ───────────────────────────────────
// The same Valet series the FX Rate source averages, but exposed as ROWS: one
// row per published observation, so a workflow can chart, audit or re-average
// them rather than trust a single pre-computed number.
const bocFxObservations: ApiConnector = {
  id: "boc.fx_observations",
  provider: "Bank of Canada",
  name: "Daily exchange rates",
  description:
    "Every published daily rate for one currency against CAD over a calendar year, one row per observation.",
  recordLabel: "daily exchange rates",
  docsUrl: "https://www.bankofcanada.ca/valet/docs",
  params: [
    {
      key: "currency",
      label: "Currency",
      kind: "currency",
      required: true,
      default: "USD",
      hint: "Quoted against CAD — the list is what the Bank of Canada publishes.",
      // The published FX_RATES_DAILY group IS the authoritative list of pairs, so
      // the picker cannot drift into offering a series that 404s. The group is an
      // object keyed by series name ("FXAUDCAD"), hence objectKeys + a pattern
      // that pulls the currency code out of the key.
      optionsSource: {
        url: "https://www.bankofcanada.ca/valet/groups/FX_RATES_DAILY/json",
        resultsPath: "groupDetails.groupSeries",
        mode: "objectKeys",
        labelKey: "label",
        valuePattern: "^FX([A-Z]{3})CAD$",
      },
    },
    {
      key: "year",
      label: "Year",
      kind: "year",
      required: true,
      default: currentYear() - 1,
      hint: "Calendar year. The request covers Jan 1 – Dec 31.",
      min: 1950,
      max: currentYear(),
    },
  ],
  build: (params) => {
    const currency = text(params, "currency", "USD").toUpperCase();
    const year = int(params, "year", currentYear() - 1);
    const series = `FX${currency}CAD`;
    return {
      url: `https://www.bankofcanada.ca/valet/observations/${series}/json?start_date=${year}-01-01&end_date=${year}-12-31`,
      method: "GET",
      resultsPath: "observations",
      // An observation is `{ d: "2024-01-02", FXEURCAD: { v: "1.4562" } }` — the
      // amount key is the series itself, which is why this must be built, not typed.
      fieldMap: { rowId: "d", label: "d", amount: `${series}.v` },
      currency: "CAD",
      maxRows: 400,
    };
  },
};

// ── USAspending — federal contract awards ────────────────────────────────────
const usaspendingAwards: ApiConnector = {
  id: "usaspending.awards",
  provider: "USAspending.gov",
  name: "Federal awards by agency",
  description:
    "Contract and grant awards for one US federal agency in one fiscal year, largest first.",
  recordLabel: "federal awards",
  docsUrl: "https://api.usaspending.gov/",
  params: [
    {
      key: "agency",
      label: "Awarding agency",
      kind: "text",
      required: true,
      default: "Department of Health and Human Services",
      hint: "Top-tier agency name, exactly as USAspending spells it.",
    },
    {
      key: "fiscalYear",
      label: "US fiscal year",
      kind: "year",
      required: true,
      default: 2024,
      hint: "The US federal year runs Oct 1 → Sep 30, so FY2024 = 2023-10-01 to 2024-09-30.",
      min: 2008,
      max: currentYear(),
    },
    {
      key: "awardType",
      label: "Award type",
      kind: "enum",
      default: "contracts",
      options: [
        { value: "contracts", label: "Contracts" },
        { value: "grants", label: "Grants" },
        { value: "all", label: "Contracts and grants" },
      ],
    },
    {
      key: "limit",
      label: "Records",
      kind: "number",
      default: 100,
      hint: "How many awards to pull, largest first.",
      min: 1,
      max: 500,
    },
  ],
  build: (params) => {
    const agency = text(
      params,
      "agency",
      "Department of Health and Human Services"
    );
    const fiscalYear = int(params, "fiscalYear", 2024);
    const awardType = text(params, "awardType", "contracts");
    const limit = Math.min(Math.max(int(params, "limit", 100), 1), 500);

    const CONTRACTS = ["A", "B", "C", "D"];
    const GRANTS = ["02", "03", "04", "05"];
    const awardTypeCodes =
      awardType === "grants"
        ? GRANTS
        : awardType === "all"
          ? [...CONTRACTS, ...GRANTS]
          : CONTRACTS;

    return {
      url: "https://api.usaspending.gov/api/v2/search/spending_by_award/",
      method: "POST",
      body: {
        fields: [
          "Award ID",
          "Recipient Name",
          "Award Amount",
          "Awarding Agency",
          "Awarding Sub Agency",
          "Description",
          "Start Date",
          "End Date",
        ],
        filters: {
          agencies: [{ name: agency, tier: "toptier", type: "awarding" }],
          award_type_codes: awardTypeCodes,
          // US federal fiscal year, derived rather than typed — the whole point
          // of asking for a year instead of two dates.
          time_period: [
            {
              end_date: `${fiscalYear}-09-30`,
              start_date: `${fiscalYear - 1}-10-01`,
            },
          ],
        },
        limit,
        order: "desc",
        page: 1,
        sort: "Award Amount",
      },
      resultsPath: "results",
      fieldMap: {
        account: "Awarding Sub Agency",
        amount: "Award Amount",
        description: "Description",
        label: "Recipient Name",
        rowId: "Award ID",
      },
      currency: "USD",
      maxRows: limit,
    };
  },
};

// ── Nager.Date — public holidays ─────────────────────────────────────────────
// A list of THINGS rather than money: each record is a holiday, with no numeric
// field at all. `defaultAmount: 1` gives every holiday a unit weight so it counts
// once — the shape a count-then-multiply payroll calculation needs.
const nagerPublicHolidays: ApiConnector = {
  id: "nager.public_holidays",
  provider: "Nager.Date",
  name: "Public holidays",
  description:
    "Every public holiday for one country and year, tagged national or regional.",
  recordLabel: "public holidays",
  docsUrl: "https://date.nager.at/swagger/index.html",
  params: [
    {
      key: "country",
      label: "Country",
      kind: "enum",
      required: true,
      default: "CA",
      hint: "ISO two-letter country code.",
      options: [
        { value: "CA", label: "Canada" },
        { value: "US", label: "United States" },
        { value: "GB", label: "United Kingdom" },
        { value: "FR", label: "France" },
        { value: "DE", label: "Germany" },
        { value: "AU", label: "Australia" },
      ],
    },
    {
      key: "year",
      label: "Year",
      kind: "year",
      required: true,
      default: currentYear(),
      hint: "Calendar year the holiday calendar is published for.",
      min: 1975,
      max: currentYear() + 2,
    },
  ],
  build: (params) => {
    const country = text(params, "country", "CA").toUpperCase();
    const year = int(params, "year", currentYear());
    return {
      url: `https://date.nager.at/api/v3/PublicHolidays/${year}/${country}`,
      method: "GET",
      // The payload is a bare array — no envelope to path into.
      fieldMap: {
        label: "localName",
        account: "countryCode",
        // `counties` is `["CA-MB"]` for a regional holiday and null for a national
        // one. Joined to text by the mapper, it becomes the field the classifier
        // reads to tell the two apart.
        description: "counties",
      },
      defaultAmount: 1,
      currency: "DAY",
      maxRows: 400,
    };
  },
};

export const API_CONNECTORS: ApiConnector[] = [
  bocFxObservations,
  usaspendingAwards,
  nagerPublicHolidays,
];

/** `custom` is not a connector — it is the escape hatch to the raw URL editor. */
export const CUSTOM_CONNECTOR_ID = "custom";

export function getApiConnector(id?: string): ApiConnector | undefined {
  return id ? API_CONNECTORS.find((connector) => connector.id === id) : undefined;
}

/** Every parameter's effective value: what was supplied, else its default. */
export function withParamDefaults(
  connector: ApiConnector,
  params: ApiParamValues = {}
): ApiParamValues {
  return Object.fromEntries(
    connector.params.map((param) => {
      const supplied = params[param.key];
      const isBlank =
        supplied === undefined || supplied === null || supplied === "";
      return [param.key, isBlank ? (param.default ?? "") : supplied];
    })
  );
}

/**
 * Check parameters against the connector's schema. Returns one message per bad
 * field — the builder shows them inline and the chat tool hands them back to the
 * model, so a wrong year is corrected rather than silently requested.
 */
export function validateApiParams(
  connector: ApiConnector,
  params: ApiParamValues = {}
): string[] {
  const resolved = withParamDefaults(connector, params);
  return connector.params.flatMap((param) => {
    const value = resolved[param.key];
    const blank = value === undefined || value === null || value === "";

    if (param.required && blank) {
      return [`"${param.label}" is required.`];
    }
    if (blank) {
      return [];
    }

    if (param.kind === "year" || param.kind === "number") {
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) {
        return [`"${param.label}" must be a number — got "${value}".`];
      }
      if (param.min !== undefined && parsed < param.min) {
        return [`"${param.label}" must be ${param.min} or later.`];
      }
      if (param.max !== undefined && parsed > param.max) {
        return [`"${param.label}" must be ${param.max} or earlier.`];
      }
    }

    if (param.kind === "currency" && !/^[A-Za-z]{3}$/.test(String(value))) {
      return [
        `"${param.label}" must be a three-letter currency code — got "${value}".`,
      ];
    }

    if (param.kind === "enum" && param.options) {
      const allowed = param.options.map((option) => option.value);
      if (!allowed.includes(String(value))) {
        return [
          `"${param.label}" must be one of: ${allowed.join(", ")} — got "${value}".`,
        ];
      }
    }

    return [];
  });
}

export type BuildApiRequestResult =
  | { ok: true; spec: ApiRequestSpec; params: ApiParamValues }
  | { ok: false; errors: string[] };

export function buildApiRequest(
  connectorId: string,
  params: ApiParamValues = {}
): BuildApiRequestResult {
  const connector = getApiConnector(connectorId);
  if (!connector) {
    return {
      ok: false,
      errors: [
        `Unknown API "${connectorId}". Available: ${API_CONNECTORS.map((item) => item.id).join(", ")}.`,
      ],
    };
  }

  const errors = validateApiParams(connector, params);
  if (errors.length > 0) {
    return { ok: false, errors };
  }

  const resolved = withParamDefaults(connector, params);
  return { ok: true, params: resolved, spec: connector.build(resolved) };
}

/**
 * The connector's request as ordinary http_json block config. This is what makes
 * the connector layer disposable: everything downstream sees a plain endpoint.
 */
export function apiRequestToBlockConfig(
  connectorId: string,
  params: ApiParamValues,
  spec: ApiRequestSpec
): Record<string, unknown> {
  return {
    connectorId,
    connectorParams: params,
    url: spec.url,
    method: spec.method,
    headers: spec.headers ?? {},
    body: spec.body,
    resultsPath: spec.resultsPath ?? "",
    fieldMap: spec.fieldMap ?? {},
    currency: spec.currency ?? "",
    maxRows: spec.maxRows ?? 250,
    defaultAmount: spec.defaultAmount,
    sourceLocator: spec.url,
  };
}

/** The options source for one parameter, if it publishes its choices live. */
export function getParamOptionsSource(
  connectorId: string,
  paramKey: string
): ApiParamOptionsSource | undefined {
  return getApiConnector(connectorId)?.params.find(
    (param) => param.key === paramKey
  )?.optionsSource;
}

function readPath(payload: unknown, path?: string): unknown {
  if (!path) {
    return payload;
  }
  let cursor: unknown = payload;
  for (const segment of path.split(".")) {
    if (!segment) {
      continue;
    }
    const record =
      typeof cursor === "object" && cursor !== null
        ? (cursor as Record<string, unknown>)
        : null;
    cursor = record ? record[segment] : undefined;
    if (cursor === undefined) {
      return;
    }
  }
  return cursor;
}

/**
 * Turn a fetched payload into parameter options. PURE — the fetch happens on the
 * server, this just interprets what came back, so the same rules apply wherever
 * the payload was obtained.
 */
export function optionsFromPayload(
  payload: unknown,
  source: ApiParamOptionsSource
): ApiParamOption[] {
  const located = readPath(payload, source.resultsPath);
  const pattern = source.valuePattern
    ? new RegExp(source.valuePattern)
    : undefined;

  const entries: [string, Record<string, unknown>][] =
    source.mode === "objectKeys"
      ? Object.entries(
          typeof located === "object" && located !== null && !Array.isArray(located)
            ? (located as Record<string, Record<string, unknown>>)
            : {}
        )
      : (Array.isArray(located) ? located : []).map((item) => {
          const record =
            typeof item === "object" && item !== null
              ? (item as Record<string, unknown>)
              : {};
          return [String(record[source.valueKey ?? "id"] ?? ""), record];
        });

  const options = entries.flatMap(([rawValue, detail]) => {
    if (!rawValue) {
      return [];
    }
    let value = rawValue;
    if (pattern) {
      const match = pattern.exec(rawValue);
      if (!match) {
        return [];
      }
      value = match[1] ?? match[0];
    }
    const label = source.labelKey
      ? String(detail?.[source.labelKey] ?? value)
      : value;
    return [{ label, value }];
  });

  options.sort((a, b) => a.value.localeCompare(b.value));
  return options;
}

/** A compact, model-facing catalogue — used by the chat's discovery tool. */
export function describeApiConnectors() {
  return API_CONNECTORS.map((connector) => ({
    id: connector.id,
    provider: connector.provider,
    name: connector.name,
    description: connector.description,
    recordLabel: connector.recordLabel,
    needsKey: Boolean(connector.keyEnvVar),
    params: connector.params.map((param) => ({
      key: param.key,
      label: param.label,
      kind: param.kind,
      required: Boolean(param.required),
      default: param.default,
      hint: param.hint,
      options: param.options?.map((option) => option.value),
    })),
  }));
}
