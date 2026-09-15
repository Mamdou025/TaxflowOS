import { MISSING_TOOLS } from '../missing-tools';
import { OUTPUT_TOOLS } from '../output-tools';
import { portfolioWorkpaperTool } from '../portfolio-workpaper-tool';
import { localTools } from './tool-list';
import { BACKEND_ADAPTED_TOOL_IDS, createBackendAdaptedTool } from './backend-adapter';
import { composeToolRegistry } from './compose-registry';

// Modular block executors own these IDs. Keep them out of localTools so
// composeToolRegistry rejects duplicate ownership instead of silently filtering it.
const adapters = BACKEND_ADAPTED_TOOL_IDS.map((toolId) => {
  const tool = createBackendAdaptedTool(toolId);
  if (!tool) throw new Error('Missing modular workflow executor: ' + toolId);
  return tool;
});
export const LOCAL_TOOL_REGISTRY = composeToolRegistry(
  [...localTools, ...MISSING_TOOLS, ...OUTPUT_TOOLS, portfolioWorkpaperTool, ...adapters],
  { 'logic.keyword_classifier': 'logic.keyword_mapper' },
);
