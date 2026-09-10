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
import { AGENT_TOOL_REGISTRY } from '@/platform/agent-tools/registry';
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

// ── SHARED CAPABILITIES (live data + template calc) ──────────────────────────
// getFxRate / fetchWebPage / searchCanadianTax / estimateForeignIncomeTax are sourced
// from the SHARED registry (platform/agent-tools/registry.ts), so the Agent Lab (here)
// and Sina's live chat run the EXACT same code — prototype/adjust a tool here and Sina
// inherits it with no re-implementation, no drift. Each is a thin tool() wrapper.
function fromRegistry(id: keyof typeof AGENT_TOOL_REGISTRY) {
  const def = AGENT_TOOL_REGISTRY[id];
  return tool({ description: def.description, inputSchema: def.inputSchema, execute: (args) => def.run(args) });
}

const getFxRate = fromRegistry('getFxRate');
const fetchWebPage = fromRegistry('fetchWebPage');
const searchWeb = fromRegistry('searchWeb');
const searchCanadianTax = fromRegistry('searchCanadianTax');
const estimateForeignIncomeTax = fromRegistry('estimateForeignIncomeTax');
const callApi = fromRegistry('callApi');

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
  searchWeb,
  searchCanadianTax,
  estimateForeignIncomeTax,
  callApi,
  focusBlock,
  addBlock,
  editBlockConfig,
};
