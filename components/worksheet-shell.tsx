'use client';

// Shared frame for worksheet routes so they respect the design language:
// dark grid background (app-shell), a neumorphic sidebar, and the worksheet in a
// centered, scrollable light card. Worksheets vary internally (some grow, some
// use h-screen) — a CSS override forces the wrapped root to flow so the card
// scrolls consistently.

import type { ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Calculator, FileText, Layers, BarChart3, LayoutDashboard, Building2 } from 'lucide-react';
import { useAtomValue } from 'jotai';
import { NeumorphicSidebar, NeuSidebarHeader, NeuSectionLabel, NeuRow } from '@/components/neumorphic-sidebar';
import { selectedClientAtom } from '@/lib/nav-store';

const WS_NAV = [
  { label: 'FAPI Workpaper', href: '/fapi', Icon: Calculator },
  { label: 'T1134 Workpaper', href: '/t1134', Icon: FileText },
  { label: 'Surplus Continuity', href: '/surplus', Icon: Layers },
  { label: 'Executive Overview', href: '/bu-overview', Icon: BarChart3 },
];

export function WorksheetShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const client = useAtomValue(selectedClientAtom);

  return (
    <div className="h-full flex">
      <style>{`
        /* Force wrapped worksheet roots to flow at natural height so the card
           scrolls (they otherwise use h-screen / their own overflow). */
        .worksheet-card > * { height: auto !important; min-height: 100% !important; overflow: visible !important; }
      `}</style>

      <NeumorphicSidebar header={<NeuSidebarHeader title="Worksheets" subtitle={client} />}>
        {WS_NAV.map(({ label, href, Icon }) => (
          <NeuRow key={href} icon={<Icon size={14} />} label={label} active={pathname === href} onClick={() => router.push(href)} />
        ))}
        <NeuSectionLabel>Workspace</NeuSectionLabel>
        <NeuRow icon={<Building2 size={14} />} label="Client file" onClick={() => router.push('/client/northstar')} />
        <NeuRow icon={<LayoutDashboard size={14} />} label="Dashboard" onClick={() => router.push('/dashboard')} />
      </NeumorphicSidebar>

      <div className="flex-1 min-w-0 overflow-auto" style={{ padding: 12 }}>
        <div className="worksheet-card" style={{ background: '#fff', borderRadius: 16, boxShadow: '0 14px 34px rgba(0,0,0,0.30)', overflow: 'hidden', minHeight: '100%' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
