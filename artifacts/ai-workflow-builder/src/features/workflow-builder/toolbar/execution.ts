import { apiFetch } from '@/platform/auth/api-fetch';
import { toast } from 'sonner';
import { api } from '@/platform/api-client';
import { saveLocalRunRecord } from '@/shared/workflow-engine/workflow/run-storage';
import { runLocalWorkflowTools } from '@/shared/workflow-engine/local-tool-runner';
import {
  type WorkflowEdge,
  type WorkflowNode,
} from '@/shared/workflow-engine/state/workflow-store';
import { type WorkflowHandlerParams } from './use-workflow-handlers';
import { applyEdgeRunStatuses, createExecutionLogsMap, updateNodesStatus } from './execution-state';

type ExecuteTestWorkflowParams = {
  workflowId: string;
  nodes: WorkflowNode[];
  updateNodeData: (update: {
    id: string;
    data: { status?: 'idle' | 'running' | 'success' | 'error' };
  }) => void;
  pollingIntervalRef: React.MutableRefObject<NodeJS.Timeout | null>;
  setIsExecuting: (value: boolean) => void;
  setSelectedExecutionId: (value: string | null) => void;
};

type ExecuteLocalToolWorkflowParams = {
  edges: WorkflowEdge[];
  nodes: WorkflowNode[];
  setEdges: (edges: WorkflowEdge[]) => void;
  setExecutionLogs: WorkflowHandlerParams['setExecutionLogs'];
  setIsExecuting: (value: boolean) => void;
  setSelectedExecutionId: (value: string | null) => void;
  updateNodeData: WorkflowHandlerParams['updateNodeData'];
  workflowName: string;
};

export function executeLocalToolWorkflow({
  edges,
  nodes,
  setEdges,
  setExecutionLogs,
  setIsExecuting,
  setSelectedExecutionId,
  updateNodeData,
  workflowName,
}: ExecuteLocalToolWorkflowParams) {
  try {
    const localRun = runLocalWorkflowTools({
      edges,
      nodes,
      workflowName,
    });
    saveLocalRunRecord(localRun.record);
    for (const [nodeId, status] of Object.entries(localRun.blockStatuses)) {
      updateNodeData({ id: nodeId, data: { status } });
    }
    setEdges(
      applyEdgeRunStatuses({
        edgeStatuses: localRun.edgeStatuses,
        edges: edges.map((edge) => ({ ...edge, selected: false })),
        runId: localRun.record.execution.id,
      }),
    );
    setSelectedExecutionId(localRun.record.execution.id);
    setExecutionLogs(createExecutionLogsMap(localRun.record.logs));
    if (localRun.result.status === 'success') {
      toast.success('Local tool workflow run completed');
    } else {
      toast.warning(
        `Local tool run completed with ${localRun.result.warnings.length} warning${localRun.result.warnings.length === 1 ? '' : 's'}`,
      );
    }
  } catch (error) {
    console.error('Local tool workflow run failed:', error);
    updateNodesStatus(nodes, updateNodeData, 'error');
    toast.error(error instanceof Error ? error.message : 'Local tool workflow run failed');
  } finally {
    setIsExecuting(false);
  }
}

export async function executeTestWorkflow({
  workflowId,
  nodes,
  updateNodeData,
  pollingIntervalRef,
  setIsExecuting,
  setSelectedExecutionId,
}: ExecuteTestWorkflowParams) {
  // Set all nodes to idle first
  updateNodesStatus(nodes, updateNodeData, 'idle');

  // Immediately set trigger nodes to running for instant visual feedback
  for (const node of nodes) {
    if (node.data.type === 'trigger') {
      updateNodeData({ id: node.id, data: { status: 'running' } });
    }
  }

  try {
    // Start the execution via API
    const response = await apiFetch(`/api/workflow/${workflowId}/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ input: {} }),
    });

    if (!response.ok) {
      throw new Error('Failed to execute workflow');
    }

    const result = await response.json();

    // Select the new execution
    setSelectedExecutionId(result.executionId);

    // Poll for execution status updates
    const pollInterval = setInterval(async () => {
      try {
        const statusData = await api.workflow.getExecutionStatus(result.executionId);

        // Update node statuses based on the execution logs
        for (const nodeStatus of statusData.nodeStatuses) {
          updateNodeData({
            id: nodeStatus.nodeId,
            data: {
              status: nodeStatus.status as 'idle' | 'running' | 'success' | 'error',
            },
          });
        }

        // Stop polling if execution is complete
        if (statusData.status !== 'running') {
          if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
            pollingIntervalRef.current = null;
          }

          setIsExecuting(false);

          // Don't reset node statuses - let them show the final state
          // The user can click another run or deselect to reset
        }
      } catch (error) {
        console.error('Failed to poll execution status:', error);
      }
    }, 500); // Poll every 500ms

    pollingIntervalRef.current = pollInterval;
  } catch (error) {
    console.error('Failed to execute workflow:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to execute workflow');
    updateNodesStatus(nodes, updateNodeData, 'error');
    setIsExecuting(false);
  }
}
