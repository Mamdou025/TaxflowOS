import { executeSavedWorkflow as execute } from '@workspace/workflow-core/commands';
import { executeWorkflowDefinition } from '@/shared/workflow-engine/workflow/execute';
import { workflowDefinitionToCanvas } from '@/shared/workflow-engine/workflow/canvas';
import type { runLocalWorkflowTools } from '@/shared/workflow-engine/local-tool-runner';
export {
  createWorkflow,
  replaceDraft,
  definitionFingerprint,
  saveVersion,
  recordWorkflowExecution,
  getSavedVersion,
  getWorkflowRun,
} from '@workspace/workflow-core/commands';
export function executeSavedWorkflow(
  entry: Parameters<typeof execute>[0],
  options: Parameters<typeof execute>[1],
  legacyExecutor?: typeof runLocalWorkflowTools,
  context?: Parameters<typeof execute>[3],
) {
  return execute(
    entry,
    options,
    legacyExecutor
      ? (definition) =>
          legacyExecutor({
            ...workflowDefinitionToCanvas(definition),
            workflowName: definition.name,
            workflowId: definition.id,
          })
      : executeWorkflowDefinition,
    context,
  );
}
