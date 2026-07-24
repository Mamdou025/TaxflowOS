import { info } from "../../../runtime/events";
import {
  createEvidenceRef,
  createSourceTraceRef,
} from "../../../runtime/lineage";
import type {
  ToolExecutionContext,
  ToolRunResult,
} from "../../../runtime/types";
import { SAMPLE_MANUAL_TABLE_ROWS } from "./fixtures";
import { parseManualTableRows } from "./schema";

export function runManualTableSource(
  context: ToolExecutionContext
): ToolRunResult {
  const rows = parseManualTableRows({
    config: context.config,
    fallbackRows: SAMPLE_MANUAL_TABLE_ROWS,
  });
  const sourceKind = String(context.config.sourceKind || "manual_table");
  const evidenceRefs = rows.map((row) =>
    createEvidenceRef({
      block: context.block,
      label: row.label,
      rowId: row.rowId,
      sourceKind,
      valuePreview: String(row.amount),
    })
  );
  const sourceTrace = evidenceRefs.map((evidenceRef) =>
    createSourceTraceRef({ evidenceRef })
  );
  const rowsWithTrace = rows.map((row) => ({
    ...row,
    evidenceRefs: evidenceRefs.filter(
      (evidenceRef) => evidenceRef.rowId === row.rowId
    ),
    immutable: true,
    readOnlyEvidence: true,
    sourceTrace: sourceTrace.filter((trace) => trace.rowId === row.rowId),
  }));
  const sourceLocator =
    typeof context.config.sourceLocator === "string"
      ? context.config.sourceLocator
      : `source://${context.block.id}`;
  const sourceMetadata = {
    columns: context.config.columns,
    fileName: context.config.fileName || context.config.workbookName,
    rowCount: rows.length,
    selectedRange: context.config.selectedRange,
    selectedSheet: context.config.selectedSheet,
    sourceId: context.block.id,
    sourceKind,
    sourceLocator,
    sourceName: context.block.label,
    sourceStatus: context.config.sourceStatus || "draft",
    sourceSubtype: context.block.subtype,
    sourceVersion: context.config.sourceVersion || 1,
    uploadTimestamp: context.config.uploadTimestamp,
    updatedAt: context.block.updatedAt,
    workbookId: context.config.workbookId,
  };
  const workbookFile =
    typeof context.config.workbookFile === "object" &&
    context.config.workbookFile !== null
      ? context.config.workbookFile
      : {
          fileName: context.config.fileName || context.config.workbookName,
          fileSize: context.config.fileSize,
          uploadedAt: context.config.uploadTimestamp,
          workbookId: context.config.workbookId,
        };
  const selectedSheet = {
    sheetCount: Array.isArray(context.config.sheets)
      ? context.config.sheets.length
      : undefined,
    sheetName: context.config.selectedSheet,
    workbookId: context.config.workbookId,
  };
  const selectedRange = {
    range: context.config.selectedRange,
    rowCount: rows.length,
    selectedSheet: context.config.selectedSheet,
  };

  return {
    blockId: context.block.id,
    completedAt: new Date().toISOString(),
    errors: [],
    evidenceRefs,
    logs: [
      info("Manual table Source emitted immutable rows.", {
        rowCount: rows.length,
      }),
    ],
    outputs: {
      raw_rows: {
        rawRows: rows.map((row) => row.raw || row.metadata?.raw || row),
        rowCount: rows.length,
      },
      rows: {
        immutable: true,
        readOnlyEvidence: true,
        rowCount: rows.length,
        rows: rowsWithTrace,
        sourceKind,
      },
      selected_range: selectedRange,
      selected_rows: {
        immutable: true,
        readOnlyEvidence: true,
        rowCount: rows.length,
        rows: rowsWithTrace,
        selectedRange: context.config.selectedRange,
        selectedSheet: context.config.selectedSheet,
        sourceKind,
      },
      selected_sheet: selectedSheet,
      workbook_file: {
        workbookFile,
      },
      source_locator: {
        locator: sourceLocator,
        sourceLocator,
      },
      source_metadata: sourceMetadata,
    },
    primaryOutputRole: "rows",
    runId: context.runId,
    sourceTrace,
    startedAt: context.startedAt,
    status: "success",
    toolId: "source.manual_table",
    warnings: [],
  };
}
