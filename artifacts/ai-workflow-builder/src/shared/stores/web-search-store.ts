// ─────────────────────────────────────────────────────────────────────────────
// Web-search results store — the bridge between Sina's search tool handlers and the
// inline result cards they render. A handler fetches once, writes the results here
// keyed by (scope + trimmed query), and returns them to the model; the WebSearchCard
// reads them back by the same key. One fetch feeds both the visible card and the
// model's grounded, cited reply. Two scopes share this: 'web' (general searchWeb)
// and 'ca-tax' (searchCanadianTax) — keyed apart so identical queries don't collide.
// See features/assistant/ui/use-assistant.tsx + features/assistant/workspace/web-search-card.tsx.
// ─────────────────────────────────────────────────────────────────────────────

import { atom } from "jotai";

export type WebSearchScope = "web" | "ca-tax";
export type WebSearchResult = { title: string; url: string; snippet: string };
export type WebSearchStatus = "searching" | "done" | "empty" | "error";

export type WebSearchState = {
  scope: WebSearchScope;
  status: WebSearchStatus;
  query: string;
  results: WebSearchResult[];
  note?: string;
  at: number;
};

/** Composite key so 'web' and 'ca-tax' results for the same query stay distinct. */
export function webSearchKey(scope: WebSearchScope, query: string): string {
  return `${scope}::${query.trim()}`;
}

/** Keyed by webSearchKey(scope, query) → its latest search state. */
export const webSearchResultsAtom = atom<Record<string, WebSearchState>>({});
