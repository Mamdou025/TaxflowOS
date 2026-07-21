import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import type { SourceRow } from '@/lib/workflow-runs/engine';
import type { ActorKind, Coworker } from '@/lib/coworkers';

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

/** Who performed a trail event — so the activity trail can distinguish
 *  Human / Agent / Workflow / Tool / System (see lib/coworkers.ts). */
export type TrailActor = { kind: ActorKind; id?: string; name?: string };

export type TrailEvent = {
  id: string;
  kind: TrailEventKind;
  tone: TrailTone;
  text: string;
  timestamp: number;
  actor?: TrailActor;
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
  /** The run's live figures — published once a source is loaded — so the assistant
   *  can answer questions and generate UI from the ACTUAL numbers (not just the
   *  step/phase). Capped/compact; the worksheet-intel actions remain the deep path. */
  data?: {
    fileName?: string;
    currency: string;
    sourceRowCount: number;
    categories: { category: string; amount: number; rowCount: number }[]; // classified buckets
    lines: { key: string; label: string; value: number }[];               // computed lines
    summary: { key: string; label: string; value: number }[];             // result summary
    unmatchedCount: number;
    topRows: { label: string; amount: number; category: string }[];       // largest classified rows (capped)
  };
};
export const activeRunAtom = atom<ActiveRunInfo | null>(null);

/** The coworker currently working — the live "who's doing what" signal that powers
 *  the presence indicator in the chat. Set by the run flow (the owning specialist
 *  while awaiting a decision; the Workflow Engine while computing) and available for
 *  the assistant/tools to light up too. `null` = nobody is actively working. */
export type ActiveCoworker = { coworker: Coworker; status: string; since: number };
export const activeCoworkerAtom = atom<ActiveCoworker | null>(null);

/** Set (or clear, with null) who is working right now + a short status line. */
export const setActiveCoworkerAtom = atom(
  null,
  (_get, set, payload: { coworker: Coworker; status: string } | null) => {
    set(
      activeCoworkerAtom,
      payload ? { coworker: payload.coworker, status: payload.status, since: Date.now() } : null
    );
  }
);

/** The coworker whose SCRIPTED "thinking" narration should play in place of the plain
 *  typing dots while a reply streams — set the instant the user sends an instruction to
 *  an addressed agent (click Sofi → type → send), cleared once the real reply arrives.
 *  This is what makes a handoff read as the agent working THROUGH steps, with human
 *  timing, instead of an instant proposal card. `lines` are the narration steps. */
export type ThinkingCoworker = { coworker: Coworker; lines: string[]; since: number };
export const thinkingCoworkerAtom = atom<ThinkingCoworker | null>(null);
export const setThinkingCoworkerAtom = atom(
  null,
  (_get, set, payload: { coworker: Coworker; lines: string[] } | null) => {
    set(
      thinkingCoworkerAtom,
      payload ? { coworker: payload.coworker, lines: payload.lines, since: Date.now() } : null
    );
  }
);

/** Shared, persisted uploaded source rows — keyed by workflow id ('fapi', 'roulement').
 *  ONE source of truth for the trial balance a run works on: the chat upload writes
 *  it, the chat run reads it, and the builder hydrates its source block from it — so
 *  switching between the chat and the workflow builder shows the exact same data. */
export type UploadedSource = { fileName: string; rows: SourceRow[]; at: number };
export const uploadedRowsAtom = atomWithStorage<Record<string, UploadedSource>>(
  'taxflow:uploaded-source-rows',
  {}
);

/** Documents the user attached in the chat (PDF / plain-text) with their extracted
 *  text — the readable context that lets the assistant actually ANSWER questions
 *  about an attached file instead of only seeing its name. Companion to
 *  uploadedRowsAtom: workbooks become rows there; documents become text here.
 *  In-memory (not persisted) — the text can be large, and it's session-scoped by
 *  design. Keyed by a stable id so re-attaching the same file replaces it. */
export type AttachedDoc = {
  id: string;
  fileName: string;
  kind: 'pdf' | 'text' | 'word' | 'excel';
  text: string;
  chars: number;
  pages?: number;
  truncated: boolean;
  at: number;
};
export const attachedDocsAtom = atom<AttachedDoc[]>([]);

/** Shared, persisted run *edits* — keyed by workflow id ('fapi', 'roulement').
 *  The companion to uploadedRowsAtom: rows share via that atom, and the run's two
 *  OTHER decision surfaces share via this one — edited inputs (rates/assumptions,
 *  keyed by editable-input key) and category overrides (rowId → categoryId). The
 *  chat run and the worksheet both read + write it, so a rate change, live-fetched
 *  FX, or re-categorization made in the run flows to the worksheet (and back), and
 *  the two always show identical final figures. Empty maps = template defaults. */
export type RunEdits = { inputs: Record<string, number>; overrides: Record<string, string> };
export const EMPTY_RUN_EDITS: RunEdits = { inputs: {}, overrides: {} };
export const runEditsAtom = atomWithStorage<Record<string, RunEdits>>('taxflow:run-edits', {});

/** Set one edited input for a workflow (merges into its inputs map). */
export const setRunInputAtom = atom(
  null,
  (get, set, { id, key, value }: { id: string; key: string; value: number }) => {
    set(runEditsAtom, (prev) => {
      const cur = prev[id] ?? EMPTY_RUN_EDITS;
      return { ...prev, [id]: { ...cur, inputs: { ...cur.inputs, [key]: value } } };
    });
  }
);

/** Set one row's category override for a workflow (merges into its overrides map). */
export const setRunOverrideAtom = atom(
  null,
  (get, set, { id, rowId, categoryId }: { id: string; rowId: string; categoryId: string }) => {
    set(runEditsAtom, (prev) => {
      const cur = prev[id] ?? EMPTY_RUN_EDITS;
      return { ...prev, [id]: { ...cur, overrides: { ...cur.overrides, [rowId]: categoryId } } };
    });
  }
);

/** Replace a workflow's whole edits object (used when the run reducer produces a
 *  fully-resolved inputs/overrides pair, e.g. resolving a choice/elect blocker). */
export const setRunEditsAtom = atom(
  null,
  (get, set, { id, edits }: { id: string; edits: RunEdits }) => {
    set(runEditsAtom, (prev) => ({ ...prev, [id]: edits }));
  }
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
function record(
  set: any,
  kind: TrailEventKind,
  text: string,
  tone: TrailTone = 'navigation',
  actor?: TrailActor
) {
  set(workspaceTrailAtom, (prev: TrailEvent[]) => [
    ...prev,
    { id: nextId(), kind, tone, text, timestamp: Date.now(), actor },
  ]);
}

/** Push a semantically-toned event onto the trail (used by the chat panel for
 *  approvals, suggestions, and deterministic calculations). Pass `actor` to attribute
 *  it to a coworker (Human / Agent / Workflow / Tool / System). */
export const pushTrailAtom = atom(
  null,
  (_get, set, payload: { text: string; tone: TrailTone; kind?: TrailEventKind; actor?: TrailActor }) => {
    record(set, payload.kind ?? 'note', payload.text, payload.tone, payload.actor);
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
