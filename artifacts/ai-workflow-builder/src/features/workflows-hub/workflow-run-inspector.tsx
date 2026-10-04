import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAtomValue, useStore } from 'jotai';
import { useCopilotReadable } from '@copilotkit/react-core';
import { inspectWorkflowRun } from '@workspace/workflow-core/inspection';
import { getSavedVersion } from '@workspace/workflow-core/commands';
import { workflowLibraryAtom } from './workflow-library';
import {
  activeSessionAtom,
  bindChatSession,
  chatWorkflowIdsAtom,
  showSessionInRun,
  workflowInspectionAtom,
} from './workflow-session-store';
import { selectedWorkflowRunIdAtom, workflowTabAtom } from './workflows-store';
import { chatPanelModeAtom } from '@/shared/stores/chat-store';
import { builderFocusTargetAtom } from '@/shared/workflow-engine/state/workflow-store';
import { RecordedWorkflowBuilder } from './recorded-workflow-builder';
import { recordedRunProjection } from './recorded-run-projection';
import { WorkflowRunEvidence } from './workflow-run-evidence';

/** Exact run inspection uses the normal Build canvas/workspace in an isolated, read-only scope. */
export function WorkflowRunInspector({ workflowId, runId }: { workflowId: string; runId: string }) {
  const store = useStore();
  const library = useAtomValue(workflowLibraryAtom);
  const focus = useAtomValue(builderFocusTargetAtom);
  const [selected, setSelected] = useState(() =>
    focus?.workflowId === workflowId ? focus.blockId : '',
  );
  const [attemptIndex, setAttemptIndex] = useState<number | null>(null);
  const inspected = useMemo(() => {
    try {
      if (!library[workflowId]) return { error: 'This workflow is unavailable.' };
      const entry = library[workflowId];
      const evidence = inspectWorkflowRun(entry, runId);
      return {
        evidence,
        projection: recordedRunProjection(
          evidence,
          attemptIndex,
          getSavedVersion(entry, evidence.version).definition,
          entry.runs.find((run) => run.result.record.execution.id === runId)?.result.record,
        ),
      };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Run evidence is unavailable.' };
    }
  }, [library, workflowId, runId, attemptIndex]);
  const evidence = inspected.evidence;
  const projection = inspected.projection;
  useEffect(() => {
    setSelected(focus?.workflowId === workflowId ? focus.blockId : '');
    setAttemptIndex(null);
  }, [workflowId, runId, focus?.workflowId, focus?.blockId]);
  useEffect(() => {
    store.set(activeSessionAtom, evidence?.kind === 'session' ? { workflowId, runId } : null);
  }, [store, workflowId, runId, evidence?.kind]);
  const block =
    projection?.definition.blocks.find((item) => item.id === selected) ??
    projection?.definition.blocks[0];
  const attempt = attemptIndex === null ? undefined : evidence?.attempts[attemptIndex];
  const step = evidence?.steps.find((item) => item.id === block?.id);
  useEffect(() => {
    store.set(
      workflowInspectionAtom,
      evidence && block ? { workflowId, runId, blockId: block.id, attemptIndex } : null,
    );
    return () => store.set(workflowInspectionAtom, null);
  }, [store, workflowId, runId, block?.id, attemptIndex, evidence?.revision]);
  useCopilotReadable({
    description:
      'Exact run being verified in Build. This is historical evidence, not the editable draft. Use inspectWorkflowBlock to read the selected block and attempt. Its result is the evidence being inspected, which may differ from the current session. Do not rerun to explain this evidence.',
    value: evidence
      ? {
          workflowId,
          runId,
          version: evidence.version,
          revision: evidence.revision,
          steps: evidence.steps,
          selectedBlockId: block?.id,
          attemptRevision: attempt?.revision,
          status: step?.status,
        }
      : null,
  });
  const select = useCallback((id: string) => {
    setSelected(id);
    setAttemptIndex(null);
  }, []);
  const editDraft = () => {
    store.set(builderFocusTargetAtom, block ? { workflowId, blockId: block.id } : null);
    store.set(selectedWorkflowRunIdAtom, null);
  };
  if (!evidence || !block || !projection)
    return (
      <div className="p-5">
        <p role="alert">{inspected.error ?? 'This run has no blocks.'}</p>
        <button onClick={editDraft}>Edit current draft</button>
      </div>
    );
  const runLabel = (
    <>
      Version {evidence.version} · Run {evidence.runId}
      {evidence.revision !== undefined ? ` · revision ${evidence.revision}` : ''}
    </>
  );
  const actions = (
    <div className="flex flex-wrap gap-2">
      <button
        className="rounded border px-3 py-1"
        onClick={() => {
          store.set(selectedWorkflowRunIdAtom, runId);
          store.set(workflowTabAtom, 'run');
        }}
      >
        Return to this run
      </button>
      {evidence.kind === 'session' && (
        <button
          className="rounded border px-3 py-1"
          onClick={() => {
            showSessionInRun(store, { workflowId, runId });
            bindChatSession(store, { workflowId, runId });
            store.set(chatWorkflowIdsAtom, (ids) =>
              ids.includes(workflowId) ? ids : [...ids, workflowId],
            );
            store.set(chatPanelModeAtom, 'expanded');
          }}
        >
          Continue this run in Chat
        </button>
      )}
      <button className="rounded border px-3 py-1" onClick={editDraft}>
        Edit current draft
      </button>
    </div>
  );
  return (
    <section aria-label="Run verification in Build" className="flex h-full min-h-0 flex-col">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b bg-background px-4 py-3 text-xs">
        <div>
          <h2 className="font-semibold">{evidence.definition.name} · Recorded run</h2>
          <p className="mt-1 text-muted-foreground">{runLabel}</p>
        </div>
        {actions}
      </header>
      <RecordedWorkflowBuilder
        key={`${workflowId}:${runId}`}
        definition={projection.definition}
        record={projection.record}
        statuses={projection.statuses}
        selectedBlockId={block.id}
        onSelect={select}
        header={
          <div className="space-y-2 border-b bg-muted/20 px-4 py-3 text-xs">
            <p>{runLabel} · Read-only</p>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label>
                Inspect block{' '}
                <select
                  aria-label="Verify block"
                  className="rounded border bg-background p-1"
                  value={block.id}
                  onChange={(event) => select(event.target.value)}
                >
                  {evidence.definition.blocks.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </label>
              {actions}
            </div>
            <p>
              Recorded execution evidence. Inspecting a block does not run it or change the draft.
            </p>
            {projection.settingsUnavailable.includes(block.id) && (
              <p role="status">
                This attempt did not capture full block settings. Properties shows saved version{' '}
                {evidence.version}; the recorded inputs and outputs remain available below.
              </p>
            )}
          </div>
        }
        evidence={
          <WorkflowRunEvidence
            evidence={evidence}
            block={block}
            attemptIndex={attemptIndex}
            setAttemptIndex={setAttemptIndex}
            select={select}
          />
        }
      />
    </section>
  );
}
