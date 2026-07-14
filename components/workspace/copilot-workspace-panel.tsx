'use client';

import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { X, MessageSquare, Search, Workflow, Bot, Globe, FileText, GitBranch } from 'lucide-react';
import { CopilotChat } from '@copilotkit/react-ui';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import '@copilotkit/react-ui/styles.css';
import { NAV_HEIGHT } from '@/components/global-top-nav';
import { chatWorkspaceOpenAtom, chatPageContextAtom } from '@/lib/chat-store';
import {
  workspaceWindowsAtom,
  openWorkspaceWindowAtom,
  closeWorkspaceWindowAtom,
  closeAllWorkspaceWindowsAtom,
  pushTrailAtom,
  activeRunAtom,
} from '@/lib/workspace-store';
import { builderFocusTargetAtom } from '@/lib/workflow-store';
import {
  getPage,
  listPages,
  anchorToPage,
  getFieldContext,
  buildAgentCatalog,
} from '@/lib/resource-registry';
import { InlineFieldCard } from '@/components/workspace/inline-field-card';
import { WorkflowRunFlow, WorkflowElementCard } from '@/components/workspace/workflow-run-flow';
import { getWorkflowConfig, WORKFLOW_CONFIGS, type TemplateConfig } from '@/lib/workflow-runs';
import { AGENTS, WORKFLOWS, getAgent, type Agent } from '@/lib/agents';

// ── Attio/Aside-style monochrome theme for the CopilotKit chat ─────────────────
// One near-black accent, warm-neutral surfaces, hairline separators — no
// saturated purple/orange. Applied via CopilotKit's CSS custom properties.
const CHAT_THEME: CSSProperties = {
  ['--copilot-kit-primary-color' as string]: '#18181b',
  ['--copilot-kit-contrast-color' as string]: '#ffffff',
  ['--copilot-kit-background-color' as string]: '#ffffff',
  ['--copilot-kit-secondary-color' as string]: '#f4f4f5',
  ['--copilot-kit-secondary-contrast-color' as string]: '#18181b',
  ['--copilot-kit-separator-color' as string]: 'rgba(24,24,27,0.08)',
  ['--copilot-kit-muted-color' as string]: '#a1a1aa',
  ['--copilot-kit-input-background-color' as string]: '#ffffff',
  height: '100%',
};

const INSTRUCTIONS = () => {
  const c = buildAgentCatalog();
  const pages = c.pages.map((p) => `- ${p.key}: ${p.title} — ${p.subtitle}`).join('\n');
  const fields = c.fields.map((f) => `- ${f.fieldId} (${f.pageKey}): ${f.label}`).join('\n');
  return `You are the assistant inside InScope, a fiscalist's workspace. You help by talking AND by acting through tools.

Style: ALWAYS reply with a short, natural sentence FIRST — acknowledge the request and say what you're about to do — then call the tool(s). Never act silently. Keep replies concise and professional.

CRITICAL tool routing:
- To RUN / START / EXECUTE a workflow → ALWAYS call **runWorkflow** with the workflowId: "fapi" for "compute/run FAPI", "roulement" for "run the rollover / roulement art. 85 / section 85". This shows a live, step-by-step run inside the chat and pauses for the user (upload a document, categorize a row, elect an amount, approve). NEVER open a worksheet to "run" a workflow — the worksheet is only the static end result.
- To open/show a worksheet for viewing → openPage.
- To highlight a specific figure/section on a page → focusAnchor.
- When the user asks to SEE or EDIT a value (e.g. "show me the FX rate", "let me change the FX rate") → call **editField**. This brings the editable field directly INTO the chat; do NOT open the worksheet for this.

Registered pages:
${pages}

Editable fields:
${fields}

Only ever reference page keys, anchors, and field ids that exist above.`;
};

// ── Registers the workspace tools + readable context with CopilotKit ───────────
function useWorkspaceCopilot() {
  const windows = useAtomValue(workspaceWindowsAtom);
  const openWindow = useSetAtom(openWorkspaceWindowAtom);
  const closeWindow = useSetAtom(closeWorkspaceWindowAtom);
  const closeAll = useSetAtom(closeAllWorkspaceWindowsAtom);
  const pushTrail = useSetAtom(pushTrailAtom);
  const router = useRouter();
  const setOpen = useSetAtom(chatWorkspaceOpenAtom);
  const setBuilderFocus = useSetAtom(builderFocusTargetAtom);
  const activeRun = useAtomValue(activeRunAtom);

  // Let the model see what's currently open.
  useCopilotReadable({
    description: 'Pages currently open in the workspace',
    value: windows.map((w) => ({ pageKey: w.pageKey, title: w.title })),
  });

  // Let the model see the workflow run in progress — which workflow, which
  // document, which step, and what it's waiting for — so it can tell the user.
  useCopilotReadable({
    description: 'The workflow run currently in the chat (null if none). Use this to tell the user where we are, which document is in use, and what the run is waiting for.',
    value: activeRun
      ? { workflow: activeRun.workflowName, document: activeRun.documentLabel, step: `${activeRun.stepIndex + 1}/${activeRun.totalSteps} — ${activeRun.stepLabel}`, phase: activeRun.phase, awaiting: activeRun.awaiting, result: activeRun.headline }
      : 'No workflow is currently running.',
  });

  const pageEnum = listPages().map((p) => p.key).join(', ');
  const workflowEnum = Object.keys(WORKFLOW_CONFIGS).join(', ');

  useCopilotAction({
    name: 'openPage',
    description: `Open a registered worksheet as a tab. Valid pageKey: ${pageEnum}.`,
    parameters: [{ name: 'pageKey', type: 'string', description: 'one of: ' + pageEnum, required: true }],
    handler: async ({ pageKey }: { pageKey: string }) => {
      const def = getPage(pageKey);
      if (!def) return `No page "${pageKey}".`;
      openWindow({ pageKey, title: def.title });
      pushTrail({ text: `Opened ${def.title}`, tone: 'navigation' });
      return `Opened ${def.title}.`;
    },
  });

  useCopilotAction({
    name: 'focusAnchor',
    description: 'Open a page and scroll to + highlight one specific part of it (an anchor id like "fapi:fx").',
    parameters: [{ name: 'anchor', type: 'string', description: 'the anchor id', required: true }],
    handler: async ({ anchor }: { anchor: string }) => {
      const pk = anchorToPage(anchor);
      if (!pk) return `No anchor "${anchor}".`;
      const def = getPage(pk);
      openWindow({ pageKey: pk, title: def?.title ?? pk });
      window.dispatchEvent(new CustomEvent('cwp-focus-anchor', { detail: { pageKey: pk, anchor } }));
      pushTrail({ text: `Focused ${def?.title ?? pk}`, tone: 'navigation' });
      return `Highlighted ${anchor} on ${def?.title ?? pk}.`;
    },
  });

  useCopilotAction({
    name: 'editField',
    description: 'Bring an editable worksheet field INTO the chat so the user can view/modify it inline (it syncs to the worksheet). Use for "show me the FX rate", "let me change the dividend", etc. Do NOT open the worksheet. fieldId e.g. "fx".',
    parameters: [
      { name: 'fieldId', type: 'string', description: 'the field id', required: true },
      { name: 'value', type: 'string', description: 'optional value to pre-fill', required: false },
    ],
    handler: async ({ fieldId }: { fieldId: string; value?: string }) => {
      const ctx = getFieldContext(fieldId);
      if (!ctx) return `No field "${fieldId}".`;
      pushTrail({ text: `Brought ${ctx.label} inline`, tone: 'info' });
      return `Here is ${ctx.label} — editable right here.`;
    },
    render: ({ args }: { args: { fieldId?: string; value?: string } }) =>
      args?.fieldId ? <InlineFieldCard fieldId={args.fieldId} preset={args.value} /> : <></>,
  });

  useCopilotAction({
    name: 'closePage',
    description: 'Close an open page by pageKey (or the last one if omitted).',
    parameters: [{ name: 'pageKey', type: 'string', description: 'page to close', required: false }],
    handler: async ({ pageKey }: { pageKey?: string }) => {
      const target = pageKey ? windows.find((w) => w.pageKey === pageKey) : windows[windows.length - 1];
      if (!target) return 'Nothing open to close.';
      closeWindow(target.id);
      return `Closed ${target.title}.`;
    },
  });

  useCopilotAction({
    name: 'closeAll',
    description: 'Close every open page.',
    parameters: [],
    handler: async () => { closeAll(); return 'Closed all pages.'; },
  });

  useCopilotAction({
    name: 'openWorkflowBuilder',
    description: 'Navigate to the visual workflow builder canvas.',
    parameters: [],
    handler: async () => { setOpen(false); router.push('/builder'); return 'Opening the workflow builder.'; },
  });

  useCopilotAction({
    name: 'runWorkflow',
    description: 'RUN/START/EXECUTE a fiscal workflow. Shows a live step-by-step run in the chat and pauses for the user (upload a document, categorize a row, elect an amount, approve). Use for "run/compute FAPI" (workflowId "fapi") or "run the rollover / roulement art. 85" (workflowId "roulement"). Never openPage for a run.',
    parameters: [{ name: 'workflowId', type: 'string', description: 'which workflow: "fapi" or "roulement"', required: true }],
    renderAndWaitForResponse: ({ args, status, respond }: { args: { workflowId?: string }; status: string; respond?: (result: string) => void }) => {
      const config = getWorkflowConfig(args?.workflowId ?? 'fapi');
      if (!config) return <div style={{ fontSize: 12.5, color: '#71717a' }}>Unknown workflow “{args?.workflowId}”.</div>;
      const agent = config.agentId ? getAgent(config.agentId) ?? undefined : undefined;
      return (
        <WorkflowRunFlow
          config={config}
          agent={agent}
          onOpenPage={(pk) => { const def = getPage(pk); if (def) openWindow({ pageKey: pk, title: def.title }); }}
          onOpenBuilder={(blockId) => { setBuilderFocus({ workflowId: config.id, blockId }); setOpen(false); router.push('/builder'); }}
          onStop={() => { if (status === 'executing') respond?.('The user stopped the run.'); }}
          onComplete={(summary) => { if (status === 'executing') respond?.(summary); }}
        />
      );
    },
  });

  useCopilotAction({
    name: 'showWorkflowElement',
    description: `Summon a specific element of a workflow INTO the chat without opening the builder — its source document or its output. Use for "show me the source / the trial balance / the biens", "show me the output / the result / the T2057". workflowId: ${workflowEnum}. element: "source" or "output".`,
    parameters: [
      { name: 'workflowId', type: 'string', description: workflowEnum, required: true },
      { name: 'element', type: 'string', description: '"source" or "output"', required: true },
    ],
    handler: async ({ workflowId, element }: { workflowId: string; element: string }) => {
      const c = getWorkflowConfig(workflowId);
      return c ? `Here is the ${element} of ${c.name}.` : `Unknown workflow “${workflowId}”.`;
    },
    render: ({ args }: { args: { workflowId?: string; element?: string } }) => {
      const c = getWorkflowConfig(args?.workflowId ?? '');
      if (!c) return <></>;
      return <WorkflowElementCard config={c} element={args?.element === 'output' ? 'output' : 'source'} onOpenPage={(pk) => { const d = getPage(pk); if (d) openWindow({ pageKey: pk, title: d.title }); }} onOpenBuilder={(blockId) => { setBuilderFocus({ workflowId: c.id, blockId }); setOpen(false); router.push('/builder'); }} />;
    },
  });
}

// ── Launcher: search + workflow/agent suggestions ──────────────────────────────
const INK = '#18181b', MUTED = '#71717a', FAINT = '#a1a1aa', LINE = 'rgba(24,24,27,0.08)';

type SearchHit =
  | { kind: 'page'; id: string; label: string; sub: string }
  | { kind: 'field'; id: string; label: string; sub: string }
  | { kind: 'workflow'; id: string; label: string; sub: string; ready: boolean }
  | { kind: 'agent'; id: string; label: string; sub: string; live: boolean }
  | { kind: 'element'; id: string; label: string; sub: string; workflowId: string; element: 'source' | 'output' };

function searchWorkspace(q: string): SearchHit[] {
  const t = q.toLowerCase().trim();
  if (!t) return [];
  const cat = buildAgentCatalog();
  const hits: SearchHit[] = [];
  for (const w of WORKFLOWS) if (`${w.name} ${w.sub}`.toLowerCase().includes(t)) hits.push({ kind: 'workflow', id: w.id, label: w.name, sub: w.sub, ready: w.ready });
  for (const a of AGENTS) if (`${a.name} ${a.role}`.toLowerCase().includes(t)) hits.push({ kind: 'agent', id: a.id, label: a.name, sub: a.role, live: a.live });
  // Workflow elements — summon a source/output into the chat without the builder.
  for (const c of Object.values(WORKFLOW_CONFIGS)) {
    if (`${c.name} source document ${c.documentLabel}`.toLowerCase().includes(t)) hits.push({ kind: 'element', id: `${c.id}:source`, label: `${c.name} — source`, sub: c.documentLabel, workflowId: c.id, element: 'source' });
    if (`${c.name} output result`.toLowerCase().includes(t)) hits.push({ kind: 'element', id: `${c.id}:output`, label: `${c.name} — output`, sub: 'Computed result', workflowId: c.id, element: 'output' });
  }
  for (const p of cat.pages) if (`${p.title} ${p.subtitle} ${p.key}`.toLowerCase().includes(t)) hits.push({ kind: 'page', id: p.key, label: p.title, sub: p.subtitle });
  for (const f of cat.fields) if (`${f.label} ${f.fieldId}`.toLowerCase().includes(t)) hits.push({ kind: 'field', id: f.fieldId, label: f.label, sub: 'Editable field' });
  return hits.slice(0, 9);
}

const HIT_ICON = { page: Globe, field: FileText, workflow: Workflow, agent: Bot, element: GitBranch } as const;

function ChatLauncher({ onOpenPage, onPinField, onStartAgent, onStartWorkflow, onPinElement }: {
  onOpenPage: (k: string) => void; onPinField: (id: string) => void; onStartAgent: (id: string) => void; onStartWorkflow: (id: string) => void; onPinElement: (workflowId: string, element: 'source' | 'output') => void;
}) {
  const [q, setQ] = useState('');
  const hits = searchWorkspace(q);
  const act = (h: SearchHit) => {
    setQ('');
    if (h.kind === 'page') onOpenPage(h.id);
    else if (h.kind === 'field') onPinField(h.id);
    else if (h.kind === 'workflow') onStartWorkflow(h.id);
    else if (h.kind === 'element') onPinElement(h.workflowId, h.element);
    else onStartAgent(h.id);
  };
  return (
    <div className="shrink-0" style={{ padding: '12px 14px 10px', borderBottom: `1px solid ${LINE}`, position: 'relative' }}>
      {/* Search */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 11px', border: `1px solid ${LINE}`, borderRadius: 10, background: '#fafafa' }}>
        <Search size={14} style={{ color: FAINT }} />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search worksheets, fields, workflows, agents…" className="flex-1 outline-none bg-transparent" style={{ fontSize: 13, color: INK }} />
      </div>
      {hits.length > 0 && (
        <div style={{ position: 'absolute', left: 14, right: 14, top: 52, zIndex: 5, background: '#fff', border: `1px solid ${LINE}`, borderRadius: 10, boxShadow: '0 12px 30px rgba(9,9,11,0.14)', overflow: 'hidden' }}>
          {hits.map((h) => {
            const Icon = HIT_ICON[h.kind];
            const dim = (h.kind === 'workflow' && !h.ready) || (h.kind === 'agent' && !h.live);
            return (
              <button key={`${h.kind}:${h.id}`} onClick={() => act(h)} className="w-full flex items-center gap-2.5 text-left hover:bg-black/5" style={{ padding: '9px 12px', border: 'none', background: 'none', cursor: 'pointer', opacity: dim ? 0.55 : 1 }}>
                <Icon size={14} style={{ color: MUTED, flexShrink: 0 }} />
                <span className="flex-1 min-w-0">
                  <span style={{ display: 'block', fontSize: 12.5, fontWeight: 550, color: INK }}>{h.label}{dim && <span style={{ color: FAINT, fontWeight: 400 }}> · soon</span>}</span>
                  <span style={{ display: 'block', fontSize: 11, color: FAINT }}>{h.sub}</span>
                </span>
                <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: FAINT }}>{h.kind}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Suggestions — only when not searching */}
      {!q && (
        <div style={{ marginTop: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 650, letterSpacing: '0.05em', textTransform: 'uppercase', color: FAINT, marginBottom: 7 }}>Workflows</div>
          <div className="flex flex-wrap gap-2" style={{ marginBottom: 12 }}>
            {WORKFLOWS.map((w) => (
              <button key={w.id} onClick={() => onStartWorkflow(w.id)} disabled={!w.ready} className="flex items-center gap-2 text-left" style={{ padding: '8px 11px', borderRadius: 10, border: `1px solid ${LINE}`, background: w.ready ? '#fff' : '#fafafa', cursor: w.ready ? 'pointer' : 'default', opacity: w.ready ? 1 : 0.6 }}>
                <Workflow size={13} style={{ color: w.ready ? INK : FAINT }} />
                <span className="min-w-0">
                  <span style={{ display: 'block', fontSize: 12.5, fontWeight: 550, color: INK }}>{w.name}{!w.ready && <span style={{ color: FAINT, fontWeight: 400 }}> · soon</span>}</span>
                  <span style={{ display: 'block', fontSize: 10.5, color: FAINT }}>{w.agentId ? `${getAgent(w.agentId)?.name} · ${w.sub}` : w.sub}</span>
                </span>
              </button>
            ))}
          </div>
          <div style={{ fontSize: 10, fontWeight: 650, letterSpacing: '0.05em', textTransform: 'uppercase', color: FAINT, marginBottom: 7 }}>Agents</div>
          <div className="flex flex-wrap gap-2">
            {AGENTS.map((a) => (
              <button key={a.id} onClick={() => onStartAgent(a.id)} disabled={!a.live} className="flex items-center gap-2 text-left" style={{ padding: '7px 10px', borderRadius: 999, border: `1px solid ${LINE}`, background: a.live ? '#fff' : '#fafafa', cursor: a.live ? 'pointer' : 'default', opacity: a.live ? 1 : 0.6 }}>
                <span style={{ width: 20, height: 20, borderRadius: 6, background: a.accent, color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 9.5, fontWeight: 650 }}>{a.initials}</span>
                <span style={{ fontSize: 12, fontWeight: 550, color: INK }}>{a.name}</span>
                <span style={{ fontSize: 11, color: FAINT }}>{a.role}{!a.live && ' · soon'}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── The panel ──────────────────────────────────────────────────────────────────
export function CopilotWorkspacePanel() {
  const [open, setOpen] = useAtom(chatWorkspaceOpenAtom);
  const context = useAtomValue(chatPageContextAtom);
  const windows = useAtomValue(workspaceWindowsAtom);
  const closeWindow = useSetAtom(closeWorkspaceWindowAtom);
  const setBuilderFocus = useSetAtom(builderFocusTargetAtom);
  const router = useRouter();
  const [tab, setTab] = useState<string>('chat');
  const [focus, setFocus] = useState<{ pageKey: string; anchor: string; nonce: number } | null>(null);
  const [takeover, setTakeover] = useState<{ agent: Agent | null; config: TemplateConfig } | null>(null); // a workflow running in the chat
  const [pinnedFields, setPinnedFields] = useState<string[]>([]); // fields brought in via search
  const [pinnedElements, setPinnedElements] = useState<{ workflowId: string; element: 'source' | 'output' }[]>([]); // workflow source/output summoned in
  const pageBodyRef = useRef<HTMLDivElement>(null);

  const openWindow = useSetAtom(openWorkspaceWindowAtom);
  useWorkspaceCopilot();

  // Launcher handlers (direct actions — no LLM round-trip).
  const launchOpenPage = (pageKey: string) => {
    const def = getPage(pageKey);
    if (def) openWindow({ pageKey, title: def.title });
  };
  const launchPinField = (fieldId: string) => setPinnedFields((prev) => (prev.includes(fieldId) ? prev : [...prev, fieldId]));
  const launchPinElement = (workflowId: string, element: 'source' | 'output') => setPinnedElements((prev) => (prev.some((e) => e.workflowId === workflowId && e.element === element) ? prev : [...prev, { workflowId, element }]));
  const launchStartWorkflow = (workflowId: string) => {
    const config = getWorkflowConfig(workflowId);
    if (!config) return;
    setTab('chat');
    setTakeover({ agent: config.agentId ? getAgent(config.agentId) : null, config });
  };
  const launchStartAgent = (agentId: string) => { const a = getAgent(agentId); if (a?.live && a.workflow) launchStartWorkflow(a.workflow); };

  // A tool opened a page → switch to its tab.
  useEffect(() => {
    if (windows.length) setTab(windows[windows.length - 1].id);
  }, [windows.length]);

  useEffect(() => {
    if (tab !== 'chat' && !windows.some((w) => w.id === tab)) setTab('chat');
  }, [windows, tab]);

  // Focus-anchor requests come from the copilot actions via a window event.
  useEffect(() => {
    const onFocus = (e: Event) => {
      const d = (e as CustomEvent).detail as { pageKey: string; anchor: string };
      setFocus({ ...d, nonce: Date.now() });
      const win = windows.find((w) => w.pageKey === d.pageKey);
      if (win) setTab(win.id);
    };
    window.addEventListener('cwp-focus-anchor', onFocus);
    return () => window.removeEventListener('cwp-focus-anchor', onFocus);
  }, [windows]);

  // Scroll to + flash the addressed row once the (lazy) page has mounted.
  useEffect(() => {
    if (!focus || tab === 'chat') return;
    const win = windows.find((w) => w.id === tab);
    if (!win || win.pageKey !== focus.pageKey) return;
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
  }, [focus, tab, windows]);

  const activeWindow = windows.find((w) => w.id === tab) ?? null;
  const ActivePage = activeWindow ? getPage(activeWindow.pageKey)?.Component ?? null : null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="ck-backdrop"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}
          className="fixed inset-0"
          style={{ zIndex: 44, paddingTop: NAV_HEIGHT + 16, paddingBottom: 92, paddingLeft: 24, paddingRight: 24, background: 'rgba(9,9,11,0.28)', backdropFilter: 'blur(3px)' }}
        >
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.995 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 14, scale: 0.995 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
            className="mx-auto h-full flex flex-col overflow-hidden"
            style={{ maxWidth: 1120, background: '#ffffff', borderRadius: 16, border: '1px solid rgba(24,24,27,0.08)', boxShadow: '0 24px 60px rgba(9,9,11,0.22)' }}
          >
            <style>{`
              @keyframes cwp-anchor-flash { 0% { background: rgba(24,24,27,0.10); box-shadow: inset 0 0 0 2px rgba(24,24,27,0.35);} 100% { background: transparent; box-shadow: inset 0 0 0 2px transparent;} }
              .cwp-anchor-flash { animation: cwp-anchor-flash 1.7s ease-out; border-radius: 8px; }
              .cwp-tab { position: relative; }
              .cwp-tab[data-active="true"]::after { content:''; position:absolute; left:10px; right:10px; bottom:-1px; height:2px; background:#18181b; border-radius:2px; }
            `}</style>

            {/* Header */}
            <div className="shrink-0 flex items-center gap-3 px-5" style={{ height: 48, borderBottom: '1px solid rgba(24,24,27,0.07)' }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#18181b' }} />
              <div className="min-w-0">
                <div style={{ fontSize: 13, fontWeight: 600, color: '#18181b', letterSpacing: '-0.01em', lineHeight: 1.2 }}>Assistant</div>
                <div style={{ fontSize: 11, color: '#a1a1aa', lineHeight: 1.2 }}>{context.label}</div>
              </div>
              <div className="flex-1" />
              <button onClick={() => setOpen(false)} className="flex items-center justify-center rounded-md hover:bg-black/5" style={{ width: 28, height: 28, color: '#71717a' }} title="Close">
                <X size={16} />
              </button>
            </div>

            {/* Tab strip — only when pages are open */}
            {windows.length > 0 && (
              <div className="shrink-0 flex items-center gap-1 px-3 overflow-x-auto" style={{ height: 40, borderBottom: '1px solid rgba(24,24,27,0.07)', scrollbarWidth: 'none' }}>
                <button className="cwp-tab flex items-center gap-1.5 shrink-0" data-active={tab === 'chat'} onClick={() => setTab('chat')} style={{ padding: '9px 10px', fontSize: 12.5, fontWeight: 500, color: tab === 'chat' ? '#18181b' : '#71717a', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <MessageSquare size={13} /> Chat
                </button>
                {windows.map((w) => {
                  const def = getPage(w.pageKey);
                  const Icon = def?.icon;
                  const active = tab === w.id;
                  return (
                    <button key={w.id} className="cwp-tab flex items-center gap-1.5 shrink-0" data-active={active} onClick={() => setTab(w.id)} style={{ padding: '9px 10px', fontSize: 12.5, fontWeight: 500, color: active ? '#18181b' : '#71717a', background: 'none', border: 'none', cursor: 'pointer' }}>
                      {Icon && <Icon size={13} />}
                      <span className="max-w-[150px] truncate">{def?.title ?? w.pageKey}</span>
                      <span onClick={(e) => { e.stopPropagation(); closeWindow(w.id); if (tab === w.id) setTab('chat'); }} className="flex items-center justify-center rounded hover:bg-black/10" style={{ width: 16, height: 16 }}><X size={11} style={{ color: '#a1a1aa' }} /></span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Body */}
            <div className="flex-1 min-h-0">
              {tab === 'chat' ? (
                <div className="h-full flex flex-col" style={CHAT_THEME}>
                  <ChatLauncher onOpenPage={launchOpenPage} onPinField={launchPinField} onStartAgent={launchStartAgent} onStartWorkflow={launchStartWorkflow} onPinElement={launchPinElement} />
                  {/* Chat is ALWAYS available. When a workflow is running it takes the
                      primary space and the chat stays as a compact bar below. */}
                  <div className="flex-1 min-h-0 flex flex-col">
                    {takeover ? (
                      <>
                        <div className="flex-1 min-h-0 overflow-auto" style={{ padding: '14px 16px' }}>
                          <div style={{ fontSize: 11.5, color: '#71717a', marginBottom: 10 }}>
                            {takeover.agent ? <><b style={{ color: '#18181b' }}>{takeover.agent.name}</b> is handling {takeover.config.name}</> : <>Running {takeover.config.name}</>} — keep chatting below, or Stop it.
                          </div>
                          <WorkflowRunFlow
                            config={takeover.config}
                            agent={takeover.agent ?? undefined}
                            onOpenPage={(pk) => launchOpenPage(pk)}
                            onOpenBuilder={(blockId) => { setBuilderFocus({ workflowId: takeover.config.id, blockId }); setOpen(false); router.push('/builder'); }}
                            onStop={() => setTakeover(null)}
                            onComplete={() => {}}
                          />
                        </div>
                        <div className="shrink-0" style={{ height: 200, borderTop: '1px solid rgba(24,24,27,0.08)' }}>
                          <CopilotChat className="h-full" instructions={INSTRUCTIONS()} labels={{ title: 'Assistant', initial: 'Ask me anything while the workflow runs.', placeholder: 'Ask, or tell me what to do…' }} />
                        </div>
                      </>
                    ) : (
                      <>
                        {(pinnedFields.length > 0 || pinnedElements.length > 0) && (
                          <div className="shrink-0 overflow-auto" style={{ maxHeight: '52%', padding: '12px 14px 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
                            {pinnedElements.map((el) => {
                              const cfg = getWorkflowConfig(el.workflowId);
                              if (!cfg) return null;
                              return (
                                <div key={`${el.workflowId}:${el.element}`} className="flex items-start gap-2">
                                  <div className="flex-1"><WorkflowElementCard config={cfg} element={el.element} onOpenPage={(pk) => launchOpenPage(pk)} onOpenBuilder={(blockId) => { setBuilderFocus({ workflowId: cfg.id, blockId }); setOpen(false); router.push('/builder'); }} /></div>
                                  <button onClick={() => setPinnedElements((p) => p.filter((x) => !(x.workflowId === el.workflowId && x.element === el.element)))} className="rounded hover:bg-black/5" style={{ width: 22, height: 22, color: '#a1a1aa', border: 'none', background: 'none', cursor: 'pointer', marginTop: 4 }} title="Remove"><X size={13} /></button>
                                </div>
                              );
                            })}
                            {pinnedFields.map((fid) => (
                              <div key={fid} className="flex items-start gap-2">
                                <div className="flex-1"><InlineFieldCard fieldId={fid} /></div>
                                <button onClick={() => setPinnedFields((p) => p.filter((x) => x !== fid))} className="rounded hover:bg-black/5" style={{ width: 22, height: 22, color: '#a1a1aa', border: 'none', background: 'none', cursor: 'pointer', marginTop: 4 }} title="Remove"><X size={13} /></button>
                              </div>
                            ))}
                          </div>
                        )}
                        <div className="flex-1 min-h-0">
                          <CopilotChat className="h-full" instructions={INSTRUCTIONS()} labels={{ title: 'Assistant', initial: 'Search above, pick a workflow, or just tell me what to do.', placeholder: 'Ask, or tell me what to do…' }} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div ref={pageBodyRef} className="h-full overflow-auto" style={{ background: '#fff' }}>
                  {ActivePage ? <ActivePage key={activeWindow?.id} /> : <div style={{ padding: 32, fontSize: 13, color: '#71717a' }}>Page unavailable.</div>}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
