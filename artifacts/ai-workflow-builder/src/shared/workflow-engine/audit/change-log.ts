import type { WorkflowAuditEvent } from "./workflow-events";

const CHANGE_LOG_STORAGE_KEY = "workflow-studio.change-log.v1";
const MAX_STORED_EVENTS = 500;

let memoryChangeLog: WorkflowAuditEvent[] = [];

function canUseLocalStorage() {
  return typeof window !== "undefined" && Boolean(window.localStorage);
}

function readStoredEvents(): WorkflowAuditEvent[] {
  if (!canUseLocalStorage()) {
    return memoryChangeLog;
  }

  try {
    const stored = window.localStorage.getItem(CHANGE_LOG_STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeStoredEvents(events: WorkflowAuditEvent[]) {
  const cappedEvents = events
    .slice()
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, MAX_STORED_EVENTS);

  memoryChangeLog = cappedEvents;

  if (!canUseLocalStorage()) {
    return;
  }

  try {
    window.localStorage.setItem(
      CHANGE_LOG_STORAGE_KEY,
      JSON.stringify(cappedEvents)
    );
  } catch {
    // The audit log is intentionally best-effort for v1 and must not block UI progress.
  }
}

export function getWorkflowChangeLogStorageKey() {
  return CHANGE_LOG_STORAGE_KEY;
}

export function readWorkflowChangeLog(workflowId?: string | null) {
  const events = readStoredEvents();
  return workflowId
    ? events.filter((event) => event.workflowId === workflowId)
    : events;
}

export function appendWorkflowChangeEvent(event: WorkflowAuditEvent) {
  writeStoredEvents([event, ...readStoredEvents()]);
}

export function appendWorkflowChangeEvents(events: WorkflowAuditEvent[]) {
  if (events.length === 0) {
    return;
  }
  writeStoredEvents([...events, ...readStoredEvents()]);
}

export function clearWorkflowChangeLog(workflowId?: string | null) {
  if (!workflowId) {
    writeStoredEvents([]);
    return;
  }

  writeStoredEvents(
    readStoredEvents().filter((event) => event.workflowId !== workflowId)
  );
}
