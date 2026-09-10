

import { ChevronDown, ChevronRight, Lock, Play } from "lucide-react";
import { useCallback, useState } from "react";
import type { LocalRunRecord, WorkflowBlock } from "@/shared/workflow-engine/local-fiscal-workflow";
import type { WorkflowEdge, WorkflowNode } from "@/shared/workflow-engine/state/workflow-store";
import { RollupRulebookEditor } from "../source-viewers/rollup-rulebook-editor";
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

// Returns categories from upstream Keyword Mapper / Keyword Rules blocks.
// Returns undefined when no keyword-related block is connected (enables text-input fallback).
// Returns [] when a keyword block IS connected but has no categories yet.
function getConnectedKeywordCategories(
  block: WorkflowBlock,
  edges: WorkflowEdge[],
  nodes: WorkflowNode[]
): { id: string; label: string }[] | undefined {
  const seen = new Set<string>();
  const result: { id: string; label: string }[] = [];
  let foundKeywordBlock = false;

  const tryBlock = (b: WorkflowBlock) => {
    const rules = getKeywordRules(b.config || {});
    if (rules.length === 0) return;
    foundKeywordBlock = true;
    for (const rule of rules) {
      const id = String(rule.categoryId || rule.category || "").trim();
      if (!id || seen.has(id)) continue;
      seen.add(id);
      result.push({ id, label: String(rule.categoryLabel || rule.label || id) });
    }
  };

  const isKeywordRelated = (b: WorkflowBlock) => {
    const toolId = String(b.config?.toolId || "");
    const subtype = String(b.subtype || "");
    const sourceKind = String(b.config?.sourceKind || "").toLowerCase();
    return (
      toolId === "logic.keyword_mapper" ||
      subtype === "Classification / Mapping" ||
      subtype === "Keyword Rules" ||
      sourceKind.includes("keyword")
    );
  };

  const getBlock = (nodeId: string) => {
    const n = nodes.find((n) => n.id === nodeId);
    return n?.data?.block as WorkflowBlock | undefined;
  };

  for (const edge of edges.filter((e) => e.target === block.id)) {
    const src = getBlock(edge.source);
    if (!src) continue;
    if (isKeywordRelated(src)) foundKeywordBlock = true;
    tryBlock(src);

    for (const innerEdge of edges.filter((e) => e.target === src.id)) {
      const ss = getBlock(innerEdge.source);
      if (!ss) continue;
      if (isKeywordRelated(ss)) foundKeywordBlock = true;
      tryBlock(ss);
    }
  }

  if (!foundKeywordBlock) return undefined;
  return result.sort((a, b) => a.id.localeCompare(b.id));
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
        (e.data?.workflowEdge?.targetInputRole === "rollup_rules" ||
          e.data?.targetInputRole === "rollup_rules")
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
            "rollup_rules",
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

export function AggregatorWorkspace({
  block,
  disabled,
  edges,
  lastRun,
  nodes,
  onConfigPatch,
  onExecuteStep,
}: {
  block: WorkflowBlock;
  disabled?: boolean;
  edges: WorkflowEdge[];
  lastRun?: LocalRunRecord;
  nodes: WorkflowNode[];
  onConfigPatch: (patch: Record<string, unknown>) => void;
  onExecuteStep?: () => void;
}) {
  const connectedSources = getConnectedSources(block, edges, nodes);
  const hasConnectedRulebook = connectedSources.length > 0;
  // undefined = no keyword mapper wired (show text input); [] = mapper wired but no categories yet
  const availableCategories = getConnectedKeywordCategories(block, edges, nodes);

  let workspaceContent: React.ReactNode;

  if (hasConnectedRulebook) {
    const primary = connectedSources[0];
    workspaceContent = (
      <>
        <ReadOnlyBanner
          label={`${primary.label}${connectedSources.length > 1 ? ` +${connectedSources.length - 1} more` : ""}`}
        />
        <div className="min-h-0 flex-1 overflow-hidden">
          <RollupRulebookEditor
            availableCategories={availableCategories}
            config={primary.block.config || {}}
            disabled
            fill
            onConfigPatch={() => {}}
          />
        </div>
      </>
    );
  } else {
    workspaceContent = (
      <div className="min-h-0 flex-1 overflow-hidden">
        <RollupRulebookEditor
          availableCategories={availableCategories}
          config={block.config || {}}
          disabled={disabled}
          fill
          onConfigPatch={onConfigPatch}
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
