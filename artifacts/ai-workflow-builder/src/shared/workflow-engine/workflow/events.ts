import { SYSTEM_USER, type WorkflowEvent, type WorkflowDefinition } from './contracts';

export function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function createWorkflowEvent({
  createdAt = new Date().toISOString(),
  createdBy = SYSTEM_USER,
  details,
  message,
  type,
}: Omit<WorkflowEvent, 'createdAt' | 'createdBy' | 'id'> &
  Partial<Pick<WorkflowEvent, 'createdAt' | 'createdBy'>>): WorkflowEvent {
  return {
    id: `event-${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    message,
    createdAt,
    createdBy,
    details,
  };
}

export function appendWorkflowEvent(
  definition: WorkflowDefinition,
  event?: WorkflowEvent,
): WorkflowEvent[] {
  if (!event) {
    return definition.events || [];
  }
  return [event, ...(definition.events || [])].slice(0, 50);
}
