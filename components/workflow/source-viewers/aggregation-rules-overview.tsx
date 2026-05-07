"use client";

import { ChevronDown, Sigma } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  AGGREGATION_RULE_MODE_DESCRIPTIONS,
  type AggregationRuleMode,
  getAggregationRuleMode,
  getAggregationRuleModeDescription,
  getAggregationRuleModeLabel,
  SUPPORTED_AGGREGATION_OPERATIONS,
} from "./aggregation-rule-modes";

const MAX_KEYWORDS_SHOWN = 12;

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : null;
}

function asStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.map(String).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function getNodeRefFromOperand(value: unknown) {
  const record = asRecord(value);
  if (!record || record.refType !== "node") {
    return;
  }
  return String(record.refId || "").trim() || undefined;
}

function getConstantLabel(value: unknown) {
  const record = asRecord(value);
  if (!record || record.refType !== "constant") {
    return;
  }
  return String(record.label || record.value || 0);
}

function humanizeId(value: string) {
  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function getRuleId(rule: Record<string, unknown>) {
  return String(rule.nodeId || "").trim();
}

function getRuleLabel(rule: Record<string, unknown>) {
  const nodeId = getRuleId(rule);
  return String(rule.label || humanizeId(nodeId) || "Aggregation node");
}

function getOperationSymbol(operation: string) {
  if (operation === "sum_abs") {
    return " + | | ";
  }
  if (operation === "subtract") {
    return " - ";
  }
  if (operation === "multiply") {
    return " * ";
  }
  if (operation === "divide") {
    return " / ";
  }
  if (operation === "pass_through") {
    return " -> ";
  }
  if (operation === "max_subtract_zero") {
    return " max-subtract-zero ";
  }
  if (operation === "min_multiply_cap") {
    return " min-multiply-cap ";
  }
  return " + ";
}

function getOperandLabels(rule: Record<string, unknown>) {
  const operands = Array.isArray(rule.operands)
    ? rule.operands
        .map((operand) => {
          const record = asRecord(operand);
          if (!record) {
            return String(operand || "");
          }
          if (record.refType === "constant") {
            return String(record.label || record.value || 0);
          }
          return String(record.label || record.refId || "");
        })
        .filter(Boolean)
    : [];
  if (operands.length > 0) {
    return operands;
  }

  const children = asStringArray(rule.children);
  if (children.length > 0) {
    return children;
  }

  return asStringArray(rule.includeCategoryIds);
}

function getRuleExpression(rule: Record<string, unknown>) {
  const operation = String(rule.operation || "sum");
  const operands = getOperandLabels(rule);
  const nodeId = getRuleId(rule) || "node";
  const formulaExpression = String(
    rule.formulaExpression || rule.expression || ""
  ).trim();

  if (formulaExpression) {
    return `${nodeId} = ${formulaExpression}`;
  }

  if (operation === "pass_through") {
    return `${nodeId} = ${String(rule.value ?? operands[0] ?? 0)}`;
  }

  const body =
    operands.length > 0 ? operands.join(getOperationSymbol(operation)) : "0";
  return `${nodeId} = ${body}`;
}

function getNodeRefs(rule: Record<string, unknown>) {
  const operandRefs = Array.isArray(rule.operands)
    ? rule.operands.map(getNodeRefFromOperand).filter(Boolean)
    : [];
  return [...operandRefs, ...asStringArray(rule.children)].filter(
    (refId): refId is string => Boolean(refId)
  );
}

function getConstantOperands(rule: Record<string, unknown>) {
  const operands = Array.isArray(rule.operands)
    ? rule.operands.map(getConstantLabel)
    : [];
  return operands.filter((label): label is string => Boolean(label));
}

function getKeywordsByCategory(keywordRules: Record<string, unknown>[] = []) {
  const byCategory = new Map<
    string,
    {
      categoryLabel: string;
      keywords: string[];
      ruleIds: string[];
    }
  >();

  for (const rule of keywordRules) {
    const categoryId = String(rule.categoryId || rule.category || "").trim();
    if (!categoryId) {
      continue;
    }
    const existing = byCategory.get(categoryId) || {
      categoryLabel: String(rule.categoryLabel || humanizeId(categoryId)),
      keywords: [],
      ruleIds: [],
    };
    byCategory.set(categoryId, {
      categoryLabel: existing.categoryLabel,
      keywords: [...existing.keywords, ...asStringArray(rule.keywords)],
      ruleIds: [...existing.ruleIds, String(rule.ruleId || "")].filter(Boolean),
    });
  }

  return byCategory;
}

function getRootRules(rules: Record<string, unknown>[]) {
  const referencedNodeIds = new Set(rules.flatMap(getNodeRefs));
  const finals = rules.filter((rule) => rule.nodeType === "final_result");
  if (finals.length > 0) {
    return finals;
  }
  const unreferenced = rules.filter(
    (rule) => !referencedNodeIds.has(getRuleId(rule))
  );
  return unreferenced.length > 0 ? unreferenced : rules;
}

function collectReachableNodeIds(
  roots: Record<string, unknown>[],
  rulesById: Map<string, Record<string, unknown>>
) {
  const reachable = new Set<string>();
  const visit = (rule: Record<string, unknown>) => {
    const nodeId = getRuleId(rule);
    if (!nodeId || reachable.has(nodeId)) {
      return;
    }
    reachable.add(nodeId);
    for (const refId of getNodeRefs(rule)) {
      const child = rulesById.get(refId);
      if (child) {
        visit(child);
      }
    }
  };

  roots.forEach(visit);
  return reachable;
}

function CategoryCascadeItem({
  categoryId,
  keywordInfo,
  onSelectCategory,
  selected,
  showKeywords,
}: {
  categoryId: string;
  keywordInfo?: {
    categoryLabel: string;
    keywords: string[];
    ruleIds: string[];
  };
  onSelectCategory?: (categoryId: string) => void;
  selected?: boolean;
  showKeywords: boolean;
}) {
  const keywords = [...new Set(keywordInfo?.keywords || [])];
  const visibleKeywords = keywords.slice(0, MAX_KEYWORDS_SHOWN);
  const hiddenCount = Math.max(0, keywords.length - visibleKeywords.length);

  const content = (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded bg-muted/50 px-2 py-0.5 font-medium text-[10px] uppercase">
          Category
        </span>
        <span className="font-medium text-sm">
          {keywordInfo?.categoryLabel || humanizeId(categoryId)}
        </span>
        <code className="rounded bg-muted/30 px-1.5 py-0.5 text-muted-foreground text-xs">
          {categoryId}
        </code>
      </div>
      {showKeywords && keywords.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visibleKeywords.map((keyword) => (
            <span
              className="rounded-md bg-background/70 px-2 py-1 text-xs"
              key={keyword}
            >
              {keyword}
            </span>
          ))}
          {hiddenCount > 0 && (
            <span className="rounded-md bg-muted/40 px-2 py-1 text-muted-foreground text-xs">
              +{hiddenCount} more
            </span>
          )}
        </div>
      )}
      {showKeywords && keywords.length === 0 && (
        <div className="mt-2 text-muted-foreground text-xs">
          No keyword rule is connected to this category yet.
        </div>
      )}
      {!showKeywords && (
        <div className="mt-2 text-muted-foreground text-xs">
          Keywords live in the Keyword Rulebook.
        </div>
      )}
    </>
  );

  return (
    <div className="relative pl-5 before:absolute before:top-0 before:bottom-0 before:left-1 before:w-px before:bg-border/25">
      {onSelectCategory ? (
        <button
          className={cn(
            "w-full rounded-md bg-muted/15 p-3 text-left transition-colors hover:bg-muted/25",
            selected && "outline outline-1 outline-foreground/35"
          )}
          onClick={() => onSelectCategory(categoryId)}
          type="button"
        >
          {content}
        </button>
      ) : (
        <div className="rounded-md bg-muted/15 p-3">{content}</div>
      )}
    </div>
  );
}

function ConstantCascadeItem({ label }: { label: string }) {
  return (
    <div className="relative pl-5 before:absolute before:top-0 before:bottom-0 before:left-1 before:w-px before:bg-border/25">
      <div className="rounded-md bg-muted/15 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-muted/50 px-2 py-0.5 font-medium text-[10px] uppercase">
            Constant
          </span>
          <span className="font-medium text-sm">{label}</span>
        </div>
      </div>
    </div>
  );
}

function FoldToggle({
  expanded,
  hasChildren,
  onToggle,
}: {
  expanded: boolean;
  hasChildren: boolean;
  onToggle: () => void;
}) {
  if (!hasChildren) {
    return <span className="size-6" />;
  }

  return (
    <button
      aria-expanded={expanded}
      className="flex size-6 items-center justify-center rounded-md bg-muted/40 text-muted-foreground transition-colors hover:text-foreground"
      onClick={onToggle}
      title={expanded ? "Fold section" : "Unfold section"}
      type="button"
    >
      <ChevronDown
        className={cn("size-4 transition-transform", !expanded && "-rotate-90")}
      />
    </button>
  );
}

function EditNodeButton({
  nodeId,
  onSelectRule,
  selected,
}: {
  nodeId: string;
  onSelectRule?: (nodeId: string) => void;
  selected: boolean;
}) {
  if (!onSelectRule) {
    return null;
  }

  return (
    <button
      className={cn(
        "rounded-md px-2 py-0.5 text-[10px] uppercase transition-colors",
        selected
          ? "bg-foreground text-background"
          : "bg-muted/40 text-muted-foreground hover:text-foreground"
      )}
      onClick={() => onSelectRule(nodeId)}
      type="button"
    >
      {selected ? "Editing" : "Edit"}
    </button>
  );
}

function NodeTotal({ total }: { total: unknown }) {
  return (
    <div className="shrink-0 rounded-md bg-background/60 px-3 py-2 text-right">
      <div className="text-[10px] text-muted-foreground uppercase">Total</div>
      <div className="font-semibold text-sm tabular-nums">
        {total === undefined ? "-" : String(total)}
      </div>
    </div>
  );
}

function RuleCascadeNode({
  depth = 0,
  keywordRules,
  nodeTotals,
  onSelectCategory,
  onSelectRule,
  rule,
  rulesById,
  selectedCategoryId,
  selectedNodeId,
  visited,
}: {
  depth?: number;
  keywordRules?: Record<string, unknown>[];
  nodeTotals?: Record<string, unknown>;
  onSelectCategory?: (categoryId: string) => void;
  onSelectRule?: (nodeId: string) => void;
  rule: Record<string, unknown>;
  rulesById: Map<string, Record<string, unknown>>;
  selectedCategoryId?: string;
  selectedNodeId?: string;
  visited: Set<string>;
}) {
  const nodeId = getRuleId(rule);
  const nodeRefs = getNodeRefs(rule);
  const constantOperands = getConstantOperands(rule);
  const categoryIds = asStringArray(rule.includeCategoryIds);
  const keywordInfoByCategory = getKeywordsByCategory(keywordRules);
  const nextVisited = new Set(visited);
  nextVisited.add(nodeId);
  const total = nodeTotals?.[nodeId];
  const resultName = String(rule.resultName || "");
  const childrenCount =
    nodeRefs.length + categoryIds.length + constantOperands.length;
  const hasChildren = childrenCount > 0;
  const [expanded, setExpanded] = useState(true);
  const selected = selectedNodeId === nodeId;

  return (
    <div
      className={cn(
        "space-y-2",
        depth > 0 &&
          "relative pl-5 before:absolute before:top-0 before:bottom-0 before:left-1 before:w-px before:bg-border/25"
      )}
    >
      <div
        className={cn(
          "rounded-md bg-card/70 p-3 transition-colors",
          selected && "outline outline-1 outline-foreground/35",
          !selected && "hover:bg-muted/20"
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <FoldToggle
                expanded={expanded}
                hasChildren={hasChildren}
                onToggle={() => setExpanded((current) => !current)}
              />
              <span className="rounded bg-muted/50 px-2 py-0.5 font-medium text-[10px] uppercase">
                {getAggregationRuleModeLabel(rule)}
              </span>
              <span className="font-semibold text-sm">
                {getRuleLabel(rule)}
              </span>
              <code className="rounded bg-muted/30 px-1.5 py-0.5 text-muted-foreground text-xs">
                {nodeId}
              </code>
              {resultName && (
                <span className="rounded-full bg-background/70 px-2 py-0.5 text-[10px] uppercase">
                  result {resultName}
                </span>
              )}
              <EditNodeButton
                nodeId={nodeId}
                onSelectRule={onSelectRule}
                selected={selected}
              />
            </div>
            <code className="mt-2 block whitespace-normal break-words rounded bg-background/60 px-2 py-1.5 text-xs">
              {getRuleExpression(rule)}
            </code>
            {rule.description ? (
              <div className="mt-2 text-muted-foreground text-xs">
                {String(rule.description)}
              </div>
            ) : null}
            <div className="mt-2 text-muted-foreground text-xs">
              {getAggregationRuleModeDescription(rule)}
            </div>
            {!expanded && hasChildren && (
              <div className="mt-2 text-muted-foreground text-xs">
                {childrenCount} linked item{childrenCount === 1 ? "" : "s"}{" "}
                folded
              </div>
            )}
          </div>
          <NodeTotal total={total} />
        </div>
      </div>

      {expanded && (
        <>
          {nodeRefs.map((refId) => {
            const child = rulesById.get(refId);
            if (!child) {
              return (
                <div
                  className="relative pl-5 before:absolute before:top-0 before:bottom-0 before:left-1 before:w-px before:bg-border/25"
                  key={refId}
                >
                  <div className="rounded-md bg-muted/15 p-3 text-muted-foreground text-xs">
                    Missing aggregation node: {refId}
                  </div>
                </div>
              );
            }
            if (nextVisited.has(refId)) {
              return (
                <div
                  className="relative pl-5 before:absolute before:top-0 before:bottom-0 before:left-1 before:w-px before:bg-border/25"
                  key={refId}
                >
                  <div className="rounded-md bg-muted/15 p-3 text-muted-foreground text-xs">
                    Circular reference skipped: {refId}
                  </div>
                </div>
              );
            }
            return (
              <RuleCascadeNode
                depth={depth + 1}
                key={refId}
                keywordRules={keywordRules}
                nodeTotals={nodeTotals}
                onSelectCategory={onSelectCategory}
                onSelectRule={onSelectRule}
                rule={child}
                rulesById={rulesById}
                selectedCategoryId={selectedCategoryId}
                selectedNodeId={selectedNodeId}
                visited={nextVisited}
              />
            );
          })}

          {categoryIds.map((categoryId) => (
            <CategoryCascadeItem
              categoryId={categoryId}
              key={categoryId}
              keywordInfo={keywordInfoByCategory.get(categoryId)}
              onSelectCategory={onSelectCategory}
              selected={selectedCategoryId === categoryId}
              showKeywords={Boolean(keywordRules)}
            />
          ))}

          {constantOperands.map((label) => (
            <ConstantCascadeItem key={label} label={label} />
          ))}
        </>
      )}
    </div>
  );
}

// ── Compact cascade navigator (for left panel of three-panel layout) ──────────

const MODE_BADGE_CLASSES: Record<string, string> = {
  constant:
    "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400",
  final_result:
    "bg-green-50 text-green-600 dark:bg-green-950/60 dark:text-green-400",
  formula:
    "bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400",
  official_line:
    "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400",
  rollup: "bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400",
};

const MODE_SHORT: Record<string, string> = {
  constant: "C",
  final_result: "FN",
  formula: "F",
  official_line: "OL",
  rollup: "R",
};

function CompactCascadeNode({
  depth,
  onSelectRule,
  rule,
  rulesById,
  selectedNodeId,
  visited,
}: {
  depth: number;
  onSelectRule: (nodeId: string) => void;
  rule: Record<string, unknown>;
  rulesById: Map<string, Record<string, unknown>>;
  selectedNodeId?: string;
  visited: Set<string>;
}) {
  const nodeId = getRuleId(rule);
  const label = getRuleLabel(rule);
  const mode = getAggregationRuleMode(rule);
  const nodeRefs = getNodeRefs(rule);
  const categoryIds = asStringArray(rule.includeCategoryIds);
  const hasChildren = nodeRefs.length > 0 || categoryIds.length > 0;
  const [expanded, setExpanded] = useState(true);
  const selected = selectedNodeId === nodeId;
  const nextVisited = new Set(visited);
  nextVisited.add(nodeId);

  return (
    <div>
      <button
        className={cn(
          "flex w-full items-center gap-1.5 rounded px-2 py-1 text-left transition-colors",
          selected
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
        )}
        onClick={() => onSelectRule(nodeId)}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
        type="button"
      >
        {hasChildren ? (
          <ChevronDown
            className={cn(
              "size-3 shrink-0 text-muted-foreground transition-transform",
              !expanded && "-rotate-90"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setExpanded((v) => !v);
            }}
          />
        ) : (
          <span className="size-3 shrink-0" />
        )}
        <span
          className={cn(
            "shrink-0 rounded px-1 font-medium text-[9px] uppercase",
            MODE_BADGE_CLASSES[mode] ?? "bg-muted/50 text-muted-foreground"
          )}
        >
          {MODE_SHORT[mode] ?? "?"}
        </span>
        <span className="truncate text-xs">{label}</span>
      </button>

      {expanded && (
        <>
          {nodeRefs
            .filter((refId) => !nextVisited.has(refId))
            .map((refId) => {
              const child = rulesById.get(refId);
              if (!child) return null;
              return (
                <CompactCascadeNode
                  depth={depth + 1}
                  key={refId}
                  onSelectRule={onSelectRule}
                  rule={child}
                  rulesById={rulesById}
                  selectedNodeId={selectedNodeId}
                  visited={nextVisited}
                />
              );
            })}
          {categoryIds.map((catId) => (
            <div
              className="flex items-center gap-1 py-0.5"
              key={catId}
              style={{ paddingLeft: `${8 + (depth + 1) * 12}px` }}
            >
              <span className="size-3 shrink-0" />
              <span className="truncate rounded bg-muted/40 px-1.5 py-0.5 text-[10px] text-muted-foreground">
                {catId}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export function AggregationCascadeNav({
  onSelectRule,
  rules,
  selectedNodeId,
}: {
  onSelectRule: (nodeId: string) => void;
  rules: Record<string, unknown>[];
  selectedNodeId?: string;
}) {
  const rulesById = new Map(rules.map((r) => [getRuleId(r), r]));
  const rootRules = getRootRules(rules);
  const reachableIds = collectReachableNodeIds(rootRules, rulesById);
  const standaloneRules = rules.filter((r) => !reachableIds.has(getRuleId(r)));

  if (rules.length === 0) {
    return (
      <div className="px-3 py-8 text-center text-xs text-muted-foreground">
        No nodes yet.
        <br />
        Click &ldquo;+ New&rdquo; to start.
      </div>
    );
  }

  return (
    <div className="py-1">
      {rootRules.map((rule) => (
        <CompactCascadeNode
          depth={0}
          key={getRuleId(rule)}
          onSelectRule={onSelectRule}
          rule={rule}
          rulesById={rulesById}
          selectedNodeId={selectedNodeId}
          visited={new Set()}
        />
      ))}
      {standaloneRules.length > 0 && (
        <>
          <div className="px-2 pb-0.5 pt-3 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Standalone
          </div>
          {standaloneRules.map((rule) => (
            <CompactCascadeNode
              depth={0}
              key={getRuleId(rule)}
              onSelectRule={onSelectRule}
              rule={rule}
              rulesById={rulesById}
              selectedNodeId={selectedNodeId}
              visited={new Set()}
            />
          ))}
        </>
      )}
    </div>
  );
}

// ── Full cascade overview ─────────────────────────────────────────────────────

export function AggregationRulesOverview({
  className,
  emptyMessage = "No aggregation rules are defined yet.",
  fill,
  keywordRules,
  modeBadges,
  nodeTotals,
  onSelectCategory,
  onSelectRule,
  rules,
  selectedCategoryId,
  selectedNodeId,
  summaryDescription = "Rollup nodes group mapped categories. Formula nodes calculate with categories, nodes, inputs, constants, or expressions. Final result and official line nodes expose values downstream.",
  summaryTitle = "Rollup & calculation cascade",
  supportedOperationsText = `Supported operations: ${SUPPORTED_AGGREGATION_OPERATIONS.join(", ")}. Formula expressions support refs such as category:, node:, input:, and fapi:.`,
}: {
  className?: string;
  emptyMessage?: string;
  fill?: boolean;
  keywordRules?: Record<string, unknown>[];
  modeBadges?: Array<{ label: string; mode: AggregationRuleMode }>;
  nodeTotals?: Record<string, unknown>;
  onSelectCategory?: (categoryId: string) => void;
  onSelectRule?: (nodeId: string) => void;
  rules: Record<string, unknown>[];
  selectedCategoryId?: string;
  selectedNodeId?: string;
  summaryDescription?: string;
  summaryTitle?: string;
  supportedOperationsText?: string;
}) {
  const rulesById = new Map(rules.map((rule) => [getRuleId(rule), rule]));
  const rootRules = getRootRules(rules);
  const visibleNodeIds = collectReachableNodeIds(rootRules, rulesById);
  const standaloneRules = rules.filter(
    (rule) => !visibleNodeIds.has(getRuleId(rule))
  );
  const modeCounts = rules.reduce<Record<AggregationRuleMode, number>>(
    (counts, rule) => {
      const mode = getAggregationRuleMode(rule);
      counts[mode] += 1;
      return counts;
    },
    {
      constant: 0,
      final_result: 0,
      formula: 0,
      official_line: 0,
      rollup: 0,
    }
  );
  const visibleModeBadges = modeBadges || [
    { label: "Rollups", mode: "rollup" as const },
    { label: "Formulas", mode: "formula" as const },
    { label: "Constants", mode: "constant" as const },
    { label: "Final results", mode: "final_result" as const },
    { label: "Official lines", mode: "official_line" as const },
  ];

  if (rules.length === 0) {
    return (
      <div className="rounded-md bg-muted/15 p-3 text-muted-foreground text-xs">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "space-y-4 overflow-auto",
        fill && "min-h-0 flex-1 pr-1",
        className
      )}
    >
      <div className="rounded-md bg-muted/15 p-3">
        <div className="flex flex-wrap items-center gap-2">
          <Sigma className="size-4 text-muted-foreground" />
          <div className="font-medium text-sm">{summaryTitle}</div>
        </div>
        <p className="mt-1 text-muted-foreground text-xs">
          {summaryDescription}
        </p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {visibleModeBadges.map(({ label, mode }) => (
            <span
              className="rounded-full bg-background/70 px-2 py-1 text-[10px] uppercase"
              key={mode}
              title={AGGREGATION_RULE_MODE_DESCRIPTIONS[mode]}
            >
              {label}: {modeCounts[mode]}
            </span>
          ))}
        </div>
        <div className="mt-2 text-[11px] text-muted-foreground">
          {supportedOperationsText}
        </div>
      </div>

      {rootRules.map((rule) => (
        <RuleCascadeNode
          key={getRuleId(rule)}
          keywordRules={keywordRules}
          nodeTotals={nodeTotals}
          onSelectCategory={onSelectCategory}
          onSelectRule={onSelectRule}
          rule={rule}
          rulesById={rulesById}
          selectedCategoryId={selectedCategoryId}
          selectedNodeId={selectedNodeId}
          visited={new Set()}
        />
      ))}

      {standaloneRules.length > 0 && (
        <section className="space-y-2">
          <div className="font-medium text-muted-foreground text-xs uppercase">
            Additional rules
          </div>
          {standaloneRules.map((rule) => (
            <RuleCascadeNode
              key={getRuleId(rule)}
              keywordRules={keywordRules}
              nodeTotals={nodeTotals}
              onSelectCategory={onSelectCategory}
              onSelectRule={onSelectRule}
              rule={rule}
              rulesById={rulesById}
              selectedCategoryId={selectedCategoryId}
              selectedNodeId={selectedNodeId}
              visited={new Set()}
            />
          ))}
        </section>
      )}
    </div>
  );
}
