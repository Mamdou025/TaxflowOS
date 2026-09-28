import { useEffect, useMemo, useState } from 'react';
import { useAtomValue, useStore } from 'jotai';
import { ReactFlow, Background, Controls } from '@xyflow/react';
import { useCopilotReadable } from '@copilotkit/react-core';
import { inspectWorkflowRun } from '@workspace/workflow-core/inspection';
import { workflowLibraryAtom } from './workflow-library';
import {
  activeSessionAtom,
  chatWorkflowIdsAtom,
  showSessionInRun,
  workflowInspectionAtom,
} from './workflow-session-store';
import { selectedWorkflowRunIdAtom, workflowTabAtom } from './workflows-store';
import { chatPanelModeAtom } from '@/shared/stores/chat-store';
import { builderFocusTargetAtom } from '@/shared/workflow-engine/state/workflow-store';
import { ReadableData } from '@/features/workflow-builder/ui/workspace/readable-data';
import { LazyDetails } from '@/features/workflow-builder/ui/workspace/lazy-details';
import '@xyflow/react/dist/style.css';

/** Build's evidence mode uses the selected version; it never mounts the mutable draft editor. */
export function WorkflowRunInspector({ workflowId, runId }: { workflowId: string; runId: string }) {
  const store = useStore();
  const library = useAtomValue(workflowLibraryAtom);
  const focus = useAtomValue(builderFocusTargetAtom);
  const [selected, setSelected] = useState('');
  const [attemptIndex, setAttemptIndex] = useState<number | null>(null);
  const inspected = useMemo(() => {
    try {
      if (!library[workflowId]) return { error: 'This workflow is unavailable.' };
      return { evidence: inspectWorkflowRun(library[workflowId], runId) };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Run evidence is unavailable.' };
    }
  }, [library, workflowId, runId]);
  const evidence = inspected.evidence;
  useEffect(() => {
    setSelected(focus?.workflowId === workflowId ? focus.blockId : '');
    setAttemptIndex(null);
  }, [workflowId, runId, focus?.workflowId, focus?.blockId]);
  useEffect(() => {
    store.set(activeSessionAtom, evidence?.kind === 'session' ? { workflowId, runId } : null);
  }, [store, workflowId, runId, evidence?.kind]);
  const block =
    evidence?.definition.blocks.find((item) => item.id === selected) ??
    evidence?.definition.blocks[0];
  const attempt = attemptIndex === null ? undefined : evidence?.attempts[attemptIndex];
  const result = attempt
    ? attempt.result.result.results.find((item) => item.blockId === block?.id)
    : block && evidence?.results[block.id];
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
  const editDraft = () => {
    store.set(builderFocusTargetAtom, null);
    store.set(selectedWorkflowRunIdAtom, null);
  };
  if (!evidence || !block)
    return (
      <div className="p-5">
        <p role="alert">{inspected.error ?? 'This run has no blocks.'}</p>
        <button onClick={editDraft}>Edit current draft</button>
      </div>
    );
  const select = (id: string) => {
    setSelected(id);
    setAttemptIndex(null);
  };
  return (
    <section
      aria-label="Run verification in Build"
      className="flex h-full flex-col gap-3 overflow-auto p-4"
    >
      <header className="space-y-2">
        <h2 className="font-semibold">Verify {evidence.definition.name}</h2>
        <p>
          Version {evidence.version} · Run {evidence.runId}
          {evidence.revision !== undefined ? ` · revision ${evidence.revision}` : ''}
        </p>
        <p className="text-sm">
          Recorded execution evidence. Inspecting a block does not run it or change the draft.
        </p>
        <div className="flex flex-wrap gap-3">
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
      </header>
      <div
        className="min-h-[240px] h-[32vh] shrink-0 rounded border"
        aria-label="Recorded workflow graph"
      >
        <ReactFlow
          nodes={evidence.definition.blocks.map((item) => ({
            id: item.id,
            position: item.position,
            selected: item.id === block.id,
            data: {
              label: `${item.label} · ${evidence.steps.find((s) => s.id === item.id)?.status ?? 'pending'}`,
            },
          }))}
          edges={evidence.definition.edges
            .filter((edge) => edge.status === 'active')
            .map((edge) => ({
              id: edge.id,
              source: edge.sourceBlockId,
              target: edge.targetBlockId,
            }))}
          nodesDraggable={false}
          nodesConnectable={false}
          deleteKeyCode={null}
          fitView
          onNodeClick={(_, node) => select(node.id)}
        >
          <Background />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
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
      <article aria-label="Block verification" className="space-y-3 rounded border p-4">
        <h3 className="font-semibold">
          {block.label} · {step?.status}
        </h3>
        <p className="text-xs">
          Block {block.id} · saved workflow version {evidence.version}
        </p>
        {step?.status === 'outdated' && (
          <p role="status">
            Previous result — source or upstream evidence changed. Rerun in Chat or Run before using
            it.
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <span>Received from:</span>
          {step?.dependencies.length ? (
            step.dependencies.map((id) => (
              <button key={id} className="underline" onClick={() => select(id)}>
                {evidence.definition.blocks.find((b) => b.id === id)?.label ?? id}
              </button>
            ))
          ) : (
            <span>No preceding blocks</span>
          )}
        </div>
        <label>
          Evidence attempt{' '}
          <select
            aria-label="Evidence attempt"
            className="rounded border bg-background p-1"
            value={attemptIndex ?? 'current'}
            onChange={(event) =>
              setAttemptIndex(event.target.value === 'current' ? null : Number(event.target.value))
            }
          >
            <option value="current">Current result</option>
            {evidence.attempts.map(
              (item, index) =>
                item.result.result.results.some((r) => r.blockId === block.id) && (
                  <option value={index} key={index}>
                    {item.at} · revision {item.revision}
                  </option>
                ),
            )}
          </select>
        </label>
        {attempt && (
          <p>
            Historical attempt · revision {attempt.revision}. Later source changes do not change
            these recorded inputs and outputs.
          </p>
        )}
        {result ? (
          <>
            <p>
              Status: {result.status} · execution {result.runId}
            </p>
            {[...result.errors, ...result.warnings].map((message, i) => (
              <p key={i} role="status">
                {message}
              </p>
            ))}
            <h4 className="font-medium">Recorded inputs</h4>
            <ReadableData value={result.input ?? {}} />
            <h4 className="font-medium">Recorded outputs</h4>
            <ReadableData value={result.output} />
            <h4 className="font-medium">Source provenance</h4>
            <ReadableData value={result.sourceTrace} />
          </>
        ) : (
          <p>This block has not run. No result has been substituted.</p>
        )}
        <LazyDetails summary="Saved rules and configuration">
          <ReadableData value={block.config} />
        </LazyDetails>
        <LazyDetails summary="Source revision history">
          <p className="text-sm">
            All attachments for this session. Historical attempts above retain the inputs actually
            used.
          </p>
          {evidence.sources.length ? (
            evidence.sources.map((source) => (
              <LazyDetails
                key={source.id}
                summary={`${source.name} · ${source.mode} · ${source.at}`}
              >
                <p>
                  Source {source.id} · block {source.blockId}
                </p>
                <ReadableData value={source.rows} />
              </LazyDetails>
            ))
          ) : (
            <p>
              No session attachments recorded. Inspect the recorded inputs and source provenance
              above.
            </p>
          )}
        </LazyDetails>
      </article>
    </section>
  );
}
