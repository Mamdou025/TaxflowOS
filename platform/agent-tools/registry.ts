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
      return { error: 'FIRECRAWL_API_KEY is not set in .env.local — it is required for Canadian tax lookups.' };
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

// ── The registry: id → shared tool definition ────────────────────────────────────
export const AGENT_TOOL_REGISTRY = {
  searchCanadianTax,
  fetchWebPage,
  getFxRate,
  estimateForeignIncomeTax,
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
