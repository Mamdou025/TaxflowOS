import { listWorkflowRuns, type WorkflowRunSummary } from '@workspace/workflow-core/queries';
import { useAtomValue, useSetAtom } from 'jotai';
import { ArrowRight, Clock3, History, Workflow } from 'lucide-react';
import { NEU } from '@/components/neumorphic-sidebar';
import { useEffect, useState } from 'react';
import type { WorkflowRun } from '@workspace/api-zod/workflow-runs';
import {
  cancelDurableWorkflowRun,
  listDurableWorkflowRuns,
  retryDurableWorkflowRun,
} from '@/platform/workflow-runs-client';
import { ReadableData } from '@/features/workflow-builder/ui/workspace/readable-data';
import { workflowLibraryAtom } from './workflow-library';
import { ExecutionLifetimeNotice } from './execution-lifetime-notice';
import {
  selectedWorkflowIdAtom,
  selectedWorkflowRunIdAtom,
  workflowSurfaceAtom,
  workflowTabAtom,
} from './workflows-store';

function statusLabel(status: string) {
  return status.replaceAll('_', ' ');
}

function RunRow({ run, onOpen }: { run: WorkflowRunSummary; onOpen: () => void }) {
  const failed = run.status === 'error' || run.status === 'failed';
  return (
    <article
      aria-label={`Run ${run.runId}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) auto',
        gap: 16,
        padding: '16px 18px',
        borderRadius: 14,
        background: NEU.surface,
        boxShadow: NEU.shadowSm,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <Workflow size={15} style={{ color: NEU.accent }} />
          <strong style={{ fontSize: 13.5, color: NEU.text }}>{run.workflowName}</strong>
          <span style={{ fontSize: 11, color: NEU.muted }}>Version {run.version}</span>
          <span
            style={{
              borderRadius: 999,
              padding: '2px 8px',
              fontSize: 10.5,
              fontWeight: 700,
              color: failed ? '#b91c1c' : '#047857',
              background: failed ? 'rgba(239,68,68,0.12)' : 'rgba(16,185,129,0.12)',
              textTransform: 'capitalize',
            }}
          >
            {statusLabel(run.status)}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: 12,
            flexWrap: 'wrap',
            marginTop: 7,
            fontSize: 11.5,
            color: NEU.muted,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Clock3 size={12} /> {new Date(run.at).toLocaleString()}
          </span>
          <span title={run.runId}>Run ID {run.runId}</span>
          {run.initiatedBy && <span>Started from {run.initiatedBy.surface}</span>}
        </div>
      </div>
      <button
        type="button"
        onClick={onOpen}
        style={{
          alignSelf: 'center',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          border: 'none',
          borderRadius: 10,
          padding: '8px 11px',
          background: NEU.bg,
          boxShadow: NEU.shadowSm,
          color: NEU.accent,
          fontSize: 12,
          fontWeight: 650,
          cursor: 'pointer',
        }}
      >
        Open run <ArrowRight size={13} />
      </button>
    </article>
  );
}

function DurableRunRow({
  run,
  onChanged,
  onError,
}: {
  run: WorkflowRun;
  onChanged: (run: WorkflowRun) => void;
  onError: (message: string) => void;
}) {
  const active = run.status === 'pending' || run.status === 'running';
  return (
    <article className="space-y-2 rounded-xl border bg-card p-4 text-sm">
      <div className="flex flex-wrap items-center gap-2">
        <Workflow size={15} style={{ color: NEU.accent }} />
        <strong>{run.workflowId}</strong>
        <span className="text-muted-foreground">Version {run.workflowVersion}</span>
        <span className="rounded-full bg-muted px-2 py-0.5 capitalize">{run.status}</span>
      </div>
      <p className="text-xs text-muted-foreground">
        {new Date(run.createdAt).toLocaleString()} · Run ID {run.id} · Attempt {run.attempts}/
        {run.maxAttempts}
      </p>
      {run.error && <p className="text-xs text-red-700">{run.error}</p>}
      <div className="flex gap-2">
        {active && (
          <button
            type="button"
            className="rounded border px-2 py-1 text-xs"
            onClick={() =>
              void cancelDurableWorkflowRun(run.id)
                .then(onChanged)
                .catch((error) =>
                  onError(error instanceof Error ? error.message : 'Cancellation failed.'),
                )
            }
          >
            Cancel
          </button>
        )}
        {['cancelled', 'error'].includes(run.status) && (
          <button
            type="button"
            className="rounded border px-2 py-1 text-xs"
            onClick={() =>
              void retryDurableWorkflowRun(run.id)
                .then(onChanged)
                .catch((error) => onError(error instanceof Error ? error.message : 'Retry failed.'))
            }
          >
            Retry exact version
          </button>
        )}
      </div>
      {run.result != null && (
        <details>
          <summary className="cursor-pointer text-xs font-medium">Execution result</summary>
          <div className="mt-2">
            <ReadableData value={run.result} />
          </div>
        </details>
      )}
    </article>
  );
}

export function WorkflowRunHistory() {
  const library = useAtomValue(workflowLibraryAtom);
  const runs = listWorkflowRuns(library);
  const setSelected = useSetAtom(selectedWorkflowIdAtom);
  const setSelectedRun = useSetAtom(selectedWorkflowRunIdAtom);
  const setSurface = useSetAtom(workflowSurfaceAtom);
  const setTab = useSetAtom(workflowTabAtom);
  const [durableRuns, setDurableRuns] = useState<WorkflowRun[]>([]);
  const [durableError, setDurableError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const refresh = () =>
      void listDurableWorkflowRuns()
        .then((next) => {
          if (active) setDurableRuns(next);
        })
        .catch((error) => {
          if (active)
            setDurableError(
              error instanceof Error ? error.message : 'Server runs are unavailable.',
            );
        });
    refresh();
    const timer = window.setInterval(refresh, 2_000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  const openRun = (run: WorkflowRunSummary) => {
    setSelected(run.workflowId);
    setSelectedRun(run.runId);
    setSurface('workflow');
    setTab('results');
  };

  return (
    <div className="absolute inset-0 overflow-auto p-6">
      <div className="mx-auto max-w-5xl">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <span
            style={{
              width: 38,
              height: 38,
              display: 'grid',
              placeItems: 'center',
              borderRadius: 11,
              background: NEU.surface,
              boxShadow: NEU.shadowSm,
              color: NEU.accent,
            }}
          >
            <History size={18} />
          </span>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 750, color: NEU.text }}>
              Workflow run history
            </h2>
            <p style={{ margin: '3px 0 0', fontSize: 12.5, color: NEU.muted }}>
              Recorded attempts across workflows. Opening a run never executes it again.
            </p>
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <ExecutionLifetimeNotice />
        </div>
        <h3 className="mb-2 text-sm font-semibold">Durable server runs</h3>
        {durableError && <p className="mb-3 text-sm text-red-700">{durableError}</p>}
        <div className="mb-6 grid gap-2">
          {durableRuns.length ? (
            durableRuns.map((run) => (
              <DurableRunRow
                key={run.id}
                run={run}
                onChanged={(next) =>
                  setDurableRuns((previous) => {
                    const present = previous.some((candidate) => candidate.id === next.id);
                    return present
                      ? previous.map((candidate) => (candidate.id === next.id ? next : candidate))
                      : [next, ...previous];
                  })
                }
                onError={setDurableError}
              />
            ))
          ) : (
            <p className="rounded-xl border bg-card p-4 text-sm text-muted-foreground">
              No durable server runs yet.
            </p>
          )}
        </div>
        <h3 className="mb-2 text-sm font-semibold">Browser preview history</h3>
        {runs.length === 0 ? (
          <div
            style={{
              padding: 24,
              borderRadius: 14,
              background: NEU.surface,
              boxShadow: NEU.shadowSm,
              color: NEU.muted,
              fontSize: 13,
            }}
          >
            No workflow runs yet. Choose a workflow, save a version and run it to create a record.
          </div>
        ) : (
          <div style={{ display: 'grid', gap: 10 }}>
            {runs.map((run) => (
              <RunRow
                key={`${run.workflowId}:${run.runId}`}
                run={run}
                onOpen={() => openRun(run)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
