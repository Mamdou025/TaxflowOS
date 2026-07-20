'use client';

// ─────────────────────────────────────────────────────────────────────────────
// Aside thread — LibreChat-style dark chat as CopilotKit render slots.
//
// CopilotKit keeps ALL real capabilities (streaming, tool-call rendering via
// `subComponent`, actions). We only replace the visuals: a dark thread (user
// bubble on the right, assistant full-width on the left) + a dark rounded
// composer that doubles as the workspace search / launcher. No neumorphic.
// Palette lives in lib/librechat-theme.ts.
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, createContext, useContext, type ReactNode } from 'react';
import { Plus, LayoutGrid, ChevronDown, X, Search, ArrowUp, Square } from 'lucide-react';
import { LC } from '@/lib/librechat-theme';
import { CoworkerAvatar } from '@/components/assistant/coworker-avatar';
import { coworkerForMessage, WORKSPACE_ASSISTANT, type Coworker } from '@/lib/coworkers';
import { MessageSpecialistContext } from '@/components/assistant/message-specialists';

// ── Composer command palette ──────────────────────────────────────────────────
export type ComposerSuggestion = { key: string; title: string; sub: string; kind: string; dim?: boolean; icon?: ReactNode; run: () => void };
export const AsideComposerContext = createContext<{
  search?: (q: string) => ComposerSuggestion[];
  tools?: ComposerSuggestion[];
  commands?: ComposerSuggestion[]; // pickable "build functions" — shown when the text starts with "@"
  onAttach?: (files: File[]) => Promise<string>;
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
      <div style={{ maxWidth: 'min(85%, 560px)', background: LC.surface, color: LC.text, borderRadius: 20, padding: '10px 16px', fontSize: 14.5, lineHeight: 1.55, whiteSpace: 'pre-wrap' }}>
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
  const ref = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const busy = !!props.inProgress;
  const ready = (!!text.trim() || files.length > 0) && !busy && !attaching;

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
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 'calc(100% + 8px)', zIndex: 20, background: LC.surface, border: `1px solid ${LC.border}`, borderRadius: 14, boxShadow: '0 16px 40px rgba(0,0,0,0.5)', overflow: 'hidden', maxHeight: 320, overflowY: 'auto' }}>
            {commandMode && (
              <div style={{ padding: '9px 14px 4px', fontSize: 10, fontWeight: 650, letterSpacing: '0.05em', textTransform: 'uppercase', color: LC.muted }}>Commands · type to filter</div>
            )}
            {suggList(palette, true)}
          </div>
        )}
        {showTools && !showPalette && (ctx?.tools?.length ?? 0) > 0 && (
          <>
            <div onMouseDown={() => setShowTools(false)} style={{ position: 'fixed', inset: 0, zIndex: 19 }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 'calc(100% + 8px)', zIndex: 20, background: LC.surface, border: `1px solid ${LC.border}`, borderRadius: 14, boxShadow: '0 16px 40px rgba(0,0,0,0.5)', overflow: 'hidden', maxHeight: 340, overflowY: 'auto' }}>
              <div style={{ padding: '9px 14px 4px', fontSize: 10, fontWeight: 650, letterSpacing: '0.05em', textTransform: 'uppercase', color: LC.muted }}>Workflows &amp; Agents</div>
              {suggList(ctx!.tools!, false)}
            </div>
          </>
        )}

        {/* LibreChat composer: dark rounded surface */}
        <div style={{ background: LC.surface, borderRadius: 26, border: `1px solid ${LC.border}`, padding: '8px 8px 8px 18px' }}>
          {files.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, margin: '4px 0 8px' }}>
              {files.map((f, i) => (
                <span key={`${f.name}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: LC.surfaceHover, border: `1px solid ${LC.border}`, borderRadius: 8, padding: '4px 6px 4px 9px', fontSize: 11.5, color: LC.text, maxWidth: 220 }}>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</span>
                  <button onClick={() => setFiles((p) => p.filter((_, j) => j !== i))} style={{ display: 'flex', border: 'none', background: 'none', color: LC.muted, cursor: 'pointer', padding: 0 }} aria-label="Remove attachment"><X size={13} /></button>
                </span>
              ))}
            </div>
          )}

          <textarea
            ref={ref}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            rows={1}
            placeholder={mode === 'search' ? 'Search worksheets, workflows, agents…' : 'Message Scope…  ( @ for commands )'}
            className="lc-textarea"
            style={{ display: 'block', width: '100%', resize: 'none', fontSize: 15, color: LC.text, background: 'transparent', outline: 'none', border: 'none', lineHeight: 1.5, maxHeight: 160, overflowY: 'auto', fontFamily: 'inherit', fontWeight: 400, paddingTop: 6 }}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 4 }}>
            <input ref={fileRef} type="file" multiple style={{ display: 'none' }} onChange={(e) => { addFiles(e.target.files); e.target.value = ''; }} />
            <button onClick={() => fileRef.current?.click()} style={ctrlBtn} className="hover:bg-white/10" title="Attach a file"><Plus size={18} /></button>
            <button onClick={() => setShowTools((o) => !o)} style={{ ...ctrlBtn, background: showTools ? LC.surfaceHover : 'transparent' }} className="hover:bg-white/10" title="Workflows & agents"><LayoutGrid size={16} /></button>
            <button
              onClick={() => setMode((m) => (m === 'ask' ? 'search' : 'ask'))}
              className="hover:bg-white/10"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 32, padding: '0 10px', borderRadius: 8, border: 'none', background: 'transparent', color: LC.muted, cursor: 'pointer', fontSize: 12.5, fontWeight: 550 }}
              title="Switch how Enter behaves"
            >
              {mode === 'ask' ? 'Ask' : <Search size={13} />}
              {mode === 'search' && 'Search'}
              <ChevronDown size={12} style={{ opacity: 0.6 }} />
            </button>

            <div style={{ flex: 1 }} />

            <button
              onClick={busy && props.onStop ? props.onStop : send}
              disabled={!busy && !ready}
              aria-label={busy ? 'Stop' : 'Send'}
              style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: ready || busy ? LC.text : LC.surfaceHover, border: 'none', cursor: ready || (busy && props.onStop) ? 'pointer' : 'default', display: 'grid', placeItems: 'center', transition: 'all 140ms ease', color: ready || busy ? LC.bg : LC.muted }}
            >
              {busy && props.onStop ? <Square size={13} fill="currentColor" /> : <ArrowUp size={18} strokeWidth={2.4} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Shared styles: LibreChat dark rows + CopilotKit overrides ──────────────────
export function AsideThreadStyles() {
  return (
    <style>{`
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
