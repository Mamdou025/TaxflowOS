import type { WorkflowDefinition } from './domain/workflow-types';
import type { LocalToolRunnerResult } from './execution-result';
import type { ToolRunResult } from './tool-types';
import type { DocumentExtraction } from './domain/document-extraction';
import type { DocumentReview } from './domain/document-review';
export type WorkflowSession = {
  id: string;
  version: number;
  revision: number;
  createdAt: string;
  paused: boolean;
  approvedAt?: string;
  results: Record<string, ToolRunResult>;
  stale: string[];
  reviewed: string[];
  documentReviews?: DocumentReview[];
  sources: {
    id: string;
    blockId: string;
    name: string;
    at: string;
    mode: 'add' | 'replace';
    rows: Record<string, unknown>[];
    extraction?: DocumentExtraction;
  }[];
  attempts: { at: string; revision: number; blockId: string; result: LocalToolRunnerResult }[];
};
export type PersonalWorkflow = {
  id: string;
  templateId: string;
  draft: WorkflowDefinition;
  versions: { number: number; savedAt: string; definition: WorkflowDefinition }[];
  sessions?: WorkflowSession[];
  runs: {
    documentReviews?: DocumentReview[];
    version: number;
    at: string;
    result: LocalToolRunnerResult;
    requestId?: string;
    initiatedBy?: { actorId: string; workspaceId: string; surface: 'builder' | 'run' | 'chat' };
  }[];
};
export type WorkflowLibrary = Record<string, PersonalWorkflow>;
