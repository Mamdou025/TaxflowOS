

// ─────────────────────────────────────────────────────────────────────────────
// Page ⇄ Chat contract — the general pattern behind "the chat can command any
// page/panel next to it, and can bring any page/panel into the chat".
//
// Sibling of `page-menu-store.ts` (which publishes a page's *menu* into the shared
// header). Here a page publishes a *chat surface* into a registry while it's open:
//   • context  — a live snapshot the chat reads to ground answers about the page
//   • commands — named verbs the chat can invoke on the page (commandPage)
//   • Embed    — a compact React view to render the page INLINE in the chat
//                (bringIntoChat) without leaving the conversation
//
// The assistant (`use-assistant.tsx`) dispatches two GENERIC actions against this
// registry, so ANY page becomes commandable + summonable with one hook call —
// exactly how `usePageMenu` made any page's toolbar live in the shared header.
// Bespoke per-page copilots (BuilderCopilot, WorksheetCopilot) still work; this is
// the uniform contract, especially for pages with no bespoke copilot.
// ─────────────────────────────────────────────────────────────────────────────

import { atom, useSetAtom } from 'jotai';
import { useEffect, type ComponentType } from 'react';

export type PageCommandParam = {
  name: string;
  type: 'string' | 'number' | 'boolean';
  description: string;
  required?: boolean;
};

/** A named verb the chat can invoke on a page via `commandPage`. `run` receives the
 *  parsed args and returns a short result string (or object) for the model. */
export type PageCommand = {
  id: string; // unique within the page, e.g. "checkHealth"
  label: string; // human label (discoverability / @-menu)
  description: string; // for the LLM
  parameters?: PageCommandParam[];
  run: (args: Record<string, unknown>) => string | object | Promise<string | object>;
};

/** What a page publishes to the chat while it's open. */
export type PageChatSurface = {
  pageKey: string;
  title: string;
  /** Live snapshot the chat reads to answer questions about this page. Keep small. */
  context?: unknown;
  /** Verbs the chat may run on this page. */
  commands?: PageCommand[];
  /** Compact inline representation, rendered in the chat by bringIntoChat. When
   *  absent, bringIntoChat falls back to the registered page component (bounded). */
  Embed?: ComponentType;
};

/** All currently-open chat surfaces, keyed by pageKey. */
export const pageChatSurfacesAtom = atom<Record<string, PageChatSurface>>({});

/**
 * Register (and keep updated) this page's chat surface while it's mounted. `deps`
 * control when the surface is rebuilt — include any state the context/commands
 * close over (e.g. workflow name, block count, health) so the chat never reads a
 * stale snapshot or runs a stale command. Cleans up on unmount / key change.
 */
export function usePageChat(surface: PageChatSurface, deps: unknown[] = []) {
  const set = useSetAtom(pageChatSurfacesAtom);
  useEffect(() => {
    set((prev) => ({ ...prev, [surface.pageKey]: surface }));
    return () =>
      set((prev) => {
        const next = { ...prev };
        delete next[surface.pageKey];
        return next;
      });
    // surface is intentionally rebuilt from `deps`; pageKey/set are stable.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surface.pageKey, set, ...deps]);
}
