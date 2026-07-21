// ─── T1134 Workpaper ──────────────────────────────────────────────────────────
// Design: Same shell as FapiWorksheet — dark navy top bar, left worksheet area,
// right panel slides in from right, animated InScope logo bottom-center/anchored.
// Part I = single-column summary form for Northstar as reporting entity.
// Part II = frozen-left scrollable grid, 20 FA columns, all CRA sections.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  ChevronDown, ChevronUp,
  Download, Upload, FileText, Mail, Eye, PenLine,
  Users, ClipboardCheck, X,
  Link2, Info, Check, Building2, Globe,
  Sparkles, Package,
} from 'lucide-react';
import {
  FOREIGN_AFFILIATES, COUNTRY_GROUPS, PART_I_SUMMARY, SOPHIA_IRL_QUESTIONS,
  type ForeignAffiliate, type YesNo,
} from '@tax/lib/t1134Data';

// ─── Brand colour ─────────────────────────────────────────────────────────────
const PURPLE = 'var(--sx-accent)';

// ─── Milestone definitions ────────────────────────────────────────────────────
type MilestoneId = 'ai-assistant' | 'client-context' | 'upload' | 'irl' | 'validate' | 'review' | 'signoff' | 'file';
const MILESTONES: { id: MilestoneId; label: string; icon: React.ReactElement; done: boolean }[] = [
  { id: 'ai-assistant',   label: 'AI Assistant',  icon: <Sparkles size={16} />,      done: false },
  { id: 'client-context', label: 'Client Context',icon: <FileText size={16} />,      done: true  },
  { id: 'upload',         label: 'Upload',         icon: <Upload size={16} />,        done: true  },
  { id: 'irl',            label: 'IRL',            icon: <Mail size={16} />,          done: false },
  { id: 'validate',       label: 'Validate',       icon: <ClipboardCheck size={16} />,done: false },
  { id: 'review',         label: 'Review',         icon: <Eye size={16} />,           done: false },
  { id: 'signoff',        label: 'Sign-off',       icon: <PenLine size={16} />,       done: false },
  { id: 'file',           label: 'File',           icon: <Package size={16} />,       done: false },
];

// ─── Yes/No Toggle ────────────────────────────────────────────────────────────
function YesNoToggle({ value, onChange, disabled }: { value: YesNo; onChange?: (v: YesNo) => void; disabled?: boolean }) {
  if (disabled || !onChange) {
    return (
      <span style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '1px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 700,
        background: value === 'Yes' ? 'rgba(34,197,94,0.15)' : value === 'No' ? 'var(--sx-panel)' : 'rgba(245,158,11,0.15)',
        color: value === 'Yes' ? '#166534' : value === 'No' ? 'var(--sx-muted)' : '#92400e',
      }}>
        {value || '—'}
      </span>
    );
  }
  return (
    <button
      onClick={() => onChange(value === 'Yes' ? 'No' : 'Yes')}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: '1px 8px', borderRadius: 9999, fontSize: 11, fontWeight: 700, cursor: 'pointer',
        background: value === 'Yes' ? 'rgba(34,197,94,0.15)' : value === 'No' ? 'var(--sx-panel)' : 'rgba(245,158,11,0.15)',
        color: value === 'Yes' ? '#166534' : value === 'No' ? 'var(--sx-muted)' : '#92400e',
        border: 'none', transition: 'all 0.15s',
      }}
    >
      {value || '—'}
    </button>
  );
}

// ─── Currency formatter ───────────────────────────────────────────────────────
function fmtCAD(n: number) {
  if (n === 0) return '—';
  return '$' + n.toLocaleString('en-CA');
}
function fmtPct(n: number) {
  if (n === 0) return '—';
  return n + '%';
}

// ─── Linked cell ─────────────────────────────────────────────────────────────
function LinkedCell({ value, currency = '' }: { value: number; currency?: string }) {
  if (value === 0) return <span style={{ color: 'var(--sx-faint)' }}>—</span>;
  return (
    <span style={{ color: PURPLE, display: 'inline-flex', alignItems: 'center', gap: 3, fontWeight: 600 }}>
      <Link2 size={10} />
      {currency && <span style={{ fontSize: 10, opacity: 0.7 }}>{currency}</span>}
      {fmtCAD(value)}
    </span>
  );
}

// FlagCell removed — no alert triangles shown in column headers

// ─── Section accordion ───────────────────────────────────────────────────────
function SectionAccordion({
  title, subtitle, defaultOpen = false, anchor, children,
}: {
  title: string; subtitle?: string; defaultOpen?: boolean; anchor?: string; children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div data-anchor={anchor} style={{ borderBottom: '1px solid var(--sx-panel)' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 16px', background: 'var(--sx-raised)', border: 'none', cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--sx-body)', letterSpacing: '0.06em', textTransform: 'uppercase', flex: 1 }}>
          {title}
          {subtitle && <span style={{ fontWeight: 400, color: 'var(--sx-faint)', marginLeft: 8, textTransform: 'none', letterSpacing: 0 }}>{subtitle}</span>}
        </span>
        {open ? <ChevronUp size={14} color="#9ca3af" /> : <ChevronDown size={14} color="#9ca3af" />}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

// ─── Grid Row ─────────────────────────────────────────────────────────────────
type CellRenderer = (fa: ForeignAffiliate) => React.ReactNode;

function GridRow({
  label, tooltip, cfaOnly, render, fas,
}: {
  label: string; tooltip?: string; cfaOnly?: boolean;
  render: CellRenderer; fas: ForeignAffiliate[];
}) {
  return (
    <div style={{ display: 'flex', borderBottom: '1px solid var(--sx-raised)', minHeight: 32 }}>
      {/* Frozen label column */}
      <div style={{
        minWidth: 220, maxWidth: 220, padding: '6px 12px', fontSize: 12, color: 'var(--sx-body)',
        borderRight: '1px solid var(--sx-hairline)', background: 'var(--sx-card)', display: 'flex', alignItems: 'center', gap: 6,
        position: 'sticky', left: 0, zIndex: 2,
      }}>
        <span style={{ flex: 1 }}>{label}</span>
        {cfaOnly && <span style={{ fontSize: 10, color: 'var(--sx-accent-strong)', fontWeight: 600 }}>CFA</span>}
        {tooltip && <span title={tooltip} style={{ cursor: 'help', flexShrink: 0, display: 'inline-flex' }}><Info size={11} color="#d1d5db" /></span>}
      </div>
      {/* FA cells */}
      {fas.map(fa => (
        <div
          key={fa.id}
          style={{
            minWidth: 140, maxWidth: 140, padding: '6px 10px', fontSize: 12,
            borderRight: '1px solid var(--sx-panel)', display: 'flex', alignItems: 'center',
            background: cfaOnly && fa.tier === 'NCFA' ? 'var(--sx-raised)' : 'var(--sx-card)',
            color: cfaOnly && fa.tier === 'NCFA' ? 'var(--sx-faint)' : undefined,
          }}
        >
          {cfaOnly && fa.tier === 'NCFA' ? <span style={{ fontSize: 10, color: 'var(--sx-faint)' }}>N/A</span> : render(fa)}
        </div>
      ))}
    </div>
  );
}

// ─── Right Panel Content ──────────────────────────────────────────────────────
function RightPanelContent({
  milestone, onClose,
}: {
  milestone: MilestoneId; onClose: () => void;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const titles: Record<MilestoneId, string> = {
    'ai-assistant': 'AI Assistant',
    'client-context': 'Client Context',
    upload: 'Upload Documents',
    irl: 'Information Request Letter',
    validate: 'Validation Checklist',
    review: 'Review',
    signoff: 'Sign-off',
    file: 'File with CRA',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Panel header */}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '14px 16px',
        borderBottom: '1px solid var(--sx-hairline)', background: 'var(--sx-card)', flexShrink: 0,
      }}>
        <span style={{ flex: 1, fontWeight: 700, fontSize: 13, color: 'var(--sx-ink)' }}>{titles[milestone]}</span>
        <button onClick={onClose} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--sx-faint)', padding: 4 }}>
          <X size={16} />
        </button>
      </div>

      {/* Panel body */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {milestone === 'ai-assistant' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'var(--sx-accent-soft)', borderRadius: 8, padding: 12, fontSize: 12, color: 'var(--sx-body)', lineHeight: 1.6 }}>
              <strong style={{ color: PURPLE }}>AI</strong> has analysed the 2023 T1134 and identified the following items requiring attention for the 2024 filing:
            </div>
            {[
              { fa: 'GmbH Berlin', msg: 'ACB of common shares increased. Confirm nature of capital contribution and update Section 1B.' },
              { fa: 'Inc Delaware', msg: 'Upstream loan arrangement under ss.90(6) detected. Confirm loan balance and terms for Section 3A.4.' },
              { fa: 'Pte Singapore IV', msg: 'First-time filing. Full review required — all fields are blank and financial statements are not available.' },
              { fa: 'AG Frankfurt', msg: 'Financial statements not available. IRL has been auto-generated to request them.' },
              { fa: 'SAS Paris', msg: 'FAPI > $0. Confirm FAPIT entry and participating percentage in Section 3 (iii).' },
            ].map((item, i) => (
              <div key={i} style={{ background: 'var(--sx-card)', border: '1px solid var(--sx-hairline)', borderRadius: 8, padding: 10, fontSize: 12 }}>
                <div style={{ fontWeight: 700, color: 'var(--sx-ink)', marginBottom: 4 }}>{item.fa}</div>
                <div style={{ color: 'var(--sx-muted)', lineHeight: 1.5 }}>{item.msg}</div>
              </div>
            ))}
            <div style={{ marginTop: 8 }}>
              <input
                placeholder="Ask the AI assistant…"
                style={{
                  width: '100%', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--sx-hairline)',
                  fontSize: 12, outline: 'none', boxSizing: 'border-box',
                }}
              />
            </div>
          </div>
        )}

        {milestone === 'client-context' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 12, background: 'var(--sx-raised)', borderRadius: 8 }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1e1b4b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Building2 size={18} color="#fff" />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: 'var(--sx-ink)' }}>Northstar Inc.</div>
                <div style={{ fontSize: 11, color: 'var(--sx-muted)' }}>BN: 123456789 · FY Dec 31, 2024</div>
              </div>
            </div>
            {[
              { label: 'Filing Deadline', value: 'October 31, 2025', status: 'ok' },
              { label: 'Total FAs', value: '20 (16 CFA, 4 NCFA)', status: 'ok' },
              { label: 'Countries', value: '5 (FR, DE, GB, US, SG)', status: 'ok' },
              { label: 'Total FAPI', value: '$4,131,000 CAD', status: 'warn' },
              { label: 'Supplements Complete', value: '12 / 20', status: 'warn' },
              { label: 'Flags Outstanding', value: '6 items', status: 'error' },
            ].map((row, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--sx-panel)', fontSize: 12 }}>
                <span style={{ color: 'var(--sx-muted)' }}>{row.label}</span>
                <span style={{ fontWeight: 700, color: row.status === 'error' ? '#ef4444' : row.status === 'warn' ? '#f59e0b' : 'var(--sx-ink)' }}>
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        )}

        {milestone === 'upload' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{
              border: '2px dashed var(--sx-hairline)', borderRadius: 10, padding: 24, textAlign: 'center',
              background: 'var(--sx-raised)', cursor: 'pointer',
            }}>
              <Upload size={24} color="#d1d5db" className="mx-auto mb-2" />
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--sx-body)' }}>Drop files here</div>
              <div style={{ fontSize: 11, color: 'var(--sx-faint)', marginTop: 4 }}>Prior year T1134, financial statements, org charts</div>
            </div>
            {[
              { name: 'T1134_2023_Northstar.pdf', size: '2.4 MB', status: 'done' },
              { name: 'OrgChart_2024.pdf', size: '1.1 MB', status: 'done' },
              { name: 'FS_SASParis_2024.xlsx', size: '890 KB', status: 'pending' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', background: 'var(--sx-raised)', borderRadius: 8, fontSize: 12 }}>
                <FileText size={14} color="#9ca3af" />
                <span style={{ flex: 1, color: 'var(--sx-body)' }}>{f.name}</span>
                <span style={{ color: 'var(--sx-faint)' }}>{f.size}</span>
                {f.status === 'done' ? <Check size={12} color="#9ca3af" /> : <span style={{ fontSize: 10, color: 'var(--sx-faint)', fontWeight: 700 }}>PENDING</span>}
              </div>
            ))}
          </div>
        )}

        {milestone === 'irl' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: 'var(--sx-muted)', flex: 1 }}>AI generated {SOPHIA_IRL_QUESTIONS.flatMap(g => g.questions).length} questions</span>
              <span style={{ fontSize: 11, background: 'rgba(245,158,11,0.15)', color: '#92400e', padding: '2px 8px', borderRadius: 9999, fontWeight: 700 }}>
                {SOPHIA_IRL_QUESTIONS.flatMap(g => g.questions).filter(q => q.priority === 'high').length} high priority
              </span>
            </div>
            {SOPHIA_IRL_QUESTIONS.map((group, gi) => (
              <div key={gi}>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--sx-body)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6, marginTop: gi > 0 ? 8 : 0 }}>
                  {group.category}
                </div>
                {group.questions.map(q => (
                  <div key={q.id} style={{
                    padding: '8px 10px', background: 'var(--sx-card)', border: '1px solid var(--sx-hairline)', borderRadius: 8, marginBottom: 6, fontSize: 12,
                    borderLeft: `3px solid ${q.priority === 'high' ? '#ef4444' : q.priority === 'medium' ? '#f59e0b' : 'var(--sx-faint)'}`,
                  }}>
                    {q.fa !== 'all' && (
                      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--sx-muted)', marginBottom: 3 }}>
                        {FOREIGN_AFFILIATES.find(f => f.id === q.fa)?.shortName}
                      </div>
                    )}
                    <div style={{ color: 'var(--sx-body)', lineHeight: 1.5 }}>{q.text}</div>
                  </div>
                ))}
              </div>
            ))}
            <button style={{
              marginTop: 8, padding: '10px 0', background: PURPLE, color: '#fff', border: 'none', borderRadius: 8,
              fontWeight: 700, fontSize: 13, cursor: 'pointer', width: '100%',
            }}>
              Send IRL to Client
            </button>
          </div>
        )}

        {milestone === 'validate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 12, color: 'var(--sx-muted)', marginBottom: 4 }}>
              Running validation across all 20 supplements…
            </div>
            {[
              { label: 'All required fields completed', status: 'fail', count: '8 missing' },
              { label: 'FAPI > 0 → participating % filled', status: 'fail', count: '1 issue' },
              { label: 'Dividend received → surplus type specified', status: 'pass', count: '' },
              { label: 'CFA-only fields blank for NCFAs', status: 'pass', count: '' },
              { label: 'T106 cross-reference — loans flagged', status: 'warn', count: '3 items' },
              { label: 'Financial statements included for CFAs', status: 'fail', count: '2 missing' },
              { label: 'First-time filing — all sections complete', status: 'fail', count: '1 incomplete' },
              { label: 'Upstream loan rules confirmed', status: 'warn', count: '1 item' },
            ].map((item, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px',
                background: 'var(--sx-raised)',
                borderRadius: 8, fontSize: 12,
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', flexShrink: 0, background: item.status === 'fail' ? 'rgba(239,68,68,0.15)' : item.status === 'warn' ? 'rgba(245,158,11,0.15)' : 'rgba(16,185,129,0.14)' }} />
                <span style={{ flex: 1, color: 'var(--sx-body)' }}>{item.label}</span>
                {item.count && <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--sx-muted)' }}>{item.count}</span>}
              </div>
            ))}
          </div>
        )}

        {milestone === 'review' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 12, color: 'var(--sx-muted)' }}>Manager review comments</div>
            {[
              { reviewer: 'M. Chen', comment: 'Please confirm the FAPI breakdown for GmbH Berlin — the interest vs. indebtedness split needs to be verified against the loan agreement.', date: 'Jun 3, 2025', resolved: false },
              { reviewer: 'J. Park', comment: 'SAS Paris dividend — confirm Reg. 5900(2) election was not required given the surplus composition.', date: 'Jun 4, 2025', resolved: true },
            ].map((c, i) => (
              <div key={i} style={{ padding: 10, background: c.resolved ? 'rgba(16,185,129,0.14)' : 'var(--sx-card)', border: `1px solid ${c.resolved ? 'rgba(16,185,129,0.14)' : 'var(--sx-hairline)'}`, borderRadius: 8, fontSize: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontWeight: 700, color: 'var(--sx-ink)' }}>{c.reviewer}</span>
                  <span style={{ color: 'var(--sx-faint)', fontSize: 11 }}>{c.date}</span>
                </div>
                <div style={{ color: 'var(--sx-body)', lineHeight: 1.5 }}>{c.comment}</div>
                {c.resolved && <div style={{ marginTop: 6, fontSize: 11, color: '#10b981', fontWeight: 700 }}>✓ Resolved</div>}
              </div>
            ))}
            <button style={{ padding: '8px 0', background: 'var(--sx-panel)', border: 'none', borderRadius: 8, fontSize: 12, fontWeight: 700, color: 'var(--sx-body)', cursor: 'pointer', width: '100%' }}>
              + Add Comment
            </button>
          </div>
        )}

        {milestone === 'signoff' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ fontSize: 12, color: 'var(--sx-muted)' }}>Digital sign-off required before filing</div>
            {[
              { role: 'Preparer', name: 'Sarah Thompson', date: 'Jun 5, 2025', signed: true },
              { role: 'Reviewer', name: 'Michael Chen', date: '', signed: false },
              { role: 'Partner', name: 'James Park', date: '', signed: false },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: s.signed ? 'rgba(16,185,129,0.14)' : 'var(--sx-raised)', borderRadius: 8, border: `1px solid ${s.signed ? 'rgba(16,185,129,0.14)' : 'var(--sx-hairline)'}` }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--sx-ink)' }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--sx-faint)' }}>{s.role}</div>
                </div>
                {s.signed ? (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, color: '#10b981', fontWeight: 700 }}>✓ Signed</div>
                    <div style={{ fontSize: 10, color: 'var(--sx-faint)' }}>{s.date}</div>
                  </div>
                ) : (
                  <button style={{ padding: '6px 12px', background: '#374151', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                    Sign
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {milestone === 'file' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ padding: 12, background: 'rgba(245,158,11,0.15)', borderRadius: 8, fontSize: 12, color: '#92400e' }}>
              <strong>2 sign-offs pending</strong> — complete sign-off before filing.
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--sx-body)', marginBottom: 4 }}>Export Options</div>
            <button
              onClick={() => {
                // Generate iFirm CSV
                const headers = ['FA_Name', 'Country', 'Tier', 'TIN', 'DirectOwnershipPct', 'EquityPctEnd', 'FAPI', 'ExemptSurplusDividend', 'TaxYearFrom', 'TaxYearTo'];
                const rows = FOREIGN_AFFILIATES.map(fa => [
                  fa.legalName, fa.country, fa.tier, fa.tin,
                  fa.directOwnershipPct, fa.equityPctEnd,
                  fa.fapiAmount, fa.exemptSurplusDividend,
                  fa.taxYearFrom, fa.taxYearTo,
                ].join(','));
                const csv = [headers.join(','), ...rows].join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url; a.download = 'T1134_Northstar_2024_iFirm.csv'; a.click();
                URL.revokeObjectURL(url);
              }}
              style={{ padding: '10px 0', background: PURPLE, color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            >
              <Download size={14} /> Download iFirm CSV
            </button>
            <button style={{ padding: '10px 0', background: 'var(--sx-panel)', color: 'var(--sx-faint)', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: 'not-allowed', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Globe size={14} /> CRA XML Export <span style={{ fontSize: 10 }}>(Coming soon)</span>
            </button>
            <div style={{ marginTop: 8, padding: 10, background: 'var(--sx-raised)', borderRadius: 8, fontSize: 11, color: 'var(--sx-faint)' }}>
              CRA submission reference will appear here after filing confirmation.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Part I — Summary Form ────────────────────────────────────────────────────
function PartISummary() {
  const s = PART_I_SUMMARY;
  const fields: { label: string; value: string | number | boolean }[] = [
    { label: 'Reporting Entity Name', value: s.reportingEntityName },
    { label: 'Business Number (BN)', value: s.businessNumber },
    { label: 'Taxation Year — From', value: s.taxationYearFrom },
    { label: 'Taxation Year — To', value: s.taxationYearTo },
    { label: 'NAICS Code', value: s.naicsCode },
    { label: 'Number of Supplements', value: s.numberOfSupplements },
    { label: 'Head Office Address', value: s.address },
    { label: 'Contact Name', value: s.contactName },
    { label: 'Contact Title', value: s.contactTitle },
    { label: 'Contact Phone', value: s.contactPhone },
    { label: 'Signing Officer', value: s.signingOfficerName },
    { label: 'Signing Officer Title', value: s.signingOfficerTitle },
    { label: 'Signing Date', value: s.signingDate || '—' },
    { label: 'Group Filing?', value: s.isGroupFiling ? 'Yes' : 'No' },
    { label: 'ss.85 Transfer?', value: s.ss85Transfer },
    { label: 'ss.87 Amalgamation?', value: s.ss87Amalgamation },
    { label: 'ss.88 Wind-up?', value: s.ss88WindUp },
    { label: 'Org Chart Uploaded?', value: s.orgChartUploaded ? 'Yes' : 'No' },
  ];

  return (
    <div data-anchor="t1134:part1" style={{ padding: '20px 24px', maxWidth: 640 }}>
      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--sx-ink)', marginBottom: 4 }}>Part I — T1134 Summary</div>
      <div style={{ fontSize: 12, color: 'var(--sx-faint)', marginBottom: 20 }}>
        Filed once per reporting entity. Applies to Northstar Inc. as the Canadian filer.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--sx-hairline)', borderRadius: 10, overflow: 'hidden' }}>
        {fields.map((f, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'flex-start', gap: 16,
            padding: '9px 14px', background: i % 2 === 0 ? 'var(--sx-card)' : 'var(--sx-raised)',
            borderBottom: i < fields.length - 1 ? '1px solid var(--sx-panel)' : 'none',
          }}>
            <span style={{ minWidth: 200, fontSize: 12, color: 'var(--sx-muted)', paddingTop: 1 }}>{f.label}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--sx-ink)' }}>{String(f.value)}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--sx-body)', marginBottom: 10 }}>Section 3D — Dormant Foreign Affiliates</div>
        <div style={{ fontSize: 12, color: 'var(--sx-faint)', padding: '12px 14px', background: 'var(--sx-raised)', borderRadius: 8, border: '1px solid var(--sx-hairline)' }}>
          No dormant affiliates reported for 2024.
        </div>
      </div>
      <div style={{ marginTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--sx-body)', marginBottom: 10 }}>Section 3E — Lower-Tier Non-Controlled Foreign Affiliates</div>
        <div style={{ fontSize: 12, color: 'var(--sx-faint)', padding: '12px 14px', background: 'var(--sx-raised)', borderRadius: 8, border: '1px solid var(--sx-hairline)' }}>
          No lower-tier NCFAs reported for 2024.
        </div>
      </div>
    </div>
  );
}

// ─── Part II — Supplement Grid ────────────────────────────────────────────────
function PartIIGrid() {
  const fas = FOREIGN_AFFILIATES;

  return (
    <div style={{ overflowX: 'auto', overflowY: 'visible' }}>
      {/* Country group + column headers */}
      <div style={{ display: 'flex', position: 'sticky', top: 0, zIndex: 10, background: 'var(--sx-card)', borderBottom: '2px solid var(--sx-hairline)' }}>
        {/* Frozen label header */}
        <div style={{
          minWidth: 220, maxWidth: 220, padding: '10px 12px', fontSize: 11, fontWeight: 800,
          color: 'var(--sx-body)', borderRight: '1px solid var(--sx-hairline)', background: 'var(--sx-card)',
          position: 'sticky', left: 0, zIndex: 11, letterSpacing: '0.04em',
        }}>
          FIELD
        </div>
        {/* Country group headers + FA columns */}
        {COUNTRY_GROUPS.map(group => (
          <div key={group.country} style={{ display: 'flex', flexDirection: 'column' }}>
            {/* Country banner */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px',
              background: 'var(--sx-raised)', borderBottom: '1px solid var(--sx-hairline)', borderRight: '1px solid var(--sx-hairline)',
              fontSize: 11, fontWeight: 600, color: 'var(--sx-muted)', minWidth: group.ids.length * 140,
            }}>
              <span>{group.flag}</span> {group.country}
            </div>
            {/* FA column headers */}
            <div style={{ display: 'flex' }}>
              {group.ids.map(id => {
                const fa = fas.find(f => f.id === id)!;
                return (
                  <div key={id} style={{
                    minWidth: 140, maxWidth: 140, padding: '6px 10px', borderRight: '1px solid var(--sx-panel)',
                    background: 'var(--sx-card)',
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--sx-ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {fa.shortName}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <span style={{
                        fontSize: 9, fontWeight: 600, color: 'var(--sx-faint)',
                      }}>{fa.tier}</span>
                    </div>
                    {/* Completion bar — subtle */}
                    <div style={{ marginTop: 4, height: 2, background: 'var(--sx-panel)', borderRadius: 9999, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${fa.completionPct}%`, background: fa.completionPct >= 90 ? 'rgba(16,185,129,0.14)' : fa.completionPct >= 60 ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)', borderRadius: 9999 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Section 1 — FA Information */}
      <SectionAccordion title="Part II · Section 1 — Foreign Affiliate Information" anchor="t1134:part2-s1" defaultOpen>
        <GridRow label="Legal Name" fas={fas} render={fa => <span style={{ fontSize: 11, color: 'var(--sx-body)' }}>{fa.legalName}</span>} />
        <GridRow label="Country of Residence" fas={fas} render={fa => <span>{fa.flag} {fa.countryCode}</span>} />
        <GridRow label="TIN" fas={fas} render={fa => <span style={{ fontSize: 11, fontFamily: 'monospace', color: 'var(--sx-body)' }}>{fa.tin}</span>} />
        <GridRow label="NAICS Code(s)" fas={fas} render={fa => <span style={{ fontSize: 11 }}>{fa.naicsCodes.join(', ')}</span>} />
        <GridRow label="Functional Currency" fas={fas} render={fa => <span style={{ fontWeight: 700 }}>{fa.functionalCurrency}</span>} />
        <GridRow label="Tier (CFA / NCFA)" fas={fas} render={fa => (
          <span style={{ fontWeight: 600, color: 'var(--sx-muted)' }}>{fa.tier}</span>
        )} />
        <GridRow label="First-Time Filing?" fas={fas} render={fa => <YesNoToggle value={fa.firstTimeFiling} />} />
        <GridRow label="Multiple Tax Years?" fas={fas} render={fa => <YesNoToggle value={fa.multipleTaxYears} />} />
        <GridRow label="Tax Year — From" fas={fas} render={fa => <span style={{ fontSize: 11 }}>{fa.taxYearFrom}</span>} />
        <GridRow label="Tax Year — To" fas={fas} render={fa => <span style={{ fontSize: 11 }}>{fa.taxYearTo}</span>} />
        <GridRow label="Business Countries" fas={fas} render={fa => <span style={{ fontSize: 11 }}>{fa.businessCountries.join(', ')}</span>} />
        <GridRow label="Tax Countries" fas={fas} render={fa => <span style={{ fontSize: 11 }}>{fa.taxCountries.join(', ')}</span>} />
      </SectionAccordion>

      {/* Section 1B — Capital Stock */}
      <SectionAccordion title="Part II · Section 1B — Capital Stock">
        <GridRow label="Direct Ownership %" fas={fas} render={fa => <span style={{ fontWeight: 700 }}>{fmtPct(fa.directOwnershipPct)}</span>} />
        <GridRow label="Common Shares — ACB" fas={fas} render={fa => <span>{fmtCAD(fa.commonSharesACB)}</span>} />
        <GridRow label="ACB Increased?" fas={fas} render={fa => <YesNoToggle value={fa.acbIncrease} />} />
        <GridRow label="ACB Decreased?" fas={fas} render={fa => <YesNoToggle value={fa.acbDecrease} />} />
        <GridRow label="Preferred Shares — Ownership %" fas={fas} render={fa => <span>{fmtPct(fa.preferredSharesOwnershipPct)}</span>} />
        <GridRow label="Preferred Shares — ACB" fas={fas} render={fa => <span>{fmtCAD(fa.preferredSharesACB)}</span>} />
        <GridRow label="Indirect Ownership?" fas={fas} render={fa => <YesNoToggle value={fa.isIndirect ? 'Yes' : 'No'} />} />
      </SectionAccordion>

      {/* Section 1C — Other Information */}
      <SectionAccordion title="Part II · Section 1C — Other Information">
        <GridRow label="Equity % — Beginning of Year" fas={fas} render={fa => <span style={{ fontWeight: 700 }}>{fmtPct(fa.equityPctBeginning)}</span>} />
        <GridRow label="Equity % — End of Year" fas={fas} render={fa => <span style={{ fontWeight: 700 }}>{fmtPct(fa.equityPctEnd)}</span>} />
        <GridRow label="Debt Owed TO FA (CAD)" fas={fas} render={fa => <span>{fmtCAD(fa.debtOwedToFA)}</span>} />
        <GridRow label="Debt to FA on T106?" fas={fas} render={fa => <YesNoToggle value={fa.debtOwedToFAOnT106} />} />
        <GridRow label="Debt Owed FROM FA (CAD)" fas={fas} render={fa => <span>{fmtCAD(fa.debtOwedFromFA)}</span>} />
        <GridRow label="Debt from FA on T106?" fas={fas} render={fa => <YesNoToggle value={fa.debtOwedFromFAOnT106} />} />
        <GridRow label="Tracking Interest (ss.95(8))?" fas={fas} render={fa => <YesNoToggle value={fa.trackingInterest} />} />
        <GridRow label="CFA via ss.95(11)?" fas={fas} render={fa => <YesNoToggle value={fa.cfaBecauseSS95_11} />} />
        <GridRow label="CFA via ss.95(12)?" fas={fas} render={fa => <YesNoToggle value={fa.cfaBecauseSS95_12} />} />
        <GridRow label="Joint Election ss.91(1.4)?" fas={fas} render={fa => <YesNoToggle value={fa.jointElectionSS91_1_4} />} />
      </SectionAccordion>

      {/* Section 1D — FA Dumping */}
      <SectionAccordion title="Part II · Section 1D — Foreign Affiliate Dumping (ss.212.3)">
        <GridRow label="ss.212.3(2) Applied?" fas={fas} render={fa => <YesNoToggle value={fa.faDumping_212_3_2_applied} />} />
        <GridRow label="75% FMV Exception?" fas={fas} render={fa => <YesNoToggle value={fa.faDumping_75pctFMV} />} />
        <GridRow label="Business Activities Exception?" fas={fas} render={fa => <YesNoToggle value={fa.faDumping_businessActivities} />} />
        <GridRow label="Corporate Reorganization?" fas={fas} render={fa => <YesNoToggle value={fa.faDumping_corpReorg} />} />
        <GridRow label="Filed Information Return?" fas={fas} render={fa => <YesNoToggle value={fa.faDumping_filedInfo} />} />
        <GridRow label="Deemed Dividend?" fas={fas} render={fa => <YesNoToggle value={fa.faDumping_deemedDividend} />} />
        <GridRow label="PUC Increase?" fas={fas} render={fa => <YesNoToggle value={fa.faDumping_PUCIncrease} />} />
        <GridRow label="Preferred Shares ss.212.3(19)?" fas={fas} render={fa => <YesNoToggle value={fa.faDumping_preferredShares212_3_19} />} />
      </SectionAccordion>

      {/* Section 2 — Financial Information */}
      <SectionAccordion title="Part II · Section 2 — Financial Information" anchor="t1134:part2-s2">
        <GridRow label="Financial Statements Available?" fas={fas} render={fa => <YesNoToggle value={fa.financialStatementsAvailable} />} />
        <GridRow label="Financial Statements Included?" fas={fas} render={fa => <YesNoToggle value={fa.financialStatementsIncluded} />} />
        <GridRow label="≥20% Voting Shares?" fas={fas} render={fa => <YesNoToggle value={fa.hasAtLeast20pctVoting} />} />
      </SectionAccordion>

      {/* Section 3A — Surplus Accounts */}
      <SectionAccordion title="Part II · Section 3A — Surplus Accounts & Dividends" anchor="t1134:part2-s3a">
        <GridRow label="Dividend Received?" fas={fas} render={fa => <YesNoToggle value={fa.dividendReceived} />} />
        <GridRow label="Exempt Surplus Dividend" fas={fas} render={fa => <LinkedCell value={fa.exemptSurplusDividend} currency={fa.dividendCurrency} />} />
        <GridRow label="Hybrid Surplus Dividend" fas={fas} render={fa => <LinkedCell value={fa.hybridSurplusDividend} currency={fa.dividendCurrency} />} />
        <GridRow label="Taxable Surplus Dividend" fas={fas} render={fa => <LinkedCell value={fa.taxableSurplusDividend} currency={fa.dividendCurrency} />} />
        <GridRow label="Pre-Acquisition Surplus Dividend" fas={fas} render={fa => <LinkedCell value={fa.preAcquisitionSurplusDividend} currency={fa.dividendCurrency} />} />
        <GridRow label="Reg. 5900(2) Election?" fas={fas} render={fa => <YesNoToggle value={fa.reg5900_2Election} />} />
        <GridRow label="Reg. 5901(1.1) Election?" fas={fas} render={fa => <YesNoToggle value={fa.reg5901_1_1Election} />} />
        <GridRow label="Reg. 5901(2)(b) Election?" fas={fas} render={fa => <YesNoToggle value={fa.reg5901_2bElection} />} />
        <GridRow label="QROC Election ss.90(3)?" fas={fas} render={fa => <YesNoToggle value={fa.qrocElection} />} />
        <GridRow label="Total Dividends — Cash" fas={fas} render={fa => <span>{fmtCAD(fa.totalDividendsCash)}</span>} />
        <GridRow label="Total Dividends — Stock" fas={fas} render={fa => <span>{fmtCAD(fa.totalDividendsStock)}</span>} />
        <GridRow label="ss.93(1.11) / (1.3) Transaction?" fas={fas} render={fa => <YesNoToggle value={fa.ss93_1_11Transaction} />} />
        <GridRow label="Upstream Loan — 4.1?" fas={fas} render={fa => <YesNoToggle value={fa.upstreamLoan_4_1} />} />
        <GridRow label="Upstream Loan — 4.2?" fas={fas} render={fa => <YesNoToggle value={fa.upstreamLoan_4_2} />} />
        <GridRow label="Upstream Loan — 4.3?" fas={fas} render={fa => <YesNoToggle value={fa.upstreamLoan_4_3} />} />
        <GridRow label="Upstream Loan — 4.4?" fas={fas} render={fa => <YesNoToggle value={fa.upstreamLoan_4_4} />} />
        <GridRow label="Deduction ss.90(9)?" fas={fas} render={fa => <YesNoToggle value={fa.upstreamLoan_deduction90_9} />} />
        <GridRow label="ss.90(8.1) Applied?" fas={fas} render={fa => <YesNoToggle value={fa.upstreamLoan_90_8_1} />} />
        <GridRow label="ss.90(12) Applied?" fas={fas} render={fa => <YesNoToggle value={fa.upstreamLoan_90_12} />} />
      </SectionAccordion>

      {/* Section 3B — Surplus & Share Transactions (CFA only) */}
      <SectionAccordion title="Part II · Section 3B — Surplus & Share Transactions" subtitle="(CFA only)">
        <GridRow label="ss.88(3) Liquidation?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.ss88_3Liquidation} />} />
        <GridRow label="ss.88(3.1) Election?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.ss88_3_1Election} />} />
        <GridRow label="ss.51 Exchange?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.ss51Exchange} />} />
        <GridRow label="Share Acquisition / Disposition?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.shareAcquisitionDisposition} />} />
        <GridRow label="ss.91(1.2) Applicable?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.ss91_1_2Applicable} />} />
        <GridRow label="ss.95(2)(c) Applicable?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.ss95_2cApplicable} />} />
        <GridRow label="Surplus Entitlement % Changed?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.surplusEntitlementPctChange} />} />
        <GridRow label="Equity % of FA Changed?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.equityPctFAChange} />} />
        <GridRow label="Disposed Excluded Property?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.disposedExcludedProperty} />} />
        <GridRow label="Disposed Non-Excluded Cap. Prop.?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.disposedNonExcludedCapProp} />} />
        <GridRow label="Other Reorg Affecting Surplus?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.otherReorgAffectingSurplus} />} />
      </SectionAccordion>

      {/* Part III Section 1 — Employees */}
      <SectionAccordion title="Part III · Section 1 — Employees" subtitle="(CFA only)">
        <GridRow label="Full-Time Employees" cfaOnly fas={fas} render={fa => <span style={{ fontWeight: 700 }}>{fa.employeeCount}</span>} />
        <GridRow label="Relies on Subcontractors?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.reliesOnSubcontractors} />} />
      </SectionAccordion>

      {/* Part III Section 2 — Revenue Composition */}
      <SectionAccordion title="Part III · Section 2 — Revenue Composition" subtitle="(CFA only, thousands)">
        <GridRow label="(i) Interest — Non-Arm's Length" cfaOnly fas={fas} render={fa => <span>{fa.revInterestNonArmLength > 0 ? fa.revInterestNonArmLength + 'K' : '—'}</span>} />
        <GridRow label="(i) Interest — Arm's Length" cfaOnly fas={fas} render={fa => <span>{fa.revInterestArmLength > 0 ? fa.revInterestArmLength + 'K' : '—'}</span>} />
        <GridRow label="(ii) Dividends — Non-Arm's Length" cfaOnly fas={fas} render={fa => <span>{fa.revDividendsNonArmLength > 0 ? fa.revDividendsNonArmLength + 'K' : '—'}</span>} />
        <GridRow label="(iii) Royalties — Non-Arm's Length" cfaOnly fas={fas} render={fa => <span>{fa.revRoyaltiesNonArmLength > 0 ? fa.revRoyaltiesNonArmLength + 'K' : '—'}</span>} />
        <GridRow label="(iii) Royalties — Arm's Length" cfaOnly fas={fas} render={fa => <span>{fa.revRoyaltiesArmLength > 0 ? fa.revRoyaltiesArmLength + 'K' : '—'}</span>} />
        <GridRow label="(iv) Rental — Non-Arm's Length" cfaOnly fas={fas} render={fa => <span>{fa.revRentalNonArmLength > 0 ? fa.revRentalNonArmLength + 'K' : '—'}</span>} />
        <GridRow label="Currency Code" cfaOnly fas={fas} render={fa => <span style={{ fontWeight: 700 }}>{fa.revCurrencyCode}</span>} />
      </SectionAccordion>

      {/* Part III Section 3 — FAPI */}
      <SectionAccordion title="Part III · Section 3 — FAPI / FAPL / FACL" subtitle="(CFA only — 🔗 linked to FAPI worksheet)" anchor="t1134:part3-fapi">
        <GridRow label="FAPI Earned?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.fapiEarned} />} />
        <GridRow label="FAPL Incurred?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.faplIncurred} />} />
        <GridRow label="FACL Incurred?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.faclIncurred} />} />
        <GridRow label="Participating %" cfaOnly fas={fas} render={fa => <span style={{ fontWeight: 700 }}>{fmtPct(fa.participatingPct)}</span>} />
        <GridRow label="FAPI Amount (CAD)" cfaOnly fas={fas} render={fa => <LinkedCell value={fa.fapiAmount} />} />
        <GridRow label="FAPL Amount (CAD)" cfaOnly fas={fas} render={fa => <LinkedCell value={fa.faplAmount} />} />
        <GridRow label="(a) Property Income" cfaOnly fas={fas} render={fa => <span>{fmtCAD(fa.fapi_a_property)}</span>} />
        <GridRow label="(b) Sale of Property" cfaOnly fas={fas} render={fa => <span>{fmtCAD(fa.fapi_b_sale)}</span>} />
        <GridRow label="(c) Insurance / Reinsurance" cfaOnly fas={fas} render={fa => <span>{fmtCAD(fa.fapi_c_insurance)}</span>} />
        <GridRow label="(d) Indebtedness ss.95(2)(a.3)" cfaOnly fas={fas} render={fa => <span>{fmtCAD(fa.fapi_d_indebtedness_a3)}</span>} />
        <GridRow label="(e) Indebtedness ss.95(2)(a.4)" cfaOnly fas={fas} render={fa => <span>{fmtCAD(fa.fapi_e_indebtedness_a4)}</span>} />
        <GridRow label="(f) Services ss.95(2)(b)" cfaOnly fas={fas} render={fa => <span>{fmtCAD(fa.fapi_f_services)}</span>} />
        <GridRow label="(g) Property ss.95(2)(l)" cfaOnly fas={fas} render={fa => <span>{fmtCAD(fa.fapi_g_property_l)}</span>} />
        <GridRow label="(h)(1) Disposition — Shares" cfaOnly fas={fas} render={fa => <span>{fmtCAD(fa.fapi_h1_shares)}</span>} />
        <GridRow label="(h)(2) Disposition — Other" cfaOnly fas={fas} render={fa => <span>{fmtCAD(fa.fapi_h2_other)}</span>} />
        <GridRow label="(i) Description C" cfaOnly fas={fas} render={fa => <span>{fmtCAD(fa.fapi_i_descC)}</span>} />
        <GridRow label="ss.95(2.44) Election?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.ss95_2_44Election} />} />
      </SectionAccordion>

      {/* Part III Section 4 — ABI Inclusions */}
      <SectionAccordion title="Part III · Section 4 — Active Business Income Inclusions" subtitle="(CFA only)">
        <GridRow label="Property Income in ABI?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.propertyIncomeInABI} />} />
        <GridRow label="— ss.95(2)(a)(i)–(vi)?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.abi_ss95_2a} />} />
        <GridRow label="— Investment Business?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.abi_investmentBusiness} />} />
        <GridRow label="— ss.95(2)(l)?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.abi_ss95_2l} />} />
        <GridRow label="Other Income in ABI?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.otherIncomeInABI} />} />
        <GridRow label="— 90% Test?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.abi_90pctTest} />} />
        <GridRow label="— ss.95(2.3)?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.abi_ss95_2_3} />} />
        <GridRow label="— ss.95(2.4)?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.abi_ss95_2_4} />} />
        <GridRow label="— ss.95(3)?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.abi_ss95_3} />} />
        <GridRow label="— ss.95(3.01)?" cfaOnly fas={fas} render={fa => <YesNoToggle value={fa.abi_ss95_3_01} />} />
      </SectionAccordion>

      {/* Part IV — Disclosure */}
      <SectionAccordion title="Part IV — Disclosure" anchor="t1134:part4">
        <GridRow label="Information Not Available?" fas={fas} render={fa => <YesNoToggle value={fa.infoNotAvailable} />} />
        <GridRow label="Details" fas={fas} render={fa => <span style={{ fontSize: 11, color: 'var(--sx-faint)' }}>{fa.infoNotAvailableDetails || '—'}</span>} />
      </SectionAccordion>
    </div>
  );
}

// ─── T1134 Toolbar — portals into GlobalTopNav's nav slot ────────────────────
const NEU_PRESS = 'inset 3px 3px 7px rgba(158,158,178,0.38), inset -3px -3px 7px rgba(255,255,255,0.84)';

function T1134Toolbar({
  activePanel,
  onSelect,
}: {
  activePanel: MilestoneId | null;
  onSelect: (id: MilestoneId) => void;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  const slot = document.getElementById('global-nav-workflow-slot');
  if (!slot) return null;

  return createPortal(
    <>
      {/* Breadcrumb */}
      <div className="flex items-center gap-1 shrink-0" style={{ fontSize: 12 }}>
        <span style={{ color: 'var(--neu-text-muted)' }}>Northstar Inc.</span>
        <span style={{ color: 'rgba(0,0,0,0.2)' }}>›</span>
        <span style={{ color: 'var(--neu-text-muted)' }}>ICT</span>
        <span style={{ color: 'rgba(0,0,0,0.2)' }}>›</span>
        <span style={{ color: 'var(--neu-text-muted)' }}>Comply</span>
        <span style={{ color: 'rgba(0,0,0,0.2)' }}>›</span>
        <span style={{ color: 'var(--neu-text)', fontWeight: 600 }}>T1134</span>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Separator */}
      <div style={{ width: 1, height: 16, background: 'rgba(0,0,0,0.10)', flexShrink: 0 }} />

      {/* Milestone action buttons — same sizing tokens as workflow builder Button size="sm" */}
      {MILESTONES.map((m) => {
        const isActive = activePanel === m.id;
        return (
          <button
            key={m.id}
            onClick={() => onSelect(m.id)}
            className="neu-action inline-flex items-center gap-1.5 rounded-md text-sm font-medium transition-all shrink-0"
            style={{
              height: 32,
              paddingInline: 10,
              border: 'none',
              cursor: 'pointer',
              background: isActive ? '#d8d8e2' : 'transparent',
              boxShadow: isActive ? NEU_PRESS : undefined,
              color: isActive ? PURPLE : 'var(--neu-text)',
            }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', flexShrink: 0,
              opacity: isActive ? 1 : m.done ? 0.85 : 0.4,
              transition: 'opacity 150ms',
            }}>
              {m.icon}
            </span>
            {m.label}
          </button>
        );
      })}

      {/* Separator + milestone progress */}
      <div style={{ width: 1, height: 16, background: 'rgba(0,0,0,0.10)', flexShrink: 0 }} />
      <div className="flex items-center gap-1.5 shrink-0">
        <div className="flex gap-0.5">
          {MILESTONES.map((m) => (
            <div key={m.id} style={{
              width: 14, height: 3, borderRadius: 9999,
              background: m.done ? 'var(--neu-text)' : 'rgba(0,0,0,0.12)',
              opacity: m.done ? 0.55 : 1,
            }} />
          ))}
        </div>
        <span style={{ fontSize: 10, color: 'var(--neu-text-muted)', fontWeight: 500 }}>
          {MILESTONES.filter(m => m.done).length}/{MILESTONES.length}
        </span>
      </div>
    </>,
    slot,
  );
}

// ─── Main T1134Worksheet Component ───────────────────────────────────────────
export default function T1134Worksheet() {
  const [activeTab, setActiveTab] = useState<'part1' | 'part2' | 'client'>('part2');
  const [activePanel, setActivePanel] = useState<MilestoneId | null>(null);

  const handleMilestoneSelect = useCallback((id: MilestoneId) => {
    setActivePanel(prev => prev === id ? null : id);
  }, []);

  const handleClosePanel = useCallback(() => {
    setActivePanel(null);
  }, []);

  const panelOpen = activePanel !== null;

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-white/5 overflow-hidden">
      {/* Portals breadcrumb + milestone buttons into GlobalTopNav */}
      <T1134Toolbar activePanel={activePanel} onSelect={handleMilestoneSelect} />

      {/* ── Row 1: worksheet title ─────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-1 bg-white dark:bg-[#1c1c24]">
        <div className="text-[10px] font-700 text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-0.5">T1134 WORKPAPER</div>
        <div className="text-base font-600 text-gray-900 dark:text-gray-100 leading-tight">Information Return Relating to Controlled and Non-Controlled Foreign Affiliates</div>
      </div>

      {/* ── Row 3: company / year metadata + action buttons ───────────────── */}
      <div className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-[#1c1c24] border-b border-gray-100 dark:border-white/10 flex-wrap">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-gray-400 dark:text-gray-500 font-600 uppercase tracking-wider text-[9px]">Company</span>
          <span className="font-500 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-[11px]">Northstar Inc.</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-gray-400 dark:text-gray-500 font-600 uppercase tracking-wider text-[9px]">Filing Year</span>
          <span className="font-500 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-[11px]">2024</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-gray-400 dark:text-gray-500 font-600 uppercase tracking-wider text-[9px]">Tax Year End</span>
          <span className="font-500 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-[11px]">Dec 31, 2024</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-gray-400 dark:text-gray-500 font-600 uppercase tracking-wider text-[9px]">Due</span>
          <span className="font-500 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-[11px]">Oct 31, 2025</span>
        </div>
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-gray-400 dark:text-gray-500 font-600 uppercase tracking-wider text-[9px]">Affiliates</span>
          <span className="font-500 text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-[11px]">20</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {/* Completion dots */}
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> 4 complete
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block" /> 12 in progress
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 inline-block" /> 4 not started
          </div>
          {/* iFirm CSV — minimal */}
          <button
            onClick={() => handleMilestoneSelect('file')}
            className="flex items-center gap-1 text-[11px] font-500 px-2.5 py-1 rounded border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            style={{ cursor: 'pointer', background: 'none' }}
          >
            <Download size={11} /> iFirm CSV
          </button>
          {/* Share with client — minimal */}
          <button
            onClick={() => setActiveTab('client')}
            className="flex items-center gap-1 text-[11px] font-500 px-2.5 py-1 rounded border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-white/20 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            style={{ cursor: 'pointer', background: 'none' }}
          >
            <Users size={11} /> Share with Client
          </button>
        </div>
      </div>

      {/* ── Tab bar — minimal underline style ─────────────────────────────── */}
      <div className="flex items-center gap-0 bg-white dark:bg-[#1c1c24] border-b border-gray-100 dark:border-white/10 px-4 shrink-0">
        {([
          { id: 'part1', label: 'Part I — Summary' },
          { id: 'part2', label: 'Part II — Supplement (20 FAs)' },
          { id: 'client', label: 'Client Portal View' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="px-4 py-2.5 text-xs border-none bg-none cursor-pointer transition-colors"
            style={{
              background: 'none',
              fontWeight: activeTab === tab.id ? 600 : 400,
              color: activeTab === tab.id ? 'var(--sx-body)' : 'var(--sx-faint)',
              borderBottom: activeTab === tab.id ? '1.5px solid var(--sx-body)' : '1.5px solid transparent',
              marginBottom: -1,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        {/* Left content */}
        <div style={{
          flex: 1, overflowY: 'auto', overflowX: activeTab === 'part2' ? 'auto' : 'hidden',
          transition: 'flex-basis 0.3s ease-out',
          paddingBottom: 24,
        }}>
          {activeTab === 'part1' && <PartISummary />}
          {activeTab === 'part2' && <PartIIGrid />}
          {activeTab === 'client' && (
            <div style={{ padding: 32, maxWidth: 600 }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--sx-ink)', marginBottom: 8 }}>Client Portal View</div>
              <div style={{ fontSize: 13, color: 'var(--sx-muted)', lineHeight: 1.7, marginBottom: 20 }}>
                This view shows the T1134 workpaper as Northstar Inc.'s tax team would see it — with calculated fields locked and only confirmation questions editable. Share a secure link with the client to allow them to confirm ownership percentages, loan balances, and transaction details directly.
              </div>
              <div style={{ padding: 16, background: 'var(--sx-accent-soft)', border: '1px solid var(--sx-accent-soft)', borderRadius: 10, fontSize: 12, color: 'var(--sx-body)' }}>
                <div style={{ fontWeight: 800, color: PURPLE, marginBottom: 8 }}>🔗 Shareable Link</div>
                <div style={{ fontFamily: 'monospace', background: 'var(--sx-card)', padding: '6px 10px', borderRadius: 6, color: 'var(--sx-body)', marginBottom: 10 }}>
                  https://inscope.sinaxe.com/client/northstar/t1134/2024?token=abc123
                </div>
                <button style={{ padding: '8px 16px', background: PURPLE, color: '#fff', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>
                  Generate Client Link
                </button>
              </div>
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--sx-body)', marginBottom: 10 }}>Questions awaiting client confirmation</div>
                {SOPHIA_IRL_QUESTIONS.flatMap(g => g.questions).filter(q => q.priority === 'high').slice(0, 5).map(q => (
                  <div key={q.id} style={{ padding: '10px 12px', background: 'var(--sx-card)', border: '1px solid var(--sx-hairline)', borderRadius: 8, marginBottom: 8, fontSize: 12 }}>
                    <div style={{ color: 'var(--sx-body)', lineHeight: 1.5 }}>{q.text}</div>
                    <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                      <button style={{ padding: '4px 12px', background: 'rgba(34,197,94,0.15)', color: '#166534', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>Confirmed</button>
                      <button style={{ padding: '4px 12px', background: 'rgba(239,68,68,0.15)', color: '#991b1b', border: 'none', borderRadius: 6, fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>Change needed</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right panel — slides in from right */}
        <div style={{
          position: 'absolute', top: 0, right: 0, bottom: 0, width: '38%',
          background: 'var(--sx-card)', borderLeft: '1px solid var(--sx-hairline)',
          boxShadow: panelOpen ? '-4px 0 24px rgba(0,0,0,0.08)' : 'none',
          transform: panelOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.3s cubic-bezier(0.23,1,0.32,1)',
          zIndex: 30, display: 'flex', flexDirection: 'column',
        }}>
          {activePanel && <RightPanelContent milestone={activePanel} onClose={handleClosePanel} />}
        </div>
      </div>

    </div>
  );
}


