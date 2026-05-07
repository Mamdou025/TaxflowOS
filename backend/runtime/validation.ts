import type { WorkflowBlock } from "../../lib/local-fiscal-workflow";
import { executeTool } from "./registry";

function fixtureBlock({
  id,
  label,
  sourceKind,
  toolId,
}: {
  id: string;
  label: string;
  toolId: string;
  sourceKind?: string;
}): WorkflowBlock {
  return {
    catalogId: undefined,
    config: sourceKind ? { sourceKind, toolId } : { toolId },
    createdAt: "2026-04-29T00:00:00.000Z",
    createdBy: "runtime-validation",
    description: label,
    family: toolId.startsWith("source.") ? "Source" : "Logic",
    id,
    label,
    position: { x: 0, y: 0 },
    runtime: {
      editableInRuntime: false,
      generatedUiLocked: true,
      masked: false,
      showInRuns: true,
      visible: true,
    },
    sample: true,
    status: "configured",
    subtype:
      toolId === "logic.keyword_mapper"
        ? "Classification / Mapping"
        : "Manual Entry",
    updatedAt: "2026-04-29T00:00:00.000Z",
    updatedBy: "runtime-validation",
  };
}

export function validateFirstMappingModules() {
  const startedAt = new Date().toISOString();
  const runId = `backend-smoke-${Date.now()}`;
  const tableBlock = fixtureBlock({
    id: "source-trial-balance",
    label: "Trial Balance Rows",
    sourceKind: "manual_table",
    toolId: "source.manual_table",
  });
  const rulesBlock = fixtureBlock({
    id: "source-keyword-rules",
    label: "Keyword Rules",
    sourceKind: "keyword_rules",
    toolId: "source.keyword_rules",
  });
  const mapperBlock = fixtureBlock({
    id: "logic-keyword-mapper",
    label: "Keyword Mapper",
    toolId: "logic.keyword_mapper",
  });

  const tableResult = executeTool("source.manual_table", {
    block: tableBlock,
    config: tableBlock.config,
    inputsByRole: {},
    runId,
    startedAt,
  });
  const rulesResult = executeTool("source.keyword_rules", {
    block: rulesBlock,
    config: rulesBlock.config,
    inputsByRole: {},
    runId,
    startedAt,
  });
  const mapperResult = executeTool("logic.keyword_mapper", {
    block: mapperBlock,
    config: {
      lowConfidenceThreshold: 0.75,
      toolId: "logic.keyword_mapper",
    },
    inputsByRole: {
      data_rows: [tableResult.outputs.rows],
      keyword_rules: [rulesResult.outputs.keyword_rules],
    },
    runId,
    startedAt,
    upstreamBlocks: [tableBlock, rulesBlock],
    upstreamResults: [tableResult, rulesResult],
  });

  const mappedRows = mapperResult.outputs.mapped_rows?.mappedRows;
  const lowConfidenceRows =
    mapperResult.outputs.low_confidence_rows?.lowConfidenceRows;

  return {
    keywordRuleCount:
      rulesResult.outputs.keyword_rules?.ruleCount ??
      (Array.isArray(rulesResult.outputs.keyword_rules?.keywordRules)
        ? rulesResult.outputs.keyword_rules.keywordRules.length
        : 0),
    lowConfidenceCount: Array.isArray(lowConfidenceRows)
      ? lowConfidenceRows.length
      : 0,
    mappedCount: Array.isArray(mappedRows) ? mappedRows.length : 0,
    sourceTraceCount: mapperResult.sourceTrace.length,
    status: mapperResult.status,
    tableRowCount:
      tableResult.outputs.rows?.rowCount ??
      (Array.isArray(tableResult.outputs.rows?.rows)
        ? tableResult.outputs.rows.rows.length
        : 0),
    success:
      mapperResult.sourceTrace.length > 0 &&
      Array.isArray(mappedRows) &&
      mappedRows.length === 5 &&
      Array.isArray(lowConfidenceRows) &&
      lowConfidenceRows.length === 1,
  };
}
