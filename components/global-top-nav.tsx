'use client';

import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { selectedClientAtom, showClientSwitcherAtom, navActionsAtom } from '@/lib/nav-store';

const NAV_H = 52;

export function GlobalTopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const isCanvasPage = pathname === '/builder' || pathname.startsWith('/workflows/') || pathname === '/t1134';
  const [client] = useAtom(selectedClientAtom);
  const setShowClientSwitcher = useSetAtom(showClientSwitcherAtom);
  const navActions = useAtomValue(navActionsAtom);

  return (
    <div
      className="shrink-0 flex items-center px-5 gap-3 z-20 pointer-events-auto"
      style={{
        height: NAV_H,
        background: '#eaeaef',
        borderBottom: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.82), 0 2px 6px rgba(158,158,178,0.10)',
      }}
    >
      {/* Logo */}
      <button
        onClick={() => router.push('/')}
        className="flex items-baseline gap-0.5 select-none shrink-0"
        style={{ background: 'transparent', border: 'none', padding: 0 }}
      >
        <span style={{ fontSize: 15, fontWeight: 700, color: '#1F2937', letterSpacing: '-0.01em' }}>
          Sinaxe
        </span>
        <span style={{ fontSize: 7, color: '#9CA3AF', verticalAlign: 'super' }}>™</span>
        <span style={{ fontSize: 15, fontWeight: 400, color: '#6B7280', marginLeft: 2, letterSpacing: '-0.01em' }}>
          InScope
        </span>
      </button>

      {/* Separator */}
      <div style={{ width: 1, height: 18, background: 'rgba(0,0,0,0.1)', flexShrink: 0 }} />

      {isCanvasPage ? (
        /* On canvas pages: slot div that WorkflowToolbar portals its content into */
        <div
          id="global-nav-workflow-slot"
          className="flex-1 flex items-center h-full min-w-0 overflow-visible gap-0.5 pointer-events-auto"
        />
      ) : (
        <>
          {/* Client selector */}
          <button
            onClick={() => setShowClientSwitcher(true)}
            className="flex items-center gap-1.5 rounded-full px-2.5 py-1 transition-all hover:bg-black/5"
            style={{
              background: 'rgba(0,0,0,0.04)',
              border: '1px solid rgba(0,0,0,0.08)',
              fontSize: 12,
              fontWeight: 600,
              color: '#374151',
            }}
          >
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0"
              style={{ background: 'rgba(107,33,168,0.12)', color: '#6B21A8' }}
            >
              {client.charAt(0)}
            </span>
            <span className="max-w-[140px] truncate">{client}</span>
            <ChevronDown size={10} className="text-gray-400" />
          </button>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Page-specific nav actions registered by current page */}
          {navActions.map((action) => (
            <button
              key={action.id}
              onClick={() => router.push(action.href)}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-colors hover:bg-black/5"
              style={{
                background: 'transparent',
                border: '1px solid rgba(0,0,0,0.08)',
                fontSize: 11.5,
                fontWeight: 500,
                color: '#6B7280',
              }}
            >
              {action.label}
            </button>
          ))}
        </>
      )}

    </div>
  );
}

export const NAV_HEIGHT = NAV_H;
