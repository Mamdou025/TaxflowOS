// Compatibility adapter: input validation and workflow operations belong to Workflows.
import { executeWorkflowCommand as execute } from '@workspace/workflow-core/template-command';
import { getWorkflowConfig } from '@/shared/workflow-engine/runtime/workflow-runs';
import { executeWorkflowDefinition } from '@/shared/workflow-engine/workflow/execute';
export function executeWorkflowCommand(
  args: Parameters<typeof execute>[0],
  cachedRows?: Parameters<typeof execute>[1],
) {
  return execute(args, cachedRows, {
    resolveTemplate: getWorkflowConfig,
    execute: executeWorkflowDefinition,
    createWorkflowId: () => 'custom:' + crypto.randomUUID(),
  });
}
