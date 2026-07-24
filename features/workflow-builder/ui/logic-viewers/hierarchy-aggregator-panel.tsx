"use client";

import { ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/shared/ui/button";
import type {
  LocalRunRecord,
  WorkflowBlock,
} from "@/shared/workflow-engine/local-fiscal-workflow";
import type { WorkflowEdge, WorkflowNode } from "@/shared/workflow-engine/state/workflow-store";
import { SUPPORTED_AGGREGATION_OPERATIONS } from "../source-viewers/aggregation-rule-modes";
import { AggregationRulesOverview } from "../source-viewers/aggregation-rules-overview";
import {
  getAggregationRules,
  getKeywordRules,
} from "../source-viewers/rule-source-editor";
import { HierarchyAggregatorRunSections } from "./hierarchy-aggregator-run-sections";

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function getBlockLabel(nodes: WorkflowNode[], blockId: string) {
  return (
    nodes.find((node) => node.id === blockId)?.data.block?.label || blockId
  );
}

function getLatestOutput(blockId: string, lastRun?: LocalRunRecord) {
  const log = lastRun?.logs.find((item) => item.nodeId === blockId);
  const result = asRecord(log?.output);
  return asRecord(result?.output) || result || {};
}

function getConnectedSource({
  edges,
  nodes,
  roleId,
  targetBlockId,
}: {
  edges: WorkflowEdge[];
  nodes: WorkflowNode[];
  roleId: string;
  targetBlockId: string;
}) {
  const edge = edges.find(
    (item) =>
      item.target === targetBlockId &&
      item.data?.workflowEdge?.targetInputRole === roleId
  );

  return edge
    ? {
        edge,
        label: getBlockLabel(nodes, edge.source),
        sourceNodeId: edge.source,
      }
    : undefined;
}

function getBlockById(nodes: WorkflowNode[], blockId?: string) {
  if (!blockId) {
    return;
  }
  return nodes.find((node) => node.id === blockId)?.data.block;
}

function getConnectedKeywordRules({
  edges,
  keywordMapperNodeId,
  nodes,
}: {
  edges: WorkflowEdge[];
  keywordMapperNodeId?: string;
  nodes: WorkflowNode[];
}) {
  if (!keywordMapperNodeId) {
    return [];
  }
  const keywordRuleEdge = edges.find(
    (edge) =>
      edge.target === keywordMapperNodeId &&
      edge.data?.workflowEdge?.targetInputRole === "keyword_rules"
  );
  const keywordRuleBlock = getBlockById(nodes, keywordRuleEdge?.source);
  return keywordRuleBlock ? getKeywordRules(keywordRuleBlock.config || {}) : [];
}

function ConnectionCard({
  action,
  description,
  label,
  status,
  title,
}: {
  action?: ReactNode;
  description: string;
  label?: string;
  status: "connected" | "missing";
  title: string;
}) {
  return (
    <div className="rounded-md border bg-background/70 p-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="font-medium text-sm">{title}</div>
          <div className="mt-1 text-muted-foreground text-xs">
            {description}
          </div>
        </div>
        <span className="rounded-full border bg-muted/30 px-2 py-0.5 text-[10px] uppercase">
          {status}
        </span>
      </div>
      <div className="mt-2 text-sm">
        {label || <span className="text-muted-foreground">Not connected</span>}
      </div>
      {action && <div className="mt-3">{action}</div>}
    </div>
  );
}

export function HierarchyAggregatorPanel({
  block,
  edges,
  lastRun,
  nodes,
  onOpenRuleSource,
}: {
  block: WorkflowBlock;
  edges: WorkflowEdge[];
  lastRun?: LocalRunRecord;
  nodes: WorkflowNode[];
  onOpenRuleSource: (nodeId: string) => void;
}) {
  const output = getLatestOutput(block.id, lastRun);
  const mappedRowsConnection = getConnectedSource({
    edges,
    nodes,
    roleId: "mapped_rows",
    targetBlockId: block.id,
  });
  const aggregationRulesConnection = getConnectedSource({
    edges,
    nodes,
    roleId: "aggregation_rules",
    targetBlockId: block.id,
  });
  const aggregationRulesBlock = getBlockById(
    nodes,
    aggregationRulesConnection?.sourceNodeId
  );
  const aggregationRules = aggregationRulesBlock
    ? getAggregationRules(aggregationRulesBlock.config || {})
    : [];
  const keywordRules = getConnectedKeywordRules({
    edges,
    keywordMapperNodeId: mappedRowsConnection?.sourceNodeId,
    nodes,
  });

  return (
    <div className="space-y-4 rounded-md border bg-muted/20 p-3">
      <div>
        <div className="font-semibold text-sm">Rollup & Calculation Engine</div>
        <p className="mt-1 text-muted-foreground text-xs">
          Groups mapped categories into rollups and evaluates calculator/formula
          nodes to produce final totals.
        </p>
      </div>

      <div className="grid gap-2 lg:grid-cols-3">
        {[
          ["1", "Group rows by category"],
          ["2", "Evaluate rollup and formula nodes"],
          ["3", "Emit final totals and trace"],
        ].map(([step, label]) => (
          <div className="rounded-md border bg-background/70 p-3" key={step}>
            <div className="text-muted-foreground text-xs">Step {step}</div>
            <div className="mt-1 font-medium text-sm">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-3 xl:grid-cols-3">
        <div className="rounded-md border bg-background/70 p-3">
          <div className="font-medium text-sm">Internal modes</div>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
            {[
              "Rollup nodes",
              "Formula nodes",
              "Constants",
              "Final result nodes",
              "Official line outputs",
            ].map((mode) => (
              <span className="rounded-md bg-muted/30 px-2 py-1" key={mode}>
                {mode}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-md border bg-background/70 p-3">
          <div className="font-medium text-sm">Supported operations</div>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
            {SUPPORTED_AGGREGATION_OPERATIONS.map((operation) => (
              <code
                className="rounded-md bg-muted/30 px-2 py-1"
                key={operation}
              >
                {operation}
              </code>
            ))}
          </div>
        </div>
        <div className="rounded-md border bg-background/70 p-3">
          <div className="font-medium text-sm">Output roles</div>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
            {[
              "category_totals",
              "node_totals",
              "group_totals",
              "final_totals",
              "official_line_values",
              "aggregation_tree",
              "included_rows_by_node",
              "excluded_rows",
              "formula_trace",
              "aggregation_summary",
            ].map((role) => (
              <code className="rounded-md bg-muted/30 px-2 py-1" key={role}>
                {role}
              </code>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <ConnectionCard
          description="mapped_rows from Keyword Mapper."
          label={mappedRowsConnection?.label}
          status={mappedRowsConnection ? "connected" : "missing"}
          title="Mapped rows input"
        />
        <ConnectionCard
          action={
            aggregationRulesConnection && (
              <Button
                onClick={() =>
                  onOpenRuleSource(aggregationRulesConnection.sourceNodeId)
                }
                size="sm"
                type="button"
                variant="secondary"
              >
                <ExternalLink className="mr-2 size-3.5" />
                Open rules
              </Button>
            )
          }
          description="aggregation_rules from Aggregation Rulebook."
          label={aggregationRulesConnection?.label}
          status={aggregationRulesConnection ? "connected" : "missing"}
          title="Aggregation rules input"
        />
      </div>

      {aggregationRules.length > 0 && (
        <AggregationRulesOverview
          keywordRules={keywordRules}
          nodeTotals={asRecord(output.nodeTotals) || undefined}
          rules={aggregationRules}
        />
      )}

      <HierarchyAggregatorRunSections compact output={output} />
    </div>
  );
}
