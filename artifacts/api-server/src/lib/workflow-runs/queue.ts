import { and, db, desc, eq, pool, sql, workflowRunJobs, type WorkflowRunJob } from '@workspace/db';
import type { WorkflowDefinition } from '@workspace/workflow-contracts/domain/workflow-types';
import type { LocalToolRunnerResult } from '@workspace/workflow-contracts/execution-result';
import { backoffMs } from '../retry';

export type ClaimedWorkflowRun = Pick<
  WorkflowRunJob,
  'id' | 'workspaceId' | 'definition' | 'attempts' | 'maxAttempts'
>;

export class WorkflowRunRequestConflict extends Error {}

export async function enqueueWorkflowRun(input: {
  workspaceId: string;
  workflowId: string;
  workflowVersion: number;
  definition: WorkflowDefinition;
  requestedBy: string;
  requestId: string;
}): Promise<{ job: WorkflowRunJob; replayed: boolean }> {
  const [created] = await db
    .insert(workflowRunJobs)
    .values(input)
    .onConflictDoNothing({
      target: [workflowRunJobs.workspaceId, workflowRunJobs.requestId],
    })
    .returning();
  if (created) return { job: created, replayed: false };

  const [existing] = await db
    .select()
    .from(workflowRunJobs)
    .where(
      and(
        eq(workflowRunJobs.workspaceId, input.workspaceId),
        eq(workflowRunJobs.requestId, input.requestId),
      ),
    )
    .limit(1);
  if (!existing) throw new Error('The idempotent workflow run could not be read.');
  if (
    existing.workflowId !== input.workflowId ||
    existing.workflowVersion !== input.workflowVersion
  ) {
    throw new WorkflowRunRequestConflict(
      'This request ID was already used for a different workflow version.',
    );
  }
  return { job: existing, replayed: true };
}

export async function claimNextWorkflowRun(): Promise<ClaimedWorkflowRun | null> {
  const result = await db.execute(sql`
    UPDATE workflow_run_jobs SET
      status = 'running',
      claimed_at = now(),
      started_at = COALESCE(started_at, now()),
      attempts = attempts + 1,
      updated_at = now()
    WHERE id = (
      SELECT id FROM workflow_run_jobs
      WHERE status = 'pending' AND run_after <= now() AND cancel_requested_at IS NULL
      ORDER BY run_after ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    )
    RETURNING id, workspace_id AS "workspaceId", definition,
      attempts, max_attempts AS "maxAttempts";
  `);
  return (result as unknown as { rows?: ClaimedWorkflowRun[] }).rows?.[0] ?? null;
}

export async function completeWorkflowRun(
  id: string,
  result: LocalToolRunnerResult,
): Promise<void> {
  const cancelled = await pool.query(
    `UPDATE workflow_run_jobs SET
      status=CASE WHEN cancel_requested_at IS NULL THEN $2 ELSE 'cancelled' END,
      result=CASE WHEN cancel_requested_at IS NULL THEN $3::jsonb ELSE NULL END,
      error=NULL, claimed_at=NULL, completed_at=now(), updated_at=now()
    WHERE id=$1`,
    [id, result.result.status === 'error' ? 'error' : 'success', JSON.stringify(result)],
  );
  if (!cancelled.rowCount) throw new Error('The workflow run disappeared before completion.');
}

export async function requeueWorkflowRun(
  id: string,
  attempt: number,
  error: string,
): Promise<void> {
  await db
    .update(workflowRunJobs)
    .set({
      status: 'pending',
      claimedAt: null,
      runAfter: new Date(Date.now() + backoffMs(attempt)),
      error: error.slice(0, 2000),
      updatedAt: new Date(),
    })
    .where(eq(workflowRunJobs.id, id));
}

export async function failWorkflowRun(id: string, error: string): Promise<void> {
  await db
    .update(workflowRunJobs)
    .set({
      status: 'error',
      claimedAt: null,
      completedAt: new Date(),
      error: error.slice(0, 2000),
      updatedAt: new Date(),
    })
    .where(eq(workflowRunJobs.id, id));
}

export async function requestWorkflowRunCancellation(
  workspaceId: string,
  id: string,
): Promise<WorkflowRunJob | null> {
  const result = await pool.query<WorkflowRunJob>(
    `UPDATE workflow_run_jobs SET
      cancel_requested_at=COALESCE(cancel_requested_at, now()),
      status=CASE WHEN status='pending' THEN 'cancelled' ELSE status END,
      completed_at=CASE WHEN status='pending' THEN now() ELSE completed_at END,
      updated_at=now()
    WHERE workspace_id=$1 AND id=$2
    RETURNING id, workspace_id AS "workspaceId", workflow_id AS "workflowId",
      workflow_version AS "workflowVersion", definition, requested_by AS "requestedBy",
      request_id AS "requestId", status, attempts, max_attempts AS "maxAttempts",
      run_after AS "runAfter", claimed_at AS "claimedAt",
      cancel_requested_at AS "cancelRequestedAt", started_at AS "startedAt",
      completed_at AS "completedAt", result, error, created_at AS "createdAt",
      updated_at AS "updatedAt"`,
    [workspaceId, id],
  );
  return result.rows[0] ?? null;
}

export async function getWorkflowRun(
  workspaceId: string,
  id: string,
): Promise<WorkflowRunJob | null> {
  const [job] = await db
    .select()
    .from(workflowRunJobs)
    .where(and(eq(workflowRunJobs.workspaceId, workspaceId), eq(workflowRunJobs.id, id)))
    .limit(1);
  return job ?? null;
}

export async function listWorkflowRuns(
  workspaceId: string,
  workflowId?: string,
): Promise<WorkflowRunJob[]> {
  return db
    .select()
    .from(workflowRunJobs)
    .where(
      workflowId
        ? and(
            eq(workflowRunJobs.workspaceId, workspaceId),
            eq(workflowRunJobs.workflowId, workflowId),
          )
        : eq(workflowRunJobs.workspaceId, workspaceId),
    )
    .orderBy(desc(workflowRunJobs.createdAt))
    .limit(100);
}

export async function reapStalledWorkflowRuns(stallMs: number): Promise<number> {
  const cutoff = new Date(Date.now() - stallMs);
  const result = await db.execute(sql`
    UPDATE workflow_run_jobs SET
      status = CASE
        WHEN cancel_requested_at IS NOT NULL THEN 'cancelled'
        WHEN attempts < max_attempts THEN 'pending'
        ELSE 'error'
      END,
      run_after = CASE WHEN attempts < max_attempts THEN now() ELSE run_after END,
      error = CASE WHEN attempts >= max_attempts
        THEN 'Execution stalled after the worker stopped and retries were exhausted'
        ELSE error END,
      claimed_at = NULL,
      completed_at = CASE WHEN cancel_requested_at IS NOT NULL OR attempts >= max_attempts
        THEN now() ELSE completed_at END,
      updated_at = now()
    WHERE status = 'running' AND claimed_at < ${cutoff}
    RETURNING id;
  `);
  return (result as unknown as { rows?: unknown[] }).rows?.length ?? 0;
}
