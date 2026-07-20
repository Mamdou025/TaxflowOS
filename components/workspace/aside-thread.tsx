'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Aside thread — light NEUMORPHIC chat as CopilotKit render slots.
//
// CopilotKit keeps ALL real capabilities (streaming, tool-call rendering via
// `subComponent`, actions). We only replace the visuals: a light neumorphic
// thread (raised user bubble on the right, assistant full-width on the left) + a
// raised neumorphic composer that doubles as the workspace search / launcher.
// The chat is neumorphic everywhere it appears (Scope focus + docked panel); the
// other pages keep their dark background. Palette lives in lib/librechat-theme.ts.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, createContext, useContext, type ReactNode } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { Paperclip, Plus, FileText, ChevronDown, X, ArrowUp, Square, Play, Sparkles, ArrowRight, ExternalLink } from 'lucide-react';
import { LC } from '@/lib/librechat-theme';
import { ScopeMark } from '@/components/scope-orb';
import { CoworkerAvatar } from '@/components/assistant/coworker-avatar';
import { coworkerForMessage, coworkerForWorkflow, WORKSPACE_ASSISTANT, type Coworker } from '@/lib/coworkers';
import { MessageSpecialistContext } from '@/components/assistant/message-specialists';
import { detectComposerIntent } from '@/lib/composer-intent';
import { selectedClientAtom, showClientSwitcherAtom } from '@/lib/nav-store';

// Accent gradient + cool focus edge for the console (the chat's one accent flourish).
const ACCENT = '#6B21A8';
const ACCENT_2 = '#7C3AED';
const EDGE = '#6366F1';
const SEND_GRADIENT = `linear-gradient(140deg, ${ACCENT_2}, ${ACCENT})`;

// ── Composer command palette ──────────────────────────────────────────────────
export type ComposerSuggestion = { key: string; title: string; sub: string; kind: string; dim?: boolean; icon?: ReactNode; run: () => void };
export const AsideComposerContext = createContext<{
  search?: (q: string) => ComposerSuggestion[];
  tools?: ComposerSuggestion[];
  commands?: ComposerSuggestion[]; // pickable "build functions" — shown when the text starts with "@"
  onAttach?: (files: File[]) => Promise<string>;
  agents?: ReactNode; // agent roster, rendered in the composer's lower options strip
} | null>(null);

type ComposerMode = 'ask' | 'search';

function md(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} style={{ fontWeight: 650 }}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

// ── Custom slots for CopilotKit ───────────────────────────────────────────────

export function AsideUserMessage(props: { message?: any; rawData?: unknown }) {
  const content = typeof props.message === 'string' ? props.message : props.message?.content ?? '';
  if (!content) return null;
  return (
    <div className="lc-row" data-message-id={typeof props.message === 'object' ? props.message?.id : undefined} style={{ justifyContent: 'flex-end' }}>
      <div style={{ maxWidth: 'min(85%, 560px)', background: LC.surface, color: LC.text, borderRadius: 20, padding: '10px 16px', fontSize: 14.5, lineHeight: 1.55, whiteSpace: 'pre-wrap', boxShadow: LC.shadowSm }}>
        {content}
      </div>
    </div>
  );
}

export function AsideAssistantMessage(props: {
  message?: any;
  subComponent?: ReactNode;
  isLoading?: boolean;
  isGenerating?: boolean;
  isCurrentMessage?: boolean;
}) {
  const content = typeof props.message === 'string' ? props.message : props.message?.content ?? '';

  // Avatar: a tool call attributes the message (runWorkflow → specialist, generateUI →
  // UI Composer, page ops → UI Concierge). For a plain reply (generic Workspace
  // Assistant), fall back to the specialist of the preceding user turn, so a past FAPI
  // answer shows Sofi. Never overrides a specific tool attribution.
  const specialistMap = useContext(MessageSpecialistContext);
  const own: Coworker = coworkerForMessage(props.message);
  const msgId = typeof props.message === 'object' ? props.message?.id : undefined;
  const specialist = msgId ? specialistMap[msgId] : undefined;
  const coworker: Coworker = specialist && own.id === WORKSPACE_ASSISTANT.id ? specialist : own;

  if (props.isLoading && !content && !props.subComponent) {
    return (
      <div className="lc-row">
        <div className="lc-avatar"><CoworkerAvatar coworker={coworker} size={26} /></div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, paddingTop: 9 }}>
          <span className="lc-typing" style={{ animationDelay: '0ms' }} />
          <span className="lc-typing" style={{ animationDelay: '180ms' }} />
          <span className="lc-typing" style={{ animationDelay: '360ms' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="lc-row" data-message-id={typeof props.message === 'object' ? props.message?.id : undefined}>
      <div className="lc-avatar"><CoworkerAvatar coworker={coworker} size={26} /></div>
      <div style={{ minWidth: 0, flex: 1, paddingTop: 2 }}>
        {content && <div style={{ fontSize: 14.5, color: LC.body, lineHeight: 1.65, whiteSpace: 'pre-wrap', maxWidth: 760 }}>{md(content)}</div>}
        {props.subComponent && <div style={{ marginTop: content ? 10 : 0 }}>{props.subComponent}</div>}
      </div>
    </div>
  );
}

export function AsideInput(props: {
  inProgress?: boolean;
  onSend?: (text: string) => void | Promise<unknown>;
  onStop?: () => void;
}) {
  const [text, setText] = useState('');
  const [active, setActive] = useState(-1);
  const [mode, setMode] = useState<ComposerMode>('ask');
  const [showTools, setShowTools] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [attaching, setAttaching] = useState(false);
  const [focused, setFocused] = useState(false);
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const busy = !!props.inProgress;
  const ready = (!!text.trim() || files.length > 0) && !busy && !attaching;

  // Client whose worksheets/documents Scope reads (the context chip).
  const client = useAtomValue(selectedClientAtom);
  const openClientSwitcher = useSetAtom(showClientSwitcherAtom);

  // Live PREVIEW of what Scope will do (advisory — see lib/composer-intent). Only
  // in Ask mode and never for the "@" command palette or Search mode.
  const intent = mode === 'ask' && !text.startsWith('@') ? detectComposerIntent(text) : null;
  const isAction = !!intent && intent.action !== 'answer';
  const runCoworker = intent?.action === 'run' && intent.workflowId ? coworkerForWorkflow(intent.workflowId) : null;
  const VerbIcon = intent?.action === 'run' ? Play : intent?.action === 'open' ? ExternalLink : Sparkles;
  const showAction = ready && isAction;

  const ctx = useContext(AsideComposerContext);
  // "@" opens the command menu (pick a build function by name); otherwise the
  // typed text searches the workspace. Both feed one `palette` for keyboard nav.
  const commandMode = text.startsWith('@');
  const commandQuery = commandMode ? text.slice(1).trim().toLowerCase() : '';
  const commands = commandMode && ctx?.commands
    ? ctx.commands.filter((c) => !commandQuery || `${c.title} ${c.sub} ${c.kind}`.toLowerCase().includes(commandQuery))
    : [];
  const suggestions = !commandMode && text.trim() && ctx?.search ? ctx.search(text) : [];
  const palette = commandMode ? commands : suggestions;
  const showPalette = palette.length > 0;

  const send = async () => {
    if (!ready) return;
    const t = text.trim();
    const pending = files;
    setText(''); setActive(-1); setFiles([]);
    let note = '';
    if (pending.length && ctx?.onAttach) {
      setAttaching(true);
      try { note = await ctx.onAttach(pending); } finally { setAttaching(false); }
    }
    props.onSend?.([t, note].filter(Boolean).join('\n\n'));
    ref.current?.focus();
  };
  const pick = (s: ComposerSuggestion) => { setText(''); setActive(-1); setShowTools(false); s.run(); ref.current?.focus(); };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (showPalette && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault();
      setActive((i) => { const n = palette.length; return e.key === 'ArrowDown' ? (i + 1) % n : (i - 1 + n) % n; });
      return;
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (showPalette && active >= 0) pick(palette[active]);
      else if (showPalette && (commandMode || mode === 'search')) pick(palette[0]);
      else send();
    }
    if (e.key === 'Escape') { setActive(-1); setShowTools(false); }
  };

  const addFiles = (list: FileList | null) => { if (list?.length) setFiles((prev) => [...prev, ...Array.from(list)]); };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [text]);
  useEffect(() => { setActive(-1); }, [text]);

  const ctrlBtn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, border: 'none', background: 'transparent', color: LC.muted, cursor: 'pointer', flexShrink: 0 };
  const suggList = (items: ComposerSuggestion[], withActive: boolean) => items.map((s, i) => (
    <button
      key={s.key}
      onMouseDown={(e) => { e.preventDefault(); pick(s); }}
      onMouseEnter={() => withActive && setActive(i)}
      className="w-full flex items-center gap-2.5 text-left"
      style={{ padding: '10px 14px', border: 'none', background: withActive && i === active ? LC.surfaceHover : 'transparent', cursor: 'pointer', opacity: s.dim ? 0.5 : 1 }}
    >
      {s.icon && <span style={{ color: LC.muted, flexShrink: 0, display: 'flex' }}>{s.icon}</span>}
      <span className="flex-1 min-w-0">
        <span style={{ display: 'block', fontSize: 13, fontWeight: 550, color: LC.title }}>{s.title}{s.dim && <span style={{ color: LC.muted, fontWeight: 400 }}> · soon</span>}</span>
        <span style={{ display: 'block', fontSize: 11.5, color: LC.muted }}>{s.sub}</span>
      </span>
      <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase', color: LC.muted, flexShrink: 0 }}>{s.kind}</span>
    </button>
  ));

  return (
    <div style={{ padding: '8px 16px 16px', position: 'relative' }}>
      <div style={{ position: 'relative' }}>
        {showPalette && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 'calc(100% + 8px)', zIndex: 20, background: LC.surface, border: `1px solid ${LC.border}`, borderRadius: 14, boxShadow: LC.shadowOut, overflow: 'hidden', maxHeight: 320, overflowY: 'auto' }}>
            {commandMode && (
              <div style={{ padding: '9px 14px 4px', fontSize: 10, fontWeight: 650, letterSpacing: '0.05em', textTransform: 'uppercase', color: LC.muted }}>Commands · type to filter</div>
            )}
            {suggList(palette, true)}
          </div>
        )}
        {/* "+" add menu — attach a file · workflows · agents */}
        {showTools && !showPalette && (
          <>
            <div onMouseDown={() => setShowTools(false)} style={{ position: 'fixed', inset: 0, zIndex: 19 }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 'calc(100% + 8px)', zIndex: 20, background: LC.surface, border: `1px solid ${LC.border}`, borderRadius: 14, boxShadow: LC.shadowOut, overflow: 'hidden', maxHeight: 360, overflowY: 'auto' }}>
              <button onMouseDown={(e) => { e.preventDefault(); fileRef.current?.click(); setShowTools(false); }} className="w-full flex items-center gap-2.5 text-left hover:bg-black/5" style={{ padding: '11px 14px', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                <span style={{ color: LC.muted, flexShrink: 0, display: 'flex' }}><Paperclip size={16} /></span>
                <span style={{ fontSize: 13, fontWeight: 550, color: LC.title }}>Attach a file</span>
              </button>
              {(ctx?.tools?.length ?? 0) > 0 && (
                <>
                  <div style={{ height: 1, background: LC.borderSubtle, margin: '2px 0' }} />
                  <div style={{ padding: '9px 14px 4px', fontSize: 10, fontWeight: 650, letterSpacing: '0.05em', textTransform: 'uppercase', color: LC.muted }}>Workflows &amp; Agents</div>
                  {suggList(ctx!.tools!, false)}
                </>
              )}
            </div>
          </>
        )}

        {/* ── The Scope Console — a SHORT single-row pill ───────────────────────
            Fused orb (client switcher) · prompt · [+ add-menu] · [Ask/Search] ·
            send. The intent ribbon rises ABOVE it; the client + documents live in
            a lower strip below it. Pill height ≈ the orb's diameter. */}
        <style>{`
          .lc-aura { opacity: 0; transition: opacity 300ms ease; animation: lc-shimmer 5s linear infinite; }
          .lc-console-shell[data-focused="true"] .lc-aura { opacity: 1; }
          @keyframes lc-shimmer { to { background-position: 220% 0; } }
          .lc-console { transition: box-shadow 240ms ease; }
          .lc-console-shell[data-focused="true"] .lc-console { box-shadow: 0 10px 26px rgba(107,33,168,0.16) !important; }
          .lc-ribbon { animation: lc-rise 240ms cubic-bezier(0.23,1,0.32,1) both; }
          @keyframes lc-rise { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }
          @media (prefers-reduced-motion: reduce) { .lc-aura, .lc-ribbon { animation: none; } }
        `}</style>

        {/* Intent ribbon — rises ABOVE the pill when an action is detected */}
        {isAction && intent && (
          <div className="lc-ribbon" style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 8px 12px 88px', padding: '9px 13px', background: LC.surface, boxShadow: LC.shadowSm, borderRadius: 14 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 700, color: ACCENT, flexShrink: 0 }}>
              <VerbIcon size={15} /> {intent.verb}
            </span>
            <ArrowRight size={14} style={{ color: LC.faint, flexShrink: 0 }} />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
              {runCoworker ? <CoworkerAvatar coworker={runCoworker} size={22} /> : <ScopeMark size={22} />}
              <span style={{ fontSize: 12.5, color: LC.body, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {intent.action === 'run' ? (
                  <><b style={{ color: LC.title, fontWeight: 650 }}>{runCoworker?.name ?? 'Scope'}</b> runs {intent.target ?? 'it'}</>
                ) : intent.action === 'open' ? (
                  <><b style={{ color: LC.title, fontWeight: 650 }}>Scope</b> opens it beside the chat</>
                ) : (
                  <><b style={{ color: LC.title, fontWeight: 650 }}>Scope</b> builds it in the chat</>
                )}
              </span>
            </span>
            <span style={{ flex: 1 }} />
            {intent.action === 'run' && <span style={{ fontSize: 11, color: LC.muted, flexShrink: 0 }}>you Start it before it runs</span>}
          </div>
        )}

        {/* Short pill — the orb is ~1.5× the pill's height and BULGES out (absolute,
            vertically centred); the left padding reserves its column. */}
        <div className="lc-console-shell" data-focused={focused ? 'true' : undefined} style={{ position: 'relative' }}>
          <div className="lc-aura" aria-hidden style={{ position: 'absolute', inset: -2, borderRadius: 999, zIndex: 0, background: `linear-gradient(115deg, ${EDGE}, ${ACCENT_2}, ${ACCENT}, ${EDGE})`, backgroundSize: '220% 100%' }} />
          <div className="lc-console" style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 10, minHeight: 52, background: LC.surface, borderRadius: 999, boxShadow: LC.shadowOut, padding: '6px 8px 6px 88px' }}>
            <input ref={fileRef} type="file" multiple style={{ display: 'none' }} onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />

            {/* Fused orb — client switcher. Bigger than the pill so it bulges out. */}
            <button
              onClick={() => openClientSwitcher(true)}
              className="lc-orb-select"
              title="Choose client — Scope reads their worksheets & documents"
              style={{ position: 'absolute', left: -4, top: '50%', transform: 'translateY(-50%)', zIndex: 2, border: 'none', background: 'transparent', cursor: 'pointer', padding: 0, borderRadius: '50%', lineHeight: 0 }}
            >
              <ScopeMark size={78} />
            </button>

            <textarea
              ref={ref}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              rows={1}
              placeholder={mode === 'search' ? 'Search worksheets, workflows, agents…' : 'Ask Scope, or describe a task…'}
              className="lc-textarea"
              style={{ flex: 1, minWidth: 0, display: 'block', resize: 'none', fontSize: 15.5, color: LC.text, background: 'transparent', outline: 'none', border: 'none', lineHeight: 1.5, maxHeight: 120, overflowY: 'auto', fontFamily: 'inherit', fontWeight: 400, padding: '2px 0' }}
            />

            {/* + add menu (attach · workflows · agents) */}
            <button onClick={() => setShowTools((o) => !o)} style={{ ...ctrlBtn, width: 36, height: 36, borderRadius: '50%', background: showTools ? LC.surfaceHover : 'transparent', color: showTools ? LC.title : LC.muted }} className="hover:bg-black/5" title="Add — attach a file, workflows, agents" aria-label="Add"><Plus size={19} /></button>

            {/* Ask / Search selector */}
            <button
              onClick={() => setMode((m) => (m === 'ask' ? 'search' : 'ask'))}
              className="hover:bg-black/5"
              title={mode === 'ask' ? 'Ask mode — Enter sends to Scope. Click to search the workspace instead.' : 'Search mode — Enter searches the workspace. Click to ask Scope instead.'}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 2, height: 34, padding: '0 8px 0 11px', borderRadius: 999, border: 'none', background: mode === 'search' ? LC.surfaceHover : 'transparent', color: mode === 'search' ? LC.title : LC.muted, cursor: 'pointer', fontSize: 12.5, fontWeight: 600, flexShrink: 0 }}
            >
              {mode === 'ask' ? 'Ask' : 'Search'}<ChevronDown size={13} style={{ opacity: 0.6 }} />
            </button>

            {/* Send */}
            {showAction && intent ? (
              <button
                onClick={send}
                aria-label={intent.sendLabel}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 7, height: 40, borderRadius: 999, padding: '0 18px 0 15px', border: 'none', cursor: 'pointer', background: SEND_GRADIENT, color: '#fff', fontSize: 13, fontWeight: 650, boxShadow: '0 4px 12px rgba(107,33,168,0.32)', flexShrink: 0 }}
              >
                <VerbIcon size={15} /> {intent.sendLabel}
              </button>
            ) : (
              <button
                onClick={busy && props.onStop ? props.onStop : send}
                disabled={!busy && !ready}
                aria-label={busy ? 'Stop' : 'Send'}
                style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0, background: ready || busy ? LC.text : LC.surfaceHover, border: 'none', cursor: ready || (busy && props.onStop) ? 'pointer' : 'default', display: 'grid', placeItems: 'center', transition: 'all 140ms ease', color: ready || busy ? LC.bg : LC.muted }}
              >
                {busy && props.onStop ? <Square size={13} fill="currentColor" /> : <ArrowUp size={18} strokeWidth={2.4} />}
              </button>
            )}
          </div>
        </div>

        {/* Lower section — client + documents/sources (indented to clear the orb column) */}
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 6, padding: '10px 6px 0 88px' }}>
          <button
            onClick={() => openClientSwitcher(true)}
            className="hover:bg-black/5"
            title="Choose client — Scope reads their worksheets & documents"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '5px 10px 5px 6px', borderRadius: 999, border: 'none', background: 'transparent', cursor: 'pointer' }}
          >
            <span style={{ width: 18, height: 18, borderRadius: '50%', display: 'grid', placeItems: 'center', background: 'rgba(139,92,246,0.16)', color: '#7C3AED', fontSize: 9, fontWeight: 800 }}>{client.charAt(0)}</span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: LC.body, maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.replace(/\.$/, '')}</span>
            <ChevronDown size={12} style={{ opacity: 0.55, color: LC.muted, flexShrink: 0 }} />
          </button>

          <span style={{ width: 1, height: 15, background: LC.borderSubtle, flexShrink: 0 }} />

          <button
            onClick={() => fileRef.current?.click()}
            className="hover:bg-black/5"
            title="Add a document or source Scope can read"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 11px', borderRadius: 999, border: 'none', background: 'transparent', color: LC.muted, cursor: 'pointer', fontSize: 12.5, fontWeight: 550 }}
          >
            <FileText size={15} /> Documents
          </button>

          {/* Agent roster — moved here from the thread header (assign work / @-mention) */}
          {ctx?.agents && (
            <>
              <span style={{ width: 1, height: 15, background: LC.borderSubtle, flexShrink: 0 }} />
              {ctx.agents}
            </>
          )}

          {/* attached file chips */}
          {files.map((f, i) => (
            <span key={`${f.name}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: LC.surfaceHover, border: `1px solid ${LC.border}`, borderRadius: 999, padding: '4px 7px 4px 11px', fontSize: 11.5, color: LC.text, maxWidth: 200 }}>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
              <button onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} style={{ display: 'flex', border: 'none', background: 'none', color: LC.muted, cursor: 'pointer', padding: 0 }} aria-label="Remove attachment"><X size={13} /></button>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Shared styles: LibreChat dark rows + CopilotKit overrides ──────────────────
export function AsideThreadStyles() {
  return (
    <style>{`
      /* Light-theme the in-chat run-flow (workflow-run-flow reads these --cwp-*
         vars; unset → its dark fallbacks). Mirrors that file's LIGHT_VARS. */
      .aside-thread {
        --cwp-ink:#18181b; --cwp-muted:#71717a; --cwp-faint:#a1a1aa; --cwp-dim:#c4c4cc;
        --cwp-line:rgba(24,24,27,0.10); --cwp-hairline:rgba(24,24,27,0.07);
        --cwp-surface:#ffffff; --cwp-card:#ffffff; --cwp-ground:#F4F5F8;
        --cwp-primary-bg:#18181b; --cwp-primary-fg:#ffffff; --cwp-live:#0369a1;
        --cwp-amber:#b45309; --cwp-amber-text:#92400e; --cwp-amber-soft:rgba(217,119,6,0.08); --cwp-amber-line:rgba(217,119,6,0.30);
        --cwp-danger:#b91c1c; --cwp-spine-done:rgba(24,24,27,0.18); --cwp-spine-ahead:rgba(24,24,27,0.09);
        --cwp-hover:rgba(24,24,27,0.03);
      }
      /* ONE centered column for the whole conversation. Force every direct child
         of the scroll area (the messages container AND any action/tool render that
         CopilotKit drops in as a sibling) to the same max-width + centering, so a
         run-flow card can't break out wider/left of the text bubbles. */
      .aside-thread .copilotKitMessages {
        background: transparent !important;
        display: flex !important; flex-direction: column; align-items: center;
        flex: 1 1 auto; padding: 24px 16px 10px !important;
      }
      /* Wider column so generated dashboards/tables have room; prose + bubbles are
         capped narrower inline (AsideAssistantMessage / AsideUserMessage) so text
         stays readable while artifacts use the full width. max-width adapts down
         in the narrow docked panel. */
      .aside-thread .copilotKitMessages > * { width: 100%; max-width: 1040px; }
      .aside-thread .copilotKitMessagesContainer { padding: 0 !important; width: 100%; max-width: 1040px; margin: 0 auto; }
      .aside-thread .copilotKitMessages::before { display: none; }
      .aside-thread .copilotKitMessage {
        background: transparent !important; border: none !important;
        padding: 0 !important; margin: 0 !important; box-shadow: none !important;
        max-width: none !important; width: 100% !important; color: inherit !important;
      }
      /* The run flow blends INTO the dark thread — no light card, no border. It
         reads as part of what the assistant is saying: a vertical timeline on the
         chat's own ground, connected by its internal step spine. Kept narrower
         than generated UI so the timeline stays readable. */
      .aside-thread [data-run-flow] {
        width: 100%; max-width: 860px;
        background: transparent; border: none;
        border-radius: 0; padding: 2px 0;
      }
      .aside-thread [data-genui] { width: 100%; }
      .aside-thread .copilotKitInputContainer, .aside-thread .copilotKitInput {
        border: none !important; background: transparent !important; box-shadow: none !important; padding: 0 !important;
      }
      .lc-textarea::placeholder { color: ${LC.muted}; }

      /* A message row: [avatar | content] — fills the column (no per-row centering). */
      .aside-thread .lc-row {
        display: flex; gap: 14px; align-items: flex-start;
        width: 100%; margin: 0 0 22px;
        animation: lc-in 260ms cubic-bezier(0.23,1,0.32,1) both;
      }
      @keyframes lc-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }
      /* Positioning marker only — the coworker avatar (CoworkerAvatar) paints itself. */
      .aside-thread .lc-avatar { flex-shrink: 0; margin-top: 2px; display: inline-flex; }
      .aside-thread .lc-typing {
        width: 7px; height: 7px; border-radius: 50%; background: ${LC.muted};
        display: inline-block; animation: lc-typing 1.2s infinite;
      }
      @keyframes lc-typing { 0%,60%,100% { transform: translateY(0);} 30% { transform: translateY(-5px);} }
    `}</style>
  );
}
