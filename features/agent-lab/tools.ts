// ─────────────────────────────────────────────────────────────────────────────
// Agent Lab — TOOL IMPLEMENTATIONS (server only).
//
// A tool = description + inputSchema (what it needs) + execute (the code that runs).
// The model is only ever handed the tools that are checked in the builder UI.
//
// To ADD a tool: write a new tool() below, add it to the TOOLS registry at the
// bottom, and add a matching row to TOOL_CATALOG in catalog.ts so a checkbox shows.
// ─────────────────────────────────────────────────────────────────────────────

import { tool, type ToolSet } from 'ai';
import { z } from 'zod';
import { fetchAnnualAverageExchangeRate } from '@/shared/workflow-engine/execution/blocks/source/currency-rate/schema';
import type { AgentLabDoc } from './catalog';

// ── TEMPLATE TOOLS (safe sandbox) ────────────────────────────────────────────

const getCurrentDateTime = tool({
  description: 'Get the current date and time.',
  inputSchema: z.object({}),
  execute: () => {
    const now = new Date();
    return Promise.resolve({ iso: now.toISOString(), readable: now.toString() });
  },
});

const calculate = tool({
  description: 'Evaluate a basic arithmetic expression, e.g. "0.18 * 240" or "3 * (4 + 5)".',
  inputSchema: z.object({
    expression: z.string().describe('A math expression using only numbers and + - * / ( ) .'),
  }),
  // `async` so every branch shares one Promise<union> return type (tool() needs that).
  execute: async ({ expression }) => {
    if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
      return { error: 'Only numbers and + - * / ( ) are allowed.' };
    }
    try {
      // Sandboxed: the regex above guarantees only arithmetic characters reach here.
      const result = Function(`"use strict"; return (${expression});`)() as number;
      return { expression, result };
    } catch {
      return { error: 'Could not evaluate that expression.' };
    }
  },
});

const getWeatherDemo = tool({
  description: 'Get the current weather for a city. (DEMO: returns fake data, not a real API.)',
  inputSchema: z.object({ city: z.string() }),
  execute: ({ city }) =>
    Promise.resolve({ city, tempC: 21, condition: 'sunny', note: 'demo data — wire a real API here later' }),
});

// Simple in-memory memory. Resets on server restart / serverless cold start —
// swap for your Postgres (drizzle) tables to make it durable in the cloud.
const savedNotes: { note: string; at: string }[] = [];

const rememberNote = tool({
  description: 'Save a short note so it can be recalled later this session.',
  inputSchema: z.object({ note: z.string() }),
  execute: ({ note }) => {
    savedNotes.push({ note, at: new Date().toISOString() });
    return Promise.resolve({ saved: true, totalNotes: savedNotes.length });
  },
});

const recallNotes = tool({
  description: 'List all notes saved this session with the remember tool.',
  inputSchema: z.object({}),
  execute: () => Promise.resolve({ notes: savedNotes }),
});

// ── REAL CAPABILITIES (live data / your integrations) ────────────────────────

const getFxRate = tool({
  description:
    'Get the annual-average exchange rate between two currencies using live Bank of Canada data.',
  inputSchema: z.object({
    from: z.string().describe('source currency code, e.g. USD'),
    to: z.string().describe('target currency code, e.g. CAD'),
    year: z.number().optional().describe('calendar year; defaults to the current year'),
  }),
  execute: async ({ from, to, year }) => {
    const resolvedYear = year ?? new Date().getFullYear();
    try {
      const result = await fetchAnnualAverageExchangeRate({
        documentCurrency: from.toUpperCase(),
        reportingCurrency: to.toUpperCase(),
        year: resolvedYear,
      });
      return { from, to, year: resolvedYear, provider: 'bank_of_canada', ...result };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'FX lookup failed.' };
    }
  },
});

const WEB_PAGE_MAX_CHARS = 15_000;

const fetchWebPage = tool({
  description:
    'Fetch a public web page and return its readable text so you can answer about the WHOLE page (not just the top). ' +
    'Returns up to ~15k characters; if `truncated` is true, the tail was cut — say so if the answer might be past it.',
  inputSchema: z.object({ url: z.string().url() }),
  execute: async ({ url }) => {
    try {
      const res = await fetch(url, { headers: { 'user-agent': 'Mozilla/5.0 (AgentLab)' } });
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
  },
});

// ── CANADIAN TAX: live lookup on official sources (CRA / canada.ca) ──────────
// Uses Firecrawl search (same REST endpoint as plugins/firecrawl), but scopes the
// query to official Canadian tax domains and hard-filters results to them — so the
// agent answers current/authoritative Canadian tax questions with a citable URL
// instead of relying on frozen training data.
const OFFICIAL_CA_TAX_HOSTS = ['canada.ca', 'cra-arc.gc.ca'];

function hostMatches(url: string, host: string): boolean {
  try {
    const h = new URL(url).hostname.toLowerCase();
    return h === host || h.endsWith(`.${host}`);
  } catch {
    return false;
  }
}

const searchCanadianTax = tool({
  description:
    'Search official Canadian tax sources (canada.ca and the CRA) for current rules, rates, forms, and deadlines. ' +
    'Use this whenever the answer depends on up-to-date or authoritative Canadian tax info rather than your training ' +
    'data. Returns titles, URLs, and snippets — cite the source URL in your answer.',
  inputSchema: z.object({
    query: z.string().describe('what to look up, e.g. "capital gains inclusion rate 2024"'),
    limit: z.number().optional().describe('max results (default 5, max 10)'),
  }),
  execute: async ({ query, limit }) => {
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
      if (!res.ok) {
        return { error: `Search failed: HTTP ${res.status}` };
      }
      const json = (await res.json()) as { success: boolean; data?: unknown[]; error?: string };
      if (!json.success) {
        return { error: json.error ?? 'Search failed.' };
      }
      const items = (json.data ?? []) as { url?: string; title?: string; description?: string }[];
      const results = items
        .filter((r) => typeof r.url === 'string' && OFFICIAL_CA_TAX_HOSTS.some((h) => hostMatches(r.url as string, h)))
        .map((r) => ({ title: r.title ?? '', url: r.url as string, snippet: (r.description ?? '').slice(0, 600) }));
      return {
        query,
        results,
        note: results.length === 0 ? 'No results from official Canadian sources — try rephrasing the query.' : undefined,
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Canadian tax lookup failed.' };
    }
  },
});

// ── TEMPLATE WORKFLOW: 3 inputs → a calculation with context ─────────────────
// A small, self-contained example. Give it three inputs (type them in chat or
// attach a file with them): a gross income amount, its currency, and a tax year.
// It converts to CAD with the LIVE Bank of Canada rate, then estimates combined
// corporate tax using a $500k small-business threshold. The rates are illustrative
// (returned in `assumptions` so you see the "context") — not tax advice.
const SMALL_BIZ_THRESHOLD_CAD = 500_000;
const SMALL_BIZ_RATE = 0.122; // combined federal+provincial small-business rate (illustrative)
const GENERAL_RATE = 0.265; // combined general corporate rate (illustrative)

const estimateForeignIncomeTax = tool({
  description:
    'TEMPLATE (3 inputs → result): estimate Canadian corporate tax on foreign-currency income. ' +
    'Requires grossIncome (amount in its foreign currency), currency (code like USD), and taxYear. ' +
    'Converts to CAD with the live Bank of Canada rate, applies a combined corporate rate with a ' +
    '$500k small-business threshold, and returns a full breakdown. If any of the three inputs is ' +
    'missing, ask the user for it before calling.',
  inputSchema: z.object({
    grossIncome: z.number().describe('gross income amount in the foreign currency, e.g. 250000'),
    currency: z.string().describe('the income currency code, e.g. USD'),
    taxYear: z.number().describe('the tax year, e.g. 2024'),
  }),
  execute: async ({ grossIncome, currency, taxYear }) => {
    const from = currency.toUpperCase();
    // 1) Convert to CAD using the live annual-average FX rate.
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

    // 2) Progressive combined-rate estimate — this is the "context"/rules.
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
  },
});

// ── WORKFLOW-BUILDER ACTIONS (demo echoes on this page) ──────────────────────
// These mirror your real useCopilotAction tools. On the Agent Lab page there is no
// canvas, so they just echo what they WOULD do — which lets you watch the agent
// decide to call them. On the real builder these act on the workflow.

const focusBlock = tool({
  description: 'Focus a block on the workflow-builder canvas by id.',
  inputSchema: z.object({ blockId: z.string() }),
  execute: ({ blockId }) =>
    Promise.resolve({ wouldFocus: blockId, note: 'demo on Agent Lab — acts for real on the builder canvas' }),
});

const addBlock = tool({
  description: 'Add a block to the workflow by its catalog id.',
  inputSchema: z.object({
    catalogId: z.string().describe('catalog id of the block type to add'),
    label: z.string().optional().describe('optional custom label'),
  }),
  execute: ({ catalogId, label }) =>
    Promise.resolve({ wouldAdd: catalogId, label: label ?? null, note: 'demo on Agent Lab — acts for real on the builder canvas' }),
});

const editBlockConfig = tool({
  description: 'Edit a config value on a block.',
  inputSchema: z.object({
    blockId: z.string(),
    key: z.string().describe('the config key to set, e.g. "overrideRate"'),
    value: z.string().describe('the new value (JSON-encoded where applicable)'),
  }),
  execute: ({ blockId, key, value }) =>
    Promise.resolve({ wouldEdit: { blockId, key, value }, note: 'demo on Agent Lab — acts for real on the builder canvas' }),
});

// ── RETRIEVAL: search attached documents (keyword "RAG lite") ────────────────
// This tool is DOCUMENT-AWARE, so it can't be a static entry — it's built per
// request with the current documents closed over (see createSearchDocumentsTool).
// It splits each document into ~700-char chunks and returns only the chunks whose
// text best matches the query — so the agent can read files far too big to load
// whole into context.
type DocChunk = { doc: string; index: number; text: string };

function chunkDocument(name: string, text: string, size = 700): DocChunk[] {
  const lines = text.split('\n');
  const chunks: DocChunk[] = [];
  let buf = '';
  let index = 0;
  for (const line of lines) {
    if (buf.length + line.length + 1 > size && buf) {
      chunks.push({ doc: name, index, text: buf });
      index += 1;
      buf = line;
    } else {
      buf = buf ? `${buf}\n${line}` : line;
    }
  }
  if (buf.trim()) {
    chunks.push({ doc: name, index, text: buf });
  }
  return chunks;
}

function scoreChunk(text: string, terms: string[]): number {
  const lower = text.toLowerCase();
  let score = 0;
  for (const term of terms) {
    let pos = lower.indexOf(term);
    while (pos !== -1) {
      score += 1;
      pos = lower.indexOf(term, pos + term.length);
    }
  }
  return score;
}

export function createSearchDocumentsTool(documents: AgentLabDoc[]) {
  return tool({
    description:
      "Search the user's attached documents for a query and return only the most relevant passages. " +
      'Use this to read files that are too big to load whole. Call it with a focused query (keywords work best), ' +
      'then answer from the passages it returns.',
    inputSchema: z.object({
      query: z.string().describe('what to look for — keywords or a short phrase'),
      maxResults: z.number().optional().describe('how many passages to return (default 5, max 10)'),
    }),
    execute: async ({ query, maxResults }) => {
      if (documents.length === 0) {
        return { matches: [], note: 'No documents are attached — ask the user to attach a file first.' };
      }
      const terms = [...new Set(query.toLowerCase().match(/[a-z0-9]{2,}/g) ?? [])];
      if (terms.length === 0) {
        return { matches: [], note: 'The query had no searchable keywords.' };
      }
      const chunks = documents.flatMap((d) => chunkDocument(d.name, d.text));
      const limit = Math.min(Math.max(maxResults ?? 5, 1), 10);
      const matches = chunks
        .map((c) => ({ document: c.doc, passage: c.text.slice(0, 800), score: scoreChunk(c.text, terms) }))
        .filter((c) => c.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
      return {
        query,
        chunksSearched: chunks.length,
        matches,
        note: matches.length === 0 ? 'No passages matched those keywords — try different terms.' : undefined,
      };
    },
  });
}

// ── REGISTRY: id → tool (ids MUST match TOOL_CATALOG in catalog.ts) ───────────
export const TOOLS: ToolSet = {
  getCurrentDateTime,
  calculate,
  getWeatherDemo,
  rememberNote,
  recallNotes,
  getFxRate,
  fetchWebPage,
  searchCanadianTax,
  estimateForeignIncomeTax,
  focusBlock,
  addBlock,
  editBlockConfig,
};
