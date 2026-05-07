"use client";

import { ChevronDown, ChevronRight, Copy, Maximize2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type {
  LocalRunRecord,
  WorkflowBlock,
} from "@/lib/local-fiscal-workflow";
import {
  getToolForBlock,
  type ToolDefinition,
  type ToolOutputRole,
} from "@/lib/local-tool-registry";
import type { WorkflowEdge, WorkflowNode } from "@/lib/workflow-store";
import { getDataPreviewSummary } from "../data-viewer/data-preview-summary";
import { DATA_VIEW_LABELS } from "../data-viewer/data-view-tabs";
import { DataDisplayViewer } from "../data-viewer/data-viewer";
import type { DataDisplayView, DataStatus } from "../data-viewer/types";

const ROW_OUTPUT_ROLE_IDS = new Set(["rows", "selected_rows"]);
const WORKBOOK_OUTPUT_ROLE_IDS = new Set([
  "workbook_file",
  "selected_sheet",
  "selected_range",
]);

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null
    ? (value as Record<string, unknown>)
    : {};
}

function getConfiguredRows(config: Record<string, unknown>) {
  const rows =
    config.rows || config.manualRows || config.tableRows || config.sampleRows;
  return Array.isArray(rows) ? rows : undefined;
}

function isRowsPreviewRole(block: WorkflowBlock, roleId?: string) {
  return (
    ROW_OUTPUT_ROLE_IDS.has(roleId || "") ||
    (!roleId && block.family === "Source")
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
    sourceId: block.id,
    sourceKind: config.sourceKind,
    sourceLocator: config.sourceLocator || block.source?.locator,
    sourceName: block.label,
    sourceStatus: config.sourceStatus || block.status,
    sourceSubtype: block.subtype,
    sourceVersion: config.sourceVersion || 1,
    uploadTimestamp: config.uploadTimestamp,
    updatedAt: block.updatedAt,
    workbookId: config.workbookId,
  };
}

function getConfiguredWorkbookFile(config: Record<string, unknown>) {
  const workbookFile = asRecord(config.workbookFile);
  if (Object.keys(workbookFile).length > 0) {
    return workbookFile;
  }
  if (!(config.fileName || config.workbookName || config.workbookId)) {
    return;
  }
  return {
    fileName: config.fileName || config.workbookName,
    fileSize: config.fileSize,
    uploadedAt: config.uploadTimestamp,
    workbookId: config.workbookId,
  };
}

function getConfiguredSelectedSheet(config: Record<string, unknown>) {
  if (!config.selectedSheet) {
    return;
  }
  return {
    sheetName: config.selectedSheet,
    sheetCount: Array.isArray(config.sheets) ? config.sheets.length : undefined,
    workbookId: config.workbookId,
  };
}

function getConfiguredSelectedRange(config: Record<string, unknown>) {
  if (!config.selectedRange) {
    return;
  }
  return {
    range: config.selectedRange,
    rowCount: config.selectedRowsCount,
    selectedSheet: config.selectedSheet,
  };
}

function getConfiguredRules(config: Record<string, unknown>) {
  const rules = config.keywordRules || config.rules || config.manualRules;
  return Array.isArray(rules) ? rules : undefined;
}

function getConfiguredAggregationRules(config: Record<string, unknown>) {
  const rules = config.aggregationRules || config.aggregation_rules;
  return Array.isArray(rules) ? rules : undefined;
}

function getConfiguredRuleMetadata(
  block: WorkflowBlock,
  config: Record<string, unknown>
) {
  const keywordRules = getConfiguredRules(config);
  const aggregationRules = getConfiguredAggregationRules(config);
  return {
    ruleCount: keywordRules?.length || aggregationRules?.length || 0,
    ruleVersion: config.ruleVersion || `v${config.sourceVersion || 1}`,
    sourceId: block.id,
    sourceKind: config.sourceKind || block.subtype,
    sourceLocator: config.sourceLocator || block.source?.locator,
    sourceName: block.label,
    sourceStatus: config.sourceStatus || block.status,
    sourceSubtype: block.subtype,
    sourceVersion: config.sourceVersion || 1,
    updatedAt: block.updatedAt,
  };
}

function getConfiguredRuleVersion(config: Record<string, unknown>) {
  return {
    ruleVersion: config.ruleVersion || `v${config.sourceVersion || 1}`,
    sourceStatus: config.sourceStatus || "draft",
    sourceVersion: config.sourceVersion || 1,
  };
}

function getConfiguredRawRows(config: Record<string, unknown>) {
  const rows = config.rows || config.manualRows || config.tableRows;
  return Array.isArray(rows)
    ? rows.map((row) => asRecord(row).metadata || row)
    : undefined;
}

function getConfiguredScalar(config: Record<string, unknown>) {
  return config.value || config.manualValue || config.scalarValue;
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

function getConfiguredPreviewValue(block: WorkflowBlock, roleId?: string) {
  const config = block.config || {};
  if (isRowsPreviewRole(block, roleId)) {
    const rows = getConfiguredRows(config);
    if (Array.isArray(rows)) {
      return rows;
    }
  }
  const previewByRole: Record<string, () => unknown> = {
    aggregation_tree: () => getConfiguredAggregationRules(config),
    aggregation_rules: () => getConfiguredAggregationRules(config),
    calculation_rules: () =>
      Array.isArray(config.calculationRules)
        ? config.calculationRules
        : config.calculation_rules,
    keyword_rules: () => getConfiguredRules(config),
    raw_rows: () => getConfiguredRawRows(config),
    rollup_rules: () =>
      Array.isArray(config.rollupRules)
        ? config.rollupRules
        : config.rollup_rules,
    rule_metadata: () => getConfiguredRuleMetadata(block, config),
    rule_version: () => getConfiguredRuleVersion(config),
    selected_range: () => getConfiguredSelectedRange(config),
    selected_sheet: () => getConfiguredSelectedSheet(config),
    source_locator: () => config.sourceLocator || block.source?.locator,
    source_metadata: () => getConfiguredSourceMetadata(block, config),
    value: () => getConfiguredScalar(config),
    workbook_file: () => getConfiguredWorkbookFile(config),
  };
  const rolePreview = roleId ? previewByRole[roleId]?.() : undefined;
  return rolePreview ?? getConfiguredRules(config);
}

function getToolOutputRoleById(block: WorkflowBlock, roleId?: string) {
  if (!roleId) {
    return;
  }
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
    if (value !== undefined) {
      return value;
    }
  }

  if (roleId && output[roleId] !== undefined) {
    return output[roleId];
  }

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

function getToolRunStatus({
  blockId,
  lastRun,
}: {
  blockId: string;
  lastRun?: LocalRunRecord;
}) {
  const selectedLog = lastRun?.logs.find((log) => log.nodeId === blockId);
  const output = asRecord(selectedLog?.output);
  return String(output.status || selectedLog?.status || "not-run");
}

function getStatusFromRun({
  blockId,
  lastRun,
  hasValue,
  missing,
}: {
  blockId: string;
  lastRun?: LocalRunRecord;
  hasValue: boolean;
  missing?: boolean;
}) {
  if (missing) {
    return "missing" as const;
  }
  const status = getToolRunStatus({ blockId, lastRun });
  if (status === "error") {
    return "error" as const;
  }
  if (status === "warning" || status === "needs_review") {
    return "warning" as const;
  }
  return hasValue ? ("ready" as const) : ("warning" as const);
}

function getBlockLabel(nodes: WorkflowNode[], blockId: string) {
  return (
    nodes.find((node) => node.id === blockId)?.data.block?.label || blockId
  );
}

function getFlowKind({
  block,
  roleId,
  side,
}: {
  block: WorkflowBlock;
  roleId?: string;
  side: "inputs" | "outputs";
}) {
  if (roleId?.includes("rule")) {
    return "reference";
  }

  const labelsByFamily: Record<
    WorkflowBlock["family"],
    { inputs: string; outputs: string }
  > = {
    "AI / Agent": { inputs: "context data", outputs: "proposal" },
    Logic: { inputs: "data", outputs: "derived data" },
    Output: { inputs: "handoff data", outputs: "deliverable" },
    Protected: { inputs: "approved data", outputs: "governed data" },
    "Review / Validation": {
      inputs: "items to judge",
      outputs: "review info",
    },
    Source: { inputs: "setup", outputs: "immutable data" },
  };

  return labelsByFamily[block.family][side];
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

type DataFlowGroup = {
  id: string;
  acceptedTypes?: string[];
  bindingLabel?: string;
  connectedLabel?: string;
  consumers?: string[];
  contextData?: Record<string, unknown>;
  count?: number;
  description?: string;
  hasData: boolean;
  outputType?: string;
  preview: string;
  roleId: string;
  roleLabel: string;
  sourceOutputRole?: string;
  status: DataStatus;
  statusLabel: string;
  value?: unknown;
};

const DATA_FLOW_VIEWS: DataDisplayView[] = ["schema", "table", "json", "trace"];
type DataFlowPaneSide = "inputs" | "outputs" | "source";

type CalculationInputTerm = {
  key: string;
  label?: string;
  source: "created" | "data";
  value?: number | null;
};

const CALCULATION_TERM_GROUP_KEYS = [
  "namedValues",
  "named_values",
  "categoryTotals",
  "category_totals",
  "rollupTotals",
  "rollup_totals",
  "fapiInputs",
  "fapi_inputs",
  "calculatedResults",
  "calculated_results",
];

function getInlineCalculationFormulas(config: Record<string, unknown>) {
  const raw =
    config.formulas ?? config.calculationRules ?? config.inlineFormulas;
  return Array.isArray(raw) ? raw.map(asRecord) : [];
}

function isCalculationEngineBlock(block: WorkflowBlock) {
  return (
    block.config.toolId === "logic.calculation_engine" ||
    block.subtype === "Calculation Engine"
  );
}

function addCalculationDataTerm({
  key,
  seen,
  terms,
  value,
}: {
  key: string;
  seen: Set<string>;
  terms: CalculationInputTerm[];
  value: unknown;
}) {
  if (seen.has(key)) {
    return;
  }
  seen.add(key);
  terms.push({
    key,
    source: "data",
    value: typeof value === "number" && Number.isFinite(value) ? value : null,
  });
}

function collectTermsFromRecord({
  record,
  seen,
  terms,
}: {
  record: Record<string, unknown>;
  seen: Set<string>;
  terms: CalculationInputTerm[];
}) {
  for (const [key, value] of Object.entries(record)) {
    if (typeof value === "number" && Number.isFinite(value)) {
      addCalculationDataTerm({ key, seen, terms, value });
    }
  }
  for (const key of CALCULATION_TERM_GROUP_KEYS) {
    const group = asRecord(record[key]);
    for (const [termKey, value] of Object.entries(group)) {
      addCalculationDataTerm({ key: termKey, seen, terms, value });
    }
  }
}

function getCalculationInputTerms({
  block,
  groups,
}: {
  block: WorkflowBlock;
  groups: DataFlowGroup[];
}) {
  const dataSeen = new Set<string>();
  const dataTerms: CalculationInputTerm[] = [];
  for (const group of groups) {
    collectTermsFromRecord({
      record: asRecord(group.value),
      seen: dataSeen,
      terms: dataTerms,
    });
    collectTermsFromRecord({
      record: asRecord(group.contextData),
      seen: dataSeen,
      terms: dataTerms,
    });
  }

  const createdTerms = getInlineCalculationFormulas(block.config || {}).map(
    (formula) => ({
      key: String(formula.resultKey || formula.calculationId || "TERM"),
      label: String(formula.label || formula.description || ""),
      source: "created" as const,
    })
  );

  return { createdTerms, dataTerms };
}

function combineDataFlowValues(values: unknown[]) {
  if (values.length === 0) {
    return;
  }
  if (values.length === 1) {
    return values[0];
  }
  if (values.every(Array.isArray)) {
    return values.flat();
  }
  return values;
}

function getNamedProtectedInputValue({
  block,
  roleId,
  sourceOutputRole,
  value,
}: {
  block: WorkflowBlock;
  roleId: string;
  sourceOutputRole: string;
  value: unknown;
}) {
  if (
    block.family !== "Protected" ||
    !["approved_value", "candidate_value"].includes(roleId)
  ) {
    return value;
  }

  const resultName =
    typeof block.config.resultName === "string"
      ? block.config.resultName
      : undefined;
  const normalizedResultName = resultName
    ?.trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  const record = asRecord(value);
  if (
    resultName &&
    ["calculated_results", "final_totals", "official_line_values"].includes(
      sourceOutputRole
    ) &&
    record[resultName] !== undefined
  ) {
    return record[resultName];
  }
  if (
    normalizedResultName &&
    sourceOutputRole === "calculated_results" &&
    record[normalizedResultName] !== undefined
  ) {
    return record[normalizedResultName];
  }

  if (
    sourceOutputRole === "reviewed_exchange_rate" &&
    record.rate !== undefined
  ) {
    return record.rate;
  }

  if (
    sourceOutputRole === "exchange_rate" &&
    record.exchange_rate !== undefined
  ) {
    return record.exchange_rate;
  }

  return value;
}

function hasDataValue(value: unknown) {
  return value !== undefined && value !== null;
}

function getGroupStatusClasses(status: DataStatus) {
  if (status === "ready") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  }
  if (status === "warning") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300";
  }
  return "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300";
}

function getConsumerLabels({
  edges,
  nodes,
  roleId,
}: {
  edges: WorkflowEdge[];
  nodes: WorkflowNode[];
  roleId: string;
}) {
  const matchingEdges = edges.filter((edge) =>
    sourceOutputRoleMatches(roleId, edge.data?.workflowEdge?.sourceOutputRole)
  );
  return matchingEdges.map(
    (edge) =>
      `${getBlockLabel(nodes, edge.target)}.${edge.data?.workflowEdge?.targetInputRole || "input"}`
  );
}

function sourceOutputRoleMatches(roleId: string, sourceOutputRole?: string) {
  if (ROW_OUTPUT_ROLE_IDS.has(roleId)) {
    return (
      !sourceOutputRole ||
      sourceOutputRole === "output" ||
      ROW_OUTPUT_ROLE_IDS.has(sourceOutputRole)
    );
  }

  return sourceOutputRole === roleId;
}

function getStringConfig(
  config: Record<string, unknown>,
  keys: string[],
  fallback: string
) {
  for (const key of keys) {
    const value = config[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return fallback;
}

function getArrayConfig(config: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = config[key];
    if (Array.isArray(value)) {
      return value;
    }
  }
}

function getSourceArtifactKind(block: WorkflowBlock) {
  const sourceKind = String(block.config.sourceKind || "").toLowerCase();
  if (
    block.subtype === "Excel / Workbook" ||
    sourceKind.includes("excel") ||
    sourceKind.includes("workbook") ||
    sourceKind.includes("manual_table")
  ) {
    return "workbook";
  }
  if (
    block.subtype === "PDF / Document" ||
    sourceKind.includes("pdf") ||
    sourceKind.includes("document")
  ) {
    return "document";
  }
  if (
    block.subtype === "Keyword Rules" ||
    block.subtype === "Aggregation Rules" ||
    block.subtype === "Rollup Rules" ||
    block.subtype === "Calculation Rules" ||
    sourceKind.includes("keyword_rules") ||
    sourceKind.includes("aggregation_rules") ||
    sourceKind.includes("rollup_rules") ||
    sourceKind.includes("calculation_rules") ||
    sourceKind.includes("rule_knowledge")
  ) {
    return "rules";
  }
  if (sourceKind.includes("currency_rate")) {
    return "fx_rate";
  }
  if (sourceKind.includes("fapi_inputs")) {
    return "calculation_inputs";
  }
  return "source";
}

function getSourcePaneTitle(block: WorkflowBlock) {
  const artifactKind = getSourceArtifactKind(block);
  if (artifactKind === "workbook") {
    return "Workbook";
  }
  if (artifactKind === "document") {
    return "Document";
  }
  if (artifactKind === "rules") {
    return "Rulebook";
  }
  if (artifactKind === "fx_rate") {
    return "FX Rate Source";
  }
  if (artifactKind === "calculation_inputs") {
    return "Calculation Inputs";
  }
  return "Source Artifact";
}

function getSourcePaneDescription(block: WorkflowBlock) {
  const artifactKind = getSourceArtifactKind(block);
  if (artifactKind === "workbook") {
    return "Original workbook evidence";
  }
  if (artifactKind === "document") {
    return "Original document evidence";
  }
  if (artifactKind === "rules") {
    return "Editable governance rules";
  }
  if (artifactKind === "fx_rate") {
    return "External rate evidence";
  }
  if (artifactKind === "calculation_inputs") {
    return "Workbook calculation assumptions";
  }
  return "Original source evidence";
}

function getSourceArtifactValue(block: WorkflowBlock, artifactKind: string) {
  if (artifactKind === "rules") {
    const sourceKind = String(block.config.sourceKind || "").toLowerCase();
    if (sourceKind.includes("aggregation_rules")) {
      return getConfiguredPreviewValue(block, "aggregation_rules");
    }
    if (sourceKind.includes("rollup_rules")) {
      return getConfiguredPreviewValue(block, "rollup_rules");
    }
    if (sourceKind.includes("calculation_rules")) {
      return getConfiguredPreviewValue(block, "calculation_rules");
    }
    return getConfiguredPreviewValue(block, "keyword_rules");
  }
  if (artifactKind === "workbook") {
    return getConfiguredPreviewValue(block, "rows");
  }
  if (artifactKind === "fx_rate") {
    return {
      documentCurrency: block.config.documentCurrency,
      overrideRate: block.config.overrideRate,
      provider: block.config.rateProvider || "bank_of_canada",
      rateType: block.config.rateType || "annual_average",
      reportingCurrency: block.config.reportingCurrency,
      year: block.config.fapiYear,
    };
  }
  if (artifactKind === "calculation_inputs") {
    return {
      expectedResults: block.config.expectedResults,
      fatPaid: block.config.fatPaid,
      fapiYear: block.config.fapiYear,
      inclusionRate: block.config.inclusionRate,
      rtf: block.config.rtf,
    };
  }
  return asRecord(block.config || {});
}

function getSourceArtifactOutputType(
  block: WorkflowBlock,
  artifactKind: string
) {
  if (artifactKind === "rules") {
    const sourceKind = String(block.config.sourceKind || "").toLowerCase();
    if (sourceKind.includes("rollup_rules")) {
      return "rollup_rules";
    }
    if (sourceKind.includes("calculation_rules")) {
      return "calculation_rules";
    }
    if (sourceKind.includes("aggregation_rules")) {
      return "aggregation_rules";
    }
    return "keyword_rules";
  }
  if (artifactKind === "workbook") {
    return "table_rows";
  }
  if (artifactKind === "document") {
    return "document_source";
  }
  if (artifactKind === "fx_rate") {
    return "exchange_rate";
  }
  if (artifactKind === "calculation_inputs") {
    return "fapi_inputs";
  }
  return "source_artifact";
}

function getSourceArtifactRoleId(block: WorkflowBlock, artifactKind: string) {
  if (artifactKind === "rules") {
    const sourceKind = String(block.config.sourceKind || "").toLowerCase();
    if (sourceKind.includes("rollup_rules")) {
      return "rollup_rules_source";
    }
    if (sourceKind.includes("calculation_rules")) {
      return "calculation_rules_source";
    }
    if (sourceKind.includes("aggregation_rules")) {
      return "aggregation_rules_source";
    }
    return "keyword_rules_source";
  }
  if (artifactKind === "workbook") {
    return "workbook_artifact";
  }
  if (artifactKind === "fx_rate") {
    return "exchange_rate_source";
  }
  if (artifactKind === "calculation_inputs") {
    return "fapi_inputs_source";
  }
  return "source_artifact";
}

function getWorkbookArtifactContext({
  block,
  config,
  locator,
  selectedRange,
  selectedSheet,
}: {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  locator: string;
  selectedRange: string;
  selectedSheet: string;
}) {
  const sheets = getArrayConfig(config, ["sheets", "availableSheets"]) || [
    "Trial Balance",
    "Notes",
    "FX Rates",
  ];
  return {
    sourceKind: config.sourceKind || "excel_template_mock",
    sourceLocator: locator,
    sourceTrace: [`${block.label}.${selectedRange}`],
    workbookName: getStringConfig(
      config,
      ["workbookName", "fileName", "sourceFileName"],
      `${block.label}.xlsx`
    ),
    selectedRange,
    selectedSheet,
    sheets,
  };
}

function getDocumentArtifactContext({
  block,
  config,
  locator,
}: {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  locator: string;
}) {
  const selectedPages =
    getArrayConfig(config, ["selectedPages", "pages"]) ||
    getStringConfig(config, ["selectedPage", "page"], "Page 1");
  return {
    documentName: getStringConfig(
      config,
      ["documentName", "fileName", "sourceFileName"],
      `${block.label}.pdf`
    ),
    documentLocator: locator,
    selectedPages,
    sourceKind: config.sourceKind || "pdf_document",
    sourceTrace: [`${block.label}.${locator}`],
  };
}

function getRuleArtifactContext({
  block,
  config,
  locator,
}: {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  locator: string;
}) {
  return {
    ruleVersion: getStringConfig(
      config,
      ["ruleVersion", "sourceVersion", "version"],
      "v1"
    ),
    sourceKind: config.sourceKind || "Rule / Knowledge Source",
    sourceLocator: locator,
    sourceTrace: [`${block.label}.${config.sourceKind || "rules"}`],
    sourceStatus: config.sourceStatus || block.status,
  };
}

function getFxRateArtifactContext({
  block,
  config,
  locator,
}: {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  locator: string;
}) {
  return {
    rateProvider: config.rateProvider || "bank_of_canada",
    rateType: config.rateType || "annual_average",
    sourceKind: "currency_rate",
    sourceLocator: locator,
    sourceTrace: [`${block.label}.exchange_rate`],
    sourceVersion: config.sourceVersion || 1,
  };
}

function getCalculationInputsArtifactContext({
  block,
  config,
  locator,
}: {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  locator: string;
}) {
  return {
    sourceKind: "fapi_inputs",
    sourceLocator: locator,
    sourceTrace: [`${block.label}.fapi_inputs`],
    sourceVersion: config.sourceVersion || 1,
  };
}

function getSourceArtifactContext({
  block,
  value,
}: {
  block: WorkflowBlock;
  value: unknown;
}) {
  const config = block.config || {};
  const artifactKind = getSourceArtifactKind(block);
  const itemCount = Array.isArray(value) ? value.length : undefined;
  const selectedSheet = getStringConfig(
    config,
    ["selectedSheet", "sheet", "worksheet"],
    "Trial Balance"
  );
  const selectedRange = getStringConfig(
    config,
    ["selectedRange", "range", "namedRange"],
    itemCount ? `${selectedSheet}!A1:F${itemCount + 1}` : `${selectedSheet}!A:F`
  );
  const locator = getStringConfig(
    config,
    ["sourceLocator", "locator", "documentLocator"],
    block.source?.locator || `${block.label}.${selectedRange}`
  );

  const contextByArtifactKind: Record<string, Record<string, unknown>> = {
    calculation_inputs: getCalculationInputsArtifactContext({
      block,
      config,
      locator,
    }),
    document: getDocumentArtifactContext({ block, config, locator }),
    fx_rate: getFxRateArtifactContext({ block, config, locator }),
    rules: getRuleArtifactContext({ block, config, locator }),
    workbook: getWorkbookArtifactContext({
      block,
      config,
      locator,
      selectedRange,
      selectedSheet,
    }),
  };

  const artifactContext = contextByArtifactKind[artifactKind];
  if (artifactContext) {
    return artifactContext;
  }

  return {
    sourceKind: config.sourceKind || block.subtype,
    sourceLocator: locator,
    sourceTrace: [`${block.label}.${locator}`],
  };
}

function createSourceArtifactGroups({
  block,
  lastRun,
}: {
  block: WorkflowBlock;
  lastRun?: LocalRunRecord;
}): DataFlowGroup[] {
  const artifactKind = getSourceArtifactKind(block);
  const value = getSourceArtifactValue(block, artifactKind);
  const outputType = getSourceArtifactOutputType(block, artifactKind);
  const contextData = getSourceArtifactContext({ block, value });
  const summary = getDataPreviewSummary({
    contextData,
    outputType,
    value,
  });
  const hasData = hasDataValue(value);

  return [
    {
      contextData,
      count: summary.count,
      description:
        artifactKind === "rules"
          ? "Editable rulebook. Logic tools consume these governed rules downstream."
          : "Original immutable Source artifact. Selections expose evidence slices downstream.",
      hasData,
      id: `source-artifact-${block.id}`,
      outputType,
      preview: hasData ? summary.preview : "No source artifact preview",
      roleId: getSourceArtifactRoleId(block, artifactKind),
      roleLabel: getSourcePaneTitle(block),
      status: getStatusFromRun({
        blockId: block.id,
        hasValue: hasData,
        lastRun,
      }),
      statusLabel: artifactKind === "rules" ? "rulebook" : "source evidence",
      value,
    },
  ];
}

function getCombinedContextData(contextValues: Record<string, unknown>[]) {
  if (contextValues.length === 1) {
    return contextValues[0];
  }
  if (contextValues.length > 1) {
    return { inputs: contextValues };
  }
}

function createInputGroups({
  block,
  incomingEdges,
  lastRun,
  nodes,
  onCreateSourceForInput,
  tool,
}: {
  block: WorkflowBlock;
  incomingEdges: WorkflowEdge[];
  lastRun?: LocalRunRecord;
  nodes: WorkflowNode[];
  onCreateSourceForInput?: (inputRoleId: string) => void;
  tool: ToolDefinition;
}): DataFlowGroup[] {
  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Input binding summary has to reconcile roles, edges, source values, missing state, and preview metadata in one pass.
  return tool.inputRoles.map((role) => {
    const boundEdges = incomingEdges.filter(
      (edge) => edge.data?.workflowEdge?.targetInputRole === role.id
    );
    const acceptedTypes = [
      ...role.acceptedFamilies,
      ...(role.acceptedSourceKinds || []),
      ...(role.acceptedOutputTypes || []),
    ];
    const values: unknown[] = [];
    const contextValues: Record<string, unknown>[] = [];
    const connectedLabels: string[] = [];
    const sourceOutputRoles: string[] = [];
    const bindingLabels: string[] = [];
    let status: DataStatus = role.required ? "missing" : "warning";

    for (const edge of boundEdges) {
      const sourceBlock = nodes.find((node) => node.id === edge.source)?.data
        .block;
      const sourceOutputRole =
        edge.data?.workflowEdge?.sourceOutputRole || "output";
      const rawValue = sourceBlock
        ? getLatestOutputValueForRole({
            block: sourceBlock,
            lastRun,
            roleId: sourceOutputRole,
          })
        : undefined;
      const value = getNamedProtectedInputValue({
        block,
        roleId: role.id,
        sourceOutputRole,
        value: rawValue,
      });
      const contextData = sourceBlock
        ? getLatestToolOutput({ blockId: sourceBlock.id, lastRun })
        : undefined;

      if (hasDataValue(value)) {
        values.push(value);
      }
      if (contextData) {
        contextValues.push(contextData);
      }
      connectedLabels.push(
        `${getBlockLabel(nodes, edge.source)}.${sourceOutputRole}`
      );
      sourceOutputRoles.push(sourceOutputRole);
      if (edge.data?.workflowEdge?.bindingLabel) {
        bindingLabels.push(edge.data.workflowEdge.bindingLabel);
      }
      status = getStatusFromRun({
        blockId: sourceBlock?.id || edge.source,
        hasValue: hasDataValue(value),
        lastRun,
      });
    }

    const value = combineDataFlowValues(values);
    const contextData = getCombinedContextData(contextValues);
    const outputType =
      boundEdges.length === 1
        ? getOutputTypeForRole({
            block: nodes.find((node) => node.id === boundEdges[0].source)?.data
              .block as WorkflowBlock,
            roleId: sourceOutputRoles[0],
          })
        : role.acceptedOutputTypes?.[0] || role.id;
    const summary = getDataPreviewSummary({
      contextData,
      outputType,
      value,
    });
    const missing = role.required && boundEdges.length === 0;

    return {
      acceptedTypes,
      bindingLabel: bindingLabels.join(", "),
      connectedLabel:
        connectedLabels.length > 0 ? connectedLabels.join(", ") : undefined,
      contextData,
      count: summary.count,
      description: missing
        ? `Missing required input. Suggested: ${acceptedTypes.join(", ")}`
        : role.description,
      hasData: hasDataValue(value),
      id: `input-${role.id}`,
      outputType,
      preview: missing ? "Missing required input" : summary.preview,
      roleId: role.id,
      roleLabel: role.label,
      sourceOutputRole: sourceOutputRoles.join(", "),
      status: missing ? "missing" : status,
      statusLabel: missing
        ? "missing"
        : getFlowKind({ block, roleId: role.id, side: "inputs" }),
      value,
      ...(missing && onCreateSourceForInput
        ? { createSourceInputRole: role.id }
        : {}),
    } as DataFlowGroup & { createSourceInputRole?: string };
  });
}

function createOutputGroup({
  block,
  lastRun,
  latestOutput,
  nodes,
  outgoingEdges,
  role,
}: {
  block: WorkflowBlock;
  lastRun?: LocalRunRecord;
  latestOutput: Record<string, unknown>;
  nodes: WorkflowNode[];
  outgoingEdges: WorkflowEdge[];
  role: ToolOutputRole;
}) {
  const value = getRoleOutputValue(role, latestOutput);
  const sourceFallback =
    block.family === "Source"
      ? getConfiguredPreviewValue(block, role.id)
      : undefined;
  const displayValue = hasDataValue(value) ? value : sourceFallback;
  const hasLatestValue = hasDataValue(value);
  const hasDisplayValue = hasDataValue(displayValue);
  const sourceOutputReady = block.family === "Source" && hasDisplayValue;
  const sourceRowsOutput =
    block.family === "Source" && ROW_OUTPUT_ROLE_IDS.has(role.id);
  const outputType = sourceRowsOutput ? "table_rows" : role.outputType;
  const summary = getDataPreviewSummary({
    contextData: latestOutput,
    outputType,
    value: displayValue,
  });
  let statusLabel = "not executed";
  if (sourceOutputReady) {
    statusLabel = getSourceOutputStatusLabel(role.id);
  } else if (hasLatestValue) {
    statusLabel = getFlowKind({ block, roleId: role.id, side: "outputs" });
  }

  return {
    consumers: getConsumerLabels({
      edges: outgoingEdges,
      nodes,
      roleId: role.id,
    }),
    contextData: latestOutput,
    count: summary.count,
    description: role.description,
    hasData: hasDisplayValue,
    id: `output-${role.id}`,
    outputType,
    preview: hasDisplayValue ? summary.preview : "No output data",
    roleId: role.id,
    roleLabel: role.label,
    status: getStatusFromRun({
      blockId: block.id,
      hasValue: hasLatestValue || sourceOutputReady,
      lastRun,
    }),
    statusLabel,
    value: displayValue,
  };
}

function getSourceOutputStatusLabel(roleId: string) {
  if (ROW_OUTPUT_ROLE_IDS.has(roleId)) {
    return "selected evidence";
  }
  if (roleId === "raw_rows") {
    return "raw evidence";
  }
  if (roleId === "source_metadata") {
    return "metadata";
  }
  if (roleId === "source_locator") {
    return "locator";
  }
  if (WORKBOOK_OUTPUT_ROLE_IDS.has(roleId)) {
    return "workbook";
  }
  return "source evidence";
}

function getDisplayOutputRoles({
  block,
  tool,
}: {
  block: WorkflowBlock;
  tool: ToolDefinition;
}) {
  if (block.family !== "Source") {
    return tool.outputRoles;
  }

  const selectedRowsRole = tool.outputRoles.find(
    (role) => role.id === "selected_rows"
  );
  if (!selectedRowsRole) {
    return tool.outputRoles;
  }

  let insertedRowsRole = false;
  return tool.outputRoles.flatMap((role) => {
    if (!ROW_OUTPUT_ROLE_IDS.has(role.id)) {
      return [role];
    }
    if (insertedRowsRole) {
      return [];
    }
    insertedRowsRole = true;
    return [selectedRowsRole];
  });
}

function createOutputGroups({
  block,
  lastRun,
  latestOutput,
  nodes,
  outgoingEdges,
  tool,
}: {
  block: WorkflowBlock;
  lastRun?: LocalRunRecord;
  latestOutput: Record<string, unknown>;
  nodes: WorkflowNode[];
  outgoingEdges: WorkflowEdge[];
  tool: ToolDefinition;
}): DataFlowGroup[] {
  return getDisplayOutputRoles({ block, tool }).map((role) =>
    createOutputGroup({
      block,
      lastRun,
      latestOutput,
      nodes,
      outgoingEdges,
      role,
    })
  );
}

function OutputRoleCard({
  group,
  initiallyExpanded,
  onCreateSourceForInput,
  onExecuteStep,
  onOpenLarge,
  side,
}: {
  group: DataFlowGroup & { createSourceInputRole?: string };
  initiallyExpanded?: boolean;
  onCreateSourceForInput?: (inputRoleId: string) => void;
  onExecuteStep?: () => void;
  onOpenLarge: () => void;
  side: DataFlowPaneSide;
}) {
  const [expanded, setExpanded] = useState(initiallyExpanded ?? false);
  const [view, setView] = useState<DataDisplayView>("table");

  return (
    <div className="rounded-md border bg-background/70 text-xs">
      <button
        className="w-full px-2.5 py-2.5 text-left"
        onClick={() => setExpanded((prev) => !prev)}
        type="button"
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-3.5 shrink-0 text-muted-foreground" />
          )}
          <span className="flex-1 truncate font-medium text-sm">
            {group.roleLabel}
          </span>
          {group.count !== undefined && (
            <span className="shrink-0 tabular-nums text-[10px] text-muted-foreground">
              {group.count}
            </span>
          )}
          <span
            className={`shrink-0 rounded-full border px-1.5 py-0.5 font-medium text-[10px] uppercase ${getGroupStatusClasses(group.status)}`}
          >
            {group.statusLabel}
          </span>
        </div>
        {!expanded && (
          <p className="ml-[22px] mt-0.5 truncate text-muted-foreground">
            {group.preview}
          </p>
        )}
      </button>

      {expanded && (
        <div className="space-y-2 border-t p-2.5">
          <div className="grid gap-0.5 text-[10px] text-muted-foreground">
            {group.connectedLabel && <div>From: {group.connectedLabel}</div>}
            {group.bindingLabel && <div>Binding: {group.bindingLabel}</div>}
            <div>Type: {group.outputType || "local_data"}</div>
            {group.consumers && group.consumers.length > 0 && (
              <div>To: {group.consumers.join(", ")}</div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-0.5">
            {DATA_FLOW_VIEWS.map((item) => (
              <Button
                className="h-6 px-2 text-[10px]"
                key={item}
                onClick={() => setView(item)}
                size="sm"
                type="button"
                variant={view === item ? "secondary" : "ghost"}
              >
                {DATA_VIEW_LABELS[item]}
              </Button>
            ))}
            <Button
              className="ml-auto h-6 px-2 text-[10px]"
              onClick={onOpenLarge}
              size="sm"
              type="button"
              variant="ghost"
            >
              <Maximize2 className="mr-1 size-3" />
              Full
            </Button>
          </div>
          {group.hasData ? (
            <DataDisplayViewer
              className="min-h-[220px]"
              contextData={group.contextData}
              outputType={group.outputType}
              value={group.value}
              view={view}
            />
          ) : (
            <div className="space-y-2 rounded-md border bg-muted/30 p-2.5">
              <p className="text-muted-foreground">
                {side === "outputs"
                  ? "Execute this step to inspect emitted data."
                  : group.description ||
                    "Connect a compatible upstream block to this input role."}
              </p>
              {side === "outputs" && (
                <Button
                  disabled={!onExecuteStep}
                  onClick={onExecuteStep}
                  size="sm"
                  type="button"
                  variant="secondary"
                >
                  Execute step
                </Button>
              )}
              {side !== "outputs" &&
                group.createSourceInputRole &&
                onCreateSourceForInput && (
                  <Button
                    onClick={() =>
                      onCreateSourceForInput(group.createSourceInputRole!)
                    }
                    size="sm"
                    type="button"
                    variant="secondary"
                  >
                    Create Source
                  </Button>
                )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DataFlowLargeViewer({
  group,
  onOpenChange,
  open,
  side,
}: {
  group?: DataFlowGroup;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  side: DataFlowPaneSide;
}) {
  const [view, setView] = useState<DataDisplayView>("table");
  const copyJson = async () => {
    await navigator.clipboard.writeText(JSON.stringify(group?.value, null, 2));
    toast.success("Copied data JSON");
  };
  let roleDescriptor = "Output role";
  if (side === "source") {
    roleDescriptor = "Source artifact";
  } else if (side === "inputs") {
    roleDescriptor = "Input role";
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="max-h-[88vh] max-w-[min(1200px,calc(100vw-2rem))] overflow-hidden p-0">
        <DialogHeader className="border-b px-5 py-4">
          <DialogTitle>{group?.roleLabel || "Data viewer"}</DialogTitle>
          <DialogDescription>
            {roleDescriptor} {group?.roleId || "selected"} ·{" "}
            {group?.outputType || "local_data"}
            {group?.count !== undefined ? ` · ${group.count} item(s)` : ""}
          </DialogDescription>
        </DialogHeader>
        {group && (
          <div className="flex min-h-0 flex-col gap-3 overflow-hidden p-5">
            <div className="grid gap-1 text-muted-foreground text-xs">
              {group.connectedLabel && <div>From: {group.connectedLabel}</div>}
              {group.bindingLabel && <div>Binding: {group.bindingLabel}</div>}
              {group.consumers && group.consumers.length > 0 && (
                <div>Consumers: {group.consumers.join(", ")}</div>
              )}
              <div>Preview: {group.preview}</div>
            </div>
            <div className="flex flex-wrap items-center gap-1">
              {DATA_FLOW_VIEWS.map((item) => (
                <Button
                  className="h-8 px-3 text-xs"
                  key={item}
                  onClick={() => setView(item)}
                  size="sm"
                  type="button"
                  variant={view === item ? "secondary" : "ghost"}
                >
                  {DATA_VIEW_LABELS[item]}
                </Button>
              ))}
              <Button
                className="ml-auto h-8 px-3 text-xs"
                onClick={copyJson}
                size="sm"
                type="button"
                variant="outline"
              >
                <Copy className="mr-1 size-3" />
                Copy JSON
              </Button>
            </div>
            <DataDisplayViewer
              className="min-h-0"
              contextData={group.contextData}
              expanded
              outputType={group.outputType}
              value={group.value}
              view={view}
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function DataFlowPaneHeader({
  description: providedDescription,
  side,
  title,
}: {
  description?: string;
  side: DataFlowPaneSide;
  title: string;
}) {
  let description = "What this block emits";
  if (side === "source") {
    description = "Original artifact evidence";
  } else if (side === "inputs") {
    description = "What enters this block";
  }

  return (
    <div className="flex items-start justify-between gap-2">
      <div>
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-muted-foreground text-xs">
          {providedDescription || description}
        </div>
      </div>
    </div>
  );
}

type GroupedDataTerm = {
  category: string;
  terms: CalculationInputTerm[];
};

function getGroupedCalculationInputTerms({
  block,
  groups,
}: {
  block: WorkflowBlock;
  groups: DataFlowGroup[];
}): { createdTerms: CalculationInputTerm[]; groupedDataTerms: GroupedDataTerm[] } {
  const globalSeen = new Set<string>();
  const groupedDataTerms: GroupedDataTerm[] = [];

  for (const group of groups) {
    const terms: CalculationInputTerm[] = [];

    const addTerm = (key: string, val: unknown) => {
      if (globalSeen.has(key)) return;
      globalSeen.add(key);
      terms.push({
        key,
        source: "data",
        value:
          typeof val === "number" && Number.isFinite(val) ? val : null,
      });
    };

    const valueRecord = asRecord(group.value);
    for (const [k, v] of Object.entries(valueRecord)) {
      if (typeof v === "number") addTerm(k, v);
    }
    for (const groupKey of CALCULATION_TERM_GROUP_KEYS) {
      for (const [k, v] of Object.entries(asRecord(valueRecord[groupKey]))) {
        addTerm(k, v);
      }
    }

    const contextRecord = asRecord(group.contextData);
    for (const [k, v] of Object.entries(contextRecord)) {
      if (typeof v === "number") addTerm(k, v);
    }
    for (const groupKey of CALCULATION_TERM_GROUP_KEYS) {
      for (const [k, v] of Object.entries(asRecord(contextRecord[groupKey]))) {
        addTerm(k, v);
      }
    }

    groupedDataTerms.push({
      category: group.roleLabel || group.connectedLabel || "Data",
      terms,
    });
  }

  const createdTerms = getInlineCalculationFormulas(block.config || {}).map(
    (formula) => ({
      key: String(formula.resultKey || formula.calculationId || "TERM"),
      label: String(formula.label || formula.description || ""),
      source: "created" as const,
    })
  );

  return { createdTerms, groupedDataTerms };
}

// Renders incoming data grouped by category using the same card design as DataFlowGroupRow.
function CalculationIncomingDataSection({
  disabled,
  groupedDataTerms,
  onInsertTerm,
}: {
  disabled?: boolean;
  groupedDataTerms: GroupedDataTerm[];
  onInsertTerm?: (termKey: string) => void;
}) {
  const [expandedIds, setExpandedIds] = useState<string[]>([]);

  const toggleExpanded = (category: string) => {
    setExpandedIds((prev) =>
      prev.includes(category)
        ? prev.filter((id) => id !== category)
        : [...prev, category]
    );
  };

  if (groupedDataTerms.length === 0) {
    return (
      <div className="rounded-md border bg-background/70 p-3 text-muted-foreground text-xs">
        Connect upstream blocks to see incoming data categories and values.
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {groupedDataTerms.map((group) => {
        const isExpanded = expandedIds.includes(group.category);
        const hasTerms = group.terms.length > 0;

        return (
          <div
            className="rounded-md border bg-background/70 text-xs"
            key={group.category}
          >
            {/* Header — matches DataFlowGroupRow button style */}
            <button
              className="w-full px-2 py-2 text-left"
              onClick={() => toggleExpanded(group.category)}
              type="button"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate font-medium text-sm">
                    {group.category}
                  </div>
                  <div className="truncate text-muted-foreground">
                    {hasTerms ? `${group.terms.length} value${group.terms.length === 1 ? "" : "s"}` : "no data yet"}
                  </div>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-1.5 py-0.5 font-medium text-[10px] uppercase ${
                    hasTerms
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300"
                  }`}
                >
                  {hasTerms ? "data" : "pending"}
                </span>
              </div>
            </button>

            {/* Expand/collapse footer — matches DataFlowGroupRow footer */}
            <div className="flex items-center gap-1 border-t px-2 py-1">
              <button
                className="flex h-7 items-center gap-1 rounded px-2 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                onClick={() => toggleExpanded(group.category)}
                type="button"
              >
                {isExpanded ? (
                  <>
                    <ChevronDown className="size-3" />
                    Collapse
                  </>
                ) : (
                  <>
                    <ChevronRight className="size-3" />
                    Expand
                  </>
                )}
              </button>
            </div>

            {/* Inline values — shown when expanded */}
            {isExpanded && (
              <div className="border-t p-2">
                {!hasTerms ? (
                  <p className="px-1 py-1 text-[10px] text-muted-foreground italic">
                    No latest data yet. Run upstream blocks to populate values.
                  </p>
                ) : (
                  <div className="space-y-px">
                    {group.terms.map((term) => (
                      <button
                        className="flex w-full items-center gap-2 rounded px-1.5 py-1 text-left transition-colors hover:bg-sky-500/10 disabled:opacity-40"
                        disabled={disabled || !onInsertTerm}
                        key={term.key}
                        onClick={() => onInsertTerm?.(term.key)}
                        title={
                          term.value !== null
                            ? `${term.key} = ${term.value}`
                            : term.key
                        }
                        type="button"
                      >
                        <span className="flex-1 truncate font-mono font-semibold text-[11px] text-sky-700 dark:text-sky-400">
                          {term.key}
                        </span>
                        <span className="shrink-0 tabular-nums text-[10px] text-muted-foreground">
                          {term.value != null
                            ? term.value.toLocaleString()
                            : "–"}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CalculationTermsInputPanel({
  createdTerms,
  dataTerms,
  disabled,
  onCreateTerm,
  onInsertTerm,
  onSelectTerm,
  selectedTermId,
}: {
  createdTerms: CalculationInputTerm[];
  dataTerms: CalculationInputTerm[];
  disabled?: boolean;
  onCreateTerm?: () => void;
  onInsertTerm?: (termKey: string) => void;
  onSelectTerm?: (termKey: string) => void;
  selectedTermId?: string | null;
}) {
  return (
    <div className="space-y-2 rounded-md border bg-background/70 p-2">
      <div className="flex items-center justify-between gap-2">
        <div>
          <div className="font-medium text-xs">Formula term helper</div>
          <div className="text-[10px] text-muted-foreground">
            Click terms to edit or insert into the selected formula
          </div>
        </div>
        {onCreateTerm && (
          <Button
            className="h-7 px-2 text-[11px]"
            disabled={disabled}
            onClick={onCreateTerm}
            size="sm"
            type="button"
            variant="ghost"
          >
            <Plus className="mr-1 size-3" />
            New
          </Button>
        )}
      </div>

      <div className="space-y-1">
        <div className="font-semibold text-[9px] text-emerald-700 uppercase tracking-widest">
          Created
        </div>
        {createdTerms.length === 0 ? (
          <div className="rounded border border-dashed p-2 text-[10px] text-muted-foreground">
            No created terms yet.
          </div>
        ) : (
          <div className="space-y-1">
            {createdTerms.map((term) => (
              <div
                className={`flex items-center gap-1 rounded border px-2 py-1 ${
                  selectedTermId === term.key
                    ? "border-primary bg-primary/10"
                    : "bg-background/70"
                }`}
                key={term.key}
              >
                <button
                  className="min-w-0 flex-1 text-left"
                  onClick={() => onSelectTerm?.(term.key)}
                  type="button"
                >
                  <span className="block truncate font-mono font-semibold text-[11px]">
                    {term.key}
                  </span>
                  {term.label && (
                    <span className="block truncate text-[10px] text-muted-foreground">
                      {term.label}
                    </span>
                  )}
                </button>
                {onInsertTerm && (
                  <button
                    aria-label={`Insert ${term.key}`}
                    className="rounded p-1 text-muted-foreground hover:bg-emerald-500/10 hover:text-emerald-700 disabled:opacity-40"
                    disabled={disabled}
                    onClick={() => onInsertTerm(term.key)}
                    title={`Insert ${term.key}`}
                    type="button"
                  >
                    <Plus className="size-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {dataTerms.length > 0 && (
        <div className="space-y-1">
          <div className="font-semibold text-[9px] text-sky-700 uppercase tracking-widest">
            From data
          </div>
          <div className="max-h-44 space-y-1 overflow-auto">
            {dataTerms.map((term) => (
              <button
                className="block w-full rounded border bg-background/70 px-2 py-1 text-left hover:border-sky-500/50 hover:bg-sky-500/10 disabled:opacity-40"
                disabled={disabled || !onInsertTerm}
                key={term.key}
                onClick={() => onInsertTerm?.(term.key)}
                title={
                  term.value !== null && term.value !== undefined
                    ? `${term.key} = ${term.value}`
                    : term.key
                }
                type="button"
              >
                <span className="block truncate font-mono font-semibold text-[11px] text-sky-700 dark:text-sky-400">
                  {term.key}
                </span>
                {term.value !== null && term.value !== undefined && (
                  <span className="block truncate text-[10px] text-muted-foreground">
                    {term.value}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Data-flow panes reconcile source/rulebook/logic roles, filters, and selected previews in one place.
export function BlockDataFlowColumn({
  block,
  calculationInsertDisabled,
  calculationInsertRequest,
  calculationTermCreateRequest,
  calculationTermSelectRequest,
  edges,
  lastRun,
  nodes,
  onCreateSourceForInput,
  onExecuteStep,
  selectedCalculationTermId,
  side,
}: {
  block: WorkflowBlock;
  calculationInsertDisabled?: boolean;
  calculationInsertRequest?: (termKey: string) => void;
  calculationTermCreateRequest?: () => void;
  calculationTermSelectRequest?: (termKey: string) => void;
  edges: WorkflowEdge[];
  lastRun?: LocalRunRecord;
  nodes: WorkflowNode[];
  onCreateSourceForInput?: (inputRoleId: string) => void;
  onExecuteStep?: () => void;
  selectedCalculationTermId?: string | null;
  side: "inputs" | "outputs";
}) {
  const [search, setSearch] = useState("");
  const [largeGroupId, setLargeGroupId] = useState<string | null>(null);
  const tool = getToolForBlock(block);
  const latestOutput = getLatestToolOutput({ blockId: block.id, lastRun });
  const incomingEdges = useMemo(
    () => edges.filter((edge) => edge.target === block.id),
    [block.id, edges]
  );
  const outgoingEdges = useMemo(
    () => edges.filter((edge) => edge.source === block.id),
    [block.id, edges]
  );
  const isSourceArtifactPane = block.family === "Source" && side === "inputs";
  const isRulebookArtifactPane =
    isSourceArtifactPane && getSourceArtifactKind(block) === "rules";
  const displaySide: DataFlowPaneSide = isSourceArtifactPane ? "source" : side;
  let title = "Outputs";
  if (isSourceArtifactPane) {
    title = getSourcePaneTitle(block);
  } else if (side === "inputs") {
    title = "Inputs";
  }
  const groups = useMemo<DataFlowGroup[]>(() => {
    if (isSourceArtifactPane) {
      return createSourceArtifactGroups({ block, lastRun });
    }

    if (!tool) {
      const connectedEdges = side === "inputs" ? incomingEdges : outgoingEdges;
      return connectedEdges.map((edge) => ({
        connectedLabel:
          side === "inputs"
            ? getBlockLabel(nodes, edge.source)
            : getBlockLabel(nodes, edge.target),
        hasData: false,
        id: edge.id,
        preview:
          edge.data?.workflowEdge?.bindingLabel ||
          edge.data?.relationshipType ||
          "Connected relationship",
        roleId: edge.data?.workflowEdge?.targetInputRole || "relationship",
        roleLabel:
          side === "inputs"
            ? getBlockLabel(nodes, edge.source)
            : getBlockLabel(nodes, edge.target),
        status: "warning" as DataStatus,
        statusLabel: "relationship",
      }));
    }

    return side === "inputs"
      ? createInputGroups({
          block,
          incomingEdges,
          lastRun,
          nodes,
          onCreateSourceForInput,
          tool,
        })
      : createOutputGroups({
          block,
          lastRun,
          latestOutput,
          nodes,
          outgoingEdges,
          tool,
        });
  }, [
    block,
    incomingEdges,
    isSourceArtifactPane,
    lastRun,
    latestOutput,
    nodes,
    onCreateSourceForInput,
    outgoingEdges,
    side,
    tool,
  ]);
  const filteredGroups = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return groups;
    }
    return groups.filter((group) =>
      [
        group.roleLabel,
        group.roleId,
        group.connectedLabel,
        group.outputType,
        group.preview,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [groups, search]);
  const groupedCalculationInputs =
    side === "inputs" && isCalculationEngineBlock(block)
      ? getGroupedCalculationInputTerms({ block, groups })
      : undefined;
  const calculationInputTerms = groupedCalculationInputs
    ? {
        createdTerms: groupedCalculationInputs.createdTerms,
        dataTerms: [] as CalculationInputTerm[],
      }
    : undefined;
  const isCalculationInputPane = Boolean(calculationInputTerms);
  const largeGroup = groups.find((group) => group.id === largeGroupId);
  const filterGroupKind = side === "inputs" ? "input" : "output";
  const emptyFilteredMessage = tool
    ? `No ${filterGroupKind} groups match this filter.`
    : "No typed tool roles are registered for this block yet.";

  return (
    <aside className="flex min-h-0 flex-col gap-3 overflow-hidden bg-card/50 p-4">
      <DataFlowPaneHeader
        description={
          isSourceArtifactPane ? getSourcePaneDescription(block) : undefined
        }
        side={displaySide}
        title={title}
      />
      {isSourceArtifactPane && (
        <div className="rounded-md border bg-background/70 p-2 text-muted-foreground text-xs">
          {isRulebookArtifactPane
            ? "Rulebooks are editable in draft and versioned after use or publish."
            : "Source evidence is view-only after use or publish. Corrections should be modeled downstream in Logic."}
        </div>
      )}
      <Input
        className="h-8 bg-background/70 text-xs"
        onChange={(event) => setSearch(event.target.value)}
        placeholder={`Search ${displaySide === "source" ? "source" : side}`}
        value={search}
      />
      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1">
        {isCalculationInputPane && groupedCalculationInputs ? (
          <>
            <div className="font-semibold text-[9px] text-muted-foreground uppercase tracking-widest">
              Incoming data
            </div>
            <CalculationIncomingDataSection
              disabled={calculationInsertDisabled}
              groupedDataTerms={groupedCalculationInputs.groupedDataTerms}
              onInsertTerm={calculationInsertRequest}
            />
          </>
        ) : (
          <div className="space-y-1.5">
            {filteredGroups.length === 0 ? (
              <div className="rounded-md border bg-background/70 p-3 text-muted-foreground text-xs">
                {emptyFilteredMessage}
              </div>
            ) : (
              filteredGroups.map((group, index) => (
                <OutputRoleCard
                  group={
                    group as DataFlowGroup & { createSourceInputRole?: string }
                  }
                  initiallyExpanded={index === 0}
                  key={group.id}
                  onCreateSourceForInput={onCreateSourceForInput}
                  onExecuteStep={onExecuteStep}
                  onOpenLarge={() => setLargeGroupId(group.id)}
                  side={displaySide}
                />
              ))
            )}
          </div>
        )}
        {calculationInputTerms && (
          <CalculationTermsInputPanel
            createdTerms={calculationInputTerms.createdTerms}
            dataTerms={calculationInputTerms.dataTerms}
            disabled={calculationInsertDisabled}
            onCreateTerm={calculationTermCreateRequest}
            onInsertTerm={calculationInsertRequest}
            onSelectTerm={calculationTermSelectRequest}
            selectedTermId={selectedCalculationTermId}
          />
        )}
      </div>
      <DataFlowLargeViewer
        group={largeGroup}
        onOpenChange={(open) => {
          if (!open) {
            setLargeGroupId(null);
          }
        }}
        open={Boolean(largeGroupId)}
        side={displaySide}
      />
    </aside>
  );
}
