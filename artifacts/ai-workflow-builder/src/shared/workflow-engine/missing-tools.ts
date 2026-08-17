// ─────────────────────────────────────────────────────────────────────────────
// Executors for the catalog entries that had none.
//
// A 2026-08-12 audit ran all 35 palette blocks through their resolved tool. Three
// gaps came out of it, and this module closes them:
//
//   1. 7 blocks (3 Triggers, 4 AI) resolved to `ai.proposal_only`, WHICH WAS NEVER
//      REGISTERED — the palette offered seven things that could not run at all.
//   2. 4 Sources (Web/URL, PDF, Database Query, AI Search) resolved to the generic
//      manual_value/manual_table holders, so they produced a placeholder scalar
//      under a name promising a fetch, a parse or a query.
//   3. 3 Outputs (PDF Report, Taxprep, ONESOURCE) all aliased the evidence-pack
//      preview and emitted byte-identical output.
//
// Everything here follows the engine's existing split: `execute` is SYNCHRONOUS
// and PURE, so a tool that needs the network replays what a server-side fetch
// pinned into its config (the same pattern currency-rate and http-json use). That
// is what keeps a run reproducible and an evidence pack meaningful — and it is why
// none of these call out from inside the engine.
//
// Where a source has nothing pinned it says so in a warning and produces no rows,
// rather than inventing a plausible number. That is the whole point of the audit.
// ─────────────────────────────────────────────────────────────────────────────

import type {
  EvidenceRef,
  SourceTraceRef,
  ToolDefinition,
  ToolExecutionContext,
  ToolRunResult,
  ToolInputRole,
  ToolOutputRole,
  ToolRunLog,
} from "./local-tool-registry";

// ── local copies of the registry's tiny helpers ──────────────────────────────
// (they are module-private in local-tool-registry.ts; duplicating three trivial
// builders is cheaper than widening that file's public surface)

let logSeq = 0;
function makeLog(input: {
  blockId: string;
  message: string;
  level?: ToolRunLog["level"];
  details?: Record<string, unknown>;
}): ToolRunLog {
  logSeq += 1;
  return {
    at: new Date().toISOString(),
    id: `${input.blockId}-log-${logSeq}`,
    level: input.level ?? "info",
    message: input.message,
    ...(input.details ? { details: input.details } : {}),
  };
}

function result(input: {
  context: ToolExecutionContext;
  output: Record<string, unknown>;
  status: ToolRunResult["status"];
  logs?: ToolRunLog[];
  warnings?: string[];
  errors?: string[];
  evidenceRefs?: EvidenceRef[];
  sourceTrace?: SourceTraceRef[];
}): ToolRunResult {
  return {
    blockId: input.context.block.id,
    completedAt: new Date().toISOString(),
    errors: input.errors ?? [],
    evidenceRefs: input.evidenceRefs ?? input.context.evidenceRefs,
    logs: input.logs ?? [],
    output: input.output,
    runId: input.context.runId,
    sourceTrace: input.sourceTrace ?? input.context.sourceTrace,
    startedAt: input.context.startedAt,
    status: input.status,
    toolId: String(input.context.config.toolId || "unknown"),
    warnings: input.warnings ?? [],
  };
}

const schema = (fields: { key: string; required?: boolean; type: string }[]) =>
  ({ fields }) as never;

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function pinnedRows(config: Record<string, unknown>): Record<string, unknown>[] {
  const rows = config.fetchedRows ?? config.rows;
  return Array.isArray(rows) ? (rows as Record<string, unknown>[]) : [];
}

/** Evidence for every pinned row, so a fetched source traces like any other. */
function rowEvidence(
  context: ToolExecutionContext,
  rows: Record<string, unknown>[],
  sourceKind: string,
  locator: string
): { evidenceRefs: EvidenceRef[]; sourceTrace: SourceTraceRef[] } {
  const evidenceRefs: EvidenceRef[] = rows.map((row, index) => ({
    evidenceId: `${context.block.id}:${row.rowId ?? index + 1}`,
    immutable: true,
    label: String(row.label ?? `Row ${index + 1}`),
    locator,
    rowId: String(row.rowId ?? `row-${index + 1}`),
    sourceBlockId: context.block.id,
    sourceLabel: context.block.label,
    valuePreview: String(row.amount ?? row.value ?? ""),
  }));
  const sourceTrace: SourceTraceRef[] = evidenceRefs.map((evidence) => ({
    evidenceRefId: evidence.evidenceId,
    relationshipPath: [sourceKind],
    rowId: evidence.rowId,
    sourceBlockId: evidence.sourceBlockId,
    sourceLabel: evidence.sourceLabel,
    valuePreview: evidence.valuePreview,
  }));
  return { evidenceRefs, sourceTrace };
}

const ROWS_OUT: ToolOutputRole = {
  canRouteToFamilies: ["Logic", "Review / Validation", "Output"],
  description: "Immutable rows captured from this source.",
  id: "rows",
  label: "Rows",
  outputKey: "rows",
  outputType: "rows",
  samplePreview: "source rows",
} as ToolOutputRole;

const SOURCE_META_OUT: ToolOutputRole = {
  canRouteToFamilies: ["Logic", "Output"],
  description: "Where the evidence was captured from, and when.",
  id: "source_metadata",
  label: "Source metadata",
  outputKey: "sourceMetadata",
  outputType: "source_metadata",
  samplePreview: "source metadata",
} as ToolOutputRole;

/**
 * The shared shape of every "fetched then pinned" source: replay the pinned rows,
 * or run clean with none and say why. Never fabricate.
 */
function makePinnedSourceTool(input: {
  toolId: string;
  displayName: string;
  subtype: string;
  description: string;
  sourceKind: string;
  locatorKey: string;
  /** What the user has to do to pin something, named in the warning. */
  pinHint: string;
  defaultConfig?: Record<string, unknown>;
}): ToolDefinition {
  return {
    defaultConfig: { sourceKind: input.sourceKind, ...input.defaultConfig },
    description: input.description,
    displayName: input.displayName,
    family: "Source",
    inputRoles: [],
    inputSchema: schema([]),
    outputRoles: [ROWS_OUT, SOURCE_META_OUT],
    outputSchema: schema([
      { key: "rows", required: true, type: "array" },
      { key: "immutable", required: true, type: "boolean" },
    ]),
    runMode: "local_mock",
    subtype: input.subtype as never,
    toolGroup: "source",
    toolId: input.toolId,
    execute: (context) => {
      const config = context.config;
      const rows = pinnedRows(config);
      const locator =
        String(config[input.locatorKey] ?? config.sourceLocator ?? "") ||
        `source://${context.block.id}`;
      const meta = asRecord(config.responseMeta);

      if (rows.length === 0) {
        const warning = `No ${input.displayName} evidence is pinned — ${input.pinHint} The run produced no rows rather than a placeholder value.`;
        return result({
          context,
          status: "warning",
          warnings: [warning],
          logs: [
            makeLog({
              blockId: context.block.id,
              level: "warning",
              message: warning,
            }),
          ],
          output: {
            immutable: true,
            live: false,
            rowCount: 0,
            rows: [],
            sourceKind: input.sourceKind,
            sourceLocator: locator,
            sourceMetadata: {
              endpoint: locator,
              live: false,
              pinned: false,
              sourceBlockId: context.block.id,
              sourceKind: input.sourceKind,
            },
          },
        });
      }

      const { evidenceRefs, sourceTrace } = rowEvidence(
        context,
        rows,
        input.sourceKind,
        locator
      );
      const rowsWithTrace = rows.map((row, index) => ({
        ...row,
        evidenceRefs: [evidenceRefs[index]],
        immutable: true,
        readOnlyEvidence: true,
        sourceTrace: [sourceTrace[index]],
      }));

      return result({
        context,
        evidenceRefs,
        sourceTrace,
        status: "success",
        logs: [
          makeLog({
            blockId: context.block.id,
            message: `${input.displayName} replayed ${rows.length} pinned rows.`,
            details: { locator, rowCount: rows.length },
          }),
        ],
        output: {
          immutable: true,
          live: Boolean(meta.fetchedAt),
          readOnlyEvidence: true,
          rowCount: rows.length,
          rows: rowsWithTrace,
          sourceKind: input.sourceKind,
          sourceLocator: locator,
          sourceMetadata: {
            capturedAt: meta.fetchedAt ?? null,
            endpoint: locator,
            live: Boolean(meta.fetchedAt),
            pinned: true,
            rowCount: rows.length,
            sourceBlockId: context.block.id,
            sourceKind: input.sourceKind,
            sourceName: context.block.label,
          },
        },
      });
    },
  } as ToolDefinition;
}

// ── Sources that were facades ────────────────────────────────────────────────

export const webUrlSourceTool = makePinnedSourceTool({
  toolId: "source.web_url",
  displayName: "Web / URL Source",
  subtype: "Web / URL",
  sourceKind: "web_url",
  locatorKey: "url",
  description:
    "Captures a public web page server-side and exposes its extracted tables/text as immutable Source rows. The run replays the pinned capture.",
  pinHint: "open the block and press Fetch page to capture it.",
});

export const pdfDocumentSourceTool = makePinnedSourceTool({
  toolId: "source.pdf_document",
  displayName: "PDF / Document Source",
  subtype: "PDF / Document",
  sourceKind: "pdf_document",
  locatorKey: "fileName",
  description:
    "Extracts text and figures from an uploaded PDF and exposes them as immutable Source rows. The run replays the pinned extraction.",
  pinHint: "open the block and upload the PDF to extract it.",
});

export const databaseQuerySourceTool = makePinnedSourceTool({
  toolId: "source.database_query",
  displayName: "Database Query Source",
  subtype: "Database Query",
  sourceKind: "database_query",
  locatorKey: "sql",
  description:
    "Runs a read-only SELECT against the TaxflowOS database and exposes the result set as immutable Source rows. The run replays the pinned result.",
  pinHint: "open the block, write the SELECT and press Run query.",
});

export const aiSearchSourceTool = makePinnedSourceTool({
  toolId: "source.ai_search",
  displayName: "AI Search Result Source",
  subtype: "AI Search Result",
  sourceKind: "ai_search",
  locatorKey: "query",
  description:
    "Captures web-search findings as immutable Source rows, each carrying its result URL. AI-retrieved evidence is still evidence: it is pinned, cited and replayed, never re-searched mid-run.",
  pinHint: "open the block, enter the query and press Search.",
});

// ── Triggers ─────────────────────────────────────────────────────────────────
// A Trigger legitimately computes nothing — it states how and when the run began.
// That is still a real output: downstream blocks and the evidence pack can record
// the run's provenance instead of it being untraceable.

const TRIGGER_OUT: ToolOutputRole = {
  canRouteToFamilies: ["Source", "Logic", "Review / Validation", "Output"],
  description: "How and when this run was started.",
  id: "trigger_payload",
  label: "Trigger payload",
  outputKey: "triggerPayload",
  outputType: "trigger_payload",
  samplePreview: "manual · 2026-08-12T10:00:00Z",
} as ToolOutputRole;

function makeTriggerTool(input: {
  toolId: string;
  displayName: string;
  subtype: string;
  mode: string;
  description: string;
  detail: (config: Record<string, unknown>) => Record<string, unknown>;
}): ToolDefinition {
  return {
    defaultConfig: {},
    description: input.description,
    displayName: input.displayName,
    family: "Trigger",
    inputRoles: [],
    inputSchema: schema([]),
    outputRoles: [TRIGGER_OUT],
    outputSchema: schema([{ key: "triggerPayload", required: true, type: "object" }]),
    runMode: "local_mock",
    subtype: input.subtype as never,
    toolGroup: "source",
    toolId: input.toolId,
    execute: (context) => {
      const payload = {
        blockId: context.block.id,
        firedAt: context.startedAt,
        mode: input.mode,
        runId: context.runId,
        workflowId: context.workflow.id,
        ...input.detail(context.config),
      };
      return result({
        context,
        status: "success",
        logs: [
          makeLog({
            blockId: context.block.id,
            message: `Run started by ${input.displayName}.`,
            details: payload,
          }),
        ],
        output: { triggerPayload: payload, ...payload },
      });
    },
  } as ToolDefinition;
}

export const manualTriggerTool = makeTriggerTool({
  toolId: "trigger.manual",
  displayName: "Manual Trigger",
  subtype: "Manual / On Demand",
  mode: "manual",
  description: "Starts the workflow on demand and records who ran it and when.",
  detail: (config) => ({ startedBy: String(config.owner ?? "user") }),
});

export const scheduleTriggerTool = makeTriggerTool({
  toolId: "trigger.schedule",
  displayName: "Schedule Trigger",
  subtype: "Schedule / Cron",
  mode: "schedule",
  description:
    "Starts the workflow on a schedule and records the cadence the run belongs to.",
  detail: (config) => ({
    cron: String(config.cron ?? config.schedule ?? "not set"),
    timezone: String(config.timezone ?? "UTC"),
  }),
});

export const webhookTriggerTool = makeTriggerTool({
  toolId: "trigger.webhook",
  displayName: "Webhook Trigger",
  subtype: "Webhook / API Event",
  mode: "webhook",
  description:
    "Starts the workflow from an inbound HTTP event and carries that event's payload into the run.",
  detail: (config) => ({
    event: String(config.event ?? "inbound"),
    receivedPayload: config.triggerPayload ?? null,
  }),
});

// ── AI blocks ────────────────────────────────────────────────────────────────
// `ai.proposal_only` was referenced by 7 catalog entries and registered by none.
//
// It stays PROPOSAL-ONLY by design, and that is not a cop-out: a model suggestion
// must not silently become a governed figure. The tool emits the pinned proposal,
// marks it non-authoritative, and refuses to present it as a value until a human
// has accepted it (`config.proposalAccepted`). Downstream governance can then read
// `authoritative: false` and block finality — which is exactly what an unreviewed
// AI suggestion should do to a tax deliverable.

const PROPOSAL_OUT: ToolOutputRole = {
  canRouteToFamilies: ["Logic", "Review / Validation"],
  description:
    "A model suggestion awaiting human acceptance. Never a governed value.",
  id: "proposal",
  label: "Proposal",
  outputKey: "proposal",
  outputType: "proposal",
  samplePreview: "AI suggestion (unaccepted)",
} as ToolOutputRole;

export const aiProposalTool: ToolDefinition = {
  defaultConfig: {},
  description:
    "Replays a pinned AI suggestion as an explicitly non-authoritative proposal. Requires human acceptance before anything downstream may treat it as a value.",
  displayName: "AI Proposal",
  family: "AI / Agent" as never,
  inputRoles: [
    {
      acceptedFamilies: ["Source", "Logic"],
      allowMultiple: true,
      description: "Context the proposal was generated against.",
      id: "context_rows",
      label: "Context",
      required: false,
    },
  ],
  inputSchema: schema([]),
  outputRoles: [PROPOSAL_OUT],
  outputSchema: schema([
    { key: "proposal", required: true, type: "object" },
    { key: "authoritative", required: true, type: "boolean" },
  ]),
  runMode: "local_mock",
  toolGroup: "ai_assistance" as never,
  toolId: "ai.proposal_only",
  execute: (context) => {
    const config = context.config;
    const proposal = asRecord(config.proposal);
    const accepted = config.proposalAccepted === true;
    const hasProposal = Object.keys(proposal).length > 0;

    if (!hasProposal) {
      const warning =
        "No AI proposal is pinned to this block. Generate one in the block, or remove the block — the run produced no suggestion rather than an invented one.";
      return result({
        context,
        status: "warning",
        warnings: [warning],
        logs: [
          makeLog({
            blockId: context.block.id,
            level: "warning",
            message: warning,
          }),
        ],
        output: { authoritative: false, accepted: false, proposal: null, proposalOnly: true },
      });
    }

    const warnings = accepted
      ? []
      : [
          "This AI proposal has not been accepted by a reviewer. It carries no authority and must not be used as a final figure.",
        ];

    return result({
      context,
      status: accepted ? "success" : "needs_review",
      warnings,
      logs: [
        makeLog({
          blockId: context.block.id,
          level: accepted ? "info" : "warning",
          message: accepted
            ? "AI proposal replayed (accepted by a reviewer)."
            : "AI proposal replayed — awaiting reviewer acceptance.",
          details: { accepted, model: String(config.proposalModel ?? "unknown") },
        }),
      ],
      output: {
        acceptedAt: config.proposalAcceptedAt ?? null,
        accepted,
        // The governance signal downstream blocks read. An unaccepted proposal is
        // never authoritative, whatever it contains.
        authoritative: accepted,
        generatedAt: config.proposalGeneratedAt ?? null,
        model: config.proposalModel ?? null,
        proposal,
        proposalOnly: true,
        rationale: config.proposalRationale ?? null,
      },
    });
  },
} as ToolDefinition;

export const MISSING_TOOLS: ToolDefinition[] = [
  webUrlSourceTool,
  pdfDocumentSourceTool,
  databaseQuerySourceTool,
  aiSearchSourceTool,
  manualTriggerTool,
  scheduleTriggerTool,
  webhookTriggerTool,
  aiProposalTool,
];
