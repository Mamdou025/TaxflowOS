import type { ToolDefinition } from './types';

/** Duplicates are configuration errors; aliases must name a real executable. */
export function composeToolRegistry(
  tools: ToolDefinition[],
  aliases: Record<string, string> = {},
): Record<string, ToolDefinition> {
  const registry: Record<string, ToolDefinition> = Object.create(null);
  for (const tool of tools) {
    if (registry[tool.toolId]) throw new Error(`Duplicate workflow tool: ${tool.toolId}`);
    registry[tool.toolId] = tool;
  }
  for (const [alias, target] of Object.entries(aliases)) {
    if (registry[alias]) throw new Error(`Duplicate workflow tool alias: ${alias}`);
    const tool = registry[target];
    if (!tool) throw new Error(`Workflow tool alias ${alias} targets missing tool ${target}`);
    registry[alias] = tool;
  }
  return registry;
}
