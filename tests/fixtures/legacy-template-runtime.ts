import {
  executeWorkflowCommand,
  type TemplateCommandRuntime,
} from '../../lib/workflow-core/src/application/template-command';
import { DOCUMENT_CALCULATOR_CONFIG } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/runtime/workflow-runs/document-calculator';
import { EXPENSE_CONFIG } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/runtime/workflow-runs/expense';
import { executeWorkflowDefinition } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/execute';

// Historical definitions remain useful fixtures without re-entering the public catalogue.
export const resolveLegacyTemplate: TemplateCommandRuntime['resolveTemplate'] = (id) =>
  [DOCUMENT_CALCULATOR_CONFIG, EXPENSE_CONFIG].find((config) => config.id === id) ?? null;

export function executeLegacyTemplateCommand(
  args: Parameters<typeof executeWorkflowCommand>[0],
  cachedRows?: Parameters<typeof executeWorkflowCommand>[1],
) {
  return executeWorkflowCommand(args, cachedRows, {
    resolveTemplate: resolveLegacyTemplate,
    execute: executeWorkflowDefinition,
    createWorkflowId: () => 'custom:legacy-template-fixture',
  });
}
