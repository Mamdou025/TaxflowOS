// Browser composition adapter. Template rules live in the workflow application.
import {
  runTemplateCore as core,
  runTemplateLoop as loop,
  runToCompletion as preview,
} from '@workspace/workflow-core/templates';
import { executeWorkflowDefinition } from '../../workflow/execute';
export * from '@workspace/workflow-core/templates';
export const runTemplateCore = (
  config: Parameters<typeof core>[0],
  options: Parameters<typeof core>[1],
) => core(config, options, executeWorkflowDefinition);
export const runTemplateLoop = (
  config: Parameters<typeof loop>[0],
  state: Parameters<typeof loop>[1],
) => loop(config, state, executeWorkflowDefinition);
export const runToCompletion = (config: Parameters<typeof preview>[0]) =>
  preview(config, executeWorkflowDefinition);
