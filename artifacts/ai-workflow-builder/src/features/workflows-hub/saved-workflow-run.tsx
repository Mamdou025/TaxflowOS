import { WorkflowResultSummary } from './workflow-result-summary';
import { createWorkflow, replaceDraft } from '@workspace/workflow-core/commands';
import { ApiDataStatus } from './workflow-api-status';
import { useState } from 'react';
import { useEffect } from 'react';
import { LazyDetails } from '@/features/workflow-builder/ui/workspace/lazy-details';
import { TriggerReadinessPanel } from '@/features/workflow-builder/ui/config/trigger-readiness-panel';
import { presentToolOutput } from '@/shared/workflow-engine/present-tool-output';
import { useAtom, useSetAtom } from 'jotai';
import { type WorkflowDefinition } from '@/shared/workflow-engine/workflow/contracts';
import { workflowLibraryAtom, definitionFingerprint } from './workflow-library';
import { selectedWorkflowIdAtom, selectedWorkflowRunIdAtom } from './workflows-store';
import { WorkflowTestData } from './workflow-test-data';
import { ReadableData } from '@/features/workflow-builder/ui/workspace/readable-data';
import { ExecutionLifetimeNotice } from './execution-lifetime-notice';
import type { WorkflowRun } from '@workspace/api-zod/workflow-runs';
import {
  cancelDurableWorkflowRun,
  createDurableWorkflowRun,
  getDurableWorkflowRun,
  retryDurableWorkflowRun,
} from '@/platform/workflow-runs-client';

import { templateDefinition, runWorkflowAtom } from './workflow-execution';
export { templateDefinition } from './workflow-execution';

export function SavedWorkflowRun({
  id,
  resultsOnly = false,
}: {
  id: string;
  resultsOnly?: boolean;
}) {
  const executeWorkflow = useSetAtom(runWorkflowAtom);
  const [library, setLibrary] = useAtom(workflowLibraryAtom);
  const [, setSelected] = useAtom(selectedWorkflowIdAtom);
  const [selectedRunId, setSelectedRunId] = useAtom(selectedWorkflowRunIdAtom);
  const entry = library[id];
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null);
  const [durableRun, setDurableRun] = useState<WorkflowRun | null>(null);
  const [durableError, setDurableError] = useState<string | null>(null);
  const [startingDurable, setStartingDurable] = useState(false);
  useEffect(() => {
    if (!durableRun || !['pending', 'running'].includes(durableRun.status)) return;
    const timer = window.setInterval(() => {
      void getDurableWorkflowRun(durableRun.id)
        .then((next) => {
          setDurableRun(next);
          if (!['pending', 'running'].includes(next.status)) window.clearInterval(timer);
        })
        .catch((error) => {
          setDurableError(error instanceof Error ? error.message : 'Run status is unavailable.');
          window.clearInterval(timer);
        });
    }, 750);
    return () => window.clearInterval(timer);
  }, [durableRun?.id, durableRun?.status]);
  const definition = entry?.draft ?? templateDefinition(id);
  if (!definition) return <p>Add blocks in Build to start testing your workflow.</p>;
  const update = (draft: WorkflowDefinition) => {
    const nextId = entry?.id ?? `custom:${crypto.randomUUID()}`;
    const namedDraft = {
      ...draft,
      id: nextId,
      name: entry ? draft.name : `${draft.name} — My workflow`,
    };
    setLibrary((previous) => ({
      ...previous,
      [nextId]: previous[nextId]
        ? replaceDraft(previous[nextId], namedDraft)
        : createWorkflow(nextId, id, namedDraft),
    }));
    setSelected(nextId);
  };
  const run = (saveDraft = true) => {
    setSelectedRunId(null);
    const version = executeWorkflow({ id, saveDraft, version: selectedVersion });
    if (version != null) setSelectedVersion(version);
  };
  const latestSaved = entry?.versions.at(-1);
  const chosen =
    entry?.versions.find((version) => version.number === selectedVersion) ?? latestSaved;
  const unsaved =
    !latestSaved ||
    definitionFingerprint(latestSaved.definition) !== definitionFingerprint(definition);
  const displayedRun = selectedRunId
    ? entry?.runs.find((run) => run.result.record.execution.id === selectedRunId)
    : entry?.runs.at(-1);
  const displayedVersion = entry?.versions.find(
    (version) => version.number === displayedRun?.version,
  );
  const stale =
    displayedVersion &&
    definitionFingerprint(displayedVersion.definition) !== definitionFingerprint(definition);
  const startDurable = async (version: number) => {
    setStartingDurable(true);
    setDurableError(null);
    try {
      setDurableRun(await createDurableWorkflowRun(id, version));
    } catch (error) {
      setDurableError(error instanceof Error ? error.message : 'The durable run could not start.');
    } finally {
      setStartingDurable(false);
    }
  };
  return (
    <div className="space-y-5 text-foreground">
      <div>
        {entry && !resultsOnly ? (
          <label className="block text-xs text-muted-foreground">
            Workflow name
            <input
              aria-label="Workflow name"
              className="mt-1 block w-full rounded border bg-background px-2 py-1 text-lg font-semibold text-foreground"
              defaultValue={definition.name}
              key={id}
              onBlur={(event) => {
                const name = event.target.value.trim();
                if (name && name !== definition.name) update({ ...definition, name });
              }}
            />
          </label>
        ) : (
          <h2 className="text-lg font-semibold">{definition.name}</h2>
        )}
        <p className="text-sm text-muted-foreground">
          {entry
            ? `Personal workflow · ${entry.versions.length ? `Saved version ${entry.versions.at(-1)!.number}` : 'Draft'}`
            : 'Template · running or editing creates your own workflow'}
        </p>
      </div>
      {!resultsOnly && (
        <>
          <WorkflowTestData definition={definition} onChange={update} />
          <ApiDataStatus blocks={definition.blocks} />
          <TriggerReadinessPanel
            config={
              (
                definition.blocks.find((block) => block.config.canvasNodeType === 'trigger') ??
                definition.blocks.find((block) => block.id === definition.structure.entryBlockId)
              )?.config ?? {}
            }
            blocks={definition.blocks}
            outputs={Object.fromEntries(
              (entry?.runs.at(-1)?.result.result.results ?? [])
                .filter(
                  (result) =>
                    result.configSignature ===
                    JSON.stringify(
                      definition.blocks.find((block) => block.id === result.blockId)?.config,
                    ),
                )
                .map((result) => [result.blockId, result.output]),
            )}
          />
          <div className="space-y-2 rounded border p-3">
            <p className="text-sm font-medium">
              {unsaved
                ? 'Unsaved changes in Build'
                : `Build and Run share saved version ${latestSaved?.number}`}
            </p>
            {chosen && (
              <>
                <label className="block text-xs">
                  Saved workflow version
                  <select
                    aria-label="Saved workflow version"
                    className="ml-2 rounded border bg-background p-1"
                    value={chosen.number}
                    onChange={(event) => setSelectedVersion(Number(event.target.value))}
                  >
                    {entry?.versions.map((version) => (
                      <option key={version.number} value={version.number}>
                        {version.definition.name} - Version {version.number}
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  className="rounded border px-3 py-2 text-sm"
                  onClick={() => run(false)}
                >
                  Preview saved version {chosen.number} in this browser
                </button>
                <button
                  type="button"
                  className="ml-2 rounded bg-primary px-3 py-2 text-sm text-primary-foreground disabled:opacity-50"
                  disabled={startingDurable}
                  onClick={() => void startDurable(chosen.number)}
                >
                  {startingDurable ? 'Starting…' : `Run saved version ${chosen.number} durably`}
                </button>
              </>
            )}
          </div>
          <button
            className="rounded-lg bg-primary px-4 py-2 text-primary-foreground"
            onClick={() => run(true)}
          >
            Save changes and preview
          </button>
          <p className="text-xs text-muted-foreground">
            Runs the graph and rules shown in Build using its configured source data. Blocks without
            an executable tool are reported in the results.
          </p>
          <ExecutionLifetimeNotice />
          {durableError && (
            <p role="alert" className="rounded border border-red-500 p-3 text-sm text-red-700">
              {durableError}
            </p>
          )}
          {durableRun && (
            <div className="space-y-2 rounded border p-3 text-sm">
              <p>
                Durable run <strong>{durableRun.status}</strong> · Version{' '}
                {durableRun.workflowVersion} · ID {durableRun.id}
              </p>
              {['pending', 'running'].includes(durableRun.status) && (
                <button
                  type="button"
                  className="rounded border px-2 py-1 text-xs"
                  onClick={() =>
                    void cancelDurableWorkflowRun(durableRun.id)
                      .then(setDurableRun)
                      .catch((error) =>
                        setDurableError(
                          error instanceof Error ? error.message : 'Cancellation failed.',
                        ),
                      )
                  }
                >
                  Cancel run
                </button>
              )}
              {['cancelled', 'error'].includes(durableRun.status) && (
                <button
                  type="button"
                  className="rounded border px-2 py-1 text-xs"
                  onClick={() =>
                    void retryDurableWorkflowRun(durableRun.id)
                      .then(setDurableRun)
                      .catch((error) =>
                        setDurableError(error instanceof Error ? error.message : 'Retry failed.'),
                      )
                  }
                >
                  Retry exact saved version
                </button>
              )}
              {durableRun.error && <p className="text-red-700">{durableRun.error}</p>}
              {durableRun.result != null && (
                <LazyDetails summary={<>Durable result</>}>
                  <ReadableData value={durableRun.result} />
                </LazyDetails>
              )}
            </div>
          )}
        </>
      )}
      {stale && (
        <p className="rounded border border-amber-500 p-3 text-sm">
          The draft has changed since this run. These results belong to version{' '}
          {displayedRun?.version}; run again to test your changes.
        </p>
      )}
      {selectedRunId && !displayedRun ? (
        <p role="alert" className="rounded border border-amber-500 p-3 text-sm">
          Run {selectedRunId} is not available in this workflow. No different run was selected.
        </p>
      ) : !displayedRun ? (
        <p className="text-sm text-muted-foreground">
          No results yet. Run the workflow to see what each block receives and produces.
        </p>
      ) : (
        <div className="space-y-3">
          <h3 className="font-semibold">
            Version {displayedRun.version} · {new Date(displayedRun.at).toLocaleString()} ·{' '}
            {displayedRun.result.result.status}
          </h3>
          <p className="text-xs text-muted-foreground">
            Run ID {displayedRun.result.record.execution.id}
            {displayedRun.initiatedBy ? ` · Started from ${displayedRun.initiatedBy.surface}` : ''}
          </p>
          <WorkflowResultSummary
            definition={displayedVersion?.definition}
            results={displayedRun.result.result.results}
          />
          <ApiDataStatus blocks={displayedVersion?.definition.blocks ?? []} recorded />
          {displayedRun.result.result.results.map((result) => (
            <LazyDetails
              className="rounded-lg border bg-background p-3"
              key={result.blockId}
              defaultOpen={result.status === 'error'}
              summary={
                <>
                  {displayedVersion?.definition.blocks.find((block) => block.id === result.blockId)
                    ?.label ?? result.blockId}{' '}
                  · {result.status.replaceAll('_', ' ')}
                </>
              }
            >
              <div className="mt-3 space-y-3">
                {[...result.errors, ...result.warnings].map((message, index) => (
                  <p className="text-sm text-amber-700" key={index}>
                    {message}
                  </p>
                ))}
                <h4 className="font-medium">Input</h4>
                <ReadableData value={result.input ?? {}} />
                <h4 className="font-medium">Output</h4>
                <ReadableData
                  value={presentToolOutput(
                    result,
                    displayedVersion?.definition.blocks.find(
                      (block) => block.id === result.blockId,
                    ),
                  )}
                />
              </div>
            </LazyDetails>
          ))}
          {entry && entry.runs.some((run) => run !== displayedRun) && (
            <LazyDetails summary={<>Other runs ({entry.runs.length - 1})</>}>
              {entry.runs
                .filter(
                  (record) =>
                    record.result.record.execution.id !== displayedRun.result.record.execution.id,
                )
                .reverse()
                .map((record) => (
                  <LazyDetails
                    className="mt-2 rounded border p-3"
                    key={record.result.record.execution.id}
                    summary={
                      <>
                        Version {record.version} · {new Date(record.at).toLocaleString()} ·{' '}
                        {record.result.result.status}
                      </>
                    }
                  >
                    <button
                      type="button"
                      className="mb-3 rounded border px-2 py-1 text-xs"
                      onClick={() => setSelectedRunId(record.result.record.execution.id)}
                    >
                      Open run {record.result.record.execution.id}
                    </button>
                    <ReadableData
                      value={record.result.result.results.map((result) => ({
                        block: result.blockId,
                        status: result.status,
                        output: result.output,
                      }))}
                    />
                  </LazyDetails>
                ))}
            </LazyDetails>
          )}
        </div>
      )}
    </div>
  );
}
