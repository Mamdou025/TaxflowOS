import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from '@/lib/router';
import { useEffect, useState } from 'react';
import { api } from '@/platform/api-client';
import { useSession } from '@/platform/auth/auth-client';
import { integrationsAtom } from '@/lib/integrations-store';
import { isLocalWorkflowId } from '@/shared/workflow-engine/workflow/visuals';
import {
  addNodeAtom,
  canRedoAtom,
  canUndoAtom,
  clearWorkflowAtom,
  currentWorkflowIdAtom,
  currentWorkflowNameAtom,
  currentWorkflowVisibilityAtom,
  edgesAtom,
  executionLogsAtom,
  hasUnsavedChangesAtom,
  isExecutingAtom,
  isGeneratingAtom,
  isSavingAtom,
  isWorkflowOwnerAtom,
  nodesAtom,
  propertiesPanelActiveTabAtom,
  redoAtom,
  selectedExecutionIdAtom,
  selectedNodeAtom,
  triggerExecuteAtom,
  undoAtom,
  updateNodeDataAtom,
} from '@/shared/workflow-engine/state/workflow-store';

// Hook for workflow state management
export function useWorkflowState() {
  const [nodes, setNodes] = useAtom(nodesAtom);
  const [edges, setEdges] = useAtom(edgesAtom);
  const [isExecuting, setIsExecuting] = useAtom(isExecutingAtom);
  const [isGenerating] = useAtom(isGeneratingAtom);
  const clearWorkflow = useSetAtom(clearWorkflowAtom);
  const updateNodeData = useSetAtom(updateNodeDataAtom);
  const [currentWorkflowId] = useAtom(currentWorkflowIdAtom);
  const isLocal = isLocalWorkflowId(currentWorkflowId);
  const [workflowName, setCurrentWorkflowName] = useAtom(currentWorkflowNameAtom);
  const [workflowVisibility, setWorkflowVisibility] = useAtom(currentWorkflowVisibilityAtom);
  const isOwner = useAtomValue(isWorkflowOwnerAtom);
  const router = useRouter();
  const [isSaving, setIsSaving] = useAtom(isSavingAtom);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useAtom(hasUnsavedChangesAtom);
  const undo = useSetAtom(undoAtom);
  const redo = useSetAtom(redoAtom);
  const addNode = useSetAtom(addNodeAtom);
  const [canUndo] = useAtom(canUndoAtom);
  const [canRedo] = useAtom(canRedoAtom);
  const { data: session } = useSession();
  const setActiveTab = useSetAtom(propertiesPanelActiveTabAtom);
  const setSelectedNodeId = useSetAtom(selectedNodeAtom);
  const setSelectedExecutionId = useSetAtom(selectedExecutionIdAtom);
  const setExecutionLogs = useSetAtom(executionLogsAtom);
  const userIntegrations = useAtomValue(integrationsAtom);
  const [triggerExecute, setTriggerExecute] = useAtom(triggerExecuteAtom);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [allWorkflows, setAllWorkflows] = useState<
    Array<{
      id: string;
      name: string;
      updatedAt: string;
    }>
  >([]);

  // Load all workflows on mount
  useEffect(() => {
    if (!(currentWorkflowId && !isLocal)) {
      return;
    }

    const loadAllWorkflows = async () => {
      try {
        const workflows = await api.workflow.getAll();
        setAllWorkflows(workflows);
      } catch (error) {
        console.error('Failed to load workflows:', error);
      }
    };
    loadAllWorkflows();
  }, [currentWorkflowId, isLocal]);

  return {
    nodes,
    edges,
    isExecuting,
    setIsExecuting,
    isGenerating,
    clearWorkflow,
    updateNodeData,
    currentWorkflowId,
    isLocal,
    workflowName,
    setCurrentWorkflowName,
    workflowVisibility,
    setWorkflowVisibility,
    isOwner,
    router,
    isSaving,
    setIsSaving,
    hasUnsavedChanges,
    setHasUnsavedChanges,
    undo,
    redo,
    addNode,
    canUndo,
    canRedo,
    session,
    isDownloading,
    setIsDownloading,
    isDuplicating,
    setIsDuplicating,
    allWorkflows,
    setAllWorkflows,
    setActiveTab,
    setNodes,
    setEdges,
    setSelectedNodeId,
    setSelectedExecutionId,
    setExecutionLogs,
    userIntegrations,
    triggerExecute,
    setTriggerExecute,
  };
}
