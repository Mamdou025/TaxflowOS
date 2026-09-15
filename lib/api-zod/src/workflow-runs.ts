import { z } from 'zod';

export const WORKFLOW_RUNS_PATH = '/api/workflow-runs';

export const SavedWorkflowIdSchema = z.string().startsWith('custom:').max(160);
export const WorkflowRunIdSchema = z.string().regex(/^[A-Za-z0-9][A-Za-z0-9_-]{0,79}$/);

export const WorkflowRunStatusSchema = z.enum([
  'pending',
  'running',
  'success',
  'error',
  'cancelled',
]);

export const CreateWorkflowRunRequestSchema = z
  .object({
    workflowId: SavedWorkflowIdSchema,
    version: z.number().int().positive(),
    requestId: z.string().uuid(),
  })
  .strict();

export const RetryWorkflowRunRequestSchema = z.object({ requestId: z.string().uuid() }).strict();

export const WorkflowRunListQuerySchema = z
  .object({ workflowId: SavedWorkflowIdSchema.optional() })
  .strict();

export const WorkflowRunErrorSchema = z
  .object({
    error: z.string().min(1),
    unsupportedToolIds: z.array(z.string().min(1)).optional(),
  })
  .strict();

const NullableDateSchema = z.string().datetime().nullable();

export const WorkflowRunSchema = z
  .object({
    id: WorkflowRunIdSchema,
    workflowId: SavedWorkflowIdSchema,
    workflowVersion: z.number().int().positive(),
    requestedBy: z.string().min(1),
    requestId: z.string().uuid(),
    status: WorkflowRunStatusSchema,
    attempts: z.number().int().nonnegative(),
    maxAttempts: z.number().int().positive(),
    result: z.unknown().nullable(),
    error: z.string().nullable(),
    cancelRequestedAt: NullableDateSchema,
    startedAt: NullableDateSchema,
    completedAt: NullableDateSchema,
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
  .strict();

export const CreateWorkflowRunResponseSchema = z
  .object({
    replayed: z.boolean(),
    run: WorkflowRunSchema,
  })
  .strict();

export const WorkflowRunListSchema = z.object({ runs: z.array(WorkflowRunSchema) }).strict();

export function workflowRunPath(runId: string): string {
  return `${WORKFLOW_RUNS_PATH}/${WorkflowRunIdSchema.parse(runId)}`;
}

export function workflowRunActionPath(runId: string, action: 'cancel' | 'retry'): string {
  return `${workflowRunPath(runId)}/${action}`;
}

export type CreateWorkflowRunRequest = z.infer<typeof CreateWorkflowRunRequestSchema>;
export type WorkflowRun = z.infer<typeof WorkflowRunSchema>;
export type WorkflowRunError = z.infer<typeof WorkflowRunErrorSchema>;
