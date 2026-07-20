'use client';

// PageMenuBar — renders a page's published PageMenu in the shared panel header
// (dark LibreChat style). Left items sit near the tabs, right items at the far
// end. Dropdowns open a small popover; keep visible items to a few and push the
// rest into a ⋯ dropdown so the header stays un-busy.

import { useRef, useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { LC } from '@/lib/librechat-theme';
import type { PageMenu, PageMenuItem, MenuDropdown } from '@/lib/page-menu-store';

function Dropdown({ item }: { item: MenuDropdown }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open]);
  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <button
        onClick={() => setOpen((o) => !o)}
        title={item.title}
        className="hover:bg-black/5"
        style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: item.label ? '0 8px' : '0 6px', borderRadius: 7, border: 'none', background: open ? LC.surface : 'transparent', color: LC.body, cursor: 'pointer', fontSize: 12.5, fontWeight: 500 }}
      >
        {item.icon}{item.label}<ChevronDown size={12} style={{ opacity: 0.55 }} />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, minWidth: 168, zIndex: 40, background: LC.surface, border: `1px solid ${LC.border}`, borderRadius: 10, boxShadow: LC.shadowOut, overflow: 'hidden', padding: 4 }}>
          {item.items.map((it) => (
            <button
              key={it.id}
              onClick={() => { if (!it.disabled) { it.onClick(); setOpen(false); } }}
              disabled={it.disabled}
              className="hover:bg-black/5"
              style={{ display: 'flex', alignItems: 'center', width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 7, border: 'none', background: 'transparent', color: it.danger ? '#f87171' : it.disabled ? LC.faint : LC.body, cursor: it.disabled ? 'default' : 'pointer', fontSize: 13, opacity: it.disabled ? 0.6 : 1 }}
            >
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Item({ item }: { item: PageMenuItem }) {
  if (item.kind === 'separator') return <span style={{ width: 1, height: 18, background: LC.border, margin: '0 4px', flexShrink: 0 }} />;
  if (item.kind === 'dropdown') return <Dropdown item={item} />;
  // button
  const primary = item.primary;
  return (
    <button
      onClick={item.onClick}
      disabled={item.disabled}
      title={item.title ?? item.label}
      className={primary ? '' : 'hover:bg-black/5'}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: item.label ? '0 11px' : '0 7px',
        borderRadius: 7, border: primary ? 'none' : (item.active ? `1px solid ${LC.border}` : 'none'),
        background: primary ? LC.accent : item.active ? LC.surface : 'transparent',
        color: primary ? '#1a1030' : item.disabled ? LC.faint : LC.body,
        cursor: item.disabled ? 'default' : 'pointer', fontSize: 12.5, fontWeight: primary ? 650 : 500,
        opacity: item.disabled ? 0.55 : 1, flexShrink: 0,
      }}
    >
      {item.icon}{item.label}
    </button>
  );
}

export function PageMenuBar({ menu }: { menu: PageMenu }) {
  const left = menu.left ?? [];
  const right = menu.right ?? [];
  if (left.length === 0 && right.length === 0) return null;
  return (
    // flex '1 0 auto' — grow to fill (so left items sit near the tabs and right
    // items push to the far end via the spacer), but NEVER shrink below content
    // width. Shrinking crushed the bar and made its items overlap/overflow the
    // header when several tabs were open; instead the tab strip (flex 1 1 auto)
    // absorbs the squeeze and scrolls, keeping the whole menu intact.
    <div style={{ display: 'flex', alignItems: 'center', gap: 3, flex: '1 0 auto', paddingLeft: 6 }}>
      {left.map((it) => <Item key={it.id} item={it} />)}
      <div style={{ flex: 1 }} />
      {right.map((it) => <Item key={it.id} item={it} />)}
    </div>
  );
}
