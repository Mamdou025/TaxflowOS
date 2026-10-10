import { workspaceContext } from '@/platform/auth/workspace-context';
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
/** Exact run attached to this conversation; persisted by chat, never inferred from latest. */
export const chatSessionAtom = atom<(SessionRef & { afterMessageId?: string | null }) | null>(null);
/** Read the live chat at the moment of binding, without copying an execution into chat. */
export const chatMessageAnchorAtom = atom<{ read: () => string | null } | null>(null);
export function bindChatSession(store: Pick<Store, 'get' | 'set'>, ref: SessionRef) {
  const current = store.get(chatSessionAtom);
  const sameRun = current?.workflowId === ref.workflowId && current.runId === ref.runId;
  store.set(
    chatSessionAtom,
    sameRun
      ? current
      : {
          ...ref,
          afterMessageId: store.get(chatMessageAnchorAtom)?.read() ?? null,
        },
  );
  store.set(activeSessionAtom, ref);
  store.set(workflowInspectionAtom, null);
}
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
    // A catalog selection starts that template. Saved derivatives have their own
    // identities and are opened/resumed explicitly, never inferred by templateId.
    entry = createWorkflow(`custom:${crypto.randomUUID()}`, id, definition);
  }
  let session = !fresh ? entry.sessions?.at(-1) : undefined;
  if (session?.endedAt) session = undefined;
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
const executionKey = (id: string) => `${workspaceContext?.workspace.id ?? ''}:${id}`;
export const isSessionAdvancing = (id: string) => advancing.has(executionKey(id));
/** Yield between real block calls, so Pause can take effect before the next block. */
export async function advanceSession(store: Pick<Store, 'get' | 'set'>, ref: SessionRef) {
  const key = executionKey(ref.runId);
  if (advancing.has(key)) return;
  advancing.add(key);
  const workspaceId = workspaceContext?.workspace.id;
  try {
    while (true) {
      await new Promise<void>((resolve) => setTimeout(resolve, 30));
      if (workspaceContext?.workspace.id !== workspaceId) return;
      const entry = store.get(workflowLibraryAtom)[ref.workflowId];
      if (!entry) return;
      const session = getSession(entry, ref.runId);
      if (session.paused) return;
      const context = sessionContext(entry, session);
      const next = context.steps.find(
        (step) =>
          step.ready && !step.inputRequired && ['pending', 'outdated'].includes(step.status),
      );
      if (!next) {
        const complete =
          context.steps.length > 0 &&
          context.steps.every((step) => ['success', 'warning', 'reviewed'].includes(step.status));
        applySessionAction(store, ref, session.revision, { kind: complete ? 'record' : 'pause' });
        return;
      }
      applySessionAction(store, ref, session.revision, { kind: 'block', blockId: next.id });
    }
  } finally {
    advancing.delete(key);
    const entry = store.get(workflowLibraryAtom)[ref.workflowId];
    const session = entry?.sessions?.find((item) => item.id === ref.runId);
    if (workspaceContext?.workspace.id === workspaceId && session && !session.paused)
      applySessionAction(store, ref, session.revision, { kind: 'pause' });
  }
}

/** All surfaces submit inputs through this path; only Apply starts recalculation. */
export async function submitSessionInput(
  store: Pick<Store, 'get' | 'set'>,
  ref: SessionRef,
  revision: number,
  action: Extract<SessionAction, { kind: 'inputs' | 'source' }>,
) {
  applySessionAction(store, ref, revision, action);
  const entry = store.get(workflowLibraryAtom)[ref.workflowId];
  const session = getSession(entry, ref.runId);
  // Multiple missing sources are collected before the Trigger admits execution.
  if (
    sessionContext(entry, session).steps.some(
      (step) => step.inputRequired && !step.inputKeys.includes('inputChoices'),
    )
  )
    return;
  applySessionAction(store, ref, session.revision, { kind: 'resume' });
  await advanceSession(store, ref);
}
