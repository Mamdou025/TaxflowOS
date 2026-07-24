'use client';

// ─────────────────────────────────────────────────────────────────────────────
// createTemplateIntel — a GENERIC WorksheetIntel over any TemplateConfig.
//
// Every template-driven worksheet (FAPI, Roulement, and any future one) becomes
// fully answerable with ZERO per-worksheet code: this adapter runs the SAME
// runTemplateCore the sheet renders, then derives its line catalog, formulas,
// operand values, provenance, and trace from the resulting CoreResult + the
// config's calc rules.
//
// It handles BOTH rule shapes the engine produces:
//   • rules with `formulaExpression` (FAPI)  → parse identifiers from the expression
//   • rules with `operands`+`operation`     (Roulement) → use the operands list
//   • computeExtra `DerivedRow.formula` strings are the display formula for both
// so numbers + explanations match the worksheet regardless of how it computes.
// ─────────────────────────────────────────────────────────────────────────────

import { runTemplateCore, buildOverrideRules, type CoreResult, type DerivedRow, type TemplateConfig } from '@/shared/workflow-engine/runtime/workflow-runs';
import type {
  LineExplanation,
  OperandBreakdown,
  SearchResult,
  TraceNode,
  ValueTrace,
  WorksheetIntel,
  WorksheetSnapshot,
} from './types';

type FormulaRule = {
  resultKey: string;
  label: string;
  description: string;
  formulaExpression?: string;
  operands?: Array<string | number>;
  operation?: string;
};

type CatalogEntry = { code: string; key: string; label: string; kind: 'line' | 'summary'; isRate: boolean };

const fmt = (n: number) => n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtRate = (n: number) => n.toLocaleString('en-CA', { minimumFractionDigits: 4, maximumFractionDigits: 6 });
const isRateKey = (key: string, label: string) => /_RATE$|^FX/i.test(key) || /\brate\b|taux/i.test(label);

const RESERVED = new Set(['max', 'min', 'abs']);
function identifiers(expr: string): string[] {
  const found = expr.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) ?? [];
  const out: string[] = [];
  const seen = new Set<string>();
  for (const id of found) {
    if (RESERVED.has(id) || seen.has(id)) continue;
    seen.add(id);
    out.push(id);
  }
  return out;
}

export type TemplateIntelState = { rows?: TemplateConfig['sampleRows']; inputs?: Record<string, number>; overrides?: Record<string, string>; live?: boolean };

export function createTemplateIntel(config: TemplateConfig, state: TemplateIntelState = {}): WorksheetIntel {
  const rows = state.rows?.length ? state.rows : config.sampleRows;

  // Editable-input defaults merged with live values — resolves operands that are
  // user inputs (fxRate, pCoefficient, jvm_total, taux_inclusion, …).
  const inputs: Record<string, number> = {};
  for (const inp of config.editableInputs ?? []) inputs[inp.key] = inp.default;
  Object.assign(inputs, state.inputs ?? {});

  // Honor the shared category overrides (from runEditsAtom) so the assistant's
  // answers ABOUT the worksheet match what the sheet renders after a re-categorization.
  let core: CoreResult | null;
  try { core = runTemplateCore(config, { rows, overrides: buildOverrideRules(config, rows, state.overrides ?? {}), inputs }); } catch { core = null; }

  const rules: FormulaRule[] = [
    ...((config.linesRules as unknown as FormulaRule[]) ?? []),
    ...((config.summaryRules as unknown as FormulaRule[]) ?? []),
  ];
  const ruleByKey = (key: string) => rules.find((r) => r.resultKey === key);

  // Every derived row (works for both the rules path and computeExtra) — the
  // unified {key,label,value,formula-string} source for values + display formula.
  const derivedByKey = new Map<string, DerivedRow>();
  if (core) {
    for (const d of [...core.detail.lines, ...core.detail.summary]) derivedByKey.set(d.key, d);
  }

  const bucketMap: Record<string, number> = {};
  if (core) for (const b of core.detail.buckets) bucketMap[b.key] = b.value;
  const params = config.params ?? {};

  // Resolve any operand identifier to its current value. Precedence mirrors the
  // engine: computed results win over buckets, which win over inputs/params.
  function resolve(name: string): { value: number; source: string } | null {
    if (!core) return null;
    if (name in core.summaryValues) return { value: core.summaryValues[name], source: 'summary' };
    if (name in core.lineValues) return { value: core.lineValues[name], source: 'line' };
    if (name in bucketMap) return { value: bucketMap[name], source: 'classified' };
    if (name in inputs) return { value: inputs[name], source: 'input' };
    if (name in params) return { value: params[name], source: 'param' };
    return null;
  }

  // Which identifiers to break a rule down by: the expression's identifiers, else
  // the operands list (string operands only), else the display-formula's tokens.
  function tokensOf(rule: FormulaRule | undefined, displayFormula: string | null): string[] {
    if (rule?.formulaExpression) return identifiers(rule.formulaExpression);
    if (rule?.operands?.length) return rule.operands.filter((o): o is string => typeof o === 'string');
    return displayFormula ? identifiers(displayFormula) : [];
  }

  // ── Line catalog, derived from the run (no hand-authored per-sheet mapping) ──
  const catalog: CatalogEntry[] = [];
  const pushEntry = (key: string, label: string, kind: 'line' | 'summary') => {
    if (catalog.some((e) => e.key === key)) return;
    catalog.push({ code: key, key, label, kind, isRate: isRateKey(key, label) });
  };
  if (core) {
    for (const d of core.detail.lines) pushEntry(d.key, d.label, 'line');
    for (const d of core.detail.summary) {
      if (d.key.endsWith('_CAD')) continue; // shown as the CAD column, not a separate line
      pushEntry(d.key, d.label, isRateKey(d.key, d.label) ? 'line' : 'summary');
    }
  }

  const valueOf = (key: string) =>
    core ? (core.lineValues[key] ?? core.summaryValues[key] ?? derivedByKey.get(key)?.value ?? 0) : 0;

  function resolveLine(query: string): CatalogEntry | null {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    const norm = q.replace(/^line\s+|^ligne\s+/, '').trim();
    const strip = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    let hit = catalog.find((e) => e.code.toLowerCase() === norm || e.key.toLowerCase() === norm);
    if (hit) return hit;
    hit = catalog.find((e) => strip(e.code) === strip(norm) || strip(e.key) === strip(norm));
    if (hit) return hit;
    hit = catalog.find((e) => e.label.toLowerCase().includes(norm));
    if (hit) return hit;
    hit = catalog.find((e) => e.code.length > 1 && norm.includes(e.code.toLowerCase()));
    if (hit) return hit;
    const toks = norm.split(/\s+/).filter((t) => t.length > 2);
    let best: { e: CatalogEntry; score: number } | null = null;
    for (const e of catalog) {
      const lab = e.label.toLowerCase();
      const score = toks.reduce((s, t) => s + (lab.includes(t) ? 1 : 0), 0);
      if (score > 0 && (!best || score > best.score)) best = { e, score };
    }
    return best?.e ?? null;
  }

  const fmtVal = (v: number, isRate: boolean) => (isRate ? fmtRate(v) : fmt(v));

  // ── Interface implementation ───────────────────────────────────────────────
  function describe(): WorksheetSnapshot {
    if (!core) return { id: config.id, title: config.name, status: 'error', message: `${config.name} could not be computed right now.` };
    const fx = core.summaryValues.FX_RATE;
    const lines = catalog
      .filter((e) => e.kind === 'line')
      .map((e) => ({ code: e.code, label: e.label, value: fmtVal(valueOf(e.key), e.isRate), raw: valueOf(e.key), isRate: e.isRate || undefined }));
    const summary = catalog
      .filter((e) => e.kind === 'summary')
      .map((e) => {
        const v = valueOf(e.key);
        const cadRaw = core!.summaryValues[`${e.key}_CAD`];
        return { key: e.key, label: e.label, usd: fmt(v), cad: cadRaw != null ? fmt(cadRaw) : undefined };
      });
    return {
      id: config.id,
      title: config.name,
      status: core.status === 'error' ? 'error' : core.status,
      currency: config.currency,
      fxRate: fx != null ? fmtRate(fx) : undefined,
      source: { fileRows: rows.length, usingSample: !state.rows?.length },
      lines,
      summary,
      classification: {
        classifiedRows: core.detail.mapped.length,
        unmatchedRows: core.detail.unmatched.length,
        buckets: core.detail.buckets.map((b) => ({ key: b.key, value: fmt(b.value) })),
      },
      hint: 'These are the live on-screen numbers. For the exact formula, the operand values behind a line, or the source rows mapped into it, call explainWorksheetLine or whyWorksheetValue.',
    } as WorksheetSnapshot;
  }

  function explainLine(query: string): LineExplanation {
    const entry = resolveLine(query);
    if (!entry) return { found: false, message: `No line matches "${query}" on ${config.name}.`, availableLines: catalog.map((e) => `${e.code} — ${e.label}`) };
    if (!core) return { found: false, message: `${config.name} could not be computed right now.` };
    const rule = ruleByKey(entry.key);
    const derived = derivedByKey.get(entry.key);
    const raw = valueOf(entry.key);
    const expression = rule?.formulaExpression ?? rule?.description ?? derived?.formula ?? null;
    const displayFormula = rule?.description ?? derived?.formula ?? '(direct input — no derived formula)';

    const breakdown: OperandBreakdown[] = [];
    for (const tok of tokensOf(rule, expression)) {
      const r = resolve(tok);
      if (r) breakdown.push({ name: tok, value: r.value, display: fmt(r.value), source: r.source });
    }

    const out: LineExplanation = {
      found: true,
      id: config.id,
      code: entry.code,
      key: entry.key,
      label: entry.label,
      value: raw,
      display: fmtVal(raw, entry.isRate),
      unit: entry.isRate ? 'rate' : config.currency,
      formula: displayFormula,
      expression,
      operation: rule?.operation ?? null,
      breakdown,
    };
    const cadRaw = core.summaryValues[`${entry.key}_CAD`];
    if (cadRaw != null) out.cad = fmt(cadRaw);
    const prov = config.worksheetProvenance?.({ lineKey: entry.key, core });
    if (prov && prov.length) {
      out.contributingRows = prov;
      out.note = 'This line is produced by classifying source rows (the AI keyword mapper).';
    }
    return out;
  }

  function traceKey(key: string, depth: number, seen: Set<string>): TraceNode {
    const rule = ruleByKey(key);
    const derived = derivedByKey.get(key);
    const value = valueOf(key) || resolve(key)?.value || 0;
    const node: TraceNode = {
      key,
      label: derived?.label ?? rule?.label ?? key,
      value,
      display: fmt(value),
      formula: rule?.description ?? derived?.formula ?? null,
      operation: rule?.operation ?? null,
    };
    if (rule && depth > 0 && !seen.has(key)) {
      seen.add(key);
      const children: NonNullable<TraceNode['inputs']> = [];
      for (const tok of tokensOf(rule, node.formula)) {
        if (ruleByKey(tok)) {
          children.push(traceKey(tok, depth - 1, seen));
        } else {
          const r = resolve(tok);
          if (r) children.push({ name: tok, value: r.value, display: fmt(r.value), source: r.source });
        }
      }
      if (children.length) node.inputs = children;
    }
    return node;
  }

  function why(query: string): ValueTrace {
    const entry = resolveLine(query);
    if (!entry) return { found: false, message: `No line matches "${query}" on ${config.name}.` };
    if (!core) return { found: false, message: `${config.name} could not be computed right now.` };
    return { found: true, id: config.id, trace: traceKey(entry.key, 2, new Set()) };
  }

  function search(query: string): SearchResult {
    const q = query.trim().toLowerCase();
    if (!q) return { matches: [] };
    const toks = q.split(/\s+/).filter(Boolean);
    const score = (text: string) => toks.reduce((s, t) => s + (text.toLowerCase().includes(t) ? 1 : 0), 0);
    const matches = catalog
      .map((e) => {
        const rule = ruleByKey(e.key);
        const derived = derivedByKey.get(e.key);
        const formula = rule?.description ?? derived?.formula ?? null;
        const text = `${e.code} ${e.label} ${formula ?? ''} ${rule?.formulaExpression ?? ''}`;
        return { code: e.code, key: e.key, label: e.label, formula, score: score(text) };
      })
      .filter((m) => m.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map(({ score: _s, ...rest }) => rest);
    return { matches };
  }

  return { id: config.id, title: config.name, live: state.live ?? false, describe, explainLine, why, search };
}
