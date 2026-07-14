'use client';

import { runLocalWorkflowTools } from '@/lib/local-tool-runner';
import { workflowDefinitionToCanvas } from '@/lib/local-fiscal-workflow';

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
   * Optional deterministic post-compute. Used when the template's calc engine
   * can't reproduce the domain math (e.g. Roulement's params source is
   * under-wired) — the engine still does the real classification + rollup, and
   * this computes the lines/summary/bounds from the aggregated total + params.
   */
  computeExtra?: (args: { rollup: Record<string, number>; params: Record<string, number>; elected: number | null }) => {
    lines: DerivedRow[];
    summary: DerivedRow[];
    boundsMin: number;
    boundsMax: number;
  };
  /** Inputs the user can edit inside the run; changing one re-runs the engine. */
  editableInputs?: EditableInput[];
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

type OverrideRule = { rowLabel: string; categoryId: string; categoryLabel: string };

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
  const derive = (rules: CalcRuleLike[], calc: Record<string, number>): DerivedRow[] =>
    rules.filter((r) => r.resultKey in calc).map((r) => ({ key: r.resultKey, label: r.label, value: calc[r.resultKey], formula: r.description }));

  let lines = derive(config.linesRules, lineValues).filter((d) => config.lineKeys.includes(d.key));
  let summary = derive(config.summaryRules, summaryValues);
  let bounds: { min: number; max: number } | undefined;

  if (config.computeExtra) {
    // Real classification + rollup from the engine; deterministic domain math here.
    const ex = config.computeExtra({ rollup: named, params: { ...(config.params ?? {}), ...paramOverrides }, elected: opts.elected ?? null });
    lines = ex.lines;
    summary = ex.summary;
    bounds = { min: ex.boundsMin, max: ex.boundsMax };
    for (const s of ex.summary) summaryValues[s.key] = s.value;
    for (const l of ex.lines) lineValues[l.key] = l.value;
  } else if (config.elect) {
    bounds = { min: lineValues[config.elect.minKey] ?? 0, max: lineValues[config.elect.maxKey] ?? 0 };
  }

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
    return { detail: null, done: false, activeStage: 0, blocker: { kind: 'upload', message: 'This workflow needs its source document before it can classify anything. Upload the workbook (or use the sample) to continue.' } };
  }

  // Real uploaded rows (shared with the builder) when present; else the sample.
  const rows = state.rows && state.rows.length > 0 ? state.rows : config.sampleRows;

  const overrideRules: OverrideRule[] = [];
  for (const row of rows) {
    const cat = state.overrides[row.rowId];
    if (cat && cat !== '__skip__') {
      const opt = config.categoryOptions.find((o) => o.id === cat);
      overrideRules.push({ rowLabel: row.label, categoryId: cat, categoryLabel: opt?.label ?? cat });
    }
  }
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

  // Optional election (roulement): choose the elected amount within bounds.
  if (config.elect && state.elected == null) {
    const lo = core.bounds?.min ?? core.lineValues[config.elect.minKey] ?? 0;
    const hi = core.bounds?.max ?? core.lineValues[config.elect.maxKey] ?? 0;
    const mid = Math.round((lo + hi) / 2);
    return {
      detail: core.detail, done: false, activeStage: 3, needsReview,
      blocker: {
        kind: 'choice', choiceId: ELECT_CHOICE,
        message: `Choose the ${config.elect.label} — anywhere between the floor (${lo.toLocaleString()}) and JVM ceiling (${hi.toLocaleString()}). This sets how much gain is deferred.`,
        options: [
          { id: String(lo), label: `Floor ${lo.toLocaleString()} · defer all gain` },
          { id: String(mid), label: `Midpoint ${mid.toLocaleString()}` },
          { id: String(hi), label: `JVM ${hi.toLocaleString()} · realize gain` },
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
