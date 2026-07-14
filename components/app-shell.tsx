'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { GlobalTopNav } from '@/components/global-top-nav';
import { GlobalClientSwitcher } from '@/components/global-client-switcher';
import { PersistentCanvas } from '@/components/workflow/persistent-canvas';
import { ActionOrb } from '@/components/action-orb';
import { CopilotWorkspacePanel } from '@/components/workspace/copilot-workspace-panel';

// Fades from #eaeaef → transparent each time the canvas page is entered,
// revealing the dark canvas beneath. Lives at z-[15] so it covers the z-10
// content layer but stays below the z-20 chat overlay.
function CanvasEnterOverlay() {
  const [faded, setFaded] = useState(false);

  useEffect(() => {
    // Two rAF frames so the browser paints opacity:1 first, then triggers the transition
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setFaded(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        background: '#eaeaef',
        opacity: faded ? 0 : 1,
        transition: 'opacity 900ms cubic-bezier(0.23,1,0.32,1)',
        zIndex: 15,
      }}
    />
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isCanvasPage = pathname === '/builder' || pathname.startsWith('/workflows/');

  // Remount the overlay each time the user enters a canvas page so the fade
  // restarts from scratch even on repeated visits.
  const [enterKey, setEnterKey] = useState(0);
  useEffect(() => {
    if (isCanvasPage) {
      setEnterKey((k) => k + 1);
    }
  }, [isCanvasPage]);

  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      {/* Fixed canvas layer — only active on builder/workflow pages */}
      <PersistentCanvas />

      {/* Main layout stack — pointer-events-none on canvas pages so events reach PersistentCanvas */}
      <div
        className={`relative z-10 flex flex-col${isCanvasPage ? ' pointer-events-none' : ''}`}
        style={{ height: '100dvh' }}
      >
        <GlobalTopNav />
        <div
          className={`flex-1 relative overflow-hidden${isCanvasPage ? ' pointer-events-none' : ''}`}
        >
          {children}
        </div>
      </div>

      {/* Light → transparent overlay that plays on every canvas page entry */}
      {isCanvasPage && <CanvasEnterOverlay key={enterKey} />}

      {/* Chat Workspace — CopilotKit-powered chat + pages-in-tabs (z-44) */}
      <CopilotWorkspacePanel />

      {/* ActionOrb — launcher orb + radial nav (z-50) */}
      <ActionOrb />

      {/* Floating layers — rendered outside the stacking context so they layer over everything */}
      <GlobalClientSwitcher />
    </CopilotKit>
  );
}
