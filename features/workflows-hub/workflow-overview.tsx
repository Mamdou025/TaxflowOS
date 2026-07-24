'use client';

// WorkflowOverview — the "see what they built" mode of a workflow page. Presents
// a PortfolioWorkflowDef (from templates/portfolio) as a readable, manager-facing
// process view — inputs, steps, professional-judgment checkpoints, deliverables —
// WITHOUT the builder canvas. Pure/presentational: one component renders any of
// the 15 blueprints from its declarative spec.

import { Download, FileInput, Flag, Sparkles, Workflow as WorkflowIcon } from 'lucide-react';
import type { PortfolioWorkflowDef, PortfolioBlockSpec } from '@/shared/workflow-engine/templates/portfolio/portfolio-workflows';
import { NEU } from '@/components/neumorphic-sidebar';

const familyOf = (catalogId: string) => catalogId.split(':')[0];
const isCheckpoint = (b: PortfolioBlockSpec) => b.id.startsWith('chk');

function Section({ icon, label, count, children }: { icon: React.ReactNode; label: string; count: number; children: React.ReactNode }) {
  if (count === 0) return null;
  return (
    <div style={{ marginTop: 26 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ width: 26, height: 26, borderRadius: 8, background: NEU.bg, boxShadow: NEU.shadowSm, display: 'grid', placeItems: 'center', color: NEU.accent }}>{icon}</span>
        <span style={{ fontSize: 12.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: NEU.text }}>{label}</span>
        <span style={{ fontSize: 11, color: NEU.faint, fontWeight: 600 }}>{count}</span>
      </div>
      {children}
    </div>
  );
}

function Item({ title, desc, badge }: { title: string; desc: string; badge?: string }) {
  return (
    <div style={{ background: NEU.surface, borderRadius: 12, boxShadow: NEU.shadowSm, padding: '11px 14px', marginBottom: 8 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: 650, color: NEU.text }}>{title}</span>
        {badge && (
          <span style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', color: NEU.accent, background: 'var(--sx-accent-soft)', borderRadius: 999, padding: '2px 7px' }}>{badge}</span>
        )}
      </div>
      <div style={{ fontSize: 12, lineHeight: 1.5, color: NEU.muted, marginTop: 3 }}>{desc}</div>
    </div>
  );
}

const GROUP_LABEL: Record<string, string> = { platform: 'Platform service', foundation: 'Foundation', tier1: 'Tier 1' };

export function WorkflowOverview({ def }: { def: PortfolioWorkflowDef }) {
  const inputs = def.blocks.filter((b) => familyOf(b.catalogId) === 'source' && !isCheckpoint(b));
  const checkpoints = def.blocks.filter(isCheckpoint);
  const steps = def.blocks
    .filter((b) => familyOf(b.catalogId) === 'logic' || familyOf(b.catalogId) === 'ai')
    .sort((a, b) => a.stage - b.stage || a.row - b.row);
  const deliverables = def.blocks.filter((b) => familyOf(b.catalogId) === 'output');
  const views = def.blocks.filter((b) => familyOf(b.catalogId) === 'field');

  const stat = (n: number, label: string) => (
    <span style={{ fontSize: 12, color: NEU.muted }}>
      <b style={{ color: NEU.text, fontWeight: 700 }}>{n}</b> {label}
    </span>
  );

  return (
    <div style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: NEU.accent, background: 'var(--sx-accent-soft)', borderRadius: 999, padding: '3px 9px' }}>
          {GROUP_LABEL[def.group] ?? def.group}
        </span>
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.6, color: NEU.muted, marginTop: 14 }}>{def.description}</div>

      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 16, padding: '12px 16px', background: NEU.bg, borderRadius: 12, boxShadow: NEU.shadowIn }}>
        {stat(inputs.length, 'inputs')}
        {stat(steps.length, 'steps')}
        {stat(checkpoints.length, 'judgment checkpoints')}
        {stat(deliverables.length, 'deliverables')}
      </div>

      <Section icon={<FileInput size={15} />} label="Inputs" count={inputs.length}>
        {inputs.map((b) => <Item key={b.id} title={b.label} desc={b.description} />)}
      </Section>

      <Section icon={<WorkflowIcon size={15} />} label="Process" count={steps.length}>
        {steps.map((b, i) => (
          <div key={b.id} style={{ display: 'flex', gap: 12, marginBottom: 8 }}>
            <span style={{ flexShrink: 0, width: 26, height: 26, borderRadius: 8, background: NEU.bg, boxShadow: NEU.shadowSm, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 700, color: NEU.muted, marginTop: 2 }}>{i + 1}</span>
            <div style={{ flex: 1 }}>
              <Item title={b.label} desc={b.description} badge={familyOf(b.catalogId) === 'ai' ? 'AI-assisted' : undefined} />
            </div>
          </div>
        ))}
      </Section>

      <Section icon={<Flag size={15} />} label="Professional judgment" count={checkpoints.length}>
        {checkpoints.map((b) => (
          <div key={b.id} style={{ background: NEU.surface, borderRadius: 12, boxShadow: NEU.shadowSm, padding: '11px 14px', marginBottom: 8, borderLeft: '3px solid var(--sx-accent)' }}>
            <div style={{ fontSize: 13, fontWeight: 650, color: NEU.text }}>{b.label.replace(/^Judgment · |^Manager /, '')}</div>
            <div style={{ fontSize: 12, lineHeight: 1.5, color: NEU.muted, marginTop: 3 }}>{b.description}</div>
          </div>
        ))}
      </Section>

      <Section icon={<Sparkles size={15} />} label="Manager views" count={views.length}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {views.map((b) => (
            <span key={b.id} style={{ fontSize: 12, fontWeight: 600, color: NEU.text, background: NEU.surface, boxShadow: NEU.shadowSm, borderRadius: 999, padding: '6px 13px' }}>{b.label}</span>
          ))}
        </div>
      </Section>

      <Section icon={<Download size={15} />} label="Deliverables" count={deliverables.length}>
        {deliverables.map((b) => <Item key={b.id} title={b.label} desc={b.description} />)}
      </Section>
    </div>
  );
}
