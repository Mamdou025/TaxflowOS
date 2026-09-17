import type { WorkflowLibrary } from '@workspace/workflow-contracts/library-types';

export type WorkflowRunSummary = {
  workflowId: string;
  workflowName: string;
  runId: string;
  version: number;
  at: string;
  status: string;
  initiatedBy?: {
    actorId: string;
    workspaceId: string;
    surface: 'builder' | 'run' | 'chat';
  };
};

/**
 * Read-only cross-workflow history. The workflow application remains the owner of
 * run identity and ordering; UI and Chat consumers receive a small projection.
 */
export function listWorkflowRuns(library: WorkflowLibrary): WorkflowRunSummary[] {
  return Object.values(library)
    .flatMap((entry) => [
      ...entry.runs.map((run) => ({
        workflowId: entry.id,
        workflowName: entry.draft.name,
        runId: run.result.record.execution.id,
        version: run.version,
        at: run.at,
        status: run.result.result.status,
        initiatedBy: run.initiatedBy ? { ...run.initiatedBy } : undefined,
      })),
      ...(entry.sessions ?? [])
        .filter(
          (session) => !entry.runs.some((run) => run.result.record.execution.id === session.id),
        )
        .map((session) => ({
          workflowId: entry.id,
          workflowName:
            entry.versions.find((version) => version.number === session.version)?.definition.name ??
            entry.draft.name,
          runId: session.id,
          version: session.version,
          at: session.createdAt,
          status: session.approvedAt ? 'approved' : session.paused ? 'paused' : 'in progress',
        })),
    ])
    .sort(
      (left, right) => right.at.localeCompare(left.at) || right.runId.localeCompare(left.runId),
    );
}
