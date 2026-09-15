import type { LocalRunRecord } from './domain/workflow-types';
import type { WorkflowRunResult } from './tool-types';
export type LocalEdgeRunStatus = 'error' | 'success' | 'warning';
export type LocalToolRunnerResult = {
  blockStatuses: Record<string, 'error' | 'success'>;
  edgeStatuses: Record<string, LocalEdgeRunStatus>;
  record: LocalRunRecord;
  result: WorkflowRunResult;
};
