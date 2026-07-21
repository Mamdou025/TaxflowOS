'use client';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown, LayoutDashboard, GitFork, MessageCircle, Files, Table2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { selectedClientAtom, showClientSwitcherAtom, navActionsAtom } from '@/lib/nav-store';
import { assistantOpenAtom } from '@/lib/chat-store';
import { viewTransitionNav } from '@/lib/view-transition';
import { ScopeKeystone } from '@/components/scope-orb';

const NAV_H = 52;          // solid bar height (/t1134 slot page)
const CROWN_NAV_H = 84;    // taller floating row so the Scope keystone can rise above the bar

// Sub-navigation only — Scope itself is the raised crown orb (below), not a pill,
// because Scope encompasses these. Main page (/) is Scope, the assistant.
const NAV_LINKS: { label: string; href: string; Icon: LucideIcon }[] = [
  { label: 'Dashboard', href: '/dashboard', Icon: LayoutDashboard },
  { label: 'Worksheets', href: '/worksheets', Icon: Table2 },
  { label: 'Builder', href: '/builder', Icon: GitFork },
  { label: 'Documents', href: '/viewer', Icon: Files },
];

// Neumorphic segmented control — inset track, raised active pill with accent.
function NavPill() {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 3, padding: 4, borderRadius: 999,
        background: 'var(--sx-nav-track)',
        boxShadow: 'var(--sx-shadow-in)',
      }}
    >
      {NAV_LINKS.map(({ label, href, Icon }) => {
        const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
        return (
          <button
            key={href}
            onClick={() => viewTransitionNav(() => router.push(href))}
            className="transition-all"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 15px', borderRadius: 999,
              border: 'none', cursor: 'pointer', fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap',
              color: active ? 'var(--sx-accent)' : 'var(--sx-muted)',
              background: active ? 'var(--sx-nav-pill)' : 'transparent',
              boxShadow: active ? 'var(--sx-shadow-sm)' : 'none',
            }}
          >
            <Icon size={14} style={{ opacity: active ? 1 : 0.75 }} />
            {label}
          </button>
        );
      })}
    </div>
  );
}

export function GlobalTopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isCanvasPage = pathname === '/t1134';
  const onScope = pathname === '/';
  const [client] = useAtom(selectedClientAtom);
  const setShowClientSwitcher = useSetAtom(showClientSwitcherAtom);
  const setAssistantOpen = useSetAtom(assistantOpenAtom);
  const navActions = useAtomValue(navActionsAtom);

  const ClientPill = (
    <button
      onClick={() => setShowClientSwitcher(true)}
      className="flex items-center gap-1.5 rounded-full px-2 py-1 transition-all hover:bg-black/5 dark:hover:bg-white/10 shrink-0"
      style={{ fontSize: 12, fontWeight: 600, color: 'var(--sx-body)' }}
    >
      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0" style={{ background: 'var(--sx-accent-soft)', color: 'var(--sx-accent)' }}>
        {client.charAt(0)}
      </span>
      <span className="max-w-[120px] truncate">{client}</span>
      <ChevronDown size={10} className="text-gray-400" />
    </button>
  );

  const Logo = (
    <button onClick={() => router.push('/')} className="flex items-baseline gap-0.5 select-none shrink-0" style={{ background: 'transparent', border: 'none', padding: 0 }}>
      <span style={{ fontSize: 14.5, fontWeight: 700, color: 'var(--sx-ink)', letterSpacing: '-0.01em' }}>Sinaxe</span>
      <span style={{ fontSize: 7, color: 'var(--sx-faint)', verticalAlign: 'super' }}>™</span>
      <span style={{ fontSize: 14.5, fontWeight: 400, color: 'var(--sx-muted)', marginLeft: 2, letterSpacing: '-0.01em' }}>InScope</span>
    </button>
  );

  // Canvas worksheet (/t1134) keeps a full-width bar for its portaled toolbar.
  if (isCanvasPage) {
    return (
      <div className="shrink-0 flex items-center px-5 gap-3 z-20 pointer-events-auto" style={{ height: NAV_H, background: 'var(--sx-nav-bar)', borderBottom: '1px solid var(--sx-hairline)' }}>
        {Logo}
        <div style={{ width: 1, height: 18, background: 'var(--sx-divider)', flexShrink: 0 }} />
        <div id="global-nav-workflow-slot" className="flex-1 flex items-center h-full min-w-0 overflow-visible gap-0.5 pointer-events-auto" />
      </div>
    );
  }

  // A short floating bar with the Scope crown raised above its center. The bar
  // holds the sub-nav (left) + client/context (right); Scope presides over both.
  return (
    <div className="shrink-0 flex items-end justify-center z-20 pointer-events-none" style={{ height: CROWN_NAV_H }}>
      <div
        className="relative flex items-center justify-between pointer-events-auto"
        style={{
          height: 40, width: 'min(860px, 95vw)', marginBottom: 4, padding: '0 8px', borderRadius: 999,
          background: 'var(--sx-nav-bar)',
          boxShadow: 'var(--sx-nav-shadow)',
          border: '1px solid var(--sx-hairline-subtle)',
          overflow: 'visible',
        }}
      >
        {/* Left — logo + sub-navigation */}
        <div className="flex items-center gap-3 min-w-0">
          {Logo}
          <div style={{ width: 1, height: 16, background: 'var(--sx-divider)', flexShrink: 0 }} />
          <NavPill />
        </div>

        {/* Center — the raised Scope keystone: the bar bulges up into it. Anchored
            2px above the bar's bottom so its lower half overlaps the bar (same
            colour → one silhouette) and the pedestal rises above the center. */}
        <div style={{ position: 'absolute', left: '50%', bottom: 2, transform: 'translateX(-50%)', zIndex: 30 }}>
          <ScopeKeystone active={onScope} onClick={() => { if (!onScope) viewTransitionNav(() => router.push('/')); }} />
        </div>

        {/* Right — quick "ask here" + client/context */}
        <div className="flex items-center gap-1.5">
          {!onScope && (
            <button
              onClick={() => setAssistantOpen((v) => !v)}
              title="Ask Scope on this page"
              aria-label="Ask Scope on this page"
              className="flex items-center justify-center rounded-full transition-all hover:bg-black/5 dark:hover:bg-white/10 shrink-0"
              style={{ width: 30, height: 30, color: 'var(--sx-muted)' }}
            >
              <MessageCircle size={16} />
            </button>
          )}
          {ClientPill}
          {navActions.map((action) => (
            <button key={action.id} onClick={() => router.push(action.href)} className="flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-colors hover:bg-black/5 dark:hover:bg-white/10 shrink-0" style={{ fontSize: 11.5, fontWeight: 500, color: 'var(--sx-muted)' }}>
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export const NAV_HEIGHT = NAV_H;
