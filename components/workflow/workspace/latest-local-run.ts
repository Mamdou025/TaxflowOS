import {
  LOCAL_WORKFLOW_ID,
  type LocalRunRecord,
} from "@/lib/local-fiscal-workflow";
import type { ExecutionLogEntry } from "@/lib/workflow-store";

function createRunRecordFromExecutionLogs({
  executionId,
  executionLogs,
  workflowId,
}: {
  executionId: string | null;
  executionLogs: Record<string, ExecutionLogEntry>;
  workflowId?: string | null;
}): LocalRunRecord | undefined {
  const entries = Object.values(executionLogs);
  if (!(executionId && entries.length > 0)) {
    return;
  }

  const now = new Date();
  const hasRunningStep = entries.some(
    (entry) => entry.status === "pending" || entry.status === "running"
  );
  const hasError = entries.some((entry) => entry.status === "error");
  let executionStatus: LocalRunRecord["execution"]["status"] = "success";
  if (hasError) {
    executionStatus = "error";
  } else if (hasRunningStep) {
    executionStatus = "running";
  }

  return {
    execution: {
      completedAt: hasRunningStep ? null : now,
      duration: null,
      error: hasError ? "One or more local workflow steps failed." : null,
      id: executionId,
      startedAt: now,
      status: executionStatus,
      workflowId: workflowId || LOCAL_WORKFLOW_ID,
    },
    logs: entries.map((entry, index) => ({
      completedAt: entry.status === "running" ? null : now,
      duration: null,
      error: entry.status === "error" ? "Local step failed." : null,
      executionId,
      id: `${executionId}-${entry.nodeId}-${index}`,
      input: undefined,
      nodeId: entry.nodeId,
      nodeName: entry.nodeName,
      nodeType: entry.nodeType,
      output: entry.output,
      startedAt: now,
      status: entry.status,
    })),
  };
}

export function getLatestLocalRunForBlock({
  blockId,
  executionLogs,
  selectedExecutionId,
  storedRecords,
  workflowId,
}: {
  blockId: string;
  executionLogs: Record<string, ExecutionLogEntry>;
  selectedExecutionId: string | null;
  storedRecords: LocalRunRecord[];
  workflowId?: string | null;
}) {
  const inMemoryRecord = createRunRecordFromExecutionLogs({
    executionId: selectedExecutionId,
    executionLogs,
    workflowId,
  });

  if (inMemoryRecord?.logs.some((log) => log.nodeId === blockId)) {
    return inMemoryRecord;
  }

  const selectedStoredRecord = selectedExecutionId
    ? storedRecords.find(
        (record) =>
          record.execution.id === selectedExecutionId &&
          record.logs.some((log) => log.nodeId === blockId)
      )
    : undefined;

  return (
    selectedStoredRecord ||
    storedRecords.find((record) =>
      record.logs.some((log) => log.nodeId === blockId)
    )
  );
}
