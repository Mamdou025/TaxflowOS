import type { WorkflowDefinition } from '@workspace/workflow-contracts/domain/workflow-types';
import type { LocalToolRunnerResult } from '@workspace/workflow-contracts/execution-result';
import { LOCAL_TOOL_REGISTRY as DURABLE_TOOL_REGISTRY } from '@workspace/workflow-executors/tools/registry';
import { executeGraph } from '@workspace/workflow-core/graph';
import { getToolIdForBlock } from '@workspace/workflow-core/tool-resolution';

export function unsupportedDurableToolIds(definition: WorkflowDefinition): string[] {
  return [
    ...new Set(
      definition.blocks.map(getToolIdForBlock).filter((toolId) => !DURABLE_TOOL_REGISTRY[toolId]),
    ),
  ].sort();
}

export function executeDurableWorkflow(
  definition: WorkflowDefinition,
  runId: string,
): LocalToolRunnerResult {
  const unsupported = unsupportedDurableToolIds(definition);
  if (unsupported.length) {
    throw new Error(`The durable runtime does not support: ${unsupported.join(', ')}.`);
  }

  return executeGraph(
    { definition, mode: 'workflow' },
    {
      createId: () => runId,
      getTool: (toolId) => DURABLE_TOOL_REGISTRY[toolId] ?? null,
      resolveToolId: getToolIdForBlock,
    },
  );
}
