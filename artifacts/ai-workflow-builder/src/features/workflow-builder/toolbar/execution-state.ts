import { type LocalRunRecord } from '@/shared/workflow-engine/workflow/contracts';
import { type LocalEdgeRunStatus } from '@/shared/workflow-engine/local-tool-runner';
import {
  type WorkflowEdge,
  type WorkflowNode,
} from '@/shared/workflow-engine/state/workflow-store';

// Helper functions to reduce complexity
export function updateNodesStatus(
  nodes: WorkflowNode[],
  updateNodeData: (update: {
    id: string;
    data: { status?: 'idle' | 'running' | 'success' | 'error' };
  }) => void,
  status: 'idle' | 'running' | 'success' | 'error',
) {
  for (const node of nodes) {
    updateNodeData({ id: node.id, data: { status } });
  }
}

export function isLocalToolWorkflow(nodes: WorkflowNode[]) {
  return nodes.some((node) => {
    const toolId = String(node.data.block?.config?.toolId || node.data.config?.toolId || '');
    return ['source.', 'logic.', 'review.', 'protected.', 'output.'].some((prefix) =>
      toolId.startsWith(prefix),
    );
  });
}

export function createExecutionLogsMap(logs: LocalRunRecord['logs']) {
  return Object.fromEntries(
    logs.map((log) => [
      log.nodeId,
      {
        nodeId: log.nodeId,
        nodeName: log.nodeName,
        nodeType: log.nodeType,
        status: log.status,
        output: log.output,
      },
    ]),
  );
}

export function applyEdgeRunStatuses({
  edges,
  edgeStatuses,
  runId,
}: {
  edges: WorkflowEdge[];
  edgeStatuses: Record<string, LocalEdgeRunStatus>;
  runId: string;
}) {
  return edges.map((edge) => ({
    ...edge,
    data: {
      ...edge.data,
      runStatus: edgeStatuses[edge.id] || 'idle',
      runStatusRunId: runId,
    },
  }));
}
