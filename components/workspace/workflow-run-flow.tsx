'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSetAtom, useAtom } from 'jotai';
import { Check, Upload, FileUp, ShieldCheck, Loader2, ChevronDown, ExternalLink, X, GitBranch, SlidersHorizontal, AlertTriangle } from 'lucide-react';
import { runTemplateLoop, runToCompletion, initialRunState, resolveBlocker, type TemplateConfig, type RunState, type RunDetail } from '@/lib/workflow-runs';
import { parseUploadToRows } from '@/lib/workflow-runs/parse-upload';
import { pushTrailAtom, activeRunAtom, uploadedRowsAtom } from '@/lib/workspace-store';
import type { Agent } from '@/lib/agents';

const INK = '#18181b', MUTED = '#71717a', FAINT = '#a1a1aa', LINE = 'rgba(24,24,27,0.10)';
const HAIRLINE = 'rgba(24,24,27,0.07)';
const num = (n: number) => n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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
  if (status === 'done') return <span style={{ ...base, background: tone }}><Check size={9} color="#fff" strokeWidth={3} /></span>;
  if (status === 'active') return <span style={{ ...base, border: `2px solid ${tone}`, background: '#fff' }}><Loader2 size={8} color={tone} className="cwp-spin" /></span>;
  return <span style={{ ...base, width: 13, height: 13, border: `2px solid ${hexA(tone, 0.35)}`, background: '#fff' }} />;
}

const detailWrap = (children: React.ReactNode) => <div style={{ margin: '2px 0 10px 28px', padding: '12px 14px', background: '#fafafa', border: `1px solid ${LINE}`, borderRadius: 10 }}>{children}</div>;
const hdr = (t: string) => <div style={{ fontSize: 10.5, fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.04em', color: FAINT, marginBottom: 6 }}>{t}</div>;
const smallBtnStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 10, marginRight: 8, fontSize: 11.5, fontWeight: 550, color: INK, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 7, padding: '5px 10px', cursor: 'pointer' };
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
    <div style={{ margin: '7px 0 2px', padding: '10px 12px', background: '#fff', border: `1px solid ${LINE}`, borderRadius: 9 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
        <span style={{ fontSize: 12.5, fontWeight: 650, color: INK }}>{block.label ?? block.id}</span>
        {block.subtype && <span style={{ fontSize: 9.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em', color: MUTED, background: '#f4f4f5', border: `1px solid ${LINE}`, borderRadius: 5, padding: '1px 5px' }}>{block.subtype}</span>}
      </div>
      {block.description && <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.45, marginBottom: cfg.length ? 7 : 4 }}>{block.description}</div>}
      {cfg.length > 0 && (
        <div style={{ marginBottom: 7 }}>
          {cfg.map(([k, v]) => <KV key={k} l={<span style={{ fontSize: 11 }}>{k}{isLive(k) && <span style={{ marginLeft: 5, fontSize: 9, fontWeight: 600, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.03em' }}>· live</span>}</span>} v={<span style={{ fontSize: 11, color: isLive(k) ? '#0369a1' : INK }}>{fmtCfg(v)}</span>} />)}
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
  const rows = [
    ...detail.mapped.map((m) => ({ rowId: m.rowId, label: m.label, amount: m.amount, category: m.category, confidence: m.confidence, unmatched: false })),
    ...detail.unmatched.map((u) => ({ rowId: u.rowId, label: u.label, amount: u.amount, category: 'Unclassified', confidence: 0, unmatched: true })),
  ];
  const opts = config.categoryOptions.filter((o) => o.id !== '__skip__');
  return detailWrap(<>
    <div style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.5, marginBottom: 8 }}>The keyword mapper <b>suggested</b> these classifications. Click any category to override the AI — the workflow re-runs with your decision.</div>
    {rows.map((r) => {
      const overridden = r.rowId in overrides;
      const isEd = editing === r.rowId;
      return (
        <div key={r.rowId} style={{ padding: '7px 0', borderTop: `1px solid ${LINE}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, color: INK }}>{r.label}</div>
              <div style={{ fontSize: 10.5, color: FAINT, fontVariantNumeric: 'tabular-nums' }}>{num(r.amount)}</div>
            </div>
            <button onClick={() => setEditing(isEd ? null : r.rowId)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 550, padding: '4px 9px', borderRadius: 999, cursor: 'pointer', color: r.unmatched ? '#b45309' : INK, background: r.unmatched ? 'rgba(217,119,6,0.08)' : '#fff', border: `1px solid ${r.unmatched ? 'rgba(217,119,6,0.3)' : LINE}` }}>
              {r.category}{!r.unmatched && r.confidence ? ` · ${Math.round(r.confidence * 100)}%` : ''}{overridden ? ' ✎' : ''}
              <ChevronDown size={11} style={{ transform: isEd ? 'rotate(180deg)' : 'none' }} />
            </button>
          </div>
          {isEd && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8, paddingLeft: 2 }}>
              {opts.map((o) => <button key={o.id} onClick={() => { onOverride(r.rowId, o.id); setEditing(null); }} style={{ fontSize: 11.5, fontWeight: 500, padding: '5px 10px', borderRadius: 7, background: o.label === r.category ? INK : '#fff', color: o.label === r.category ? '#fff' : INK, border: `1px solid ${LINE}`, cursor: 'pointer' }}>{o.label}</button>)}
              {r.unmatched && <button onClick={() => { onOverride(r.rowId, '__skip__'); setEditing(null); }} style={{ fontSize: 11.5, fontWeight: 500, padding: '5px 10px', borderRadius: 7, background: '#fff', color: MUTED, border: `1px solid ${LINE}`, cursor: 'pointer' }}>Leave unmatched</button>}
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
  if (idx === 2) return detailWrap(<>{hdr('Deterministic — aggregated buckets')}{detail.buckets.map((b) => <KV key={b.key} l={b.key} v={num(b.value)} />)}{where(config.rollupBlockId, 'Where this aggregation comes from')}{hdr2('Computed lines (formula → value)')}{detail.lines.filter((l) => l.value !== 0).map((l) => <KV key={l.key} l={l.label} sub={l.formula} v={num(l.value)} />)}{openBtn}{where(config.linesBlockId, 'Where this calculation comes from')}</>);
  if (idx === 3) return detailWrap(<>{hdr('Result — every figure traced')}{detail.summary.map((s) => <KV key={s.key} l={s.label} sub={s.formula} v={num(s.value)} />)}{openBtn}{where(config.summaryBlockId, 'Where this result comes from')}</>);
  return null;
}
const hdr2 = (t: string) => <div style={{ fontSize: 10.5, fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.04em', color: FAINT, margin: '10px 0 6px' }}>{t}</div>;

function ghostBtn(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { children: React.ReactNode }) {
  return <button {...props} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 500, padding: '7px 13px', borderRadius: 8, background: '#fff', color: INK, border: `1px solid ${LINE}`, cursor: 'pointer', ...props.style }} />;
}

// ── A summoned workflow element (a source document / an output) in the chat ────
export function WorkflowElementCard({ config, element, onOpenPage, onOpenBuilder }: {
  config: TemplateConfig;
  element: 'source' | 'output';
  onOpenPage?: (pageKey: string) => void;
  onOpenBuilder?: (blockId: string) => void;
}) {
  const outcome = useMemo(() => (element === 'output' ? runToCompletion(config) : null), [config, element]);
  const isSource = element === 'source';
  const blockId = isSource ? config.sourceBlockId : config.summaryBlockId;
  return (
    <div style={{ maxWidth: 460, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 12, overflow: 'hidden', margin: '2px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 13px', borderBottom: `1px solid ${LINE}`, background: '#fafafa' }}>
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
            {config.sampleRows.map((r) => <KV key={r.rowId} l={r.label} sub={r.account ? `acct ${r.account}` : undefined} v={`${num(r.amount)} ${r.currency ?? ''}`} />)}
          </>
        ) : outcome?.detail ? (
          <>
            {outcome.detail.summary.map((s) => <KV key={s.key} l={s.label} sub={s.formula} v={`${num(s.value)} ${config.currency}`} />)}
            {outcome.headline && <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: `1px solid ${LINE}` }}><span style={{ fontSize: 12, color: MUTED }}>{outcome.headline.label}</span><span style={{ fontSize: 15, fontWeight: 650, color: INK }}>{num(outcome.headline.value)} {config.currency}</span></div>}
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
const btnGhost: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 550, color: INK, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 7, padding: '5px 10px', cursor: 'pointer' };

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
          {live && <> · <button onClick={fetchLive} disabled={fetching} style={{ background: 'none', border: 'none', padding: 0, color: fetching ? FAINT : '#0369a1', fontSize: 10.5, cursor: fetching ? 'default' : 'pointer', textDecoration: 'underline' }}>{fetching ? 'fetching…' : '↻ fetch live rate'}</button></>}
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
        style={{ width: 110, textAlign: 'right', fontSize: 12.5, fontVariantNumeric: 'tabular-nums', color: INK, border: `1px solid ${LINE}`, borderRadius: 7, padding: '5px 9px', outline: 'none' }}
      />
    </div>
  );
}

function EditableInputs({ config, inputs, onCommit, onOpenBuilder, snapshot, liveConfigByBlock }: { config: TemplateConfig; inputs: Record<string, number>; onCommit: (key: string, value: number) => void; onOpenBuilder?: (blockId: string) => void; snapshot?: PeekSnapshot; liveConfigByBlock?: Record<string, Record<string, unknown>> }) {
  if (!config.editableInputs?.length) return null;
  return (
    <div style={{ margin: '10px 0 2px', padding: '11px 14px', background: '#fafafa', border: `1px solid ${LINE}`, borderRadius: 10 }}>
      <div style={{ fontSize: 10.5, fontWeight: 650, textTransform: 'uppercase', letterSpacing: '0.04em', color: FAINT, marginBottom: 9, display: 'flex', alignItems: 'center', gap: 5 }}><SlidersHorizontal size={12} /> Inputs — edit any and the workflow recomputes</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {config.editableInputs.map((inp) => (
          <InputRow key={inp.key} label={inp.label} hint={inp.hint} value={inputs[inp.key] ?? inp.default} onCommit={(v) => onCommit(inp.key, v)} blockId={inp.block?.blockId} onOpenBuilder={onOpenBuilder} snapshot={snapshot} liveConfigByBlock={liveConfigByBlock} live={inp.key === 'fxRate' ? { from: config.currency ?? 'USD', to: 'CAD', year: 2025 } : undefined} />
        ))}
      </div>
    </div>
  );
}

// ── Generic, inspectable run flow — works for any TemplateConfig ────────────────
export function WorkflowRunFlow({ config, onComplete, agent, onOpenPage, onOpenBuilder, onStop }: {
  config: TemplateConfig;
  onComplete: (summary: string) => void;
  agent?: Agent;
  onOpenPage?: (pageKey: string, anchor?: string) => void;
  onOpenBuilder?: (blockId: string) => void;
  onStop?: () => void;
}) {
  const [state, setState] = useState<RunState>(() => initialRunState());
  const [expanded, setExpanded] = useState<number | null>(null);
  const pushTrail = useSetAtom(pushTrailAtom);
  const setActiveRun = useSetAtom(activeRunAtom);
  const [uploadedRows, setUploadedRows] = useAtom(uploadedRowsAtom);
  const [parsing, setParsing] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  const doneRef = useRef(false);
  const fileName = useRef<string | null>(null);
  const hydratedRef = useRef(false);

  // Hydrate from the shared store: if a workbook was uploaded (here or in the
  // builder) for this workflow, this run starts on those exact rows.
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    const stored = uploadedRows[config.id];
    if (stored?.rows?.length) {
      fileName.current = stored.fileName;
      setState((s) => ({ ...s, rows: stored.rows }));
    }
  }, [config.id, uploadedRows]);

  const outcome = useMemo(() => { try { return runTemplateLoop(config, state); } catch { return null; } }, [config, state]);
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

  useEffect(() => {
    if (done && outcome?.summaryText && !doneRef.current) {
      doneRef.current = true;
      pushTrail({ text: outcome.summaryText, tone: 'calculation' });
      onComplete(outcome.summaryText);
    }
  }, [done, outcome, onComplete, pushTrail]);

  // Publish where we are so the LLM (via useCopilotReadable) and UI can see it.
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
      phase, awaiting, headline: outcome?.headline,
    });
    return () => setActiveRun(null);
  }, [config, agent, activeIdx, done, blocker, outcome, setActiveRun]);

  const resolve = (choiceId?: string) => { if (blocker) setState((s) => resolveBlocker(s, blocker, choiceId)); };

  // Parse the real workbook (shared parser) → store it (shared with the builder) → run on it.
  const onUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setParsing(true); setParseError(null);
    try {
      const { rows, fileName: name } = await parseUploadToRows(f);
      if (!rows.length) { setParseError('No usable rows found in that workbook. Check the trial-balance sheet has label + amount columns.'); return; }
      fileName.current = name;
      setUploadedRows((prev) => ({ ...prev, [config.id]: { fileName: name, rows, at: Date.now() } }));
      setState((s) => ({ ...s, rows, uploaded: true }));
    } catch (err) {
      setParseError(err instanceof Error ? err.message : 'Could not read that file.');
    } finally {
      setParsing(false);
    }
  };
  const money = (v: number | undefined) => (v == null ? '—' : `${num(v)} ${cur}`);

  return (
    <div style={{ width: '100%', maxWidth: '100%', background: '#fff', border: `1px solid ${LINE}`, borderRadius: 16, padding: '18px 22px', margin: '2px 0', boxShadow: '0 1px 2px rgba(24,24,27,0.04), 0 12px 32px rgba(24,24,27,0.05)' }}>
      <style>{`@keyframes cwpspin{to{transform:rotate(360deg)}} .cwp-spin{animation:cwpspin .9s linear infinite}`}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 13, marginBottom: 6, borderBottom: `1px solid ${HAIRLINE}` }}>
        {agent
          ? <span style={{ width: 30, height: 30, borderRadius: 9, background: agent.accent, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 11.5, fontWeight: 650, flexShrink: 0 }}>{agent.initials}</span>
          : <GitBranch size={16} style={{ color: INK }} />}
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 650, color: INK, lineHeight: 1.25 }}>{agent ? <>{agent.name} <span style={{ color: FAINT, fontWeight: 500 }}>· {config.name}</span></> : config.name}</div>
          <div style={{ fontSize: 11, color: MUTED, lineHeight: 1.25 }}>{done ? 'Complete' : `Running ${config.name}…`}</div>
        </div>
        <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: MUTED, fontWeight: 550 }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: done ? TONES.engine : TONES.checkpoint }} />
          {done ? 'Complete' : 'Running'}
        </span>
        {onStop && !done && <button onClick={onStop} title="Stop this run" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, fontWeight: 550, color: MUTED, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 7, padding: '4px 9px', cursor: 'pointer' }}><X size={12} /> Stop</button>}
      </div>

      <style>{`.cwp-step-row:hover{background:rgba(24,24,27,0.025)} .cwp-step-row:hover .cwp-review{color:${INK}}`}</style>
      <div style={{ paddingTop: 4 }}>
        {config.steps.map((s, i) => {
          const status = i < activeIdx ? 'done' : i === activeIdx ? 'active' : 'pending';
          const isOpen = expanded === i;
          const meta = stepMeta(s);
          const reviewLabel = i === 1 ? 'Review AI mappings' : i === 2 ? 'Review calculations' : i === 3 ? 'Review result' : 'Review';
          const notLast = i < config.steps.length - 1;
          return (
            <div key={i}>
              <div className="cwp-step-row" onClick={() => setExpanded(isOpen ? null : i)} style={{ display: 'flex', gap: 14, minHeight: 50, cursor: 'pointer', borderRadius: 10, padding: '7px 9px', margin: '0 -9px', transition: 'background 150ms' }}>
                <div style={{ position: 'relative', width: 16, flexShrink: 0, display: 'flex', justifyContent: 'center', paddingTop: 1 }}>
                  {notLast && <div style={{ position: 'absolute', left: '50%', top: 23, bottom: -15, transform: 'translateX(-50%)', width: 0, borderLeft: `2px ${status === 'done' ? 'solid' : 'dashed'} ${status === 'done' ? hexA(INK, 0.18) : hexA(INK, 0.09)}` }} />}
                  <TimelineDot status={status} tone={meta.tone} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: status === 'pending' ? 400 : 600, color: status === 'pending' ? FAINT : INK, lineHeight: 1.3 }}>{s.label}</span>
                    <span style={{ fontSize: 9, fontWeight: 650, letterSpacing: '0.05em', textTransform: 'uppercase', color: status === 'pending' ? '#c4c4cc' : MUTED, border: `1px solid ${HAIRLINE}`, borderRadius: 5, padding: '1.5px 5px', whiteSpace: 'nowrap', flexShrink: 0 }}>{meta.kind}</span>
                    <span className="cwp-review" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 550, color: isOpen ? INK : FAINT, flexShrink: 0 }}>
                      {isOpen ? 'Hide' : reviewLabel}
                      <ChevronDown size={12} style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 150ms' }} />
                    </span>
                  </div>
                  <div style={{ fontSize: 11.5, color: status === 'pending' ? '#c4c4cc' : MUTED, lineHeight: 1.4, marginTop: 1 }}>{s.sub}</div>
                </div>
              </div>
              {isOpen && <StageDetail idx={i} detail={detail} config={config} overrides={state.overrides} resultPage={config.resultPage} onOverride={(rowId, catId) => setState((st) => ({ ...st, overrides: { ...st.overrides, [rowId]: catId } }))} onOpenPage={onOpenPage} onOpenBuilder={onOpenBuilder} snapshot={snapshot} liveConfigByBlock={liveConfigByBlock} />}
            </div>
          );
        })}
      </div>

      {state.uploaded && <EditableInputs config={config} inputs={state.inputs} onCommit={(key, value) => setState((st) => ({ ...st, inputs: { ...st.inputs, [key]: value } }))} onOpenBuilder={onOpenBuilder} snapshot={snapshot} liveConfigByBlock={liveConfigByBlock} />}

      {/* Non-blocking review notice — unmatched rows were left out of the calc. */}
      {outcome?.needsReview && (
        <div style={{ marginTop: 10, display: 'flex', alignItems: 'flex-start', gap: 9, padding: '9px 11px', borderRadius: 9, background: 'rgba(217,119,6,0.06)', border: '1px solid rgba(217,119,6,0.25)' }}>
          <AlertTriangle size={14} style={{ color: '#b45309', flexShrink: 0, marginTop: 1 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#92400e', lineHeight: 1.4 }}>
              {outcome.needsReview.count} {outcome.needsReview.count === 1 ? 'row was' : 'rows were'} left out of the calculation
            </div>
            <div style={{ fontSize: 11.5, color: '#b45309', lineHeight: 1.45, marginTop: 1 }}>
              The mapper couldn’t classify {outcome.needsReview.count === 1 ? 'it' : 'them'}, so {outcome.needsReview.count === 1 ? "it isn’t" : "they aren’t"} included. {done ? 'Categorize to fold into the figures.' : 'Approve as-is, or categorize to include.'}
            </div>
          </div>
          <button onClick={() => setExpanded(1)} style={{ flexShrink: 0, fontSize: 11.5, fontWeight: 600, color: '#92400e', background: '#fff', border: '1px solid rgba(217,119,6,0.35)', borderRadius: 7, padding: '5px 10px', cursor: 'pointer' }}>Review {outcome.needsReview.count}</button>
        </div>
      )}

      {!done && blocker && (
        <div style={{ marginTop: 6, paddingTop: 12, borderTop: `1px solid ${LINE}` }}>
          {blocker.kind === 'upload' && (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, fontWeight: 600, color: INK, marginBottom: 5 }}><FileUp size={14} /> Document needed</div>
              <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5, marginBottom: 11 }}>{blocker.message}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 550, padding: '7px 13px', borderRadius: 8, background: parsing ? MUTED : INK, color: '#fff', cursor: parsing ? 'default' : 'pointer' }}>
                  {parsing ? <Loader2 size={13} className="cwp-spin" /> : <Upload size={13} />} {parsing ? 'Parsing…' : 'Upload workbook'}
                  <input type="file" accept=".xlsx,.xls" disabled={parsing} style={{ display: 'none' }} onChange={onUploadFile} />
                </label>
                {ghostBtn({ children: 'Use sample workbook', onClick: () => { fileName.current = null; setState((s) => ({ ...s, rows: undefined })); resolve(); } })}
              </div>
              {parseError && <div style={{ fontSize: 11, color: '#b91c1c', marginTop: 8 }}>{parseError}</div>}
              {!parseError && fileName.current && <div style={{ fontSize: 11, color: FAINT, marginTop: 8 }}>Loaded {fileName.current} · {state.rows?.length ?? 0} rows — the run uses these exact rows (same as the builder).</div>}
            </div>
          )}
          {blocker.kind === 'choice' && (
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: INK, marginBottom: 5 }}>Your decision</div>
              <div style={{ fontSize: 12.5, color: MUTED, lineHeight: 1.5, marginBottom: 11 }}>{blocker.message}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {blocker.options.map((o) => {
                  const skip = o.id === '__skip__';
                  return <button key={o.id} onClick={() => resolve(o.id)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: skip ? 500 : 550, padding: '7px 13px', borderRadius: 8, background: skip ? '#fff' : INK, color: skip ? INK : '#fff', border: skip ? `1px solid ${LINE}` : 'none', cursor: 'pointer' }}>{o.label}</button>;
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
              <button onClick={() => resolve()} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, fontWeight: 550, padding: '7px 13px', borderRadius: 8, background: INK, color: '#fff', border: 'none', cursor: 'pointer' }}><ShieldCheck size={13} /> Approve &amp; finalize</button>
            </div>
          )}
        </div>
      )}

      {done && outcome?.headline && (
        <div style={{ marginTop: 6, paddingTop: 12, borderTop: `1px solid ${LINE}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: onOpenPage ? 8 : 0 }}>
            <span style={{ fontSize: 12.5, color: MUTED }}>{outcome.headline.label}</span>
            <span style={{ fontSize: 18, fontWeight: 650, color: INK, letterSpacing: '-0.01em' }}>{money(outcome.headline.value)}</span>
          </div>
          {onOpenPage && <button onClick={() => onOpenPage('fapi')} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 550, color: INK, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 7, padding: '5px 10px', cursor: 'pointer' }}><ExternalLink size={11} /> Open worksheet</button>}
        </div>
      )}
    </div>
  );
}
