import {
  CreateWorkflowRunResponseSchema,
  WorkflowRunErrorSchema,
  WorkflowRunListSchema,
  WorkflowRunSchema,
  WORKFLOW_RUNS_PATH,
  workflowRunActionPath,
  workflowRunPath,
  type WorkflowRun,
} from '@workspace/api-zod/workflow-runs';
import { apiFetch } from './auth/api-fetch';

async function request(path: string, init?: RequestInit): Promise<unknown> {
  const response = await apiFetch(path, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  const body: unknown = await response.json();
  if (!response.ok) {
    const parsed = WorkflowRunErrorSchema.safeParse(body);
    throw new WorkflowRunApiError(
      response.status,
      parsed.success ? parsed.data.error : 'The durable workflow request failed.',
      parsed.success ? parsed.data.unsupportedToolIds : undefined,
    );
  }
  return body;
}

export class WorkflowRunApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly unsupportedToolIds?: string[],
  ) {
    super(message);
    this.name = 'WorkflowRunApiError';
  }
}

export async function createDurableWorkflowRun(
  workflowId: string,
  version: number,
  requestId = crypto.randomUUID(),
): Promise<WorkflowRun> {
  const body = await request(WORKFLOW_RUNS_PATH, {
    method: 'POST',
    body: JSON.stringify({ workflowId, version, requestId }),
  });
  return CreateWorkflowRunResponseSchema.parse(body).run;
}

export async function getDurableWorkflowRun(runId: string): Promise<WorkflowRun> {
  return WorkflowRunSchema.parse(await request(workflowRunPath(runId)));
}

export async function listDurableWorkflowRuns(workflowId?: string): Promise<WorkflowRun[]> {
  const query = workflowId ? `?workflowId=${encodeURIComponent(workflowId)}` : '';
  return WorkflowRunListSchema.parse(await request(`${WORKFLOW_RUNS_PATH}${query}`)).runs;
}

export async function cancelDurableWorkflowRun(runId: string): Promise<WorkflowRun> {
  return WorkflowRunSchema.parse(
    await request(workflowRunActionPath(runId, 'cancel'), { method: 'POST', body: '{}' }),
  );
}

export async function retryDurableWorkflowRun(runId: string): Promise<WorkflowRun> {
  const body = await request(workflowRunActionPath(runId, 'retry'), {
    method: 'POST',
    body: JSON.stringify({ requestId: crypto.randomUUID() }),
  });
  return CreateWorkflowRunResponseSchema.parse(body).run;
}
