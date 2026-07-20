'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ScopeLaunchpad — the "you can do more than chat" entry elements shown UNDER the
// composer in Scope's empty (hero) state. Folded in from the old /home page so
// everything lives on one page: the user starts in the chat but can also build,
// open the dashboard, run a workflow, or pick up recent/queued work.
//
// AI-first, not AI-only: Build / Dashboard / worksheet items navigate DIRECTLY
// (no model needed); running a workflow launches it IN the chat (Sofi/Théo).
// Light neumorphic panels floating on the dark grid — the grid shows in the
// gutters, matching the existing composer hero card.
// ─────────────────────────────────────────────────────────────────────────────

import { GitFork, LayoutDashboard, Workflow, Clock, ChevronRight, ArrowUpRight } from 'lucide-react';
import type { Assistant } from './use-assistant';

const CARD = '#F4F5F8';
const INK = '#18181b';
const MUTED = '#6b7280';
const FAINT = '#9aa0ad';
const ACCENT = '#6B21A8';
const AMBER = '#B45309';
// Floats on the dark grid (matches the composer hero's NEU_PANEL_SHADOW language).
const PANEL_SHADOW = '0 16px 40px rgba(0,0,0,0.34), inset 0 1px 0 rgba(255,255,255,0.6)';

type Tile = { label: string; sub: string; icon: React.ReactNode; run: (a: Assistant) => void };
const TILES: Tile[] = [
  { label: 'Build a workflow', sub: 'Design on the canvas', icon: <GitFork size={17} />, run: (a) => a.router.push('/builder') },
  { label: 'Dashboard', sub: 'Clients & portfolio', icon: <LayoutDashboard size={17} />, run: (a) => a.router.push('/dashboard') },
  { label: 'Run FAPI', sub: 'Sofi runs it in chat', icon: <Workflow size={17} />, run: (a) => a.launchStartWorkflow('fapi') },
  { label: 'Run Roulement art. 85', sub: 'Théo runs it in chat', icon: <Workflow size={17} />, run: (a) => a.launchStartWorkflow('roulement') },
];

type Activity = { title: string; client: string; when: string; href: string };
const RECENT: Activity[] = [
  { title: 'FAPI Readiness', client: 'SAS Paris', when: '2m ago', href: '/fapi' },
  { title: 'Q2 Provision Review', client: 'Meridian Energy', when: '18m ago', href: '/dashboard' },
  { title: 'T1134 Compliance Review', client: 'Cascade Tech', when: 'Yesterday', href: '/t1134' },
];

type QueueItem = { title: string; client: string; action: string; tone: 'approve' | 'review' | 'provide'; href: string };
const NEEDS_YOU: QueueItem[] = [
  { title: 'Approve GROSS $538,100', client: 'Northstar Inc', action: 'Approve', tone: 'approve', href: '/fapi' },
  { title: '3 rows need a category', client: 'Meridian Energy', action: 'Review', tone: 'review', href: '/fapi' },
  { title: 'Trial balance needed', client: 'Atlas Financial', action: 'Provide', tone: 'provide', href: '/run/fapi' },
];
const AMBIENT = { running: 7, completed: 12, blocked: 2 };
const TONE_COLOR: Record<QueueItem['tone'], string> = { approve: ACCENT, review: AMBER, provide: MUTED };

function Card({ title, icon, onAction, children }: { title: string; icon: React.ReactNode; onAction: () => void; children: React.ReactNode }) {
  return (
    <div style={{ background: CARD, borderRadius: 18, boxShadow: PANEL_SHADOW, padding: '18px 20px', minWidth: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: INK, fontSize: 14, fontWeight: 650 }}>
          <span style={{ color: FAINT, display: 'inline-flex' }}>{icon}</span>{title}
        </div>
        <button onClick={onAction} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', color: MUTED, fontSize: 12, fontWeight: 550, padding: 0 }}
          onMouseEnter={(e) => (e.currentTarget.style.color = INK)} onMouseLeave={(e) => (e.currentTarget.style.color = MUTED)}>
          View all <ArrowUpRight size={13} />
        </button>
      </div>
      {children}
    </div>
  );
}

const hover = (on: boolean) => (e: React.MouseEvent<HTMLButtonElement>) => { e.currentTarget.style.background = on ? 'rgba(0,0,0,0.035)' : 'transparent'; };
const rowStyle = (first: boolean): React.CSSProperties => ({ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, textAlign: 'left', background: 'transparent', border: 'none', borderTop: first ? 'none' : '1px solid rgba(0,0,0,0.05)', borderRadius: 8, padding: '12px 10px', cursor: 'pointer', transition: 'background 120ms ease-out', width: '100%' });

export function ScopeLaunchpad({ assistant }: { assistant: Assistant }) {
  const go = (href: string) => assistant.router.push(href);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Quick-start tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 12 }}>
        {TILES.map((t) => (
          <button key={t.label} onClick={() => t.run(assistant)}
            style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', background: CARD, border: 'none', borderRadius: 14, boxShadow: PANEL_SHADOW, padding: '13px 15px', cursor: 'pointer', transition: 'transform 140ms ease-out' }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-1px)')} onMouseLeave={(e) => (e.currentTarget.style.transform = 'none')}>
            <span style={{ width: 34, height: 34, borderRadius: 10, flexShrink: 0, display: 'grid', placeItems: 'center', background: 'rgba(107,33,168,0.10)', color: ACCENT }}>{t.icon}</span>
            <span style={{ minWidth: 0 }}>
              <span style={{ display: 'block', fontSize: 13, fontWeight: 650, color: INK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.label}</span>
              <span style={{ display: 'block', fontSize: 11.5, color: FAINT, marginTop: 1 }}>{t.sub}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Recent Activity · Needs you */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
        <Card title="Recent Activity" icon={<Clock size={15} />} onAction={() => go('/dashboard')}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {RECENT.map((a, i) => (
              <button key={a.title} onClick={() => go(a.href)} onMouseEnter={hover(true)} onMouseLeave={hover(false)} style={rowStyle(i === 0)}>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: INK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.title}</span>
                  <span style={{ display: 'block', fontSize: 12, color: FAINT, marginTop: 2 }}>{a.client}</span>
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0, color: FAINT, fontSize: 12 }}>{a.when} <ChevronRight size={14} /></span>
              </button>
            ))}
          </div>
        </Card>

        <Card title="Needs you" icon={<span style={{ width: 8, height: 8, borderRadius: '50%', background: ACCENT, display: 'inline-block' }} />} onAction={() => go('/dashboard')}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {NEEDS_YOU.map((q, i) => (
              <button key={q.title} onClick={() => go(q.href)} onMouseEnter={hover(true)} onMouseLeave={hover(false)} style={rowStyle(i === 0)}>
                <span style={{ minWidth: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: TONE_COLOR[q.tone], flexShrink: 0 }} />
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600, color: INK, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{q.title}</span>
                    <span style={{ display: 'block', fontSize: 12, color: FAINT, marginTop: 2 }}>{q.client}</span>
                  </span>
                </span>
                <span style={{ flexShrink: 0, fontSize: 12, fontWeight: 650, color: TONE_COLOR[q.tone], border: `1px solid ${TONE_COLOR[q.tone]}22`, borderRadius: 999, padding: '5px 12px', background: `${TONE_COLOR[q.tone]}0d` }}>{q.action}</span>
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 12, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.06)', fontSize: 12, color: FAINT, fontWeight: 500 }}>
            <span><span style={{ color: MUTED, fontWeight: 650 }}>{AMBIENT.running}</span> running</span>
            <span><span style={{ color: MUTED, fontWeight: 650 }}>{AMBIENT.completed}</span> completed</span>
            <span><span style={{ color: MUTED, fontWeight: 650 }}>{AMBIENT.blocked}</span> blocked</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
