"use client";

import { ArrowLeft, FileText } from "lucide-react";
import { useState } from "react";
import { useAtomValue } from "jotai";
import { loadLocalRunRecords, type WorkflowBlock } from "@/lib/local-fiscal-workflow";
import {
  currentWorkflowNameAtom,
  edgesAtom,
  nodesAtom,
  type WorkflowEdge,
  type WorkflowNode,
} from "@/lib/workflow-store";
import {
  extractFieldEntries,
  FieldRow,
  getBackendOutputs,
  SourceDetailPanel,
  type SourcePanelState,
} from "./logic-viewers/field-block-workspace";

// ── types ─────────────────────────────────────────────────────────────────────

type PagePanelState = {
  panelState: SourcePanelState;
  fieldBlock: WorkflowBlock;
};

// ── SectionContent ─────────────────────────────────────────────────────────────

function SectionContent({
  fieldNode,
  nodes,
  edges,
  lastRun,
  activePanel,
  onSetPanel,
}: {
  fieldNode: WorkflowNode;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  lastRun: ReturnType<typeof loadLocalRunRecords>[number] | undefined;
  activePanel: PagePanelState | null;
  onSetPanel: (p: PagePanelState | null) => void;
}) {
  const block = fieldNode.data.block as WorkflowBlock;

  const upstreamIds = edges
    .filter((e) => e.target === fieldNode.id)
    .map((e) => e.source);

  const sourceGroups = upstreamIds
    .map((upstreamId) => {
      const sourceNode = nodes.find((n) => n.id === upstreamId);
      const sourceLabel = sourceNode?.data.label || upstreamId;
      const sourceSubtype = sourceNode?.data.block?.subtype;
      const backendOutputs = getBackendOutputs(upstreamId, lastRun);
      return {
        sourceId: upstreamId,
        sourceLabel,
        sourceSubtype,
        entries: extractFieldEntries(backendOutputs),
      };
    })
    .filter((g) => g.entries.length > 0);

  if (sourceGroups.length === 0) return null;

  return (
    <div>
      {/* section header */}
      <div className="flex items-center gap-3 border-b bg-muted/40 px-4 py-2">
        <span className="size-1.5 shrink-0 rounded-full bg-violet-400" />
        <span className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">
          {fieldNode.data.label || block.id}
        </span>
        {fieldNode.data.description && (
          <span className="text-[10px] text-muted-foreground/60">
            — {fieldNode.data.description}
          </span>
        )}
      </div>

      {/* column headers */}
      <div className="flex items-center gap-3 border-b bg-muted/20 px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
        <span className="w-4 shrink-0" />
        <span className="w-28 shrink-0">Line</span>
        <span className="flex-1">Description</span>
        <span className="shrink-0">Amount</span>
        <span className="w-10 shrink-0 text-right">CCY</span>
        <span className="w-10 shrink-0" />
      </div>

      {/* rows */}
      {sourceGroups.map((group) =>
        group.entries.map((entry) => {
          const activeSubId =
            activePanel?.panelState.parentLabel === entry.label
              ? activePanel.panelState.sub.id
              : null;

          return (
            <FieldRow
              activeSubId={activeSubId}
              entry={entry}
              key={`${group.sourceId}:${entry.key}`}
              onShowEvidence={(sub) =>
                onSetPanel((prev) =>
                  prev?.panelState.sub.id === sub.id &&
                  prev?.panelState.parentLabel === entry.label &&
                  prev?.panelState.initialTab === "evidence"
                    ? null
                    : {
                        panelState: {
                          sub,
                          parentLabel: entry.label,
                          blockLabel: group.sourceLabel,
                          sourceId: group.sourceId,
                          initialTab: "evidence",
                        },
                        fieldBlock: block,
                      }
                )
              }
              onShowHistory={(sub) =>
                onSetPanel((prev) =>
                  prev?.panelState.sub.id === sub.id &&
                  prev?.panelState.parentLabel === entry.label &&
                  prev?.panelState.initialTab === "history"
                    ? null
                    : {
                        panelState: {
                          sub,
                          parentLabel: entry.label,
                          blockLabel: group.sourceLabel,
                          sourceId: group.sourceId,
                          initialTab: "history",
                        },
                        fieldBlock: block,
                      }
                )
              }
            />
          );
        })
      )}
    </div>
  );
}

// ── WorksheetPageView ──────────────────────────────────────────────────────────

export function WorksheetPageView({ onClose }: { onClose: () => void }) {
  const workflowName = useAtomValue(currentWorkflowNameAtom);
  const nodes = useAtomValue(nodesAtom);
  const edges = useAtomValue(edgesAtom);
  const lastRun = loadLocalRunRecords()[0];
  const [activePanel, setActivePanel] = useState<PagePanelState | null>(null);

  const visibleFieldNodes = nodes.filter(
    (n) =>
      n.data.block?.family === "Field" &&
      n.data.block?.runtime?.visible !== false
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* top bar */}
      <div className="flex shrink-0 items-center gap-3 border-b bg-muted/20 px-5 py-3">
        <button
          className="flex items-center gap-1.5 rounded px-2 py-1 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={onClose}
          type="button"
        >
          <ArrowLeft className="size-4" />
          Back to Workflow
        </button>
        <div className="h-4 w-px bg-border" />
        <div className="flex items-center gap-2">
          <FileText className="size-4 text-muted-foreground" />
          <span className="font-semibold text-sm">
            {workflowName || "Untitled Workflow"}
          </span>
          <span className="text-xs text-muted-foreground">— Worksheet</span>
        </div>
      </div>

      {/* two-panel body */}
      <div className="flex min-h-0 flex-1 overflow-hidden">
        {/* left: scrollable content */}
        <div className="min-h-0 flex-1 overflow-y-auto bg-background">
          <div className="mx-auto w-1/2">
          {visibleFieldNodes.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-4 py-32 text-center">
              <FileText className="size-10 text-muted-foreground/30" />
              <div>
                <p className="font-medium text-muted-foreground">
                  No display blocks selected
                </p>
                <p className="mt-1 text-sm text-muted-foreground/60">
                  Go back and use the Pages menu to select blocks to include.
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y">
              {visibleFieldNodes.map((node) => (
                <SectionContent
                  activePanel={activePanel}
                  edges={edges}
                  fieldNode={node}
                  key={node.id}
                  lastRun={lastRun}
                  nodes={nodes}
                  onSetPanel={setActivePanel}
                />
              ))}
            </div>
          )}
          </div>
        </div>

        {/* right: evidence panel */}
        {activePanel && (
          <div className="w-[420px] shrink-0 border-l">
            <SourceDetailPanel
              block={activePanel.fieldBlock}
              edges={edges}
              lastRun={lastRun}
              nodes={nodes}
              onClose={() => setActivePanel(null)}
              state={activePanel.panelState}
            />
          </div>
        )}
      </div>
    </div>
  );
}
