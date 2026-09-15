import type { ToolRunResult } from '@workspace/workflow-contracts/tool-types';
import type { WorkflowBlock } from '@workspace/workflow-contracts/domain/workflow-types';
import type { GraphRuntime } from './ports';
function populated(value: unknown): boolean {
  if (value === null || value === undefined || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === 'object') return Object.values(value).some(populated);
  return true;
}
// Keep execution metadata in the run record; expose the block's declared outputs.
export function presentToolOutput(
  result: ToolRunResult,
  block: WorkflowBlock | undefined,
  runtime: Pick<GraphRuntime, 'getTool' | 'resolveToolId'>,
): Record<string, unknown> {
  if (result.toolId === 'test.example_input') return result.output;
  const tool = block ? runtime.getTool(runtime.resolveToolId(block)) : null;
  if (block?.family === 'Source' && Array.isArray(result.output.rows)) {
    return { rows: result.output.rows };
  }
  if (!tool)
    return Object.fromEntries(
      Object.entries(result.output).filter(
        ([key, value]) =>
          !['bindingValidation', 'upstreamBlockIds', 'backendOutputs'].includes(key) &&
          populated(value),
      ),
    );
  const output: Record<string, unknown> = {};
  const seen = new Set<string>();
  for (const role of tool.outputRoles) {
    const key = role.outputKey ?? role.id;
    const value = result.output[key] ?? result.output[role.id];
    if (!populated(value)) continue;
    const signature = JSON.stringify(value);
    if (seen.has(signature)) continue;
    seen.add(signature);
    output[key] = value;
  }
  if (!Object.keys(output).length)
    for (const field of tool.outputSchema.fields) {
      if (field.key in result.output && (field.required || populated(result.output[field.key])))
        output[field.key] = result.output[field.key];
    }
  return output;
}
