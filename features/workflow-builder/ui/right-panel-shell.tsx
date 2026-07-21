"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Check, Eye, EyeOff, Workflow, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { WorksheetPageView } from "@/features/workflow-builder/ui/worksheet-page-view";
import { WORKFLOWS } from "@/lib/agents";
import {
  createFapiTemplateWorkflow,
  saveWorkflowDefinitionSnapshot,
  type WorkflowBlock,
  workflowDefinitionToCanvas,
} from "@/shared/workflow-engine/local-fiscal-workflow";
import { getWorkflowConfig } from "@/shared/workflow-engine/runtime/workflow-runs";
import {
  activeRightPanelAtom,
  type ActiveRightPanel,
  currentWorkflowNameAtom,
  edgesAtom,
  hasUnsavedChangesAtom,
  isPanelAnimatingAtom,
  nodesAtom,
  rightPanelWidthAtom,
  selectedEdgeAtom,
  selectedExecutionIdAtom,
  selectedNodeAtom,
  showMinimapAtom,
  triggerFitViewAtom,
  updateNodeDataAtom,
} from "@/shared/workflow-engine/state/workflow-store";

const PANEL_WIDTH = "34%";

const PANEL_TITLES: Partial<Record<NonNullable<ActiveRightPanel>, string>> = {
  workflows: "Workflows",
  pages: "Worksheet Pages",
  settings: "Canvas Settings",
};

// ── Settings panel ────────────────────────────────────────────────────────────

function SettingsContent() {
  const [showMinimap, setShowMinimap] = useAtom(showMinimapAtom);
  const setTriggerFitView = useSetAtom(triggerFitViewAtom);

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm">Show minimap</span>
        <button
          className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${showMinimap ? "bg-primary" : "bg-muted-foreground/30"}`}
          onClick={() => setShowMinimap((v) => !v)}
          type="button"
        >
          <span
            className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform ${showMinimap ? "translate-x-5" : "translate-x-1"}`}
          />
        </button>
      </div>
      <button
        className="w-full rounded-md border px-3 py-2 text-left text-sm transition-colors hover:bg-muted"
        onClick={() => setTriggerFitView(true)}
        type="button"
      >
        Fit canvas to screen
      </button>
    </div>
  );
}

// ── Pages panel ───────────────────────────────────────────────────────────────

type BlockItem = {
  blockId: string;
  label: string;
  description?: string;
  block: WorkflowBlock;
  included: boolean;
};

function PagesContent({ onOpenPage }: { onOpenPage: () => void }) {
  const workflowName = useAtomValue(currentWorkflowNameAtom);
  const nodes = useAtomValue(nodesAtom);
  const updateNodeData = useSetAtom(updateNodeDataAtom);

  const fieldBlocks: BlockItem[] = nodes
    .filter((n) => n.data.block?.family === "Field")
    .map((n) => ({
      blockId: n.id,
      label: n.data.label,
      description: n.data.description,
      block: n.data.block as WorkflowBlock,
      included: n.data.block?.runtime?.visible !== false,
    }));

  const includedCount = fieldBlocks.filter((b) => b.included).length;

  function toggle(item: BlockItem) {
    const visible = !item.included;
    updateNodeData({
      id: item.blockId,
      data: { block: { ...item.block, runtime: { ...item.block.runtime, visible } } },
    });
  }

  function setAll(included: boolean) {
    for (const item of fieldBlocks) {
      if (item.included !== included) toggle(item);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b bg-muted/20 px-4 py-1.5 text-[10px] text-muted-foreground">
        <span>
          {includedCount} of {fieldBlocks.length} blocks included
        </span>
        {fieldBlocks.length > 0 && (
          <div className="flex items-center gap-2">
            <button className="text-[10px] hover:text-foreground transition-colors" onClick={() => setAll(true)} type="button">
              All
            </button>
            <span className="opacity-40">·</span>
            <button className="text-[10px] hover:text-foreground transition-colors" onClick={() => setAll(false)} type="button">
              None
            </button>
          </div>
        )}
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {fieldBlocks.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No Field blocks in this workflow yet.
          </div>
        ) : (
          fieldBlocks.map((item) => (
            <div key={item.blockId} className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30">
              <button
                className={`flex size-4 shrink-0 items-center justify-center rounded border transition-colors ${item.included ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}
                onClick={() => toggle(item)}
                type="button"
              >
                {item.included && <Check className="size-2.5" />}
              </button>
              <div className="min-w-0 flex-1">
                <div className={`truncate text-sm font-medium ${item.included ? "text-foreground" : "text-muted-foreground line-through"}`}>
                  {item.label}
                </div>
                {item.description && (
                  <div className="mt-0.5 truncate text-[10px] text-muted-foreground">{item.description}</div>
                )}
              </div>
              {item.included ? (
                <Eye className="size-3.5 shrink-0 text-primary/60" />
              ) : (
                <EyeOff className="size-3.5 shrink-0 text-muted-foreground/40" />
              )}
            </div>
          ))
        )}
      </div>
      <div className="shrink-0 border-t p-3">
        <button
          className="w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          onClick={onOpenPage}
          type="button"
        >
          Preview Worksheet
        </button>
      </div>
    </div>
  );
}

// ── Workflows panel ─────────────────────────────────────────────────────────────
// The workflows we've built, as a switcher. Clicking one loads its template onto
// the canvas (build snapshot → canvas → atoms), replacing what's open. This panel
// took the slot the Inspector/Preview panels used to occupy — inspecting, editing
// and previewing blocks now happens through the chat + the block config overlay.

type BuiltWorkflow = {
  id: string;
  name: string;
  sub: string;
  snapshot: ReturnType<typeof createFapiTemplateWorkflow>;
};

function WorkflowsListContent({ onLoaded }: { onLoaded: () => void }) {
  const workflowName = useAtomValue(currentWorkflowNameAtom);
  const setNodes = useSetAtom(nodesAtom);
  const setEdges = useSetAtom(edgesAtom);
  const setCurrentWorkflowName = useSetAtom(currentWorkflowNameAtom);
  const setSelectedNode = useSetAtom(selectedNodeAtom);
  const setSelectedEdge = useSetAtom(selectedEdgeAtom);
  const setSelectedExecutionId = useSetAtom(selectedExecutionIdAtom);
  const setHasUnsavedChanges = useSetAtom(hasUnsavedChangesAtom);

  // Build each registered workflow's snapshot once — reused for the name shown,
  // the "currently open" highlight, and the click-to-load (no rebuild). Only
  // workflows with a runnable run-config are listed (surplus is not built yet).
  const built: BuiltWorkflow[] = useMemo(
    () =>
      WORKFLOWS.flatMap((w) => {
        const cfg = getWorkflowConfig(w.id);
        if (!cfg) return [];
        const snapshot = cfg.buildSnapshot() as ReturnType<
          typeof createFapiTemplateWorkflow
        >;
        return [{ id: w.id, name: w.name, sub: w.sub, snapshot }];
      }),
    []
  );

  function load(item: BuiltWorkflow) {
    const canvas = workflowDefinitionToCanvas(item.snapshot);
    const selected = canvas.nodes.find((n) => n.selected) || canvas.nodes[0];
    setNodes(
      canvas.nodes.map((node) => ({
        ...node,
        selected: selected ? node.id === selected.id : false,
        data: { ...node.data, status: "idle" as const },
      }))
    );
    setEdges(canvas.edges);
    setCurrentWorkflowName(item.snapshot.name);
    setSelectedNode(selected?.id ?? null);
    setSelectedEdge(null);
    setSelectedExecutionId(null);
    setHasUnsavedChanges(false);
    saveWorkflowDefinitionSnapshot(item.snapshot);
    toast.success(`Opened ${item.snapshot.name}`);
    onLoaded();
  }

  return (
    <div className="flex h-full flex-col">
      <div className="border-b bg-muted/20 px-4 py-1.5 text-[10px] text-muted-foreground">
        {built.length} workflow{built.length === 1 ? "" : "s"} you&apos;ve built
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {built.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No built workflows are registered yet.
          </div>
        ) : (
          built.map((item) => {
            const isOpen = workflowName === item.snapshot.name;
            return (
              <button
                className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/40 ${isOpen ? "bg-primary/5" : ""}`}
                key={item.id}
                onClick={() => load(item)}
                type="button"
              >
                <span
                  className={`flex size-7 shrink-0 items-center justify-center rounded-md border ${isOpen ? "border-primary/40 bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground"}`}
                >
                  <Workflow className="size-3.5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className={`truncate text-sm font-medium ${isOpen ? "text-foreground" : ""}`}>
                      {item.name}
                    </span>
                    {isOpen && (
                      <span className="shrink-0 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-medium uppercase text-primary">
                        Open
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-muted-foreground">
                    {item.sub}
                  </span>
                </span>
                {isOpen && <Check className="size-4 shrink-0 text-primary" />}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────

export function RightPanelShell({ isMobile }: { isMobile: boolean }) {
  const [activePanel, setActivePanel] = useAtom(activeRightPanelAtom);
  const setRightPanelWidth = useSetAtom(rightPanelWidthAtom);
  const setIsPanelAnimating = useSetAtom(isPanelAnimatingAtom);
  const [pageViewOpen, setPageViewOpen] = useState(false);

  const isOpen = activePanel !== null && !isMobile;

  useEffect(() => {
    setIsPanelAnimating(true);
    setRightPanelWidth(isOpen ? PANEL_WIDTH : null);
    const timer = setTimeout(() => setIsPanelAnimating(false), 350);
    return () => clearTimeout(timer);
  }, [isOpen, setRightPanelWidth, setIsPanelAnimating]);

  const close = () => {
    setActivePanel(null);
    setPageViewOpen(false);
  };

  return (
    <>
      <div
        className="pointer-events-auto absolute inset-y-0 right-0 z-20 flex flex-col border-l bg-background transition-transform duration-300 ease-out"
        style={{
          width: PANEL_WIDTH,
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {activePanel && (
          <>
            <div className="flex h-10 shrink-0 items-center justify-between border-b px-3">
              <span className="text-sm font-medium">{PANEL_TITLES[activePanel]}</span>
              <button
                className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={close}
                type="button"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              {activePanel === "workflows" && (
                <WorkflowsListContent onLoaded={close} />
              )}
              {activePanel === "pages" && (
                <PagesContent onOpenPage={() => setPageViewOpen(true)} />
              )}
              {activePanel === "settings" && <SettingsContent />}
            </div>
          </>
        )}
      </div>
      {pageViewOpen && (
        <WorksheetPageView onClose={() => setPageViewOpen(false)} />
      )}
    </>
  );
}
