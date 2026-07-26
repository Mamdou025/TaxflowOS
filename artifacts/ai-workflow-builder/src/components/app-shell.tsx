

import { usePathname } from '@/lib/router';
import type { ReactNode } from 'react';
import { CopilotKit } from '@copilotkit/react-core';
import { GlobalTopNav } from '@/components/global-top-nav';
import { GlobalClientSwitcher } from '@/components/global-client-switcher';
import { PersistentCanvas } from '@/features/workflow-builder/ui/persistent-canvas';
import { AssistantPanel } from '@/features/assistant/ui/assistant-panel';
import { MemoryCopilot } from '@/features/assistant/ui/memory-copilot';
import { SpecialistPresence } from '@/features/assistant/ui/specialist-presence';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // The Agent Lab (/agent-lab) is a standalone, isolated surface: no global nav,
  // no CopilotKit chat overlay, its own scroll. `body` is locked to `overflow:hidden`
  // at 100dvh (globals.css), so this must be a FIXED-height container that scrolls
  // internally (`h-dvh` + overflow-y-auto) — `min-h-dvh` would grow past the screen
  // and get clipped by the body. It ships its own back button.
  if (pathname.startsWith('/agent-lab')) {
    return <div className="h-dvh overflow-y-auto bg-white dark:bg-neutral-950">{children}</div>;
  }

  const isCanvasPage = pathname === '/builder' || pathname.startsWith('/workflows/');
  // Scope (/) is now the full-height LibreChat shell — flat dark, its own sidebar
  // for nav, so no global grid and no top navbar there.
  const isScope = pathname === '/';
  const isGridPage =
    pathname === '/dashboard' ||
    ['/fapi', '/t1134', '/surplus', '/bu-overview', '/worksheets'].includes(pathname) ||
    pathname.startsWith('/client');
  // Light neumorphic pages paint a full-viewport light bg so the floating navbar
  // sits on the page colour (no white strip behind the transparent nav row).
  const isLightPage = pathname.startsWith('/run/');

  return (
    // The GET /api/copilotkit handler (route.ts) answers the SDK's startup /info
    // health-check, so the "Runtime info request failed" banner no longer fires.
    // showDevConsole is intentionally omitted here (defaults to true in dev) so
    // legitimate AI runtime errors — wrong key, rate-limit, model failure — surface
    // as banners for developers and users.
    <CopilotKit runtimeUrl="/api/copilotkit">
      {/* Fixed canvas layer — only active on builder/workflow pages */}
      <PersistentCanvas />

      {/* Fixed page background — a flat darker gray (no grid) that reads as the
          recessed space behind the neumorphic menus. Tuned to the neumorphic
          shadow tone (rgba(158,158,178)), a shade darker than the #eaeaef
          surface. Chat/Scope keep their own dark-grid canvas. */}
      {isGridPage && (
        <div
          className="fixed inset-0"
          style={{ zIndex: 0, backgroundColor: 'var(--sx-ground)' }}
        />
      )}

      {/* Full-viewport light background for neumorphic pages (behind the nav) */}
      {isLightPage && <div className="fixed inset-0" style={{ zIndex: 0, background: 'var(--sx-ground-run)' }} />}

      {/* Main layout stack — pointer-events-none on canvas pages so events reach PersistentCanvas */}
      <div
        className={`relative z-10 flex flex-col${isCanvasPage ? ' pointer-events-none' : ''}`}
        style={{ height: '100dvh' }}
      >
        {!isScope && <GlobalTopNav />}
        <div
          className={`flex-1 relative overflow-hidden${isCanvasPage ? ' pointer-events-none' : ''}`}
        >
          {children}
        </div>
      </div>

      {/* Chat is a full page now — see app/chat/page.tsx (ChatWorkspace). */}

      {/* Ambient assistant — docked panel that overlays every page except "/"
          (focus mode). The navbar "Ask Scope on this page" button (global-top-nav)
          toggles it; it stays mounted (tools registered, context flowing) even
          while slid off-screen. */}
      <AssistantPanel />

      {/* Durable memory instrument — registers rememberFact/forgetFact + publishes
          the user's remembered facts (Postgres-backed) as grounding. Mounted once
          here so it registers a single time across all routes. Renders nothing. */}
      <MemoryCopilot />

      {/* Shows that Sina is answering the current turn — cosmetic; yields to a
          live run. See specialist-presence.tsx. */}
      <SpecialistPresence />

      {/* Floating layers — rendered outside the stacking context so they layer over everything */}
      <GlobalClientSwitcher />
    </CopilotKit>
  );
}
