import { presentToolOutput as present } from '@workspace/workflow-core/outputs';
import { browserGraphRuntime } from './workflow/execute';
export function presentToolOutput(
  result: Parameters<typeof present>[0],
  block?: Parameters<typeof present>[1],
) {
  return present(result, block, browserGraphRuntime);
}
