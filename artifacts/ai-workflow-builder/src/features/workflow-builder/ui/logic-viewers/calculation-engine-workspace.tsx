

import { ChevronDown, ChevronRight, Lock, Play } from "lucide-react";
import { useCallback, useState } from "react";
import type { LocalRunRecord, WorkflowBlock } from "@/shared/workflow-engine/local-fiscal-workflow";
import type { WorkflowEdge, WorkflowNode } from "@/shared/workflow-engine/state/workflow-store";
import { BlockDataFlowColumn } from "../workspace/block-data-flow-pane";
import { CalculationEngineEditor } from "./calculation-engine-editor";

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
        (e.data?.workflowEdge?.targetInputRole === "calculation_rules" ||
          e.data?.targetInputRole === "calculation_rules")
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
            "calculation_rules",
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

export function CalculationEngineWorkspace({
  block,
  createTermRequest,
  disabled,
  edges,
  insertRequest,
  lastRun,
  lastRunOutput,
  nodes,
  onConfigPatch,
  onRuleConfigPatch,
  onExecuteStep,
  onSelectedTermIdChange,
  selectedTermId,
}: {
  block: WorkflowBlock;
  createTermRequest?: number;
  disabled: boolean;
  edges: WorkflowEdge[];
  insertRequest?: { id: string; key: string } | null;
  lastRun?: LocalRunRecord;
  lastRunOutput: Record<string, unknown>;
  nodes: WorkflowNode[];
  onConfigPatch: (patch: Record<string, unknown>) => void;
  onRuleConfigPatch?: (id: string, patch: Record<string, unknown>) => void;
  onExecuteStep?: () => void;
  onSelectedTermIdChange?: (termId: string | null) => void;
  selectedTermId?: string | null;
}) {
  const connectedSources = getConnectedSources(block, edges, nodes);
  const hasConnectedRulebook = connectedSources.length > 0;

  let workspaceContent: React.ReactNode;

  if (hasConnectedRulebook) {
    const primary = connectedSources[0];
    workspaceContent = (
      <>
        <div className="border-b px-3 py-2 text-xs text-muted-foreground">Rules from {primary.label}. Edits update this workflow?s connected rulebook.</div>
        <div className="min-h-0 flex-1 overflow-hidden">
          <CalculationEngineEditor
            block={primary.block}
            inputContextBlock={block}
            createTermRequest={createTermRequest}
            insertRequest={insertRequest}
            onSelectedTermIdChange={onSelectedTermIdChange}
            selectedTermId={selectedTermId}
            disabled={disabled || !onRuleConfigPatch}
            edges={edges}
            fill
            lastRunOutput={lastRunOutput}
            nodes={nodes}
            onUpdateConfig={(key, value) => onRuleConfigPatch?.(primary.block.id, { [key]: value })}
          />
        </div>
      </>
    );
  } else {
    workspaceContent = (
      <div className="min-h-0 flex-1 overflow-hidden">
        <CalculationEngineEditor
          block={block}
          createTermRequest={createTermRequest}
          disabled={disabled}
          edges={edges}
          fill
          insertRequest={insertRequest}
          lastRunOutput={lastRunOutput}
          nodes={nodes}
          onSelectedTermIdChange={onSelectedTermIdChange}
          onUpdateConfig={(key, value) => onConfigPatch({ [key]: value })}
          selectedTermId={selectedTermId}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {workspaceContent}
      </div>

    </div>
  );
}
