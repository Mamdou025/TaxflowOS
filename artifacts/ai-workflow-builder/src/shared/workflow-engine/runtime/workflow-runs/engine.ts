

import { runLocalWorkflowTools } from '@/shared/workflow-engine/local-tool-runner';
import { workflowDefinitionToCanvas } from '@/shared/workflow-engine/local-fiscal-workflow';

// ─────────────────────────────────────────────────────────────────────────────
// Generic "classify → roll up → compute" workflow-run engine.
//
// FAPI and Roulement fiscal share the same skeleton: an upload-first source →
// keyword classification → category rollup → two calculation-engine stages. This
// runs any such template through the real deterministic runner, extracts the
// figures + full traceability detail, and drives the interactive
// run → resolve → resume loop (upload · categorize · [elect] · approve).
//
// A new workflow = one `TemplateConfig`. No new engine code.
// ─────────────────────────────────────────────────────────────────────────────

export type SourceRow = { rowId: string; account?: string; label: string; description?: string; amount: number; currency?: string };
export type CategoryOption = { id: string; label: string };
export type CalcRuleLike = { resultKey: string; label: string; description: string };

export type ElectConfig = {
  paramBlockId: string; // block whose config carries the elected scalar
  paramKey: string;     // config key to write (e.g. "montantElu")
  minKey: string;       // summary/line key holding the floor
  maxKey: string;       // summary/line key holding the ceiling
  label: string;        // human label for the elected amount
  // Optional wording for the choice card. Defaults reproduce the fiscal rollover
  // (Roulement) verbatim, so a generic election reads naturally without changing it.
  ceilingWord?: string; // word before "ceiling" in the prompt (default "JVM")
  floorLabel?: string;  // prefix on the floor option (default "Floor")
  ceilingLabel?: string;// prefix on the ceiling option (default "JVM")
  floorNote?: string;   // suffix on the floor option (default " · defer all gain")
  ceilingNote?: string; // suffix on the ceiling option (default " · realize gain")
  promptSuffix?: string;// trailing sentence (default " This sets how much gain is deferred.")
};

export type StepDef = { label: string; sub: string };

export type TemplateConfig = {
  id: string;
  name: string;
  agentId?: string;
  documentLabel: string; // the source document, e.g. "foreign-affiliate trial balance"
  resultPage?: string; // registered page key for the result worksheet (if any)
  steps: [StepDef, StepDef, StepDef, StepDef]; // source · classify · compute · decide
  buildSnapshot: () => { blocks: Array<{ id: string; config?: Record<string, unknown> }>; name: string; [k: string]: unknown };
  sampleRows: SourceRow[];
  sourceBlockId: string;
  mapperBlockId: string;
  rollupBlockId: string;
  linesBlockId: string;
  summaryBlockId: string;
  linesRules: CalcRuleLike[];
  summaryRules: CalcRuleLike[];
  /** Base keyword-mapper rules (e.g. ported from Platform). Replaces the
   *  template's built-in rules when set; user overrides still take priority. */
  mapperRules?: Array<Record<string, unknown>>;
  /**
   * When true, rows the mapper can't classify do NOT block the run. They're
   * left OUT of the calculation and surfaced as a non-blocking "needs review"
   * banner — the workflow computes a figure immediately and categorizing the
   * misses is optional (via the classify step). When false/unset, each unmatched
   * row is a blocking per-row checkpoint (legacy behaviour).
   */
  defaultRouteUnmatched?: boolean;
  bucketKeys: string[];
  lineKeys: string[];
  categoryOptions: CategoryOption[];
  headlineKey: string; // summary resultKey shown as the big number
  currency: string;
  elect?: ElectConfig;
  /** Map a normalized row to the template source's raw columns (default: identity). */
  toRawRow?: (row: SourceRow) => Record<string, unknown>;
  /** Fixed scalar params (e.g. jvm_total) used by `computeExtra`. */
  params?: Record<string, number>;
  /**
   * The figures this config produces are a stand-in, not the workflow's real
   * domain math (the portfolio blueprints share one generic income/expense engine
   * so their Run → Results flow works end-to-end). Drives the "representative
   * figures" caveat on the worksheet. A fully built workflow leaves this unset.
   */
  representative?: boolean;
  /**
   * This workflow's rows come from a live JSON endpoint rather than an uploaded
   * workbook. The run's first step then offers "Fetch from <provider>" (served by
   * POST /api/http-source) instead of an upload prompt. Upload and the offline
   * sample stay available as fallbacks — a demo must still work with no network.
   */
  apiSource?: {
    url: string;
    method?: 'GET' | 'POST';
    body?: unknown;
    resultsPath?: string;
    fieldMap?: Record<string, string>;
    currency?: string;
    maxRows?: number;
    /** Human name of the upstream, e.g. "USAspending.gov". */
    provider: string;
    /** What one row is, e.g. "contract awards". */
    recordLabel: string;
    /**
     * When set, the run asks for this connector's BUSINESS parameters (a year, a
     * currency) instead of fetching a fixed URL — and rebuilds the request from
     * them. `url`/`body`/`fieldMap` above stay as the defaults the connector
     * resolves to, so a template reads the same either way and nothing downstream
     * has to know a connector was involved.
     *
     * This is what lets a run started from chat be completed by answering "2024,
     * EUR" rather than by pasting an endpoint.
     */
    connectorId?: string;
    /** Starting parameter values; anything omitted falls back to the connector's default. */
    connectorParams?: Record<string, string | number>;
  };
  /**
   * Optional deterministic post-compute. Used when the template's calc engine
   * can't reproduce the domain math (e.g. Roulement's params source is
   * under-wired) — the engine still does the real classification + rollup, and
   * this computes the lines/summary/bounds from the aggregated total + params.
   */
  computeExtra?: (args: {
    rollup: Record<string, number>;
    params: Record<string, number>;
    elected: number | null;
    /**
     * The rows THIS run is actually working on — live-fetched, uploaded, or the
     * sample. Templates whose math is row-level (a count above a threshold, a
     * top-N concentration) must read these; closing over the module's sample rows
     * silently reports sample figures for a live run.
     */
    rows: SourceRow[];
    /** Just the rows the mapper classified (a subset of `rows`). */
    mapped: MappedRow[];
  }) => {
    lines: DerivedRow[];
    summary: DerivedRow[];
    boundsMin: number;
    boundsMax: number;
  };
  /** Inputs the user can edit inside the run; changing one re-runs the engine. */
  editableInputs?: EditableInput[];
  /**
   * Optional, for the worksheet-intel retrieval layer only: given a line key +
   * the computed run, return the classified source rows that fed that line (so
   * the chat can answer "what rows are behind line A"). Opt-in — templates whose
   * lines aren't row-classified simply omit it (explainLine still returns the
   * formula + operand values). See lib/worksheet-intel/template-adapter.ts.
   */
  worksheetProvenance?: (args: { lineKey: string; core: CoreResult }) => Array<{
    label: string;
    amount: number;
    category: string;
    keyword: string | null;
    confidence: number;
  }>;
};

export type EditableInput = {
  key: string; // state.inputs key (and, when no `block`, the computeExtra params key)
  label: string;
  default: number;
  step?: number;
  hint?: string;
  /** Inject into a template block's config (e.g. FAPI FX rate). If omitted, the
   *  value overrides `computeExtra`'s params under `key` (e.g. Roulement JVM). */
  block?: { blockId: string; configKey: string };
  /**
   * The line this input feeds is normally produced by classification (the rollup
   * emits it as a named value). Injecting the DEFAULT into the block config would
   * clobber that classified value (block config wins over rollup), so we only
   * inject when the user has moved it OFF the default. This keeps the worksheet
   * and the chat run identical: an untouched classification-fed input never
   * overrides the classified figure. See FAPI lines C / A.1 / D / E.
   */
  classificationFed?: boolean;
};

export type DerivedRow = { key: string; label: string; value: number; formula: string };
export type MappedRow = { rowId: string; label: string; amount: number; category: string; keyword: string; confidence: number };
export type RunDetail = {
  sourceRows: SourceRow[];
  mapped: MappedRow[];
  unmatched: { rowId: string; label: string; amount: number }[];
  buckets: { key: string; value: number }[];
  lines: DerivedRow[];
  summary: DerivedRow[];
};

export type CoreResult = {
  status: 'success' | 'warning' | 'error';
  summaryValues: Record<string, number>;
  lineValues: Record<string, number>;
  detail: RunDetail;
  unmatched: { rowId: string; label: string; amount: number }[];
  bounds?: { min: number; max: number };
  blockCount: number;
  runId: string;
};

function asNumberRecord(value: unknown): Record<string, number> {
  if (!value || typeof value !== 'object') return {};
  const out: Record<string, number> = {};
  for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
    const n = typeof v === 'number' ? v : Number(v);
    if (Number.isFinite(n)) out[k] = n;
  }
  return out;
}

export type OverrideRule = { rowLabel: string; categoryId: string; categoryLabel: string };

/**
 * Convert the run's per-row override map (rowId → categoryId, as stored in
 * RunState.overrides and the shared runEditsAtom) into the OverrideRule[] the
 * core runner consumes. `__skip__` rows are dropped (they stay unmatched/out of
 * the calc). Shared by runTemplateLoop AND the worksheet — which calls
 * runTemplateCore directly — so a re-categorization made in the chat run and a
 * worksheet computed from the same shared overrides land on identical figures.
 */
export function buildOverrideRules(
  config: TemplateConfig,
  rows: SourceRow[],
  overrides: Record<string, string>
): OverrideRule[] {
  const rules: OverrideRule[] = [];
  for (const row of rows) {
    const cat = overrides[row.rowId];
    if (cat && cat !== '__skip__') {
      const opt = config.categoryOptions.find((o) => o.id === cat);
      rules.push({ rowLabel: row.label, categoryId: cat, categoryLabel: opt?.label ?? cat });
    }
  }
  return rules;
}

/** Run the template once with the given inputs and extract figures + detail. */
export function runTemplateCore(
  config: TemplateConfig,
  opts: { rows: SourceRow[]; overrides: OverrideRule[]; elected?: number; inputs?: Record<string, number> }
): CoreResult {
  const snapshot = config.buildSnapshot();
  const inputVals = opts.inputs ?? {};

  const rawRows = config.toRawRow ? opts.rows.map(config.toRawRow) : opts.rows;
  const source = snapshot.blocks.find((b) => b.id === config.sourceBlockId);
  if (source) source.config = { ...source.config, rows: rawRows, requireUpload: false, selectedRowsCount: rawRows.length, sourceStatus: 'ready' };

  // Replace the template's built-in mapper rules with the config's (Platform-ported) set.
  if (config.mapperRules) {
    const mapper = snapshot.blocks.find((b) => b.id === config.mapperBlockId);
    if (mapper) mapper.config = { ...mapper.config, keywordRules: config.mapperRules };
  }

  // Editable inputs → inject into their block config (params → computeExtra handled below).
  const paramOverrides: Record<string, number> = {};
  for (const inp of config.editableInputs ?? []) {
    if (!(inp.key in inputVals)) continue;
    // Classification-fed inputs left at their default must NOT be injected — the
    // block config would win over the rollup's classified value and zero the line.
    if (inp.classificationFed && inputVals[inp.key] === inp.default) continue;
    if (inp.block) {
      const b = snapshot.blocks.find((x) => x.id === inp.block!.blockId);
      if (b) b.config = { ...b.config, [inp.block.configKey]: inputVals[inp.key] };
    } else {
      paramOverrides[inp.key] = inputVals[inp.key];
    }
  }

  if (opts.overrides.length) {
    const mapper = snapshot.blocks.find((b) => b.id === config.mapperBlockId);
    if (mapper) {
      const existing = Array.isArray(mapper.config?.keywordRules) ? (mapper.config!.keywordRules as unknown[]) : [];
      const added = opts.overrides.map((o, i) => ({ ruleId: `override-${i}-${o.categoryId}`, categoryId: o.categoryId, categoryLabel: o.categoryLabel, target: o.categoryId, keywords: [o.rowLabel.toLowerCase()], confidence: 1 }));
      mapper.config = { ...mapper.config, keywordRules: [...added, ...existing] };
    }
  }

  if (opts.elected != null && config.elect) {
    const paramBlock = snapshot.blocks.find((b) => b.id === config.elect!.paramBlockId);
    if (paramBlock) paramBlock.config = { ...paramBlock.config, [config.elect.paramKey]: opts.elected };
  }

  const canvas = workflowDefinitionToCanvas(snapshot as never);
  const run = runLocalWorkflowTools({ edges: canvas.edges, nodes: canvas.nodes, workflowName: snapshot.name });
  const results = run.result.results;
  const outputOf = (id: string) => (results.find((r) => r.blockId === id)?.output as Record<string, unknown> | undefined) ?? {};

  const summaryValues = asNumberRecord(outputOf(config.summaryBlockId).calculatedResults);
  const lineValues = asNumberRecord(outputOf(config.linesBlockId).calculatedResults);

  const mapperOut = outputOf(config.mapperBlockId);
  const rawMapped = (mapperOut.mappedRows ?? []) as Array<Record<string, unknown>>;
  const mapped: MappedRow[] = rawMapped.map((r) => ({ rowId: String(r.rowId ?? ''), label: String(r.label ?? r.rowId ?? 'row'), amount: Number(r.amount ?? 0), category: String(r.categoryLabel ?? r.categoryId ?? '—'), keyword: String(r.matchedKeyword ?? ''), confidence: Number(r.confidence ?? 0) }));
  const rawUnmatched = (mapperOut.unmatchedRows ?? []) as Array<Record<string, unknown>>;
  const unmatched = rawUnmatched.map((r) => ({ rowId: String(r.rowId ?? ''), label: String(r.label ?? r.description ?? r.rowId ?? 'row'), amount: Number(r.amount ?? 0) }));

  const named = asNumberRecord(outputOf(config.rollupBlockId).namedValues);
  const buckets = config.bucketKeys.filter((k) => k in named).map((k) => ({ key: k, value: named[k] }));

  // Rows the mapper couldn't classify are left OUT of every rollup total, so a
  // worksheet's own figures can silently fail to foot to the source it was built
  // from — 6 excluded awards worth $2.5bn sat outside the spend review's totals
  // with no figure naming them. These three keys are always available to a
  // template so any worksheet can reconcile to what actually arrived:
  //   SOURCE_TOTAL = UNMATCHED_TOTAL + everything that reached the rollup.
  const SOURCE_TOTAL = opts.rows.reduce((sum, row) => sum + (Number(row.amount) || 0), 0);
  const UNMATCHED_TOTAL = unmatched.reduce((sum, row) => sum + row.amount, 0);
  const reconciliation = {
    SOURCE_TOTAL,
    UNMATCHED_TOTAL,
    UNMATCHED_COUNT: unmatched.length,
  };
  const derive = (rules: CalcRuleLike[], calc: Record<string, number>): DerivedRow[] =>
    rules.filter((r) => r.resultKey in calc).map((r) => ({ key: r.resultKey, label: r.label, value: calc[r.resultKey], formula: r.description }));

  let lines = derive(config.linesRules, lineValues).filter((d) => config.lineKeys.includes(d.key));
  let summary = derive(config.summaryRules, summaryValues);
  let bounds: { min: number; max: number } | undefined;

  if (config.computeExtra) {
    // Real classification + rollup from the engine; deterministic domain math here.
    const ex = config.computeExtra({ rollup: named, params: { ...(config.params ?? {}), ...paramOverrides }, elected: opts.elected ?? null, rows: opts.rows, mapped });
    lines = ex.lines;
    summary = ex.summary;
    bounds = { min: ex.boundsMin, max: ex.boundsMax };
    for (const s of ex.summary) summaryValues[s.key] = s.value;
    for (const l of ex.lines) lineValues[l.key] = l.value;
  } else if (config.elect) {
    bounds = { min: lineValues[config.elect.minKey] ?? 0, max: lineValues[config.elect.maxKey] ?? 0 };
  }

  // Published after computeExtra so a template can reference them in its own
  // rules, but never overwritten by one — reconciliation is the engine's fact.
  Object.assign(summaryValues, reconciliation);
  Object.assign(lineValues, reconciliation);

  const detail: RunDetail = { sourceRows: opts.rows, mapped, unmatched, buckets, lines, summary };
  const status = run.result.status === 'error' ? 'error' : run.result.status === 'warning' ? 'warning' : 'success';
  return { status, summaryValues, lineValues, detail, unmatched, bounds, blockCount: results.length, runId: run.result.runId };
}

// ─── Interactive loop ─────────────────────────────────────────────────────────
export type RunState = { uploaded: boolean; overrides: Record<string, string>; elected: number | null; approved: boolean; inputs: Record<string, number>; rows?: SourceRow[] };
export const initialRunState = (): RunState => ({ uploaded: false, overrides: {}, elected: null, approved: false, inputs: {} });

export type StepStatus = 'done' | 'active' | 'pending';
export type RunBlocker =
  | { kind: 'upload'; message: string }
  | { kind: 'choice'; choiceId: string; message: string; options: CategoryOption[] }
  | { kind: 'approval'; message: string; figures: DerivedRow[] };

export type RunOutcome = {
  detail: RunDetail | null;
  blocker?: RunBlocker;
  done: boolean;
  activeStage: number; // 0 upload · 1 classify · 2 compute · 3 (elect|approve)
  headline?: { label: string; value: number; currency: string };
  summaryText?: string;
  /** Rows the mapper couldn't classify that were left out of the calculation
   *  (non-blocking). Present only with `defaultRouteUnmatched`. */
  needsReview?: { count: number; rows: { rowId: string; label: string; amount: number }[] };
};

const ELECT_CHOICE = '__elect__';

export function runTemplateLoop(config: TemplateConfig, state: RunState): RunOutcome {
  if (!state.uploaded) {
    return {
      detail: null,
      done: false,
      activeStage: 0,
      blocker: {
        kind: 'upload',
        message: config.apiSource
          ? `This workflow reads its ${config.apiSource.recordLabel} straight from ${config.apiSource.provider} — no upload needed.`
          : 'This workflow needs its source document before it can classify anything. Upload the workbook (or use the sample) to continue.',
      },
    };
  }

  // Real uploaded rows (shared with the builder) when present; else the sample.
  const rows = state.rows && state.rows.length > 0 ? state.rows : config.sampleRows;

  const overrideRules = buildOverrideRules(config, rows, state.overrides);
  const core = runTemplateCore(config, { rows, overrides: overrideRules, elected: state.elected ?? undefined, inputs: state.inputs });

  // Rows the mapper couldn't classify (and the user hasn't decided on).
  const unresolved = core.unmatched.filter((u) => !(u.rowId in state.overrides));
  // Legacy behaviour: each unmatched row is a blocking per-row checkpoint.
  if (unresolved.length && !config.defaultRouteUnmatched) {
    const pending = unresolved[0];
    return {
      detail: core.detail, done: false, activeStage: 1,
      blocker: { kind: 'choice', choiceId: pending.rowId, message: `“${pending.label}” didn’t match any classification rule. Where does it belong?`, options: config.categoryOptions },
    };
  }
  // Option 1: default-route — unmatched rows are left OUT of the calc (they're
  // never added to overrideRules) and surfaced as a non-blocking banner. The run
  // proceeds to compute + approval; categorizing them later is optional.
  const needsReview = config.defaultRouteUnmatched && unresolved.length
    ? { count: unresolved.length, rows: unresolved.map((u) => ({ rowId: u.rowId, label: u.label, amount: u.amount })) }
    : undefined;

  // Optional election (roulement, campaign budget…): choose the elected amount
  // within bounds. The wording is config-driven; defaults reproduce the rollover.
  if (config.elect && state.elected == null) {
    const lo = core.bounds?.min ?? core.lineValues[config.elect.minKey] ?? 0;
    const hi = core.bounds?.max ?? core.lineValues[config.elect.maxKey] ?? 0;
    const mid = Math.round((lo + hi) / 2);
    const e = config.elect;
    const ceilingWord = e.ceilingWord ?? 'JVM';
    const floorLabel = e.floorLabel ?? 'Floor';
    const ceilingLabel = e.ceilingLabel ?? 'JVM';
    const floorNote = e.floorNote ?? ' · defer all gain';
    const ceilingNote = e.ceilingNote ?? ' · realize gain';
    const promptSuffix = e.promptSuffix ?? ' This sets how much gain is deferred.';
    return {
      detail: core.detail, done: false, activeStage: 3, needsReview,
      blocker: {
        kind: 'choice', choiceId: ELECT_CHOICE,
        message: `Choose the ${e.label} — anywhere between the floor (${lo.toLocaleString()}) and ${ceilingWord} ceiling (${hi.toLocaleString()}).${promptSuffix}`,
        options: [
          { id: String(lo), label: `${floorLabel} ${lo.toLocaleString()}${floorNote}` },
          { id: String(mid), label: `Midpoint ${mid.toLocaleString()}` },
          { id: String(hi), label: `${ceilingLabel} ${hi.toLocaleString()}${ceilingNote}` },
        ],
      },
    };
  }

  const headlineVal = core.summaryValues[config.headlineKey] ?? core.lineValues[config.headlineKey] ?? 0;
  if (!state.approved) {
    return {
      detail: core.detail, done: false, activeStage: config.elect ? 3 : 3, needsReview,
      blocker: { kind: 'approval', message: 'All inputs are resolved and computed. Each figure below shows how it was derived. Approve to finalize.', figures: core.detail.summary },
      headline: { label: headlineLabel(config), value: headlineVal, currency: config.currency },
    };
  }

  return {
    detail: core.detail, done: true, activeStage: 4, needsReview,
    headline: { label: headlineLabel(config), value: headlineVal, currency: config.currency },
    summaryText: `${config.id.toUpperCase()} complete. ${headlineLabel(config)} = ${headlineVal.toLocaleString()} ${config.currency}.`,
  };
}

function headlineLabel(config: TemplateConfig): string {
  return config.summaryRules.find((r) => r.resultKey === config.headlineKey)?.label ?? config.headlineKey;
}

/** Auto-run the whole workflow with sensible defaults (skip unmatched, elect the
 *  floor, approve) — used to summon the finished output without stepping. */
export function runToCompletion(config: TemplateConfig): RunOutcome {
  let state = initialRunState();
  for (let guard = 0; guard < 30; guard++) {
    const o = runTemplateLoop(config, state);
    if (o.done || !o.blocker) return o;
    if (o.blocker.kind === 'upload') state = { ...state, uploaded: true };
    else if (o.blocker.kind === 'approval') state = { ...state, approved: true };
    else if (o.blocker.choiceId === '__elect__') state = { ...state, elected: Number(o.blocker.options[0]?.id ?? 0) };
    else state = { ...state, overrides: { ...state.overrides, [o.blocker.choiceId]: '__skip__' } };
  }
  return runTemplateLoop(config, state);
}

/** Resolve a blocker against the run state (pure). */
export function resolveBlocker(state: RunState, blocker: RunBlocker, choiceId?: string): RunState {
  if (blocker.kind === 'upload') return { ...state, uploaded: true };
  if (blocker.kind === 'approval') return { ...state, approved: true };
  // choice
  if (blocker.choiceId === ELECT_CHOICE) return { ...state, elected: Number(choiceId) };
  return { ...state, overrides: { ...state.overrides, [blocker.choiceId]: String(choiceId) } };
}
