

// ─────────────────────────────────────────────────────────────────────────────
// Expense Reimbursement Worksheet — the result surface for the Employee Expense
// Reimbursement workflow.
//
// Computes from the REAL engine (runTemplateCore over EXPENSE_CONFIG) on the
// SHARED uploaded rows + run edits, so the worksheet, the chat run, and the
// builder canvas all show identical numbers. Mounts the generic WorksheetCopilot
// so the assistant can answer questions about every line without pasting it in.
// ─────────────────────────────────────────────────────────────────────────────

import { useMemo, useRef, useState } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from '@/lib/router';
import { Upload, GitBranch, Loader2 } from 'lucide-react';
import { runTemplateCore, buildOverrideRules, type SourceRow } from '@/shared/workflow-engine/runtime/workflow-runs';
import { EXPENSE_CONFIG } from '@/shared/workflow-engine/runtime/workflow-runs/expense';
import { parseUploadToRows } from '@/shared/workflow-engine/runtime/workflow-runs/parse-upload';
import { uploadedRowsAtom, runEditsAtom, setRunInputAtom, EMPTY_RUN_EDITS } from '@/shared/stores/workspace-store';
import { builderFocusTargetAtom } from '@/shared/workflow-engine/state/workflow-store';
import { WorksheetCopilot } from '@/features/assistant/ui/worksheet-copilot';

const INK = '#18181b', MUTED = '#71717a', FAINT = '#a1a1aa';
const LINE = 'rgba(24,24,27,0.10)', HAIRLINE = 'rgba(24,24,27,0.07)';
const TONES = { source: '#7fb2d9', engine: '#7cc3a6', manual: '#dab06c' } as const;
type Tone = keyof typeof TONES;

const money = (n: number) => n.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const rate = (n: number) => n.toLocaleString('en-CA', { minimumFractionDigits: 4, maximumFractionDigits: 6 });

const LINES = 'expense-logic-lines', SUM = 'expense-logic-summary', ROLL = 'expense-logic-rollup', SRC = 'expense-source-fx', POL = 'expense-source-policy';

function Dot({ tone }: { tone: Tone }) {
  return <span style={{ width: 4, height: 4, borderRadius: '50%', background: TONES[tone], flexShrink: 0 }} />;
}

// The category buckets (from the rollup) shown as the "submitted" breakdown.
const BUCKETS: { key: string; label: string }[] = [
  { key: 'travel_total', label: 'Travel' },
  { key: 'lodging_total', label: 'Lodging' },
  { key: 'meals_total', label: 'Meals & entertainment' },
  { key: 'supplies_total', label: 'Supplies & software' },
  { key: 'mileage_total', label: 'Personal vehicle mileage' },
  { key: 'nonreimbursable_total', label: 'Non-reimbursable (policy)' },
];

const LINE_ROWS: { key: string; label: string }[] = [
  { key: 'TRAVEL_REIMBURSABLE', label: 'Travel (reimbursable)' },
  { key: 'LODGING_REIMBURSABLE', label: 'Lodging (reimbursable)' },
  { key: 'MEALS_REIMBURSABLE', label: 'Meals (capped at per-diem)' },
  { key: 'SUPPLIES_REIMBURSABLE', label: 'Supplies (reimbursable)' },
  { key: 'MILEAGE_REIMBURSABLE', label: 'Mileage (reimbursable)' },
  { key: 'MEALS_OVER_CAP', label: 'Meals over cap (disallowed)' },
];

const SUMMARY_ROWS: { key: string; label: string; strong?: boolean }[] = [
  { key: 'SUBMITTED_TOTAL', label: 'Submitted total' },
  { key: 'TOTAL_REIMBURSABLE', label: 'Total reimbursable' },
  { key: 'POLICY_DISALLOWED', label: 'Policy-disallowed' },
  { key: 'NET_PAYABLE', label: 'Net payable to employee', strong: true },
];

export default function ExpenseWorksheet() {
  const router = useRouter();
  const [uploaded, setUploaded] = useAtom(uploadedRowsAtom);
  const setBuilderFocus = useSetAtom(builderFocusTargetAtom);
  const [parsing, setParsing] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const stored = uploaded[EXPENSE_CONFIG.id];
  const rows: SourceRow[] = stored?.rows?.length ? stored.rows : EXPENSE_CONFIG.sampleRows;

  // Inputs are SHARED with the chat run via runEditsAtom — a cap or FX change made
  // here shows up in the run and vice-versa.
  const edits = useAtomValue(runEditsAtom)[EXPENSE_CONFIG.id] ?? EMPTY_RUN_EDITS;
  const setRunInput = useSetAtom(setRunInputAtom);
  const defaults = useMemo(
    () => Object.fromEntries((EXPENSE_CONFIG.editableInputs ?? []).map((i) => [i.key, i.default])),
    []
  );
  const inputs = useMemo(() => ({ ...defaults, ...edits.inputs }), [defaults, edits.inputs]);

  const core = useMemo(() => {
    try { return runTemplateCore(EXPENSE_CONFIG, { rows, overrides: buildOverrideRules(EXPENSE_CONFIG, rows, edits.overrides), inputs }); } catch { return null; }
  }, [rows, inputs, edits.overrides]);

  const cur = EXPENSE_CONFIG.currency;
  const fx = core?.summaryValues.FX_RATE ?? inputs.fxRate ?? 1;
  const netCad = core?.summaryValues.NET_PAYABLE_CAD ?? 0;
  const bucket = (key: string) => core?.detail.buckets.find((b) => b.key === key)?.value ?? 0;
  const val = (key: string) => core ? (core.lineValues[key] ?? core.summaryValues[key] ?? 0) : 0;
  const setInput = (key: string, v: number) => setRunInput({ id: EXPENSE_CONFIG.id, key, value: v });
  const openBuilder = (blockId: string) => { setBuilderFocus({ workflowId: EXPENSE_CONFIG.id, blockId }); router.push('/builder'); };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setParsing(true);
    try {
      const { fileName, rows: parsed } = await parseUploadToRows(file);
      setUploaded((prev) => ({ ...prev, [EXPENSE_CONFIG.id]: { fileName, rows: parsed, at: Date.now() } }));
    } catch (e) {
      // eslint-disable-next-line no-alert
      alert(e instanceof Error ? e.message : 'Could not read that workbook.');
    } finally {
      setParsing(false);
    }
  };

  const th: React.CSSProperties = { fontSize: 10.5, letterSpacing: 0.4, textTransform: 'uppercase', color: FAINT, fontWeight: 600, padding: '6px 10px', textAlign: 'left' };
  const tdL: React.CSSProperties = { fontSize: 12.5, color: INK, padding: '7px 10px' };
  const tdR: React.CSSProperties = { fontSize: 12.5, color: INK, padding: '7px 10px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' };

  return (
    <div style={{ padding: 20, maxWidth: 860, margin: '0 auto', color: INK }}>
      {/* Publishes the live snapshot + registers intel so the assistant can answer
          questions about this worksheet. Renders nothing. */}
      <WorksheetCopilot config={EXPENSE_CONFIG} rows={rows} inputs={inputs} overrides={edits.overrides} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: -0.2 }}>Expense Reimbursement</div>
          <div style={{ fontSize: 12, color: MUTED, marginTop: 2 }}>
            {stored?.rows?.length ? `${stored.fileName} · ${rows.length} receipts` : `Sample report · ${rows.length} receipts`}
            {core?.unmatched.length ? ` · ${core.unmatched.length} unclassified` : ''}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input ref={fileInput} type="file" accept=".xlsx,.xls" hidden onChange={(e) => onFile(e.target.files?.[0])} />
          <button onClick={() => fileInput.current?.click()} disabled={parsing} style={btn}>
            {parsing ? <Loader2 size={13} className="animate-spin" /> : <Upload size={13} />} {parsing ? 'Parsing…' : 'Import'}
          </button>
        </div>
      </div>

      {/* Editable policy inputs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 20 }}>
        <InputCard label="Meal per-diem cap" value={inputs.mealCap ?? 250} onCommit={(v) => setInput('mealCap', v)} prefix={cur + ' '} />
        <InputCard label="FX rate (USD → CAD)" value={inputs.fxRate ?? 1.35} onCommit={(v) => setInput('fxRate', v)} isRate />
      </div>

      {/* Net payable headline */}
      <div style={{ border: `1px solid ${LINE}`, borderRadius: 12, padding: '16px 18px', marginBottom: 20, background: 'rgba(124,195,166,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Net payable to employee</div>
          <div style={{ fontSize: 26, fontWeight: 650, letterSpacing: -0.4, marginTop: 3 }}>{money(val('NET_PAYABLE'))} <span style={{ fontSize: 14, color: MUTED }}>{cur}</span></div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: MUTED }}>≈ CAD @ {rate(fx)}</div>
          <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>{money(netCad)} <span style={{ fontSize: 12, color: MUTED }}>CAD</span></div>
        </div>
      </div>

      {/* Submitted by category */}
      <Section title="Submitted by category" tone="source" onTrace={() => openBuilder(ROLL)}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={th}>Category</th><th style={{ ...th, textAlign: 'right' }}>Submitted</th></tr></thead>
          <tbody>
            {BUCKETS.map((b) => (
              <tr key={b.key} style={{ borderTop: `1px solid ${HAIRLINE}` }}>
                <td style={tdL}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Dot tone="source" /> {b.label}</span></td>
                <td style={tdR}>{money(bucket(b.key))}</td>
              </tr>
            ))}
            <tr style={{ borderTop: `1px solid ${LINE}` }}>
              <td style={{ ...tdL, fontWeight: 600 }}>Submitted total</td>
              <td style={{ ...tdR, fontWeight: 600 }}>{money(val('SUBMITTED_TOTAL'))}</td>
            </tr>
          </tbody>
        </table>
      </Section>

      {/* Reimbursable after policy */}
      <Section title="Reimbursable after policy" tone="engine" onTrace={() => openBuilder(LINES)}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr><th style={th}>Line</th><th style={{ ...th, textAlign: 'right' }}>Amount</th></tr></thead>
          <tbody>
            {LINE_ROWS.map((r) => (
              <tr key={r.key} style={{ borderTop: `1px solid ${HAIRLINE}` }}>
                <td style={tdL}><span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}><Dot tone="engine" /> {r.label}</span></td>
                <td style={{ ...tdR, color: r.key === 'MEALS_OVER_CAP' && val(r.key) > 0 ? '#b45309' : INK }}>{money(val(r.key))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      {/* Summary */}
      <Section title="Summary" tone="engine" onTrace={() => openBuilder(SUM)}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {SUMMARY_ROWS.map((r) => (
              <tr key={r.key} style={{ borderTop: `1px solid ${HAIRLINE}` }}>
                <td style={{ ...tdL, fontWeight: r.strong ? 600 : 400 }}>{r.label}</td>
                <td style={{ ...tdR, fontWeight: r.strong ? 650 : 400 }}>{money(val(r.key))} <span style={{ color: FAINT, fontSize: 11 }}>{cur}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <div style={{ fontSize: 11, color: FAINT, marginTop: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
        <GitBranch size={11} /> Computed live from the workflow engine — the same numbers the chat run and the builder canvas show.
      </div>
    </div>
  );
}

const btn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: INK, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 8, padding: '6px 11px', cursor: 'pointer' };

function Section({ title, tone, onTrace, children }: { title: string; tone: Tone; onTrace?: () => void; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: INK, display: 'inline-flex', alignItems: 'center', gap: 7 }}><Dot tone={tone} /> {title}</div>
        {onTrace && <button onClick={onTrace} style={{ fontSize: 11, color: MUTED, background: 'transparent', border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4 }}><GitBranch size={11} /> trace</button>}
      </div>
      <div style={{ border: `1px solid ${LINE}`, borderRadius: 10, overflow: 'hidden' }}>{children}</div>
    </div>
  );
}

function InputCard({ label, value, onCommit, isRate, prefix }: { label: string; value: number; onCommit: (v: number) => void; isRate?: boolean; prefix?: string }) {
  const [draft, setDraft] = useState<string | null>(null);
  const text = isRate ? rate(value) : money(value);
  return (
    <div style={{ border: `1px solid ${LINE}`, borderRadius: 10, padding: '9px 12px', minWidth: 170 }}>
      <div style={{ fontSize: 10.5, color: MUTED, textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: 600 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 3 }}>
        {prefix && <span style={{ fontSize: 12, color: FAINT }}>{prefix}</span>}
        <input
          value={draft ?? text}
          onChange={(e) => setDraft(e.target.value)}
          onFocus={(e) => { setDraft(String(value)); e.currentTarget.select(); }}
          onBlur={() => { if (draft != null) { const n = Number(draft.replace(/,/g, '')); if (Number.isFinite(n)) onCommit(n); } setDraft(null); }}
          onKeyDown={(e) => { if (e.key === 'Enter') (e.target as HTMLInputElement).blur(); }}
          inputMode="decimal"
          style={{ width: 96, fontSize: 15, fontWeight: 600, color: INK, background: 'transparent', border: 'none', outline: 'none', fontVariantNumeric: 'tabular-nums', padding: 0 }}
        />
      </div>
    </div>
  );
}
