

import { Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Button } from "@/shared/ui/button";
import type { WorkflowBlock } from "@/shared/workflow-engine/local-fiscal-workflow";
import {
  getAggregationRuleMode,
  getAggregationRuleModeDescription,
  getAggregationRuleModeLabel,
} from "./aggregation-rule-modes";
import { AggregationCascadeNav } from "./aggregation-rules-overview";
import {
  AggregationRuleSourceEditor,
  getAggregationRules,
  NEW_AGGREGATION_RULE_NODE_ID,
} from "./rule-source-editor";

// ── Right panel: node output summary ─────────────────────────────────────────

function AggregationNodeOutputPanel({
  rule,
}: {
  rule: Record<string, unknown>;
}) {
  const mode = getAggregationRuleMode(rule);
  const modeLabel = getAggregationRuleModeLabel(rule);
  const modeDesc = getAggregationRuleModeDescription(rule);

  const categoryIds = Array.isArray(rule.includeCategoryIds)
    ? rule.includeCategoryIds.map(String).filter(Boolean)
    : [];
  const children = Array.isArray(rule.children)
    ? rule.children.map(String).filter(Boolean)
    : [];
  const formulaExpression = String(
    rule.formulaExpression || rule.expression || ""
  ).trim();
  const resultName = String(rule.resultName || "").trim();
  const outputRole = String(rule.outputRole || "").trim();
  const nodeId = String(rule.nodeId || "");
  const operation = String(rule.operation || "sum");
  const value = rule.value !== undefined ? String(rule.value) : null;

  const operandRefs = Array.isArray(rule.operands)
    ? rule.operands
        .map((op) => {
          if (typeof op === "object" && op !== null) {
            const o = op as Record<string, unknown>;
            if (o.refType === "category") return `cat:${o.refId}`;
            if (o.refType === "node") return `node:${o.refId}`;
            if (o.refType === "constant") return String(o.value ?? 0);
          }
          return String(op);
        })
        .filter(Boolean)
    : [];

  return (
    <div className="space-y-4 p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        Output
      </div>

      {/* Mode */}
      <div className="space-y-1">
        <span className="rounded-full bg-muted/50 px-2 py-0.5 text-[10px] uppercase">
          {modeLabel}
        </span>
        <div className="mt-1.5 text-[11px] text-muted-foreground">{modeDesc}</div>
      </div>

      {/* Node ID + operation */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs">
        <span className="text-muted-foreground">Node ID</span>
        <span className="truncate text-right font-mono text-[11px]">{nodeId}</span>
        <span className="text-muted-foreground">Operation</span>
        <span className="text-right font-medium">{operation}</span>
      </div>

      {/* Formula expression */}
      {formulaExpression && (
        <div className="space-y-1">
          <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Formula
          </div>
          <code className="block break-all rounded bg-muted/30 px-2 py-1.5 text-[11px] leading-relaxed">
            {formulaExpression}
          </code>
        </div>
      )}

      {/* Constant value */}
      {mode === "constant" && value !== null && (
        <div className="space-y-1">
          <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Value
          </div>
          <div className="font-mono text-base font-semibold">{value}</div>
        </div>
      )}

      {/* Result name */}
      {resultName && (
        <div className="space-y-1">
          <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Result name
          </div>
          <div className="font-mono text-xs">{resultName}</div>
        </div>
      )}

      {/* Output role */}
      {outputRole && (
        <div className="space-y-1">
          <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Output role
          </div>
          <div className="font-mono text-xs">{outputRole}</div>
        </div>
      )}

      {/* Included categories */}
      {categoryIds.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Includes ({categoryIds.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {categoryIds.map((id) => (
              <span
                className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px]"
                key={id}
              >
                {id}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Child nodes */}
      {children.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Child nodes ({children.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {children.map((id) => (
              <span
                className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-700 dark:bg-blue-950/60 dark:text-blue-300"
                key={id}
              >
                {id}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Operand refs (formula terms) */}
      {operandRefs.length > 0 && (
        <div className="space-y-1">
          <div className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Operands ({operandRefs.length})
          </div>
          <div className="flex flex-wrap gap-1">
            {operandRefs.map((ref, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: operand refs may duplicate
              <span
                className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[10px]"
                key={i}
              >
                {ref}
              </span>
            ))}
          </div>
        </div>
      )}

      {categoryIds.length === 0 &&
        children.length === 0 &&
        operandRefs.length === 0 &&
        !formulaExpression && (
          <div className="py-4 text-center text-xs text-muted-foreground">
            Configure this node in the editor
            <br />
            to see its output here.
          </div>
        )}
    </div>
  );
}

// ── Three-panel aggregation rulebook editor ───────────────────────────────────

export function AggregationRulebookEditor({
  block,
  config,
  disabled,
  onConfigPatch,
  onCreateSourceVersion,
  onSelectedNodeIdChange,
  selectedNodeId: controlledSelectedNodeId,
  showRulebookOverview = true,
  sourceLocked,
  sourceUsedInRun,
  sourceVersion,
}: {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  disabled?: boolean;
  onConfigPatch: (patch: Record<string, unknown>) => void;
  onCreateSourceVersion: () => void;
  onSelectedNodeIdChange?: (nodeId: string) => void;
  selectedNodeId?: string;
  showRulebookOverview?: boolean;
  sourceLocked: boolean;
  sourceUsedInRun: boolean;
  sourceVersion: number;
}) {
  const rules = useMemo(() => getAggregationRules(config), [config]);

  const [localSelectedNodeId, setLocalSelectedNodeId] = useState(() =>
    String(rules[0]?.nodeId || "")
  );

  const selectedNodeId = controlledSelectedNodeId ?? localSelectedNodeId;

  const setSelectedNodeId = useCallback(
    (nodeId: string) => {
      setLocalSelectedNodeId(nodeId);
      onSelectedNodeIdChange?.(nodeId);
    },
    [onSelectedNodeIdChange]
  );

  const selectedRule =
    rules.find((r) => String(r.nodeId) === selectedNodeId) ?? null;

  // Fall back to the inner editor directly when the cascade is suppressed
  if (!showRulebookOverview) {
    return (
      <AggregationRuleSourceEditor
        block={block}
        config={config}
        disabled={disabled}
        onConfigPatch={onConfigPatch}
        onCreateSourceVersion={onCreateSourceVersion}
        onSelectedNodeIdChange={setSelectedNodeId}
        selectedNodeId={selectedNodeId}
        showRulebookOverview={false}
        sourceLocked={sourceLocked}
        sourceUsedInRun={sourceUsedInRun}
        sourceVersion={sourceVersion}
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-md border">
      {/* Header bar */}
      <div className="flex items-center justify-between border-b bg-muted/20 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">Aggregation Rulebook</span>
          <span className="rounded-full border bg-background/70 px-2 py-0.5 text-[10px] uppercase">
            {rules.length} node{rules.length === 1 ? "" : "s"}
          </span>
        </div>
        <p className="hidden text-muted-foreground text-xs sm:block">
          Build rollup groups, formulas, and final outputs from mapped
          categories.
        </p>
      </div>

      {/* Three-panel body */}
      <div className="flex h-[620px]">
        {/* Left panel: cascade navigator */}
        <div className="flex w-60 shrink-0 flex-col border-r">
          <div className="flex items-center justify-between border-b px-2 py-1.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
              Nodes
            </span>
            {!sourceLocked && !disabled && (
              <Button
                className="h-6 gap-0.5 px-1.5 text-[11px]"
                onClick={() => setSelectedNodeId(NEW_AGGREGATION_RULE_NODE_ID)}
                size="sm"
                type="button"
                variant="ghost"
              >
                <Plus className="size-3" />
                New
              </Button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto">
            <AggregationCascadeNav
              onSelectRule={setSelectedNodeId}
              rules={rules}
              selectedNodeId={selectedNodeId}
            />
          </div>
        </div>

        {/* Middle panel: existing editor (cascade hidden internally) */}
        <div className="min-w-0 flex-1 overflow-y-auto">
          <AggregationRuleSourceEditor
            block={block}
            config={config}
            disabled={disabled}
            onConfigPatch={onConfigPatch}
            onCreateSourceVersion={onCreateSourceVersion}
            onSelectedNodeIdChange={setSelectedNodeId}
            selectedNodeId={selectedNodeId}
            showRulebookOverview={false}
            sourceLocked={sourceLocked}
            sourceUsedInRun={sourceUsedInRun}
            sourceVersion={sourceVersion}
          />
        </div>

        {/* Right panel: output summary of the saved node */}
        <div className="w-52 shrink-0 overflow-y-auto border-l bg-muted/10">
          {selectedRule ? (
            <AggregationNodeOutputPanel rule={selectedRule} />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center text-xs text-muted-foreground">
              {selectedNodeId === NEW_AGGREGATION_RULE_NODE_ID
                ? "Save the new node to see its output here."
                : "Select a node to see its output."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
