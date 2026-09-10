

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
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { ReactFlowProvider } from '@xyflow/react';
import { toast } from 'sonner';
import { WorkflowCanvas } from '@/features/workflow-builder/ui/workflow-canvas';
import { RightPanelShell } from '@/features/workflow-builder/ui/right-panel-shell';
import { BuilderCopilot } from '@/features/assistant/ui/builder-copilot';
import { BuilderPageMenu } from '@/features/workflow-builder/ui/builder-page-menu';
import { activeBuilderWorkflowIdAtom, builderEmbeddedAtom } from '@/lib/builder-bridge';
import { getPortfolioWorkflowDef } from '@/shared/workflow-engine/templates/portfolio/portfolio-workflows';
import { WorkflowTestData } from '@/features/workflows-hub/workflow-test-data';
import { workflowLibraryAtom, definitionFingerprint } from '@/features/workflows-hub/workflow-library';
import { useOverlay } from '@/shared/ui/overlays/overlay-provider';
import { selectedWorkflowIdAtom } from '@/features/workflows-hub/workflows-store';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  createWorkflowDefinitionFromCanvas,
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
  openBlockConfigIdAtom,
} from '@/shared/workflow-engine/state/workflow-store';

export function InlineBuilder({ workflowId, blank }: { workflowId?: string; blank?: boolean } = {}) {
  const isMobile = useIsMobile();
  const [library, setLibrary] = useAtom(workflowLibraryAtom);
  const setSelectedWorkflow = useSetAtom(selectedWorkflowIdAtom);
  const liveNodes = useAtomValue(nodesAtom);
  const liveEdges = useAtomValue(edgesAtom);
  const liveName = useAtomValue(currentWorkflowNameAtom);
  const liveSelectedNode = useAtomValue(selectedNodeAtom);
  const { hasOverlays } = useOverlay();
  const loaded = useRef<{ snapshot: ReturnType<typeof createBlankWorkflow>; fingerprint: string; ready: boolean } | null>(null);
  const initialLibrary = useRef(library);

  const setEmbedded = useSetAtom(builderEmbeddedAtom);
  const setDefinitionId = useSetAtom(activeBuilderWorkflowIdAtom);
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
  const setOpenBlockConfig = useSetAtom(openBlockConfigIdAtom);
  const setBuilderFocus = useSetAtom(builderFocusTargetAtom);
  // Chat "open in builder" deep-link: the chat sets builderFocusTargetAtom (workflow
  // + block) before switching to this Build tab. Captured once at mount — mirrors
  // app/builder/page.tsx — so we can select + centre that block on the canvas.
  const focusRef = useRef(useAtomValue(builderFocusTargetAtom));

  // Tell the toolbar to hide its floating rail; the chrome lives in the header.
  useEffect(() => {
    setEmbedded(true);
    setDefinitionId(workflowId ?? null);
    return () => { setEmbedded(false); setDefinitionId(null); };
  }, [setEmbedded, setDefinitionId, workflowId]);

  useEffect(() => {
    // A deep-link focus target for THIS workflow (compare ignoring the pf- prefix, as
    // the surface selects by portfolio id) — resolved BEFORE the graph is chosen,
    // because which graph to load depends on where that block actually lives.
    const focus = focusRef.current;
    const focusBlockId =
      focus &&
      focus.blockId &&
      workflowId &&
      focus.workflowId.replace(/^pf-/, "") === workflowId.replace(/^pf-/, "")
        ? focus.blockId
        : "";

    // A specific workflow (the Build tab of a workflow page) loads THAT graph —
    // a portfolio blueprint (pf-*) or a runnable config — WITHOUT clobbering the
    // user's saved local workflow. No workflowId → the usual saved-local load.
    let snapshot;
    if (blank) {
      snapshot = createBlankWorkflow();
    } else if (workflowId && initialLibrary.current[workflowId]) {
      snapshot = initialLibrary.current[workflowId].draft;
    } else if (workflowId) {
      const cfg = getWorkflowConfig(workflowId.replace(/^pf-/, ""));
      const runnableSnapshot = cfg
        ? (cfg.buildSnapshot() as ReturnType<
            typeof createWorkingSourceRulesDemoWorkflow
          >)
        : null;
      const blueprint = createPortfolioWorkflowById(workflowId);
      // Build the executable graph whenever the template provides one.
      snapshot =
        runnableSnapshot || blueprint || createWorkingSourceRulesDemoWorkflow();
    } else {
      const loadResult = loadLocalWorkflowSnapshotResult();
      if (loadResult.warning) {
        toast.warning(
          "Saved local workflow could not be loaded. Restored the working Excel workflow.",
        );
      }
      snapshot = loadResult.snapshot || createWorkingSourceRulesDemoWorkflow();
    }
    const canvas = workflowDefinitionToCanvas(snapshot);
    loaded.current = {
      snapshot,
      fingerprint: definitionFingerprint(
        createWorkflowDefinitionFromCanvas({
          ...canvas,
          name: snapshot.name,
          existing: snapshot,
        }),
      ),
      ready: false,
    };
    // The deep-linked block (resolved above) → select + centre it.
    const focusedNode = focusBlockId
      ? canvas.nodes.find((n) => n.id === focusBlockId)
      : undefined;
    const selectedNode =
      focusedNode || canvas.nodes.find((n) => n.selected) || canvas.nodes[0];
    setNodes(
      canvas.nodes.map((node) => ({
        ...node,
        selected: selectedNode ? node.id === selectedNode.id : false,
        data: { ...node.data, status: "idle" as const },
      })),
    );
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
    // Centre the canvas on the deep-linked block (WorkflowCanvas scrolls to it once
    // the node exists) and open its configuration, so "open the full block in the
    // builder" lands ON the block's real setup instead of a canvas the user still
    // has to hunt through. Only when the block was actually found; otherwise clear
    // any stale focus from a prior visit.
    setFocusNodeId(focusedNode ? focusBlockId : null);
    setOpenBlockConfig(focusedNode ? focusBlockId : null);
    // Only the default (saved-local) load persists; a specific/blank workflow loaded
    // into Build is transient so it doesn't overwrite the user's saved local workflow
    // (they persist it with the Save button when ready).
    if (!workflowId && !blank) saveWorkflowDefinitionSnapshot(snapshot);
  }, [
    workflowId,
    blank,
    setCurrentWorkflowId,
    setCurrentWorkflowName,
    setCurrentWorkflowVisibility,
    setEdges,
    setHasSidebarBeenShown,
    setHasUnsavedChanges,
    setIsWorkflowOwner,
    setNodes,
    setSelectedEdge,
    setSelectedExecutionId,
    setSelectedNode,
    setWorkflowNotFound,
    setFocusNodeId,
    setOpenBlockConfig,
  ]);

  // Persist the actual canvas before navigation can unmount Build.
  useEffect(() => {
    if (!workflowId && !blank) return;
    const base = loaded.current;
    if (!base) return;
    if (!base.ready) {
      base.ready = true;
      return;
    }
    const draft = createWorkflowDefinitionFromCanvas({
      nodes: liveNodes,
      edges: liveEdges,
      name: liveName,
      existing: base.snapshot,
    });
    const fingerprint = definitionFingerprint(draft);
    if (fingerprint === base.fingerprint) return;
    base.fingerprint = fingerprint;
    const existing = workflowId ? library[workflowId] : undefined;
    const id = existing?.id ?? `custom:${crypto.randomUUID()}`;
    const namedDraft = {
      ...draft,
      id,
      name: existing ? draft.name : `${draft.name} \u2014 My workflow`,
    };
    setLibrary((previous) => ({
      ...previous,
      [id]: {
        ...(existing ?? {
          id,
          templateId: workflowId ?? "__new__",
          versions: [],
          runs: [],
        }),
        draft: namedDraft,
      },
    }));
    if (!existing) {
      setBuilderFocus({ workflowId: id, blockId: hasOverlays ? liveSelectedNode ?? "" : "" });
      setSelectedWorkflow(id);
    }
  }, [
    liveNodes,
    liveEdges,
    liveName,
    workflowId,
    library,
    setLibrary,
    setSelectedWorkflow,
    liveSelectedNode,
    hasOverlays,
    setBuilderFocus,
    blank,
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
      <div className="absolute inset-x-3 top-2 z-20 max-h-[65%] overflow-auto">
        {loaded.current && <WorkflowTestData definition={createWorkflowDefinitionFromCanvas({ nodes: liveNodes, edges: liveEdges, name: liveName, existing: loaded.current.snapshot })} onChange={definition => { const canvas = workflowDefinitionToCanvas(definition); setNodes(canvas.nodes); setEdges(canvas.edges); setHasUnsavedChanges(true); }} />}
      </div>
      <div className="absolute inset-x-0 bottom-0 top-16"><ReactFlowProvider>
        <WorkflowCanvas />
      </ReactFlowProvider></div>
      <RightPanelShell isMobile={isMobile} />
    </div>
  );
}
