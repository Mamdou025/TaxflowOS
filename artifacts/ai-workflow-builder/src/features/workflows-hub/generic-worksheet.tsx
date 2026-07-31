

// GenericWorksheet — a config-driven Results view for any runnable workflow that
// doesn't have a bespoke worksheet. Computes with the SAME engine the run uses
// (runTemplateCore over the shared uploaded rows + run edits), so it shows the run
// you just did. Renders the lines + summary; the headline is emphasized.

import { useAtomValue } from 'jotai';
import { uploadedRowsAtom, runEditsAtom, EMPTY_RUN_EDITS } from '@/shared/stores/workspace-store';
import { runTemplateCore, buildOverrideRules, type TemplateConfig } from '@/shared/workflow-engine/runtime/workflow-runs';
import { NEU } from '@/components/neumorphic-sidebar';

const isRate = (k: string, label: string) => /_RATE$|^FX/i.test(k) || /rate/i.test(label);
const fmt = (v: number, rate: boolean) =>
  rate ? v.toLocaleString(undefined, { maximumFractionDigits: 4 }) : v.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// A line/summary label often states its own currency, e.g. "Net surplus movement (CAD)".
// Trust that over the workflow's document currency (config.currency) — post-FX reporting
// figures are in CAD even when the source document is in USD, so a CAD-labelled figure
// must not be suffixed "USD".
const CURRENCY_IN_LABEL = /\b(CAD|USD|EUR|GBP)\b/;
const unitFor = (label: string, fallback: string) => {
  const m = label.toUpperCase().match(CURRENCY_IN_LABEL);
  return m ? m[1] : fallback;
};

export function GenericWorksheet({ config, representative = false }: { config: TemplateConfig; representative?: boolean }) {
  const uploaded = useAtomValue(uploadedRowsAtom);
  const edits = useAtomValue(runEditsAtom);
  const rows = uploaded[config.id]?.rows ?? config.sampleRows;
  const e = edits[config.id] ?? EMPTY_RUN_EDITS;
  const overrides = buildOverrideRules(config, rows, e.overrides);
  const core = runTemplateCore(config, { rows, overrides, inputs: e.inputs });
  const usingSample = !uploaded[config.id]?.rows?.length;

  const headline = core.detail.summary.find((s) => s.key === config.headlineKey);

  const Row = ({ label, value, rate, strong }: { label: string; value: number; rate: boolean; strong?: boolean }) => (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '9px 2px', borderBottom: '1px solid var(--sx-divider)' }}>
      <span style={{ fontSize: 13, color: strong ? NEU.text : NEU.muted, fontWeight: strong ? 700 : 500 }}>{label}</span>
      <span style={{ fontSize: strong ? 15 : 13, color: strong ? NEU.accent : NEU.text, fontWeight: strong ? 750 : 600, fontVariantNumeric: 'tabular-nums' }}>
        {fmt(value, rate)}{!rate && <span style={{ fontSize: 10.5, color: NEU.faint, marginLeft: 4 }}>{unitFor(label, config.currency)}</span>}
      </span>
    </div>
  );

  const Section = ({ title, rows: rr }: { title: string; rows: { key: string; label: string; value: number }[] }) => (
    <div style={{ marginTop: 20 }}>
      <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: NEU.faint, marginBottom: 6 }}>{title}</div>
      {rr.map((r) => <Row key={r.key} label={r.label} value={r.value} rate={isRate(r.key, r.label)} strong={r.key === config.headlineKey} />)}
    </div>
  );

  return (
    <div style={{ padding: '22px 26px 40px', maxWidth: 720 }}>
      <div style={{ fontSize: 19, fontWeight: 750, color: NEU.text, letterSpacing: '-0.01em' }}>{config.name} — worksheet</div>

      {representative && (
        <div style={{ marginTop: 12, padding: '9px 13px', borderRadius: 10, background: 'var(--sx-accent-soft)', color: NEU.accent, fontSize: 12, fontWeight: 600 }}>
          Representative figures — a demo income/expense computation, not authoritative tax math.
        </div>
      )}
      <div style={{ marginTop: 8, fontSize: 12, color: NEU.muted }}>
        {usingSample ? 'Computed on the sample data. Run the workflow with your own workbook to see real figures.' : 'Computed on your uploaded data.'}
      </div>

      {headline && (
        <div style={{ marginTop: 16, padding: '16px 18px', borderRadius: 14, background: NEU.surface, boxShadow: NEU.shadowSm, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13.5, fontWeight: 650, color: NEU.text }}>{headline.label}</span>
          <span style={{ fontSize: 22, fontWeight: 780, color: NEU.accent, fontVariantNumeric: 'tabular-nums' }}>
            {fmt(headline.value, false)} <span style={{ fontSize: 12, color: NEU.muted }}>{unitFor(headline.label, config.currency)}</span>
          </span>
        </div>
      )}

      {core.detail.lines.length > 0 && <Section title="Lines" rows={core.detail.lines} />}
      <Section title="Summary" rows={core.detail.summary} />
    </div>
  );
}
