

// ─────────────────────────────────────────────────────────────────────────────
// FAPI Worksheet — the fiscalist's worksheet, rebuilt in the main app.
//
// Platform's line structure (FX · A · EXP · B · 95(2) · A.1 · A.2 · C · D · E ·
// F · F.1 · G · H · FAT) rendered in our design language: monochrome, refined
// hairlines + soft elevation, and TONED DOTS as the only colour (source · engine
// · manual · AI-mapped). Wired to the REAL engine over the shared uploaded rows,
// so the worksheet, chat run, and builder canvas all show identical numbers.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useRef, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from '@/lib/router';
import { ChevronRight, Upload, GitBranch, Sparkles, FileSpreadsheet, Loader2, Download, X } from 'lucide-react';
import { runTemplateCore, buildOverrideRules, type SourceRow, type MappedRow } from '@/shared/workflow-engine/runtime/workflow-runs';
import { FAPI_CONFIG } from '@/shared/workflow-engine/runtime/workflow-runs/fapi';
import { parseUploadToRows } from '@/shared/workflow-engine/runtime/workflow-runs/parse-upload';
import { uploadedRowsAtom, runEditsAtom, setRunInputAtom, EMPTY_RUN_EDITS } from '@/shared/stores/workspace-store';
import { builderFocusTargetAtom } from '@/shared/workflow-engine/state/workflow-store';
import { useInlinePage } from '@/shared/stores/inline-page-context';
import { usePageMenu } from '@/shared/stores/page-menu-store';
import { WorksheetCopilot } from '@/features/assistant/ui/worksheet-copilot';

const INK = 'var(--sx-ink)', MUTED = 'var(--sx-muted)', FAINT = 'var(--sx-faint)';
const LINE = 'var(--sx-hairline)', HAIRLINE = 'var(--sx-hairline-subtle)';
// Pastel, discreet — dots read as a quiet accent, not a signal light.
const TONES = { source: '#7fb2d9', engine: '#7cc3a6', manual: '#dab06c', ai: '#a892d6' } as const;
type Tone = keyof typeof TONES;
function hexA(hex: string, a: number) {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}
const money = (n: number) => n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const rate = (n: number) => n.toLocaleString('en-CA', { minimumFractionDigits: 4, maximumFractionDigits: 6 });

const SRC = 'fapi-source-fx-rate', INP = 'fapi-source-inputs', LINES = 'fapi-logic-lines-engine', SUM = 'fapi-logic-summary-engine';

type Edit = { key: string; toInput?: (displayed: number) => number };
type WLine = { code: string; key: string; label: string; tone: Tone; block: string; sub?: 'income' | 'expense' | 'capgains'; edit?: Edit; isRate?: boolean };
type WSection = { title: string; lines: WLine[] };

const SECTIONS: WSection[] = [
  { title: 'Currency conversion', lines: [
    { code: 'FX', key: 'FX_RATE', label: 'Annual average FX rate (USD → CAD)', tone: 'source', block: SRC, edit: { key: 'fxRate' }, isRate: true },
  ] },
  { title: 'Property income', lines: [
    { code: 'A', key: 'A', label: 'Property income (net of deductible expenses)', tone: 'engine', block: LINES, sub: 'income' },
  ] },
  { title: 'Deductible expenses', lines: [
    { code: 'EXP', key: 'EXPENSES', label: 'Deductible expenses — already subtracted within line A', tone: 'engine', block: LINES, sub: 'expense' },
  ] },
  { title: 'Component B', lines: [
    { code: 'B', key: 'B', label: 'Gains on disposition (derived)', tone: 'engine', block: LINES, sub: 'capgains' },
  ] },
  { title: 'Canadian 95(2) rules', lines: [
    { code: '95(2)', key: 'COMPUTATION_95_4', label: 'Canadian 95(2) rules amount', tone: 'manual', block: INP, edit: { key: 'canadianRules95_4' } },
  ] },
  { title: 'Other income components', lines: [
    { code: 'A.1', key: 'A1', label: 'Debt forgiveness (× 2)', tone: 'manual', block: INP, edit: { key: 'debtForgiveness', toInput: (v) => v / 2 } },
    { code: 'A.2', key: 'A2', label: 'Prior-year G', tone: 'manual', block: INP, edit: { key: 'priorYearG' } },
    { code: 'C', key: 'C', label: 'Controlled foreign affiliate income', tone: 'manual', block: INP, edit: { key: 'cfaIncome' } },
  ] },
  { title: 'Advanced deductions', lines: [
    { code: 'D', key: 'D', label: 'Business losses', tone: 'manual', block: INP, edit: { key: 'businessLosses' } },
    { code: 'E', key: 'E', label: 'FACL carryforward', tone: 'manual', block: INP, edit: { key: 'faclCarryforward' } },
    { code: 'F', key: 'F', label: 'Prescribed amount', tone: 'manual', block: INP, edit: { key: 'prescribedAmount' } },
    { code: 'F.1', key: 'F1', label: 'Prescribed amount (F.1)', tone: 'manual', block: INP, edit: { key: 'prescribedAmountF1' } },
    { code: 'G', key: 'G', label: 'Dividend deductions', tone: 'manual', block: INP, edit: { key: 'dividendDeductions' } },
    { code: 'H', key: 'H', label: 'Partnership dividends', tone: 'manual', block: INP, edit: { key: 'partnershipDividends' } },
  ] },
  { title: 'FAT calculation', lines: [
    { code: 'FAT', key: 'FAT_PAID', label: 'Foreign accrual tax paid', tone: 'manual', block: INP, edit: { key: 'fatPaid' } },
  ] },
];

const TONE_LABEL: Record<Tone, string> = { source: 'Source', engine: 'Engine', manual: 'Manual', ai: 'AI mapped' };

function Dot({ tone }: { tone: Tone }) {
  return <span style={{ width: 4, height: 4, borderRadius: '50%', background: TONES[tone], flexShrink: 0 }} />;
}

function AmountCell({ value, edit, onCommit, isRate, label }: { value: number; edit?: Edit; onCommit: (v: number) => void; isRate?: boolean; label?: string }) {
  const [draft, setDraft] = useState<string | null>(null);
  const text = isRate ? rate(value) : money(value);
  if (!edit) return <span style={{ fontSize: 12.5, color: INK, fontVariantNumeric: 'tabular-nums' }}>{text}</span>;
  return (
    <input
      aria-label={label}
      value={draft ?? text}
      onChange={(e) => setDraft(e.target.value)}
      onFocus={(e) => { setDraft(String(value)); e.currentTarget.select(); }}
      onBlur={() => { if (draft != null) { const n = Number(draft.replace(/,/g, '')); if (Number.isFinite(n)) onCommit(n); } setDraft(null); }}
      onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
      inputMode="decimal"
      style={{ width: 110, textAlign: 'right', fontSize: 12.5, fontVariantNumeric: 'tabular-nums', color: INK, background: 'transparent', border: `1px solid transparent`, borderRadius: 6, padding: '3px 7px', outline: 'none', cursor: 'text' }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = LINE; }}
      onMouseLeave={(e) => { if (document.activeElement !== e.currentTarget) e.currentTarget.style.borderColor = 'transparent'; }}
    />
  );
}

export default function FapiWorksheet() {
  const router = useRouter();
  const [uploaded, setUploaded] = useAtom(uploadedRowsAtom);
  const setBuilderFocus = useSetAtom(builderFocusTargetAtom);
  const [parsing, setParsing] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const stored = uploaded[FAPI_CONFIG.id];
  const rows: SourceRow[] = stored?.rows?.length ? stored.rows : FAPI_CONFIG.sampleRows;

  // Inputs + category overrides are SHARED with the chat run via runEditsAtom, so a
  // rate change, live-fetched FX, or re-categorization made during the run shows up
  // here too — and edits here flow back to the run. Rows already share via
  // uploadedRowsAtom; these are the run's other two decision surfaces.
  //
  // Only inputs that are SAFE to default are seeded. Classification-fed inputs
  // (lines A.1 / C / D / E) are produced by the rollup — seeding their default here
  // would inject it into the block config and clobber the classified value. They
  // enter `inputs` only once the user actually edits that line (via the shared
  // edits); until then the line shows the classified figure via `val()`, and
  // runTemplateCore's guard still protects it if it lands at its default.
  const edits = useAtomValue(runEditsAtom)[FAPI_CONFIG.id] ?? EMPTY_RUN_EDITS;
  const setRunInput = useSetAtom(setRunInputAtom);
  const defaults = useMemo(
    () => Object.fromEntries((FAPI_CONFIG.editableInputs ?? []).filter((i) => !i.classificationFed).map((i) => [i.key, i.default])),
    []
  );
  const inputs = useMemo(() => ({ ...defaults, ...edits.inputs }), [defaults, edits.inputs]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [sourcesOpen, setSourcesOpen] = useState(false);

  const core = useMemo(() => {
    try { return runTemplateCore(FAPI_CONFIG, { rows, overrides: buildOverrideRules(FAPI_CONFIG, rows, edits.overrides), inputs }); } catch { return null; }
  }, [rows, inputs, edits.overrides]);

  const cur = FAPI_CONFIG.currency;
  const fx = core?.summaryValues.FX_RATE ?? inputs.fxRate ?? 1;
  const val = (key: string) => core ? (core.lineValues[key] ?? core.summaryValues[key] ?? 0) : 0;
  const setInput = (key: string, v: number) => setRunInput({ id: FAPI_CONFIG.id, key, value: v });

  const openBuilder = (blockId: string) => { setBuilderFocus({ workflowId: FAPI_CONFIG.id, blockId }); router.push('/workflows-hub'); };

  // Inline in the Scope panel → publish the toolbar into the shared header instead
  // of drawing it in the worksheet body (which shares width with the chat).
  const embedded = useInlinePage();
  usePageMenu('fapi', embedded ? {
    right: [
      { kind: 'button', id: 'import', label: parsing ? 'Parsing…' : 'Import', icon: <Upload size={14} />, onClick: () => fileInput.current?.click(), disabled: parsing },
      { kind: 'button', id: 'sources', label: 'Sources', icon: <FileSpreadsheet size={14} />, active: sourcesOpen, onClick: () => setSourcesOpen((o) => !o) },
      { kind: 'button', id: 'builder', label: 'Builder', icon: <GitBranch size={14} />, onClick: () => openBuilder(LINES) },
    ],
  } : {}, [embedded, parsing, sourcesOpen]);

  const onImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (e.target) e.target.value = '';
    if (!f) return;
    setParsing(true);
    try {
      const { rows: parsed, fileName } = await parseUploadToRows(f);
      if (parsed.length) setUploaded((p) => ({ ...p, [FAPI_CONFIG.id]: { fileName, rows: parsed, at: Date.now() } }));
    } catch { /* ignore — keep current */ } finally { setParsing(false); }
  };

  const subRows = (kind: WLine['sub']): MappedRow[] => {
    const m = core?.detail.mapped ?? [];
    const isCap = (c: string) => /cap|gain/i.test(c);
    if (kind === 'income') return m.filter((r) => r.amount > 0 && !isCap(r.category));
    if (kind === 'expense') return m.filter((r) => r.amount < 0);
    if (kind === 'capgains') return m.filter((r) => isCap(r.category));
    return [];
  };

  const summaryRows = [
    { key: 'GROSS', label: 'Gross (property income net of expenses + gains)', bold: false },
    { key: 'DEDUCTIONS', label: 'Deductions (lines D–H — excludes operating expenses)', bold: false },
    { key: 'FAPI_BRUT', label: 'FAPI brut', bold: true },
    { key: 'FAT_DEDUCTION', label: 'FAT deduction', bold: false },
    { key: 'NET_FAPI', label: 'Net FAPI', bold: true },
  ];
  const cadOf = (key: string, v: number) => (key === 'NET_FAPI' ? (core?.summaryValues.NET_FAPI_CAD ?? v * fx) : v * fx);

  const chipStyle: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 500, color: MUTED, background: 'var(--sx-card)', border: `1px solid ${LINE}`, borderRadius: 8, padding: '5px 11px' };
  const toolBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: INK, background: 'var(--sx-card)', border: `1px solid ${LINE}`, borderRadius: 8, padding: '6px 11px', cursor: 'pointer' };

  return (
    <div style={{ minHeight: '100%', background: 'var(--sx-raised)', padding: '28px 20px 80px' }}>
      {/* Headless: publishes the live worksheet to the assistant (generic — any
          template worksheet mounts this). Retrieval actions live in use-assistant. */}
      <WorksheetCopilot config={FAPI_CONFIG} rows={rows} inputs={inputs} overrides={edits.overrides} />
      <style>{`@keyframes wsspin{to{transform:rotate(360deg)}} .ws-spin{animation:wsspin .9s linear infinite} .ws-row:hover{background:rgba(24,24,27,0.022)} .dark .ws-row:hover{background:rgba(255,255,255,0.03)} .ws-row:hover .ws-trace{opacity:1} .ws-src-sel{background:rgba(24,24,27,0.035)} .dark .ws-src-sel{background:rgba(255,255,255,0.06)}`}</style>
      <div style={{ maxWidth: sourcesOpen ? 1400 : 960, margin: '0 auto', display: 'flex', gap: 16, alignItems: 'flex-start', transition: 'max-width 220ms' }}>
        <div style={{ flex: 1, minWidth: 0 }}>

        {/* Header */}
        <div style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: FAINT }}>FAPI Worksheet</div>
          <div style={{ fontSize: 22, fontWeight: 680, color: INK, letterSpacing: '-0.01em', marginTop: 3 }}>Foreign accrual property income</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginTop: 13 }}>
            <span style={chipStyle}><span style={{ color: FAINT, fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Company</span> CANCO</span>
            <span style={chipStyle}><span style={{ color: FAINT, fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Affiliate</span> SAS Paris</span>
            <span style={chipStyle}><span style={{ color: FAINT, fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>FAPI year</span> 2025</span>
            <span style={{ flex: 1 }} />
            {/* Hidden file input — used by both the in-body button and the header menu's Import. */}
            <input ref={fileInput} type="file" accept=".xlsx,.xls" style={{ display: 'none' }} onChange={onImport} disabled={parsing} />
            {!embedded && (
              <>
                <button style={{ ...toolBtn, background: parsing ? MUTED : '#18181b', color: '#fff', border: 'none' }} onClick={() => fileInput.current?.click()} disabled={parsing}>
                  {parsing ? <Loader2 size={13} className="ws-spin" /> : <Upload size={13} />} {parsing ? 'Parsing…' : 'Import'}
                </button>
                <button style={toolBtn} onClick={() => openBuilder(LINES)}><GitBranch size={13} /> Builder</button>
                <button style={sourcesOpen ? { ...toolBtn, background: '#18181b', color: '#fff', border: 'none' } : toolBtn} onClick={() => setSourcesOpen((o) => !o)}><FileSpreadsheet size={13} /> Sources</button>
                <button style={{ ...toolBtn, color: FAINT, cursor: 'not-allowed' }} title="Assistant — coming soon" disabled><Sparkles size={13} /> Assistant</button>
              </>
            )}
          </div>
          <div style={{ fontSize: 11, color: FAINT, marginTop: 9 }}>
            {stored?.rows?.length ? <>Source: <b style={{ color: MUTED, fontWeight: 600 }}>{stored.fileName}</b> · {stored.rows.length} rows</> : <>Source: sample trial balance ({FAPI_CONFIG.sampleRows.length} rows) — Import a workbook to use your own.</>}
          </div>
        </div>

        {/* Worksheet card */}
        <div style={{ background: 'var(--sx-card)', border: `1px solid ${LINE}`, borderRadius: 16, boxShadow: '0 1px 2px rgba(24,24,27,0.04), 0 12px 32px rgba(24,24,27,0.05)', overflow: 'hidden' }}>
          {/* Column header */}
          <div style={{ display: 'flex', alignItems: 'center', padding: '10px 20px', borderBottom: `1px solid ${HAIRLINE}`, background: 'var(--sx-raised)' }}>
            <div style={{ width: 74, fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: FAINT }}>Line</div>
            <div style={{ flex: 1, fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: FAINT }}>Description</div>
            <div style={{ width: 130, textAlign: 'right', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: FAINT }}>Amount</div>
            <div style={{ width: 48, textAlign: 'right', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: FAINT }}>Ccy</div>
          </div>

          {SECTIONS.map((section) => (
            <div key={section.title}>
              <div style={{ padding: '11px 20px 4px', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: FAINT }}>{section.title}</div>
              {section.lines.map((ln) => {
                const isOpen = expanded === ln.key;
                const canExpand = Boolean(ln.sub);
                const v = val(ln.key);
                return (
                  <div key={ln.key}>
                    <div className="ws-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 20px', borderTop: `1px solid ${HAIRLINE}`, cursor: canExpand ? 'pointer' : 'default', transition: 'background 140ms' }} onClick={canExpand ? () => setExpanded(isOpen ? null : ln.key) : undefined}>
                      <div style={{ width: 74, display: 'flex', alignItems: 'center', gap: 8 }}>
                        {canExpand ? <ChevronRight size={13} style={{ color: FAINT, transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 150ms', flexShrink: 0 }} /> : <span style={{ width: 13, flexShrink: 0 }} />}
                        <Dot tone={ln.tone} />
                        <span style={{ fontSize: 10.5, fontWeight: 650, color: MUTED, background: 'var(--sx-panel)', border: `1px solid ${HAIRLINE}`, borderRadius: 5, padding: '1px 6px', fontVariantNumeric: 'tabular-nums' }}>{ln.code}</span>
                      </div>
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 12.5, color: INK }}>{ln.label}</span>
                        <button className="ws-trace" onClick={(e) => { e.stopPropagation(); openBuilder(ln.block); }} title={`Trace ${ln.code} in the builder`} style={{ opacity: 0, transition: 'opacity 140ms', display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, color: FAINT, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><GitBranch size={10} /> trace</button>
                      </div>
                      <div style={{ width: 130, display: 'flex', justifyContent: 'flex-end' }} onClick={(e) => e.stopPropagation()}>
                        <AmountCell value={v} edit={ln.edit} isRate={ln.isRate} label={ln.label} onCommit={(n) => setInput(ln.edit!.key, ln.edit!.toInput ? ln.edit!.toInput(n) : n)} />
                      </div>
                      <div style={{ width: 48, textAlign: 'right', fontSize: 10.5, fontWeight: 600, color: FAINT }}>{ln.isRate ? 'RATE' : cur}</div>
                    </div>
                    {isOpen && canExpand && (
                      <div style={{ padding: '4px 20px 10px 102px', background: 'var(--sx-raised)', borderTop: `1px solid ${HAIRLINE}` }}>
                        {subRows(ln.sub).length === 0 && <div style={{ fontSize: 11, color: FAINT, padding: '6px 0' }}>No classified rows in this bucket yet.</div>}
                        {subRows(ln.sub).map((r) => (
                          <div key={r.rowId} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                            <Dot tone="ai" />
                            <span style={{ fontSize: 11.5, color: INK, flex: 1, minWidth: 0 }}>{r.label}
                              {r.keyword && <span style={{ color: FAINT, fontSize: 10, marginLeft: 6 }}>matched “{r.keyword}” · {Math.round((r.confidence || 0) * 100)}%</span>}
                            </span>
                            <span style={{ fontSize: 11.5, color: MUTED, fontVariantNumeric: 'tabular-nums' }}>{money(Math.abs(r.amount))} {cur}</span>
                          </div>
                        ))}
                        {ln.sub === 'income' && (core?.detail.unmatched.length ?? 0) > 0 && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0', color: '#b08248' }}>
                            <span style={{ width: 5, height: 5, borderRadius: '50%', border: `1px solid ${hexA(TONES.manual, 0.85)}`, boxSizing: 'border-box' }} />
                            <span style={{ fontSize: 11, flex: 1 }}>{core?.detail.unmatched.length} unclassified row(s) — not in any line</span>
                          </div>
                        )}
                        {ln.sub === 'income' && <AssumptionRow label="P-coefficient" value={inputs.pCoefficient} step={0.05} onCommit={(n) => setInput('pCoefficient', n)} />}
                        {ln.sub === 'capgains' && <AssumptionRow label="Inclusion rate" value={inputs.inclusionRate} step={0.05} onCommit={(n) => setInput('inclusionRate', n)} />}
                      </div>
                    )}
                  </div>
                );
              })}
              {section.title === 'FAT calculation' && (
                <RtfSelectorRow value={inputs.rtf ?? 4} onCommit={(v) => setInput('rtf', v)} />
              )}
            </div>
          ))}

          {/* Results summary */}
          <div style={{ borderTop: `2px solid ${LINE}`, background: 'var(--sx-raised)' }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: '11px 20px 6px' }}>
              <span style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: FAINT }}>Results summary</span>
              <span style={{ marginLeft: 'auto', fontSize: 10.5, color: FAINT }}>FX {rate(fx)} · Net FAPI shown at the annual-average rate</span>
              <button style={{ marginLeft: 12, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: MUTED, background: 'none', border: 'none', cursor: 'pointer' }}><Download size={11} /> Export</button>
            </div>
            <div style={{ display: 'flex', padding: '0 20px 4px' }}>
              <div style={{ flex: 1 }} />
              <div style={{ width: 150, textAlign: 'right', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: FAINT }}>{cur}</div>
              <div style={{ width: 150, textAlign: 'right', fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', color: FAINT }}>CAD</div>
            </div>
            {summaryRows.map((r) => {
              const v = core?.summaryValues[r.key] ?? 0;
              return (
                <div key={r.key} className="ws-row" style={{ display: 'flex', alignItems: 'center', padding: '7px 20px' }}>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Dot tone="engine" />
                    <span style={{ fontSize: 12.5, color: r.bold ? INK : MUTED, fontWeight: r.bold ? 680 : 500 }}>{r.label}</span>
                    <button className="ws-trace" onClick={() => openBuilder(SUM)} style={{ opacity: 0, transition: 'opacity 140ms', display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 10, color: FAINT, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}><GitBranch size={10} /> trace</button>
                  </div>
                  <div style={{ width: 150, textAlign: 'right', fontSize: 12.5, fontWeight: r.bold ? 700 : 500, color: r.bold ? INK : MUTED, fontVariantNumeric: 'tabular-nums' }}>{money(v)}</div>
                  <div style={{ width: 150, textAlign: 'right', fontSize: 12.5, fontWeight: r.bold ? 700 : 500, color: r.bold ? INK : MUTED, fontVariantNumeric: 'tabular-nums' }}>{money(cadOf(r.key, v))}</div>
                </div>
              );
            })}
            <div style={{ height: 12 }} />
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 14, padding: '0 4px' }}>
          {(Object.keys(TONES) as Tone[]).map((t) => (
            <span key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 10.5, color: MUTED }}><Dot tone={t} /> {TONE_LABEL[t]}</span>
          ))}
        </div>
        </div>

        {sourcesOpen && (
          <SourcesPanel
            rows={rows}
            mapped={core?.detail.mapped ?? []}
            unmatched={core?.detail.unmatched ?? []}
            fileName={stored?.fileName}
            cur={cur}
            onClose={() => setSourcesOpen(false)}
            onTrace={() => openBuilder('fapi-logic-keyword-mapper')}
          />
        )}
      </div>
    </div>
  );
}

// ── Docked Sources file-viewer — the raw trial balance + per-row provenance ────
function SourcesPanel({ rows, mapped, unmatched, fileName, cur, onClose, onTrace }: {
  rows: SourceRow[]; mapped: MappedRow[]; unmatched: { rowId: string; label: string; amount: number }[];
  fileName?: string; cur: string; onClose: () => void; onTrace: () => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const mapById = useMemo(() => new Map(mapped.map((m) => [m.rowId, m])), [mapped]);
  const unmatchedIds = useMemo(() => new Set(unmatched.map((u) => u.rowId)), [unmatched]);
  const sel = selected ? rows.find((r) => r.rowId === selected) : null;
  const selMap = selected ? mapById.get(selected) : undefined;

  const kv = (l: string, v: React.ReactNode) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '2px 0' }}>
      <span style={{ fontSize: 11, color: MUTED }}>{l}</span>
      <span style={{ fontSize: 11, color: INK, fontWeight: 600, textAlign: 'right' }}>{v}</span>
    </div>
  );

  return (
    <div style={{ width: 400, flexShrink: 0, position: 'sticky', top: 20, maxHeight: 'calc(100vh - 40px)', display: 'flex', flexDirection: 'column', background: 'var(--sx-card)', border: `1px solid ${LINE}`, borderRadius: 16, boxShadow: '0 1px 2px rgba(24,24,27,0.04), 0 12px 32px rgba(24,24,27,0.05)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '12px 16px', borderBottom: `1px solid ${HAIRLINE}` }}>
        <FileSpreadsheet size={14} style={{ color: MUTED }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: FAINT }}>Sources · file viewer</div>
          <div style={{ fontSize: 12, color: INK, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 300 }}>{fileName ?? 'Sample trial balance'}</div>
        </div>
        <button onClick={onClose} title="Close" style={{ marginLeft: 'auto', display: 'inline-flex', color: MUTED, background: 'none', border: 'none', cursor: 'pointer', padding: 2 }}><X size={15} /></button>
      </div>

      <div style={{ overflow: 'auto', flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px', position: 'sticky', top: 0, background: 'var(--sx-raised)', borderBottom: `1px solid ${HAIRLINE}`, zIndex: 1 }}>
          <span style={{ width: 6, flexShrink: 0 }} />
          <span style={{ flex: 1, fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: FAINT }}>Account / description</span>
          <span style={{ width: 92, textAlign: 'right', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: FAINT }}>Amount</span>
        </div>
        {rows.map((r) => {
          const m = mapById.get(r.rowId);
          const un = unmatchedIds.has(r.rowId) || !m;
          const isSel = selected === r.rowId;
          return (
            <div key={r.rowId} className={isSel ? 'ws-src-sel' : undefined} onClick={() => setSelected(isSel ? null : r.rowId)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderBottom: `1px solid ${HAIRLINE}`, cursor: 'pointer' }}>
              {un
                ? <span style={{ width: 5, height: 5, borderRadius: '50%', border: `1px solid ${hexA(TONES.manual, 0.85)}`, boxSizing: 'border-box', flexShrink: 0 }} />
                : <Dot tone="ai" />}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11.5, color: INK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.label}</div>
                <div style={{ fontSize: 10, color: FAINT, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.account ? `acct ${r.account} · ` : ''}{m ? m.category : 'unclassified'}</div>
              </div>
              <span style={{ fontSize: 11.5, color: MUTED, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>{money(r.amount)}</span>
            </div>
          );
        })}
      </div>

      {sel && (
        <div style={{ borderTop: `1px solid ${LINE}`, background: 'var(--sx-raised)', padding: '12px 16px' }}>
          <div style={{ fontSize: 12.5, fontWeight: 650, color: INK }}>{sel.label}</div>
          {sel.description && <div style={{ fontSize: 11, color: MUTED, marginTop: 1, marginBottom: 6 }}>{sel.description}</div>}
          <div style={{ marginTop: 6 }}>
            {selMap
              ? <>
                  {kv('Classified as', <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}><Dot tone="ai" /> {selMap.category}</span>)}
                  {selMap.keyword ? kv('Matched keyword', `“${selMap.keyword}”`) : null}
                  {kv('Confidence', `${Math.round((selMap.confidence || 0) * 100)}%`)}
                </>
              : <div style={{ fontSize: 11.5, color: '#b08248', padding: '2px 0' }}>Not matched by any rule — not included in any FAPI line.</div>}
            {kv('Amount', `${money(sel.amount)} ${sel.currency ?? cur}`)}
          </div>
          <button onClick={onTrace} style={{ marginTop: 10, display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11.5, fontWeight: 550, color: INK, background: 'var(--sx-card)', border: `1px solid ${LINE}`, borderRadius: 7, padding: '5px 10px', cursor: 'pointer' }}><GitBranch size={11} /> See the mapper in the builder</button>
        </div>
      )}
    </div>
  );
}

// The relevant tax factor (s.248(1)) is a taxpayer-type CHOICE, not a free number:
// corporation → 4.0, individual/trust → 1.9. Rendered as an explicit labeled toggle
// (never a silent default) so the preparer consciously picks it; committing re-runs
// the engine, so the FAT deduction (= min(FAT × RTF, FAPI brut)) recomputes live.
function RtfSelectorRow({ value, onCommit }: { value: number; onCommit: (v: number) => void }) {
  const options = [
    { v: 4, label: 'Corporation', factor: '4.0' },
    { v: 1.9, label: 'Individual / trust', factor: '1.9' },
  ];
  // Anything that isn't the individual factor is treated as the corporate one.
  const isIndividual = Math.abs(value - 1.9) < 1e-7;
  return (
    <div className="ws-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 20px', borderTop: `1px solid ${HAIRLINE}` }}>
      <div style={{ width: 74, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 13, flexShrink: 0 }} />
        <Dot tone="manual" />
        <span style={{ fontSize: 10.5, fontWeight: 650, color: MUTED, background: 'var(--sx-panel)', border: `1px solid ${HAIRLINE}`, borderRadius: 5, padding: '1px 6px', fontVariantNumeric: 'tabular-nums' }}>RTF</span>
      </div>
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ fontSize: 12.5, color: INK }}>Relevant tax factor · s.248(1)</span>
        <span style={{ fontSize: 10.5, color: FAINT }}>Taxpayer type sets the ss.91(4) FAT-deduction multiplier</span>
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {options.map((o) => {
          const active = o.v === 1.9 ? isIndividual : !isIndividual;
          return (
            <button
              key={o.v}
              onClick={() => onCommit(o.v)}
              title={`Use RTF ${o.factor} — ${o.label}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 550, cursor: 'pointer', color: active ? '#fff' : MUTED, background: active ? INK : 'transparent', border: `1px solid ${active ? INK : LINE}`, borderRadius: 8, padding: '5px 10px', transition: 'background 140ms, color 140ms' }}
            >
              {o.label}
              <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, opacity: active ? 1 : 0.7 }}>{o.factor}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function AssumptionRow({ label, value, step, onCommit }: { label: string; value: number; step: number; onCommit: (v: number) => void }) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0 2px', marginTop: 4, borderTop: `1px dashed ${HAIRLINE}` }}>
      <span style={{ fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', color: FAINT }}>Assumption</span>
      <span style={{ fontSize: 11.5, color: MUTED, flex: 1 }}>{label}</span>
      <input
        value={draft ?? String(value)}
        onChange={(e) => setDraft(e.target.value)}
        onFocus={(e) => { setDraft(String(value)); e.currentTarget.select(); }}
        onBlur={() => { if (draft != null) { const n = Number(draft.replace(/,/g, '')); if (Number.isFinite(n)) onCommit(n); } setDraft(null); }}
        onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
        inputMode="decimal"
        step={step}
        style={{ width: 80, textAlign: 'right', fontSize: 11.5, fontVariantNumeric: 'tabular-nums', color: INK, border: `1px solid ${LINE}`, borderRadius: 6, padding: '3px 8px', outline: 'none' }}
      />
    </div>
  );
}
