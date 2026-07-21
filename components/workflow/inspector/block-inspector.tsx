"use client";

import {
  Bot,
  ChevronDown,
  Copy,
  FileLock2,
  FileText,
  GitBranch,
  LayoutList,
  Lock,
  Play,
  Plus,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/shared/ui/button";
import { Checkbox } from "@/shared/ui/checkbox";
import { CodeEditor } from "@/shared/ui/code-editor";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import type {
  LocalRunRecord,
  WorkflowBlock,
} from "@/shared/workflow-engine/local-fiscal-workflow";
import {
  getToolForBlock,
  type ToolDefinition,
  type ToolOutputRole,
} from "@/shared/workflow-engine/local-tool-registry";
import type {
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeData,
} from "@/shared/workflow-engine/state/workflow-store";
import { hasExcelSourceEvidence } from "@/shared/workflow-engine/domain/workflow/source-rules";
import {
  CalculationEngineModeSection,
  CalculationEngineRunSections,
} from "../logic-viewers/calculation-engine-panel";
import { HierarchyAggregatorRunSections } from "../logic-viewers/hierarchy-aggregator-run-sections";
import { SUPPORTED_AGGREGATION_OPERATIONS } from "../source-viewers/aggregation-rule-modes";
import {
  type BlockCodePreview,
  generateBlockCodePreview,
} from "./code-preview/generate-code-preview";
import { DataPreviewCard } from "./data-preview-card";
import { AiAgentProposalNotice } from "./family-editors/ai-agent-proposal-notice";
import { LogicModeEditor } from "./family-editors/logic-mode-editor";
import { SourceVersionNotice } from "./family-editors/source-version-notice";
import { SourceSetupPanel } from "./source-setup-panel";

type SourceLogicVariant = "annotation" | "correction" | "derived" | "override";

type BlockInspectorProps = {
  disabled?: boolean;
  draftData: WorkflowNodeData;
  edges: WorkflowEdge[];
  hideBindingSection?: boolean;
  lastRun?: LocalRunRecord;
  nodes: WorkflowNode[];
  onCreateSourceForInput: (inputRoleId: string) => void;
  onCreateSourceLogic: (variant: SourceLogicVariant) => void;
  onCreateSourceVersion: () => void;
  onRunDownstreamTest: () => void;
  onRunMockTest: () => void;
  setDraftData: Dispatch<SetStateAction<WorkflowNodeData | null>>;
};

const SOURCE_IMMUTABLE_MESSAGE =
  "Source evidence, locators, raw text, and extracted values are immutable. Create downstream Logic to correct, annotate, override, or reinterpret them.";

function isRuleKnowledgeSource(block: WorkflowBlock) {
  const sourceKind = String(block.config.sourceKind || "").toLowerCase();
  return (
    block.family === "Source" &&
    (block.subtype === "Keyword Rules" ||
      block.subtype === "Aggregation Rules" ||
      block.subtype === "Rollup Rules" ||
      block.subtype === "Calculation Rules" ||
      sourceKind.includes("keyword_rules") ||
      sourceKind.includes("aggregation_rules") ||
      sourceKind.includes("rollup_rules") ||
      sourceKind.includes("calculation_rules") ||
      sourceKind.includes("rule_knowledge"))
  );
}

function isExcelWorkbookSource(block: WorkflowBlock) {
  const sourceKind = String(block.config.sourceKind || "").toLowerCase();
  return (
    block.family === "Source" &&
    (block.subtype === "Excel / Workbook" ||
      sourceKind.includes("excel") ||
      sourceKind.includes("workbook"))
  );
}

function getString(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

function getStringArray(value: unknown, fallback: string[] = []) {
  if (Array.isArray(value)) {
    return value.map(String);
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return fallback;
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function getBlockLabel(nodes: WorkflowNode[], blockId: string) {
  return (
    nodes.find((node) => node.id === blockId)?.data.block?.label || blockId
  );
}

function getLatestToolOutput({
  blockId,
  lastRun,
}: {
  blockId: string;
  lastRun?: LocalRunRecord;
}) {
  const selectedLog = lastRun?.logs.find((log) => log.nodeId === blockId);
  const selectedOutput =
    typeof selectedLog?.output === "object" && selectedLog.output !== null
      ? (selectedLog.output as Record<string, unknown>)
      : null;
  return getToolResultOutput(selectedOutput);
}

function getToolResultOutput(selectedOutput: Record<string, unknown> | null) {
  return asRecord(selectedOutput?.output);
}

function getRoleOutputValue(
  role: ToolOutputRole,
  output: Record<string, unknown>
) {
  return output[role.outputKey || role.id] ?? output[role.id];
}

function getRoleCountLabel(value: unknown) {
  if (Array.isArray(value)) {
    return `${value.length} ${value.length === 1 ? "row" : "rows"}`;
  }
  if (typeof value === "boolean") {
    return value ? "yes" : "no";
  }
  if (value === undefined || value === null) {
    return "not run";
  }
  if (typeof value === "object") {
    return "available";
  }
  return String(value);
}

function getToolOutputRoleById(block: WorkflowBlock, roleId?: string) {
  if (!roleId) return;
  return getToolForBlock(block)?.outputRoles.find((role) => role.id === roleId);
}

function getLatestOutputValueForRole({
  block,
  lastRun,
  roleId,
}: {
  block: WorkflowBlock;
  lastRun?: LocalRunRecord;
  roleId?: string;
}) {
  const output = getLatestToolOutput({ blockId: block.id, lastRun });
  const role = getToolOutputRoleById(block, roleId);
  if (role) {
    const value = getRoleOutputValue(role, output);
    if (value !== undefined) return value;
  }
  if (roleId && output[roleId] !== undefined) return output[roleId];
  return getConfiguredPreviewValue(block, roleId);
}

function getOutputTypeForRole({
  block,
  roleId,
}: {
  block: WorkflowBlock;
  roleId?: string;
}) {
  return getToolOutputRoleById(block, roleId)?.outputType || roleId;
}

function getConfiguredRows(config: Record<string, unknown>) {
  const rows =
    config.rows || config.manualRows || config.tableRows || config.sampleRows;
  return Array.isArray(rows) ? rows : undefined;
}

function isRowsPreviewRole(block: WorkflowBlock, roleId?: string) {
  return (
    roleId === "rows" || roleId === "selected_rows" || block.family === "Source"
  );
}

function getConfiguredSourceMetadata(
  block: WorkflowBlock,
  config: Record<string, unknown>
) {
  return {
    columns: config.columns,
    fileName: config.fileName || config.workbookName,
    rowCount: Array.isArray(config.rows) ? config.rows.length : undefined,
    selectedRange: config.selectedRange,
    selectedSheet: config.selectedSheet,
    sourceKind: config.sourceKind,
    sourceLocator: config.sourceLocator || block.source?.locator,
    uploadTimestamp: config.uploadTimestamp,
  };
}

function getConfiguredPreviewValue(block: WorkflowBlock, roleId?: string) {
  const config = block.config || {};
  if (isRowsPreviewRole(block, roleId)) {
    const rows = getConfiguredRows(config);
    if (Array.isArray(rows)) return rows;
  }
  if (roleId === "source_metadata") return getConfiguredSourceMetadata(block, config);
  if (roleId === "source_locator") return config.sourceLocator || block.source?.locator;
  if (roleId === "keyword_rules" || config.sourceKind === "keyword_rules") {
    const rules = config.keywordRules || config.rules || config.manualRules;
    if (Array.isArray(rules)) return rules;
  }
  if (roleId === "value") return config.value || config.manualValue || config.scalarValue;
}

function getSourcePreviewRole(block: WorkflowBlock) {
  return block.config.sourceKind === "keyword_rules" ? "keyword_rules" : "rows";
}

function hasConnectedCalculationRuleSource({
  block,
  edges,
}: {
  block: WorkflowBlock;
  edges: WorkflowEdge[];
}) {
  return edges.some(
    (edge) =>
      edge.target === block.id &&
      (edge.data?.targetInputRole === "calculation_rules" ||
        edge.data?.workflowEdge?.targetInputRole === "calculation_rules")
  );
}

function getCalculationModeLabel({
  hasExternalRules,
  mode,
}: {
  hasExternalRules: boolean;
  mode: string;
}) {
  if (mode === "auto") {
    return hasExternalRules
      ? "auto:external - using connected Calculation Rules Source"
      : "auto:inline - using inline formulas from block config";
  }
  if (mode === "inline") return "inline - using block config formulas";
  return "external_rules - requires connected Calculation Rules Source";
}

function getInlineCalculationFormulas(config: Record<string, unknown>) {
  if (Array.isArray(config.formulas)) return config.formulas as Record<string, unknown>[];
  if (Array.isArray(config.calculationRules)) return config.calculationRules as Record<string, unknown>[];
  return [];
}

function formatInlineCalculationFormula(formula: Record<string, unknown>) {
  if (typeof formula.formulaExpression === "string") {
    return `${String(formula.resultKey)} = ${formula.formulaExpression}`;
  }
  const operands = Array.isArray(formula.operands)
    ? formula.operands.map(String).join(", ")
    : "";
  return `${String(formula.resultKey)} = ${String(formula.operation)}(${operands})`;
}

// ─── UI primitives ───────────────────────────────────────────────────────────

function Field({
  disabled,
  label,
  onChange,
  onReadOnlyAttempt,
  placeholder,
  readOnly,
  value,
}: {
  disabled?: boolean;
  label: string;
  onChange?: (value: string) => void;
  onReadOnlyAttempt?: () => void;
  placeholder?: string;
  readOnly?: boolean;
  value: string;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="ml-1">{label}</Label>
      <Input
        disabled={disabled}
        onChange={(event) => {
          if (readOnly) { onReadOnlyAttempt?.(); return; }
          onChange?.(event.target.value);
        }}
        onFocus={() => { if (readOnly) onReadOnlyAttempt?.(); }}
        placeholder={placeholder}
        readOnly={readOnly}
        value={value}
      />
    </div>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 font-medium text-muted-foreground text-xs uppercase tracking-wide">
      {children}
    </div>
  );
}

function SummaryRows({
  rows,
}: {
  rows: Array<{ label: string; value: unknown }>;
}) {
  return (
    <div className="divide-y rounded border bg-background/40 text-xs">
      {rows.map((row) => (
        <div
          className="grid grid-cols-[9rem_1fr] gap-2 px-2 py-1.5"
          key={row.label}
        >
          <span className="text-muted-foreground">{row.label}</span>
          <span className="break-words font-medium">
            {formatSummaryValue(row.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function formatSummaryValue(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (typeof value === "object" && value !== null) return JSON.stringify(value, null, 2);
  return String(value ?? "");
}

// ─── Connections section ──────────────────────────────────────────────────────

function ConnectionsSection({
  block,
  edges,
  nodes,
  onCreateSourceForInput,
  tool,
}: {
  block: WorkflowBlock;
  edges: WorkflowEdge[];
  nodes: WorkflowNode[];
  onCreateSourceForInput: (inputRoleId: string) => void;
  tool: ToolDefinition | null;
}) {
  const incoming = edges.filter((e) => e.target === block.id);
  const outgoing = edges.filter((e) => e.source === block.id);
  const missingInputs = tool
    ? tool.inputRoles.filter(
        (role) =>
          role.required &&
          !incoming.some(
            (e) => e.data?.workflowEdge?.targetInputRole === role.id
          )
      )
    : [];

  if (incoming.length === 0 && outgoing.length === 0 && missingInputs.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3 p-4">
      <SectionLabel>Connections</SectionLabel>
      {incoming.length > 0 && (
        <div className="space-y-1">
          <div className="mb-1.5 text-muted-foreground text-xs">From</div>
          {incoming.map((edge) => (
            <div
              className="flex items-center justify-between rounded border bg-background/60 px-2 py-1.5 text-xs"
              key={edge.id}
            >
              <span className="font-medium">{getBlockLabel(nodes, edge.source)}</span>
              <span className="text-muted-foreground">
                {edge.data?.workflowEdge?.targetInputRole || "input"}
              </span>
            </div>
          ))}
        </div>
      )}
      {outgoing.length > 0 && (
        <div className="space-y-1">
          <div className="mb-1.5 text-muted-foreground text-xs">To</div>
          {outgoing.map((edge) => (
            <div
              className="flex items-center justify-between rounded border bg-background/60 px-2 py-1.5 text-xs"
              key={edge.id}
            >
              <span className="font-medium">{getBlockLabel(nodes, edge.target)}</span>
              <span className="text-muted-foreground">
                {edge.data?.workflowEdge?.sourceOutputRole || "output"}
              </span>
            </div>
          ))}
        </div>
      )}
      {missingInputs.map((role) => (
        <div
          className="rounded border border-amber-500/30 bg-amber-500/10 p-2 text-xs"
          key={role.id}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-amber-700 dark:text-amber-400">
              {role.label} not connected
            </span>
            <div className="flex gap-1.5">
              <Button
                onClick={() =>
                  toast.info(
                    "Drag a connector from an existing block, then select the edge to assign this input role."
                  )
                }
                size="sm"
                type="button"
                variant="outline"
                className="h-6 text-xs"
              >
                Connect
              </Button>
              <Button
                onClick={() => onCreateSourceForInput(role.id)}
                size="sm"
                type="button"
                variant="secondary"
                className="h-6 text-xs"
              >
                <Plus className="mr-1 size-2.5" />
                Create Source
              </Button>
            </div>
          </div>
          {role.acceptedFamilies.length > 0 && (
            <div className="mt-1 text-muted-foreground">
              Accepts: {role.acceptedFamilies.join(", ")}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Last run section ─────────────────────────────────────────────────────────

const KEYWORD_MAPPER_ROUTING_FALLBACK = {
  lowConfidenceRows: "Low Confidence Warning",
  routesByTarget: {
    accountingExpenses: "Expense Aggregation",
    generalExpenses: "Expense Aggregation",
    interestIncome: "Property Income Aggregation",
    otherFapiIncome: "Property Income Aggregation",
    rents: "Property Income Aggregation",
  },
  unmatchedRows: "Unmatched Rows Check",
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: run summary rows vary per block type
function getRunSummaryRows({
  block,
  output,
  result,
}: {
  block: WorkflowBlock;
  output: Record<string, unknown>;
  result: Record<string, unknown> | null;
}) {
  const mappingSummary = asRecord(output.mappingSummary);
  const subtotal = asRecord(output.subtotal);
  const validation = asRecord(output.validationResult);
  const approval = asRecord(output.approvalStatus);
  const protectedResult = asRecord(output.protectedResult);

  if (block.subtype === "Classification / Mapping") {
    return [
      { label: "Status", value: result?.status || "not-run" },
      { label: "Rows processed", value: mappingSummary.totalRows ?? "-" },
      { label: "Mapped", value: mappingSummary.mappedCount ?? "-" },
      { label: "Unmatched", value: mappingSummary.unmatchedCount ?? "-" },
      { label: "Low confidence", value: mappingSummary.lowConfidenceCount ?? "-" },
    ];
  }
  if (block.subtype === "Aggregation") {
    return [
      { label: "Status", value: result?.status || "not-run" },
      { label: "Subtotal", value: subtotal.value ?? output.subtotalValue ?? "-" },
      { label: "Currency", value: subtotal.currency ?? "-" },
    ];
  }
  if (block.subtype === "Hierarchy Aggregator") {
    const finalTotals = asRecord(output.finalTotals);
    const aggregationSummary = asRecord(output.aggregationSummary);
    return [
      { label: "Status", value: result?.status || "not-run" },
      { label: "Final totals", value: Object.keys(finalTotals).length > 0 ? JSON.stringify(finalTotals) : "-" },
      { label: "Warnings", value: Array.isArray(aggregationSummary.warnings) ? aggregationSummary.warnings.length : 0 },
    ];
  }
  if (block.family === "Field") {
    return [
      { label: "Status", value: result?.status || "not-run" },
    ];
  }
  return [
    { label: "Status", value: result?.status || "not-run" },
    { label: "Validation", value: validation.status ?? "-" },
    { label: "Approval", value: approval.status ?? "-" },
  ];
}

function getRunStatusColor(status: string) {
  if (status === "success") return "text-emerald-600 dark:text-emerald-400";
  if (status === "error" || status === "failed") return "text-red-600 dark:text-red-400";
  if (status === "running") return "text-sky-600 dark:text-sky-400";
  return "text-muted-foreground";
}

function LastRunSection({
  block,
  disabled,
  lastRun,
  nodes,
  edges,
  onRunMockTest,
  onRunDownstreamTest,
  output,
  result,
  tool,
}: {
  block: WorkflowBlock;
  disabled?: boolean;
  lastRun?: LocalRunRecord;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  onRunMockTest: () => void;
  onRunDownstreamTest: () => void;
  output: Record<string, unknown>;
  result: Record<string, unknown> | null;
  tool: ToolDefinition | null;
}) {
  const summaryRows = getRunSummaryRows({ block, output, result });
  const statusRow = summaryRows[0];
  const status = String(statusRow?.value || "not-run");
  const metricRows = summaryRows.slice(1).filter((r) => r.value !== "-" && r.value !== 0);
  const incomingEdges = edges.filter((e) => e.target === block.id);

  return (
    <div className="space-y-3 p-4">
      <SectionLabel>Last run</SectionLabel>
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs">
          {result ? (
            <>
              <span className={getRunStatusColor(status)}>{status}</span>
              {metricRows[0] && (
                <span className="ml-2 text-muted-foreground">
                  · {metricRows[0].label}: {String(metricRows[0].value)}
                </span>
              )}
            </>
          ) : (
            <span className="text-muted-foreground">Not run yet</span>
          )}
        </div>
        <div className="flex shrink-0 gap-1.5">
          <Button
            disabled={disabled}
            onClick={onRunMockTest}
            size="sm"
            type="button"
            variant="secondary"
            className="h-7 text-xs"
          >
            <Play className="mr-1 size-3" />
            Run
          </Button>
          <Button
            disabled={disabled}
            onClick={onRunDownstreamTest}
            size="sm"
            type="button"
            variant="outline"
            className="h-7 text-xs"
          >
            Run downstream
          </Button>
        </div>
      </div>

      {result && (
        <SummaryRows rows={[
          ...summaryRows,
          { label: "Duration", value: result.completedAt || "—" },
        ]} />
      )}

      {result && block.subtype === "Hierarchy Aggregator" && (
        <HierarchyAggregatorRunSections compact output={output} />
      )}

      {result && block.subtype === "Calculation Engine" && (
        <CalculationEngineRunSections
          lastRunOutput={output}
          resolvedMode={
            typeof (asRecord(output.calculationSummary)).formulaMode === "string"
              ? String((asRecord(output.calculationSummary)).formulaMode)
              : undefined
          }
        />
      )}

      {result && incomingEdges.length > 0 && (
        <div className="space-y-1.5">
          <div className="text-muted-foreground text-xs">Inputs consumed</div>
          <div className="max-h-48 space-y-1.5 overflow-y-auto">
            {incomingEdges.map((edge) => {
              const sourceBlock = nodes.find((n) => n.id === edge.source)?.data.block;
              const sourceOutputRole = edge.data?.workflowEdge?.sourceOutputRole || "output";
              const value = sourceBlock
                ? getLatestOutputValueForRole({ block: sourceBlock, lastRun, roleId: sourceOutputRole })
                : undefined;
              return (
                <DataPreviewCard
                  bindingLabel={edge.data?.workflowEdge?.bindingLabel}
                  connectedBlockLabel={getBlockLabel(nodes, edge.source)}
                  contextData={sourceBlock ? getLatestToolOutput({ blockId: sourceBlock.id, lastRun }) : undefined}
                  direction="input"
                  key={edge.id}
                  outputType={sourceBlock ? getOutputTypeForRole({ block: sourceBlock, roleId: sourceOutputRole }) : sourceOutputRole}
                  roleId={edge.data?.workflowEdge?.targetInputRole || "input"}
                  roleLabel={edge.data?.workflowEdge?.targetInputRole || "Input"}
                  sourceOutputRole={sourceOutputRole}
                  status={value === undefined ? "warning" : "ready"}
                  value={value}
                />
              );
            })}
          </div>
        </div>
      )}

      {result && tool && (
        <div className="space-y-1.5">
          <div className="text-muted-foreground text-xs">Outputs produced</div>
          <div className="max-h-48 space-y-1.5 overflow-y-auto">
            {tool.outputRoles.map((role) => (
              <DataPreviewCard
                contextData={output}
                direction="output"
                key={role.id}
                outputType={role.outputType}
                roleId={role.id}
                roleLabel={role.label}
                status={result ? "ready" : "warning"}
                value={getRoleOutputValue(role, output)}
              />
            ))}
          </div>
        </div>
      )}

      {result && block.subtype === "Classification / Mapping" && Array.isArray(output.mappedRows) && output.mappedRows.length > 0 && (
        <div className="max-h-56 overflow-auto rounded-md border text-xs">
          <table className="w-full text-left">
            <thead className="sticky top-0 bg-background">
              <tr className="border-b">
                <th className="px-2 py-1">Row</th>
                <th className="px-2 py-1">Matched keyword</th>
                <th className="px-2 py-1">Confidence</th>
                <th className="px-2 py-1">Target</th>
              </tr>
            </thead>
            <tbody>
              {output.mappedRows.map((row) => {
                const record = asRecord(row);
                return (
                  <tr className="border-b last:border-b-0" key={String(record.rowId || record.label)}>
                    <td className="px-2 py-1">{String(record.label)}</td>
                    <td className="px-2 py-1">{String(record.matchedKeyword || "")}</td>
                    <td className="px-2 py-1">{String(record.confidence || "")}</td>
                    <td className="px-2 py-1">{String(record.target || "")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── Advanced section ─────────────────────────────────────────────────────────

function RuntimeVisibilityEditor({
  block,
  disabled,
  setRuntimeValue,
}: {
  block: WorkflowBlock;
  disabled?: boolean;
  setRuntimeValue: (key: keyof WorkflowBlock["runtime"], value: boolean | string) => void;
}) {
  const items: Array<{ key: keyof WorkflowBlock["runtime"]; label: string; value: boolean }> = [
    { key: "visible", label: "Visible in generated runtime UI", value: block.runtime.visible },
    { key: "editableInRuntime", label: "Editable in generated runtime UI", value: block.runtime.editableInRuntime },
    { key: "generatedUiLocked", label: "Locked in generated runtime UI", value: block.runtime.generatedUiLocked },
    { key: "masked", label: "Masked in runtime", value: block.runtime.masked },
    { key: "showInRuns", label: "Show in Runs / Logs", value: block.runtime.showInRuns },
  ];

  return (
    <div className="space-y-2.5">
      <div className="font-medium text-xs">Runtime visibility</div>
      {items.map((item) => {
        const checkboxId = `runtime-${String(item.key)}`;
        return (
          <div className="flex items-center gap-2 text-sm" key={String(item.key)}>
            <Checkbox
              checked={item.value}
              disabled={disabled}
              id={checkboxId}
              onCheckedChange={(checked) => setRuntimeValue(item.key, checked === true)}
            />
            <Label className="font-normal text-xs" htmlFor={checkboxId}>
              {item.label}
            </Label>
          </div>
        );
      })}
    </div>
  );
}

function AdvancedSection({
  block,
  config,
  disabled,
  edges,
  nodes,
  setRuntimeValue,
  tool,
}: {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  disabled?: boolean;
  edges: WorkflowEdge[];
  nodes: WorkflowNode[];
  setRuntimeValue: (key: keyof WorkflowBlock["runtime"], value: boolean | string) => void;
  tool: ToolDefinition | null;
}) {
  const codePreview = generateBlockCodePreview({
    block,
    config,
    inputBindings: edges
      .filter((e) => e.target === block.id)
      .map((edge) => ({
        label: edge.data?.workflowEdge?.targetInputRole || "input",
        value: `${getBlockLabel(nodes, edge.source)}.${edge.data?.workflowEdge?.sourceOutputRole || "output"}`,
      })),
    tool,
  });

  const copyCode = async () => {
    await navigator.clipboard.writeText(codePreview.code);
    toast.success("Copied generated code");
  };

  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between p-4 text-muted-foreground text-xs hover:text-foreground">
        <span className="font-medium uppercase tracking-wide">Advanced</span>
        <ChevronDown className="size-3.5 transition-transform group-open:rotate-180" />
      </summary>
      <div className="space-y-4 px-4 pb-4">
        <RuntimeVisibilityEditor
          block={block}
          disabled={disabled}
          setRuntimeValue={setRuntimeValue}
        />
        <div className="flex items-center gap-2">
          <Button
            className="h-7 text-xs"
            onClick={copyCode}
            size="sm"
            type="button"
            variant="outline"
          >
            <Copy className="mr-1.5 size-3" />
            Copy generated code
          </Button>
        </div>
      </div>
    </details>
  );
}

// ─── Keyword categories panel ─────────────────────────────────────────────────

type KeywordRule = {
  ruleId: string;
  categoryId: string;
  categoryLabel: string;
  keywords: string[];
  confidence?: number;
};

function KeywordCategoriesPanel({
  disabled,
  onChange,
  rules,
}: {
  disabled?: boolean;
  onChange: (rules: KeywordRule[]) => void;
  rules: KeywordRule[];
}) {
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newKeyword, setNewKeyword] = useState("");

  const addCategory = () => {
    const label = newLabel.trim();
    if (!label) return;
    const id = label.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    if (rules.some((r) => r.categoryId === id)) {
      toast.warning("A category with that name already exists.");
      return;
    }
    onChange([
      ...rules,
      { ruleId: `keyword-rule-${id}-${Date.now()}`, categoryId: id, categoryLabel: label, keywords: [], confidence: 0.8 },
    ]);
    setNewLabel("");
    setAdding(false);
    setExpandedId(id);
  };

  const deleteCategory = (ruleId: string) => {
    onChange(rules.filter((r) => r.ruleId !== ruleId));
  };

  const addKeyword = (ruleId: string) => {
    const kw = newKeyword.trim().toLowerCase();
    if (!kw) return;
    onChange(
      rules.map((r) =>
        r.ruleId === ruleId && !r.keywords.includes(kw)
          ? { ...r, keywords: [...r.keywords, kw] }
          : r
      )
    );
    setNewKeyword("");
  };

  const removeKeyword = (ruleId: string, kw: string) => {
    onChange(rules.map((r) => (r.ruleId === ruleId ? { ...r, keywords: r.keywords.filter((k) => k !== kw) } : r)));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">
          {rules.length === 0 ? "No categories yet" : `${rules.length} ${rules.length === 1 ? "category" : "categories"}`}
        </span>
        {!disabled && !adding && (
          <Button className="h-6 text-xs" onClick={() => setAdding(true)} size="sm" type="button" variant="outline">
            <Plus className="mr-1 size-2.5" />
            Add category
          </Button>
        )}
      </div>

      {adding && (
        <div className="flex gap-1.5">
          <Input
            autoFocus
            className="h-7 text-xs"
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addCategory(); if (e.key === "Escape") { setAdding(false); setNewLabel(""); } }}
            placeholder="Category name…"
            value={newLabel}
          />
          <Button className="h-7 shrink-0 px-2 text-xs" onClick={addCategory} size="sm" type="button" variant="secondary">
            Add
          </Button>
          <Button className="h-7 shrink-0 px-2" onClick={() => { setAdding(false); setNewLabel(""); }} size="sm" type="button" variant="ghost">
            <X className="size-3" />
          </Button>
        </div>
      )}

      <div className="space-y-1">
        {rules.map((rule) => {
          const isExpanded = expandedId === rule.categoryId;
          return (
            <div className="rounded border bg-background/60" key={rule.ruleId}>
              <div
                className="flex cursor-pointer items-center justify-between px-2 py-1.5 text-xs"
                onClick={() => setExpandedId(isExpanded ? null : rule.categoryId)}
              >
                <div className="flex items-center gap-1.5 font-medium">
                  <ChevronDown className={`size-3 text-muted-foreground transition-transform ${isExpanded ? "" : "-rotate-90"}`} />
                  {rule.categoryLabel}
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
                    {rule.keywords.length}
                  </span>
                  {!disabled && (
                    <button
                      className="text-muted-foreground hover:text-destructive"
                      onClick={(e) => { e.stopPropagation(); deleteCategory(rule.ruleId); }}
                      type="button"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  )}
                </div>
              </div>
              {isExpanded && (
                <div className="border-t px-2 py-2 space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {rule.keywords.map((kw) => (
                      <span
                        className="flex items-center gap-1 rounded-full border bg-muted/50 px-2 py-0.5 text-[11px]"
                        key={kw}
                      >
                        {kw}
                        {!disabled && (
                          <button
                            className="text-muted-foreground hover:text-destructive"
                            onClick={() => removeKeyword(rule.ruleId, kw)}
                            type="button"
                          >
                            <X className="size-2.5" />
                          </button>
                        )}
                      </span>
                    ))}
                    {rule.keywords.length === 0 && (
                      <span className="text-muted-foreground text-[11px]">No keywords yet</span>
                    )}
                  </div>
                  {!disabled && (
                    <div className="flex gap-1.5">
                      <Input
                        className="h-6 text-xs"
                        onChange={(e) => setNewKeyword(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") addKeyword(rule.ruleId); }}
                        placeholder="Add keyword…"
                        value={newKeyword}
                      />
                      <Button
                        className="h-6 shrink-0 px-2 text-xs"
                        onClick={() => addKeyword(rule.ruleId)}
                        size="sm"
                        type="button"
                        variant="secondary"
                      >
                        Add
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Aggregation nodes panel ──────────────────────────────────────────────────

type AggregationNode = {
  nodeId: string;
  label: string;
  nodeType: "group" | "formula" | "constant";
  operation: string;
  includeCategoryIds?: string[];
  order?: number;
};

function AggregationNodesPanel({
  disabled,
  nodes: aggrNodes,
  onChange,
}: {
  disabled?: boolean;
  nodes: AggregationNode[];
  onChange: (nodes: AggregationNode[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<"group" | "formula" | "constant">("group");

  const addNode = () => {
    const label = newLabel.trim();
    if (!label) return;
    const nodeId = label.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    onChange([
      ...aggrNodes,
      {
        nodeId: `${nodeId}_${Date.now()}`,
        label,
        nodeType: newType,
        operation: newType === "group" ? "sum" : newType === "formula" ? "formula" : "constant",
        includeCategoryIds: [],
        order: (aggrNodes[aggrNodes.length - 1]?.order ?? 0) + 10,
      },
    ]);
    setNewLabel("");
    setAdding(false);
  };

  const deleteNode = (nodeId: string) => {
    onChange(aggrNodes.filter((n) => n.nodeId !== nodeId));
  };

  const NODE_TYPE_LABELS: Record<AggregationNode["nodeType"], string> = {
    group: "Sum",
    formula: "Formula",
    constant: "Constant",
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-xs">
          {aggrNodes.length === 0 ? "No rules yet" : `${aggrNodes.length} ${aggrNodes.length === 1 ? "rule" : "rules"}`}
        </span>
        {!disabled && !adding && (
          <Button className="h-6 text-xs" onClick={() => setAdding(true)} size="sm" type="button" variant="outline">
            <Plus className="mr-1 size-2.5" />
            Add rule
          </Button>
        )}
      </div>

      {adding && (
        <div className="space-y-1.5 rounded-md border bg-muted/20 p-2">
          <Input
            autoFocus
            className="h-7 text-xs"
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addNode(); if (e.key === "Escape") { setAdding(false); setNewLabel(""); } }}
            placeholder="Rule label…"
            value={newLabel}
          />
          <div className="flex gap-1.5">
            {(["group", "formula", "constant"] as const).map((t) => (
              <button
                className={`rounded border px-2 py-0.5 text-[11px] transition-colors ${newType === t ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background text-muted-foreground hover:text-foreground"}`}
                key={t}
                onClick={() => setNewType(t)}
                type="button"
              >
                {NODE_TYPE_LABELS[t]}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5">
            <Button className="h-6 text-xs" onClick={addNode} size="sm" type="button" variant="secondary">
              Add
            </Button>
            <Button className="h-6 text-xs" onClick={() => { setAdding(false); setNewLabel(""); }} size="sm" type="button" variant="ghost">
              Cancel
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-1">
        {aggrNodes.map((node) => (
          <div
            className="flex items-center justify-between rounded border bg-background/60 px-2 py-1.5 text-xs"
            key={node.nodeId}
          >
            <div className="flex items-center gap-2 font-medium">
              {node.label}
              <span className="text-[10px] text-muted-foreground">{NODE_TYPE_LABELS[node.nodeType]}</span>
            </div>
            {!disabled && (
              <button
                className="text-muted-foreground hover:text-destructive"
                onClick={() => deleteNode(node.nodeId)}
                type="button"
              >
                <Trash2 className="size-3" />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Configure section ────────────────────────────────────────────────────────

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: block-family-specific configure sections stay colocated
function ConfigureSection({
  block,
  config,
  disabled,
  edges,
  nodes,
  onCreateSourceForInput,
  onCreateSourceLogic,
  onCreateSourceVersion,
  setConfigValue,
  setConfigValues,
  showImmutableMessage,
  sourceLocked,
  sourceUsedInRun,
  sourceVersion,
  ruleKnowledgeSource,
  selectedToolOutput,
  upstreamBlocks,
  downstreamBlocks,
  protectedUnlocked,
  protectedFieldsDisabled,
  setGovernanceValue,
}: {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  disabled?: boolean;
  edges: WorkflowEdge[];
  nodes: WorkflowNode[];
  onCreateSourceForInput: (inputRoleId: string) => void;
  onCreateSourceLogic: (variant: SourceLogicVariant) => void;
  onCreateSourceVersion: () => void;
  setConfigValue: (key: string, value: unknown) => void;
  setConfigValues: (patch: Record<string, unknown>) => void;
  showImmutableMessage: () => void;
  sourceLocked: boolean;
  sourceUsedInRun: boolean;
  sourceVersion: number;
  ruleKnowledgeSource: boolean;
  selectedToolOutput: Record<string, unknown>;
  upstreamBlocks: WorkflowBlock[];
  downstreamBlocks: WorkflowBlock[];
  protectedUnlocked: boolean;
  protectedFieldsDisabled: boolean;
  setGovernanceValue: (key: keyof NonNullable<WorkflowBlock["governance"]>, value: string | boolean) => void;
}) {
  const matchFields = getStringArray(config.matchFields, ["account", "label", "description"]);

  const toggleMatchField = (field: string, checked: boolean) => {
    const nextFields = checked
      ? [...new Set([...matchFields, field])]
      : matchFields.filter((item) => item !== field);
    setConfigValue("matchFields", nextFields);
  };

  if (block.family === "Source") {
    const roleId = getSourcePreviewRole(block);
    return (
      <div className="space-y-3">
        <div className="text-muted-foreground text-xs">
          Source evidence and rule knowledge are read-only once published. Corrections happen downstream in Logic.
        </div>
        <DataPreviewCard
          direction="output"
          fallbackPreview={getConfiguredPreviewValue(block, roleId)}
          outputType={roleId}
          roleId={roleId}
          roleLabel={roleId === "keyword_rules" ? "Keyword rules" : "Rows"}
          status={sourceLocked ? "ready" : "warning"}
          statusLabel={sourceLocked ? "read-only" : "draft setup"}
          value={getRoleOutputValue(
            getToolOutputRoleById(block, roleId) || {
              canRouteToFamilies: [],
              description: "",
              id: roleId,
              label: roleId,
              outputType: roleId,
            },
            selectedToolOutput
          )}
        />
        <SourceVersionNotice
          disabled={disabled}
          onCreateSourceVersion={onCreateSourceVersion}
          sourceLocked={sourceLocked}
          sourceRole={ruleKnowledgeSource ? "rulebook" : "evidence"}
          sourceVersion={sourceVersion}
        />
        <SourceSetupPanel
          block={block}
          config={config}
          disabled={disabled}
          onConfigPatch={setConfigValues}
          onCreateSourceVersion={onCreateSourceVersion}
          sourceLocked={sourceLocked}
          sourceUsedInRun={sourceUsedInRun}
          sourceVersion={sourceVersion}
        />
        <div className="grid gap-2.5 sm:grid-cols-2">
          <Field
            disabled={disabled || sourceLocked}
            label="Connection method"
            onChange={(value) => setConfigValue("connectionMethod", value)}
            value={getString(config.connectionMethod, block.subtype)}
          />
          <Field
            disabled={disabled || sourceLocked}
            label="Extraction mode"
            onChange={(value) => setConfigValue("extractionMode", value)}
            value={getString(config.extractionMode, "Mock local preview")}
          />
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button disabled={disabled} onClick={() => onCreateSourceLogic("derived")} size="sm" type="button" variant="secondary">
            Create derived Logic
          </Button>
          <Button disabled={disabled} onClick={() => onCreateSourceLogic("correction")} size="sm" type="button" variant="secondary">
            Create correction Logic
          </Button>
          <Button disabled={disabled} onClick={() => onCreateSourceLogic("annotation")} size="sm" type="button" variant="secondary">
            Create annotation Logic
          </Button>
          <Button disabled={disabled} onClick={() => onCreateSourceLogic("override")} size="sm" type="button" variant="secondary">
            Create override Logic
          </Button>
        </div>
      </div>
    );
  }

  if (block.family === "Logic") {
    return (
      <div className="space-y-3">
        <LogicModeEditor
          disabled={disabled}
          onChange={(value) => setConfigValue("logicMode", value)}
          value={getString(config.logicMode, block.subtype)}
        />
        {block.subtype === "Classification / Mapping" && (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">Keyword categories</div>
              <KeywordCategoriesPanel
                disabled={disabled}
                rules={Array.isArray(config.keywordRules) ? (config.keywordRules as KeywordRule[]) : []}
                onChange={(rules) => setConfigValue("keywordRules", rules)}
              />
            </div>
            <div className="space-y-2">
              <Label className="ml-1">Match fields</Label>
              <div className="grid gap-2 sm:grid-cols-3">
                {["account", "label", "description"].map((field) => (
                  <div
                    className="flex items-center gap-2 rounded border bg-muted/20 px-2 py-1 text-sm"
                    key={field}
                  >
                    <Checkbox
                      checked={matchFields.includes(field)}
                      disabled={disabled}
                      onCheckedChange={(checked) => toggleMatchField(field, checked === true)}
                    />
                    {field}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label className="ml-1">Match mode</Label>
                <Select
                  disabled={disabled}
                  onValueChange={(value) => setConfigValue("matchMode", value)}
                  value={getString(config.matchMode, "contains")}
                >
                  <SelectTrigger><SelectValue placeholder="Match mode" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contains">contains</SelectItem>
                    <SelectItem value="exact">exact</SelectItem>
                    <SelectItem value="starts_with">starts with</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="ml-1">Conflict strategy</Label>
                <Select
                  disabled={disabled}
                  onValueChange={(value) => setConfigValue("conflictStrategy", value)}
                  value={getString(config.conflictStrategy, "highest_confidence")}
                >
                  <SelectTrigger><SelectValue placeholder="Conflict strategy" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="highest_confidence">highest confidence wins</SelectItem>
                    <SelectItem value="highest_priority">highest priority wins</SelectItem>
                    <SelectItem value="send_conflict_to_review">send conflict to review</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Field
                disabled={disabled}
                label="Low confidence threshold"
                onChange={(value) => setConfigValue("lowConfidenceThreshold", value)}
                value={getString(config.lowConfidenceThreshold, "0.75")}
              />
              <div className="space-y-1.5">
                <Label className="ml-1">Unmatched behavior</Label>
                <Select
                  disabled={disabled}
                  onValueChange={(value) => setConfigValue("unmatchedBehavior", value)}
                  value={getString(config.unmatchedBehavior, "send_to_review")}
                >
                  <SelectTrigger><SelectValue placeholder="Unmatched behavior" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="send_to_review">send to review</SelectItem>
                    <SelectItem value="ignore">ignore</SelectItem>
                    <SelectItem value="mark_as_unmapped">mark as unmapped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
        {block.subtype === "Calculation Engine" && (
          <CalculationEngineModeSection
            block={block}
            disabled={Boolean(disabled)}
            edges={edges}
            lastRunOutput={selectedToolOutput}
            nodes={nodes}
            onUpdateConfig={setConfigValue}
          />
        )}
        {String(config.logicMode || block.subtype) === "Formula" && (
          <Field
            disabled={disabled}
            label="Formula"
            onChange={(value) => setConfigValue("formula", value)}
            value={getString(config.formula || block.formula?.expression)}
          />
        )}
        {String(config.logicMode || block.subtype) === "Aggregation" && (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="mb-1 font-medium text-muted-foreground text-xs uppercase tracking-wide">Aggregation rules</div>
              <AggregationNodesPanel
                disabled={disabled}
                nodes={Array.isArray(config.aggregationRules) ? (config.aggregationRules as AggregationNode[]) : []}
                onChange={(nodes) => setConfigValue("aggregationRules", nodes)}
              />
            </div>
            <div className="grid gap-2.5 sm:grid-cols-2">
              <Field
                disabled={disabled}
                label="Aggregation method"
                onChange={(value) => setConfigValue("aggregationMethod", value)}
                value={getString(config.aggregationMethod, "sum")}
              />
              <Field
                disabled={disabled}
                label="Amount field"
                onChange={(value) => setConfigValue("amountField", value)}
                value={getString(config.amountField, "amount")}
              />
            </div>
          </div>
        )}
        {String(config.logicMode || block.subtype) === "Script" && (
          <div className="max-h-72 overflow-auto rounded-md border">
            <CodeEditor
              language="typescript"
              onChange={(value) => setConfigValue("scriptBody", value)}
              options={{ minimap: { enabled: false } }}
              value={getString(config.scriptBody || block.code?.body, "return { success: true, data: input };")}
            />
          </div>
        )}
        {String(config.logicMode || block.subtype) === "Condition" && (
          <div className="grid gap-2.5 sm:grid-cols-2">
            <Field
              disabled={disabled}
              label="Condition expression"
              onChange={(value) => setConfigValue("conditionExpression", value)}
              value={getString(config.conditionExpression, "value != null")}
            />
            <Field
              disabled={disabled}
              label="True path"
              onChange={(value) => setConfigValue("truePath", value)}
              value={getString(config.truePath)}
            />
            <Field
              disabled={disabled}
              label="False path"
              onChange={(value) => setConfigValue("falsePath", value)}
              value={getString(config.falsePath)}
            />
          </div>
        )}
        <Field
          disabled={disabled}
          label="Owner"
          onChange={(value) => setConfigValue("owner", value)}
          value={getString(config.owner)}
        />
      </div>
    );
  }

  if (block.family === "Review / Validation") {
    return (
      <div className="space-y-3">
        <p className="text-muted-foreground text-xs">
          Judges completeness, trust, approval, or readiness without transforming source values.
        </p>
        <div className="grid gap-2.5 sm:grid-cols-2">
          <Field
            disabled={disabled}
            label="Severity"
            onChange={(value) => setConfigValue("validationSeverity", value)}
            value={getString(config.validationSeverity, "warning")}
          />
          <Field
            disabled={disabled}
            label="Threshold"
            onChange={(value) => setConfigValue("threshold", value)}
            value={getString(config.threshold, "0.75")}
          />
          <Field
            disabled={disabled}
            label="Reviewer / sign-off"
            onChange={(value) => setConfigValue("reviewer", value)}
            value={getString(config.reviewer)}
          />
          <Field
            disabled={disabled}
            label="Blocking behavior"
            onChange={(value) => setConfigValue("blockingBehavior", value)}
            value={getString(config.blockingBehavior, "non-blocking")}
          />
        </div>
        {block.subtype === "Approval Gate" && (
          <div className="grid gap-2.5 rounded-md border bg-background/60 p-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label className="ml-1">Approved</Label>
              <Select
                disabled={disabled}
                onValueChange={(value) => setConfigValue("approved", value === "true")}
                value={String(config.approved !== false)}
              >
                <SelectTrigger><SelectValue placeholder="Approval state" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">approved</SelectItem>
                  <SelectItem value="false">not approved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Field
              disabled={disabled}
              label="Approval notes"
              onChange={(value) => setConfigValue("notes", value)}
              value={getString(config.notes)}
            />
          </div>
        )}
      </div>
    );
  }

  if (block.family === "Field") {
    const fields = Array.isArray(config.fields) ? (config.fields as { key: string; label: string }[]) : [];
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-violet-400">
          <LayoutList className="size-4" />
          <span className="font-medium">Displayed fields</span>
        </div>
        {fields.length === 0 ? (
          <p className="text-muted-foreground text-xs">
            Connect an upstream block (Calculation Engine, Category Rollup, etc.) to display its computed values here.
          </p>
        ) : (
          <div className="space-y-1">
            {fields.map((f) => (
              <div key={f.key} className="flex items-center justify-between rounded border px-2 py-1.5 text-sm">
                <span className="font-medium">{f.label || f.key}</span>
                <span className="text-muted-foreground text-xs">{f.key}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (block.family === "Output") {
    return (
      <div className="grid gap-2.5 sm:grid-cols-2">
        <Field
          disabled={disabled}
          label="Target format / system"
          onChange={(value) => setConfigValue("targetFormat", value)}
          value={getString(config.targetFormat, block.subtype)}
        />
        <Field
          disabled={disabled}
          label="Readiness requirements"
          onChange={(value) => setConfigValue("outputReadinessRequirements", value)}
          value={getString(config.outputReadinessRequirements)}
        />
        <Field
          disabled={disabled}
          label="Source trace"
          onChange={(value) => setConfigValue("sourceTraceSetting", value)}
          value={getString(config.sourceTraceSetting, "include summary")}
        />
      </div>
    );
  }

  if (block.family === "AI / Agent") {
    return (
      <div className="space-y-3">
        <Field
          disabled={disabled}
          label="Prompt / config"
          onChange={(value) => setConfigValue("aiPrompt", value)}
          value={getString(config.aiPrompt || config.prompt)}
        />
        <div className="grid gap-2.5 sm:grid-cols-2">
          <Field
            disabled={disabled}
            label="Allowed actions"
            onChange={(value) => setConfigValue("allowedActions", value)}
            value={getString(config.allowedActions, "propose only")}
          />
          <Field
            disabled={disabled}
            label="Selected tools"
            onChange={(value) => setConfigValue("selectedTools", value)}
            value={getString(config.selectedTools, "local catalog")}
          />
        </div>
        <AiAgentProposalNotice />
      </div>
    );
  }

  return null;
}

// ─── Main export ──────────────────────────────────────────────────────────────

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: family-specific inspector branches kept colocated
export function BlockInspector({
  disabled,
  draftData,
  edges,
  lastRun,
  nodes,
  onCreateSourceForInput,
  onCreateSourceLogic,
  onCreateSourceVersion,
  onRunDownstreamTest,
  onRunMockTest,
  setDraftData,
}: BlockInspectorProps) {
  const block = draftData.block;

  if (!block) return null;

  const config = draftData.config || {};
  const sourceEvidence = Boolean(block.source?.treatedAsEvidence && block.source.immutable);
  const upstreamBlocks = edges
    .filter((edge) => edge.target === block.id)
    .map((edge) => nodes.find((node) => node.id === edge.source)?.data.block)
    .filter((item): item is WorkflowBlock => Boolean(item));
  const downstreamBlocks = edges
    .filter((edge) => edge.source === block.id)
    .map((edge) => nodes.find((node) => node.id === edge.target)?.data.block)
    .filter((item): item is WorkflowBlock => Boolean(item));
  const ruleKnowledgeSource = isRuleKnowledgeSource(block);
  const excelSource = isExcelWorkbookSource(block);
  const excelSourceHasEvidence = hasExcelSourceEvidence(config);
  const sourceHasLockableEvidence = Boolean(!excelSource || excelSourceHasEvidence);
  const selectedLog = lastRun?.logs.find((log) => log.nodeId === block.id);
  const selectedOutput =
    typeof selectedLog?.output === "object" && selectedLog.output !== null
      ? (selectedLog.output as Record<string, unknown>)
      : null;
  const selectedToolOutput = getToolResultOutput(selectedOutput);
  const sourceUsedInRun = Boolean(
    sourceHasLockableEvidence && (selectedLog || config.sourceUsedInRun)
  );
  const sourceLocked = Boolean(
    block.family === "Source" &&
      (config.sourceStatus === "published" ||
        (sourceEvidence && sourceHasLockableEvidence && sourceUsedInRun && !ruleKnowledgeSource))
  );
  const sourceVersion = Number(config.sourceVersion || 1);
  const tool = getToolForBlock(block);

  const updateDraft = (next: Partial<WorkflowNodeData>) => {
    setDraftData((current) => (current ? { ...current, ...next } : current));
  };

  const updateBlock = (nextBlock: WorkflowBlock) => {
    setDraftData((current) =>
      current ? { ...current, block: nextBlock, config: nextBlock.config } : current
    );
  };

  const setConfigValue = (key: string, value: unknown) => {
    const nextConfig = { ...config, [key]: value };
    updateDraft({ config: nextConfig, block: { ...block, config: nextConfig } });
  };

  const setConfigValues = (patch: Record<string, unknown>) => {
    const nextConfig = { ...config, ...patch };
    updateDraft({ config: nextConfig, block: { ...block, config: nextConfig } });
  };

  const setBlockValue = <Key extends keyof WorkflowBlock>(key: Key, value: WorkflowBlock[Key]) => {
    updateBlock({ ...block, [key]: value });
  };

  const setRuntimeValue = (key: keyof WorkflowBlock["runtime"], value: boolean | string) => {
    setBlockValue("runtime", { ...block.runtime, [key]: value });
  };

  const setGovernanceValue = (
    key: keyof NonNullable<WorkflowBlock["governance"]>,
    value: string | boolean
  ) => {
    if (!block.governance) return;
    setBlockValue("governance", { ...block.governance, [key]: value });
    if (key === "editIntent") setConfigValue("protectedEditIntent", value);
  };

  const showImmutableMessage = () => toast.warning(SOURCE_IMMUTABLE_MESSAGE);

  const familyIcon = {
    "Trigger": <Play className="size-3.5" />,
    "Source": <FileText className="size-3.5" />,
    "Logic": <GitBranch className="size-3.5" />,
    "Review / Validation": <ShieldCheck className="size-3.5" />,
    "Field": <LayoutList className="size-3.5" />,
    "Output": <FileLock2 className="size-3.5" />,
    "AI / Agent": <Bot className="size-3.5" />,
    "Protected": <Lock className="size-3.5" />,
  }[block.family];

  return (
    <div className="flex-1 divide-y overflow-y-auto">
      {/* ── Zone 1: Identity ── */}
      <div className="space-y-3 p-4">
        <div className="flex items-center gap-1.5 text-muted-foreground">
          {familyIcon}
          <span className="text-xs">{block.family} · {block.subtype}</span>
        </div>
        <Field
          disabled={disabled}
          label="Name"
          onChange={(value) => {
            if (sourceLocked) { showImmutableMessage(); return; }
            updateDraft({ label: value });
            setBlockValue("label", value);
          }}
          onReadOnlyAttempt={showImmutableMessage}
          readOnly={sourceLocked}
          value={draftData.label}
        />
        <Field
          disabled={disabled}
          label="Description"
          onChange={(value) => {
            updateDraft({ description: value });
            setBlockValue("description", value);
          }}
          value={draftData.description || ""}
        />
      </div>

      {/* ── Zone 2: Configure ── */}
      <div className="p-4">
        <SectionLabel>Configure</SectionLabel>
        <ConfigureSection
          block={block}
          config={config}
          disabled={disabled}
          downstreamBlocks={downstreamBlocks}
          edges={edges}
          nodes={nodes}
          onCreateSourceForInput={onCreateSourceForInput}
          onCreateSourceLogic={onCreateSourceLogic}
          onCreateSourceVersion={onCreateSourceVersion}
          protectedFieldsDisabled={false}
          protectedUnlocked={false}
          ruleKnowledgeSource={ruleKnowledgeSource}
          selectedToolOutput={selectedToolOutput}
          setConfigValue={setConfigValue}
          setConfigValues={setConfigValues}
          setGovernanceValue={setGovernanceValue}
          showImmutableMessage={showImmutableMessage}
          sourceLocked={sourceLocked}
          sourceUsedInRun={sourceUsedInRun}
          sourceVersion={sourceVersion}
          upstreamBlocks={upstreamBlocks}
        />
      </div>

      {/* ── Zone 3: Connections ── */}
      <ConnectionsSection
        block={block}
        edges={edges}
        nodes={nodes}
        onCreateSourceForInput={onCreateSourceForInput}
        tool={tool}
      />

      {/* ── Zone 4: Last run ── */}
      <LastRunSection
        block={block}
        disabled={disabled}
        edges={edges}
        lastRun={lastRun}
        nodes={nodes}
        onRunDownstreamTest={onRunDownstreamTest}
        onRunMockTest={onRunMockTest}
        output={selectedToolOutput}
        result={selectedOutput}
        tool={tool}
      />

      {/* ── Zone 5: Advanced ── */}
      <AdvancedSection
        block={block}
        config={config}
        disabled={disabled}
        edges={edges}
        nodes={nodes}
        setRuntimeValue={setRuntimeValue}
        tool={tool}
      />
    </div>
  );
}
