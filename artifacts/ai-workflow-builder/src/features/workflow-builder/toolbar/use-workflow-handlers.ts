import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { api } from '@/platform/api-client';
import { createWorkflowEvent } from '@/shared/workflow-engine/workflow/events';
import { isLocalWorkflowId } from '@/shared/workflow-engine/workflow/visuals';
import { saveLocalWorkflowSnapshot } from '@/shared/workflow-engine/workflow/storage';
import type { IntegrationType } from '@/lib/types/integration';
import {
  type WorkflowEdge,
  type WorkflowNode,
} from '@/shared/workflow-engine/state/workflow-store';
import { useOverlay } from '@/shared/ui/overlays/overlay-provider';
import { WorkflowIssuesOverlay } from '@/features/workflow-builder/ui/overlays/workflow-issues-overlay';
import { isLocalToolWorkflow } from './execution-state';
import { executeLocalToolWorkflow, executeTestWorkflow } from './execution';
import {
  getBrokenTemplateReferences,
  getMissingRequiredFields,
  getMissingIntegrations,
} from './validation';

// Hook for workflow handlers
export type WorkflowHandlerParams = {
  currentWorkflowId: string | null;
  workflowName: string;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  updateNodeData: (update: {
    id: string;
    data: { status?: 'idle' | 'running' | 'success' | 'error' };
  }) => void;
  isExecuting: boolean;
  setIsExecuting: (value: boolean) => void;
  setIsSaving: (value: boolean) => void;
  setHasUnsavedChanges: (value: boolean) => void;
  setActiveTab: (value: string) => void;
  setNodes: (nodes: WorkflowNode[]) => void;
  setEdges: (edges: WorkflowEdge[]) => void;
  setSelectedNodeId: (id: string | null) => void;
  setSelectedExecutionId: (id: string | null) => void;
  setExecutionLogs: (
    logs: Record<
      string,
      {
        nodeId: string;
        nodeName: string;
        nodeType: string;
        status: 'pending' | 'running' | 'success' | 'error';
        output?: unknown;
      }
    >,
  ) => void;
  userIntegrations: Array<{ id: string; type: IntegrationType }>;
};

export function useWorkflowHandlers({
  currentWorkflowId,
  workflowName,
  nodes,
  edges,
  updateNodeData,
  isExecuting,
  setIsExecuting,
  setIsSaving,
  setHasUnsavedChanges,
  setActiveTab,
  setNodes,
  setEdges,
  setSelectedNodeId,
  setSelectedExecutionId,
  setExecutionLogs,
  userIntegrations,
}: WorkflowHandlerParams) {
  const { open: openOverlay } = useOverlay();
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup polling interval on unmount
  useEffect(
    () => () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    },
    [],
  );

  const handleSave = async () => {
    if (!currentWorkflowId) {
      return;
    }

    setIsSaving(true);
    try {
      if (isLocalWorkflowId(currentWorkflowId)) {
        saveLocalWorkflowSnapshot({
          edges,
          event: createWorkflowEvent({
            type: 'save_draft',
            message: 'Draft saved to localStorage.',
          }),
          name: workflowName,
          nodes,
          status: 'draft',
        });
        setHasUnsavedChanges(false);
        toast.success('Saved to local storage');
        return;
      }

      await api.workflow.update(currentWorkflowId, { nodes, edges });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Failed to save workflow:', error);
      toast.error('Failed to save workflow. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const executeWorkflow = async () => {
    if (!currentWorkflowId) {
      toast.error('Please save the workflow before executing');
      return;
    }

    const useLocalToolRunner = isLocalWorkflowId(currentWorkflowId) || isLocalToolWorkflow(nodes);

    // Deselect all nodes and edges
    setNodes(nodes.map((node) => ({ ...node, selected: false })));
    setEdges(
      edges.map((edge) => ({
        ...edge,
        data: {
          ...edge.data,
          ...(useLocalToolRunner ? { runStatus: 'running' as const } : {}),
        },
        selected: false,
      })),
    );
    setSelectedNodeId(null);

    setIsExecuting(true);

    if (useLocalToolRunner) {
      executeLocalToolWorkflow({
        edges,
        nodes,
        setEdges,
        setExecutionLogs,
        setIsExecuting,
        setSelectedExecutionId,
        updateNodeData,
        workflowName,
      });
      return;
    }

    await executeTestWorkflow({
      workflowId: currentWorkflowId,
      nodes,
      updateNodeData,
      pollingIntervalRef,
      setIsExecuting,
      setSelectedExecutionId,
    });
    // Don't set executing to false here - let polling handle it
  };

  const handleGoToStep = (nodeId: string, fieldKey?: string) => {
    setSelectedNodeId(nodeId);
    setActiveTab('properties');

    // Focus on the specific field after a short delay to allow the panel to render
    if (fieldKey) {
      setTimeout(() => {
        const element = document.getElementById(fieldKey);
        if (element) {
          element.focus();
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const handleExecute = async () => {
    // Guard against concurrent executions
    if (isExecuting) {
      return;
    }

    if (isLocalWorkflowId(currentWorkflowId)) {
      await executeWorkflow();
      return;
    }

    // Collect all workflow issues at once
    const brokenRefs = getBrokenTemplateReferences(nodes);
    const missingFields = getMissingRequiredFields(nodes);
    const missingIntegrations = getMissingIntegrations(nodes, userIntegrations);

    // If there are any issues, show the workflow issues overlay
    if (brokenRefs.length > 0 || missingFields.length > 0 || missingIntegrations.length > 0) {
      openOverlay(WorkflowIssuesOverlay, {
        issues: {
          brokenReferences: brokenRefs,
          missingRequiredFields: missingFields,
          missingIntegrations,
        },
        onGoToStep: handleGoToStep,
        onRunAnyway: executeWorkflow,
      });
      return;
    }

    await executeWorkflow();
  };

  return {
    handleSave,
    handleExecute,
  };
}
