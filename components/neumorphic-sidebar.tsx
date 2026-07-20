'use client';

// ─────────────────────────────────────────────────────────────────────────────
// NeumorphicSidebar — the shared per-page left rail (InScope neumorphic surface).
// One consistent, foldable shell used across pages. Collapsed → a slim icon rail
// (menu icons stay visible). Fold state is global + persisted so it stays
// consistent as you move between pages.
// ─────────────────────────────────────────────────────────────────────────────

import type { CSSProperties, ReactNode } from 'react';
import { atomWithStorage } from 'jotai/utils';
import { useAtom, useAtomValue } from 'jotai';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const sidebarCollapsedAtom = atomWithStorage('inscope.sidebar.collapsed', false);

export const NEU = {
  bg: '#F4F5F8',
  surface: '#F8F9FB',
  text: '#202735',
  muted: '#7C8493',
  faint: '#A8AEBA',
  accent: '#6B21A8',
  shadowOut: '8px 8px 18px rgba(158,158,178,0.34), -8px -8px 18px rgba(255,255,255,0.82)',
  shadowSm: '4px 4px 10px rgba(158,158,178,0.30), -4px -4px 10px rgba(255,255,255,0.78)',
  shadowIn: 'inset 4px 4px 9px rgba(158,158,178,0.30), inset -4px -4px 9px rgba(255,255,255,0.78)',
};

const COLLAPSED_W = 60;
const toggleStyle: CSSProperties = { width: 28, height: 28, borderRadius: 9, border: 'none', background: NEU.surface, boxShadow: NEU.shadowSm, color: NEU.muted, cursor: 'pointer', display: 'grid', placeItems: 'center', flexShrink: 0 };

export function NeumorphicSidebar({ header, footer, children, width = 248, floating = false, contentClassName, collapseHideLabels = false }: {
  header?: ReactNode; footer?: ReactNode; width?: number; floating?: boolean; contentClassName?: string; collapseHideLabels?: boolean; children: ReactNode;
}) {
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom);
  const w = collapsed ? COLLAPSED_W : width;
  // NB: `absolute` (floating) IS a positioning context for the absolute toggle,
  // so we don't add `relative` on top of it (that would clobber the stretch).
  const posClass = floating ? 'pointer-events-auto absolute left-3 top-16 bottom-3 z-30' : 'relative shrink-0';
  // For raw content (the Builder toolbar): force every descendant's text to 0
  // (the buttons set their own font-size, so a parent text-[0px] won't cascade),
  // which hides labels while the fixed-size SVG icons stay.
  const rawIconCls = collapsed && collapseHideLabels
    ? 'items-center [&_*]:!text-[0px] [&_.neu-action]:!justify-center [&_.neu-action]:!px-0 [&_.neu-action]:!gap-0'
    : '';

  return (
    <aside
      className={`flex flex-col ${posClass}`}
      style={{ width: w, margin: floating ? 0 : 12, borderRadius: 20, background: NEU.bg, boxShadow: 'none', overflow: 'hidden', transition: 'width 220ms cubic-bezier(0.23,1,0.32,1)' }}
    >
      <style>{`.neu-row:hover { background: rgba(158,158,178,0.12) !important; }`}</style>

      {collapsed ? (
        <div className="flex justify-center shrink-0" style={{ padding: '12px 0 8px' }}>
          <button onClick={() => setCollapsed(false)} title="Expand sidebar" aria-label="Expand sidebar" style={toggleStyle}>
            <ChevronRight size={15} />
          </button>
        </div>
      ) : (
        <>
          <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 3 }}>
            <button onClick={() => setCollapsed(true)} title="Collapse sidebar" aria-label="Collapse sidebar" style={toggleStyle}>
              <ChevronLeft size={15} />
            </button>
          </div>
          {header && <div className="shrink-0" style={{ padding: '16px 46px 10px 16px' }}>{header}</div>}
        </>
      )}

      <div className={`flex-1 overflow-y-auto flex flex-col ${rawIconCls} ${contentClassName ?? ''}`} style={{ padding: collapsed ? '2px 8px 12px' : '4px 10px 12px', scrollbarWidth: 'thin' }}>{children}</div>

      {!collapsed && footer && <div className="shrink-0" style={{ padding: '8px 12px 12px' }}>{footer}</div>}
    </aside>
  );
}

export function NeuSidebarHeader({ title, subtitle, dotColor = NEU.accent }: { title: string; subtitle?: string; dotColor?: string }) {
  return (
    <>
      <div className="flex items-center gap-2">
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor }} />
        <div style={{ fontSize: 13, fontWeight: 700, color: NEU.text, letterSpacing: '-0.01em' }}>{title}</div>
      </div>
      {subtitle && <div style={{ fontSize: 11, color: NEU.faint, marginTop: 2, marginLeft: 15 }}>{subtitle}</div>}
    </>
  );
}

export function NeuSectionLabel({ children }: { children: ReactNode }) {
  const collapsed = useAtomValue(sidebarCollapsedAtom);
  if (collapsed) return <div style={{ height: 1, background: 'rgba(158,158,178,0.28)', margin: '7px 6px' }} />;
  return <div style={{ fontSize: 10, fontWeight: 650, letterSpacing: '0.05em', textTransform: 'uppercase', color: NEU.faint, padding: '10px 8px 5px' }}>{children}</div>;
}

const iconSquare = (active?: boolean): CSSProperties => ({ width: 24, height: 24, borderRadius: 8, background: NEU.surface, boxShadow: NEU.shadowSm, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: active ? NEU.accent : NEU.muted });
const ROW: CSSProperties = { padding: '8px 9px', borderRadius: 10, border: 'none', marginBottom: 2, width: '100%', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', textAlign: 'left' };

export function NeuRow({ icon, rawIcon, label, sub, active, badge, dim, onClick }: {
  icon?: ReactNode; rawIcon?: ReactNode; label: string; sub?: string; active?: boolean; badge?: ReactNode; dim?: boolean; onClick?: () => void;
}) {
  const collapsed = useAtomValue(sidebarCollapsedAtom);
  if (collapsed) {
    return (
      <button onClick={onClick} disabled={dim} title={label} className="neu-row" style={{ width: 40, height: 40, borderRadius: 11, border: 'none', background: active ? 'rgba(107,33,168,0.10)' : 'transparent', display: 'grid', placeItems: 'center', margin: '2px auto', cursor: dim ? 'default' : 'pointer', opacity: dim ? 0.5 : 1 }}>
        {rawIcon ?? (icon && <span style={iconSquare(active)}>{icon}</span>)}
      </button>
    );
  }
  return (
    <button onClick={onClick} disabled={dim} className="neu-row" style={{ ...ROW, background: active ? 'rgba(107,33,168,0.10)' : 'transparent', opacity: dim ? 0.5 : 1, cursor: dim ? 'default' : 'pointer' }}>
      {rawIcon ?? (icon && <span style={iconSquare(active)}>{icon}</span>)}
      <span className="min-w-0 flex-1">
        <span style={{ display: 'block', fontSize: 12.5, fontWeight: active ? 650 : 600, color: active ? NEU.accent : NEU.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
        {sub && <span style={{ display: 'block', fontSize: 10.5, color: NEU.muted, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</span>}
      </span>
      {badge}
    </button>
  );
}

export function NeuButton({ icon, label, onClick }: { icon?: ReactNode; label: string; onClick?: () => void }) {
  const collapsed = useAtomValue(sidebarCollapsedAtom);
  if (collapsed) {
    return (
      <button onClick={onClick} title={label} style={{ width: 40, height: 40, borderRadius: 12, border: 'none', background: NEU.surface, boxShadow: NEU.shadowSm, color: NEU.text, cursor: 'pointer', display: 'grid', placeItems: 'center', margin: '0 auto 4px' }}>
        {icon}
      </button>
    );
  }
  return (
    <button onClick={onClick} className="w-full flex items-center gap-2" style={{ padding: '9px 12px', borderRadius: 12, border: 'none', background: NEU.surface, boxShadow: NEU.shadowSm, color: NEU.text, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' }}>
      {icon} {label}
    </button>
  );
}
