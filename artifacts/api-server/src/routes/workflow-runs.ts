import { Router } from 'express';
import { pool, type WorkflowRunJob } from '@workspace/db';
import {
  CreateWorkflowRunRequestSchema,
  CreateWorkflowRunResponseSchema,
  RetryWorkflowRunRequestSchema,
  WorkflowRunErrorSchema,
  WorkflowRunIdSchema,
  WorkflowRunListQuerySchema,
  WorkflowRunListSchema,
  WorkflowRunSchema,
} from '@workspace/api-zod/workflow-runs';
import { decodeBackup } from '../storage/validate-backup';
import { unsupportedDurableToolIds } from '../lib/workflow-runs/executor';
import {
  enqueueWorkflowRun,
  getWorkflowRun,
  listWorkflowRuns,
  requestWorkflowRunCancellation,
  WorkflowRunRequestConflict,
} from '../lib/workflow-runs/queue';

const router = Router();

function errorBody(error: string, unsupportedToolIds?: string[]) {
  return WorkflowRunErrorSchema.parse({ error, unsupportedToolIds });
}

function publicRun(job: WorkflowRunJob) {
  return WorkflowRunSchema.parse({
    id: job.id,
    workflowId: job.workflowId,
    workflowVersion: job.workflowVersion,
    requestedBy: job.requestedBy,
    requestId: job.requestId,
    status: job.status,
    attempts: job.attempts,
    maxAttempts: job.maxAttempts,
    result: job.result ?? null,
    error: job.error ?? null,
    cancelRequestedAt: job.cancelRequestedAt?.toISOString() ?? null,
    startedAt: job.startedAt?.toISOString() ?? null,
    completedAt: job.completedAt?.toISOString() ?? null,
    createdAt: job.createdAt.toISOString(),
    updatedAt: job.updatedAt.toISOString(),
  });
}

router.post('/', async (req, res) => {
  const parsed = CreateWorkflowRunRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(errorBody('Supply a workflow ID, saved version, and unique request ID.'));
    return;
  }
  const { rows } = await pool.query<{ payload: string }>(
    'SELECT payload FROM workspace_libraries WHERE workspace_id=$1',
    [req.workspaceId],
  );
  if (!rows[0]) {
    res.status(404).json(errorBody('This workspace has no saved workflow library.'));
    return;
  }

  const library = decodeBackup(rows[0].payload);
  const workflow = library[parsed.data.workflowId];
  const saved = workflow?.versions.find((item) => item.number === parsed.data.version);
  if (!workflow || !saved) {
    res.status(404).json(errorBody('The requested saved workflow version does not exist.'));
    return;
  }
  const unsupportedToolIds = unsupportedDurableToolIds(saved.definition);
  if (unsupportedToolIds.length) {
    res
      .status(422)
      .json(
        errorBody(
          'This saved version uses tools that are not available in the durable runtime.',
          unsupportedToolIds,
        ),
      );
    return;
  }

  try {
    const queued = await enqueueWorkflowRun({
      workspaceId: req.workspaceId,
      workflowId: parsed.data.workflowId,
      workflowVersion: parsed.data.version,
      definition: saved.definition,
      requestedBy: req.userId,
      requestId: parsed.data.requestId,
    });
    const body = CreateWorkflowRunResponseSchema.parse({
      replayed: queued.replayed,
      run: publicRun(queued.job),
    });
    res.status(queued.replayed ? 200 : 202).json(body);
  } catch (error) {
    if (error instanceof WorkflowRunRequestConflict) {
      res.status(409).json(errorBody(error.message));
      return;
    }
    throw error;
  }
});

router.get('/', async (req, res) => {
  const parsed = WorkflowRunListQuerySchema.safeParse({ workflowId: req.query.workflowId });
  if (!parsed.success) {
    res.status(400).json(errorBody('The workflow filter is invalid.'));
    return;
  }
  const jobs = await listWorkflowRuns(req.workspaceId, parsed.data.workflowId);
  res
    .set('Cache-Control', 'no-store')
    .json(WorkflowRunListSchema.parse({ runs: jobs.map(publicRun) }));
});

router.get('/:runId', async (req, res) => {
  const runId = WorkflowRunIdSchema.safeParse(req.params.runId);
  if (!runId.success) {
    res.status(400).json(errorBody('The workflow run ID is invalid.'));
    return;
  }
  const job = await getWorkflowRun(req.workspaceId, runId.data);
  if (!job) {
    res.status(404).json(errorBody('Workflow run not found.'));
    return;
  }
  res.set('Cache-Control', 'no-store').json(publicRun(job));
});

router.post('/:runId/cancel', async (req, res) => {
  const runId = WorkflowRunIdSchema.safeParse(req.params.runId);
  if (!runId.success) {
    res.status(400).json(errorBody('The workflow run ID is invalid.'));
    return;
  }
  const job = await requestWorkflowRunCancellation(req.workspaceId, runId.data);
  if (!job) {
    res.status(404).json(errorBody('Workflow run not found.'));
    return;
  }
  res.json(publicRun(job));
});

router.post('/:runId/retry', async (req, res) => {
  const runId = WorkflowRunIdSchema.safeParse(req.params.runId);
  if (!runId.success) {
    res.status(400).json(errorBody('The workflow run ID is invalid.'));
    return;
  }
  const parsed = RetryWorkflowRunRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json(errorBody('Supply a unique request ID for the retry.'));
    return;
  }
  const original = await getWorkflowRun(req.workspaceId, runId.data);
  if (!original) {
    res.status(404).json(errorBody('Workflow run not found.'));
    return;
  }
  if (!['cancelled', 'error'].includes(original.status)) {
    res.status(409).json(errorBody('Only cancelled or failed workflow runs can be retried.'));
    return;
  }
  try {
    const queued = await enqueueWorkflowRun({
      workspaceId: req.workspaceId,
      workflowId: original.workflowId,
      workflowVersion: original.workflowVersion,
      definition: original.definition,
      requestedBy: req.userId,
      requestId: parsed.data.requestId,
    });
    res.status(queued.replayed ? 200 : 202).json(
      CreateWorkflowRunResponseSchema.parse({
        replayed: queued.replayed,
        run: publicRun(queued.job),
      }),
    );
  } catch (error) {
    if (error instanceof WorkflowRunRequestConflict) {
      res.status(409).json(errorBody(error.message));
      return;
    }
    throw error;
  }
});

export default router;
