import { atom } from 'jotai';
import type { Store } from 'jotai/vanilla/store';
import { createWorkflow, saveVersion, getSavedVersion } from '@workspace/workflow-core/commands';
import {
  changeSession,
  getSession,
  sessionContext,
  startSession,
  type SessionAction,
} from '@workspace/workflow-core/sessions';
import { workflowLibraryAtom } from './workflow-library';
import { templateDefinition } from './workflow-execution';
import { browserGraphRuntime } from '@/shared/workflow-engine/workflow/execute';
import {
  selectedWorkflowIdAtom,
  selectedWorkflowRunIdAtom,
  workflowTabAtom,
} from './workflows-store';

export type SessionRef = { workflowId: string; runId: string };
export const workflowInspectionAtom = atom<
  (SessionRef & { blockId: string; attemptIndex: number | null }) | null
>(null);
export const activeSessionAtom = atom<SessionRef | null>(null);
export const chatWorkflowIdsAtom = atom<string[]>([]);
export function openWorkflowSession(
  store: Pick<Store, 'get' | 'set'>,
  id: string,
  version?: number,
  fresh = false,
): SessionRef {
  const library = store.get(workflowLibraryAtom);
  let entry = library[id];
  if (!entry) {
    const definition = templateDefinition(id);
    if (!definition) throw new Error('This workflow is unavailable.');
    const existing = Object.values(library).filter(
      (item) =>
        item.templateId.replace(/^pf-/, '') === id.replace(/^pf-/, '') && item.sessions?.length,
    );
    if (!fresh && existing.length > 1)
      throw new Error('Several saved workflows match. Choose the exact workflow in Run.');
    if (!fresh && existing.length === 1) entry = existing[0];
    else entry = createWorkflow(`custom:${crypto.randomUUID()}`, id, definition);
  }
  let session = !fresh ? entry.sessions?.at(-1) : undefined;
  if (version !== undefined && session?.version !== version) session = undefined;
  if (!session) {
    if (version === undefined) entry = saveVersion(entry);
    const saved = getSavedVersion(entry, version);
    entry = startSession(entry, saved.number, crypto.randomUUID(), new Date().toISOString());
    session = entry.sessions!.at(-1)!;
    store.set(workflowLibraryAtom, (previous) => ({ ...previous, [entry.id]: entry }));
  }
  const ref = { workflowId: entry.id, runId: session.id };
  store.set(activeSessionAtom, ref);
  return ref;
}
export function applySessionAction(
  store: Pick<Store, 'get' | 'set'>,
  ref: SessionRef,
  revision: number,
  action: SessionAction,
) {
  const entry = store.get(workflowLibraryAtom)[ref.workflowId];
  if (!entry) throw new Error('This workflow is no longer in the workspace.');
  const next = changeSession(entry, ref.runId, revision, action, browserGraphRuntime);
  store.set(workflowLibraryAtom, (previous) => ({ ...previous, [entry.id]: next }));
  store.set(activeSessionAtom, ref);
  return sessionContext(next, getSession(next, ref.runId));
}
export function showSessionInRun(store: Pick<Store, 'get' | 'set'>, ref: SessionRef) {
  store.set(selectedWorkflowIdAtom, ref.workflowId);
  store.set(selectedWorkflowRunIdAtom, ref.runId);
  store.set(workflowTabAtom, 'run');
  store.set(activeSessionAtom, ref);
}

const advancing = new Set<string>();
export const isSessionAdvancing = (id: string) => advancing.has(id);
/** Yield between real block calls, so Pause can take effect before the next block. */
export async function advanceSession(store: Pick<Store, 'get' | 'set'>, ref: SessionRef) {
  if (advancing.has(ref.runId)) return;
  advancing.add(ref.runId);
  try {
    while (true) {
      await new Promise<void>((resolve) => setTimeout(resolve, 30));
      const entry = store.get(workflowLibraryAtom)[ref.workflowId];
      if (!entry) return;
      const session = getSession(entry, ref.runId);
      if (session.paused) return;
      const context = sessionContext(entry, session);
      const next = context.steps.find(
        (step) => step.ready && ['pending', 'outdated'].includes(step.status),
      );
      if (!next) {
        applySessionAction(store, ref, session.revision, { kind: 'pause' });
        return;
      }
      applySessionAction(store, ref, session.revision, { kind: 'block', blockId: next.id });
    }
  } finally {
    advancing.delete(ref.runId);
    const entry = store.get(workflowLibraryAtom)[ref.workflowId];
    const session = entry?.sessions?.find((item) => item.id === ref.runId);
    if (session && !session.paused)
      applySessionAction(store, ref, session.revision, { kind: 'pause' });
  }
}
