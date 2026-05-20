"use client";

import { ChevronDown, ChevronRight, Clock, Database, LayoutList, Play, X } from "lucide-react";
import { useCallback, useState } from "react";
import type { LocalRunRecord, WorkflowBlock } from "@/lib/local-fiscal-workflow";
import type { WorkflowEdge, WorkflowNode } from "@/lib/workflow-store";
import { BlockDataFlowColumn } from "../workspace/block-data-flow-pane";

// ── helpers ──────────────────────────────────────────────────────────────────

function asRecord(value: unknown): Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asNumber(value: unknown): number {
  return typeof value === "number" ? value : Number(value) || 0;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-CA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function getBackendOutputs(
  blockId: string,
  lastRun: LocalRunRecord | undefined
): Record<string, unknown> {
  const log = lastRun?.logs.find((l) => l.nodeId === blockId);
  const outer = asRecord(log?.output);
  const inner = asRecord(outer.output);
  return asRecord(inner.backendOutputs);
}

// ── types ─────────────────────────────────────────────────────────────────────

export type Subcategory = {
  id: string;
  label: string;
  value: number;
  rowCount?: number;
};

export type FieldEntry = {
  key: string;
  label: string;
  description?: string;
  value: number;
  subcategories: Subcategory[];
};

export type SourcePanelState = {
  sub: Subcategory;
  parentLabel: string;
  blockLabel: string;
  sourceId: string;
  initialTab: "evidence" | "history";
};

type TraceStep = {
  id: string;
  label: string;
  catalogId?: string;
  role: "upstream" | "source" | "field";
  edgeBelow?: { fromRole?: string; toRole?: string; bindingLabel?: string };
};

function buildTrace(
  sourceId: string,
  fieldBlockId: string,
  nodes: WorkflowNode[],
  edges: WorkflowEdge[]
): TraceStep[] {
  const steps: TraceStep[] = [];

  // Upstream blocks feeding the source block
  const incomingEdges = edges.filter((e) => e.target === sourceId);
  for (const edge of incomingEdges) {
    const upNode = nodes.find((n) => n.id === edge.source);
    steps.push({
      id: edge.source,
      label: upNode?.data.label || edge.source,
      catalogId: upNode?.data.block?.catalogId,
      role: "upstream",
      edgeBelow: {
        fromRole: edge.data?.sourceOutputRole,
        toRole: edge.data?.targetInputRole,
        bindingLabel: edge.data?.bindingLabel,
      },
    });
  }

  // Source block itself
  const sourceNode = nodes.find((n) => n.id === sourceId);
  const fieldEdge = edges.find(
    (e) => e.source === sourceId && e.target === fieldBlockId
  );
  steps.push({
    id: sourceId,
    label: sourceNode?.data.label || sourceId,
    catalogId: sourceNode?.data.block?.catalogId,
    role: "source",
    edgeBelow: fieldEdge
      ? {
          fromRole: fieldEdge.data?.sourceOutputRole,
          toRole: fieldEdge.data?.targetInputRole,
          bindingLabel: fieldEdge.data?.bindingLabel,
        }
      : undefined,
  });

  // Field block (the display block)
  const fieldNode = nodes.find((n) => n.id === fieldBlockId);
  steps.push({
    id: fieldBlockId,
    label: fieldNode?.data.label || fieldBlockId,
    catalogId: fieldNode?.data.block?.catalogId,
    role: "field",
  });

  return steps;
}

// ── data extraction ───────────────────────────────────────────────────────────

function extractFromRollupAggregator(
  backendOutputs: Record<string, unknown>
): FieldEntry[] {
  const rollupTotalsBlock = asRecord(backendOutputs.rollup_totals);
  const rollupTotals = asRecord(rollupTotalsBlock.rollupTotals);
  const rollupTotalDetails = asRecord(rollupTotalsBlock.rollupTotalDetails);
  const categoryTotalsBlock = asRecord(backendOutputs.category_totals);
  const categoryTotalDetails = asRecord(categoryTotalsBlock.categoryTotalDetails);

  if (Object.keys(rollupTotals).length === 0) return [];

  return Object.entries(rollupTotals).map(([rollupId, total]) => {
    const detail = asRecord(rollupTotalDetails[rollupId]);
    const includedIds = Array.isArray(detail.includedCategoryIds)
      ? (detail.includedCategoryIds as string[])
      : [];

    const subcategories: Subcategory[] = includedIds.map((catId) => {
      const catDetail = asRecord(categoryTotalDetails[catId]);
      return {
        id: catId,
        label: String(catDetail.categoryLabel || catId),
        value: asNumber(catDetail.value),
        rowCount: asNumber(catDetail.rowCount),
      };
    });

    return {
      key: rollupId,
      label: String(detail.label || rollupId),
      value: asNumber(total),
      subcategories,
    };
  });
}

function extractFromCalculationEngine(
  backendOutputs: Record<string, unknown>
): FieldEntry[] {
  const calcBlock = asRecord(backendOutputs.calculated_results);
  const calculatedResults = asRecord(calcBlock.calculatedResults);
  const resultDetails = asRecord(calcBlock.resultDetails);

  const traceBlock = asRecord(backendOutputs.formula_trace);
  const formulaTrace = asRecord(traceBlock.formulaTrace);

  if (Object.keys(calculatedResults).length === 0) return [];

  return Object.entries(calculatedResults).map(([key, value]) => {
    const detail = asRecord(resultDetails[key]);
    const trace = asRecord(formulaTrace[key]);
    const inputValues = Array.isArray(trace.inputValues)
      ? (trace.inputValues as { operand: string | number; value: number }[])
      : [];

    const subcategories: Subcategory[] = inputValues.map((iv) => ({
      id: String(iv.operand),
      label: String(iv.operand),
      value: asNumber(iv.value),
    }));

    return {
      key,
      label: String(detail.label || key),
      description: String(trace.expression || detail.description || ""),
      value: asNumber(value),
      subcategories,
    };
  });
}

function extractFromHierarchyAggregator(
  backendOutputs: Record<string, unknown>
): FieldEntry[] {
  const finalTotalsBlock = asRecord(backendOutputs.final_totals);
  const finalTotals = asRecord(finalTotalsBlock.finalTotals);

  const categoryTotalsBlock = asRecord(backendOutputs.category_totals);
  const categoryTotalDetails = asRecord(categoryTotalsBlock.categoryTotalDetails);

  if (Object.keys(finalTotals).length === 0) return [];

  return Object.entries(finalTotals).map(([key, value]) => {
    const subcategories: Subcategory[] = Object.entries(categoryTotalDetails)
      .map(([catId, catDetail]) => {
        const detail = asRecord(catDetail);
        return {
          id: catId,
          label: String(detail.categoryLabel || catId),
          value: asNumber(detail.value),
          rowCount: asNumber(detail.rowCount),
        };
      });

    return {
      key,
      label: key,
      value: asNumber(value),
      subcategories,
    };
  });
}

function extractFromNamedValues(
  backendOutputs: Record<string, unknown>
): FieldEntry[] {
  const namedValuesBlock = asRecord(backendOutputs.named_values);
  const namedValues = asRecord(namedValuesBlock.namedValues);
  return Object.entries(namedValues).map(([key, value]) => ({
    key,
    label: key,
    value: asNumber(value),
    subcategories: [],
  }));
}

export function extractFieldEntries(
  backendOutputs: Record<string, unknown>
): FieldEntry[] {
  const fromRollup = extractFromRollupAggregator(backendOutputs);
  if (fromRollup.length > 0) return fromRollup;

  const fromCalc = extractFromCalculationEngine(backendOutputs);
  if (fromCalc.length > 0) return fromCalc;

  const fromHierarchy = extractFromHierarchyAggregator(backendOutputs);
  if (fromHierarchy.length > 0) return fromHierarchy;

  return extractFromNamedValues(backendOutputs);
}

function getOperationLabel(catalogId?: string, role?: TraceStep["role"]): string {
  if (role === "field") return "displays";
  if (!catalogId) return "";
  if (catalogId.startsWith("source:")) return "provides";
  if (catalogId === "logic:classification-mapping") return "classifies";
  if (catalogId === "logic:category-rollup-aggregator") return "aggregates";
  if (catalogId === "logic:calculation-engine") return "computes";
  if (catalogId === "logic:hierarchy-aggregator") return "aggregates";
  return "";
}

// ── SourceDetailPanel ─────────────────────────────────────────────────────────

type MappedRowSummary = {
  account?: string;
  label?: string;
  matchedKeyword?: string;
  amount: number;
  confidence: number;
};

function getCategoryRows(
  blockId: string,
  categoryId: string,
  lastRun: LocalRunRecord | undefined
): MappedRowSummary[] {
  const outputs = getBackendOutputs(blockId, lastRun);
  const mappedRowsBlock = asRecord(outputs.mapped_rows);
  const rows = Array.isArray(mappedRowsBlock.mappedRows)
    ? (mappedRowsBlock.mappedRows as Record<string, unknown>[])
    : [];
  return rows
    .filter((r) => r.categoryId === categoryId)
    .map((r) => ({
      account: r.account as string | undefined,
      label: r.label as string | undefined,
      matchedKeyword: r.matchedKeyword as string | undefined,
      amount: asNumber(r.amount),
      confidence: asNumber(r.confidence),
    }));
}

export function SourceDetailPanel({
  state,
  block,
  nodes,
  edges,
  lastRun,
  onClose,
}: {
  state: SourcePanelState;
  block: WorkflowBlock;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  lastRun?: LocalRunRecord;
  onClose: () => void;
}) {
  const { sub, parentLabel, sourceId, initialTab } = state;
  const [tab, setTab] = useState<"evidence" | "history">(initialTab);

  const traceSteps = buildTrace(sourceId, block.id, nodes, edges);

  return (
    <div className="flex shrink-0 flex-col border-l bg-background" style={{ width: 360 }}>
      {/* header */}
      <div className="flex items-start justify-between gap-2 border-b px-4 py-3">
        <div className="min-w-0">
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Review Workspace
          </div>
          <div className="mt-0.5 truncate font-semibold text-sm">
            {sub.label !== sub.id ? sub.label : sub.id}{" "}
            <span className="font-normal text-muted-foreground">
              — {tab === "history" ? "History" : "Evidence"}
            </span>
          </div>
          <div className="mt-0.5 text-[10px] text-muted-foreground/70">in {parentLabel}</div>
        </div>
        <button
          className="shrink-0 rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={onClose}
          type="button"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* tabs */}
      <div className="flex border-b">
        {(["evidence", "history"] as const).map((t) => (
          <button
            className={
              "flex items-center gap-1.5 px-4 py-2 text-xs font-medium transition-colors " +
              (tab === t
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground")
            }
            key={t}
            onClick={() => setTab(t)}
            type="button"
          >
            {t === "evidence" ? <Database className="size-3" /> : <Clock className="size-3" />}
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {tab === "evidence" && (
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          {/* compact value header — no rectangle */}
          <div className="mb-5 border-b pb-3">
            <div className="flex items-baseline justify-between gap-2">
              <span className="font-semibold text-sm">
                {sub.label !== sub.id ? sub.label : sub.id}
              </span>
              <span className="shrink-0 font-mono font-bold text-sm tabular-nums">
                {formatNumber(sub.value)}{" "}
                <span className="font-normal text-muted-foreground text-xs">CAD</span>
              </span>
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="font-mono">{sub.id}</span>
              {sub.rowCount != null && sub.rowCount > 0 && (
                <>
                  <span>·</span>
                  <span>{sub.rowCount} source rows</span>
                </>
              )}
            </div>
          </div>

          {/* data lineage timeline */}
          <div className="mb-3 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Data Lineage
          </div>
          <div className="relative">
            {/* vertical spine connecting the dots */}
            <div className="absolute left-[7px] top-2 w-px bg-border" style={{ bottom: 8 }} />

            {traceSteps.map((step, i) => {
              const isLast = i === traceSteps.length - 1;
              const isSource = step.role === "source";
              const isClassifier = step.catalogId === "logic:classification-mapping";
              const isSourceBlock = step.catalogId?.startsWith("source:") ?? false;
              const opLabel = getOperationLabel(step.catalogId, step.role);

              // rows classified into sub.id by this block (only for classifier steps)
              const matchedRows = isClassifier
                ? getCategoryRows(step.id, sub.id, lastRun)
                : [];
              const shownRows = matchedRows.slice(0, 6);
              const hiddenCount = matchedRows.length - shownRows.length;

              // source block config detail
              const stepNode = nodes.find((n) => n.id === step.id);
              const stepConfig = asRecord(stepNode?.data.block?.config ?? {});

              return (
                <div key={`${step.id}-${i}`} className={isLast ? "" : "mb-1"}>
                  {/* step row */}
                  <div className="relative flex gap-3 pl-6">
                    {/* dot on the spine */}
                    <div
                      className={
                        "absolute left-0 top-[5px] size-3.5 rounded-full border-2 " +
                        (isSource
                          ? "border-violet-500 bg-violet-500"
                          : isClassifier
                          ? "border-amber-400 bg-amber-400"
                          : "border-border bg-background")
                      }
                    />

                    <div className="flex-1 pb-0.5">
                      {/* block name + operation badge */}
                      <div className="flex items-center gap-2">
                        <span
                          className={
                            "font-medium text-sm " +
                            (isSource || isClassifier ? "text-foreground" : "text-muted-foreground")
                          }
                        >
                          {step.label}
                        </span>
                        {opLabel && (
                          <span
                            className={
                              "rounded px-1.5 py-0.5 text-[10px] font-medium " +
                              (isSource
                                ? "bg-violet-500/15 text-violet-500"
                                : isClassifier
                                ? "bg-amber-400/15 text-amber-600"
                                : "bg-muted text-muted-foreground")
                            }
                          >
                            {opLabel}
                          </span>
                        )}
                      </div>

                      {/* source block: show file/type info */}
                      {isSourceBlock && (
                        <div className="mt-1 text-[10px] text-muted-foreground">
                          {stepConfig.workbookName
                            ? String(stepConfig.workbookName)
                            : stepConfig.sourceKind
                            ? String(stepConfig.sourceKind).replace(/_/g, " ")
                            : step.catalogId?.replace("source:", "") ?? ""}
                        </div>
                      )}

                      {/* classifier: show matched rows for this category */}
                      {isClassifier && shownRows.length > 0 && (
                        <div className="mt-1.5 space-y-1">
                          {shownRows.map((row, j) => (
                            <div key={j} className="border-l-2 border-amber-300 pl-2">
                              <div className="flex items-baseline justify-between gap-2">
                                <span className="min-w-0 truncate text-[11px] font-medium">
                                  {row.label || row.account || "—"}
                                </span>
                                <span className="shrink-0 font-mono text-[11px] tabular-nums">
                                  {formatNumber(row.amount)} CAD
                                </span>
                              </div>
                              {row.matchedKeyword && (
                                <div className="text-[10px] text-muted-foreground">
                                  keyword:{" "}
                                  <span className="font-mono text-amber-600">
                                    &ldquo;{row.matchedKeyword}&rdquo;
                                  </span>
                                  {row.account && row.label && (
                                    <span className="ml-1.5 opacity-60">{row.account}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                          {hiddenCount > 0 && (
                            <div className="pl-2 text-[10px] text-muted-foreground/60">
                              +{hiddenCount} more row{hiddenCount !== 1 ? "s" : ""}
                            </div>
                          )}
                        </div>
                      )}

                      {/* source (aggregator): left-border accent with the accumulated value */}
                      {isSource && (
                        <div className="mt-1.5 border-l-2 border-violet-400 pl-2">
                          <div className="flex items-baseline justify-between">
                            <span className="font-mono text-[11px] text-violet-500">{sub.id}</span>
                            <span className="font-mono font-semibold text-[11px] tabular-nums text-violet-500">
                              {formatNumber(sub.value)} CAD
                            </span>
                          </div>
                          {sub.rowCount != null && sub.rowCount > 0 && (
                            <div className="text-[10px] text-violet-400/70">
                              {sub.rowCount} rows accumulated
                            </div>
                          )}
                        </div>
                      )}

                      {step.role === "field" && (
                        <div className="text-[10px] text-muted-foreground">in {parentLabel}</div>
                      )}
                    </div>
                  </div>

                  {/* edge connector — roles + binding label between steps */}
                  {!isLast && step.edgeBelow && (
                    <div className="relative pl-6 py-1">
                      <div className="space-y-0.5">
                        {step.edgeBelow.bindingLabel && (
                          <div className="italic text-[10px] text-muted-foreground/60">
                            {step.edgeBelow.bindingLabel}
                          </div>
                        )}
                        {(step.edgeBelow.fromRole || step.edgeBelow.toRole) && (
                          <div className="font-mono text-[10px] text-muted-foreground/50">
                            {step.edgeBelow.fromRole}
                            {step.edgeBelow.fromRole && step.edgeBelow.toRole ? " → " : ""}
                            {step.edgeBelow.toRole}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === "history" && (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center text-muted-foreground">
          <Clock className="size-8 opacity-30" />
          <p className="text-xs">No history recorded for this line</p>
        </div>
      )}
    </div>
  );
}

// ── FieldRow ──────────────────────────────────────────────────────────────────

export function FieldRow({
  entry,
  onShowEvidence,
  onShowHistory,
  activeSubId,
}: {
  entry: FieldEntry;
  onShowEvidence?: (sub: Subcategory) => void;
  onShowHistory?: (sub: Subcategory) => void;
  activeSubId?: string | null;
}) {
  const [open, setOpen] = useState(false);
  const hasChildren = entry.subcategories.length > 0;

  return (
    <div className="border-b last:border-b-0">
      {/* top-level row — click to expand/collapse subcategories */}
      <button
        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/30"
        onClick={() => hasChildren && setOpen((v) => !v)}
        style={{ cursor: hasChildren ? "pointer" : "default" }}
        type="button"
      >
        <span className="flex w-4 shrink-0 items-center justify-center text-muted-foreground">
          {hasChildren ? (
            open ? (
              <ChevronDown className="size-3.5" />
            ) : (
              <ChevronRight className="size-3.5" />
            )
          ) : (
            <span className="size-3.5" />
          )}
        </span>
        <span className="w-28 shrink-0 overflow-hidden truncate font-mono font-semibold text-violet-500 text-xs uppercase">
          {entry.key}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="flex items-baseline gap-1.5">
            {entry.label !== entry.key && (
              <span className="truncate font-medium text-sm">{entry.label}</span>
            )}
            {hasChildren && (
              <span className="shrink-0 text-muted-foreground text-xs">
                ({entry.subcategories.length})
              </span>
            )}
          </span>
          {entry.description && (
            <span className="truncate font-normal text-muted-foreground text-xs">
              {entry.description}
            </span>
          )}
        </span>
        <span className="shrink-0 font-mono text-sm tabular-nums">
          {formatNumber(entry.value)}
        </span>
        <span className="w-10 shrink-0 text-right text-muted-foreground text-xs">CAD</span>
      </button>

      {/* subcategories — icons live here, on the expanded lines */}
      {open && hasChildren && (
        <div className="border-t bg-muted/10">
          {entry.subcategories.map((sub) => (
            <div
              className={
                "flex items-center gap-3 border-b px-4 py-2.5 last:border-b-0 " +
                (activeSubId === sub.id
                  ? "bg-primary/5 border-l-2 border-l-primary"
                  : "")
              }
              key={sub.id}
            >
              <span className="w-4 shrink-0" />
              <span className="w-28 shrink-0 overflow-hidden truncate font-mono text-muted-foreground text-xs">
                {sub.id}
              </span>
              <span className="min-w-0 flex-1 truncate text-muted-foreground text-sm">
                {sub.label !== sub.id ? sub.label : ""}
                {sub.rowCount !== undefined && sub.rowCount > 0 && (
                  <span className="ml-1.5 text-xs opacity-60">({sub.rowCount})</span>
                )}
              </span>
              <span className="shrink-0 font-mono text-sm tabular-nums">
                {formatNumber(sub.value)}
              </span>
              <span className="w-10 shrink-0 text-right text-muted-foreground text-xs">CAD</span>
              {/* evidence + history icons on each subcategory line */}
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => onShowEvidence?.(sub)}
                  title="Show source evidence"
                  type="button"
                >
                  <Database className="size-3.5" />
                </button>
                <button
                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => onShowHistory?.(sub)}
                  title="Show history"
                  type="button"
                >
                  <Clock className="size-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Connected I/O strip (same pattern as AggregatorWorkspace) ─────────────────

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
        setPanelHeight(Math.max(140, Math.min(560, startHeight + (startY - ev.clientY))));
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
            title="Run this block"
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

// ── SourceGroup header ────────────────────────────────────────────────────────

function SourceHeader({ label, subtype }: { label: string; subtype?: string }) {
  return (
    <div className="flex items-center gap-2 border-b border-t bg-muted/30 px-4 py-1.5">
      <span className="size-1.5 shrink-0 rounded-full bg-violet-400/70" />
      <span className="min-w-0 flex-1 truncate font-medium text-xs text-muted-foreground">
        {label}
      </span>
      {subtype && (
        <span className="shrink-0 rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {subtype}
        </span>
      )}
    </div>
  );
}

// ── main component ────────────────────────────────────────────────────────────

export function FieldBlockWorkspace({
  block,
  edges,
  lastRun,
  nodes,
  onExecuteStep,
  compact,
}: {
  block: WorkflowBlock;
  edges: WorkflowEdge[];
  lastRun?: LocalRunRecord;
  nodes: WorkflowNode[];
  onExecuteStep?: () => void;
  compact?: boolean;
}) {
  const [selectedPanel, setSelectedPanel] = useState<SourcePanelState | null>(null);

  const upstreamIds = edges
    .filter((e) => e.target === block.id)
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

  const hasRun = Boolean(lastRun);
  const hasEntries = sourceGroups.length > 0;

  return (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {/* main content column */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {/* field list */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {!hasEntries ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <LayoutList className="size-8 text-muted-foreground/40" />
              <div>
                <p className="font-medium text-sm text-muted-foreground">
                  {hasRun ? "No values to display" : "No run data yet"}
                </p>
                <p className="mt-1 text-muted-foreground text-xs">
                  {hasRun
                    ? "Connect this block to a Calculation Engine, Category Rollup, or Rollup & Calculation Engine."
                    : "Run the workflow to see computed values here."}
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* column headers */}
              <div className="flex items-center gap-3 border-b bg-muted/20 px-4 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                <span className="w-4 shrink-0" />
                <span className="w-28 shrink-0">Key</span>
                <span className="flex-1">Label / formula</span>
                <span className="shrink-0">Value</span>
                <span className="w-10 shrink-0 text-right">Cur.</span>
              </div>
              {sourceGroups.map((group) => (
                <div key={group.sourceId}>
                  <SourceHeader
                    label={group.sourceLabel}
                    subtype={group.sourceSubtype}
                  />
                  {group.entries.map((entry) => (
                    <FieldRow
                      activeSubId={
                        selectedPanel?.parentLabel === entry.label
                          ? selectedPanel.sub.id
                          : null
                      }
                      entry={entry}
                      key={`${group.sourceId}:${entry.key}`}
                      onShowEvidence={(sub) =>
                        setSelectedPanel((prev) =>
                          prev?.sub.id === sub.id &&
                          prev?.parentLabel === entry.label &&
                          prev?.initialTab === "evidence"
                            ? null
                            : { sub, parentLabel: entry.label, blockLabel: group.sourceLabel, sourceId: group.sourceId, initialTab: "evidence" }
                        )
                      }
                      onShowHistory={(sub) =>
                        setSelectedPanel((prev) =>
                          prev?.sub.id === sub.id &&
                          prev?.parentLabel === entry.label &&
                          prev?.initialTab === "history"
                            ? null
                            : { sub, parentLabel: entry.label, blockLabel: group.sourceLabel, sourceId: group.sourceId, initialTab: "history" }
                        )
                      }
                    />
                  ))}
                </div>
              ))}
            </>
          )}
        </div>

        {/* Connected I/O strip */}
        {!compact && (
          <InteractiveIOStrip
            block={block}
            edges={edges}
            lastRun={lastRun}
            nodes={nodes}
            onExecuteStep={onExecuteStep}
          />
        )}
      </div>

      {/* source detail side panel */}
      {!compact && selectedPanel && (
        <SourceDetailPanel
          block={block}
          edges={edges}
          lastRun={lastRun}
          nodes={nodes}
          onClose={() => setSelectedPanel(null)}
          state={selectedPanel}
        />
      )}
    </div>
  );
}
