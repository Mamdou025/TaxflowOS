import { useMemo } from 'react';
import { useAtomValue } from 'jotai';
import { FileUp, GitBranch, ExternalLink } from 'lucide-react';
import { runTemplateCore, buildOverrideRules, type TemplateConfig } from '@/shared/workflow-engine/runtime/workflow-runs';
import { uploadedRowsAtom, runEditsAtom, EMPTY_RUN_EDITS } from '@/shared/stores/workspace-store';

// ── Palette ─────────────────────────────────────────────────────────────────────
// Themeable via CSS custom properties so the SAME component blends into both the
// dark LibreChat chat thread (default) and a light neumorphic surface, each token
// falling back to the dark value when rendered with no var scope (the normal case
// for this pinned chat card).
const INK = 'var(--cwp-ink, #ececec)', MUTED = 'var(--cwp-muted, #9a9a9a)', FAINT = 'var(--cwp-faint, #6f6f6f)';
const LINE = 'var(--cwp-line, rgba(255,255,255,0.12))', HAIRLINE = 'var(--cwp-hairline, rgba(255,255,255,0.07))';
const SURFACE = 'var(--cwp-surface, rgba(255,255,255,0.03))';  // inset detail panels
const CARD = 'var(--cwp-card, #2f2f2f)';                         // ghost buttons / chips
const num = (n: number) => n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
// A RATE (FX / conversion factor) is not money — show it at full precision, never
// 2dp cents (which would display 1.3978 as "1.40"). Matches the engine's rate
// handling + the worksheet's fmtRate, so all surfaces show the same rate.
const numRate = (n: number) => n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 6 });
const isRateKey = (key: string) => /_RATE$|^FX/i.test(key);
// A summary/line label often states its own currency, e.g. "Net surplus movement (CAD)".
// Trust that over the workflow's document currency — post-FX reporting figures are in CAD
// even when the source document is in USD, so a CAD-labelled figure must not read "USD".
const unitFor = (label: string, fallback: string) => {
  const m = label.toUpperCase().match(/\b(CAD|USD|EUR|GBP)\b/);
  return m ? m[1] : fallback;
};

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

// ── A summoned workflow element (a source document / an output) in the chat ────
// This is the only export still mounted anywhere (`use-assistant.tsx`'s pinned-work
// list). An earlier `RunProposalCard` and the full generic `WorkflowRunFlow` run
// surface lived in this file too, but neither was ever rendered — confirmed by
// searching the whole app for `<RunProposalCard` / `<WorkflowRunFlow` (zero
// matches) before removing them, 2026-10-10. See docs/chat-hub-registry.md's
// design polish backlog for the before/after.
export function WorkflowElementCard({ config, element, onOpenPage, onOpenBuilder }: {
  config: TemplateConfig;
  element: 'source' | 'output';
  onOpenPage?: (pageKey: string) => void;
  onOpenBuilder?: (blockId: string) => void;
}) {
  const uploaded = useAtomValue(uploadedRowsAtom);
  const allEdits = useAtomValue(runEditsAtom);
  const isSource = element === 'source';
  // Summoned cards may describe supplied records, but never fill a missing source
  // with built-in examples. Saved run results remain in the shared run panel.
  const sourceRows = uploaded[config.id]?.rows ?? [];
  const outcome = useMemo(() => {
    if (element !== 'output' || !sourceRows.length) return null;
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
            {!sourceRows.length && <div style={{ fontSize: 12, color: FAINT }}>No source records supplied. Open the workflow to attach a source.</div>}
            {sourceRows.map((r) => <KV key={r.rowId} l={r.label} sub={r.account ? `acct ${r.account}` : undefined} v={`${num(r.amount)} ${r.currency ?? ''}`} />)}
          </>
        ) : outcome?.detail ? (
          <>
            {outcome.detail.summary.map((s) => <KV key={s.key} l={s.label} sub={s.formula} v={isRateKey(s.key) ? numRate(s.value) : `${num(s.value)} ${unitFor(s.label, config.currency)}`} />)}
            {outcome.headline && <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, paddingTop: 8, borderTop: `1px solid ${HAIRLINE}` }}><span style={{ fontSize: 12, color: MUTED }}>{outcome.headline.label}</span><span style={{ fontSize: 15, fontWeight: 650, color: INK }}>{num(outcome.headline.value)} {unitFor(outcome.headline.label, config.currency)}</span></div>}
          </>
        ) : <div style={{ fontSize: 12, color: FAINT }}>No output yet.</div>}
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          {!isSource && onOpenPage && config.resultPage && <button onClick={() => onOpenPage(config.resultPage!)} style={btnGhost}><ExternalLink size={11} /> Open worksheet</button>}
          {onOpenBuilder && <button onClick={() => onOpenBuilder(blockId)} style={btnGhost}><GitBranch size={11} /> Open in builder</button>}
        </div>
      </div>
    </div>
  );
}
const btnGhost: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 550, color: INK, background: CARD, border: `1px solid ${LINE}`, borderRadius: 7, padding: '5px 10px', cursor: 'pointer' };
