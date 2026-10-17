import { workspaceContext } from '@/platform/auth/workspace-context';
import { builderFocusTargetAtom } from '@/shared/workflow-engine/state/workflow-store';
import { useEffect, useMemo, useState } from 'react';
import { useAtomValue, useStore } from 'jotai';
import { isDocumentSource, type SessionAction } from '@workspace/workflow-core/sessions';
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
import { SessionInputDraftProvider } from './session-input-drafts';
import { WorkflowSessionWorksheet } from './workflow-session-worksheet';
import { createWorkflowSessionReader } from './workflow-session-read-model';
import { WorkflowRequiredInputs } from './workflow-required-inputs';
import { ChatWorkflowSteps, WorkflowDefinitionPreview } from './chat-workflow-steps';
import { FapiWorkflowPreview, FapiWorkflowSteps } from './fapi-workflow-steps';
import { supportsFapiStages } from './workflow-step-model';
import { WorkflowBlockDetails } from './workflow-block-details';
import { FapiSessionWorksheet } from './fapi-session-worksheet';
import { supportsFapiWorksheet } from './fapi-session-result';
import { DocumentReviewView } from '@/features/documents/document-review-view';
import { documentReviewSummaries } from '@workspace/workflow-core/inspection';
import { ReadableData } from '@/features/workflow-builder/ui/workspace/readable-data';
import { ExecutionLifetimeNotice } from './execution-lifetime-notice';
import { useRouter } from '@/lib/router';
import { templateDefinition } from './workflow-execution';
import { chatPanelModeAtom } from '@/shared/stores/chat-store';
import { openWorkspaceWindowAtom } from '@/shared/stores/workspace-store';
import { workflowSurfaceAtom, workflowTabAtom } from './workflows-store';
import { LazyDetails } from '@/features/workflow-builder/ui/workspace/lazy-details';

type WorkflowSessionPanelProps = {
  workflowId: string;
  runId?: string;
  focusBlockId?: string;
  version?: number;
  presentation?: 'chat' | 'run';
};

/** Local openings belong to one requested record; a new request resets them. */
export function WorkflowSessionPanel(props: WorkflowSessionPanelProps) {
  const identity = [workspaceContext?.workspace.id, props.workflowId, props.runId, props.version];
  return <WorkflowSessionPanelBody key={JSON.stringify(identity)} {...props} />;
}

function WorkflowSessionPanelBody({
  workflowId,
  runId,
  focusBlockId,
  version,
  presentation = 'run',
}: WorkflowSessionPanelProps) {
  const store = useStore();
  const workspaceId = workspaceContext?.workspace.id;
  const router = useRouter();
  const library = useAtomValue(workflowLibraryAtom);
  const active = useAtomValue(activeSessionAtom);
  const [opened, setOpened] = useState<SessionRef | null>(null);
  const entry = library[opened?.workflowId ?? workflowId];
  const candidate = entry?.sessions?.find(
    (item) =>
      item.id ===
      (opened?.runId ??
        runId ??
        (active?.workflowId === entry.id ? active.runId : entry.sessions?.at(-1)?.id)),
  );
  const session =
    opened || version === undefined || candidate?.version === version ? candidate : undefined;
  const readSession = useMemo(createWorkflowSessionReader, []);
  const readModel = entry && session ? readSession(entry, session) : undefined;
  const previewDefinition =
    version === undefined
      ? (entry?.draft ?? templateDefinition(workflowId))
      : entry?.versions.find((item) => item.number === version)?.definition;
  const [error, setError] = useState('');
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
      if (presentation === 'run') showSessionInRun(store, next);
      const bound = store.get(chatSessionAtom);
      if (bound && bound.runId === session?.id) bindChatSession(store, next);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not open workflow.');
    }
  };
  if (runId && !session)
    return <p role="alert">This exact run is unavailable. No other run was selected.</p>;
  if (!entry || !session || !readModel)
    return (
      <section
        aria-label="Workflow execution"
        className="rounded-xl border bg-background p-4 text-foreground"
      >
        <h3 className="font-semibold">
          {previewDefinition?.name ?? 'Requested workflow version unavailable'}
        </h3>
        <p>Start a saved-version run to attach sources and work through these steps.</p>
        {previewDefinition && supportsFapiStages(previewDefinition) ? (
          <FapiWorkflowPreview />
        ) : previewDefinition ? (
          <WorkflowDefinitionPreview definition={previewDefinition} />
        ) : null}
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
  const { context, definition } = readModel;
  const chat = presentation === 'chat';
  const fapi = supportsFapiWorksheet(definition);
  const fapiStages = supportsFapiStages(definition);
  const sources = definition.blocks.filter(isDocumentSource);
  const inputTriggerId = definition.blocks.find((block) => block.family === 'Trigger')?.id;
  const requiredCalculation = context.steps.some(
    (step) => step.inputRequired && step.inputKeys.includes('inputChoices'),
  );
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
  const inputForms = (blockId?: string) => (
    <>
      <SessionSourceFiles
        templateId={entry.templateId}
        blockId={blockId}
        sources={blockId ? sources.filter((block) => block.id === blockId) : sources}
        session={session}
        act={async (action) => {
          if (workspaceContext?.workspace.id !== workspaceId)
            throw new Error('The workspace changed. Open the workflow again.');
          applySessionAction(store, ref, session.revision, action);
        }}
      />
      <SessionInputForms
        readModel={readModel}
        blockId={blockId}
        includeCalculations={!inputTriggerId}
      />
      {session.sources.some(
        (source) => source.extraction && (!blockId || source.blockId === blockId),
      ) && (
        <DocumentReviewView
          reviews={documentReviewSummaries(session).filter(
            (review) => !blockId || review.blockId === blockId,
          )}
        />
      )}
    </>
  );
  const stepDetails = (step: (typeof context.steps)[number]) => {
    const result = session.results[step.id];
    return (
      <>
        {step.id === inputTriggerId && (
          <WorkflowRequiredInputs
            definition={definition}
            session={session}
            groups={readModel.groups}
            renderInputs={(blockId) => (
              <SessionInputForms readModel={readModel} blockId={blockId} />
            )}
          />
        )}
        <WorkflowBlockDetails definition={definition} blockId={step.id} session={session} />
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
        <button className="ml-3 text-sm underline" onClick={() => verifyInBuild(step.id)}>
          Verify this block in Build
        </button>
      </>
    );
  };
  return (
    <SessionInputDraftProvider key={`${entry.id}:${session.id}`}>
      <section
        aria-label="Workflow execution"
        data-run-flow
        className={
          chat
            ? 'space-y-5 py-3 text-foreground'
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
        {readModel.draftChanged && (
          <p className="text-sm text-amber-700">
            Build has changed. This run retains version {session.version}. Start a new run to use
            the updated definition.
          </p>
        )}
        <div className="workflow-reference-controls flex flex-wrap gap-2">
          <button
            className="rounded border px-3 py-1"
            disabled={!!session.endedAt}
            onClick={() => void act({ kind: session.paused ? 'resume' : 'pause' })}
          >
            {session.paused
              ? fapi && !session.attempts.length
                ? 'Start workflow'
                : 'Resume workflow'
              : 'Pause workflow'}
          </button>
          <button className="rounded border px-3 py-1" onClick={() => start(true)}>
            New run from Build
          </button>
          <button
            className="rounded border px-3 py-1 disabled:opacity-50"
            disabled={
              !!session.endedAt ||
              !!session.approvedAt ||
              context.steps.some(
                (step) => !['success', 'warning', 'reviewed'].includes(step.status),
              )
            }
            onClick={() => void act({ kind: 'approve' })}
          >
            Approve completed results
          </button>
        </div>
        {fapi && (
          <div className="space-y-3">
            <FapiSessionWorksheet definition={definition} session={session} />
            <button
              className="text-sm underline"
              onClick={() => {
                showSessionInRun(store, ref);
                store.set(workflowTabAtom, 'results');
                store.set(workflowSurfaceAtom, 'workflow');
                store.set(chatPanelModeAtom, 'split');
                store.set(openWorkspaceWindowAtom, { pageKey: 'workflows', title: 'Workflows' });
                router.push('/');
              }}
            >
              Open worksheet in Results
            </button>
          </div>
        )}
        {!fapi && <WorkflowSessionWorksheet readModel={readModel} />}
        {fapiStages ? (
          <FapiWorkflowSteps
            key={`${entry.id}:${session.id}`}
            readModel={readModel}
            focusBlockId={focusBlockId}
            renderStep={(step) => (
              <>
                {inputForms(step.id)}
                {stepDetails(step)}
              </>
            )}
          />
        ) : (
          <>
            {!chat && <div className="space-y-4">{inputForms()}</div>}
            <ChatWorkflowSteps
              key={`${entry.id}:${session.id}`}
              steps={context.steps}
              blocks={definition.blocks}
              initialBlockId={focusBlockId ?? (!chat ? inputTriggerId : undefined)}
              requiredInputBlockId={requiredCalculation ? inputTriggerId : undefined}
              running={!session.paused && !session.endedAt}
              renderStep={(step) => (
                <>
                  {chat && inputForms(step.id)}
                  {stepDetails(step)}
                </>
              )}
            />
          </>
        )}
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
    </SessionInputDraftProvider>
  );
}
