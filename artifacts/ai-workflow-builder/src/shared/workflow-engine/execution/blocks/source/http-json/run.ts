// ─────────────────────────────────────────────────────────────────────────────
// HTTP / JSON Source — the PURE half.
//
// No network call happens here. The live fetch runs server-side (see
// api-server routes/http-source.ts → fetchJsonSource) and pins its rows into
// block config as `fetchedRows` + `responseMeta`. This function replays that
// pinned payload, so re-running a workflow reproduces the same figures and the
// evidence pack can state exactly which response the numbers came from.
//
// With nothing pinned it falls back to the offline sample and says so in a
// warning — the workflow still runs end-to-end without a network.
// ─────────────────────────────────────────────────────────────────────────────

import { info, warning } from "../../../runtime/events";
import {
  createEvidenceRef,
  createSourceTraceRef,
} from "../../../runtime/lineage";
import type {
  ToolExecutionContext,
  ToolRunResult,
} from "../../../runtime/types";
import { normalizeManualTableRow } from "../manual-table/schema";
import { SAMPLE_HTTP_JSON_ROWS } from "./fixtures";
import { parseHttpJsonConfig } from "./schema";

export function runHttpJsonSource(
  context: ToolExecutionContext
): ToolRunResult {
  const config = parseHttpJsonConfig(context.config);
  const sourceKind = String(context.config.sourceKind || "http_json");

  // Three row sources, in precedence order:
  //   1. `fetchedRows` — a live response pinned by the api-server fetch.
  //   2. `rows`        — rows the run engine injected (its sample set, or an
  //                      upload). runTemplateCore writes every Source block's
  //                      rows under this key, so honouring it is what lets this
  //                      block stand in for a manual/table Source.
  //   3. the offline fixture, so the block still runs with no network at all.
  const normalize = (input: unknown[]) =>
    input
      .map(normalizeManualTableRow)
      .filter((row): row is NonNullable<ReturnType<typeof normalizeManualTableRow>> =>
        Boolean(row)
      );

  const pinned = normalize(config.fetchedRows || []);
  const injected = Array.isArray(context.config.rows)
    ? normalize(context.config.rows as unknown[])
    : [];

  const origin =
    pinned.length > 0 ? "live" : injected.length > 0 ? "injected" : "sample";
  const rows =
    origin === "live"
      ? pinned
      : origin === "injected"
        ? injected
        : SAMPLE_HTTP_JSON_ROWS.map((row) => ({ ...row }));
  const isLive = origin === "live";

  const warnings: string[] = [];
  if (origin === "sample") {
    warnings.push(
      config.url
        ? `No live response is pinned for ${config.url} — the run used the offline sample. Fetch the endpoint to replace it.`
        : "No endpoint is configured — the run used the offline sample."
    );
  }

  const sourceLocator =
    config.url ||
    (typeof context.config.sourceLocator === "string"
      ? context.config.sourceLocator
      : `source://${context.block.id}`);

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

  const responseMetadata = {
    endpoint: sourceLocator,
    fetchedAt: config.responseMeta?.fetchedAt,
    live: isLive,
    method: config.method,
    origin,
    recordCount: config.responseMeta?.recordCount ?? rows.length,
    resultsPath: config.resultsPath,
    rowCount: rows.length,
    status: config.responseMeta?.status,
    truncated: config.responseMeta?.truncated ?? false,
  };

  return {
    blockId: context.block.id,
    completedAt: new Date().toISOString(),
    errors: [],
    evidenceRefs,
    logs: [
      origin === "live"
        ? info("API Source replayed the pinned response.", {
            endpoint: sourceLocator,
            fetchedAt: config.responseMeta?.fetchedAt,
            rowCount: rows.length,
            status: config.responseMeta?.status,
          })
        : origin === "injected"
          ? info("API Source used the rows supplied by the run.", {
              endpoint: sourceLocator || undefined,
              rowCount: rows.length,
            })
          : warning("API Source used the offline sample.", {
              endpoint: sourceLocator || undefined,
              rowCount: rows.length,
            }),
    ],
    outputs: {
      raw_rows: {
        rawRows: rows.map((row) => row.raw || row),
        rowCount: rows.length,
      },
      response_metadata: responseMetadata,
      rows: {
        immutable: true,
        readOnlyEvidence: true,
        rowCount: rows.length,
        rows: rowsWithTrace,
        sourceKind,
      },
      selected_rows: {
        immutable: true,
        readOnlyEvidence: true,
        rowCount: rows.length,
        rows: rowsWithTrace,
        sourceKind,
      },
      source_locator: {
        locator: sourceLocator,
        sourceLocator,
      },
      source_metadata: {
        endpoint: sourceLocator,
        fetchedAt: config.responseMeta?.fetchedAt,
        live: isLive,
        rowCount: rows.length,
        sourceId: context.block.id,
        sourceKind,
        sourceLocator,
        sourceName: context.block.label,
        sourceStatus: context.config.sourceStatus || "draft",
        sourceSubtype: context.block.subtype,
        sourceVersion: context.config.sourceVersion || 1,
        updatedAt: context.block.updatedAt,
      },
    },
    primaryOutputRole: "rows",
    runId: context.runId,
    sourceTrace,
    startedAt: context.startedAt,
    status: warnings.length > 0 ? "warning" : "success",
    toolId: "source.http_json",
    warnings,
  };
}
