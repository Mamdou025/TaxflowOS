import { workspaceContext } from '@/platform/auth/workspace-context';
import { blockProgressColor } from '@/features/workflow-builder/ui/nodes/family-node-shape';
import { builderFocusTargetAtom } from '@/shared/workflow-engine/state/workflow-store';
import { useEffect, useState } from 'react';
import { useAtomValue, useStore } from 'jotai';
import {
  sessionContext,
  sessionDefinition,
  isDocumentSource,
  type SessionAction,
} from '@workspace/workflow-core/sessions';
import { definitionFingerprint } from '@workspace/workflow-core/commands';
import { workflowLibraryAtom } from './workflow-library';
import {
  advanceSession,
  isSessionAdvancing,
  applySessionAction,
  openWorkflowSession,
  activeSessionAtom,
  chatWorkflowIdsAtom,
  showSessionInRun,
  bindChatSession,
  chatSessionAtom,
  type SessionRef,
} from './workflow-session-store';
import { SessionSourceFiles } from './session-source-files';
import { SessionInputForms } from './session-input-forms';
import { DocumentExtractionEvidence } from '@/features/documents/document-extraction-evidence';
import { DocumentReviewView } from '@/features/documents/document-review-view';
import { documentReviewSummaries } from '@workspace/workflow-core/inspection';
import { ReadableData } from '@/features/workflow-builder/ui/workspace/readable-data';
import { presentToolOutput } from '@/shared/workflow-engine/present-tool-output';
import { ExecutionLifetimeNotice } from './execution-lifetime-notice';
import { useRouter } from '@/lib/router';
import { templateDefinition } from './workflow-execution';
import { chatPanelModeAtom } from '@/shared/stores/chat-store';
import { openWorkspaceWindowAtom } from '@/shared/stores/workspace-store';
import { workflowSurfaceAtom, workflowTabAtom } from './workflows-store';
import { LazyDetails } from '@/features/workflow-builder/ui/workspace/lazy-details';

export function WorkflowSessionPanel({
  workflowId,
  runId,
  focusBlockId,
  version,
  presentation = 'run',
}: {
  workflowId: string;
  runId?: string;
  focusBlockId?: string;
  version?: number;
  presentation?: 'chat' | 'run';
}) {
  const store = useStore();
  const workspaceId = workspaceContext?.workspace.id;
  const router = useRouter();
  const library = useAtomValue(workflowLibraryAtom);
  const active = useAtomValue(activeSessionAtom);
  const [opened, setOpened] = useState<SessionRef | null>(null);
  const matches = Object.values(library).filter(
    (item) =>
      item.templateId.replace(/^pf-/, '') === workflowId.replace(/^pf-/, '') &&
      item.sessions?.length,
  );
  const entry =
    library[opened?.workflowId ?? workflowId] ?? (matches.length === 1 ? matches[0] : undefined);
  const candidate = entry?.sessions?.find(
    (item) =>
      item.id ===
      (opened?.runId ??
        runId ??
        (active?.workflowId === entry.id ? active.runId : entry.sessions?.at(-1)?.id)),
  );
  const session =
    opened || version === undefined || candidate?.version === version ? candidate : undefined;
  const previewDefinition =
    version === undefined
      ? (entry?.draft ?? templateDefinition(workflowId))
      : entry?.versions.find((item) => item.number === version)?.definition;
  const [error, setError] = useState('');
  const [inputBlock, setInputBlock] = useState('');
  useEffect(() => {
    if (entry && session) store.set(activeSessionAtom, { workflowId: entry.id, runId: session.id });
    if (entry && session && !session.paused && !isSessionAdvancing(session.id))
      applySessionAction(store, { workflowId: entry.id, runId: session.id }, session.revision, {
        kind: 'pause',
      });
  }, [store, entry?.id, session?.id]);
  const start = (fresh = false) => {
    try {
      setError('');
      const next = openWorkflowSession(
        store,
        entry?.id ?? workflowId,
        fresh ? undefined : version,
        fresh,
      );
      setOpened(next);
      const bound = store.get(chatSessionAtom);
      if (bound && bound.runId === session?.id) bindChatSession(store, next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open workflow.');
    }
  };
  if (runId && !session)
    return <p role="alert">This exact run is unavailable. No other run was selected.</p>;
  if (!entry || !session)
    return (
      <section
        aria-label="Workflow execution"
        className="rounded-xl border bg-background p-4 text-foreground"
      >
        <h3 className="font-semibold">
          {previewDefinition?.name ?? 'Requested workflow version unavailable'}
        </h3>
        <p>Start a saved-version run to attach sources and work through these steps.</p>
        <ol className="my-3 list-inside list-decimal text-sm">
          {previewDefinition?.blocks.map((block) => (
            <li key={block.id}>
              {block.label} · {block.family}
            </li>
          ))}
        </ol>
        <button
          className="mt-3 rounded bg-primary px-3 py-2 text-primary-foreground"
          disabled={!previewDefinition}
          onClick={() => start()}
        >
          Start guided workflow
        </button>
        {error && <p role="alert">{error}</p>}
      </section>
    );
  const ref = { workflowId: entry.id, runId: session.id };
  const context = sessionContext(entry, session);
  const definition = sessionDefinition(entry, session);
  const chat = presentation === 'chat';
  const required = context.steps.find((step) => step.inputRequired);
  const inputSteps = context.steps.filter((step) => step.inputKeys.length);
  const currentInput =
    required?.id ??
    (inputSteps.some((step) => step.id === inputBlock) ? inputBlock : inputSteps[0]?.id);
  const saved = entry.versions.find((item) => item.number === session.version)!;
  const sources = definition.blocks.filter(isDocumentSource);
  const act = async (action: SessionAction) => {
    try {
      setError('');
      if (workspaceContext?.workspace.id !== workspaceId)
        throw new Error('The workspace changed. Open the workflow again.');
      applySessionAction(store, ref, session.revision, action);
      if (action.kind === 'resume') await advanceSession(store, ref);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'The run action failed.');
    }
  };
  const verifyInBuild = (blockId = '') => {
    showSessionInRun(store, ref);
    store.set(builderFocusTargetAtom, { workflowId: entry.id, blockId });
    store.set(workflowTabAtom, 'build');
    store.set(workflowSurfaceAtom, 'workflow');
    store.set(chatPanelModeAtom, 'split');
    store.set(openWorkspaceWindowAtom, { pageKey: 'workflows', title: 'Workflows' });
    router.push('/');
  };
  return (
    <section
      aria-label="Workflow execution"
      data-run-flow
      className={
        chat
          ? 'space-y-4 rounded-2xl border border-violet-200/70 bg-background p-5 text-foreground shadow-sm'
          : 'space-y-4 rounded-xl border bg-background p-4 text-foreground'
      }
    >
      <header>
        {chat && (
          <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-violet-600">
            Workflow · current work
          </span>
        )}
        <h3 className="font-semibold">{definition.name}</h3>
        <p className="break-all text-xs text-muted-foreground">
          Version {session.version} · Run {session.id}
        </p>
        <p role="status">
          {session.endedAt
            ? 'Ended — history retained'
            : session.approvedAt
              ? 'Completed — approved'
              : session.paused
                ? 'Paused — ready when you are'
                : 'Running — you can ask questions or pause'}
        </p>
      </header>
      <a
        className="text-sm underline"
        href={`/w/${encodeURIComponent(entry.id)}?run=${encodeURIComponent(session.id)}`}
        onClick={(event) => {
          if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          store.set(chatPanelModeAtom, 'split');
          store.set(workflowSurfaceAtom, 'workflow');
          showSessionInRun(store, ref);
          store.set(openWorkspaceWindowAtom, { pageKey: 'workflows', title: 'Workflows' });
          router.push('/');
        }}
      >
        Open this workflow in Run
      </a>
      {!chat && (
        <button
          className="ml-3 text-sm underline"
          onClick={() => {
            bindChatSession(store, ref);
            store.set(chatWorkflowIdsAtom, (previous) =>
              previous.includes(entry.id) ? previous : [...previous, entry.id],
            );
            store.set(chatPanelModeAtom, 'expanded');
            router.push('/');
          }}
        >
          Continue in Chat
        </button>
      )}
      <button className="ml-3 text-sm underline" onClick={() => verifyInBuild()}>
        Verify this run in Build
      </button>
      <p className="text-xs text-muted-foreground">
        Interactive execution stays in this browser. Progress and evidence are included in the
        workspace save; resume after reopening. Server background runs remain available in Run.
      </p>
      {definitionFingerprint(entry.draft) !== definitionFingerprint(saved.definition) && (
        <p className="text-sm text-amber-700">
          Build has changed. This run retains version {session.version}. Start a new run to use the
          updated definition.
        </p>
      )}
      <div className="flex flex-wrap gap-2">
        <button
          className="rounded border px-3 py-1"
          disabled={!!session.endedAt}
          onClick={() => void act({ kind: session.paused ? 'resume' : 'pause' })}
        >
          {session.paused ? 'Resume workflow' : 'Pause workflow'}
        </button>
        <button className="rounded border px-3 py-1" onClick={() => start(true)}>
          New run from Build
        </button>
        <button
          className="rounded border px-3 py-1 disabled:opacity-50"
          disabled={
            !!session.endedAt ||
            !!session.approvedAt ||
            context.steps.some((step) => !['success', 'warning', 'reviewed'].includes(step.status))
          }
          onClick={() => void act({ kind: 'approve' })}
        >
          Approve completed results
        </button>
      </div>
      <div
        className={
          chat
            ? 'grid gap-5 rounded-xl bg-muted/20 p-3 sm:grid-cols-[minmax(140px,0.35fr)_minmax(0,1fr)]'
            : 'space-y-4'
        }
      >
        {chat && (
          <ol aria-label="Workflow progress" className="space-y-0 border-l-2 border-muted ml-2">
            {context.steps.map((step, index) => (
              <li key={step.id} className="relative pb-3 pl-5">
                <span
                  aria-hidden="true"
                  className={`absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-current ring-2 ring-background ${blockProgressColor(definition.blocks.find((block) => block.id === step.id)!)}`}
                />
                <button
                  className={`w-full rounded-lg px-2 py-1 text-left text-sm hover:bg-background ${step.id === currentInput ? 'bg-background shadow-sm' : ''}`}
                  onClick={() => verifyInBuild(step.id)}
                >
                  {index + 1}. {step.label}{' '}
                  <span className="text-muted-foreground">
                    · {step.inputRequired ? 'Needs your input' : step.status.replaceAll('_', ' ')}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        )}
        <div className="min-w-0 space-y-4">
          {chat && inputSteps.length > 0 && (
            <label className="block text-sm">
              Input block
              <select
                aria-label="Chat input block"
                className="ml-2 rounded border bg-background p-1"
                value={currentInput}
                onChange={(event) => setInputBlock(event.target.value)}
                disabled={!!required}
              >
                {inputSteps.map((step) => (
                  <option key={step.id} value={step.id}>
                    {step.label}
                  </option>
                ))}
              </select>
              {required && (
                <p className="mt-2 text-muted-foreground">
                  Sina needs this input before the workflow can start.
                </p>
              )}
            </label>
          )}
          <SessionSourceFiles
            templateId={entry.templateId}
            blockId={
              chat && sources.some((block) => block.id === currentInput) ? currentInput : undefined
            }
            sources={chat ? sources.filter((block) => block.id === currentInput) : sources}
            session={session}
            act={async (action) => {
              if (workspaceContext?.workspace.id !== workspaceId)
                throw new Error('The workspace changed. Open the workflow again.');
              applySessionAction(store, ref, session.revision, action);
            }}
          />
          <SessionInputForms
            workflowId={entry.id}
            runId={session.id}
            blockId={chat ? currentInput : undefined}
          />
          {session.sources.some((source) => source.extraction) && (
            <DocumentReviewView reviews={documentReviewSummaries(session)} />
          )}
        </div>
      </div>
      <ol className="space-y-2" aria-label="Execution steps">
        {context.steps.map((step, index) => {
          const result = session.results[step.id];
          return (
            <li key={step.id} className="rounded border p-3">
              <LazyDetails
                key={`${step.id}:${step.status}:${step.id === focusBlockId}`}
                defaultOpen={
                  step.id === focusBlockId ||
                  ['error', 'needs_review', 'outdated'].includes(step.status)
                }
                summary={`${index + 1}. ${step.label} · ${step.status.replaceAll('_', ' ')}`}
              >
                <p className="my-2 text-xs">
                  {step.family} ·{' '}
                  {step.dependencies.length
                    ? `Depends on: ${step.dependencies.map((id) => context.steps.find((item) => item.id === id)?.label ?? id).join(', ')}`
                    : 'No preceding steps'}
                </p>
                {step.status === 'outdated' && (
                  <p role="status">Previous result — rerun before using it.</p>
                )}
                {[...step.errors, ...step.warnings].map((message, i) => (
                  <p key={i} className="text-sm text-amber-700">
                    {message}
                  </p>
                ))}
                <button className="text-sm underline" onClick={() => verifyInBuild(step.id)}>
                  Verify this block in Build
                </button>
                {result && (
                  <>
                    <h4 className="mt-2 font-medium">Input</h4>
                    <ReadableData value={result.input ?? {}} />
                    <h4 className="mt-2 font-medium">Result</h4>
                    <DocumentExtractionEvidence value={result.output.extractions} />
                    <ReadableData
                      value={presentToolOutput(
                        result,
                        definition.blocks.find((block) => block.id === step.id),
                      )}
                    />
                  </>
                )}
                <button
                  className="mt-2 rounded border px-3 py-1 disabled:opacity-50"
                  disabled={!!session.endedAt || !session.paused || !step.ready}
                  onClick={() => void act({ kind: 'block', blockId: step.id })}
                >
                  {result ? 'Rerun this block' : 'Run this block'}
                </button>
                {['needs_review', 'warning'].includes(step.status) && (
                  <button
                    className="ml-2 rounded border px-3 py-1"
                    onClick={() => void act({ kind: 'review', blockId: step.id })}
                  >
                    Acknowledge checkpoint
                  </button>
                )}
              </LazyDetails>
            </li>
          );
        })}
      </ol>
      <LazyDetails summary={`Execution history (${session.attempts.length})`}>
        {session.attempts.map((attempt, i) => (
          <LazyDetails
            key={i}
            summary={`${definition.blocks.find((block) => block.id === attempt.blockId)?.label} · ${attempt.at} · revision ${attempt.revision}`}
          >
            <ReadableData value={attempt.result.result.results} />
          </LazyDetails>
        ))}
      </LazyDetails>
      <button
        className="rounded border px-3 py-1 text-sm disabled:opacity-50"
        disabled={!!session.endedAt}
        onClick={() => void act({ kind: 'end' })}
      >
        End workflow
      </button>
      <p className="text-xs text-muted-foreground">
        Ending stops further execution. Completed external actions cannot be undone here.
      </p>
      <ExecutionLifetimeNotice />
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
    </section>
  );
}
