

// Company workspace — grid background, centered content, neumorphic sidebar.
// Content is intentionally light/inspirational for now (company overview +
// generated worksheets + at-a-glance) — meant to be reshaped later.

import { usePathname, useRouter } from '@/lib/router';
import { useAtomValue } from 'jotai';
import {
  Building2, FileText, Layers, BarChart3, Calculator, Workflow, Calendar,
  AlertTriangle, CheckCircle2, Sparkles, ChevronRight,
  LayoutDashboard, Settings, HelpCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { NeumorphicSidebar, NeuSidebarHeader, NeuSectionLabel, NeuRow, NEU } from '@/components/neumorphic-sidebar';
import { selectedClientAtom } from '@/shared/stores/nav-store';
import { useInlinePage } from '@/shared/stores/inline-page-context';

// ─── Dashboard sidebar (per-page neumorphic rail) ─────────────────────────────
function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname?.startsWith(href) ?? false;

  const mainItems = [
    { label: 'Tax Overview', href: '/bu-overview',       Icon: Layers          },
    { label: 'Dashboard',    href: '/dashboard',          Icon: LayoutDashboard },
    { label: 'Clients',      href: '/client/northstar',  Icon: Building2,      badge: 8,  badgeColor: 'amber' as const },
    { label: 'Workflows',    href: '/workflow/fapi',      Icon: FileText,       badge: 2,  badgeColor: 'red'   as const },
  ];
  const utilItems = [
    { label: 'Analytics', Icon: BarChart3  },
    { label: 'Settings',  Icon: Settings   },
    { label: 'Help',      Icon: HelpCircle },
  ];
  const badgeEl = (badge?: number, color?: 'amber' | 'red') =>
    badge == null ? undefined : (
      <span style={{ fontSize: 9, fontWeight: 700, padding: '1px 6px', borderRadius: 10, background: color === 'amber' ? 'rgba(245,158,11,0.18)' : 'rgba(239,68,68,0.18)', color: color === 'amber' ? '#B45309' : '#DC2626' }}>{badge}</span>
    );

  return (
    <NeumorphicSidebar header={<NeuSidebarHeader title="Practice" subtitle="Margaret Chen · Partner" />}>
      {mainItems.map(({ label, href, Icon, badge, badgeColor }) => (
        <NeuRow key={href} icon={<Icon size={14} />} label={label} active={isActive(href)} onClick={() => router.push(href)} badge={badgeEl(badge, badgeColor)} />
      ))}
      <NeuSectionLabel>Tools</NeuSectionLabel>
      {utilItems.map(({ label, Icon }) => (
        <NeuRow key={label} icon={<Icon size={14} />} label={label} onClick={() => toast.info('Feature coming soon')} />
      ))}
    </NeumorphicSidebar>
  );
}

// ─── Content styling (light cards on the gray portal ground) ──────────────────
const NAVY = 'var(--sx-ink)';
const CARD: React.CSSProperties = { background: 'var(--sx-card)', borderRadius: 16, border: '1px solid var(--sx-hairline)', boxShadow: 'var(--sx-drop-card)' };
const SECTION_LABEL: React.CSSProperties = { fontSize: 11, fontWeight: 650, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--sx-muted)', marginBottom: 12 };

const STATUS = {
  ready:  { label: 'Ready',     bg: 'rgba(63,185,80,0.14)',   fg: '#2E7D32', Dot: CheckCircle2 },
  review: { label: 'In review', bg: 'rgba(217,119,6,0.14)',   fg: '#B45309', Dot: AlertTriangle },
  draft:  { label: 'Draft',     bg: 'rgba(120,130,150,0.16)', fg: 'var(--sx-muted)', Dot: FileText },
} as const;

type Ws = {
  title: string; sub: string; href: string; Icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  status: keyof typeof STATUS; updated: string; figures: [string, string][];
};

const WORKSHEETS: Ws[] = [
  { title: 'FAPI Workpaper 2025', sub: 'Foreign accrual property income', href: '/fapi', Icon: Calculator, status: 'ready', updated: '2 hours ago', figures: [['Gross FAPI', '1,284,500'], ['FAT deduction', '(412,100)'], ['Net FAPI', '872,400']] },
  { title: 'T1134 Workpaper', sub: 'Foreign affiliate reporting', href: '/t1134', Icon: FileText, status: 'review', updated: '1 day ago', figures: [['Affiliates', '6'], ['Reporting entities', '4'], ['Open exceptions', '2']] },
  { title: 'Surplus Continuity', sub: 'Exempt / taxable surplus', href: '/surplus', Icon: Layers, status: 'draft', updated: '3 days ago', figures: [['Exempt surplus', '2,140,000'], ['Taxable surplus', '560,000'], ['Pre-1972 CSOH', '—']] },
  { title: 'Executive Overview', sub: 'Business-unit tax overview', href: '/bu-overview', Icon: BarChart3, status: 'ready', updated: '5 hours ago', figures: [['Business units', '5'], ['Effective rate', '24.1%'], ['At-risk items', '3']] },
];

const STATS = [
  { label: 'Active workflows', value: '12', sub: '+2 this week', Icon: Workflow },
  { label: 'Open reviews', value: '8', sub: 'across engagements', Icon: FileText },
  { label: 'Upcoming deadlines', value: '9', sub: 'next 30 days', Icon: Calendar },
  { label: 'At-risk items', value: '3', sub: 'need attention', Icon: AlertTriangle },
];

// ─── Company workspace ─────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const client = useAtomValue(selectedClientAtom);
  const initial = client?.charAt(0) ?? 'N';
  // Inline in the Scope panel: drop the in-body sidebar (its nav lives in Scope's
  // left sidebar) so the dashboard content isn't cramped next to the chat.
  const embedded = useInlinePage();

  return (
    <div className="h-full flex">
      {!embedded && <DashboardSidebar />}

      <div className="flex-1 min-w-0 overflow-auto">
        <div className="mx-auto" style={{ maxWidth: 1060, padding: '30px 28px 52px' }}>

          {/* ── Company overview ── */}
          <div style={{ ...CARD, padding: '22px 24px', marginBottom: 22 }}>
            <div className="flex items-start gap-4">
              <div style={{ width: 56, height: 56, borderRadius: 16, flexShrink: 0, background: 'linear-gradient(135deg,#6B21A8,#8B3FD0)', color: '#fff', display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 700, boxShadow: '0 6px 16px rgba(107,33,168,0.35)' }}>{initial}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 style={{ fontSize: 22, fontWeight: 700, color: NAVY, letterSpacing: '-0.02em' }}>{client}</h1>
                  <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.03em', textTransform: 'uppercase', color: 'var(--sx-accent)', background: 'var(--sx-accent-soft)', border: '1px solid rgba(107,33,168,0.22)', borderRadius: 999, padding: '2px 9px' }}>Platinum</span>
                </div>
                <div style={{ fontSize: 13, color: 'var(--sx-muted)', marginTop: 3 }}>Lead: Margaret Chen · Partner · Fiscal Year 2024–2025</div>
                <div className="flex items-center gap-1.5 mt-3">
                  {['TC', 'ICT', 'M&A', 'TP'].map((t) => (
                    <span key={t} style={{ fontSize: 10, fontWeight: 700, color: 'var(--sx-body)', background: 'var(--sx-panel)', border: '1px solid var(--sx-hairline)', borderRadius: 6, padding: '2px 7px' }}>{t}</span>
                  ))}
                </div>
              </div>
              <button onClick={() => router.push('/')} className="flex items-center gap-1.5 shrink-0 transition-colors hover:bg-purple-50 dark:hover:bg-purple-500/10" style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--sx-accent)', background: 'var(--sx-accent-soft)', border: '1px solid rgba(107,33,168,0.18)', borderRadius: 10, padding: '8px 13px' }}>
                <Sparkles size={14} /> Ask the assistant
              </button>
            </div>
          </div>

          {/* ── Stat tiles ── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 28 }}>
            {STATS.map(({ label, value, sub, Icon }) => (
              <div key={label} style={{ ...CARD, padding: '15px 17px' }}>
                <div className="flex items-center justify-between">
                  <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--sx-panel)', display: 'grid', placeItems: 'center', color: 'var(--sx-muted)' }}><Icon size={15} /></span>
                </div>
                <div style={{ fontSize: 26, fontWeight: 700, color: NAVY, marginTop: 10, letterSpacing: '-0.02em' }}>{value}</div>
                <div style={{ fontSize: 12, color: NAVY, marginTop: 2, fontWeight: 550 }}>{label}</div>
                <div style={{ fontSize: 11, color: 'var(--sx-faint)', marginTop: 1 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* ── Generated worksheets ── */}
          <div style={SECTION_LABEL}>Generated worksheets</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
            {WORKSHEETS.map((w) => {
              const s = STATUS[w.status];
              return (
                <button key={w.title} onClick={() => router.push(w.href)} className="text-left transition-transform hover:-translate-y-0.5" style={{ ...CARD, padding: 0, overflow: 'hidden', cursor: 'pointer' }}>
                  <div className="flex items-center gap-3" style={{ padding: '14px 16px', borderBottom: '1px solid var(--sx-hairline)' }}>
                    <span style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--sx-panel)', display: 'grid', placeItems: 'center', color: NAVY, flexShrink: 0 }}><w.Icon size={17} /></span>
                    <span className="flex-1 min-w-0">
                      <span style={{ display: 'block', fontSize: 13.5, fontWeight: 650, color: NAVY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{w.title}</span>
                      <span style={{ display: 'block', fontSize: 11.5, color: 'var(--sx-faint)' }}>{w.sub}</span>
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 10.5, fontWeight: 650, color: s.fg, background: s.bg, borderRadius: 999, padding: '3px 8px', flexShrink: 0 }}>
                      <s.Dot size={11} /> {s.label}
                    </span>
                  </div>
                  <div style={{ padding: '10px 16px 12px' }}>
                    {w.figures.map(([k, v]) => (
                      <div key={k} className="flex items-center justify-between" style={{ padding: '3px 0' }}>
                        <span style={{ fontSize: 12, color: 'var(--sx-muted)' }}>{k}</span>
                        <span style={{ fontSize: 12.5, fontWeight: 650, color: NAVY, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between" style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid var(--sx-hairline)' }}>
                      <span style={{ fontSize: 11, color: 'var(--sx-faint)' }}>Updated {w.updated}</span>
                      <span className="flex items-center gap-0.5" style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--sx-accent)' }}>Open <ChevronRight size={13} /></span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* ── At a glance ── */}
          <div style={{ ...SECTION_LABEL, marginTop: 30 }}>At a glance</div>
          <div style={{ ...CARD, padding: '16px 20px' }}>
            <div className="flex items-start gap-3">
              <span style={{ width: 30, height: 30, borderRadius: 9, background: 'var(--sx-accent-soft)', border: '1px solid rgba(107,33,168,0.16)', display: 'grid', placeItems: 'center', color: 'var(--sx-accent)', flexShrink: 0 }}><Sparkles size={15} /></span>
              <div style={{ fontSize: 12.5, color: 'var(--sx-body)', lineHeight: 1.6 }}>
                <b style={{ color: NAVY }}>3 deliverables are at risk</b> for {client}. The FAPI Workpaper 2025 is ready for manager sign-off; the T1134 has 2 open exceptions; Surplus Continuity is still in draft.
                <button onClick={() => router.push('/')} className="ml-1 hover:underline" style={{ color: 'var(--sx-accent)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Ask for a full review →</button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
