'use client';

// ─────────────────────────────────────────────────────────────────────────────
// ChatWorkspace — the Scope page (route "/"), LibreChat-style (dark):
//   [ left nav sidebar ] · [ inline page panel ] · [ chat on the RIGHT ]
//
// The chat is the always-present element. Opening a page from the sidebar expands
// a panel; the chat docks to the right and never leaves, so you keep asking the
// assistant about the open page (they share one CopilotKit tree). Pages render
// inline; the builder is the real canvas (InlineBuilder). Palette: librechat-theme.
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { X, Plus, GitFork, Bot, LayoutDashboard, Workflow, PanelRightClose, Maximize2, Minimize2, MessageSquare, Files, LayoutGrid, ChevronDown, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { chatPanelModeAtom } from '@/lib/chat-store';
import {
  workspaceWindowsAtom,
  activeWindowIdAtom,
  openWorkspaceWindowAtom,
  closeWorkspaceWindowAtom,
  focusWorkspaceWindowAtom,
} from '@/lib/workspace-store';
import { getPage } from '@/lib/resource-registry';
import { WORKFLOWS, getAgent, type WorkflowSuggestion } from '@/lib/agents';
import { useAssistant } from '@/components/assistant/use-assistant';
import { AssistantThread } from '@/components/assistant/assistant-thread';
import { InlineBuilder } from '@/components/workflow/inline-builder';
import { AgentBuilder } from '@/components/assistant/agent-builder';
import { ScopeMark } from '@/components/scope-orb';
import { ClientFolders } from '@/components/workspace/client-folders';
import { LC } from '@/lib/librechat-theme';
import { NEU } from '@/components/neumorphic-sidebar';
import { pageMenusAtom } from '@/lib/page-menu-store';
import { PageMenuBar } from '@/components/workspace/page-menu-bar';
import { InlinePageProvider } from '@/lib/inline-page-context';

// Foldable Scope sidebar — persisted so it stays folded across navigation.
const scopeSidebarCollapsedAtom = atomWithStorage('inscope.scope-sidebar.collapsed', false);

// The dark grid ground for the Scope canvas + the inline page bodies — the same
// grid the other routes use (app-shell). The light neumorphic sidebar and chat
// float on it so the chat reads as the prominent, important surface.
const DARK_GRID: CSSProperties = {
  backgroundColor: '#18181c',
  backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
  backgroundSize: '15px 15px',
};
const foldBtn: CSSProperties = { width: 26, height: 26, borderRadius: 9, border: 'none', background: NEU.surface, boxShadow: NEU.shadowSm, color: NEU.muted, cursor: 'pointer', display: 'grid', placeItems: 'center', flexShrink: 0 };

// Dark "portal" chrome — an opened page is a dark recessed slot wedged between the
// light neumorphic sidebar and chat. These theme its tab strip + tabs. The dark is
// ONLY the background: a page's files/content still render in their normal LIGHT
// form (never inverted to dark mode — a light/dark toggle is a future feature).
const PORTAL_INK = '#e7e7ea';
const PORTAL_MUTED = 'rgba(255,255,255,0.52)';
const PORTAL_BORDER = 'rgba(255,255,255,0.08)';

const WORKSPACE_ITEMS: { key: string; title: string; Icon: typeof GitFork }[] = [
  { key: 'workflow-builder', title: 'Workflow Builder', Icon: GitFork },
  { key: 'agent-builder', title: 'Agent Builder', Icon: Bot },
  { key: 'dashboard', title: 'Dashboard', Icon: LayoutDashboard },
  { key: 'viewer', title: 'Documents', Icon: Files },
  { key: 'worksheets', title: 'Worksheets', Icon: LayoutGrid },
];

// The workflow(s) each open page can run — drives the contextual "Run" group,
// which now follows the active tab instead of a permanent global list. Pages not
// listed here show no Run group (workflows without a page — roulement, campaign —
// stay reachable from the chat launcher / agents).
const PAGE_WORKFLOWS: Record<string, string[]> = {
  fapi: ['fapi'],
  expense: ['expense'],
  surplus: ['surplus'],
};

function runsForPage(pageKey: string | undefined): WorkflowSuggestion[] {
  if (!pageKey) return [];
  return (PAGE_WORKFLOWS[pageKey] ?? [])
    .map((id) => WORKFLOWS.find((w) => w.id === id))
    .filter((w): w is WorkflowSuggestion => Boolean(w));
}

function titleFor(key: string): string {
  const local = WORKSPACE_ITEMS.find((i) => i.key === key);
  return getPage(key)?.title ?? local?.title ?? key;
}

function PageBody({ pageKey }: { pageKey: string }) {
  // Render the page directly — do NOT wrap in a nested component defined here, or
  // every render creates a new component type and remounts the page (which, with
  // usePageMenu writing an atom this tree reads, loops infinitely).
  let content: ReactNode;
  if (pageKey === 'workflow-builder') content = <InlineBuilder />;
  else if (pageKey === 'agent-builder') content = <AgentBuilder />;
  else {
    const Comp = getPage(pageKey)?.Component ?? null;
    content = Comp ? <Comp /> : <div style={{ padding: 32, fontSize: 13, color: LC.muted }}>Page unavailable.</div>;
  }
  // Pages read useInlinePage() to hide their own chrome + publish a header menu.
  return <InlinePageProvider>{content}</InlinePageProvider>;
}

// ── Neumorphic sidebar bits (light NEU rail on the dark Scope canvas) ───────────
function SideLabel({ children }: { children: ReactNode }) {
  return <div style={{ padding: '13px 10px 5px', fontSize: 10, fontWeight: 650, letterSpacing: '0.05em', textTransform: 'uppercase', color: NEU.faint }}>{children}</div>;
}
function SideRow({ icon, label, sub, dim, collapsed, onClick }: { icon: ReactNode; label: string; sub?: string; dim?: boolean; collapsed?: boolean; onClick: () => void }) {
  if (collapsed) {
    return (
      <button onClick={onClick} title={label} className="lc-siderow" style={{ display: 'grid', placeItems: 'center', width: 46, height: 46, borderRadius: 12, border: 'none', background: 'transparent', cursor: 'pointer', margin: '2px auto', opacity: dim ? 0.55 : 1 }}>
        <span style={{ width: 30, height: 30, borderRadius: 9, background: NEU.surface, boxShadow: NEU.shadowSm, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: NEU.muted }}>{icon}</span>
      </button>
    );
  }
  return (
    <button
      onClick={onClick}
      className="lc-siderow"
      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '7px 9px', borderRadius: 10, border: 'none', background: 'transparent', color: dim ? NEU.faint : NEU.text, cursor: 'pointer', opacity: dim ? 0.65 : 1, marginBottom: 1 }}
    >
      <span style={{ width: 26, height: 26, borderRadius: 8, background: NEU.surface, boxShadow: NEU.shadowSm, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: NEU.muted }}>{icon}</span>
      <span style={{ minWidth: 0, flex: 1 }}>
        <span style={{ display: 'block', fontSize: 13, fontWeight: 600, color: dim ? NEU.faint : NEU.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
        {sub && <span style={{ display: 'block', fontSize: 10.5, color: NEU.muted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{sub}</span>}
      </span>
    </button>
  );
}
// A collapsible menu group — click the header to expand/collapse its rows.
function SideSection({ label, defaultOpen = true, children }: { label: string; defaultOpen?: boolean; children: ReactNode }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '13px 10px 5px', background: 'transparent', border: 'none', cursor: 'pointer' }}
      >
        <span style={{ fontSize: 10, fontWeight: 650, letterSpacing: '0.05em', textTransform: 'uppercase', color: NEU.faint }}>{label}</span>
        <ChevronDown size={12} style={{ marginLeft: 'auto', color: NEU.faint, transform: open ? 'rotate(0deg)' : 'rotate(-90deg)', transition: 'transform 180ms ease' }} />
      </button>
      {open && children}
    </>
  );
}

export function ChatWorkspace() {
  const windows = useAtomValue(workspaceWindowsAtom);
  const [activeId, setActiveId] = useAtom(activeWindowIdAtom);
  const openWindow = useSetAtom(openWorkspaceWindowAtom);
  const closeWindow = useSetAtom(closeWorkspaceWindowAtom);
  const focusWindow = useSetAtom(focusWorkspaceWindowAtom);
  const [focus, setFocus] = useState<{ pageKey: string; anchor: string; nonce: number } | null>(null);
  const pageBodyRef = useRef<HTMLDivElement>(null);

  const a = useAssistant();

  const pageMenus = useAtomValue(pageMenusAtom);
  const [mode, setMode] = useAtom(chatPanelModeAtom);
  const [collapsed, setCollapsed] = useAtom(scopeSidebarCollapsedAtom);
  const hasPages = windows.length > 0;
  const active = windows.find((w) => w.id === activeId) ?? windows[windows.length - 1] ?? null;
  const activeMenu = active ? pageMenus[active.pageKey] : undefined;
  const activeRuns = runsForPage(active?.pageKey); // contextual Run group — follows the open tab

  // Closing the *last* page collapses the page panel to zero width and lets the
  // chat glide into the freed space (a slide), then removes the window once the
  // transition finishes — so the panel doesn't just blink out of existence.
  const [closingLast, setClosingLast] = useState(false);
  const closeTimer = useRef<number | null>(null);
  useEffect(() => () => { if (closeTimer.current) window.clearTimeout(closeTimer.current); }, []);

  // Reset the split when the last page closes.
  useEffect(() => {
    if (!hasPages && mode !== 'split') setMode('split');
  }, [hasPages, mode, setMode]);

  const showPage = hasPages && mode !== 'expanded' && !closingLast;
  const showChat = !hasPages || mode !== 'collapsed';
  // The chat takes the whole surface: no page open, chat expanded, or the last
  // page is mid-slide-out.
  const chatFull = !hasPages || mode === 'expanded' || closingLast;

  useEffect(() => {
    if (hasPages && !windows.some((w) => w.id === activeId)) setActiveId(windows[windows.length - 1].id);
  }, [windows, activeId, hasPages, setActiveId]);

  const open = (key: string) => openWindow({ pageKey: key, title: titleFor(key) });

  // Close a tab. More than one open → just drop it (we land on a sibling, nothing
  // to reveal). Closing the last one plays the slide: collapse now, remove after.
  const requestClose = (id: string) => {
    if (windows.length > 1) { closeWindow(id); return; }
    setClosingLast(true);
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      closeWindow(id);
      setClosingLast(false);
      closeTimer.current = null;
    }, 320);
  };

  useEffect(() => {
    const onFocus = (e: Event) => {
      const d = (e as CustomEvent).detail as { pageKey: string; anchor: string };
      setFocus({ ...d, nonce: Date.now() });
      const win = windows.find((w) => w.pageKey === d.pageKey);
      if (win) setActiveId(win.id);
    };
    window.addEventListener('cwp-focus-anchor', onFocus);
    return () => window.removeEventListener('cwp-focus-anchor', onFocus);
  }, [windows, setActiveId]);

  useEffect(() => {
    if (!focus || !active || active.pageKey !== focus.pageKey) return;
    let raf = 0, tries = 0;
    const attempt = () => {
      const el = pageBodyRef.current?.querySelector<HTMLElement>(`[data-anchor="${focus.anchor}"]`) ?? null;
      if (el) {
        el.scrollIntoView({ block: 'center', behavior: 'smooth' });
        el.classList.add('cwp-anchor-flash');
        window.setTimeout(() => el.classList.remove('cwp-anchor-flash'), 1700);
        return;
      }
      if (tries++ < 120) raf = requestAnimationFrame(attempt);
    };
    raf = requestAnimationFrame(attempt);
    return () => cancelAnimationFrame(raf);
  }, [focus, active]);

  return (
    // Exterior ground — a cooler/darker tone than the chat (logo-grey #E9EDF4) +
    // sidebar panels, so they read as their own lighter surfaces.
    <div className="h-full flex" style={{ background: '#DAE0EA' }}>
      <style>{`
        @keyframes cwp-anchor-flash { 0% { background: rgba(107,33,168,0.16);} 100% { background: transparent;} }
        .cwp-anchor-flash { animation: cwp-anchor-flash 1.7s ease-out; border-radius: 8px; }
        .lc-siderow:hover { background: rgba(158,158,178,0.16) !important; }
        .lc-tab { position: relative; }
        .lc-tab[data-active="true"]::after { content:''; position:absolute; left:10px; right:10px; bottom:-1px; height:2px; background:${PORTAL_INK}; border-radius:2px; }
        .cwp-card { transition: flex-basis 300ms cubic-bezier(0.23,1,0.32,1), flex-grow 300ms cubic-bezier(0.23,1,0.32,1), margin 260ms cubic-bezier(0.23,1,0.32,1), border-radius 260ms cubic-bezier(0.23,1,0.32,1); }
        @keyframes cwp-page-in { from { opacity: 0; transform: translateY(8px) scale(0.99); } to { opacity: 1; transform: none; } }
        .cwp-page-in { animation: cwp-page-in 300ms cubic-bezier(0.23,1,0.32,1) both; }
      `}</style>

      {/* ── Left nav sidebar (foldable → icon rail) ── */}
      <div style={{ width: collapsed ? 66 : 258, flexShrink: 0, margin: 10, borderRadius: 12, background: NEU.bg, boxShadow: NEU.shadowOut, display: 'flex', flexDirection: 'column', padding: collapsed ? '12px 8px' : '12px 10px', overflowY: 'auto', overflowX: 'hidden', scrollbarWidth: 'thin', transition: 'width 240ms cubic-bezier(0.23,1,0.32,1)' }}>
        {collapsed ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '2px 0 10px' }}>
            <ScopeMark size={26} />
            <button onClick={() => setCollapsed(false)} title="Expand sidebar" aria-label="Expand sidebar" style={foldBtn}><PanelLeftOpen size={15} /></button>
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 6px 12px' }}>
            <ScopeMark size={24} />
            <span style={{ fontSize: 14, fontWeight: 700, color: NEU.text, letterSpacing: '-0.01em' }}>Scope</span>
            <button onClick={() => setCollapsed(true)} title="Collapse sidebar" aria-label="Collapse sidebar" style={{ ...foldBtn, marginLeft: 'auto' }}><PanelLeftClose size={15} /></button>
          </div>
        )}

        {collapsed ? (
          <button onClick={() => a.newChat()} title="New chat" aria-label="New chat" style={{ width: 46, height: 46, borderRadius: 12, border: 'none', background: NEU.surface, boxShadow: NEU.shadowSm, color: NEU.text, cursor: 'pointer', display: 'grid', placeItems: 'center', margin: '0 auto 4px' }}><Plus size={18} /></button>
        ) : (
          <button
            onClick={() => a.newChat()}
            className="hover:brightness-105"
            style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 12px', borderRadius: 12, border: 'none', background: NEU.surface, boxShadow: NEU.shadowSm, color: NEU.text, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
          >
            <Plus size={15} /> New chat
          </button>
        )}

        {collapsed ? (
          <>
            <div style={{ height: 1, background: 'rgba(158,158,178,0.28)', margin: '8px 8px' }} />
            {WORKSPACE_ITEMS.map((it) => <SideRow key={it.key} collapsed icon={<it.Icon size={16} />} label={it.title} onClick={() => open(it.key)} />)}
            {activeRuns.length > 0 && <div style={{ height: 1, background: 'rgba(158,158,178,0.28)', margin: '8px 8px' }} />}
            {activeRuns.map((w) => (
              <SideRow key={w.id} collapsed icon={<Workflow size={16} />} label={w.name} dim={!w.ready} onClick={() => a.launchStartWorkflow(w.id)} />
            ))}
          </>
        ) : (
          <>
            <SideSection label="Workspace">
              {WORKSPACE_ITEMS.map((it) => <SideRow key={it.key} icon={<it.Icon size={15} />} label={it.title} onClick={() => open(it.key)} />)}
            </SideSection>

            <SideSection label="Clients & Chats">
              <ClientFolders />
            </SideSection>

            {/* Run — follows the open tab: only the workflow(s) the active page can run. */}
            {activeRuns.length > 0 && (
              <>
                <SideLabel>{`Run · ${active?.title ?? ''}`}</SideLabel>
                {activeRuns.map((w) => (
                  <SideRow
                    key={w.id} icon={<Workflow size={15} />} label={w.name}
                    sub={`${(w.agentId ? getAgent(w.agentId)?.name : w.sub) ?? w.sub}${!w.ready ? ' · soon' : ''}`}
                    dim={!w.ready} onClick={() => a.launchStartWorkflow(w.id)}
                  />
                ))}
              </>
            )}
          </>
        )}
      </div>

      {/* ── Inline page panel (left) + chat (right) ── */}
      <div className="flex-1 min-w-0 flex relative">
        {hasPages && (
          <div className="min-w-0 flex flex-col cwp-card cwp-page-in" style={{ flex: showPage ? '1 1 0px' : '0 0 0px', overflow: 'hidden', margin: showPage ? '10px 0 10px 8px' : 0, borderRadius: showPage ? '3px 0 0 3px' : 0, ...DARK_GRID, boxShadow: 'none' }}>
            <div className="shrink-0 flex items-center px-3" style={{ height: 40, background: 'rgba(0,0,0,0.18)', borderBottom: `1px solid ${PORTAL_BORDER}` }}>
              <div className="flex items-center gap-1" style={{ overflowX: 'auto', scrollbarWidth: 'none', flex: '1 1 auto', minWidth: 0 }}>
                {windows.map((w) => {
                  const isActive = active?.id === w.id;
                  return (
                    <button key={w.id} className="lc-tab flex items-center gap-1.5 shrink-0" data-active={isActive} onClick={() => focusWindow(w.id)} style={{ padding: '9px 10px', fontSize: 12.5, fontWeight: 500, color: isActive ? PORTAL_INK : PORTAL_MUTED, background: 'none', border: 'none', cursor: 'pointer' }}>
                      <span className="max-w-40 truncate">{w.title}</span>
                      <span onClick={(e) => { e.stopPropagation(); requestClose(w.id); }} className="flex items-center justify-center rounded hover:bg-white/10" style={{ width: 16, height: 16 }}><X size={11} style={{ color: PORTAL_MUTED }} /></span>
                    </button>
                  );
                })}
              </div>
              {/* Active page's contextual menu — published via usePageMenu(). */}
              {activeMenu && <PageMenuBar menu={activeMenu} />}
            </div>
            <div ref={pageBodyRef} className="flex-1 min-h-0 relative" style={{ ...DARK_GRID }}>
              {windows.map((w) => (
                // Inactive tabs use display:none, NOT visibility:hidden — a hidden
                // InlineBuilder is a ReactFlow canvas, and @xyflow forces
                // `visibility:visible` on each measured node, which overrides an
                // ancestor's `visibility:hidden` and makes the builder's node boxes
                // bleed through over the active tab. display:none can't be overridden
                // by descendants, and still keeps the tab mounted (state preserved).
                <div key={w.id} className="absolute inset-0" style={{ display: active?.id === w.id ? 'block' : 'none', overflow: 'auto' }}>
                  <PageBody pageKey={w.pageKey} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat — permanent, on the RIGHT when a page is open; fills otherwise.
            Fold ('collapsed') or take over ('expanded') via the header controls. */}
        <div
          className="min-w-0 flex flex-col cwp-card"
          style={{
            flex: chatFull ? '1 1 0px' : mode === 'collapsed' ? '0 0 0px' : '0 0 clamp(360px, 38%, 520px)',
            overflow: 'hidden',
            margin: mode === 'collapsed' ? 0 : 10,
            marginLeft: hasPages && showPage ? 0 : 10,
            borderRadius: mode === 'collapsed' ? 0 : (hasPages && showPage ? '0 3px 3px 0' : 12),
            background: '#E9EDF4',
            // No dark shadow cast onto the page panel on its left — only the chat's
            // own soft neumorphic elevation (and none while docked flush to a page).
            boxShadow: mode === 'collapsed' ? 'none' : (hasPages && showPage ? 'none' : NEU.shadowOut),
            zIndex: 1,
          }}
        >
          {hasPages && showChat && (
            <div className="shrink-0 flex items-center justify-end gap-1 px-2" style={{ height: 34, borderBottom: `1px solid ${LC.borderSubtle}` }}>
              <button onClick={() => setMode('collapsed')} title="Fold chat away" className="hover:bg-black/5" style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 7, border: 'none', background: 'transparent', color: LC.muted, cursor: 'pointer' }}>
                <PanelRightClose size={16} />
              </button>
              <button onClick={() => setMode(mode === 'expanded' ? 'split' : 'expanded')} title={mode === 'expanded' ? 'Back to split' : 'Expand chat'} className="hover:bg-black/5" style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 7, border: 'none', background: 'transparent', color: LC.muted, cursor: 'pointer' }}>
                {mode === 'expanded' ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>
            </div>
          )}
          <div className="flex-1 min-h-0">
            <AssistantThread assistant={a} variant="focus" />
          </div>
        </div>

        {/* Reopen the folded chat */}
        {hasPages && mode === 'collapsed' && (
          <button
            onClick={() => setMode('split')}
            title="Open chat"
            style={{ position: 'absolute', right: 14, bottom: 18, zIndex: 30, display: 'flex', alignItems: 'center', gap: 7, height: 38, padding: '0 14px', borderRadius: 999, background: LC.surface, border: 'none', color: LC.text, cursor: 'pointer', fontSize: 13, fontWeight: 600, boxShadow: LC.shadowOut }}
            className="hover:brightness-[0.98]"
          >
            <MessageSquare size={15} /> Chat
          </button>
        )}
      </div>
    </div>
  );
}
