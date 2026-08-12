

// InlineBuilder — the workflow builder rendered INSIDE the Scope page's right
// panel (instead of the /builder route), so the AI chat stays permanent beside it
// and can answer questions about the canvas (BuilderCopilot publishes the open
// workflow + selected block into the same CopilotKit tree as the chat).
//
// WorkflowCanvas is `relative h-full` (only its PersistentCanvas wrapper was
// fixed) and RightPanelShell is `absolute` — so both compose inside a relative
// container. Workflow load mirrors app/builder/page.tsx (the plain, non-deep-link
// branch).

import { useEffect, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { ReactFlowProvider } from '@xyflow/react';
import { toast } from 'sonner';
import { WorkflowCanvas } from '@/features/workflow-builder/ui/workflow-canvas';
import { RightPanelShell } from '@/features/workflow-builder/ui/right-panel-shell';
import { BuilderCopilot } from '@/features/assistant/ui/builder-copilot';
import { BuilderPageMenu } from '@/features/workflow-builder/ui/builder-page-menu';
import { builderEmbeddedAtom } from '@/lib/builder-bridge';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  createBlankWorkflow,
  createPortfolioWorkflowById,
  createWorkingSourceRulesDemoWorkflow,
  LOCAL_WORKFLOW_ID,
  loadLocalWorkflowSnapshotResult,
  saveWorkflowDefinitionSnapshot,
  workflowDefinitionToCanvas,
} from '@/shared/workflow-engine/local-fiscal-workflow';
import { getWorkflowConfig } from '@/shared/workflow-engine/runtime/workflow-runs';
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
} from '@/shared/workflow-engine/state/workflow-store';

export function InlineBuilder({ workflowId, blank }: { workflowId?: string; blank?: boolean } = {}) {
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
  const setFocusNodeId = useSetAtom(focusNodeIdAtom);
  const setBuilderFocus = useSetAtom(builderFocusTargetAtom);
  // Chat "open in builder" deep-link: the chat sets builderFocusTargetAtom (workflow
  // + block) before switching to this Build tab. Captured once at mount — mirrors
  // app/builder/page.tsx — so we can select + centre that block on the canvas.
  const focusRef = useRef(useAtomValue(builderFocusTargetAtom));

  // Tell the toolbar to hide its floating rail; the chrome lives in the header.
  useEffect(() => {
    setEmbedded(true);
    return () => setEmbedded(false);
  }, [setEmbedded]);

  useEffect(() => {
    // A specific workflow (the Build tab of a workflow page) loads THAT graph —
    // a portfolio blueprint (pf-*) or a runnable config — WITHOUT clobbering the
    // user's saved local workflow. No workflowId → the usual saved-local load.
    let snapshot;
    if (blank) {
      snapshot = createBlankWorkflow();
    } else if (workflowId) {
      const cfg = getWorkflowConfig(workflowId.replace(/^pf-/, ''));
      snapshot =
        createPortfolioWorkflowById(workflowId) ||
        (cfg ? (cfg.buildSnapshot() as ReturnType<typeof createWorkingSourceRulesDemoWorkflow>) : null) ||
        createWorkingSourceRulesDemoWorkflow();
    } else {
      const loadResult = loadLocalWorkflowSnapshotResult();
      if (loadResult.warning) {
        toast.warning('Saved local workflow could not be loaded. Restored the working Excel workflow.');
      }
      snapshot = loadResult.snapshot || createWorkingSourceRulesDemoWorkflow();
    }
    const canvas = workflowDefinitionToCanvas(snapshot);
    // A deep-link focus target for THIS workflow (compare ignoring the pf- prefix, as
    // the surface selects by portfolio id) → select + centre that specific block.
    const focus = focusRef.current;
    const focusBlockId =
      focus && focus.blockId && workflowId &&
      focus.workflowId.replace(/^pf-/, '') === workflowId.replace(/^pf-/, '')
        ? focus.blockId
        : '';
    const selectedNode =
      (focusBlockId && canvas.nodes.find((n) => n.id === focusBlockId)) ||
      canvas.nodes.find((n) => n.selected) ||
      canvas.nodes[0];
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
    // Centre the canvas on the deep-linked block (WorkflowCanvas scrolls to it once
    // the node exists). Otherwise clear any stale focus from a prior visit.
    setFocusNodeId(focusBlockId || null);
    // Only the default (saved-local) load persists; a specific/blank workflow loaded
    // into Build is transient so it doesn't overwrite the user's saved local workflow
    // (they persist it with the Save button when ready).
    if (!workflowId && !blank) saveWorkflowDefinitionSnapshot(snapshot);
  }, [
    workflowId, blank,
    setCurrentWorkflowId, setCurrentWorkflowName, setCurrentWorkflowVisibility,
    setEdges, setHasSidebarBeenShown, setHasUnsavedChanges, setIsWorkflowOwner,
    setNodes, setSelectedEdge, setSelectedExecutionId, setSelectedNode, setWorkflowNotFound,
    setFocusNodeId,
  ]);

  // Clear the deep-link target shortly after mount — late enough to survive a
  // StrictMode dev double-mount, so a later plain visit loads normally (mirrors
  // app/builder/page.tsx).
  useEffect(() => {
    if (!focusRef.current) return;
    const t = window.setTimeout(() => setBuilderFocus(null), 1200);
    return () => window.clearTimeout(t);
  }, [setBuilderFocus]);

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
