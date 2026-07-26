

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { RightPanelShell } from "@/features/workflow-builder/ui/right-panel-shell";
import { BuilderCopilot } from "@/features/assistant/ui/builder-copilot";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  createFapiTemplateWorkflow,
  createPortfolioWorkflowById,
  createWorkingSourceRulesDemoWorkflow,
  LOCAL_WORKFLOW_ID,
  loadLocalWorkflowSnapshotResult,
  saveWorkflowDefinitionSnapshot,
  workflowDefinitionToCanvas,
} from "@/shared/workflow-engine/local-fiscal-workflow";
import { getWorkflowConfig } from "@/shared/workflow-engine/runtime/workflow-runs";
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
  builderFocusTargetAtom,
  focusNodeIdAtom,
} from "@/shared/workflow-engine/state/workflow-store";
import { uploadedRowsAtom } from "@/shared/stores/workspace-store";

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
  // Captured once at mount — the chat sets this before navigating here.
  const focusRef = useRef(useAtomValue(builderFocusTargetAtom));
  const uploadedRef = useRef(useAtomValue(uploadedRowsAtom));
  const setBuilderFocus = useSetAtom(builderFocusTargetAtom);
  const setFocusNodeId = useSetAtom(focusNodeIdAtom);

  useEffect(() => {
    const focus = focusRef.current;

    // Chat deep-link → load that workflow's template and focus a block. Otherwise
    // load the user's saved local workflow as usual.
    let snapshot;
    if (focus) {
      // Resolve ANY registered workflow to its canvas via the run-config registry
      // (fapi · roulement · expense · campaign), OR a Sinaxe portfolio blueprint
      // (pf-*). Falls back to FAPI if the id is unknown.
      const cfg = getWorkflowConfig(focus.workflowId);
      snapshot = cfg
        ? (cfg.buildSnapshot() as ReturnType<typeof createFapiTemplateWorkflow>)
        : (createPortfolioWorkflowById(focus.workflowId) ?? createFapiTemplateWorkflow());
      // Same shared upload the chat used → show the exact same rows on the canvas.
      const stored = uploadedRef.current[focus.workflowId];
      if (stored?.rows?.length) {
        const src = snapshot.blocks.find(
          (b) => b.config?.sourceKind === "excel_workbook" || b.config?.sourceKind === "manual_table"
        );
        if (src) {
          src.config = {
            ...src.config,
            rows: stored.rows,
            requireUpload: false,
            selectedRowsCount: stored.rows.length,
            sourceStatus: "ready",
            workbookName: stored.fileName,
            fileName: stored.fileName,
          };
        }
      }
    } else {
      const loadResult = loadLocalWorkflowSnapshotResult();
      if (loadResult.warning) {
        toast.warning("Saved local workflow could not be loaded. Restored the working Excel workflow.");
      }
      snapshot = loadResult.snapshot || createWorkingSourceRulesDemoWorkflow();
    }

    const canvas = workflowDefinitionToCanvas(snapshot);
    const selectedNode =
      (focus && canvas.nodes.find((n) => n.id === focus.blockId)) ||
      canvas.nodes.find((node) => node.selected) ||
      canvas.nodes[0];
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
    if (focus) {
      // Transient inspection view — don't persist over the user's saved workflow.
      setFocusNodeId(focus.blockId);
    } else {
      saveWorkflowDefinitionSnapshot(snapshot);
    }
  }, [
    setCurrentWorkflowId, setCurrentWorkflowName, setCurrentWorkflowVisibility,
    setEdges, setHasSidebarBeenShown, setHasUnsavedChanges, setIsWorkflowOwner,
    setNodes, setSelectedEdge, setSelectedExecutionId, setSelectedNode, setWorkflowNotFound,
    setFocusNodeId,
  ]);

  // Clear the deep-link target shortly after mount — late enough to survive a
  // StrictMode dev double-mount, so a later plain visit loads normally.
  useEffect(() => {
    if (!focusRef.current) return;
    const t = window.setTimeout(() => setBuilderFocus(null), 1200);
    return () => window.clearTimeout(t);
  }, [setBuilderFocus]);

  useEffect(() => {
    document.title = `${workflowName || "Fiscal Workflow Studio"} - Workflow Studio`;
  }, [workflowName]);

  return (
    <div className="flex h-dvh w-full flex-col overflow-hidden">
      {/* Teaches the ambient assistant about this canvas: the workflow, the
          selected block, and actions to focus/edit blocks. Renders nothing. */}
      <BuilderCopilot />
      <RightPanelShell isMobile={isMobile} />
    </div>
  );
};

export default BuilderPage;
