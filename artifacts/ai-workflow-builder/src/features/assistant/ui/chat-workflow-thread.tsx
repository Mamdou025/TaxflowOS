import { useAtomValue, useStore } from 'jotai';
import { useMemo, useState } from 'react';
import { sessionContext } from '@workspace/workflow-core/sessions';
import { WorkflowSessionPanel } from '@/features/workflows-hub/workflow-session-panel';
import { workflowLibraryAtom } from '@/features/workflows-hub/workflow-library';
import {
  bindChatSession,
  chatSessionAtom,
  openWorkflowSession,
} from '@/features/workflows-hub/workflow-session-store';
import { recordWorkflowSelection } from '../runtime/chat/workflow-interaction-store';

/** Historical message cards only navigate on explicit action; rendering never selects a run. */
export function ChatWorkflowCard({
  workflowId,
  runId,
  version,
}: {
  workflowId: string;
  runId?: string;
  version?: number;
}) {
  const store = useStore();
  const active = useAtomValue(chatSessionAtom);
  const library = useAtomValue(workflowLibraryAtom);
  const [error, setError] = useState('');
  // The message list owns the single live form at its opening receipt. Other
  // action receipts must not mount duplicate forms or require an extra click.
  if (active?.workflowId === workflowId && active.runId === runId) return null;
  return (
    <div>
      <button
        className="rounded border px-3 py-2 text-sm"
        onClick={() => {
          try {
            setError('');
            const ref = runId
              ? { workflowId, runId }
              : active?.workflowId === workflowId &&
                  (version === undefined ||
                    library[workflowId]?.sessions?.find((item) => item.id === active.runId)
                      ?.version === version)
                ? active
                : openWorkflowSession(store, workflowId, version);
            recordWorkflowSelection(store, workflowId, ref, 'resume');
            bindChatSession(store, ref);
          } catch (cause) {
            setError(cause instanceof Error ? cause.message : 'Workflow unavailable.');
          }
        }}
      >
        Return to workflow · {library[workflowId]?.draft.name ?? workflowId}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}

export function ChatWorkflowThread() {
  const ref = useAtomValue(chatSessionAtom);
  if (!ref) return null;
  return (
    <section id="chat-workflow" aria-label="Workflow in chat" className="my-4" tabIndex={-1}>
      <WorkflowSessionPanel
        key={`${ref.workflowId}:${ref.runId}`}
        presentation="chat"
        workflowId={ref.workflowId}
        runId={ref.runId}
      />
    </section>
  );
}

/** A read projection for Work; the workflow remains owned by its saved session. */
export function useChatWorkflowSummary() {
  const ref = useAtomValue(chatSessionAtom);
  const library = useAtomValue(workflowLibraryAtom);
  const entry = ref ? library[ref.workflowId] : undefined;
  const session = entry?.sessions?.find((item) => item.id === ref?.runId);
  const context = useMemo(
    () => (entry && session ? sessionContext(entry, session) : null),
    [entry, session, session?.revision],
  );
  if (!session || !entry || !context) return null;
  const steps = context.steps;
  const complete =
    steps.length > 0 &&
    steps.every((step) => ['success', 'warning', 'reviewed'].includes(step.status));
  return {
    ref: { workflowId: entry.id, runId: session.id },
    name:
      entry.versions.find((version) => version.number === session.version)?.definition.name ??
      entry.draft.name,
    version: session.version,
    status: session.endedAt
      ? 'Ended'
      : session.approvedAt
        ? 'Approved'
        : complete
          ? 'Completed'
          : session.paused
            ? 'Paused'
            : 'Running',
  };
}
