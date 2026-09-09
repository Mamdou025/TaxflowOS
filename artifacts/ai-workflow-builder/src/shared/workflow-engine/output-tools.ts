// ─────────────────────────────────────────────────────────────────────────────
// The three Output blocks that used to alias the evidence-pack preview, now
// producing their own artifact. See output-writers.ts for the writers themselves
// and for why the two handoffs are documented-generic rather than faked-native.
// ─────────────────────────────────────────────────────────────────────────────

import {
  buildHandoff,
  buildPdf,
  paginateTable,
  type HandoffRow,
} from "./output-writers";
import type {
  ToolDefinition,
  ToolExecutionContext,
  ToolInputRole,
  ToolOutputRole,
  ToolRunResult,
} from "./local-tool-registry";

const schema = (fields: { key: string; required?: boolean; type: string }[]) =>
  ({ fields }) as never;

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function finish(input: {
  context: ToolExecutionContext;
  output: Record<string, unknown>;
  status: ToolRunResult["status"];
  warnings?: string[];
  toolId: string;
}): ToolRunResult {
  return {
    blockId: input.context.block.id,
    completedAt: new Date().toISOString(),
    errors: [],
    evidenceRefs: input.context.evidenceRefs,
    logs: [
      {
        at: new Date().toISOString(),
        id: `${input.context.block.id}-${input.toolId}`,
        level: input.warnings?.length ? "warning" : "info",
        message: `${input.toolId} produced its artifact.`,
      },
    ],
    output: input.output,
    runId: input.context.runId,
    sourceTrace: input.context.sourceTrace,
    startedAt: input.context.startedAt,
    status: input.status,
    toolId: input.toolId,
    warnings: input.warnings ?? [],
  };
}

const MAPPED_ROWS_IN: ToolInputRole = {
  acceptedFamilies: ["Logic", "Source"],
  allowMultiple: true,
  description: "The rows or computed figures to write out.",
  id: "mapped_rows",
  label: "Mapped rows",
  required: false,
};

const COMPUTED_VALUES_IN: ToolInputRole = {
  acceptedFamilies: ["Logic", "Protected"],
  allowMultiple: true,
  description: "Named figures produced by the calculation engine.",
  id: "computed_values",
  label: "Computed values",
  required: false,
};

const FILE_OUT = (id: string, label: string): ToolOutputRole =>
  ({
    canRouteToFamilies: ["Output"],
    description: `${label} produced by this block.`,
    id,
    label,
    outputKey: id,
    outputType: "file",
    samplePreview: label,
  }) as ToolOutputRole;

/**
 * Everything the writers need, gathered from upstream: the mapped rows, and the
 * engine's named figures with whatever formula/evidence was recorded for each.
 */
function collect(context: ToolExecutionContext) {
  const rows: Record<string, unknown>[] = [];
  const figures: HandoffRow[] = [];

  for (const upstream of context.upstreamResults) {
    const output = upstream.output as Record<string, unknown>;

    const mapped = output.mappedRows ?? output.rows;
    if (Array.isArray(mapped)) {
      for (const row of mapped) {
        rows.push(asRecord(row));
      }
    }

    // Named figures: `{ KEY: value }`, enriched from `lines`/`summary` when the
    // engine recorded a formula for the key.
    const named = asRecord(output.computedValues ?? output.namedValues);
    const detail = [
      ...(Array.isArray(output.lines) ? output.lines : []),
      ...(Array.isArray(output.summary) ? output.summary : []),
    ].map(asRecord);

    for (const [key, value] of Object.entries(named)) {
      if (typeof value !== "number") {
        continue;
      }
      const meta = detail.find((entry) => entry.key === key);
      const evidence = upstream.evidenceRefs[0];
      figures.push({
        currency: String(meta?.currency ?? output.currency ?? ""),
        evidence_id: evidence?.evidenceId ?? "",
        field_code: key,
        formula: String(meta?.formula ?? ""),
        label: String(meta?.label ?? key),
        source_block: upstream.blockId,
        value,
      });
    }
  }

  return { figures, rows };
}

// ── PDF Report ───────────────────────────────────────────────────────────────

export const pdfReportTool: ToolDefinition = {
  defaultConfig: {},
  description:
    "Renders the workflow's figures and rows as a real, downloadable PDF document.",
  displayName: "PDF Report",
  family: "Output",
  inputRoles: [MAPPED_ROWS_IN, COMPUTED_VALUES_IN],
  inputSchema: schema([]),
  outputRoles: [FILE_OUT("pdf_file", "PDF file")],
  outputSchema: schema([
    { key: "pdfBase64", required: true, type: "string" },
    { key: "fileName", required: true, type: "string" },
  ]),
  runMode: "local_mock",
  subtype: "PDF Report" as never,
  toolGroup: "reporting" as never,
  toolId: "output.pdf_report",
  execute: (context) => {
    const { figures, rows } = collect(context);
    const title = String(
      context.config.reportTitle || context.workflow.name || "Workflow report"
    );

    const summary = figures.map(
      (figure) =>
        `${String(figure.label).padEnd(34)} ${String(figure.value).padStart(16)} ${figure.currency ?? ""}`
    );

    const columns =
      rows.length > 0
        ? ["rowId", "label", "categoryLabel", "amount", "currency"].filter((key) =>
            rows.some((row) => key in row)
          )
        : [];

    const pages =
      rows.length > 0 || figures.length > 0
        ? paginateTable({
            columns: columns.length > 0 ? columns : ["field_code", "label", "value"],
            rows: columns.length > 0 ? rows : figures,
            summary: summary.length > 0 && columns.length > 0 ? ["Figures", ...summary] : [],
          })
        : [["No rows or figures reached this block."]];

    const pdf = buildPdf({ pages, title });
    // latin1 in, base64 out — the writer emits single-byte characters by design.
    const pdfBase64 =
      typeof btoa === "function"
        ? btoa(pdf)
        : Buffer.from(pdf, "latin1").toString("base64");

    const empty = rows.length === 0 && figures.length === 0;
    return finish({
      context,
      status: empty ? "warning" : "success",
      toolId: "output.pdf_report",
      warnings: empty
        ? ["No rows or computed figures reached the PDF Report block — the PDF says so rather than being blank."]
        : [],
      output: {
        byteLength: pdf.length,
        fileName: `${title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}.pdf`,
        figureCount: figures.length,
        mimeType: "application/pdf",
        pageCount: pages.length,
        pdfBase64,
        rowCount: rows.length,
        title,
      },
    });
  },
} as ToolDefinition;

// ── Taxprep / ONESOURCE handoffs ─────────────────────────────────────────────

function makeHandoffTool(input: {
  toolId: string;
  target: string;
  displayName: string;
  subtype: string;
  vendor: string;
}): ToolDefinition {
  return {
    defaultConfig: {},
    description: `Writes the workflow's figures as a documented tabular handoff for ${input.vendor}, with a manifest declaring every column and the evidence behind each value. Not a native ${input.vendor} file — map field_code on import.`,
    displayName: input.displayName,
    family: "Output",
    inputRoles: [COMPUTED_VALUES_IN, MAPPED_ROWS_IN],
    inputSchema: schema([]),
    outputRoles: [
      FILE_OUT("handoff_file", "Handoff CSV"),
      FILE_OUT("handoff_manifest", "Handoff manifest"),
    ],
    outputSchema: schema([
      { key: "csv", required: true, type: "string" },
      { key: "manifest", required: true, type: "object" },
    ]),
    runMode: "local_mock",
    subtype: input.subtype as never,
    toolGroup: "reporting" as never,
    toolId: input.toolId,
    execute: (context) => {
      const { figures } = collect(context);
      const handoff = buildHandoff({
        generatedAt: new Date().toISOString(),
        rows: figures,
        target: input.target,
        workflowName: context.workflow.name,
      });

      const empty = figures.length === 0;
      return finish({
        context,
        status: empty ? "warning" : "success",
        toolId: input.toolId,
        warnings: empty
          ? [
              `No computed figures reached the ${input.displayName} block — it wrote an empty handoff with its manifest rather than inventing rows. Wire the Calculation Engine's computed_values into it.`,
            ]
          : [
              `${input.displayName} is a documented generic export, not a native ${input.vendor} file. Map field_code to the target field on import — the manifest declares every column.`,
            ],
        output: {
          csv: handoff.csv,
          exportFormat: "csv",
          fileName: handoff.fileName,
          isNativeVendorFormat: false,
          manifest: handoff.manifest,
          manifestFileName: handoff.manifestFileName,
          mimeType: "text/csv",
          rowCount: handoff.rowCount,
          target: input.target,
        },
      });
    },
  } as ToolDefinition;
}

export const taxprepHandoffTool = makeHandoffTool({
  toolId: "output.taxprep_handoff",
  target: "taxprep",
  displayName: "Taxprep Handoff",
  subtype: "Taxprep Handoff",
  vendor: "Taxprep",
});

export const onesourceHandoffTool = makeHandoffTool({
  toolId: "output.onesource_handoff",
  target: "onesource",
  displayName: "ONESOURCE Handoff",
  subtype: "ONESOURCE Handoff",
  vendor: "ONESOURCE",
});

export const OUTPUT_TOOLS: ToolDefinition[] = [
  pdfReportTool,
  taxprepHandoffTool,
  onesourceHandoffTool,
];
