'use client';

// ─────────────────────────────────────────────────────────────────────────────
// InScopeSidebar — Manus neumorphic main menu, ported to Next.js.
// Collapsible: 64px icon rail (default) ↔ 240px labelled. Fixed left, floating.
// Replaces the home orbital menu as the primary navigation.
// ─────────────────────────────────────────────────────────────────────────────

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home, GitFork, FolderOpen, Settings, Sparkles, LayoutDashboard,
  ChevronRight, ChevronLeft, ChevronDown,
} from 'lucide-react';
import { NAV_HEIGHT } from '@/components/global-top-nav';

// Dark theme — floats on the grid canvas, no neumorphic shadow (subtle glass + border).
const PURPLE = '#b590ff';
const SURFACE = 'rgba(26,26,31,0.72)';
const SURFACE2 = 'rgba(255,255,255,0.07)';
const TEXT_PRIMARY = '#ededf0';
const TEXT_SECONDARY = 'rgba(255,255,255,0.62)';
const TEXT_TERTIARY = 'rgba(255,255,255,0.40)';
const BORDER = 'rgba(255,255,255,0.08)';
const SHADOW_OUT = 'none';
const SHADOW_IN = 'none';

const COLLAPSED_W = 64;
const EXPANDED_W = 240;
export const SIDEBAR_RESERVED_W = COLLAPSED_W + 12 + 12; // rail + left/right gap

type IconType = React.ComponentType<{ size?: number; style?: React.CSSProperties }>;

const RECENT = [
  { id: '1', title: 'FAPI Readiness — SAS Paris', sub: 'FAPI', route: '/fapi' },
  { id: '2', title: 'T1134 — Cascade Tech', sub: 'T1134', route: '/t1134' },
  { id: '3', title: 'Surplus — Atlas Financial', sub: 'Surplus', route: '/surplus' },
  { id: '4', title: 'Executive Overview', sub: 'Dashboard', route: '/dashboard' },
];

function NavItem({ icon: Icon, label, active, onClick, collapsed }: {
  icon: IconType; label: string; active: boolean; onClick: () => void; collapsed: boolean;
}) {
  return (
    <div style={{ position: 'relative' }} className="is-nav-item">
      <button
        onClick={onClick}
        aria-label={label}
        title={collapsed ? label : undefined}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10,
          justifyContent: collapsed ? 'center' : 'flex-start',
          padding: collapsed ? '10px 0' : '10px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
          background: active ? SURFACE2 : 'transparent', boxShadow: active ? SHADOW_IN : 'none',
          color: active ? PURPLE : TEXT_SECONDARY, transition: 'all 180ms ease-out', fontFamily: 'inherit',
        }}
        onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = SURFACE2; }}
        onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
      >
        <Icon size={16} style={{ flexShrink: 0 }} />
        {!collapsed && <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? TEXT_PRIMARY : TEXT_SECONDARY, whiteSpace: 'nowrap' }}>{label}</span>}
      </button>
      {collapsed && (
        <div className="is-nav-tooltip" style={{ position: 'absolute', left: 'calc(100% + 10px)', top: '50%', transform: 'translateY(-50%)', background: TEXT_PRIMARY, color: '#fff', fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap', padding: '5px 10px', borderRadius: 8, pointerEvents: 'none', opacity: 0, transition: 'opacity 120ms ease-out', zIndex: 300 }}>{label}</div>
      )}
    </div>
  );
}

export function InScopeSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(true);
  const [scopesOpen, setScopesOpen] = useState(true);
  const w = collapsed ? COLLAPSED_W : EXPANDED_W;
  const isActive = (route: string) => (route === '/' ? pathname === '/' : pathname.startsWith(route));
  const go = (route: string) => router.push(route);

  return (
    <>
      <style>{`.is-nav-item:hover .is-nav-tooltip { opacity: 1 !important; }`}</style>
      <nav
        aria-label="Main navigation"
        style={{
          position: 'fixed', left: 12, top: NAV_HEIGHT + 12, bottom: 12, width: w, zIndex: 60,
          background: SURFACE, backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
          borderRadius: 20, boxShadow: SHADOW_OUT, border: `1px solid ${BORDER}`,
          display: 'flex', flexDirection: 'column', padding: '14px 10px',
          transition: 'width 220ms cubic-bezier(0.23,1,0.32,1)', overflow: 'hidden',
        }}
      >
        {/* Brand + collapse toggle — stacked when collapsed, side-by-side when expanded */}
        <div style={{ display: 'flex', flexDirection: collapsed ? 'column' : 'row', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between', gap: collapsed ? 12 : 0, marginBottom: 18, paddingLeft: collapsed ? 0 : 4 }}>
          {collapsed ? (
            <svg width={22} height={22} viewBox="0 0 22 22">
              {Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI * 2; return <circle key={i} cx={11 + 8 * Math.cos(a)} cy={11 + 8 * Math.sin(a)} r={1.2} fill={PURPLE} opacity={0.6} />; })}
              <circle cx={11} cy={11} r={3} fill={PURPLE} opacity={0.85} />
            </svg>
          ) : (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, userSelect: 'none', overflow: 'hidden' }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: TEXT_PRIMARY, letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>Sinaxe</span>
              <span style={{ fontSize: 8, color: TEXT_TERTIARY, verticalAlign: 'super' }}>™</span>
              <span style={{ fontSize: 13, fontWeight: 400, color: TEXT_SECONDARY, marginLeft: 2, whiteSpace: 'nowrap' }}>InScope</span>
            </div>
          )}
          <button onClick={() => setCollapsed((v) => !v)} aria-label={collapsed ? 'Expand' : 'Collapse'} title={collapsed ? 'Expand' : 'Collapse'} style={{ width: 26, height: 26, borderRadius: 9, flexShrink: 0, background: SURFACE2, boxShadow: SHADOW_IN, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: TEXT_SECONDARY }}>
            {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
          </button>
        </div>

        {/* Main nav */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <NavItem icon={Home} label="Home" active={isActive('/')} onClick={() => go('/')} collapsed={collapsed} />
          <NavItem icon={Sparkles} label="Scope" active={pathname === '/chat'} onClick={() => go('/chat')} collapsed={collapsed} />
          <NavItem icon={GitFork} label="Workflow Builder" active={isActive('/builder')} onClick={() => go('/builder')} collapsed={collapsed} />
          <NavItem icon={LayoutDashboard} label="Dashboard" active={isActive('/dashboard')} onClick={() => go('/dashboard')} collapsed={collapsed} />
        </div>

        {/* New Scope */}
        <div style={{ marginTop: 12, padding: '0 2px' }}>
          <button
            onClick={() => go('/chat')} aria-label="New Scope" title={collapsed ? 'New Scope' : undefined}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 9, justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '9px 0' : '9px 12px', borderRadius: 12, border: '1px dashed rgba(107,33,168,0.30)', cursor: 'pointer', fontFamily: 'inherit', background: 'transparent', color: PURPLE, transition: 'all 180ms ease-out' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(107,33,168,0.06)'; e.currentTarget.style.borderColor = 'rgba(107,33,168,0.55)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(107,33,168,0.30)'; }}
          >
            <span style={{ fontSize: 16, fontWeight: 300, lineHeight: 1, flexShrink: 0 }}>+</span>
            {!collapsed && <span style={{ fontSize: 12, fontWeight: 600, color: PURPLE, whiteSpace: 'nowrap' }}>New Scope</span>}
          </button>
        </div>

        {/* Scopes / recent */}
        <div style={{ marginTop: 16 }}>
          {collapsed ? (
            <NavItem icon={FolderOpen} label="Scopes" active={false} onClick={() => setCollapsed(false)} collapsed={collapsed} />
          ) : (
            <>
              <button onClick={() => setScopesOpen((v) => !v)} style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', padding: '7px 12px', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 9 }} onMouseEnter={(e) => { e.currentTarget.style.background = SURFACE2; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                <FolderOpen size={16} style={{ color: TEXT_SECONDARY, flexShrink: 0 }} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: TEXT_SECONDARY }}>Scopes</span>
                <ChevronDown size={11} style={{ color: TEXT_TERTIARY, transform: scopesOpen ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 200ms ease-out' }} />
              </button>
              {scopesOpen && (
                <div style={{ paddingLeft: 10, display: 'flex', flexDirection: 'column', gap: 1, marginTop: 2 }}>
                  {RECENT.map((r) => (
                    <button key={r.id} onClick={() => go(r.route)} style={{ width: '100%', textAlign: 'left', background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: 8, minWidth: 0 }} onMouseEnter={(e) => { e.currentTarget.style.background = SURFACE2; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                      <div style={{ fontSize: 12, fontWeight: 550, color: TEXT_PRIMARY, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.title}</div>
                      <div style={{ fontSize: 10, color: TEXT_TERTIARY }}>{r.sub}</div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        <div style={{ flex: 1 }} />

        {/* User + settings */}
        <div style={{ marginBottom: 4 }}>
          <button aria-label="Profile" title={collapsed ? 'Sophia Laurent' : undefined} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: collapsed ? 0 : 10, justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '9px 0' : '9px 12px', borderRadius: 12, border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: 'transparent' }} onMouseEnter={(e) => { e.currentTarget.style.background = SURFACE2; }} onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
            <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: `linear-gradient(135deg, ${PURPLE} 0%, #9333EA 100%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 11, fontWeight: 700 }}>SL</div>
            {!collapsed && (
              <div style={{ textAlign: 'left', minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: TEXT_PRIMARY, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Sophia Laurent</div>
                <div style={{ fontSize: 10, color: TEXT_TERTIARY }}>Tax Manager</div>
              </div>
            )}
          </button>
        </div>
        <NavItem icon={Settings} label="Settings" active={isActive('/settings')} onClick={() => go('/settings')} collapsed={collapsed} />
      </nav>
    </>
  );
}
