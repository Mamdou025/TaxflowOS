// ─────────────────────────────────────────────────────────────────────────────
// Runnable-tool manifest — the interactive layer over the read-only Tools catalogue.
//
// Each entry says how to DRIVE a tool by hand from the Tools menu: the input fields
// to draw, how to phrase an "Ask Sina" message (the conversational path), and — for
// search tools — which results card to render. It is NOT the source of truth for
// WHICH tools exist: the menu reads that live from the CopilotKit registry
// (tools-menu.tsx). A manifest entry only ever gets controls when its tool is
// actually registered, so this can label/shape inputs without inventing a capability.
//
// To make another tool runnable: add its name here with its fields. Its Run button
// calls the SAME handler the model calls (via the live registry), so there's no
// second implementation to keep in sync.
// ─────────────────────────────────────────────────────────────────────────────

import type { WebSearchScope } from '@/shared/stores/web-search-store';

export type ToolFieldKind = 'text' | 'number';

export type ToolField = {
  name: string;
  label: string;
  kind: ToolFieldKind;
  required?: boolean;
  placeholder?: string;
  default?: string;
  /** Layout hint inside the form grid. */
  width?: 'full' | 'half';
};

export type RunnableTool = {
  // 'search' → one query field; can be "armed" into the composer + renders a results
  //            card via `searchScope`. 'form' → a labelled field form; Run → value card.
  mode: 'search' | 'form';
  /** Primary (Run) button label. */
  runLabel: string;
  fields: ToolField[];
  /** Natural-language phrasing for the "Ask Sina" / armed-composer path. */
  askMessage: (args: Record<string, string>) => string;
  /** Search tools that feed the WebSearchCard. */
  searchScope?: WebSearchScope;
};

// The current calendar year, for the FX-year placeholder. Read once at module load
// (browser only — this never runs in a sandbox), purely cosmetic.
const CURRENT_YEAR = String(new Date().getFullYear());

export const RUNNABLE_TOOLS: Record<string, RunnableTool> = {
  searchWeb: {
    mode: 'search',
    runLabel: 'Search',
    searchScope: 'web',
    fields: [{ name: 'query', label: 'Search the web', kind: 'text', required: true, placeholder: 'e.g. OECD Pillar Two effective date', width: 'full' }],
    askMessage: (a) => `Search the web for: ${a.query}`,
  },
  searchCanadianTax: {
    mode: 'search',
    runLabel: 'Search',
    searchScope: 'ca-tax',
    fields: [{ name: 'query', label: 'Search official Canadian tax sources', kind: 'text', required: true, placeholder: 'e.g. capital gains inclusion rate 2024', width: 'full' }],
    askMessage: (a) => `Search official Canadian tax sources for: ${a.query}`,
  },
  searchCompanyDocuments: {
    mode: 'search',
    runLabel: 'Search',
    fields: [{ name: 'query', label: 'Search stored company documents', kind: 'text', required: true, placeholder: 'e.g. indemnification clause', width: 'full' }],
    askMessage: (a) => `Search the company documents for: ${a.query}`,
  },
  fetchWebPage: {
    mode: 'form',
    runLabel: 'Read page',
    fields: [{ name: 'url', label: 'Page URL', kind: 'text', required: true, placeholder: 'https://…', width: 'full' }],
    askMessage: (a) => `Read this page and summarise it: ${a.url}`,
  },
  getFxRate: {
    mode: 'form',
    runLabel: 'Get rate',
    fields: [
      { name: 'from', label: 'From', kind: 'text', required: true, placeholder: 'USD', width: 'half' },
      { name: 'to', label: 'To', kind: 'text', required: true, placeholder: 'CAD', default: 'CAD', width: 'half' },
      { name: 'year', label: 'Year', kind: 'number', placeholder: CURRENT_YEAR, width: 'half' },
    ],
    askMessage: (a) => `What is the ${a.from || '?'}→${a.to || 'CAD'} exchange rate${a.year ? ` for ${a.year}` : ''}?`,
  },
  estimateForeignIncomeTax: {
    mode: 'form',
    runLabel: 'Estimate',
    fields: [
      { name: 'grossIncome', label: 'Gross income', kind: 'number', required: true, placeholder: '250000', width: 'half' },
      { name: 'currency', label: 'Currency', kind: 'text', required: true, placeholder: 'USD', width: 'half' },
      { name: 'taxYear', label: 'Tax year', kind: 'number', required: true, placeholder: '2024', width: 'half' },
    ],
    askMessage: (a) => `Estimate Canadian corporate tax on ${a.grossIncome || '?'} ${a.currency || ''} of foreign income for tax year ${a.taxYear || '?'}.`,
  },
  calculate: {
    mode: 'form',
    runLabel: 'Calculate',
    fields: [{ name: 'expression', label: 'Expression', kind: 'text', required: true, placeholder: '0.18 * 240', width: 'full' }],
    askMessage: (a) => `Calculate: ${a.expression}`,
  },
  getCurrentDateTime: {
    mode: 'form',
    runLabel: 'Get date & time',
    fields: [],
    askMessage: () => 'What is the current date and time?',
  },
};

export function runnableTool(name: string): RunnableTool | undefined {
  return RUNNABLE_TOOLS[name];
}

/** Phrase the message for an "armed" search tool sending the user's typed query. */
export function formatArmedMessage(toolName: string, text: string): string {
  const spec = RUNNABLE_TOOLS[toolName];
  if (!spec) return text;
  // Armed tools are single-query search tools — the query field is the typed text.
  return spec.askMessage({ query: text });
}
