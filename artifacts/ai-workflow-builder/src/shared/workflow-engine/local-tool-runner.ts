import { executeGraph } from '@workspace/workflow-core/graph';
import type { GraphRequest } from '@workspace/workflow-core/ports';
import { createWorkflowDefinitionFromCanvas } from './workflow/canvas';
import { browserGraphRuntime } from './workflow/execute';
import type { WorkflowEdge, WorkflowNode } from './state/workflow-store';
export type {
  LocalToolRunnerResult,
  LocalEdgeRunStatus,
} from '@workspace/workflow-contracts/execution-result';
export type { IsolatedBlockInput } from '@workspace/workflow-core/ports';
export function runLocalWorkflowTools({
  nodes,
  edges,
  workflowName,
  workflowId,
  ...options
}: Omit<GraphRequest, 'definition' | 'configSignatures'> & {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  workflowName: string;
  workflowId?: string;
}) {
  const definition = createWorkflowDefinitionFromCanvas({
    nodes,
    edges,
    name: workflowName || 'Fiscal Workflow Studio',
    status: 'draft',
  });
  if (workflowId) definition.id = workflowId;
  return executeGraph(
    {
      ...options,
      definition,
      configSignatures: Object.fromEntries(
        nodes
          .filter((node) => node.data.block)
          .map((node) => [node.id, JSON.stringify(node.data.block!.config)]),
      ),
    },
    browserGraphRuntime,
  );
}
