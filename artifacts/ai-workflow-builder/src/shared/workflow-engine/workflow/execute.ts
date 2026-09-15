import { executeGraph } from '@workspace/workflow-core/graph';
import type { DefinitionExecutor, GraphRuntime } from '@workspace/workflow-core/ports';
import { getToolIdForBlock } from '@workspace/workflow-core/tool-resolution';
import { LOCAL_TOOL_REGISTRY } from '../tools/registry';
import { createWorkflowDefinitionFromCanvas, workflowDefinitionToCanvas } from './canvas';

export const browserGraphRuntime: GraphRuntime = {
  resolveToolId: getToolIdForBlock,
  getTool: (id) => LOCAL_TOOL_REGISTRY[id] ?? null,
  createId: (prefix) => `${prefix}-${crypto.randomUUID()}`,
};

export const executeWorkflowDefinition: DefinitionExecutor = (definition) => {
  // Retain legacy default expansion at the adapter boundary. The shared runner
  // receives a definition and never imports canvas, stores or browser libraries.
  const normalized = createWorkflowDefinitionFromCanvas({
    ...workflowDefinitionToCanvas(definition),
    name: definition.name,
    existing: definition,
  });
  // Execution is not an edit. Retain the saved source timestamps when expanding
  // legacy canvas defaults so browser and server evidence describe the same input.
  normalized.blocks = normalized.blocks.map((block) => {
    const original = definition.blocks.find((item) => item.id === block.id);
    return original
      ? { ...block, createdAt: original.createdAt, updatedAt: original.updatedAt }
      : block;
  });
  return executeGraph(
    {
      definition: { ...normalized, id: definition.id },
      configSignatures: Object.fromEntries(
        definition.blocks.map((block) => [block.id, JSON.stringify(block.config)]),
      ),
    },
    browserGraphRuntime,
  );
};
