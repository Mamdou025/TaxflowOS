import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { SourceRow } from './workflow-runs/engine';

// ─────────────────────────────────────────────────────────────────────────────
// Chat Workspace store
//
// Powers the "bring pages into the chat" experience: the AI chat can open real
// app pages as inline windows inside a takeover surface, switch between them,
// and close them — while keeping a running trail of everything that happened.
//
// This is deliberately READ-ONLY navigation. No mutation of workflow / evidence
// state happens here; mutating tools will later route through an approval gate.
// ─────────────────────────────────────────────────────────────────────────────

export type WorkspaceWindow = {
  id: string;
  pageKey: string;
  title: string;
  openedAt: number;
};

export type TrailEventKind = 'open' | 'close' | 'focus' | 'note';

/** Semantic category → drives the colored dot in the inline activity trail. */
export type TrailTone = 'approval' | 'suggestion' | 'calculation' | 'navigation' | 'info';

export type TrailEvent = {
  id: string;
  kind: TrailEventKind;
  tone: TrailTone;
  text: string;
  timestamp: number;
};

let seq = 0;
const nextId = () => `${Date.now().toString(36)}-${(seq++).toString(36)}`;

// ─── Base atoms ───────────────────────────────────────────────────────────────
export const workspaceWindowsAtom = atom<WorkspaceWindow[]>([]);
export const activeWindowIdAtom = atom<string | null>(null);
export const workspaceTrailAtom = atom<TrailEvent[]>([]);

/** The workflow run currently in the chat — so the LLM (via useCopilotReadable)
 *  and the UI know which workflow, which document, and where we are. */
export type ActiveRunInfo = {
  workflowId: string;
  workflowName: string;
  agentName?: string;
  documentLabel: string;
  totalSteps: number;
  stepIndex: number;
  stepLabel: string;
  phase: 'upload' | 'categorize' | 'elect' | 'approve' | 'done';
  awaiting: string; // human description of what the run is waiting for
  headline?: { label: string; value: number; currency: string };
};
export const activeRunAtom = atom<ActiveRunInfo | null>(null);

/** Shared, persisted uploaded source rows — keyed by workflow id ('fapi', 'roulement').
 *  ONE source of truth for the trial balance a run works on: the chat upload writes
 *  it, the chat run reads it, and the builder hydrates its source block from it — so
 *  switching between the chat and the workflow builder shows the exact same data. */
export type UploadedSource = { fileName: string; rows: SourceRow[]; at: number };
export const uploadedRowsAtom = atomWithStorage<Record<string, UploadedSource>>(
  'taxflow:uploaded-source-rows',
  {}
);

// Derived: the currently focused window (or the last opened as a fallback).
export const activeWorkspaceWindowAtom = atom((get) => {
  const windows = get(workspaceWindowsAtom);
  if (windows.length === 0) return null;
  const activeId = get(activeWindowIdAtom);
  return windows.find((w) => w.id === activeId) ?? windows[windows.length - 1];
});

// Append an entry to the trail. Loosely typed so Jotai's setter generics don't
// leak into every call site.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function record(set: any, kind: TrailEventKind, text: string, tone: TrailTone = 'navigation') {
  set(workspaceTrailAtom, (prev: TrailEvent[]) => [
    ...prev,
    { id: nextId(), kind, tone, text, timestamp: Date.now() },
  ]);
}

/** Push a semantically-toned event onto the trail (used by the chat panel for
 *  approvals, suggestions, and deterministic calculations). */
export const pushTrailAtom = atom(
  null,
  (_get, set, payload: { text: string; tone: TrailTone; kind?: TrailEventKind }) => {
    record(set, payload.kind ?? 'note', payload.text, payload.tone);
  }
);

// ─── Write atoms (the "tools" the chat drives) ────────────────────────────────

/** Open a page as a window. Re-focuses an existing window for the same page. */
export const openWorkspaceWindowAtom = atom(
  null,
  (get, set, payload: { pageKey: string; title: string }) => {
    const existing = get(workspaceWindowsAtom).find((w) => w.pageKey === payload.pageKey);
    if (existing) {
      set(activeWindowIdAtom, existing.id);
      record(set, 'focus', `Reopened ${payload.title}`);
      return existing.id;
    }
    const win: WorkspaceWindow = {
      id: nextId(),
      pageKey: payload.pageKey,
      title: payload.title,
      openedAt: Date.now(),
    };
    set(workspaceWindowsAtom, (prev) => [...prev, win]);
    set(activeWindowIdAtom, win.id);
    record(set, 'open', `Opened ${payload.title}`);
    return win.id;
  }
);

/** Close a window by its id. */
export const closeWorkspaceWindowAtom = atom(null, (get, set, id: string) => {
  const windows = get(workspaceWindowsAtom);
  const win = windows.find((w) => w.id === id);
  const remaining = windows.filter((w) => w.id !== id);
  set(workspaceWindowsAtom, remaining);
  if (get(activeWindowIdAtom) === id) {
    set(activeWindowIdAtom, remaining.length ? remaining[remaining.length - 1].id : null);
  }
  if (win) record(set, 'close', `Closed ${win.title}`);
});

/** Close a window by page key, or the active/last window when key is null. */
export const closeWorkspaceWindowByKeyAtom = atom(
  null,
  (get, set, pageKey: string | null) => {
    const windows = get(workspaceWindowsAtom);
    let target: WorkspaceWindow | undefined;
    if (pageKey) {
      target = windows.find((w) => w.pageKey === pageKey);
    } else {
      const activeId = get(activeWindowIdAtom);
      target = windows.find((w) => w.id === activeId) ?? windows[windows.length - 1];
    }
    if (!target) return;
    const remaining = windows.filter((w) => w.id !== target!.id);
    set(workspaceWindowsAtom, remaining);
    if (get(activeWindowIdAtom) === target.id) {
      set(activeWindowIdAtom, remaining.length ? remaining[remaining.length - 1].id : null);
    }
    record(set, 'close', `Closed ${target.title}`);
  }
);

/** Close every open window. The trail is preserved. */
export const closeAllWorkspaceWindowsAtom = atom(null, (get, set) => {
  const count = get(workspaceWindowsAtom).length;
  if (count === 0) return;
  set(workspaceWindowsAtom, []);
  set(activeWindowIdAtom, null);
  record(set, 'close', `Closed all pages (${count})`);
});

/** Bring an existing window to focus. */
export const focusWorkspaceWindowAtom = atom(null, (get, set, id: string) => {
  const win = get(workspaceWindowsAtom).find((w) => w.id === id);
  if (!win) return;
  set(activeWindowIdAtom, id);
  record(set, 'focus', `Switched to ${win.title}`);
});
