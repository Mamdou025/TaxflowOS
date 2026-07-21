'use client';

// ─────────────────────────────────────────────────────────────────────────────
// AssistantThread — the presentational chat column (light neumorphic). Shared by
// the Scope focus mode (ChatWorkspace) and the docked AssistantPanel. Renders the
// live-run pill, the empty → conversation transition, the pinned inline cards, and
// CopilotChat with the Aside (LibreChat) render slots. Logic/state come in via the
// `assistant` object (see useAssistant). Palette: lib/librechat-theme.ts.
// ─────────────────────────────────────────────────────────────────────────────

import { type CSSProperties, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAtomValue, useSetAtom } from 'jotai';
import { X, ChevronDown, Calendar } from 'lucide-react';
import { CopilotChat } from '@copilotkit/react-ui';
import '@copilotkit/react-ui/styles.css';
import {
  AsideAssistantMessage,
  AsideUserMessage,
  AsideInput,
  AsideThreadStyles,
  AsideComposerContext,
} from '@/components/workspace/aside-thread';
import { InlineFieldCard } from '@/components/workspace/inline-field-card';
import { WorkflowElementCard } from '@/components/workspace/workflow-run-flow';
import { getWorkflowConfig } from '@/lib/workflow-runs';
import { getAgent } from '@/lib/agents';
import { buildAgentCatalog } from '@/shared/stores/resource-registry';
import { LC } from '@/lib/librechat-theme';
import { selectedClientAtom, showClientSwitcherAtom, scopeYearAtom } from '@/shared/stores/nav-store';
import { InScopeNeuMark } from '@/components/inscope-neu-mark';
import { WorkMenu, WorkMenuStyles } from './work-menu';
import { AgentRoster } from './agent-roster';
import { AgentGreeting } from './agent-greeting';
import { workIdFor, type WorkItem } from '@/lib/work-store';
import { ThreadMessages, PinnedThreadContext } from './thread-messages';
import { RunWorkflowRender, type Assistant } from './use-assistant';

// ── Light neumorphic theme for the CopilotKit chat ─────────────────────────────
export const CHAT_THEME: CSSProperties = {
  ['--copilot-kit-primary-color' as string]: LC.text,
  ['--copilot-kit-contrast-color' as string]: LC.bg,
  ['--copilot-kit-background-color' as string]: LC.bg,
  ['--copilot-kit-secondary-color' as string]: LC.surface,
  ['--copilot-kit-secondary-contrast-color' as string]: LC.text,
  ['--copilot-kit-separator-color' as string]: LC.borderSubtle,
  ['--copilot-kit-muted-color' as string]: LC.muted,
  ['--copilot-kit-input-background-color' as string]: LC.bg,
  height: '100%',
};

const HERO_SUGGESTIONS = [
  'Calculate FAPI for Northstar',
  'Open the dashboard',
  'Run the art. 85 rollover',
  'Review FAPI exceptions',
];

const INSTRUCTIONS = () => {
  const c = buildAgentCatalog();
  const pages = c.pages.map((p) => `- ${p.key}: ${p.title} — ${p.subtitle}`).join('\n');
  const fields = c.fields.map((f) => `- ${f.fieldId} (${f.pageKey}): ${f.label}`).join('\n');
  return `You are the assistant inside InScope, a fiscalist's workspace. You help by talking AND by acting through tools.

Style: ALWAYS reply with a short, natural sentence FIRST — acknowledge the request and say what you're about to do — then call the tool(s). Never act silently. Keep replies concise and professional.

INTENT — ask vs. do (read this first):
- A workflow NAME is not a command. Someone mentioning FAPI, or asking what it is / how it works / what inputs it needs, wants an ANSWER — explain it, do NOT call runWorkflow.
- Only START a workflow (runWorkflow) when the user gives a clear instruction to act: "start/run/launch/calculate the FAPI workflow", "démarre la FAPI", or an equivalent imperative. When they explicitly ask to start a specific workflow, actually call runWorkflow — don't just talk about it.
- Hypotheticals ("what if…", "roughly", "could we", "we may have FAPI", "I'm considering") and negations/holds ("don't run it", "not yet", "only explain", "sans lancer", "pas encore") are NEVER a reason to start or modify anything — answer or offer, don't act.
- If a message you receive contains a routing note in [assistant-routing] brackets, treat it as an authoritative instruction about what to do this turn (it is added by the system, not the user).
- When unsure whether the user wants an answer or an action, ANSWER or OFFER — never start, finalize, or change a protected value on a guess. In this workspace a wrong action is worse than an extra question.

CRITICAL tool routing:
- To RUN / START / EXECUTE a workflow → call **runWorkflow** with the workflowId. Valid ids: "fapi" for "compute/run FAPI"; "roulement" for "run the rollover / roulement art. 85 / section 85"; "expense" for "run the expense report / (employee) expense reimbursement"; "campaign" for "run the campaign budget / marketing budget allocation". This renders a PROPOSAL card (with a Start button); the live run begins only when the user clicks Start, then it pauses for them (upload a document, categorize a row, elect an amount, approve). So OFFER to run it — briefly say what it does and what it needs — do NOT say it is already running. NEVER open a worksheet to "run" a workflow — the worksheet is only the static end result.
- To open/show a worksheet for viewing → openPage.
- To highlight a specific figure/section on a page → focusAnchor.
- When the user asks to SEE or EDIT a value (e.g. "show me the FX rate", "let me change the FX rate") → call **editField**. This brings the editable field directly INTO the chat; do NOT open the worksheet for this.
- To GENERATE a custom, one-off view that is NOT a registered worksheet — a quick dashboard, chart, KPI tiles, table, or a small form for ad-hoc values → call **generateUI** with a COMPLETE description of the UI *including the concrete data/numbers to show*. Use this for "generate/create/mock/show me a dashboard|chart|table|form of …" and whenever the message starts with "Generate this view:". Do NOT use openPage or runWorkflow for these — those are for real worksheets and workflows only.
  - GenUI rules (it does NOT have access to any data — it only shows what you put in the prompt, and it must not invent numbers): (a) include the REAL figures — pull them from the active-run context, an open worksheet, or what the user gave you; if you don't have a number, don't ask GenUI to show it. NEVER instruct it to invent, estimate, or calculate. (b) Ask for the SIMPLEST fitting view: a few figures → KPI tiles or a table; a chart ONLY for a real comparison or trend; do NOT request a pie chart unless it's genuinely parts-of-a-whole, and don't tack on extra charts. (c) Keep it on-topic (tax/finance) — no images or decorative components. If you have no real data to show, don't call generateUI — just say what you'd need.

Working WITH a running workflow: a run can be in progress AND you can still help alongside it — the user may ask questions or want a view WITHOUT finishing/approving the run. The active-run context carries the run's live figures (categories, computed lines, summary, top rows) as soon as a source is loaded. Use those ACTUAL numbers to answer questions about the run ("what's my biggest income category?", "how much is net FAPI so far?") and to feed **generateUI** (e.g. "chart my FAPI by category") — pull the real figures from the active-run context into the generateUI prompt. Never invent numbers when the run already has them.

GROUNDING — where your facts come from (NEVER invent a value):
- "Editable worksheet fields" context: every field + its CURRENT value. Read FX rate, inclusion rate, and other field values from HERE. If a field's \`isDefault\` is true it has NOT been set yet — say "it's still the default (X)" or "not set yet", do NOT assert it as a chosen figure.
- "Workflows you are actually working on" context: each active workflow's live \`snapshot\` (lines, summary with CAD, FX rate, classification) computed by the real engine — these ARE the on-screen numbers even with no worksheet open. Answer figure questions ("net FAPI?", "biggest income category?") from here; for a formula/operand breakdown call whyWorksheetValue or explainWorksheetLine.
- If NONE of these contexts contains the value the user asks for, SAY you don't have it yet and offer to open the worksheet or run/upload the workflow — do NOT guess. Never state a number you cannot point to in one of these contexts. It is better to say "I don't have that value yet" than to invent one.
- When calling editField, copy the exact \`fieldId\` from the editable-fields context (e.g. "fx"); do not invent ids like "FX_RATE".

MEMORY — durable facts you can save:
- The "Remembered facts and preferences" context holds things the user asked you to remember in earlier sessions (already filtered to the current client). Treat them as trusted grounding and USE them (e.g. a saved reporting currency or default client), but never invent or assume one that isn't listed.
- When the user EXPLICITLY asks you to remember / save / note something for later ("remember that…", "always…", "my default … is…"), call **rememberFact** with a short self-contained sentence; use global=true only for a preference that applies to every client, otherwise it is saved for the current client. Do NOT auto-save things the user didn't ask you to remember.
- To remove a saved item when asked to forget it, call **forgetFact** with its id from the remembered-facts context.

SPECIALISTS — one assistant, many hats:
- Some turns include a "SPECIALIST FOR THIS TURN" persona in context (e.g. Sofi for FAPI, Théo for the art. 85 rollover, Mira for expenses, Nova for campaign budgets). When present, ADOPT that persona and its domain expertise for the turn — answer as that specialist. When it shifts to another domain, switch specialists; for general/navigation turns, remain the coordinating assistant. There is only ONE of you and one conversation — the persona is a lens, not a separate agent.

Registered pages:
${pages}

Editable fields:
${fields}

Only ever reference page keys, anchors, and field ids that exist above.`;
};

export function AssistantThreadStyles() {
  return (
    <style>{`
      @keyframes cwp-run-halo { 0% { box-shadow: 0 0 0 0 rgba(167,139,250,0.4);} 70% { box-shadow: 0 0 0 7px rgba(167,139,250,0);} 100% { box-shadow: 0 0 0 0 rgba(167,139,250,0);} }
      .cwp-run-halo { animation: cwp-run-halo 1.8s ease-out infinite; }
    `}</style>
  );
}

// The Scope orb as a shared-element (framer `layoutId`) so it can FLY between the
// homepage hero (centred, in the "InScope" lockup) and the header cluster (top-left)
// when a chat starts/stops. Pass the SAME layoutId in both places; framer tweens the
// position + size. `label=''` renders the bare orb (docked); 'Scope' engraves the word.
function ScopeOrbButton({ size, layoutId, onClick, label = 'Scope', style }: { size: number; layoutId?: string; onClick?: () => void; label?: string; style?: CSSProperties }) {
  return (
    <motion.button
      layoutId={layoutId}
      onClick={onClick}
      aria-label="Choose client — Scope reads their worksheets & documents"
      title="Choose client — Scope reads their worksheets & documents"
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{ position: 'relative', zIndex: 2, flexShrink: 0, display: 'grid', placeItems: 'center', width: size, height: size, borderRadius: '50%', padding: 0, border: 'none', background: 'transparent', cursor: 'pointer', ...style }}
    >
      <InScopeNeuMark size={size} animate label={label} />
    </motion.button>
  );
}

// The header SCOPE CLUSTER — a big Scope orb on the LEFT that visually CONTROLS a
// raised tray of scope tags beside it: the company (client), the year, and the current
// workflow. The orb + the company tag open the client switcher; the workflow tag opens
// the work switcher. Reads as: [ ORB ]→[ Northstar Inc · 2025 · FAPI · Needs you ].
// The tray tucks under the orb (negative margin) so the orb looks plugged into it.
function ScopeCluster({ compact = false, onOpenWork }: { compact?: boolean; onOpenWork: (item: WorkItem) => void }) {
  const client = useAtomValue(selectedClientAtom);
  const year = useAtomValue(scopeYearAtom);
  const openClientSwitcher = useSetAtom(showClientSwitcherAtom);
  const orbSize = compact ? 32 : 96;
  const divider = <span style={{ width: 1, height: compact ? 16 : 22, background: LC.borderSubtle, flexShrink: 0 }} />;

  return (
    <div style={{ display: 'flex', alignItems: 'center', minWidth: 0, maxWidth: '100%' }}>
      {/* The orb — the control. Opens the client switcher. Shares layoutId with the
          homepage hero orb so it FLIES between the two on chat start/stop (focus only). */}
      <ScopeOrbButton size={orbSize} layoutId={compact ? undefined : 'scope-orb'} onClick={() => openClientSwitcher(true)} label="" />

      {/* The scope tray — the tags the orb controls (company · year · current workflow).
          It "pulls out" of the orb on reveal: a clip-path wipe from the orb's edge. */}
      <motion.div
        initial={compact ? false : { clipPath: 'inset(0 100% 0 0)', opacity: 0 }}
        animate={{ clipPath: 'inset(0 0% 0 0)', opacity: 1 }}
        transition={{ delay: 0.14, duration: 0.42, ease: [0.23, 1, 0.32, 1] }}
        style={{
          display: 'flex', alignItems: 'center', gap: compact ? 6 : 3, minWidth: 0,
          marginLeft: compact ? 6 : -16, paddingLeft: compact ? 0 : 28, paddingRight: compact ? 0 : 10,
          height: compact ? undefined : 56, borderRadius: compact ? 0 : '0 16px 16px 0',
          background: compact ? 'transparent' : LC.surface, boxShadow: compact ? 'none' : LC.shadowSm,
        }}
      >
        {/* Company */}
        <button
          onClick={() => openClientSwitcher(true)}
          className="hover:bg-black/5"
          title="Choose client — Scope reads their worksheets & documents"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 7, minWidth: 0, maxWidth: compact ? 150 : 210, height: 32, padding: '0 8px', borderRadius: 9, border: 'none', background: 'transparent', cursor: 'pointer' }}
        >
          <span style={{ width: 20, height: 20, flexShrink: 0, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'var(--sx-accent-soft)', color: 'var(--sx-accent-strong)', fontSize: 9.5, fontWeight: 800 }}>{client.charAt(0)}</span>
          <span style={{ minWidth: 0, fontSize: 13, fontWeight: 650, color: LC.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.replace(/\.$/, '')}</span>
          <ChevronDown size={12} style={{ color: LC.muted, opacity: 0.6, flexShrink: 0 }} />
        </button>

        {/* Year — a placeholder scope param for now (see scopeYearAtom). */}
        {!compact && (
          <>
            {divider}
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 32, padding: '0 9px', color: LC.body, flexShrink: 0 }} title="Fiscal year in scope">
              <Calendar size={13} style={{ color: LC.muted }} />
              <span style={{ fontSize: 13, fontWeight: 600 }}>{year}</span>
            </span>
          </>
        )}

        {divider}
        {/* Current workflow — the stateful work switcher, embedded bare in the tray. */}
        <WorkMenu onOpen={onOpenWork} compact={compact} bare align="left" />
      </motion.div>
    </div>
  );
}

export function AssistantThread({ assistant, variant = 'focus' }: { assistant: Assistant; variant?: 'focus' | 'docked' }) {
  const {
    say, showHero,
    pinnedFields, pinnedElements, setPinnedFields, setPinnedElements,
    pinnedRuns, setPinnedRuns,
    composerSearch, composerTools, composerCommands, onAttach, launchOpenPage, launchStartWorkflow, setBuilderFocus, router,
    addressedAgent, addressAgent, clearAddressedAgent, beginAgentThinking,
  } = assistant;
  const docked = variant === 'docked';
  const openClientSwitcher = useSetAtom(showClientSwitcherAtom);

  // Time-based hero greeting. Pre-mount (SSR + first client render) both use the
  // evening bucket so there's no hydration mismatch; after mount we read the real
  // client hour and the heading re-renders to the correct part of day.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const hour = mounted ? new Date().getHours() : 18;
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  // "Open current state" from the Work menu: reopen each item where it lives.
  const onOpenWork = (item: WorkItem) => {
    if (item.open.kind === 'page') launchOpenPage(item.open.pageKey);
    else if (item.open.kind === 'workflow') launchStartWorkflow(item.open.workflowId);
    else if (item.open.kind === 'genui') say(`Generate this view: ${item.open.prompt}`);
  };

  // Pinned work (the addressed-agent greeting + deterministically-launched runs +
  // summoned elements/fields). Rendered INSIDE the message scroll by ThreadMessages,
  // so it's part of ONE scrollable conversation (composer fixed at the bottom). The
  // greeting sits first — it's the conversation's opener (click agent → greet → type).
  const hasPinned = !!addressedAgent || pinnedRuns.length > 0 || pinnedElements.length > 0 || pinnedFields.length > 0;
  const pinnedNode = hasPinned ? (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
      {addressedAgent && <AgentGreeting agent={addressedAgent} />}
      {pinnedRuns.map((wid) => {
        const cfg = getWorkflowConfig(wid);
        if (!cfg) return null;
        const agent = cfg.agentId ? getAgent(cfg.agentId) ?? undefined : undefined;
        return (
          <div key={`run:${wid}`} className="flex items-start gap-2" data-work-id={workIdFor('workflow-run', wid)}>
            <div className="flex-1">
              <RunWorkflowRender config={cfg} agent={agent} onOpenPage={(pk) => launchOpenPage(pk)} onOpenBuilder={(blockId) => { setBuilderFocus({ workflowId: cfg.id, blockId }); router.push('/builder'); }} />
            </div>
            <button onClick={() => setPinnedRuns((p) => p.filter((x) => x !== wid))} className="rounded hover:bg-black/5" style={{ width: 22, height: 22, color: LC.muted, border: 'none', background: 'none', cursor: 'pointer', marginTop: 4 }} title="Remove"><X size={13} /></button>
          </div>
        );
      })}
      {pinnedElements.map((el) => {
        const cfg = getWorkflowConfig(el.workflowId);
        if (!cfg) return null;
        return (
          <div key={`${el.workflowId}:${el.element}`} className="flex items-start gap-2">
            <div className="flex-1"><WorkflowElementCard config={cfg} element={el.element} onOpenPage={(pk) => launchOpenPage(pk)} onOpenBuilder={(blockId) => { setBuilderFocus({ workflowId: cfg.id, blockId }); router.push('/builder'); }} /></div>
            <button onClick={() => setPinnedElements((p) => p.filter((x) => !(x.workflowId === el.workflowId && x.element === el.element)))} className="rounded hover:bg-black/5" style={{ width: 22, height: 22, color: LC.muted, border: 'none', background: 'none', cursor: 'pointer', marginTop: 4 }} title="Remove"><X size={13} /></button>
          </div>
        );
      })}
      {pinnedFields.map((fid) => (
        <div key={fid} className="flex items-start gap-2">
          <div className="flex-1"><InlineFieldCard fieldId={fid} /></div>
          <button onClick={() => setPinnedFields((p) => p.filter((x) => x !== fid))} className="rounded hover:bg-black/5" style={{ width: 22, height: 22, color: LC.muted, border: 'none', background: 'none', cursor: 'pointer', marginTop: 4 }} title="Remove"><X size={13} /></button>
        </div>
      ))}
    </div>
  ) : null;

  return (
    <div className="h-full flex flex-col" style={{ ...CHAT_THEME, background: LC.bg /* match the sidebar surface (#F4F5F8) */ }}>
      <AsideThreadStyles />
      <AssistantThreadStyles />
      <WorkMenuStyles />

      {/* Header = the SCOPE CLUSTER (big orb + scope tags). Shown once a chat is under
          way; on the FOCUS homepage it's hidden and the orb lives centred in the hero
          below as the "InScope" lockup — the orb then FLIES up here (shared-element
          layoutId="scope-orb") and the tag tray pulls out of it when the chat starts.
          Docked always shows the compact cluster. */}
      {(docked || !showHero) && (
        <div className="shrink-0 relative flex items-center gap-3" style={{ height: docked ? 44 : 104, padding: '0 12px', borderBottom: `1px solid ${LC.borderSubtle}` }}>
          <ScopeCluster compact={docked} onOpenWork={onOpenWork} />
          <span style={{ flex: 1 }} />
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col">
        <AsideComposerContext.Provider value={{ search: composerSearch, tools: composerTools, commands: composerCommands, onAttach, agents: <AgentRoster onAssign={addressAgent} />, onAssignAgent: addressAgent, addressedAgent, onClearAddress: clearAddressedAgent, onAddressedSend: beginAgentThinking }}>
          <AnimatePresence mode="wait" initial={false}>
            {showHero ? (
              <motion.div
                key="hero"
                className="flex-1 min-h-0 flex flex-col"
                style={{ padding: docked ? '10px' : '20px' }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
              >
                {/* "InScope" lockup — the full wordmark beside the animated dial mark,
                    pinned TOP CENTRE. On chat start the dial flies to the header (shared
                    layoutId="scope-orb") and the wordmark is left behind (fades). The dial
                    is pulled in close to the word (negative margin absorbs its transparent
                    ring). Focus only; theme-aware (wordmark = .isneu-wordmark embossed
                    neumorphic in globals.css, dial themes itself). */}
                {!docked && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, paddingTop: 12, flexShrink: 0 }}>
                    <motion.span
                      className="isneu-wordmark"
                      initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      style={{ fontSize: 38, fontWeight: 400, letterSpacing: '-0.02em' }}
                    >InScope</motion.span>
                    <ScopeOrbButton size={116} layoutId="scope-orb" onClick={() => openClientSwitcher(true)} label="" />
                  </div>
                )}
                {/* Greeting + composer + suggestions — centred in the space below the orb. */}
                <div className="flex-1 min-h-0 flex items-center justify-center">
                  <div style={{ width: '100%', maxWidth: docked ? 'none' : 720 }}>
                    <div style={{ textAlign: 'center', marginBottom: docked ? 10 : 20 }}>
                      <div style={{ fontSize: docked ? 22 : 34, fontWeight: 700, color: LC.title, letterSpacing: '-0.02em' }}>{greeting}, Sophia</div>
                      <div style={{ fontSize: docked ? 13 : 16, fontWeight: 400, color: LC.muted, marginTop: 6 }}>How can I help you drive impact today?</div>
                    </div>
                    <AsideInput onSend={(t) => say(String(t))} />
                    {!docked && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginTop: 6, padding: '0 16px' }}>
                        {HERO_SUGGESTIONS.map((s) => (
                          <button
                            key={s}
                            onClick={() => say(s)}
                            className="hover:brightness-[0.98]"
                            style={{ background: LC.surface, border: 'none', boxShadow: LC.shadowSm, borderRadius: 999, padding: '8px 15px', fontSize: 13, color: LC.body, cursor: 'pointer', fontWeight: 500 }}
                          >{s}</button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="thread"
                className="flex-1 min-h-0 flex flex-col aside-thread"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.24 }}
                style={{ overflow: 'hidden' }}
              >
                <div className="flex-1 min-h-0">
                  {/* One scroll: pinned runs/cards render INSIDE the message stream (via
                      the custom ThreadMessages), with the composer fixed at the bottom. */}
                  <PinnedThreadContext.Provider value={pinnedNode}>
                    <CopilotChat className="h-full" instructions={INSTRUCTIONS()} labels={{ title: 'Assistant', initial: '', placeholder: 'Message Scope…' }} AssistantMessage={AsideAssistantMessage} UserMessage={AsideUserMessage} Input={AsideInput} Messages={ThreadMessages} />
                  </PinnedThreadContext.Provider>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </AsideComposerContext.Provider>
      </div>
    </div>
  );
}
