import { executeTool } from "./registry";
import type { ToolExecutionContext, ToolRunResult } from "./types";

export function runTool(
  toolId: string,
  context: ToolExecutionContext
): ToolRunResult {
  return executeTool(toolId, context);
}
