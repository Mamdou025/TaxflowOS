

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

    </div>
  );
}
