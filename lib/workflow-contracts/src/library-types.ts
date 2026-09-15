import type { WorkflowDefinition } from './domain/workflow-types';
import type { LocalToolRunnerResult } from './execution-result';
export type PersonalWorkflow = {
  id: string;
  templateId: string;
  draft: WorkflowDefinition;
  versions: { number: number; savedAt: string; definition: WorkflowDefinition }[];
  runs: {
    version: number;
    at: string;
    result: LocalToolRunnerResult;
    requestId?: string;
    initiatedBy?: { actorId: string; workspaceId: string; surface: 'builder' | 'run' | 'chat' };
  }[];
};
export type WorkflowLibrary = Record<string, PersonalWorkflow>;
