// ─────────────────────────────────────────────────────────────────────────────
// Shared agent-tool registry — ONE implementation, used by BOTH runtimes.
//
// The Agent Lab (features/agent-lab/tools.ts, AI-SDK `tool()`) and Sina's live chat
// (app/api/assistant/tools/route.ts, behind a CopilotKit action) both source these
// tools from here. That is the whole point: prototype/adjust a tool in the Lab and
// Sina inherits the SAME code — no re-implementation, no drift.
//
// SERVER-ONLY: these run outbound fetches, read process.env (FIRECRAWL_API_KEY), and
// import server workflow code. Only server files may import this module (the two
// wrappers above + nothing client-side). The client authors its own arg metadata.
//
// To ADD a tool to the shared set: write one `defineTool(...)` below and add it to
// AGENT_TOOL_REGISTRY. It is then callable from Sina's route immediately; expose it
// in the Lab by wrapping it in tools.ts, and register a CopilotKit action for it in
// use-assistant.tsx. The implementation itself is never written twice.
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';
import { fetchAnnualAverageExchangeRate } from '@/shared/workflow-engine/execution/blocks/source/currency-rate/schema';
import { buildApiRequest, describeApiConnectors } from '@/shared/workflow-engine/execution/blocks/source/http-json/connectors';
import {
  extractAtPath,
  fetchJsonPayload,
  findRecordArray,
} from '@/shared/workflow-engine/execution/blocks/source/http-json/schema';

export type AgentToolDef = {
  /** Model-facing description of what the tool does / when to use it. */
  description: string;
  /** Zod schema for the tool's arguments (drives both server + AI-SDK validation). */
  inputSchema: z.ZodTypeAny;
  /** Validated runner: parses args, then executes. Returns a JSON-serializable result. */
  run: (rawArgs: unknown) => Promise<unknown>;
};

/** Wrap an implementation so its args are validated once, in one place. */
function defineTool<S extends z.ZodTypeAny>(
  description: string,
  inputSchema: S,
  impl: (args: z.infer<S>) => Promise<unknown>
): AgentToolDef {
  return {
    description,
    inputSchema,
    run: async (rawArgs: unknown) => {
      const parsed = inputSchema.safeParse(rawArgs ?? {});
      if (!parsed.success) return { error: 'Invalid arguments for this tool.', issues: parsed.error.issues };
      return impl(parsed.data);
    },
  };
}

// ── searchCanadianTax — Firecrawl search scoped to official Canadian tax sources ─
const OFFICIAL_CA_TAX_HOSTS = ['canada.ca', 'cra-arc.gc.ca'];

function hostMatches(url: string, host: string): boolean {
  try {
    const h = new URL(url).hostname.toLowerCase();
    return h === host || h.endsWith(`.${host}`);
  } catch {
    return false;
  }
}

// ── AI-Gateway web-search fallback (Perplexity `sonar`) ──────────────────────
// When no dedicated search key (FIRECRAWL_API_KEY) is configured but the Vercel
// AI Gateway key IS (the same credential the chat already uses), route live
// search through Perplexity `sonar` — so research works with NO extra signup.
// `sonar` is an answer engine: it returns a synthesized, source-grounded answer.
// The gateway strips Perplexity's structured citations, so we extract the source
// URLs from the answer text for the results card. Each call costs ~$0.005.
const GATEWAY_CHAT_URL = 'https://ai-gateway.vercel.sh/v1/chat/completions';

function extractUrls(text: string): string[] {
  const raw = text.match(/https?:\/\/[^\s)\]}"'<>]+/g) ?? [];
  return Array.from(new Set(raw.map((u) => u.replace(/[.,;:]+$/, ''))));
}

async function gatewaySonarSearch(
  query: string,
  opts: { officialCanadaTax?: boolean; limit: number },
): Promise<{ answer: string; results: { title: string; url: string; snippet: string }[] }> {
  const key = process.env.AI_GATEWAY_API_KEY;
  if (!key) throw new Error('gateway key not set');
  const system = opts.officialCanadaTax
    ? 'You are a research assistant for a Canadian corporate-tax professional. Rely on CURRENT, authoritative Government of Canada / CRA sources (canada.ca, cra-arc.gc.ca) and the Income Tax Act. Be concise and precise.'
    : 'You are a web research assistant. Answer concisely and accurately from current, reputable web sources.';
  const user = `${query}\n\nAfter your answer, add a line "SOURCES:" and list each source you used on its own line as a full https:// URL.`;
  const res = await fetch(GATEWAY_CHAT_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'perplexity/sonar',
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const answer = json.choices?.[0]?.message?.content ?? '';
  let urls = extractUrls(answer);
  if (opts.officialCanadaTax) {
    const official = urls.filter((u) => OFFICIAL_CA_TAX_HOSTS.some((h) => hostMatches(u, h)));
    if (official.length) urls = official;
  }
  const results = urls.slice(0, opts.limit).map((u) => ({
    title: (() => {
      try {
        return new URL(u).hostname.replace(/^www\./, '');
      } catch {
        return u;
      }
    })(),
    url: u,
    snippet: '',
  }));
  return { answer, results };
}

const searchCanadianTax = defineTool(
  'Search official Canadian tax sources (canada.ca and the CRA) for CURRENT rules, rates, forms, and deadlines. ' +
    'Use whenever the answer depends on up-to-date or authoritative Canadian tax info rather than training data. ' +
    'Returns titles, URLs, and snippets — cite the source URL.',
  z.object({
    query: z.string().min(1).max(500).describe('what to look up, e.g. "capital gains inclusion rate 2024"'),
    limit: z.number().int().optional().describe('max results (default 5, max 10)'),
  }),
  async ({ query, limit }) => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      // No dedicated search key (Firecrawl). Fall back to the Vercel AI Gateway
      // (Perplexity `sonar`) using the key the chat already uses — live research
      // with no extra signup. Only truly "unavailable" if neither key exists.
      if (process.env.AI_GATEWAY_API_KEY) {
        try {
          const { answer, results } = await gatewaySonarSearch(query, {
            officialCanadaTax: true,
            limit: Math.min(Math.max(limit ?? 5, 1), 10),
          });
          return {
            query,
            answer,
            results,
            instruction:
              'Ground your reply in the ANSWER above (from a live, source-grounded search) and cite the source URLs. If it does not answer the question, say so plainly.',
            note:
              results.length === 0
                ? 'Searched live, but found no citable official-source URL — verify manually.'
                : undefined,
          };
        } catch (error) {
          return { error: error instanceof Error ? `Search failed: ${error.message}` : 'Canadian tax lookup failed.' };
        }
      }
      // Neither key set — degrade gracefully; never surface internal config/env
      // details, and don't let the model pretend it searched.
      return {
        unavailable: true,
        // Shown to the user in the results card — must be clean and non-technical.
        note: 'Live lookup of official Canadian tax sources is not available in this environment.',
        // Model-facing only (the card ignores `instruction`).
        instruction: 'Answer from your own knowledge. Do NOT claim to have searched official sources or cite a page you did not read, and briefly tell the user you could not verify this against live CRA / canada.ca sources.',
      };
    }
    const scopedQuery = `${query} (site:canada.ca OR site:cra-arc.gc.ca)`;
    try {
      const res = await fetch('https://api.firecrawl.dev/v1/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ query: scopedQuery, limit: Math.min(Math.max(limit ?? 5, 1), 10) }),
      });
      if (!res.ok) return { error: `Search failed: HTTP ${res.status}` };
      const json = (await res.json()) as { success: boolean; data?: unknown[]; error?: string };
      if (!json.success) return { error: json.error ?? 'Search failed.' };
      const items = (json.data ?? []) as { url?: string; title?: string; description?: string }[];
      const results = items
        .filter((r) => typeof r.url === 'string' && OFFICIAL_CA_TAX_HOSTS.some((h) => hostMatches(r.url as string, h)))
        .map((r) => ({ title: r.title ?? '', url: r.url as string, snippet: (r.description ?? '').slice(0, 600) }));
      return {
        query,
        results,
        instruction: 'Cite the source URL for each fact you use. If the results do not answer the question, say so plainly.',
        note: results.length === 0 ? 'No results from official Canadian sources — try rephrasing the query.' : undefined,
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Canadian tax lookup failed.' };
    }
  }
);

// ── searchWeb — general Firecrawl web search (whole internet, not domain-scoped) ─
const searchWeb = defineTool(
  'Search the public web / internet for CURRENT or general information that is NOT in the workspace, the open worksheet, the workflow data, or the user\'s documents. ' +
    'Returns ranked results (title, URL, snippet) — these are shown to the user as a card, so ground your reply in them and CITE the source URL for each fact. ' +
    'For authoritative Canadian tax rules/rates/forms specifically, prefer searchCanadianTax; use fetchWebPage to read any result URL in full.',
  z.object({
    query: z.string().min(1).max(500).describe('the web search query, e.g. "OECD Pillar Two effective date"'),
    limit: z.number().int().optional().describe('max results (default 6, max 10)'),
  }),
  async ({ query, limit }) => {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      // Fall back to the AI Gateway (Perplexity `sonar`) — see searchCanadianTax.
      if (process.env.AI_GATEWAY_API_KEY) {
        try {
          const { answer, results } = await gatewaySonarSearch(query, {
            limit: Math.min(Math.max(limit ?? 6, 1), 10),
          });
          return {
            query,
            answer,
            results,
            instruction:
              'Ground your reply in the ANSWER above (from a live web search) and cite the source URLs. If it does not answer the question, say so plainly.',
            note:
              results.length === 0
                ? 'Searched the web, but could not extract citable source URLs — mention that to the user.'
                : undefined,
          };
        } catch (error) {
          return { error: error instanceof Error ? `Search failed: ${error.message}` : 'Web search failed.' };
        }
      }
      // See searchCanadianTax — same graceful-degradation contract; never leak env details.
      return {
        unavailable: true,
        note: 'Live web search is not available in this environment.',
        instruction: 'Answer from your own knowledge and tell the user you could not check live web sources.',
      };
    }
    try {
      const res = await fetch('https://api.firecrawl.dev/v1/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ query, limit: Math.min(Math.max(limit ?? 6, 1), 10) }),
      });
      if (!res.ok) return { error: `Search failed: HTTP ${res.status}` };
      const json = (await res.json()) as { success: boolean; data?: unknown[]; error?: string };
      if (!json.success) return { error: json.error ?? 'Search failed.' };
      const items = (json.data ?? []) as { url?: string; title?: string; description?: string }[];
      const results = items
        .filter((r) => typeof r.url === 'string')
        .map((r) => ({ title: r.title ?? (r.url as string), url: r.url as string, snippet: (r.description ?? '').slice(0, 600) }));
      return {
        query,
        results,
        instruction: 'Cite the source URL for each fact you use. If the results do not answer the question, say so plainly.',
        note: results.length === 0 ? 'No web results found — try rephrasing the query.' : undefined,
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Web search failed.' };
    }
  }
);

// ── fetchWebPage — read a public URL's text (SSRF-guarded) ───────────────────────
const WEB_PAGE_MAX_CHARS = 15_000;

// Block obvious loopback / private / link-local literals so the authenticated tool
// can't be pointed at internal services or the cloud metadata endpoint. Hostnames
// that only resolve to private IPs via DNS are not caught here — a deliberately
// minimal guard; tighten with DNS resolution if this is ever exposed more widely.
function isBlockedHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.internal') || h.endsWith('.local')) return true;
  if (h === '169.254.169.254' || h === '[::1]' || h === '::1') return true;
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (a === 127 || a === 10 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
  }
  return false;
}

const fetchWebPage = defineTool(
  'Fetch a public web page and return its readable text so you can answer about the whole page. ' +
    'Returns up to ~15k characters; if `truncated` is true, the tail was cut. Good follow-up to searchCanadianTax to read a result URL in full.',
  z.object({ url: z.string().url().describe('the public http(s) URL to read') }),
  async ({ url }) => {
    let target: URL;
    try {
      target = new URL(url);
    } catch {
      return { error: 'Invalid URL.' };
    }
    if (target.protocol !== 'http:' && target.protocol !== 'https:') {
      return { error: 'Only http(s) URLs are allowed.' };
    }
    if (isBlockedHost(target.hostname)) {
      return { error: 'That host is not allowed.' };
    }
    try {
      const res = await fetch(target, { headers: { 'user-agent': 'Mozilla/5.0 (SinaxeSina)' }, redirect: 'follow' });
      const html = await res.text();
      const text = html
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const truncated = text.length > WEB_PAGE_MAX_CHARS;
      return {
        url,
        status: res.status,
        totalChars: text.length,
        truncated,
        text: truncated ? text.slice(0, WEB_PAGE_MAX_CHARS) : text,
      };
    } catch (error) {
      return { url, error: error instanceof Error ? error.message : 'fetch failed' };
    }
  }
);

// ── getFxRate — live annual-average Bank of Canada rate ──────────────────────────
const getFxRate = defineTool(
  'Get the annual-average exchange rate between two currencies using live Bank of Canada data. ' +
    'Use for currency conversions instead of guessing a rate.',
  z.object({
    from: z.string().min(1).max(8).describe('source currency code, e.g. USD'),
    to: z.string().min(1).max(8).describe('target currency code, e.g. CAD'),
    year: z.number().int().optional().describe('calendar year; defaults to the current year'),
  }),
  async ({ from, to, year }) => {
    const resolvedYear = year ?? new Date().getFullYear();
    try {
      const result = await fetchAnnualAverageExchangeRate({
        documentCurrency: from.toUpperCase(),
        reportingCurrency: to.toUpperCase(),
        year: resolvedYear,
      });
      return { from: from.toUpperCase(), to: to.toUpperCase(), year: resolvedYear, provider: 'bank_of_canada', ...result };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'FX lookup failed.' };
    }
  }
);

// ── estimateForeignIncomeTax — template calc (live FX → illustrative CA tax) ──────
const SMALL_BIZ_THRESHOLD_CAD = 500_000;
const SMALL_BIZ_RATE = 0.122; // combined federal+provincial small-business rate (illustrative)
const GENERAL_RATE = 0.265; // combined general corporate rate (illustrative)

const estimateForeignIncomeTax = defineTool(
  'Estimate Canadian corporate tax on foreign-currency income. Requires grossIncome (in its foreign currency), ' +
    'currency (code like USD), and taxYear. Converts to CAD with the live Bank of Canada rate and applies an ' +
    'illustrative combined rate with a $500k small-business threshold. If any input is missing, ask for it before calling.',
  z.object({
    grossIncome: z.number().describe('gross income amount in the foreign currency, e.g. 250000'),
    currency: z.string().min(1).max(8).describe('the income currency code, e.g. USD'),
    taxYear: z.number().int().describe('the tax year, e.g. 2024'),
  }),
  async ({ grossIncome, currency, taxYear }) => {
    const from = currency.toUpperCase();
    let fxRate: number;
    let fxSource: string;
    try {
      const fx = await fetchAnnualAverageExchangeRate({ documentCurrency: from, reportingCurrency: 'CAD', year: taxYear });
      fxRate = fx.rate;
      fxSource = fx.rateSource;
    } catch (error) {
      return {
        error:
          error instanceof Error
            ? error.message
            : 'FX lookup failed — try a currency the Bank of Canada publishes against CAD (e.g. USD, EUR, GBP).',
      };
    }

    const grossCAD = grossIncome * fxRate;
    const smallBizPortion = Math.min(grossCAD, SMALL_BIZ_THRESHOLD_CAD);
    const generalPortion = Math.max(grossCAD - SMALL_BIZ_THRESHOLD_CAD, 0);
    const taxCAD = smallBizPortion * SMALL_BIZ_RATE + generalPortion * GENERAL_RATE;
    const netCAD = grossCAD - taxCAD;

    return {
      inputs: { grossIncome, currency: from, taxYear },
      fx: { rate: Number(fxRate.toFixed(4)), source: fxSource, pair: `${from}->CAD` },
      grossIncomeCAD: Number(grossCAD.toFixed(2)),
      taxBreakdown: {
        smallBusiness: { appliesUpTo: SMALL_BIZ_THRESHOLD_CAD, rate: SMALL_BIZ_RATE, taxedAmount: Number(smallBizPortion.toFixed(2)) },
        general: { rate: GENERAL_RATE, taxedAmount: Number(generalPortion.toFixed(2)) },
      },
      estimatedTaxCAD: Number(taxCAD.toFixed(2)),
      netIncomeCAD: Number(netCAD.toFixed(2)),
      effectiveRate: Number((taxCAD / grossCAD).toFixed(4)),
      assumptions: 'Illustrative combined federal+provincial rates: 12.2% up to $500k CAD, 26.5% above. Not tax advice.',
    };
  }
);

// ── callApi — run any public JSON API and show what it returns ────────────────
// The general-purpose endpoint runner: paste a URL in the Tools menu, or ask Sina
// to call one. Shares the SSRF guard and fetch path with the workflow builder's
// API Source block (execution/blocks/source/http-json), so what the chat can call
// and what a workflow can call never diverge.
//
// The response is summarised rather than dumped: a model given 64KB of JSON reasons
// worse than one given the shape, the record count and three examples.

const CALL_API_SAMPLE_ROWS = 3;
const CALL_API_PREVIEW_CHARS = 2500;

function summarizeRecords(records: unknown[]) {
  const objects = records.filter(
    (item): item is Record<string, unknown> =>
      typeof item === 'object' && item !== null && !Array.isArray(item)
  );
  const columns = objects.length > 0 ? Object.keys(objects[0]) : [];
  return {
    recordCount: records.length,
    columns,
    sample: records.slice(0, CALL_API_SAMPLE_ROWS),
  };
}

const callApi = defineTool(
  'Call a public JSON HTTP API and return what it responds with. Use this to try out an endpoint, inspect its shape, or pull live data the other tools do not cover. Only public http(s) endpoints work — private/internal addresses are refused. Returns the record count, the field names, and a few example records when the response is a list; otherwise a truncated JSON preview.',
  z.object({
    url: z.string().min(1).max(2000).describe('the full public http(s) URL to call, e.g. https://api.usaspending.gov/api/v2/search/spending_by_award/'),
    method: z.enum(['GET', 'POST']).optional().describe('HTTP method (default GET)'),
    body: z.string().optional().describe('request body for POST, as a JSON string'),
    headers: z.record(z.string(), z.string()).optional().describe('extra request headers, e.g. an Authorization header'),
    resultsPath: z.string().optional().describe('dotted path to the array of records in the response, e.g. "results" or "data.items". Omit to auto-detect.'),
  }),
  async ({ url, method, body, headers, resultsPath }) => {
    let parsedBody: unknown;
    if (body) {
      try {
        parsedBody = JSON.parse(body);
      } catch {
        return {
          error: 'The `body` argument was not valid JSON.',
          instruction: 'Fix the JSON and call the tool again. Tell the user the body was malformed.',
        };
      }
    }

    try {
      const { payload, responseMeta } = await fetchJsonPayload({
        url,
        method: method ?? 'GET',
        headers: headers ?? {},
        body: parsedBody,
      });

      const located = extractAtPath(payload, resultsPath);
      const records = Array.isArray(located)
        ? located
        : findRecordArray(located) || findRecordArray(payload);

      if (records) {
        return {
          ok: true,
          request: { url: responseMeta.url, method: responseMeta.method, status: responseMeta.status, durationMs: responseMeta.durationMs },
          ...summarizeRecords(records),
          instruction:
            'Report the record count and field names, and answer the user\'s question from the sample. Say plainly that only the first few records are shown. To turn this endpoint into a workflow step, tell the user to add an "API / HTTP Request" Source block with this URL and resultsPath.',
        };
      }

      const text = JSON.stringify(payload, null, 2) ?? '';
      const truncated = text.length > CALL_API_PREVIEW_CHARS;
      return {
        ok: true,
        request: { url: responseMeta.url, method: responseMeta.method, status: responseMeta.status, durationMs: responseMeta.durationMs },
        preview: truncated ? `${text.slice(0, CALL_API_PREVIEW_CHARS)}\n… truncated` : text,
        truncated,
        instruction:
          'The response is not a list of records. Describe its shape to the user. If they want a specific array, ask them for the resultsPath and call again.',
      };
    } catch (error) {
      return {
        ok: false,
        url,
        error: error instanceof Error ? error.message : 'The request failed.',
        instruction:
          'Tell the user exactly why the call failed and what they could change (URL, method, body, headers). Do NOT invent what the endpoint would have returned.',
      };
    }
  }
);

// ── API connectors — named upstreams, filled with business parameters ─────────
// The pair below is what lets Sina wire up an API-backed workflow WITHOUT ever
// composing a URL. `listApiSources` says what is available and which parameters
// each takes; `useApiSource` takes a year / currency / agency and the connector
// builds the request.
//
// This matters beyond convenience. A model hand-writing
// `?start_date=2024-01-01&end_date=2024-12-31` produces a plausible string that
// can silently cover the wrong window — nothing downstream can tell a wrong date
// range from a right one. Choosing `usaspending.awards` with `{fiscalYear: 2024}`
// cannot fail that way: the connector knows a US fiscal year starts Oct 1. The
// tool returns the resolved request alongside the data, so the URL it produced is
// on the record rather than inferred.

const listApiSources = defineTool(
  'List the named APIs this app can pull live data from, with the business parameters each one takes (a year, a currency, an agency — never a URL). Call this BEFORE useApiSource so you know the exact connector id and parameter keys. Use these instead of callApi whenever one fits: the connector builds a correct request from plain parameters, where a hand-written URL can silently ask for the wrong thing.',
  z.object({}),
  // eslint-disable-next-line @typescript-eslint/require-await -- the tool contract is async; this one needs no I/O.
  async () => ({
    ok: true,
    connectors: describeApiConnectors(),
    instruction:
      'Pick the connector that matches what the user asked for and call useApiSource with its id and parameters. Ask the user for any required parameter you cannot infer (most often the year) rather than guessing one. Never build a URL yourself when a connector covers the source.',
  })
);

const useApiSource = defineTool(
  'Pull live data from one of the named APIs (see listApiSources) by giving business parameters — e.g. {connectorId: "boc.fx_observations", params: {currency: "EUR", year: 2024}}. The connector turns those into the real HTTP request and calls it. Use this to answer a question from live data, or to work out the right settings for an "API / HTTP Request" Source block in a workflow.',
  z.object({
    connectorId: z
      .string()
      .describe('the connector id from listApiSources, e.g. "usaspending.awards"'),
    params: z
      .record(z.string(), z.union([z.string(), z.number()]))
      .optional()
      .describe(
        'business parameters keyed exactly as listApiSources reports them, e.g. {"fiscalYear": 2024, "agency": "Department of Health and Human Services"}. Omitted parameters fall back to the connector default.'
      ),
  }),
  async ({ connectorId, params }) => {
    const built = buildApiRequest(connectorId, params ?? {});
    if (!built.ok) {
      return {
        ok: false,
        errors: built.errors,
        instruction:
          'The parameters were rejected before any call was made. Fix them and retry, or ask the user for the missing value. Report the specific problem — do NOT fall back to callApi with a hand-written URL.',
      };
    }

    const { spec } = built;
    try {
      const { payload, responseMeta } = await fetchJsonPayload({
        url: spec.url,
        method: spec.method,
        headers: spec.headers ?? {},
        body: spec.body,
      });

      const located = extractAtPath(payload, spec.resultsPath);
      const records = Array.isArray(located)
        ? located
        : findRecordArray(located) || findRecordArray(payload);

      // The resolved request is returned whatever happens: it is the block config
      // the user would need, and the claim the figures rest on.
      const blockConfig = {
        connectorId,
        connectorParams: built.params,
        url: spec.url,
        method: spec.method,
        resultsPath: spec.resultsPath,
        fieldMap: spec.fieldMap,
        currency: spec.currency,
        maxRows: spec.maxRows,
      };

      if (!records) {
        return {
          ok: false,
          request: blockConfig,
          status: responseMeta.status,
          error: 'The response had no array of records where the connector expected one.',
          instruction:
            'Tell the user the endpoint answered but its shape was unexpected. Do NOT invent records.',
        };
      }

      return {
        ok: true,
        request: blockConfig,
        params: built.params,
        status: responseMeta.status,
        durationMs: responseMeta.durationMs,
        ...summarizeRecords(records),
        instruction:
          'Answer from the sample and say how many records came back. State the parameters used (year, currency, agency) in plain words. If the user is building a workflow, tell them to add an "API / HTTP Request" Source block, pick this API and enter these same parameters — the block shows the exact request it builds.',
      };
    } catch (error) {
      return {
        ok: false,
        request: { connectorId, params: built.params, url: spec.url },
        error: error instanceof Error ? error.message : 'The request failed.',
        instruction:
          'Report exactly why the call failed and which parameters were used. Do NOT invent what it would have returned.',
      };
    }
  }
);

// ── The registry: id → shared tool definition ────────────────────────────────────
export const AGENT_TOOL_REGISTRY = {
  searchWeb,
  searchCanadianTax,
  fetchWebPage,
  getFxRate,
  estimateForeignIncomeTax,
  listApiSources,
  useApiSource,
  callApi,
} satisfies Record<string, AgentToolDef>;

export type AgentToolId = keyof typeof AGENT_TOOL_REGISTRY;

export function isAgentToolId(id: string): id is AgentToolId {
  return Object.prototype.hasOwnProperty.call(AGENT_TOOL_REGISTRY, id);
}

/** Validate + run a shared tool by id. Returns `{ error }` for an unknown id. */
export async function runAgentTool(id: string, rawArgs: unknown): Promise<unknown> {
  if (!isAgentToolId(id)) return { error: `Unknown tool: ${id}` };
  return AGENT_TOOL_REGISTRY[id].run(rawArgs);
}
