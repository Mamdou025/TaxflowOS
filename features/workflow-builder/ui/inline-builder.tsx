'use client';

// InlineBuilder — the workflow builder rendered INSIDE the Scope page's right
// panel (instead of the /builder route), so the AI chat stays permanent beside it
// and can answer questions about the canvas (BuilderCopilot publishes the open
// workflow + selected block into the same CopilotKit tree as the chat).
//
// WorkflowCanvas is `relative h-full` (only its PersistentCanvas wrapper was
// fixed) and RightPanelShell is `absolute` — so both compose inside a relative
// container. Workflow load mirrors app/builder/page.tsx (the plain, non-deep-link
// branch).

import { useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { ReactFlowProvider } from '@xyflow/react';
import { toast } from 'sonner';
import { WorkflowCanvas } from '@/features/workflow-builder/ui/workflow-canvas';
import { RightPanelShell } from '@/features/workflow-builder/ui/right-panel-shell';
import { BuilderCopilot } from '@/components/assistant/builder-copilot';
import { BuilderPageMenu } from '@/features/workflow-builder/ui/builder-page-menu';
import { builderEmbeddedAtom } from '@/lib/builder-bridge';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  createWorkingSourceRulesDemoWorkflow,
  LOCAL_WORKFLOW_ID,
  loadLocalWorkflowSnapshotResult,
  saveWorkflowDefinitionSnapshot,
  workflowDefinitionToCanvas,
} from '@/shared/workflow-engine/local-fiscal-workflow';
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
} from '@/shared/workflow-engine/state/workflow-store';

export function InlineBuilder() {
  const isMobile = useIsMobile();
  const setEmbedded = useSetAtom(builderEmbeddedAtom);
  const setNodes = useSetAtom(nodesAtom);
  const setEdges = useSetAtom(edgesAtom);
  const setCurrentWorkflowName = useSetAtom(currentWorkflowNameAtom);
  const setCurrentWorkflowId = useSetAtom(currentWorkflowIdAtom);
  const setCurrentWorkflowVisibility = useSetAtom(currentWorkflowVisibilityAtom);
  const setIsWorkflowOwner = useSetAtom(isWorkflowOwnerAtom);
  const setHasUnsavedChanges = useSetAtom(hasUnsavedChangesAtom);
  const setHasSidebarBeenShown = useSetAtom(hasSidebarBeenShownAtom);
  const setWorkflowNotFound = useSetAtom(workflowNotFoundAtom);
  const setSelectedNode = useSetAtom(selectedNodeAtom);
  const setSelectedEdge = useSetAtom(selectedEdgeAtom);
  const setSelectedExecutionId = useSetAtom(selectedExecutionIdAtom);

  // Tell the toolbar to hide its floating rail; the chrome lives in the header.
  useEffect(() => {
    setEmbedded(true);
    return () => setEmbedded(false);
  }, [setEmbedded]);

  useEffect(() => {
    const loadResult = loadLocalWorkflowSnapshotResult();
    if (loadResult.warning) {
      toast.warning('Saved local workflow could not be loaded. Restored the working Excel workflow.');
    }
    const snapshot = loadResult.snapshot || createWorkingSourceRulesDemoWorkflow();
    const canvas = workflowDefinitionToCanvas(snapshot);
    const selectedNode = canvas.nodes.find((n) => n.selected) || canvas.nodes[0];
    setNodes(
      canvas.nodes.map((node) => ({
        ...node,
        selected: selectedNode ? node.id === selectedNode.id : false,
        data: { ...node.data, status: 'idle' as const },
      }))
    );
    setEdges(canvas.edges);
    setCurrentWorkflowId(LOCAL_WORKFLOW_ID);
    setCurrentWorkflowName(snapshot.name);
    setCurrentWorkflowVisibility('private');
    setIsWorkflowOwner(true);
    setHasUnsavedChanges(false);
    setHasSidebarBeenShown(true);
    setWorkflowNotFound(false);
    setSelectedNode(selectedNode?.id ?? null);
    setSelectedEdge(null);
    setSelectedExecutionId(null);
    saveWorkflowDefinitionSnapshot(snapshot);
  }, [
    setCurrentWorkflowId, setCurrentWorkflowName, setCurrentWorkflowVisibility,
    setEdges, setHasSidebarBeenShown, setHasUnsavedChanges, setIsWorkflowOwner,
    setNodes, setSelectedEdge, setSelectedExecutionId, setSelectedNode, setWorkflowNotFound,
  ]);

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: 'var(--sx-canvas-ground)' }}>
      {/* Teaches the chat about this canvas + publishes the header menu. Render nothing. */}
      <BuilderCopilot />
      <BuilderPageMenu />
      <ReactFlowProvider>
        <WorkflowCanvas />
      </ReactFlowProvider>
      <RightPanelShell isMobile={isMobile} />
    </div>
  );
}
