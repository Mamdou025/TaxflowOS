/** Application receipt for an explicit workflow selection, never an instruction to execute. */
export type WorkflowInteraction = {
  id: string;
  afterMessageId?: string | null;
  kind: 'template' | 'saved-version' | 'draft' | 'resume';
  status: 'opened' | 'failed';
  name: string;
  requestedWorkflowId: string;
  workflowId: string;
  version?: number;
  runId?: string;
  message: string;
  occurredAt: string;
};

const text = (value: unknown, limit = 1000): value is string =>
  typeof value === 'string' && value.trim().length > 0 && value.length <= limit;

/** Validate restored metadata; malformed identity must never become another selection. */
export function parseWorkflowInteraction(value: unknown): WorkflowInteraction | null {
  if (value == null) return null;
  if (typeof value !== 'object' || Array.isArray(value))
    throw new Error('The saved workflow selection could not be read.');
  const item = value as Record<string, unknown>;
  if (
    !text(item.id, 200) ||
    typeof item.kind !== 'string' ||
    !['template', 'saved-version', 'draft', 'resume'].includes(item.kind) ||
    typeof item.status !== 'string' ||
    !['opened', 'failed'].includes(item.status) ||
    !text(item.name) ||
    !text(item.requestedWorkflowId, 200) ||
    !text(item.workflowId, 200) ||
    !text(item.message, 4000) ||
    !text(item.occurredAt, 100) ||
    !Number.isFinite(Date.parse(item.occurredAt)) ||
    (item.afterMessageId != null && !text(item.afterMessageId, 512)) ||
    (item.version !== undefined &&
      (typeof item.version !== 'number' || !Number.isInteger(item.version) || item.version < 1)) ||
    (item.runId !== undefined && !text(item.runId, 200)) ||
    (item.status === 'opened' &&
      item.kind !== 'draft' &&
      (item.version === undefined || item.runId === undefined)) ||
    (item.kind === 'draft' && (item.version !== undefined || item.runId !== undefined))
  )
    throw new Error('The saved workflow selection has an invalid identity or state.');
  return {
    id: item.id,
    kind: item.kind as WorkflowInteraction['kind'],
    status: item.status as WorkflowInteraction['status'],
    name: item.name,
    requestedWorkflowId: item.requestedWorkflowId,
    workflowId: item.workflowId,
    message: item.message,
    occurredAt: item.occurredAt,
    ...(item.afterMessageId !== undefined
      ? { afterMessageId: item.afterMessageId as string | null }
      : {}),
    ...(item.version !== undefined ? { version: item.version as number } : {}),
    ...(item.runId !== undefined ? { runId: item.runId as string } : {}),
  };
}
