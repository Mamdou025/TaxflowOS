'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSetAtom, useAtom, useAtomValue } from 'jotai';
import { Check, Upload, FileUp, ShieldCheck, Loader2, ChevronDown, ExternalLink, X, GitBranch, SlidersHorizontal, AlertTriangle, Cloud, Play } from 'lucide-react';
import { runTemplateLoop, runTemplateCore, buildOverrideRules, initialRunState, resolveBlocker, type TemplateConfig, type RunState, type RunDetail, type SourceRow } from '@/shared/workflow-engine/runtime/workflow-runs';
import { parseUploadToRows } from '@/shared/workflow-engine/runtime/workflow-runs/parse-upload';
import { GoogleSourcePicker, type PickedSource } from '@/features/assistant/workspace/google-source-picker';
import { pushTrailAtom, activeRunAtom, setActiveCoworkerAtom, uploadedRowsAtom, runEditsAtom, setRunInputAtom, setRunOverrideAtom, setRunEditsAtom, EMPTY_RUN_EDITS } from '@/shared/stores/workspace-store';
import type { Agent } from '@/lib/agents';
import { coworkerForAgent, coworkerForWorkflow, WORKFLOW_ENGINE, WORKSPACE_ASSISTANT } from '@/lib/coworkers';
import { recordWorkItemAtom, workIdFor } from '@/lib/work-store';

// ── Palette ─────────────────────────────────────────────────────────────────────
// The run is themeable via CSS custom properties so the SAME component blends into
// two surfaces: the dark LibreChat chat thread (default) and the light neumorphic
// standalone `/run/*` page (`surface="light"`). Every token is `var(--cwp-*, <dark>)`
// so the DARK value is the fallback — components rendered outside a run-flow root
// (e.g. the pinned WorkflowElementCard, always on the dark chat) stay dark with no
// var scope. The light map (below) overrides the vars on the run-flow root only.
// Primary (filled) buttons invert per theme: light chip on dark, ink chip on light.
const INK = 'var(--cwp-ink, #ececec)', MUTED = 'var(--cwp-muted, #9a9a9a)', FAINT = 'var(--cwp-faint, #6f6f6f)';
const DIM = 'var(--cwp-dim, #5a5a5a)';                          // pending/disabled text
const LINE = 'var(--cwp-line, rgba(255,255,255,0.12))', HAIRLINE = 'var(--cwp-hairline, rgba(255,255,255,0.07))';
const SURFACE = 'var(--cwp-surface, rgba(255,255,255,0.03))';  // inset detail panels
const CARD = 'var(--cwp-card, #2f2f2f)';                         // ghost buttons / chips
const GROUND = 'var(--cwp-ground, #212121)';                    // chat bg — dot centers
const PRIMARY_BG = 'var(--cwp-primary-bg, #ececec)', PRIMARY_FG = 'var(--cwp-primary-fg, #1a1a1a)';
const LIVE = 'var(--cwp-live, #93c5fd)';                        // "live value" accent
const AMBER = 'var(--cwp-amber, #dab06c)', AMBER_TEXT = 'var(--cwp-amber-text, #f0d9ac)', AMBER_SOFT = 'var(--cwp-amber-soft, rgba(218,176,108,0.12))', AMBER_LINE = 'var(--cwp-amber-line, rgba(218,176,108,0.32))';
const DANGER = 'var(--cwp-danger, #f87171)';
const SPINE_DONE = 'var(--cwp-spine-done, rgba(236,236,236,0.18))', SPINE_AHEAD = 'var(--cwp-spine-ahead, rgba(236,236,236,0.09))';
const HOVER = 'var(--cwp-hover, rgba(255,255,255,0.04))';

// Light overrides for the standalone `/run/*` page — restore the original neumorphic look.
const LIGHT_VARS: Record<string, string> = {
  '--cwp-ink': '#18181b', '--cwp-muted': '#71717a', '--cwp-faint': '#a1a1aa', '--cwp-dim': '#c4c4cc',
  '--cwp-line': 'rgba(24,24,27,0.10)', '--cwp-hairline': 'rgba(24,24,27,0.07)',
  '--cwp-surface': '#fafafa', '--cwp-card': '#ffffff', '--cwp-ground': '#ffffff',
  '--cwp-primary-bg': '#18181b', '--cwp-primary-fg': '#ffffff', '--cwp-live': '#0369a1',
  '--cwp-amber': '#b45309', '--cwp-amber-text': '#92400e', '--cwp-amber-soft': 'rgba(217,119,6,0.08)', '--cwp-amber-line': 'rgba(217,119,6,0.30)',
  '--cwp-danger': '#b91c1c', '--cwp-spine-done': 'rgba(24,24,27,0.18)', '--cwp-spine-ahead': 'rgba(24,24,27,0.09)',
  '--cwp-hover': 'rgba(24,24,27,0.025)',
};
const num = (n: number) => n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// A RATE (FX / conversion factor) is not money — show it at full precision, never
// 2dp cents (which would display 1.3978 as "1.40"). Matches the engine's rate
// handling + the worksheet's fmtRate, so all surfaces show the same rate.
const numRate = (n: number) => n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
const isRateKey = (key: string) => /_RATE$|^FX/i.test(key);
const fig = (key: string, value: number) => (isRateKey(key) ? numRate(value) : num(value));

// The ONLY color in the run — each timeline dot is toned by what the step means. Pastel + discreet.
const TONES = { source: '#7fb2d9', ai: '#a892d6', engine: '#7cc3a6', checkpoint: '#dab06c', step: '#9ca3af' } as const;
function hexA(hex: string, a: number) {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}
/** Classify a step so its dot gets a meaning: source · AI suggestion · engine · checkpoint. */
function stepMeta(step: { label: string; sub?: string }): { tone: string; kind: string } {
  const t = `${step.label} ${step.sub ?? ''}`.toLowerCase();
  if (/classif|categor|\bmap|suggest/.test(t)) return { tone: TONES.ai, kind: 'AI suggestion' };
  if (/comput|calcul|engine|rollup|aggregat|deriv/.test(t)) return { tone: TONES.engine, kind: 'Engine calculation' };
  if (/approv|sign[- ]?off|elect|decision/.test(t)) return { tone: TONES.checkpoint, kind: 'Checkpoint' };
  if (/collect|source|upload|document|trial|balance/.test(t)) return { tone: TONES.source, kind: 'Source' };
  return { tone: TONES.step, kind: 'Step' };
}

function KV({ l, sub, v }: { l: React.ReactNode; sub?: React.ReactNode; v: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '3px 0', alignItems: 'baseline' }}>
      <span style={{ minWidth: 0 }}>
        <span style={{ fontSize: 12, color: INK }}>{l}</span>
        {sub && <span style={{ display: 'block', fontSize: 10.5, color: FAINT, fontFamily: 'ui-monospace, monospace' }}>{sub}</span>}
      </span>
      <span style={{ fontSize: 12, color: INK, fontWeight: 600, fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' }}>{v}</span>
    </div>
  );
}

function TimelineDot({ status, tone }: { status: 'done' | 'active' | 'pending'; tone: string }) {
  const base = { width: 14, height: 14, borderRadius: '50%', boxSizing: 'border-box' as const, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', transition: 'background 200ms' };
  if (status === 'done') return <span style={{ ...base, background: tone }}><Check className="cwp-pop" size={9} color="#fff" strokeWidth={3} /></span>;
  if (status === 'active') return <span className="cwp-halo" style={{ ...base, border: `2px solid ${tone}`, background: GROUND, ['--tone' as string]: tone }}><Loader2 size={8} color={tone} className="cwp-spin" /></span>;
  return <span style={{ ...base, width: 13, height: 13, border: `2px solid ${hexA(tone, 0.35)}`, background: GROUND }} />;
}

const detailWrap = (children: React.ReactNode) => <div style={{ margin: '2px 0 10px 28px', padding: '12px 14px', background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 10 }}>{children}</div>;
const hdr = (t: string) => <div style={{ fontSize: 10.5, fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.04em', color: FAINT, marginBottom: 6 }}>{t}</div>;
const smallBtnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 10, marginRight: 8, fontSize: 11.5, fontWeight: 550, color: INK, background: CARD, border: `1px solid ${LINE}`, borderRadius: 7, padding: '5px 10px', cursor: 'pointer' };
const openTab = (resultPage?: string, onOpenPage?: (k: string) => void) => resultPage && onOpenPage && <button onClick={() => onOpenPage(resultPage)} style={smallBtnStyle}><ExternalLink size={11} /> Open worksheet in a tab</button>;
// ── Inline "where it comes from" — a summary of a block + its lineage, no page load ──
type SnapBlock = { id: string; label?: string; family?: string; subtype?: string; description?: string; config?: Record<string, unknown> };
type SnapEdge = { sourceBlockId?: string; targetBlockId?: string; sourceOutputRole?: string; targetInputRole?: string; bindingLabel?: string; reason?: string };
export type PeekSnapshot = { blocks?: SnapBlock[]; edges?: SnapEdge[] };

// config keys that are plumbing, not worth showing in a human summary
const INTERNAL_CFG = new Set(['toolId', 'sourceKind', 'sourceStatus', 'sourceVersion', 'outputs', 'inputs', 'rulebookRef', 'owner', 'blockFamily', 'catalogId', 'sourceLocator']);
function fmtCfg(v: unknown): string | null {
  if (v == null) return null;
  if (typeof v === 'boolean') return v ? 'yes' : 'no';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'string') { const s = v.trim(); if (!s) return null; return s.length > 64 ? `${s.slice(0, 61)}…` : s; }
  return null; // skip objects/arrays in the summary
}

function blockLineage(snapshot: PeekSnapshot | undefined, blockId: string) {
  const blocks = snapshot?.blocks ?? [];
  const edges = snapshot?.edges ?? [];
  const byId = (id?: string) => blocks.find((b) => b.id === id);
  const block = byId(blockId);
  const upstream = edges.filter((e) => e.targetBlockId === blockId).map((e) => ({ b: byId(e.sourceBlockId), reason: e.reason, role: e.sourceOutputRole }));
  const downstream = edges.filter((e) => e.sourceBlockId === blockId).map((e) => ({ b: byId(e.targetBlockId), reason: e.reason, role: e.targetInputRole }));
  return { block, upstream, downstream };
}

function LineageRow({ arrow, name, sub }: { arrow: string; name: string; sub?: string }) {
  return (
    <div style={{ display: 'flex', gap: 7, padding: '3px 0', alignItems: 'baseline' }}>
      <span style={{ color: FAINT, fontSize: 11, flexShrink: 0 }}>{arrow}</span>
      <span style={{ minWidth: 0 }}>
        <span style={{ fontSize: 11.5, color: INK }}>{name}</span>
        {sub && <span style={{ display: 'block', fontSize: 10, color: FAINT, lineHeight: 1.35 }}>{sub}</span>}
      </span>
    </div>
  );
}

function BlockPeek({ snapshot, blockId, onOpenBuilder, liveConfig }: { snapshot: PeekSnapshot | undefined; blockId: string; onOpenBuilder?: (b: string) => void; liveConfig?: Record<string, unknown> }) {
  const { block, upstream, downstream } = blockLineage(snapshot, blockId);
  if (!block) return null;
  // Merge the run's current values (edited inputs / live-fetched rate) over the template config.
  const baseConfig = block.config ?? {};
  const mergedConfig: Record<string, unknown> = { ...baseConfig, ...(liveConfig ?? {}) };
  const isLive = (k: string) => liveConfig != null && k in liveConfig && fmtCfg(liveConfig[k]) !== fmtCfg(baseConfig[k]);
  const cfg = Object.entries(mergedConfig).filter(([k, v]) => !INTERNAL_CFG.has(k) && fmtCfg(v) !== null).slice(0, 6);
  return (
    <div style={{ margin: '7px 0 2px', padding: '10px 12px', background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 9 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
        <span style={{ fontSize: 12.5, fontWeight: 650, color: INK }}>{block.label ?? block.id}</span>
        {block.subtype && <span style={{ fontSize: 9.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', color: MUTED, background: 'rgba(255,255,255,0.06)', border: `1px solid ${LINE}`, borderRadius: 5, padding: '1px 5px' }}>{block.subtype}</span>}
      </div>
      {block.description && <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.45, marginBottom: cfg.length ? 7 : 4 }}>{block.description}</div>}
      {cfg.length > 0 && (
        <div style={{ marginBottom: 7 }}>
          {cfg.map(([k, v]) => <KV key={k} l={<span style={{ fontSize: 11 }}>{k}{isLive(k) && <span style={{ marginLeft: 5, fontSize: 9, fontWeight: 600, color: LIVE, textTransform: 'uppercase', letterSpacing: '0.03em' }}>· live</span>}</span>} v={<span style={{ fontSize: 11, color: isLive(k) ? LIVE : INK }}>{fmtCfg(v)}</span>} />)}
        </div>
      )}
      {upstream.length > 0 && (
        <div style={{ marginBottom: downstream.length ? 6 : 0 }}>
          <div style={{ fontSize: 9.5, fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.04em', color: FAINT, marginBottom: 2 }}>Fed by</div>
          {upstream.map((u, i) => <LineageRow key={i} arrow="←" name={u.b?.label ?? u.b?.id ?? 'source'} sub={u.reason} />)}
        </div>
      )}
      {downstream.length > 0 && (
        <div>
          <div style={{ fontSize: 9.5, fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.04em', color: FAINT, marginBottom: 2 }}>Feeds</div>
          {downstream.map((d, i) => <LineageRow key={i} arrow="→" name={d.b?.label ?? d.b?.id ?? 'target'} sub={d.reason} />)}
        </div>
      )}
      {onOpenBuilder && <button onClick={() => onOpenBuilder(blockId)} style={{ ...smallBtnStyle, marginTop: 8, marginRight: 0 }}><GitBranch size={11} /> Open the full block in the builder</button>}
    </div>
  );
}

// Toggle button that reveals BlockPeek inline. `variant`: 'button' (stage) | 'link' (inline text).
function WhereFrom({ snapshot, blockId, onOpenBuilder, label, variant = 'button', liveConfigByBlock }: { snapshot: PeekSnapshot | undefined; blockId?: string; onOpenBuilder?: (b: string) => void; label: string; variant?: 'button' | 'link'; liveConfigByBlock?: Record<string, Record<string, unknown>> }) {
  const [open, setOpen] = useState(false);
  if (!blockId) return null;
  const toggle = () => setOpen((o) => !o);
  return (
    <>
      {variant === 'link'
        ? <button onClick={toggle} style={{ background: 'none', border: 'none', padding: 0, color: MUTED, fontSize: 10.5, cursor: 'pointer', textDecoration: 'underline' }}>{label}{open ? ' ▴' : ' →'}</button>
        : <button onClick={toggle} style={smallBtnStyle}><GitBranch size={11} /> {label}{open ? ' ▴' : ''}</button>}
      {open && <BlockPeek snapshot={snapshot} blockId={blockId} onOpenBuilder={onOpenBuilder} liveConfig={liveConfigByBlock?.[blockId]} />}
    </>
  );
}

// The AI-suggested classification step — reviewable + re-mappable per row.
function ClassifyReview({ detail, config, overrides, onOverride, onOpenBuilder, snapshot, liveConfigByBlock }: {
  detail: RunDetail; config: TemplateConfig; overrides: Record<string, string>; onOverride: (rowId: string, categoryId: string) => void; onOpenBuilder?: (blockId: string) => void; snapshot?: PeekSnapshot; liveConfigByBlock?: Record<string, Record<string, unknown>>;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  // Unmatched rows first — they're the ones needing a decision (and the target of
  // the "Review N" banner); matched rows follow for confirmation/override.
  const rows = [
    ...detail.unmatched.map((u) => ({ rowId: u.rowId, label: u.label, amount: u.amount, category: 'Unclassified', confidence: 0, unmatched: true })),
    ...detail.mapped.map((m) => ({ rowId: m.rowId, label: m.label, amount: m.amount, category: m.category, confidence: m.confidence, unmatched: false })),
  ];
  const opts = config.categoryOptions.filter((o) => o.id !== '__skip__');
  return detailWrap(<>
    <div style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.5, marginBottom: 8 }}>The keyword mapper <b>suggested</b> these classifications. Click any category to override the AI — the workflow re-runs with your decision.</div>
    {rows.map((r) => {
      const overridden = r.rowId in overrides;
      const isEd = editing === r.rowId;
      return (
        <div key={r.rowId} style={{ padding: '7px 0', borderTop: `1px solid ${HAIRLINE}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, color: INK }}>{r.label}</div>
              <div style={{ fontSize: 10.5, color: FAINT, fontVariantNumeric: 'tabular-nums' }}>{num(r.amount)}</div>
            </div>
            <button onClick={() => setEditing(isEd ? null : r.rowId)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 550, padding: '4px 9px', borderRadius: 999, cursor: 'pointer', color: r.unmatched ? AMBER_TEXT : INK, background: r.unmatched ? AMBER_SOFT : CARD, border: `1px solid ${r.unmatched ? AMBER_LINE : LINE}` }}>
              {r.category}{!r.unmatched && r.confidence ? ` · ${Math.round(r.confidence * 100)}%` : ''}{overridden ? ' ✎' : ''}
              <ChevronDown size={11} style={{ transform: isEd ? 'rotate(180deg)' : 'none' }} />
            </button>
          </div>
          {isEd && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8, paddingLeft: 2 }}>
              {opts.map((o) => <button key={o.id} onClick={() => { onOverride(r.rowId, o.id); setEditing(null); }} style={{ fontSize: 11.5, fontWeight: 500, padding: '5px 10px', borderRadius: 7, background: o.label === r.category ? PRIMARY_BG : CARD, color: o.label === r.category ? PRIMARY_FG : INK, border: `1px solid ${LINE}`, cursor: 'pointer' }}>{o.label}</button>)}
              {r.unmatched && <button onClick={() => { onOverride(r.rowId, '__skip__'); setEditing(null); }} style={{ fontSize: 11.5, fontWeight: 500, padding: '5px 10px', borderRadius: 7, background: CARD, color: MUTED, border: `1px solid ${LINE}`, cursor: 'pointer' }}>Leave unmatched</button>}
            </div>
          )}
        </div>
      );
    })}
    <div style={{ marginTop: 10 }}><WhereFrom snapshot={snapshot} blockId={config.mapperBlockId} onOpenBuilder={onOpenBuilder} label="Where these classifications come from" liveConfigByBlock={liveConfigByBlock} /></div>
  </>);
}

function StageDetail({ idx, detail, config, overrides, resultPage, onOverride, onOpenPage, onOpenBuilder, snapshot, liveConfigByBlock }: {
  idx: number; detail: RunDetail | null; config: TemplateConfig; overrides: Record<string, string>;
  resultPage?: string; onOverride: (rowId: string, categoryId: string) => void; onOpenPage?: (pageKey: string) => void; onOpenBuilder?: (blockId: string) => void; snapshot?: PeekSnapshot; liveConfigByBlock?: Record<string, Record<string, unknown>>;
}) {
  const openBtn = openTab(resultPage, onOpenPage);
  const where = (blockId: string | undefined, label: string) => <div style={{ marginTop: 10 }}><WhereFrom snapshot={snapshot} blockId={blockId} onOpenBuilder={onOpenBuilder} label={label} liveConfigByBlock={liveConfigByBlock} /></div>;
  if (!detail) return detailWrap(<div style={{ fontSize: 11.5, color: FAINT }}>Nothing to review yet — this step runs once the source document is provided.</div>);
  if (idx === 0) return detailWrap(<>{hdr(`Source document · ${detail.sourceRows.length} rows`)}{detail.sourceRows.map((r) => <KV key={r.rowId} l={r.label} sub={r.account ? `acct ${r.account}` : undefined} v={`${num(r.amount)} ${r.currency ?? ''}`} />)}{openBtn}{where(config.sourceBlockId, 'Where this source comes from')}</>);
  if (idx === 1) return <ClassifyReview detail={detail} config={config} overrides={overrides} onOverride={onOverride} onOpenBuilder={onOpenBuilder} snapshot={snapshot} liveConfigByBlock={liveConfigByBlock} />;
  if (idx === 2) return detailWrap(<>{hdr('Deterministic — aggregated buckets')}{detail.buckets.map((b) => <KV key={b.key} l={b.key} v={num(b.value)} />)}{where(config.rollupBlockId, 'Where this aggregation comes from')}{hdr2('Computed lines (formula → value)')}{detail.lines.filter((l) => l.value !== 0).map((l) => <KV key={l.key} l={l.label} sub={l.formula} v={fig(l.key, l.value)} />)}{openBtn}{where(config.linesBlockId, 'Where this calculation comes from')}</>);
  if (idx === 3) return detailWrap(<>{hdr('Result — every figure traced')}{detail.summary.map((s) => <KV key={s.key} l={s.label} sub={s.formula} v={fig(s.key, s.value)} />)}{openBtn}{where(config.summaryBlockId, 'Where this result comes from')}</>);
  return null;
}
const hdr2 = (t: string) => <div style={{ fontSize: 10.5, fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.04em', color: FAINT, margin: '10px 0 6px' }}>{t}</div>;

function ghostBtn(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return <button {...props} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 500, padding: '7px 13px', borderRadius: 8, background: CARD, color: INK, border: `1px solid ${LINE}`, cursor: 'pointer', ...props.style }} />;
}

// ── A summoned workflow element (a source document / an output) in the chat ────
export function WorkflowElementCard({ config, element, onOpenPage, onOpenBuilder }: {
  config: TemplateConfig;
  element: 'source' | 'output';
  onOpenPage?: (pageKey: string) => void;
  onOpenBuilder?: (blockId: string) => void;
}) {
  const uploaded = useAtomValue(uploadedRowsAtom);
  const allEdits = useAtomValue(runEditsAtom);
  const isSource = element === 'source';
  // Use the SAME live data the run + worksheet use (uploaded rows + the shared run
  // edits), NOT the static sample config — so this summoned card can never disagree
  // with the worksheet/run for the same workflow. Mirrors fapi-worksheet's compute.
  const sourceRows = uploaded[config.id]?.rows?.length ? uploaded[config.id]!.rows : config.sampleRows;
  const outcome = useMemo(() => {
    if (element !== 'output') return null;
    const edits = allEdits[config.id] ?? EMPTY_RUN_EDITS;
    const defaults = Object.fromEntries((config.editableInputs ?? []).filter((i) => !i.classificationFed).map((i) => [i.key, i.default]));
    const inputs = { ...defaults, ...edits.inputs };
    try {
      const core = runTemplateCore(config, { rows: sourceRows, overrides: buildOverrideRules(config, sourceRows, edits.overrides), inputs });
      const value = core.summaryValues[config.headlineKey] ?? core.lineValues[config.headlineKey] ?? 0;
      const label = config.summaryRules.find((r) => r.resultKey === config.headlineKey)?.label ?? config.headlineKey;
      return { detail: core.detail, headline: { label, value } };
    } catch { return null; }
  }, [config, element, sourceRows, allEdits]);
  const blockId = isSource ? config.sourceBlockId : config.summaryBlockId;
  return (
    <div style={{ maxWidth: 460, background: CARD, border: `1px solid ${LINE}`, borderRadius: 12, overflow: 'hidden', margin: '2px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', borderBottom: `1px solid ${HAIRLINE}`, background: SURFACE }}>
        {isSource ? <FileUp size={13} style={{ color: MUTED }} /> : <GitBranch size={13} style={{ color: MUTED }} />}
        <span style={{ fontSize: 10.5, fontWeight: 650, letterSpacing: '0.03em', textTransform: 'uppercase', color: FAINT }}>
          {config.name} · {isSource ? 'Source document' : 'Output'}
        </span>
        <span style={{ marginLeft: 'auto', fontSize: 10.5, color: FAINT }}>from workflow builder</span>
      </div>
      <div style={{ padding: '10px 13px' }}>
        {isSource ? (
          <>
            <div style={{ fontSize: 12.5, fontWeight: 550, color: INK, marginBottom: 6 }}>{config.documentLabel}</div>
            {sourceRows.map((r) => <KV key={r.rowId} l={r.label} sub={r.account ? `acct ${r.account}` : undefined} v={`${num(r.amount)} ${r.currency ?? ''}`} />)}
          </>
        ) : outcome?.detail ? (
          <>
            {outcome.detail.summary.map((s) => <KV key={s.key} l={s.label} sub={s.formula} v={isRateKey(s.key) ? numRate(s.value) : `${num(s.value)} ${config.currency}`} />)}
            {outcome.headline && <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: `1px solid ${HAIRLINE}` }}><span style={{ fontSize: 12, color: MUTED }}>{outcome.headline.label}</span><span style={{ fontSize: 15, fontWeight: 650, color: INK }}>{num(outcome.headline.value)} {config.currency}</span></div>}
          </>
        ) : <div style={{ fontSize: 12, color: FAINT }}>No output yet.</div>}
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          {!isSource && onOpenPage && <button onClick={() => onOpenPage('fapi')} style={btnGhost}><ExternalLink size={11} /> Open worksheet</button>}
          {onOpenBuilder && <button onClick={() => onOpenBuilder(blockId)} style={btnGhost}><GitBranch size={11} /> Open in builder</button>}
        </div>
      </div>
    </div>
  );
}
const btnGhost: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 550, color: INK, background: CARD, border: `1px solid ${LINE}`, borderRadius: 7, padding: '5px 10px', cursor: 'pointer' };

// ── Editable inputs (change a rate / assumption → the run recomputes) ──────────
function InputRow({ label, hint, value, onCommit, blockId, onOpenBuilder, live, snapshot, liveConfigByBlock }: { label: string; hint?: string; value: number; onCommit: (v: number) => void; blockId?: string; onOpenBuilder?: (b: string) => void; live?: { from: string; to: string; year: number }; snapshot?: PeekSnapshot; liveConfigByBlock?: Record<string, Record<string, unknown>> }) {
  const [draft, setDraft] = useState(String(value));
  const [fetching, setFetching] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  useEffect(() => { setDraft(String(value)); }, [value]);
  const commit = () => { const n = Number(draft.replace(/,/g, '')); if (Number.isFinite(n) && n !== value) onCommit(n); };
  const fetchLive = async () => {
    if (!live) return;
    setFetching(true); setNote(null);
    try {
      const res = await fetch(`/api/fx-rate?from=${live.from}&to=${live.to}&year=${live.year}`);
      const data = await res.json();
      if (data?.ok && Number.isFinite(data.rate)) {
        const rate = Math.round(data.rate * 10000) / 10000;
        onCommit(rate);
        setNote(`Live: ${rate} · Bank of Canada ${data.seriesName ?? `FX${live.from}${live.to}`} · ${live.year} avg`);
      } else {
        setNote(`Live fetch unavailable — keeping ${value}${data?.reason ? ` (${data.reason})` : ''}`);
      }
    } catch {
      setNote(`Live fetch failed — keeping ${value}`);
    } finally {
      setFetching(false);
    }
  };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, color: INK }}>{label}</div>
        <div style={{ fontSize: 10.5, color: FAINT }}>
          {hint}
          {blockId && <> · <WhereFrom snapshot={snapshot} blockId={blockId} onOpenBuilder={onOpenBuilder} label="where it comes from" variant="link" liveConfigByBlock={liveConfigByBlock} /></>}
          {live && <> · <button onClick={fetchLive} disabled={fetching} style={{ background: 'none', border: 'none', padding: 0, color: fetching ? FAINT : LIVE, fontSize: 10.5, cursor: fetching ? 'default' : 'pointer', textDecoration: 'underline' }}>{fetching ? 'fetching…' : '↻ fetch live rate'}</button></>}
          {note && <div style={{ marginTop: 2, color: MUTED }}>{note}</div>}
        </div>
      </div>
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
        onFocus={(e) => e.currentTarget.select()}
        inputMode="decimal"
        style={{ width: 110, textAlign: 'right', fontSize: 12.5, fontVariantNumeric: 'tabular-nums', color: INK, background: GROUND, border: `1px solid ${LINE}`, borderRadius: 7, padding: '5px 9px', outline: 'none' }}
      />
    </div>
  );
}

function EditableInputs({ config, inputs, onCommit, onOpenBuilder, snapshot, liveConfigByBlock }: { config: TemplateConfig; inputs: Record<string, number>; onCommit: (key: string, value: number) => void; onOpenBuilder?: (blockId: string) => void; snapshot?: PeekSnapshot; liveConfigByBlock?: Record<string, Record<string, unknown>> }) {
  if (!config.editableInputs?.length) return null;
  return (
    <div style={{ margin: '10px 0 2px', padding: '11px 14px', background: SURFACE, border: `1px solid ${HAIRLINE}`, borderRadius: 10 }}>
      <div style={{ fontSize: 10.5, fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.04em', color: FAINT, marginBottom: 9, display: 'flex', alignItems: 'center', gap: 5 }}><SlidersHorizontal size={12} /> Inputs — edit any and the workflow recomputes</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {config.editableInputs.map((inp) => (
          <InputRow key={inp.key} label={inp.label} hint={inp.hint} value={inputs[inp.key] ?? inp.default} onCommit={(v) => onCommit(inp.key, v)} blockId={inp.block?.blockId} onOpenBuilder={onOpenBuilder} snapshot={snapshot} liveConfigByBlock={liveConfigByBlock} live={inp.key === 'fxRate' ? { from: config.currency ?? 'USD', to: 'CAD', year: 2025 } : undefined} />
        ))}
      </div>
    </div>
  );
}

// ── Offer-to-run card — the assistant PROPOSES a workflow; the run starts only
// when the user clicks Start. Renders on the dark thread (dark-token fallbacks).
export function RunProposalCard({ config, agent, onStart }: { config: TemplateConfig; agent?: Agent; onStart: () => void }) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return <div style={{ fontSize: 12.5, color: MUTED, padding: '4px 0' }}>Okay — I won’t start it yet. Say the word when you’re ready.</div>;
  return (
    <div style={{ maxWidth: 470, background: SURFACE, border: `1px solid ${LINE}`, borderRadius: 14, padding: '14px 15px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 10 }}>
        <span style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 9, background: hexA(TONES.ai, 0.16), flexShrink: 0 }}><Play size={13} style={{ color: INK }} /></span>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 650, color: INK }}>Run {config.name}</div>
          <div style={{ fontSize: 11, color: FAINT }}>{agent ? `${agent.name} · ${agent.role}` : 'Workflow'}</div>
        </div>
      </div>
      <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5, marginBottom: 12 }}>
        I’ll need the <b style={{ color: INK, fontWeight: 600 }}>{config.documentLabel}</b>, then walk these steps and stop for your approval:
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 14 }}>
        {config.steps.map((s, i) => {
          const meta = stepMeta(s);
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: meta.tone, flexShrink: 0 }} />
              <span style={{ fontSize: 12, color: INK }}>{s.label}</span>
              <span style={{ fontSize: 9, fontWeight: 650, letterSpacing: '0.05em', textTransform: 'uppercase', color: MUTED, border: `1px solid ${HAIRLINE}`, borderRadius: 5, padding: '1px 5px', whiteSpace: 'nowrap' }}>{meta.kind}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={onStart} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 600, padding: '8px 15px', borderRadius: 8, background: PRIMARY_BG, color: PRIMARY_FG, border: 'none', cursor: 'pointer' }}><Play size={13} /> Start {config.name} run</button>
        <button onClick={() => setDismissed(true)} style={{ fontSize: 12.5, fontWeight: 500, padding: '8px 13px', borderRadius: 8, background: 'transparent', color: MUTED, border: `1px solid ${LINE}`, cursor: 'pointer' }}>Not now</button>
      </div>
    </div>
  );
}

// ── Generic, inspectable run flow — works for any TemplateConfig ────────────────
export function WorkflowRunFlow({ config, onComplete, agent, onOpenPage, onOpenBuilder, onStop, surface = 'dark' }: {
  config: TemplateConfig;
  onComplete: (summary: string) => void;
  agent?: Agent;
  onOpenPage?: (pageKey: string, anchor?: string) => void;
  onOpenBuilder?: (blockId: string) => void;
  onStop?: () => void;
  // 'dark' (default) blends into the chat thread; 'light' restores the neumorphic
  // look for the standalone /run/* page. Only swaps the CSS-var palette.
  surface?: 'dark' | 'light';
}) {
  // Flow gates (upload / elect / approve) + the working rows stay component-local.
  // The run's two OTHER decision surfaces — edited inputs and category overrides —
  // live in the SHARED runEditsAtom (keyed by workflow id) so the worksheet computes
  // on the exact same values, and an edit in either surface flows to the other.
  const [flow, setFlow] = useState<{ uploaded: boolean; elected: number | null; approved: boolean; rows?: SourceRow[] }>(
    () => { const s = initialRunState(); return { uploaded: s.uploaded, elected: s.elected, approved: s.approved, rows: s.rows }; }
  );
  const edits = useAtomValue(runEditsAtom)[config.id] ?? EMPTY_RUN_EDITS;
  const setRunInput = useSetAtom(setRunInputAtom);
  const setRunOverride = useSetAtom(setRunOverrideAtom);
  const setRunEdits = useSetAtom(setRunEditsAtom);
  // Recompose the full RunState the engine + all existing reads below expect.
  const state: RunState = useMemo(
    () => ({ uploaded: flow.uploaded, elected: flow.elected, approved: flow.approved, rows: flow.rows, inputs: edits.inputs, overrides: edits.overrides }),
    [flow, edits]
  );
  const [expanded, setExpanded] = useState<number | null>(null);
  const classifyStepRef = useRef<HTMLDivElement | null>(null);
  const pushTrail = useSetAtom(pushTrailAtom);

  // "Review N unmatched" (the amber banner, rendered far below the steps) opens the
  // classify step AND scrolls it into view — otherwise the step expands off-screen
  // above the button and it reads as "nothing happened". Double rAF so the expanded
  // content is committed before we measure/scroll.
  const reviewUnmatched = () => {
    setExpanded(1);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => classifyStepRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' })),
    );
  };
  const setActiveRun = useSetAtom(activeRunAtom);
  const setActiveCoworker = useSetAtom(setActiveCoworkerAtom);
  const recordWork = useSetAtom(recordWorkItemAtom);
  const [uploadedRows, setUploadedRows] = useAtom(uploadedRowsAtom);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const [showGoogle, setShowGoogle] = useState(false);
  const [origin, setOrigin] = useState<'upload' | 'drive' | 'gmail'>('upload');
  const doneRef = useRef(false);
  const fileName = useRef<string | null>(null);

  // One-time intro: the step timeline "draws" (staggered CSS reveal), then the
  // interaction panel (upload / approve / result) fades in AFTER — so the run reads
  // as "here's the plan, now let's work through it" instead of everything at once.
  // No re-run guard ref here: under React Strict Mode the setup/cleanup/setup cycle
  // would clear the first timer and skip the second, leaving the panel hidden — the
  // stable dep list already keeps this to one schedule per mount.
  const [introReady, setIntroReady] = useState(false);
  useEffect(() => {
    const reduce = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setIntroReady(true); return; }
    const t = setTimeout(() => setIntroReady(true), config.steps.length * 70 + 260);
    return () => clearTimeout(t);
  }, [config.steps.length]);

  // The shared store is the SINGLE source of truth for the rows this run computes
  // on — exactly what the worksheet reads. Read it LIVE (not a one-time hydration)
  // so a workbook imported ANYWHERE — the chat's own upload, the builder, or the
  // worksheet's Import button — is reflected here immediately, keeping the run and
  // the worksheet on identical numbers. When the store has rows the upload step is
  // already satisfied (the document exists), so the run proceeds on them; when it's
  // empty the run falls back to the sample (same fallback the worksheet uses).
  const storedSource = uploadedRows[config.id];
  const storeRows = storedSource?.rows;
  useEffect(() => { if (storedSource?.fileName) fileName.current = storedSource.fileName; }, [storedSource?.fileName]);

  // A cached workbook (from a prior run / the worksheet / the builder) supplies the
  // DATA, but must NOT silently satisfy the upload gate — otherwise a fresh run
  // skips straight past "provide your document" to the computed figures. So we only
  // fold in the store rows once the user has actually started THIS run (state.uploaded),
  // e.g. by picking "Use loaded workbook" in the upload step. A brand-new run always
  // asks first; continuity is one click, not automatic.
  const effectiveState = useMemo(
    () => (state.uploaded && !state.rows && storeRows && storeRows.length ? { ...state, rows: storeRows } : state),
    [state, storeRows]
  );
  const outcome = useMemo(() => { try { return runTemplateLoop(config, effectiveState); } catch { return null; } }, [config, effectiveState]);
  // Full workflow snapshot (blocks + edges) — powers the inline "where it comes from" peek without a page load.
  const snapshot = useMemo(() => { try { return config.buildSnapshot() as unknown as PeekSnapshot; } catch { return undefined; } }, [config]);
  // Current run values mapped to their target block/config key, so the peek shows the LIVE value (edited / fetched), not just the template default.
  const liveConfigByBlock = useMemo(() => {
    const map: Record<string, Record<string, unknown>> = {};
    for (const inp of config.editableInputs ?? []) {
      if (inp.block?.blockId && inp.block?.configKey) {
        (map[inp.block.blockId] ??= {})[inp.block.configKey] = state.inputs[inp.key] ?? inp.default;
      }
    }
    return map;
  }, [config, state.inputs]);
  const blocker = outcome?.blocker;
  const done = !!outcome?.done;
  const activeIdx = outcome?.activeStage ?? 0;
  const detail = outcome?.detail ?? null;
  const cur = config.currency;
  const hasCached = !!(storeRows && storeRows.length); // a workbook is already loaded for this workflow

  // ── Live sub-status on the active step ────────────────────────────────────────
  // The engine is synchronous, so we don't fake "computing…"; instead the active
  // step narrates what it's waiting on (upload / categorize / elect / approve) or,
  // once the run is done, shows the traced result. This is what makes the timeline
  // read as the assistant working THROUGH the steps rather than a static checklist.
  const liveSub = (i: number): string | null => {
    if (i !== activeIdx || done) return null;
    if (!blocker) return 'Working…';
    if (blocker.kind === 'upload') return `Waiting for the ${config.documentLabel}`;
    if (blocker.kind === 'approval') return 'Ready for your approval';
    if (blocker.kind === 'choice') return blocker.choiceId === '__elect__' ? 'Waiting for you to elect an amount' : 'Waiting for your decision';
    return 'Working…';
  };

  useEffect(() => {
    if (done && outcome?.summaryText && !doneRef.current) {
      doneRef.current = true;
      pushTrail({
        text: outcome.summaryText,
        tone: 'calculation',
        actor: { kind: WORKFLOW_ENGINE.kind, id: WORKFLOW_ENGINE.id, name: WORKFLOW_ENGINE.name },
      });
      onComplete(outcome.summaryText);
    }
  }, [done, outcome, onComplete, pushTrail]);

  // Compact, LLM-facing snapshot of the run's REAL figures — published so the
  // assistant can answer questions and generate UI from the actual numbers (not
  // just step/phase). Undefined until a source is loaded (no detail yet).
  const runData = useMemo(() => {
    if (!detail) return undefined;
    const byCat = new Map<string, { amount: number; rowCount: number }>();
    for (const m of detail.mapped) {
      const e = byCat.get(m.category) ?? { amount: 0, rowCount: 0 };
      e.amount += m.amount; e.rowCount += 1; byCat.set(m.category, e);
    }
    const categories = [...byCat.entries()]
      .map(([category, v]) => ({ category, amount: Math.round(v.amount), rowCount: v.rowCount }))
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount));
    const topRows = [...detail.mapped]
      .sort((a, b) => Math.abs(b.amount) - Math.abs(a.amount))
      .slice(0, 8)
      .map((m) => ({ label: m.label, amount: Math.round(m.amount), category: m.category }));
    return {
      fileName: fileName.current ?? undefined,
      currency: config.currency,
      sourceRowCount: detail.sourceRows.length,
      categories,
      // Keep the engine's real precision — money is already 2dp and rates are full
      // precision, so DON'T Math.round here (that turned FX_RATE into "1" and dropped
      // cents, making the AI's figures disagree with the run/worksheet).
      lines: detail.lines.filter((l) => l.value !== 0).map((l) => ({ key: l.key, label: l.label, value: l.value })),
      summary: detail.summary.map((s) => ({ key: s.key, label: s.label, value: s.value })),
      unmatchedCount: detail.unmatched.length,
      topRows,
    };
  }, [detail, config.currency]);

  // Publish where we are + the live figures so the LLM (via useCopilotReadable)
  // and UI can see it.
  useEffect(() => {
    const phase: 'upload' | 'categorize' | 'elect' | 'approve' | 'done' =
      done ? 'done'
      : blocker?.kind === 'upload' ? 'upload'
      : blocker?.kind === 'approval' ? 'approve'
      : blocker?.kind === 'choice' && blocker.choiceId === '__elect__' ? 'elect'
      : 'categorize';
    const awaiting = { upload: `waiting for you to upload the ${config.documentLabel}`, categorize: 'waiting for you to categorize an unmatched row', elect: 'waiting for you to elect an amount', approve: 'waiting for your approval of the computed figures', done: 'complete' }[phase];
    setActiveRun({
      workflowId: config.id, workflowName: config.name, agentName: agent?.name, documentLabel: config.documentLabel,
      totalSteps: config.steps.length, stepIndex: activeIdx, stepLabel: config.steps[Math.min(activeIdx, config.steps.length - 1)].label,
      phase, awaiting, headline: outcome?.headline, data: runData,
    });

    // Who is visibly working right now: the specialist while awaiting a human
    // decision, the DETERMINISTIC Workflow Engine while computing, nobody once done.
    const specialist =
      (agent ? coworkerForAgent(agent) : coworkerForWorkflow(config.id)) ?? WORKSPACE_ASSISTANT;

    // Record/update this run in the durable Work registry (the Work menu reads it;
    // never cleared on unmount, so it's preserved after completion).
    recordWork({
      id: workIdFor('workflow-run', config.id),
      type: 'workflow-run',
      title: config.name,
      status: done ? 'done' : blocker ? 'awaiting' : 'running',
      detail: done
        ? (outcome?.headline ? `${outcome.headline.label} ${Math.round(outcome.headline.value).toLocaleString()} ${outcome.headline.currency}` : 'Completed')
        : `Step ${Math.min(activeIdx + 1, config.steps.length)}/${config.steps.length} · ${awaiting}`,
      by: specialist,
      open: { kind: 'workflow', workflowId: config.id },
    });

    if (done) {
      setActiveCoworker(null);
    } else if (blocker) {
      const status =
        blocker.kind === 'upload' ? `Waiting for the ${config.documentLabel}`
        : blocker.kind === 'approval' ? 'Ready for your approval'
        : blocker.kind === 'choice'
          ? (blocker.choiceId === '__elect__' ? 'Waiting for you to elect an amount' : 'Waiting for your decision')
          : 'Reviewing…';
      setActiveCoworker({ coworker: specialist, status });
    } else {
      setActiveCoworker({ coworker: WORKFLOW_ENGINE, status: `Calculating ${config.documentLabel}…` });
    }

    return () => { setActiveRun(null); setActiveCoworker(null); };
  }, [config, agent, activeIdx, done, blocker, outcome, runData, setActiveRun, setActiveCoworker, recordWork]);

  const resolve = (choiceId?: string) => {
    if (!blocker) return;
    const next = resolveBlocker(state, blocker, choiceId);
    setFlow({ uploaded: next.uploaded, elected: next.elected, approved: next.approved, rows: next.rows });
    setRunEdits({ id: config.id, edits: { inputs: next.inputs, overrides: next.overrides } });
  };

  // Load parsed rows into the run — the SINGLE path every source (disk upload,
  // Drive, Gmail) funnels through, so the rows + numbers are identical.
  const applyRows = (name: string, rows: SourceRow[], from: 'upload' | 'drive' | 'gmail') => {
    fileName.current = name;
    setOrigin(from);
    setParseError(null);
    setShowGoogle(false);
    setUploadedRows((prev) => ({ ...prev, [config.id]: { fileName: name, rows, at: Date.now() } }));
    setFlow((f) => ({ ...f, rows, uploaded: true }));
  };

  // Parse the real workbook (shared parser) → store it (shared with the builder) → run on it.
  const onUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setParsing(true); setParseError(null);
    try {
      const { rows, fileName: name } = await parseUploadToRows(f);
      if (!rows.length) { setParseError('No usable rows found in that workbook. Check the trial-balance sheet has label + amount columns.'); return; }
      applyRows(name, rows, 'upload');
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Could not read that file.');
    } finally {
      setParsing(false);
    }
  };

  const onGooglePicked = (picked: PickedSource) => applyRows(picked.fileName, picked.rows, picked.origin);
  const money = (v: number | undefined) => (v == null ? '—' : `${num(v)} ${cur}`);
  // The interaction panel fades in once the timeline has finished drawing.
  const revealStyle: React.CSSProperties = { opacity: introReady ? 1 : 0, transform: introReady ? 'none' : 'translateY(6px)', transition: 'opacity .35s ease, transform .35s ease' };

  return (
    // Chat-native: no card chrome — this renders inline in the aside thread,
    // indented under Sofi's step, so it reads as part of the conversation.
    <div data-run-flow={config.id} style={{ width: '100%', maxWidth: '100%', ...(surface === 'light' ? (LIGHT_VARS as React.CSSProperties) : null) }}>
      <style>{`
        @keyframes cwpspin{to{transform:rotate(360deg)}}
        .cwp-spin{animation:cwpspin .9s linear infinite}
        @keyframes cwp-stepin{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
        @keyframes cwp-pop{from{transform:scale(0)}to{transform:scale(1)}}
        @keyframes cwp-nodehalo{0%{box-shadow:0 0 0 0 color-mix(in srgb, var(--tone) 55%, transparent)}70%{box-shadow:0 0 0 6px transparent}100%{box-shadow:0 0 0 0 transparent}}
        @keyframes cwp-livepulse{0%,100%{opacity:.55}50%{opacity:1}}
        .cwp-halo{animation:cwp-nodehalo 1.7s ease-out infinite}
        .cwp-pop{animation:cwp-pop .25s cubic-bezier(.34,1.56,.64,1) both}
        .cwp-live{animation:cwp-livepulse 1.6s ease-in-out infinite}
        @media (prefers-reduced-motion:reduce){
          .cwp-halo,.cwp-pop,.cwp-live,[data-run-flow] .cwp-step{animation:none!important}
        }
      `}</style>
      {onStop && !done && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 2 }}>
          <button onClick={onStop} title="Stop this run" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 550, color: MUTED, background: 'transparent', border: 'none', cursor: 'pointer' }}><X size={12} /> Stop</button>
        </div>
      )}

      <style>{`.cwp-step-row:hover{background:${HOVER}} .cwp-step-row:hover .cwp-review{color:${INK}}`}</style>
      <div style={{ paddingTop: 4 }}>
        {config.steps.map((s, i) => {
          const status = i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'pending';
          const isOpen = expanded === i;
          const meta = stepMeta(s);
          const reviewLabel = i === 1 ? 'Review AI mappings' : i === 2 ? 'Review calculations' : i === 3 ? 'Review result' : 'Review';
          const notLast = i < config.steps.length - 1;
          const live = liveSub(i);
          return (
            <div key={i} ref={i === 1 ? classifyStepRef : undefined} className="cwp-step" style={{ animation: `cwp-stepin .42s cubic-bezier(.23,1,.32,1) ${i * 70}ms both` }}>
              <div className="cwp-step-row" onClick={() => setExpanded(isOpen ? null : i)} style={{ display: 'flex', gap: 14, minHeight: 50, cursor: 'pointer', borderRadius: 10, padding: '7px 9px', margin: '0 -9px', transition: 'background 150ms' }}>
                <div style={{ position: 'relative', width: 16, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 1 }}>
                  {notLast && <div style={{ position: 'absolute', left: '50%', top: 23, bottom: -15, transform: 'translateX(-50%)', width: 0, borderLeft: `2px ${status === 'done' ? 'solid' : 'dashed'} ${status === 'done' ? SPINE_DONE : SPINE_AHEAD}` }} />}
                  <TimelineDot status={status} tone={meta.tone} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: status === 'pending' ? 400 : 600, color: status === 'pending' ? FAINT : INK, lineHeight: 1.3 }}>{s.label}</span>
                    <span style={{ fontSize: 9, fontWeight: 650, letterSpacing: '0.05em', textTransform: 'uppercase', color: status === 'pending' ? DIM : MUTED, border: `1px solid ${HAIRLINE}`, borderRadius: 5, padding: '1.5px 5px', whiteSpace: 'nowrap', flexShrink: 0 }}>{meta.kind}</span>
                    <span className="cwp-review" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 550, color: isOpen ? INK : FAINT, flexShrink: 0 }}>
                      {isOpen ? 'Hide' : reviewLabel}
                      <ChevronDown size={12} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: status === 'pending' ? DIM : MUTED, lineHeight: 1.4, marginTop: 1 }}>{s.sub}</div>
                  {live && <div className="cwp-live" style={{ fontSize: 11, color: meta.tone, marginTop: 3, display: 'inline-flex', alignItems: 'center', gap: 5 }}><span style={{ width: 5, height: 5, borderRadius: '50%', background: meta.tone, display: 'inline-block' }} />{live}</div>}
                </div>
              </div>
              {isOpen && <StageDetail idx={i} detail={detail} config={config} overrides={state.overrides} resultPage={config.resultPage} onOverride={(rowId, catId) => setRunOverride({ id: config.id, rowId, categoryId: catId })} onOpenPage={onOpenPage} onOpenBuilder={onOpenBuilder} snapshot={snapshot} liveConfigByBlock={liveConfigByBlock} />}
            </div>
          );
        })}
      </div>

      <div style={revealStyle}>
      {effectiveState.uploaded && <EditableInputs config={config} inputs={state.inputs} onCommit={(key, value) => setRunInput({ id: config.id, key, value })} onOpenBuilder={onOpenBuilder} snapshot={snapshot} liveConfigByBlock={liveConfigByBlock} />}

      {/* Non-blocking review notice — unmatched rows were left out of the calc. */}
      {outcome?.needsReview && (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 9, padding: '9px 11px', borderRadius: 9, background: AMBER_SOFT, border: `1px solid ${AMBER_LINE}` }}>
          <AlertTriangle size={14} style={{ color: AMBER, flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: AMBER_TEXT, lineHeight: 1.4 }}>
              {outcome.needsReview.count} {outcome.needsReview.count === 1 ? 'row was' : 'rows were'} left out of the calculation
            </div>
            <div style={{ fontSize: 11.5, color: AMBER, lineHeight: 1.45, marginTop: 1 }}>
              The mapper couldn’t classify {outcome.needsReview.count === 1 ? 'it' : 'them'}, so {outcome.needsReview.count === 1 ? "it isn’t" : "they aren’t"} included. {done ? 'Categorize to fold into the figures.' : 'Approve as-is, or categorize to include.'}
            </div>
          </div>
          <button onClick={reviewUnmatched} style={{ flexShrink: 0, fontSize: 11.5, fontWeight: 600, color: AMBER_TEXT, background: 'rgba(255,255,255,0.04)', border: `1px solid ${AMBER_LINE}`, borderRadius: 7, padding: '5px 10px', cursor: 'pointer' }}>Review {outcome.needsReview.count}</button>
        </div>
      )}

      {!done && blocker && (
        <div style={{ marginTop: 6, paddingTop: 12, borderTop: `1px solid ${HAIRLINE}` }}>
          {blocker.kind === 'upload' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: INK, marginBottom: 5 }}><FileUp size={14} /> Document needed</div>
              <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5, marginBottom: 11 }}>{blocker.message}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                {/* A workbook is already loaded (this session / the worksheet / the builder):
                    offer it as the primary one-click path, but still let them swap it. */}
                {hasCached && (
                  <button onClick={() => setFlow((f) => ({ ...f, uploaded: true }))} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 550, padding: '7px 13px', borderRadius: 8, background: PRIMARY_BG, color: PRIMARY_FG, border: 'none', cursor: 'pointer' }}>
                    <Check size={13} /> Use loaded workbook{fileName.current ? ` · ${fileName.current}` : ''} ({storeRows!.length} rows)
                  </button>
                )}
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 550, padding: '7px 13px', borderRadius: 8, background: parsing ? MUTED : (hasCached ? CARD : PRIMARY_BG), color: hasCached ? INK : PRIMARY_FG, border: hasCached ? `1px solid ${LINE}` : 'none', cursor: parsing ? 'default' : 'pointer' }}>
                  {parsing ? <Loader2 size={13} className="cwp-spin" /> : <Upload size={13} />} {parsing ? 'Parsing…' : hasCached ? 'Upload a different workbook' : 'Upload workbook'}
                  <input type="file" accept=".xlsx,.xls" disabled={parsing} style={{ display: 'none' }} onChange={onUploadFile} />
                </label>
                {ghostBtn({ children: <><Cloud size={13} /> Import from Google</>, onClick: () => setShowGoogle((v) => !v) })}
                {ghostBtn({ children: 'Use sample workbook', onClick: () => { fileName.current = null; setUploadedRows((prev) => { const next = { ...prev }; delete next[config.id]; return next; }); setFlow((f) => ({ ...f, rows: undefined, uploaded: true })); } })}
              </div>
              {showGoogle && <GoogleSourcePicker onPicked={onGooglePicked} onClose={() => setShowGoogle(false)} />}
              {parseError && <div style={{ fontSize: 11, color: DANGER, marginTop: 8 }}>{parseError}</div>}
              {!parseError && fileName.current && <div style={{ fontSize: 11, color: FAINT, marginTop: 8 }}>Loaded {fileName.current}{origin === 'drive' ? ' from Google Drive' : origin === 'gmail' ? ' from a Gmail attachment' : ''} · {(storeRows ?? state.rows)?.length ?? 0} rows — the run uses these exact rows (same as the builder).</div>}
            </div>
          )}
          {blocker.kind === 'choice' && (
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: INK, marginBottom: 5 }}>Your decision</div>
              <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5, marginBottom: 11 }}>{blocker.message}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {blocker.options.map((o) => {
                  const skip = o.id === '__skip__';
                  return <button key={o.id} onClick={() => resolve(o.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: skip ? 500 : 550, padding: '7px 13px', borderRadius: 8, background: skip ? CARD : PRIMARY_BG, color: skip ? INK : PRIMARY_FG, border: skip ? `1px solid ${LINE}` : 'none', cursor: 'pointer' }}>{o.label}</button>;
                })}
              </div>
            </div>
          )}
          {blocker.kind === 'approval' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: INK, marginBottom: 3 }}><ShieldCheck size={14} /> Approve — every figure traced</div>
              <div style={{ fontSize: 11.5, color: MUTED, marginBottom: 9 }}>Each number shows how it was derived. Expand a step above to see the source rows and classification.</div>
              <div style={{ padding: '4px 2px', marginBottom: 11 }}>
                {blocker.figures.map((row) => <KV key={row.key} l={row.label} sub={row.formula} v={num(row.value)} />)}
              </div>
              <button onClick={() => resolve()} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 550, padding: '7px 13px', borderRadius: 8, background: PRIMARY_BG, color: PRIMARY_FG, border: 'none', cursor: 'pointer' }}><ShieldCheck size={13} /> Approve &amp; finalize</button>
            </div>
          )}
        </div>
      )}

      {done && outcome?.headline && (
        <div style={{ marginTop: 6, paddingTop: 12, borderTop: `1px solid ${HAIRLINE}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: onOpenPage ? 8 : 0 }}>
            <span style={{ fontSize: 12.5, color: MUTED }}>{outcome.headline.label}</span>
            <span style={{ fontSize: 18, fontWeight: 650, color: INK, letterSpacing: '-0.01em' }}>{money(outcome.headline.value)}</span>
          </div>
          {onOpenPage && <button onClick={() => onOpenPage('fapi')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 550, color: INK, background: CARD, border: `1px solid ${LINE}`, borderRadius: 7, padding: '5px 10px', cursor: 'pointer' }}><ExternalLink size={11} /> Open worksheet</button>}
        </div>
      )}
      </div>
    </div>
  );
}
