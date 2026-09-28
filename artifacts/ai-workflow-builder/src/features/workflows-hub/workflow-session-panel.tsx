import { builderFocusTargetAtom } from '@/shared/workflow-engine/state/workflow-store';
import { useEffect, useState } from 'react';
import { useAtomValue, useStore } from 'jotai';
import {
  sessionContext,
  sessionDefinition,
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
  type SessionRef,
} from './workflow-session-store';
import { useWorkbookImport } from '@/features/documents/workbook-import-dialog';
import { parseUploadToRows } from '@/shared/workflow-engine/runtime/workflow-runs/parse-upload';
import { uploadedRowsAtom } from '@/shared/stores/workspace-store';
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
}: {
  workflowId: string;
  runId?: string;
  focusBlockId?: string;
  version?: number;
}) {
  const store = useStore();
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
  const [busy, setBusy] = useState(false);
  const [target, setTarget] = useState('');
  const [mode, setMode] = useState<'replace' | 'add'>('replace');
  const { selectWorkbook, importDialog } = useWorkbookImport();
  const attached = useAtomValue(uploadedRowsAtom);
  const cached =
    attached.__unassigned__ ?? attached[(entry?.templateId ?? workflowId).replace(/^pf-/, '')];
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
      setOpened(
        openWorkflowSession(store, entry?.id ?? workflowId, fresh ? undefined : version, fresh),
      );
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
  const saved = entry.versions.find((item) => item.number === session.version)!;
  const sources = definition.blocks.filter(
    (block) =>
      block.family === 'Source' &&
      /excel|workbook|uploaded|manual_table/.test(String(block.config.sourceKind)),
  );
  const sourceId = target || (sources.length === 1 ? sources[0].id : '');
  const act = async (action: SessionAction) => {
    try {
      setError('');
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
  const attach = async (name: string, rows: Record<string, unknown>[]) => {
    await act({
      kind: 'source',
      blockId: sourceId,
      sourceId: crypto.randomUUID(),
      name,
      rows,
      mode,
    });
  };
  return (
    <section
      aria-label="Workflow execution"
      data-run-flow
      className="space-y-4 rounded-xl border bg-background p-4 text-foreground"
    >
      <header>
        <h3 className="font-semibold">{definition.name}</h3>
        <p className="text-xs text-muted-foreground">
          Version {session.version} · Run {session.id}
        </p>
        <p role="status">
          {session.approvedAt
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
      <button
        className="ml-3 text-sm underline"
        onClick={() => {
          store.set(activeSessionAtom, ref);
          store.set(chatWorkflowIdsAtom, (previous) =>
            previous.includes(entry.id) ? previous : [...previous, entry.id],
          );
          store.set(chatPanelModeAtom, 'expanded');
          router.push('/');
        }}
      >
        Continue in Chat
      </button>
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
            !!session.approvedAt ||
            context.steps.some((step) => !['success', 'warning', 'reviewed'].includes(step.status))
          }
          onClick={() => void act({ kind: 'approve' })}
        >
          Approve completed results
        </button>
      </div>
      {sources.length > 0 && (
        <fieldset className="space-y-2 rounded border p-3" disabled={busy || !session.paused}>
          <legend>Sources</legend>
          <label className="block text-sm">
            Source block{' '}
            <select
              aria-label="Run source block"
              className="rounded border bg-background p-1"
              value={sourceId}
              onChange={(event) => setTarget(event.target.value)}
            >
              <option value="">Choose a source block</option>
              {sources.map((source) => (
                <option key={source.id} value={source.id}>
                  {source.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-sm">
            Source action{' '}
            <select
              aria-label="Source action"
              className="rounded border bg-background p-1"
              value={mode}
              onChange={(event) => setMode(event.target.value as 'replace' | 'add')}
            >
              <option value="replace">Replace source records</option>
              <option value="add">Add another source</option>
            </select>
          </label>
          <input
            aria-label="Upload run source"
            type="file"
            accept=".xlsx,.xls,.json"
            disabled={!sourceId}
            onChange={async (event) => {
              const file = event.target.files?.[0];
              event.target.value = '';
              if (!file) return;
              setBusy(true);
              setError('');
              try {
                const parsed = await parseUploadToRows(file, { selectWorkbook });
                await attach(parsed.fileName, parsed.rows);
              } catch (err) {
                setError(err instanceof Error ? err.message : 'Import failed.');
              } finally {
                setBusy(false);
              }
            }}
          />
          {cached && (
            <button
              className="rounded border px-3 py-1"
              disabled={!sourceId}
              onClick={() => void attach(cached.fileName, cached.rows)}
            >
              Use attached file: {cached.fileName}
            </button>
          )}
          <p className="text-xs text-muted-foreground">
            Source changes preserve previous evidence and mark affected results as outdated. Pause
            before changing sources.
          </p>
          {session.sources.map((source) => (
            <p key={source.id} className="text-xs">
              {source.name} · {source.rows.length} records · {source.mode} ·{' '}
              {new Date(source.at).toLocaleString()}
            </p>
          ))}
        </fieldset>
      )}
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
                  disabled={!session.paused || !step.ready}
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
      <ExecutionLifetimeNotice />
      {error && (
        <p role="alert" className="text-red-700">
          {error}
        </p>
      )}
      {importDialog}
    </section>
  );
}
