import { atom } from 'jotai';
import type { Store } from 'jotai/vanilla/store';
import { getSavedVersion } from '@workspace/workflow-core/commands';
import { getSession } from '@workspace/workflow-core/sessions';
import { workflowLibraryAtom } from '@/features/workflows-hub/workflow-library';
import {
  chatMessageAnchorAtom,
  type SessionRef,
} from '@/features/workflows-hub/workflow-session-store';
import type { WorkflowInteraction } from './workflow-interaction';

export const workflowInteractionAtom = atom<WorkflowInteraction | null>(null);

export function recordWorkflowInteraction(
  store: Pick<Store, 'get' | 'set'>,
  value: Omit<WorkflowInteraction, 'id' | 'afterMessageId' | 'occurredAt'>,
) {
  const receipt: WorkflowInteraction = {
    ...value,
    id: crypto.randomUUID(),
    afterMessageId: store.get(chatMessageAnchorAtom)?.read() ?? null,
    occurredAt: new Date().toISOString(),
  };
  store.set(workflowInteractionAtom, receipt);
  return receipt;
}

/** Read the actual selected version; the receipt never calculates or approves a result. */
export function recordWorkflowSelection(
  store: Pick<Store, 'get' | 'set'>,
  requestedWorkflowId: string,
  ref: SessionRef,
  kind: 'template' | 'saved-version' | 'resume' = 'template',
) {
  const entry = store.get(workflowLibraryAtom)[ref.workflowId];
  if (!entry) throw new Error('The selected workflow is no longer available.');
  const session = getSession(entry, ref.runId);
  const saved = getSavedVersion(entry, session.version);
  return recordWorkflowInteraction(store, {
    kind,
    status: 'opened',
    requestedWorkflowId,
    ...ref,
    name: saved.definition.name,
    version: saved.number,
    message: `${kind === 'resume' ? 'Returned to' : 'Opened'} ${saved.definition.name} · version ${saved.number}. ${session.endedAt ? 'Viewing the recorded run.' : session.attempts.length ? 'Your existing progress is available in the workflow panel.' : 'Ready to review inputs. No calculations have run.'}`,
  });
}
