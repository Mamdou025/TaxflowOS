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

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { X, Plus, GitFork, Bot, LayoutDashboard, FileSpreadsheet, FileText, Layers, BarChart3, Workflow, PanelRightClose, Maximize2, Minimize2, MessageSquare, Files } from 'lucide-react';
import { chatPageContextAtom, chatPanelModeAtom } from '@/lib/chat-store';
import {
  workspaceWindowsAtom,
  activeWindowIdAtom,
  openWorkspaceWindowAtom,
  closeWorkspaceWindowAtom,
  focusWorkspaceWindowAtom,
} from '@/lib/workspace-store';
import { getPage } from '@/lib/resource-registry';
import { WORKFLOWS, getAgent } from '@/lib/agents';
import { useAssistant } from '@/components/assistant/use-assistant';
import { AssistantThread } from '@/components/assistant/assistant-thread';
import { InlineBuilder } from '@/components/workflow/inline-builder';
import { AgentBuilder } from '@/components/assistant/agent-builder';
import { LC } from '@/lib/librechat-theme';
import { pageMenusAtom } from '@/lib/page-menu-store';
import { PageMenuBar } from '@/components/workspace/page-menu-bar';
import { InlinePageProvider } from '@/lib/inline-page-context';

const WORKSPACE_ITEMS: { key: string; title: string; Icon: typeof GitFork }[] = [
  { key: 'workflow-builder', title: 'Workflow Builder', Icon: GitFork },
  { key: 'agent-builder', title: 'Agent Builder', Icon: Bot },
  { key: 'dashboard', title: 'Dashboard', Icon: LayoutDashboard },
  { key: 'viewer', title: 'Documents', Icon: Files },
];
const WORKSHEET_ITEMS: { key: string; title: string; Icon: typeof GitFork }[] = [
  { key: 'fapi', title: 'FAPI worksheet', Icon: FileSpreadsheet },
  { key: 't1134', title: 'T1134', Icon: FileText },
  { key: 'surplus', title: 'Surplus', Icon: Layers },
  { key: 'bu-overview', title: 'Executive Overview', Icon: BarChart3 },
];

function titleFor(key: string): string {
  const local = [...WORKSPACE_ITEMS, ...WORKSHEET_ITEMS].find((i) => i.key === key);
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

// ── Dark sidebar bits ──────────────────────────────────────────────────────────
function SideLabel({ children }: { children: ReactNode }) {
  return <div style={{ padding: '14px 12px 4px', fontSize: 10.5, fontWeight: 650, letterSpacing: '0.06em', textTransform: 'uppercase', color: LC.faint }}>{children}</div>;
}
function SideRow({ icon, label, sub, dim, onClick }: { icon: ReactNode; label: string; sub?: string; dim?: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="lc-siderow"
      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', textAlign: 'left', padding: '8px 12px', borderRadius: 8, border: 'none', background: 'transparent', color: dim ? LC.faint : LC.body, cursor: 'pointer', opacity: dim ? 0.7 : 1 }}
    >
      <span style={{ color: LC.muted, display: 'flex', flexShrink: 0 }}>{icon}</span>
      <span style={{ minWidth: 0, flex: 1 }}>
        <span style={{ display: 'block', fontSize: 13.5, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
        {sub && <span style={{ display: 'block', fontSize: 11, color: LC.faint }}>{sub}</span>}
      </span>
    </button>
  );
}

export function ChatWorkspace() {
  const context = useAtomValue(chatPageContextAtom);
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
  const hasPages = windows.length > 0;
  const active = windows.find((w) => w.id === activeId) ?? windows[windows.length - 1] ?? null;
  const activeMenu = active ? pageMenus[active.pageKey] : undefined;

  // Reset the split when the last page closes.
  useEffect(() => {
    if (!hasPages && mode !== 'split') setMode('split');
  }, [hasPages, mode, setMode]);

  const showPage = hasPages && mode !== 'expanded';
  const showChat = !hasPages || mode !== 'collapsed';

  useEffect(() => {
    if (hasPages && !windows.some((w) => w.id === activeId)) setActiveId(windows[windows.length - 1].id);
  }, [windows, activeId, hasPages, setActiveId]);

  const open = (key: string) => openWindow({ pageKey: key, title: titleFor(key) });

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
    <div className="h-full flex" style={{ background: LC.bg }}>
      <style>{`
        @keyframes cwp-anchor-flash { 0% { background: rgba(255,255,255,0.10);} 100% { background: transparent;} }
        .cwp-anchor-flash { animation: cwp-anchor-flash 1.7s ease-out; border-radius: 8px; }
        .lc-siderow:hover { background: ${LC.surface} !important; color: ${LC.text} !important; }
        .lc-tab { position: relative; }
        .lc-tab[data-active="true"]::after { content:''; position:absolute; left:10px; right:10px; bottom:-1px; height:2px; background:${LC.text}; border-radius:2px; }
      `}</style>

      {/* ── Left nav sidebar ── */}
      <div style={{ width: 260, flexShrink: 0, background: LC.sidebar, borderRight: `1px solid ${LC.borderSubtle}`, display: 'flex', flexDirection: 'column', padding: '10px 8px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 8px 10px' }}>
          <span style={{ width: 22, height: 22, borderRadius: '50%', background: 'radial-gradient(circle at 35% 30%, #a78bfa, #6B21A8 70%)', flexShrink: 0 }} />
          <span style={{ fontSize: 14, fontWeight: 650, color: LC.text }}>Scope</span>
          <span style={{ fontSize: 11, color: LC.faint, marginLeft: 'auto' }}>{context.label}</span>
        </div>
        <button
          onClick={() => a.newChat()}
          className="hover:brightness-110"
          style={{ display: 'flex', alignItems: 'center', gap: 8, width: '100%', padding: '9px 12px', borderRadius: 10, border: `1px solid ${LC.border}`, background: 'transparent', color: LC.text, cursor: 'pointer', fontSize: 13.5, fontWeight: 550 }}
        >
          <Plus size={15} /> New chat
        </button>

        <SideLabel>Workspace</SideLabel>
        {WORKSPACE_ITEMS.map((it) => <SideRow key={it.key} icon={<it.Icon size={15} />} label={it.title} onClick={() => open(it.key)} />)}
        <SideLabel>Worksheets</SideLabel>
        {WORKSHEET_ITEMS.map((it) => <SideRow key={it.key} icon={<it.Icon size={15} />} label={it.title} onClick={() => open(it.key)} />)}
        <SideLabel>Run</SideLabel>
        {WORKFLOWS.map((w) => (
          <SideRow
            key={w.id} icon={<Workflow size={15} />} label={w.name}
            sub={`${(w.agentId ? getAgent(w.agentId)?.name : w.sub) ?? w.sub}${!w.ready ? ' · soon' : ''}`}
            dim={!w.ready} onClick={() => a.launchStartWorkflow(w.id)}
          />
        ))}
      </div>

      {/* ── Inline page panel (left) + chat (right) ── */}
      <div className="flex-1 min-w-0 flex relative">
        {hasPages && (
          <div className="min-w-0 flex flex-col" style={{ flex: showPage ? '1 1 auto' : '0 0 0px', overflow: 'hidden', background: LC.panel }}>
            <div className="shrink-0 flex items-center px-3" style={{ height: 40, borderBottom: `1px solid ${LC.borderSubtle}` }}>
              <div className="flex items-center gap-1" style={{ overflowX: 'auto', scrollbarWidth: 'none', flex: '1 1 auto', minWidth: 0 }}>
                {windows.map((w) => {
                  const isActive = active?.id === w.id;
                  return (
                    <button key={w.id} className="lc-tab flex items-center gap-1.5 shrink-0" data-active={isActive} onClick={() => focusWindow(w.id)} style={{ padding: '9px 10px', fontSize: 12.5, fontWeight: 500, color: isActive ? LC.text : LC.muted, background: 'none', border: 'none', cursor: 'pointer' }}>
                      <span className="max-w-40 truncate">{w.title}</span>
                      <span onClick={(e) => { e.stopPropagation(); closeWindow(w.id); }} className="flex items-center justify-center rounded hover:bg-white/10" style={{ width: 16, height: 16 }}><X size={11} style={{ color: LC.muted }} /></span>
                    </button>
                  );
                })}
              </div>
              {/* Active page's contextual menu — published via usePageMenu(). */}
              {activeMenu && <PageMenuBar menu={activeMenu} />}
            </div>
            <div ref={pageBodyRef} className="flex-1 min-h-0 relative" style={{ background: '#fff' }}>
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
          className="min-w-0 flex flex-col"
          style={{
            flex: !hasPages || mode === 'expanded' ? '1 1 auto' : mode === 'collapsed' ? '0 0 0px' : '0 0 clamp(360px, 38%, 520px)',
            overflow: 'hidden',
            borderLeft: hasPages && showPage ? `1px solid ${LC.borderSubtle}` : 'none',
          }}
        >
          {hasPages && showChat && (
            <div className="shrink-0 flex items-center justify-end gap-1 px-2" style={{ height: 34, borderBottom: `1px solid ${LC.borderSubtle}` }}>
              <button onClick={() => setMode('collapsed')} title="Fold chat away" className="hover:bg-white/10" style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 7, border: 'none', background: 'transparent', color: LC.muted, cursor: 'pointer' }}>
                <PanelRightClose size={16} />
              </button>
              <button onClick={() => setMode(mode === 'expanded' ? 'split' : 'expanded')} title={mode === 'expanded' ? 'Back to split' : 'Expand chat'} className="hover:bg-white/10" style={{ display: 'grid', placeItems: 'center', width: 28, height: 28, borderRadius: 7, border: 'none', background: 'transparent', color: LC.muted, cursor: 'pointer' }}>
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
            style={{ position: 'absolute', right: 14, bottom: 18, zIndex: 30, display: 'flex', alignItems: 'center', gap: 7, height: 38, padding: '0 14px', borderRadius: 999, background: LC.surface, border: `1px solid ${LC.border}`, color: LC.text, cursor: 'pointer', fontSize: 13, fontWeight: 550, boxShadow: '0 8px 24px rgba(0,0,0,0.45)' }}
            className="hover:brightness-110"
          >
            <MessageSquare size={15} /> Chat
          </button>
        )}
      </div>
    </div>
  );
}
