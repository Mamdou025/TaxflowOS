"use client";

import { useAtom, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { RightPanelShell } from "@/components/workflow/right-panel-shell";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  createWorkingSourceRulesDemoWorkflow,
  LOCAL_WORKFLOW_ID,
  loadLocalWorkflowSnapshotResult,
  saveWorkflowDefinitionSnapshot,
  workflowDefinitionToCanvas,
} from "@/lib/local-fiscal-workflow";
import {
  currentWorkflowIdAtom,
  currentWorkflowNameAtom,
  currentWorkflowVisibilityAtom,
  edgesAtom,
  hasSidebarBeenShownAtom,
  hasUnsavedChangesAtom,
  isWorkflowOwnerAtom,
  nodesAtom,
  selectedEdgeAtom,
  selectedExecutionIdAtom,
  selectedNodeAtom,
  workflowNotFoundAtom,
} from "@/lib/workflow-store";

const BuilderPage = () => {
  const isMobile = useIsMobile();
  const setNodes = useSetAtom(nodesAtom);
  const setEdges = useSetAtom(edgesAtom);
  const [workflowName, setCurrentWorkflowName] = useAtom(currentWorkflowNameAtom);
  const setCurrentWorkflowId = useSetAtom(currentWorkflowIdAtom);
  const setCurrentWorkflowVisibility = useSetAtom(currentWorkflowVisibilityAtom);
  const setIsWorkflowOwner = useSetAtom(isWorkflowOwnerAtom);
  const setHasUnsavedChanges = useSetAtom(hasUnsavedChangesAtom);
  const setHasSidebarBeenShown = useSetAtom(hasSidebarBeenShownAtom);
  const setWorkflowNotFound = useSetAtom(workflowNotFoundAtom);
  const setSelectedNode = useSetAtom(selectedNodeAtom);
  const setSelectedEdge = useSetAtom(selectedEdgeAtom);
  const setSelectedExecutionId = useSetAtom(selectedExecutionIdAtom);
  const initializedRef = useRef(false);

  useEffect(() => {
    const loadResult = loadLocalWorkflowSnapshotResult();
    if (loadResult.warning) {
      toast.warning("Saved local workflow could not be loaded. Restored the working Excel workflow.");
    }
    const snapshot = loadResult.snapshot || createWorkingSourceRulesDemoWorkflow();
    const canvas = workflowDefinitionToCanvas(snapshot);
    const selectedNode = canvas.nodes.find((node) => node.selected) || canvas.nodes[0];
    const nodesWithSelection = canvas.nodes.map((node) => ({
      ...node,
      selected: selectedNode ? node.id === selectedNode.id : false,
      data: { ...node.data, status: "idle" as const },
    }));

    setNodes(nodesWithSelection);
    setEdges(canvas.edges);
    setCurrentWorkflowId(LOCAL_WORKFLOW_ID);
    setCurrentWorkflowName(snapshot.name);
    setCurrentWorkflowVisibility("private");
    setIsWorkflowOwner(true);
    setHasUnsavedChanges(false);
    setHasSidebarBeenShown(true);
    setWorkflowNotFound(false);
    setSelectedNode(selectedNode?.id ?? null);
    setSelectedEdge(null);
    setSelectedExecutionId(null);
    saveWorkflowDefinitionSnapshot(snapshot);
    initializedRef.current = true;
  }, [
    setCurrentWorkflowId, setCurrentWorkflowName, setCurrentWorkflowVisibility,
    setEdges, setHasSidebarBeenShown, setHasUnsavedChanges, setIsWorkflowOwner,
    setNodes, setSelectedEdge, setSelectedExecutionId, setSelectedNode, setWorkflowNotFound,
  ]);

  useEffect(() => {
    document.title = `${workflowName || "Fiscal Workflow Studio"} - Workflow Studio`;
  }, [workflowName]);

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      <RightPanelShell isMobile={isMobile} />
    </div>
  );
};

export default BuilderPage;
