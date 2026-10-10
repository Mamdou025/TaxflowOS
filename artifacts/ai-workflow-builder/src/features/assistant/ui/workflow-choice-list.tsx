import { useState } from 'react';
import { useAtomValue, useStore } from 'jotai';
import { Workflow } from 'lucide-react';
import { workflowLibraryAtom } from '@/features/workflows-hub/workflow-library';
import {
  bindChatSession,
  openWorkflowSession,
} from '@/features/workflows-hub/workflow-session-store';
import {
  selectedWorkflowIdAtom,
  selectedWorkflowRunIdAtom,
  workflowSurfaceAtom,
  workflowTabAtom,
} from '@/features/workflows-hub/workflows-store';
import { getWorkflowConfig } from '@/shared/workflow-engine/runtime/workflow-runs';
import { openWorkspaceWindowAtom } from '@/shared/stores/workspace-store';
import { chatPanelModeAtom } from '@/shared/stores/chat-store';
import { chatContextLockedAtom } from '../runtime/chat/chat-context-store';
import {
  resolveWorkflowChoice,
  workflowChoices,
  type WorkflowChoice,
} from './workflow-choice-model';
import {
  recordWorkflowInteraction,
  recordWorkflowSelection,
} from '../runtime/chat/workflow-interaction-store';

function dateLabel(value?: string) {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toLocaleString();
}

/** A list receipt is read-only; only an explicit click opens a workflow or draft. */
export function WorkflowChoiceList({
  result,
  kind,
}: {
  result: unknown;
  kind: 'available' | 'saved';
}) {
  const store = useStore();
  // This card can mount mid-reply, after the SDK captures its run subscribers.
  // Subscribe to the pre-mounted chat owner so completion always unlocks it.
  const locked = useAtomValue(chatContextLockedAtom);
  const library = useAtomValue(workflowLibraryAtom);
  const [error, setError] = useState('');
  const { choices, error: readError } = workflowChoices(result, kind);
  const open = (choice: WorkflowChoice) => {
    if (store.get(chatContextLockedAtom)) return;
    setError('');
    try {
      const request = resolveWorkflowChoice(choice, store.get(workflowLibraryAtom), (id) =>
        Boolean(getWorkflowConfig(id)),
      );
      if ('error' in request) throw new Error(request.error);
      if (request.kind === 'draft') {
        store.set(selectedWorkflowIdAtom, request.workflowId);
        store.set(selectedWorkflowRunIdAtom, null);
        store.set(workflowSurfaceAtom, 'workflow');
        store.set(workflowTabAtom, 'build');
        store.set(openWorkspaceWindowAtom, { pageKey: 'workflows', title: 'Workflows' });
        store.set(chatPanelModeAtom, 'split');
        recordWorkflowInteraction(store, {
          kind: 'draft',
          status: 'opened',
          name: choice.name,
          requestedWorkflowId: choice.workflowId,
          workflowId: request.workflowId,
          message: `Opened ${choice.name} for editing. This draft has not been started. Any active run remains separate.`,
        });
        return;
      }
      const ref =
        request.kind === 'resume'
          ? { workflowId: request.workflowId, runId: request.runId }
          : openWorkflowSession(store, request.workflowId, request.version, true);
      bindChatSession(store, ref);
      recordWorkflowSelection(
        store,
        choice.workflowId,
        ref,
        request.kind === 'resume'
          ? 'resume'
          : choice.target.kind === 'template'
            ? 'template'
            : 'saved-version',
      );
      requestAnimationFrame(() => document.getElementById('chat-workflow')?.focus());
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'This workflow could not be opened.';
      setError(message);
      recordWorkflowInteraction(store, {
        kind: choice.target.kind,
        status: 'failed',
        name: choice.name,
        requestedWorkflowId: choice.workflowId,
        workflowId: choice.workflowId,
        message: `Could not open ${choice.name}. ${message}`,
      });
    }
  };
  return (
    <section
      aria-label={kind === 'available' ? 'Available workflows' : 'Saved workflows'}
      className="space-y-3 rounded-xl border bg-background/60 p-3"
    >
      <div>
        <p className="text-sm font-semibold">
          {kind === 'available' ? 'Choose a workflow' : 'Choose a saved workflow'}
        </p>
        <p className="text-xs text-muted-foreground">
          Open a workflow to review its steps. Calculations start from the workflow panel.
        </p>
      </div>
      {!readError && choices.length === 0 && (
        <p className="text-sm">
          {kind === 'available'
            ? 'No matching templates were found.'
            : 'No matching saved workflows were found. Built-in templates are available separately.'}
        </p>
      )}
      <ul className="space-y-2">
        {choices.map((choice) => {
          const target = choice.target;
          const action =
            target.kind === 'draft'
              ? `Open ${choice.name} draft`
              : target.kind === 'saved-version'
                ? `Open ${choice.name} version ${target.version} in chat`
                : `Start ${choice.name} in chat`;
          const date = dateLabel(choice.date);
          const resumable =
            target.kind === 'saved-version'
              ? (library[choice.workflowId]?.sessions?.filter(
                  (session) => !session.endedAt && session.version === target.version,
                ) ?? [])
              : [];
          return (
            <li
              key={choice.workflowId}
              className="min-w-0 rounded-lg border p-3"
              data-workflow-choice={choice.workflowId}
            >
              <button
                type="button"
                aria-label={action}
                onClick={() => open(choice)}
                disabled={locked}
                className="flex w-full items-start gap-2 text-left text-sm font-semibold text-primary hover:underline disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                <Workflow size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span className="break-words">{choice.name}</span>
              </button>
              <p className="mt-1 text-xs text-muted-foreground">
                {target.kind === 'template'
                  ? 'Built-in template'
                  : target.kind === 'draft'
                    ? 'Draft only · No saved version'
                    : `Saved version ${target.version}`}
                {date ? ` · ${target.kind === 'draft' ? 'Updated' : 'Saved'} ${date}` : ''}
              </p>
              {choice.description && (
                <p className="mt-1 text-xs text-muted-foreground break-words">
                  {choice.description}
                </p>
              )}
              {choice.versionName && choice.versionName !== choice.name && (
                <p className="mt-1 text-xs text-muted-foreground break-words">
                  Saved version name: {choice.versionName}
                </p>
              )}
              {target.kind === 'draft' && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Opens the draft in Build without saving a version or starting a run.
                </p>
              )}
              {target.kind === 'saved-version' && (
                <button
                  type="button"
                  aria-label={`Open ${choice.name} draft`}
                  onClick={() => open({ ...choice, target: { kind: 'draft' } })}
                  disabled={locked}
                  className="mt-2 text-xs underline"
                >
                  Open draft
                </button>
              )}
              {resumable.map((session, index) => (
                <button
                  key={session.id}
                  type="button"
                  disabled={locked}
                  className="mt-2 mr-3 text-xs underline disabled:opacity-50"
                  aria-label={`Resume ${choice.name} version ${session.version} run ${index + 1}`}
                  onClick={() =>
                    open({
                      ...choice,
                      target: { kind: 'resume', version: session.version, runId: session.id },
                    })
                  }
                >
                  Resume run {resumable.length > 1 ? index + 1 : ''} ·{' '}
                  {dateLabel(session.createdAt)}
                </button>
              ))}
              {kind === 'saved' && (
                <details className="mt-2 text-xs text-muted-foreground">
                  <summary className="cursor-pointer">Workflow details</summary>
                  <p className="mt-1 break-all">ID: {choice.workflowId}</p>
                </details>
              )}
            </li>
          );
        })}
      </ul>
      {locked && (
        <p role="status" className="text-xs text-muted-foreground">
          Choices are available when the chat is ready.
        </p>
      )}
      {(readError || error) && (
        <p role="alert" className="text-sm text-destructive">
          {readError || error}
        </p>
      )}
    </section>
  );
}
