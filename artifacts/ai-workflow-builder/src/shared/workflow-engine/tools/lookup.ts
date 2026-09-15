import type { WorkflowBlock } from '@workspace/workflow-contracts/domain/workflow-types';
import { getToolIdForBlock } from '@workspace/workflow-core/tool-resolution';
import type { ToolDefinition } from './types';
import { LOCAL_TOOL_REGISTRY } from './registry';
export function getToolForBlock(block: WorkflowBlock): ToolDefinition | null {
  return LOCAL_TOOL_REGISTRY[getToolIdForBlock(block)] ?? null;
}
