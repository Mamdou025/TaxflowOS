import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { Coworker } from './coworkers';

// ─────────────────────────────────────────────────────────────────────────────
// Work registry — the durable record behind the "Work" menu.
//
// Every time the assistant/an agent starts a workflow, opens a worksheet, summons a
// source review, or generates an interface, it upserts a WorkItem here (beside the
// existing pushTrail() choke points). The Work menu in the thread header reads this,
// and each item can be reopened ("Open current state") or scrolled back to where it
// first appeared in the conversation ("Jump to origin") — the thread becomes both an
// audit trail and a navigable workspace.
//
// Persisted (atomWithStorage) so items survive a reload — "preserve every item after
// completion". Purely client-side Jotai; touches no CopilotKit internals.
// ─────────────────────────────────────────────────────────────────────────────

export type WorkItemType =
  | 'workflow-run'
  | 'worksheet'
  | 'source-review'
  | 'generated-view'
  | 'page';

export type WorkItemStatus = 'running' | 'awaiting' | 'done' | 'open';

/** How "Open current state" reopens an item. */
export type WorkOpen =
  | { kind: 'page'; pageKey: string }
  | { kind: 'workflow'; workflowId: string }
  | { kind: 'genui'; prompt: string }
  | { kind: 'none' };

export type WorkItem = {
  id: string;
  type: WorkItemType;
  title: string;
  status: WorkItemStatus;
  /** Latest-update line, e.g. "Step 8/12 · awaiting approval". */
  detail?: string;
  /** The responsible coworker (workflow specialist / UI Concierge / UI Composer). */
  by?: Coworker;
  createdAt: number;
  updatedAt: number;
  open: WorkOpen;
};

/** Stable id shared by the recorder (handler), the status updater (run effect), and the
 *  rendered card's `data-work-id` tag — so all three agree on one item. */
export function workIdFor(type: WorkItemType, key: string): string {
  return `${type}:${key}`;
}

/** Short stable key from free text (e.g. a genui prompt), so the recorder (handler) and
 *  the rendered card (data-work-id tag) compute the SAME work id. FNV-1a. */
export function workKeyFromText(text: string): string {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(36);
}

const STATUS_ORDER: Record<WorkItemStatus, number> = { awaiting: 0, running: 1, open: 2, done: 3 };

// ── Atoms ────────────────────────────────────────────────────────────────────
export const workItemsAtom = atomWithStorage<Record<string, WorkItem>>('taxflow:work-items', {});

/** Items newest-activity first (awaiting/running float up; done sinks). */
export const workItemsListAtom = atom((get) => {
  const items = Object.values(get(workItemsAtom));
  return items.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status] || b.updatedAt - a.updatedAt);
});

/** Count of items still needing attention (awaiting/running) — badge on the Work menu. */
export const activeWorkCountAtom = atom((get) =>
  Object.values(get(workItemsAtom)).filter((w) => w.status === 'awaiting' || w.status === 'running').length
);

/** Upsert a work item. `id` identifies it; a first sighting stamps createdAt, every
 *  call bumps updatedAt. Loosely typed so call sites stay terse. */
export type WorkItemPatch = Omit<Partial<WorkItem>, 'id' | 'createdAt' | 'updatedAt'> & {
  id: string;
  type: WorkItemType;
  title: string;
  status: WorkItemStatus;
  open: WorkOpen;
};

export const recordWorkItemAtom = atom(null, (_get, set, patch: WorkItemPatch) => {
  set(workItemsAtom, (prev) => {
    const now = Date.now();
    const existing = prev[patch.id];
    const next: WorkItem = {
      ...existing,
      ...patch,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    return { ...prev, [patch.id]: next };
  });
});

/** Clear the whole registry (Work menu "Clear"). The chat thread itself is untouched. */
export const clearWorkItemsAtom = atom(null, (_get, set) => set(workItemsAtom, {}));

/** On app load, persisted items left 'running'/'awaiting' from a previous session have no
 *  live run behind them (pinned runs + the chat thread are not restored) — downgrade them
 *  to a neutral 'open' so the badge/status isn't misleadingly "live". A run that re-mounts
 *  re-asserts its own status via its effect. Call ONCE per session (see WorkMenu). */
export const reconcileStaleWorkAtom = atom(null, (get, set) => {
  const items = get(workItemsAtom);
  let changed = false;
  const next: Record<string, WorkItem> = { ...items };
  for (const [id, item] of Object.entries(items)) {
    if (item.status === 'running' || item.status === 'awaiting') {
      next[id] = { ...item, status: 'open', detail: item.detail ? `${item.detail} · interrupted` : 'Interrupted' };
      changed = true;
    }
  }
  if (changed) set(workItemsAtom, next);
});

// ── Jump-to-origin (DOM scroll-and-flash) ──────────────────────────────────────
/** Scroll the conversation to where a work item first appeared (its rendered card,
 *  tagged data-work-id) and flash it. Returns true if a target was found. Reuses the
 *  cwp-anchor-flash keyframes already defined in the workspace. */
export function jumpToWork(id: string): boolean {
  if (typeof document === 'undefined') return false;
  const el =
    document.querySelector<HTMLElement>(`[data-work-id="${cssEscape(id)}"]`) ?? null;
  if (!el) return false;
  el.scrollIntoView({ block: 'center', behavior: 'smooth' });
  el.classList.add('cwp-anchor-flash');
  window.setTimeout(() => el.classList.remove('cwp-anchor-flash'), 1700);
  return true;
}

function cssEscape(value: string): string {
  // work ids are `type:key` — escape the colon for a valid attribute selector.
  const anyWin = window as unknown as { CSS?: { escape?: (s: string) => string } };
  return anyWin.CSS?.escape ? anyWin.CSS.escape(value) : value.replace(/[^a-zA-Z0-9_-]/g, '\\$&');
}
