"use client";

import { ChevronDown, ChevronRight, Lock, Play } from "lucide-react";
import { useCallback, useState } from "react";
import type { LocalRunRecord, WorkflowBlock } from "@/shared/workflow-engine/local-fiscal-workflow";
import type { WorkflowEdge, WorkflowNode } from "@/shared/workflow-engine/state/workflow-store";
import { KeywordRulebookEditor } from "../source-viewers/keyword-rulebook-editor";
import { getKeywordRules } from "../source-viewers/rule-source-editor";
import { BlockDataFlowColumn } from "../workspace/block-data-flow-pane";

function getBlockLabel(nodes: WorkflowNode[], blockId: string) {
  const node = nodes.find((n) => n.id === blockId);
  return (
    (node?.data?.block as WorkflowBlock | undefined)?.label ||
    (node?.data as { label?: string } | undefined)?.label ||
    blockId
  );
}

type ConnectedSource = {
  nodeId: string;
  label: string;
  block: WorkflowBlock;
  edgeRole: string;
};

function getConnectedSources(
  block: WorkflowBlock,
  edges: WorkflowEdge[],
  nodes: WorkflowNode[]
): ConnectedSource[] {
  return edges
    .filter(
      (e) =>
        e.target === block.id &&
        (e.data?.workflowEdge?.targetInputRole === "keyword_rules" ||
          e.data?.targetInputRole === "keyword_rules")
    )
    .flatMap((e) => {
      const node = nodes.find((n) => n.id === e.source);
      const nodeBlock = node?.data?.block as WorkflowBlock | undefined;
      if (!node || !nodeBlock) return [];
      return [
        {
          nodeId: node.id,
          label: getBlockLabel(nodes, node.id),
          block: nodeBlock,
          edgeRole:
            (e.data?.workflowEdge?.targetInputRole as string | undefined) ||
            (e.data?.targetInputRole as string | undefined) ||
            "keyword_rules",
        },
      ];
    });
}

function ReadOnlyBanner({
  label,
  onClear,
}: {
  label: string;
  onClear?: () => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2 border-b bg-amber-50 px-3 py-1.5 dark:bg-amber-950/30">
      <Lock className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
      <span className="truncate text-xs text-amber-700 dark:text-amber-300">
        Viewing <strong>{label}</strong> — read-only
      </span>
      {onClear && (
        <button
          className="ml-auto shrink-0 text-[11px] text-amber-600 underline dark:text-amber-400"
          onClick={onClear}
          type="button"
        >
          Back to own config
        </button>
      )}
    </div>
  );
}

function InteractiveIOStrip({
  block,
  edges,
  lastRun,
  nodes,
  onExecuteStep,
}: {
  block: WorkflowBlock;
  edges: WorkflowEdge[];
  lastRun?: LocalRunRecord;
  nodes: WorkflowNode[];
  onExecuteStep?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [panelHeight, setPanelHeight] = useState(220);

  const onResizePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      const startY = e.clientY;
      const startHeight = panelHeight;
      const onMove = (ev: PointerEvent) => {
        const delta = startY - ev.clientY;
        setPanelHeight(Math.max(140, Math.min(560, startHeight + delta)));
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [panelHeight]
  );

  const incomingCount = edges.filter((e) => e.target === block.id).length;

  return (
    <div className="shrink-0 border-t bg-background">
      <div className="flex items-center">
        <button
          className="flex flex-1 items-center gap-2 px-3 py-2 text-left text-sm transition-colors hover:bg-muted/30"
          onClick={() => setOpen((v) => !v)}
          type="button"
        >
          {open ? (
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
          )}
          <span className="font-medium">Connected I/O</span>
          {incomingCount > 0 && (
            <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              {incomingCount} input{incomingCount !== 1 ? "s" : ""}
            </span>
          )}
          <span className="ml-auto text-[10px] opacity-60">
            {open ? "collapse" : "expand"}
          </span>
        </button>
        {onExecuteStep && (
          <button
            className="mr-3 flex shrink-0 items-center gap-1.5 rounded-md border border-primary/40 px-2.5 py-1 text-[11px] font-medium text-primary transition-colors hover:bg-primary/10"
            onClick={onExecuteStep}
            title="Run this step"
            type="button"
          >
            <Play className="size-3" />
            Run step
          </button>
        )}
      </div>

      {open && (
        <>
          <div
            className="h-1.5 w-full cursor-ns-resize bg-border/40 transition-colors hover:bg-primary/30 active:bg-primary/40"
            onPointerDown={onResizePointerDown}
            title="Drag to resize"
          />
          <div className="flex border-t" style={{ height: panelHeight }}>
            <div className="w-1/2 shrink-0 overflow-y-auto border-r">
              <BlockDataFlowColumn
                block={block}
                edges={edges}
                lastRun={lastRun}
                nodes={nodes}
                onExecuteStep={onExecuteStep}
                side="inputs"
              />
            </div>
            <div className="flex-1 overflow-y-auto">
              <BlockDataFlowColumn
                block={block}
                edges={edges}
                lastRun={lastRun}
                nodes={nodes}
                onExecuteStep={onExecuteStep}
                side="outputs"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function KeywordMapperWorkspace({
  block,
  disabled,
  edges,
  lastRun,
  nodes,
  onConfigPatch,
  onExecuteStep,
  onSelectedRuleIdChange,
  selectedRuleId,
  sourceVersion,
}: {
  block: WorkflowBlock;
  disabled?: boolean;
  edges: WorkflowEdge[];
  lastRun?: LocalRunRecord;
  nodes: WorkflowNode[];
  onConfigPatch: (patch: Record<string, unknown>) => void;
  onExecuteStep?: () => void;
  onSelectedRuleIdChange?: (ruleId: string) => void;
  selectedRuleId?: string;
  sourceVersion: number;
}) {
  const connectedSources = getConnectedSources(block, edges, nodes);
  const hasConnectedRulebook = connectedSources.length > 0;

  let workspaceContent: React.ReactNode;

  if (hasConnectedRulebook) {
    const primary = connectedSources[0];
    workspaceContent = (
      <>
        <ReadOnlyBanner
          label={`${primary.label}${connectedSources.length > 1 ? ` +${connectedSources.length - 1} more` : ""}`}
        />
        <div className="min-h-0 flex-1 overflow-hidden">
          <KeywordRulebookEditor
            disabled
            fill
            onRulesChange={() => {}}
            rules={getKeywordRules(primary.block.config || {})}
            sourceVersion={1}
          />
        </div>
      </>
    );
  } else {
    workspaceContent = (
      <div className="min-h-0 flex-1 overflow-hidden">
        <KeywordRulebookEditor
          disabled={disabled}
          fill
          onRulesChange={(rules) => onConfigPatch({ keywordRules: rules })}
          onSelectedRuleIdChange={onSelectedRuleIdChange}
          rules={getKeywordRules(block.config || {})}
          selectedRuleId={selectedRuleId}
          sourceVersion={sourceVersion}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {workspaceContent}
      </div>
      <InteractiveIOStrip
        block={block}
        edges={edges}
        lastRun={lastRun}
        nodes={nodes}
        onExecuteStep={onExecuteStep}
      />
    </div>
  );
}
