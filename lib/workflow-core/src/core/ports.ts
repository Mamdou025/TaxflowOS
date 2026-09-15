import type {
  WorkflowBlock,
  WorkflowDefinition,
} from '@workspace/workflow-contracts/domain/workflow-types';
import type { ToolDefinition, ToolRunResult } from '@workspace/workflow-contracts/tool-types';
import type { LocalToolRunnerResult } from '@workspace/workflow-contracts/execution-result';

export type DefinitionExecutor = (definition: WorkflowDefinition) => LocalToolRunnerResult;
export type LocalToolRunMode = 'downstream' | 'selected' | 'workflow' | 'isolated';
export type IsolatedBlockInput = { block: WorkflowBlock; result: ToolRunResult };
export type GraphRequest = {
  definition: WorkflowDefinition;
  mode?: LocalToolRunMode;
  selectedBlockId?: string | null;
  isolatedInputs?: IsolatedBlockInput[];
  testInputSource?: 'examples' | 'recorded' | 'none';
  /** Original editable settings when a legacy adapter expands defaults. */
  configSignatures?: Record<string, string>;
};
export type GraphRuntime = {
  resolveToolId: (block: WorkflowBlock) => string;
  getTool: (toolId: string) => ToolDefinition | null;
  createId: (prefix: string) => string;
  now?: () => Date;
};
