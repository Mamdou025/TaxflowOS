import { atom } from 'jotai';
import { toast } from 'sonner';
import {
  createBlankWorkflow,
  createPortfolioWorkflowById,
} from '@/shared/workflow-engine/workflow/templates/portfolio';
import {
  createWorkflowDefinitionFromCanvas,
  workflowDefinitionToCanvas,
} from '@/shared/workflow-engine/workflow/canvas';
import { type WorkflowDefinition } from '@/shared/workflow-engine/workflow/contracts';
import { getWorkflowConfig } from '@/shared/workflow-engine/runtime/workflow-runs';
import { type LocalToolRunnerResult } from '@/shared/workflow-engine/local-tool-runner';
import {
  currentWorkflowNameAtom,
  edgesAtom,
  executionLogsAtom,
  nodesAtom,
  selectedExecutionIdAtom,
  type WorkflowNode,
  type WorkflowEdge,
} from '@/shared/workflow-engine/state/workflow-store';
import { activeBuilderWorkflowIdAtom } from '@/lib/builder-bridge';
import { workflowLibraryAtom } from './workflow-library';
import { definitionFingerprint, executeSavedWorkflow } from './services/workflow-commands';
import {
  selectedWorkflowIdAtom,
  selectedWorkflowRunIdAtom,
  workflowSurfaceAtom,
} from './workflows-store';
import { workflowRunContext } from './services/workflow-context';
import { createWorkflow, replaceDraft } from '@workspace/workflow-core/commands';
import { activeSessionAtom } from './workflow-session-store';
import { startSession } from '@workspace/workflow-core/sessions';

export function templateDefinition(id: string): WorkflowDefinition | null {
  return (
    getWorkflowConfig(id.replace(/^pf-/, ''))?.buildSnapshot() ??
    createPortfolioWorkflowById(id) ??
    null
  );
}

// Project a recorded execution onto the existing canvas; never alter its graph or configuration.
export function executionCanvas(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
  run?: LocalToolRunnerResult,
) {
  return {
    nodes: nodes.map((node) => ({
      ...node,
      data: { ...node.data, status: run?.blockStatuses[node.id] ?? ('idle' as const) },
    })),
    edges: edges.map((edge) => ({
      ...edge,
      data: {
        ...edge.data,
        runStatus: run?.edgeStatuses[edge.id] ?? ('idle' as const),
        runStatusRunId: run?.record.execution.id,
      },
    })),
  };
}

export function executionLogs(run?: LocalToolRunnerResult) {
  return Object.fromEntries(
    (run?.record.logs ?? []).map((log) => [
      log.nodeId,
      {
        nodeId: log.nodeId,
        nodeName: log.nodeName,
        nodeType: log.nodeType,
        status: log.status,
        output: log.output,
      },
    ]),
  );
}

// Both views use the Run tab's existing versioning and graph runner.
export const runWorkflowAtom = atom(
  null,
  (
    get,
    set,
    options: { id: string; fromBuild?: boolean; saveDraft?: boolean; version?: number | null },
  ) => {
    try {
      const entry = get(workflowLibraryAtom)[options.id];
      let definition = entry?.draft ?? templateDefinition(options.id);
      if (options.fromBuild) {
        const canvasDraft = createWorkflowDefinitionFromCanvas({
          nodes: get(nodesAtom),
          edges: get(edgesAtom),
          name: get(currentWorkflowNameAtom),
          existing: definition ?? createBlankWorkflow(),
        });
        const baseline =
          definition &&
          createWorkflowDefinitionFromCanvas({
            ...workflowDefinitionToCanvas(definition),
            name: definition.name,
            existing: definition,
          });
        // Preserve the exact saved/template definition when Build has no new edits.
        if (!baseline || definitionFingerprint(canvasDraft) !== definitionFingerprint(baseline)) {
          definition = { ...canvasDraft, id: entry?.id ?? canvasDraft.id };
        }
      }
      if (!definition) return;
      const nextId = entry?.id ?? `custom:${crypto.randomUUID()}`;
      const base = entry
        ? replaceDraft(entry, definition)
        : createWorkflow(nextId, options.id, {
            ...definition,
            name: `${definition.name} — My workflow`,
          });
      const executed = executeSavedWorkflow(
        base,
        {
          saveDraft: options.saveDraft,
          version: options.saveDraft === false ? options.version : undefined,
          requestId: crypto.randomUUID(),
        },
        undefined,
        workflowRunContext(options.fromBuild ? 'builder' : 'run'),
      );
      const { result } = executed;
      const sessionId = result.record.execution.id;
      const withSession = startSession(
        executed.entry,
        executed.version,
        sessionId,
        result.result.startedAt,
      );
      const session = withSession.sessions!.at(-1)!;
      session.results = Object.fromEntries(
        result.result.results.map((item) => [item.blockId, structuredClone(item)]),
      );
      if (result.result.results.length)
        session.attempts = [
          {
            at: result.result.completedAt,
            revision: 0,
            blockId: result.result.results.at(-1)!.blockId,
            result: structuredClone(result),
          },
        ];
      executed.entry = withSession;
      set(activeSessionAtom, { workflowId: nextId, runId: sessionId });
      const version = { number: executed.version };
      set(workflowLibraryAtom, (previous) => ({ ...previous, [nextId]: executed.entry }));
      if (options.fromBuild || get(activeBuilderWorkflowIdAtom) === nextId) {
        const canvas = executionCanvas(get(nodesAtom), get(edgesAtom), result);
        set(nodesAtom, canvas.nodes);
        set(edgesAtom, canvas.edges);
        set(selectedExecutionIdAtom, result.record.execution.id);
        set(executionLogsAtom, executionLogs(result));
      }
      set(selectedWorkflowIdAtom, nextId);
      set(selectedWorkflowRunIdAtom, result.record.execution.id);
      set(workflowSurfaceAtom, 'workflow');
      if (result.result.status === 'error')
        toast.error(`Version ${version.number} failed. Review the execution errors.`);
      else if (result.result.status === 'warning')
        toast.warning(`Version ${version.number} calculated with review findings.`);
      else
        toast.success(`Version ${version.number} executed. Review block results in Build or Run.`);
      return version.number;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Run failed');
    }
    return undefined;
  },
);
