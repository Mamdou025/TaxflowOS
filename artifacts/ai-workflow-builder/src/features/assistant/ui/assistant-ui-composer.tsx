import {
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { AttachmentPrimitive, ComposerPrimitive, useAui, useAuiState } from '@assistant-ui/react';
import {
  ArrowRight,
  ArrowUp,
  ChevronDown,
  ExternalLink,
  Paperclip,
  Play,
  Plus,
  Search,
  Sparkles,
  Square,
  Table2,
  Workflow,
  X,
} from 'lucide-react';
import { useAtom } from 'jotai';
import { ScopeMark } from '@/components/scope-orb';
import { detectComposerIntent } from '@/lib/composer-intent';
import { SINA } from '@/lib/coworkers';
import { LC } from '@/lib/librechat-theme';
import { MkoroComputerSettings } from '../mkoro/mkoro-panel';
import { selectedChatWorkflowAtom } from '../runtime/chat/source-selection';
import { AsideComposerContext, type ComposerSuggestion } from '../workspace/composer-context';
import { ChatSourcePicker } from './chat-source-picker';
import { ComposerAgentMenu, ComposerAttachmentMenu } from './composer-menus';
import { CoworkerAvatar } from './coworker-avatar';
import { ToolsMenu } from './tools-menu';

const ACCENT = 'var(--sx-accent)';
const popoverStyle: CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 'calc(100% + 8px)',
  zIndex: 20,
  background: LC.surface,
  border: `1px solid ${LC.border}`,
  borderRadius: 14,
  boxShadow: LC.shadowOut,
  overflow: 'hidden',
  maxHeight: 320,
  overflowY: 'auto',
};
const squareButton: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 36,
  height: 36,
  borderRadius: 10,
  border: `1px solid ${LC.borderSubtle}`,
  background: 'transparent',
  color: LC.muted,
  cursor: 'pointer',
  flexShrink: 0,
};
const sendButton: CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 12,
  flexShrink: 0,
  background: LC.text,
  boxShadow: '0 4px 14px rgba(32,39,53,0.22)',
  border: 'none',
  cursor: 'pointer',
  display: 'grid',
  placeItems: 'center',
  color: '#fff',
};

function ComposerAttachment() {
  return (
    <AttachmentPrimitive.Root
      className="inline-flex max-w-56 items-center gap-1.5 rounded-full border px-2 py-1 text-xs"
      style={{ background: LC.surfaceHover, borderColor: LC.border, color: LC.text }}
    >
      <span className="truncate">
        <AttachmentPrimitive.Name />
      </span>
      <AttachmentPrimitive.Remove
        aria-label="Remove attachment"
        className="shrink-0"
        style={{ color: LC.muted }}
      >
        <X size={13} />
      </AttachmentPrimitive.Remove>
    </AttachmentPrimitive.Root>
  );
}

/** Taxflow controls around assistant-ui's single composer draft and attachment store. */
export function AssistantUIComposer() {
  const aui = useAui();
  const ctx = useContext(AsideComposerContext);
  const text = useAuiState((state) => state.composer.text);
  const attachmentCount = useAuiState((state) => state.composer.attachments.length);
  const hasSubmission = useAuiState((state) => state.composer.submission !== undefined);
  const canSend = useAuiState((state) => state.composer.canSend);
  const canCancel = useAuiState((state) => state.composer.canCancel);
  const running = useAuiState((state) => state.thread.isRunning);
  const disabled = useAuiState((state) => state.thread.isDisabled);
  const [active, setActive] = useState(-1);
  const [mode, setMode] = useState<'ask' | 'search'>('ask');
  const [showTools, setShowTools] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [openSection, setOpenSection] = useState<'workflows' | 'worksheets' | null>(null);
  const [interrupting, setInterrupting] = useState(false);
  const interruptPending = useRef(false);
  const mountGeneration = useRef(0);
  const currentConversationKey = useRef(ctx?.conversationKey);
  currentConversationKey.current = ctx?.conversationKey;
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [, setWorkflowScope] = useAtom(selectedChatWorkflowAtom);
  const busy = running || !!ctx?.replyPending;
  const attaching = !!ctx?.attaching || hasSubmission;
  const pending = !!ctx?.submissionPending || interrupting;
  // File preparation remains available without a model connection. The runtime
  // adapter gates the eventual message dispatch and restores unsent drafts.
  const waitingForAgent = ctx?.agentReady === false && attachmentCount === 0;
  const ready = canSend && !pending && !attaching && !disabled && !waitingForAgent;
  const controlsDisabled = busy || attaching || pending || disabled;
  const armedTool = ctx?.armedTool;
  const intent =
    mode === 'ask' && !armedTool && !text.startsWith('@') ? detectComposerIntent(text) : null;
  const isAction = !!intent && intent.action !== 'answer';
  const VerbIcon =
    intent?.action === 'run' ? Play : intent?.action === 'open' ? ExternalLink : Sparkles;
  const commandMode = text.startsWith('@');
  const commandQuery = commandMode ? text.slice(1).trim().toLowerCase() : '';
  const palette = commandMode
    ? (ctx?.commands ?? []).filter(
        (item) =>
          !commandQuery ||
          `${item.title} ${item.sub} ${item.kind}`.toLowerCase().includes(commandQuery),
      )
    : text.trim()
      ? (ctx?.search?.(text) ?? [])
      : [];
  const showPalette = palette.length > 0;

  useEffect(() => {
    setActive(-1);
  }, [text]);
  useEffect(
    () => () => {
      mountGeneration.current += 1;
    },
    [],
  );

  const pick = (item: ComposerSuggestion) => {
    if (item.dim || controlsDisabled) return;
    aui.composer.setText('');
    setActive(-1);
    setShowTools(false);
    item.run();
    inputRef.current?.focus();
  };
  const interruptAndSend = async () => {
    if (!ready || interruptPending.current || !ctx?.onInterrupt) return;
    interruptPending.current = true;
    setInterrupting(true);
    const generation = mountGeneration.current;
    const conversationKey = currentConversationKey.current;
    try {
      await ctx.onInterrupt();
      if (
        generation !== mountGeneration.current ||
        conversationKey !== currentConversationKey.current
      )
        return;
      // Native Send intentionally blocks a running thread without a queue. After
      // the application's stop barrier, use the same library-owned composer.
      aui.composer.send();
    } catch (error) {
      if (
        generation === mountGeneration.current &&
        conversationKey === currentConversationKey.current
      )
        ctx.onAttachmentError?.(error);
    } finally {
      interruptPending.current = false;
      if (generation === mountGeneration.current) setInterrupting(false);
    }
  };
  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.nativeEvent.isComposing || event.keyCode === 229) return;
    if (showPalette && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      event.preventDefault();
      setActive((index) =>
        event.key === 'ArrowDown'
          ? (index + 1) % palette.length
          : (index - 1 + palette.length) % palette.length,
      );
      return;
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      if (showPalette && (active >= 0 || commandMode || mode === 'search')) {
        event.preventDefault();
        pick(palette[active >= 0 ? active : 0]);
      } else if (busy) {
        event.preventDefault();
        void interruptAndSend();
      } else if (pending || attaching) event.preventDefault();
      // Idle Enter and Shift+Enter stay owned by ComposerPrimitive.Input.
    }
    if (event.key === 'Escape') {
      setActive(-1);
      setShowTools(false);
      ctx?.setArmedTool?.(null);
    }
  };
  const addFiles = async (files: File[]) => {
    for (const file of files) {
      try {
        await aui.composer.addAttachment(file);
      } catch (error) {
        ctx?.onAttachmentError?.(error);
      }
    }
  };
  const closeMenu = () => {
    setShowTools(false);
    setOpenSection(null);
  };
  const menuSection = (
    id: 'workflows' | 'worksheets',
    icon: ReactNode,
    title: string,
    sub: string,
    items: ComposerSuggestion[],
  ) => (
    <div>
      <button
        type="button"
        onClick={() => setOpenSection(openSection === id ? null : id)}
        className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left hover:bg-black/5"
        aria-expanded={openSection === id}
      >
        <span style={{ color: LC.muted }}>{icon}</span>
        <span className="min-w-0 flex-1">
          <span className="block text-[13px] font-semibold" style={{ color: LC.title }}>
            {title}
          </span>
          <span className="block text-xs" style={{ color: LC.muted }}>
            {sub}
          </span>
        </span>
        <ChevronDown
          size={14}
          style={{ color: LC.muted, transform: openSection === id ? 'rotate(180deg)' : undefined }}
        />
      </button>
      {openSection === id &&
        items.map((item) => (
          <button
            key={item.key}
            type="button"
            disabled={item.dim || controlsDisabled}
            onClick={() => {
              if (controlsDisabled) return;
              item.run();
              closeMenu();
            }}
            className="flex w-full items-center gap-2.5 py-2 pl-10 pr-3.5 text-left text-xs hover:bg-black/5 disabled:opacity-50"
            style={{ color: LC.title }}
          >
            {item.icon}
            <span className="truncate">
              {item.title}
              {item.dim ? ' · soon' : ''}
            </span>
          </button>
        ))}
      {openSection === id && !items.length && (
        <p className="py-2 pl-10 text-xs" style={{ color: LC.muted }}>
          None available
        </p>
      )}
    </div>
  );
  const sendLabel = busy
    ? 'Interrupt reply and send'
    : ready && isAction && intent
      ? intent.sendLabel
      : 'Send';

  return (
    <div className="relative px-2 pb-4 pt-2 md:px-4" data-assistant-ui-composer>
      {ctx?.error && (
        <p role="alert" className="mb-2 text-sm text-destructive">
          {ctx.error}
        </p>
      )}
      <ChatSourcePicker
        disabled={controlsDisabled}
        open={showSources}
        onOpenChange={setShowSources}
      />
      <div className="relative">
        {showPalette && (
          <div style={popoverStyle} aria-label={commandMode ? 'Commands' : 'Workspace suggestions'}>
            {commandMode && (
              <p
                className="px-3.5 pb-1 pt-2 text-[10px] font-semibold uppercase"
                style={{ color: LC.muted }}
              >
                Commands · type to filter
              </p>
            )}
            {palette.map((item, index) => (
              <button
                key={item.key}
                type="button"
                disabled={item.dim || controlsDisabled}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => pick(item)}
                onMouseEnter={() => setActive(index)}
                className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left disabled:opacity-50"
                style={{ background: index === active ? LC.surfaceHover : 'transparent' }}
              >
                <span style={{ color: LC.muted }}>{item.icon}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold" style={{ color: LC.title }}>
                    {item.title}
                    {item.dim ? ' · soon' : ''}
                  </span>
                  <span className="block text-xs" style={{ color: LC.muted }}>
                    {item.sub}
                  </span>
                </span>
                <span className="text-[10px] uppercase" style={{ color: LC.muted }}>
                  {item.kind}
                </span>
              </button>
            ))}
          </div>
        )}
        {showTools && !showPalette && (
          <>
            <div onMouseDown={closeMenu} className="fixed inset-0 z-[19]" />
            <div style={popoverStyle}>
              <button
                type="button"
                onClick={() => {
                  setMode((value) => (value === 'search' ? 'ask' : 'search'));
                  closeMenu();
                  inputRef.current?.focus();
                }}
                className="flex w-full items-center gap-2.5 px-3.5 py-3 text-left hover:bg-black/5"
                style={{ color: mode === 'search' ? ACCENT : LC.title }}
              >
                <Search size={15} />
                <span className="flex-1">
                  <span className="block text-[13px] font-semibold">Search</span>
                  <span className="block text-xs" style={{ color: LC.muted }}>
                    Find worksheets, workflows and fields
                  </span>
                </span>
                {mode === 'search' && <span className="text-xs">On</span>}
              </button>
              {menuSection(
                'workflows',
                <Workflow size={15} />,
                'Workflows',
                'Start a guided workflow',
                (ctx?.tools ?? []).filter((item) => item.kind === 'workflow'),
              )}
              {menuSection(
                'worksheets',
                <Table2 size={15} />,
                'Worksheets',
                'Open a worksheet beside chat',
                (ctx?.commands ?? []).filter(
                  (item) => item.kind === 'open' && item.key !== 'cmd:open-builder',
                ),
              )}
            </div>
          </>
        )}
        {armedTool && (
          <div
            className="lc-ribbon mx-2 mb-3 flex items-center gap-2 rounded-2xl px-3 py-2"
            style={{ background: LC.surface, boxShadow: LC.shadowSm }}
          >
            <span
              className="inline-flex items-center gap-1.5 text-xs font-bold"
              style={{ color: ACCENT }}
            >
              <Sparkles size={14} />
              {armedTool.label}
            </span>
            <span className="min-w-0 flex-1 truncate text-xs" style={{ color: LC.muted }}>
              Your next message runs this tool
            </span>
            <button
              type="button"
              onClick={() => ctx?.setArmedTool?.(null)}
              aria-label="Cancel armed tool"
              title="Cancel (Esc)"
              style={{ color: LC.muted }}
            >
              <X size={14} />
            </button>
          </div>
        )}
        {isAction && intent && (
          <div
            className="lc-ribbon mx-2 mb-3 flex flex-wrap items-center gap-2 rounded-2xl px-3 py-2 text-xs"
            style={{ background: LC.surface, boxShadow: LC.shadowSm, color: LC.body }}
          >
            <span className="inline-flex items-center gap-1.5 font-bold" style={{ color: ACCENT }}>
              <VerbIcon size={15} />
              {intent.verb}
            </span>
            <ArrowRight size={14} style={{ color: LC.faint }} />
            {intent.action === 'run' ? (
              <CoworkerAvatar coworker={SINA} size={22} />
            ) : (
              <ScopeMark size={22} />
            )}
            <span>
              {intent.action === 'run' ? (
                <>
                  <b>Sina</b> runs {intent.target ?? 'it'}
                </>
              ) : intent.action === 'open' ? (
                <>
                  <b>Scope</b> opens it beside the chat
                </>
              ) : (
                <>
                  <b>Scope</b> builds it in the chat
                </>
              )}
            </span>
            {intent.action === 'run' && (
              <span className="ml-auto" style={{ color: LC.muted }}>
                you Start it before it runs
              </span>
            )}
          </div>
        )}
        <div
          className="lc-console relative flex flex-col gap-2.5 rounded-3xl border px-4 pb-3 pt-4"
          style={{ background: LC.surface, borderColor: LC.border }}
        >
          <ComposerPrimitive.Root
            className="flex flex-col gap-2.5"
            onSubmit={(event) => {
              if (pending || attaching || waitingForAgent) event.preventDefault();
              else if (busy) {
                event.preventDefault();
                void interruptAndSend();
              }
            }}
          >
            <input
              ref={fileRef}
              type="file"
              multiple
              hidden
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                event.target.value = '';
                void addFiles(files);
              }}
            />
            <ComposerPrimitive.Input
              ref={inputRef}
              aria-label="Ask Scope, or describe a task…"
              placeholder={
                armedTool
                  ? `${armedTool.label} — type your query…`
                  : mode === 'search'
                    ? 'Search worksheets, workflows, agents…'
                    : 'Ask Scope, or describe a task…'
              }
              onKeyDown={onKeyDown}
              cancelOnEscape={false}
              disabled={interrupting || disabled}
              minRows={1}
              maxRows={6}
              className="lc-textarea block w-full min-w-0 resize-none border-none bg-transparent px-0.5 py-0.5 text-base leading-normal outline-none"
              style={{ color: LC.text, fontFamily: 'inherit' }}
            />
            {attachmentCount > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span
                  className="inline-flex items-center gap-1 text-xs font-semibold"
                  style={{ color: LC.muted }}
                >
                  <Paperclip size={12} />
                  {attachmentCount} attached
                </span>
                <ComposerPrimitive.Attachments>
                  {() => <ComposerAttachment />}
                </ComposerPrimitive.Attachments>
              </div>
            )}

            {attaching && (
              <span role="status" className="text-xs" style={{ color: LC.body }}>
                Reading your document…
              </span>
            )}
          </ComposerPrimitive.Root>
          {/* Keep application menus outside the form: their buttons do not submit chat. */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setShowTools((value) => !value);
                setOpenSection(null);
              }}
              style={{ ...squareButton, color: mode === 'search' ? ACCENT : LC.muted }}
              className="hover:bg-black/5"
              title="Add — search, run a workflow, open a worksheet"
              aria-label="Add — search, workflows, worksheets"
              disabled={controlsDisabled}
            >
              <Plus size={18} />
            </button>
            <ComposerAttachmentMenu
              disabled={controlsDisabled}
              onUpload={() => fileRef.current?.click()}
              onSources={() => setShowSources(true)}
              onWorkflow={setWorkflowScope}
            />
            <ComposerAgentMenu
              onCustomize={ctx?.onCustomizeAgent}
              onAgentChange={ctx?.onAgentChange}
              selectionDisabled={ctx?.agentSelectionDisabled || controlsDisabled}
              disabledReason={
                attaching ? 'Finish attaching your files before switching agents.' : undefined
              }
            />
            <MkoroComputerSettings presentation="composer" />
            <ToolsMenu
              compact
              panelSide="top"
              onRunResult={ctx?.onRunResult}
              onAsk={ctx?.onSend}
              onArm={ctx?.setArmedTool}
            />
            <span className="flex-1" />
            {canCancel && (
              <ComposerPrimitive.Cancel aria-label="Stop" title="Stop" style={sendButton}>
                <Square size={14} fill="currentColor" />
              </ComposerPrimitive.Cancel>
            )}
            {busy && ready ? (
              <button
                type="button"
                aria-label="Interrupt reply and send"
                title="Interrupt reply and send"
                disabled={!ready || !ctx?.onInterrupt}
                onClick={() => void interruptAndSend()}
                className="disabled:opacity-40"
                style={sendButton}
              >
                <ArrowUp size={17} />
              </button>
            ) : (
              !busy && (
                <ComposerPrimitive.Send
                  aria-label={sendLabel}
                  title={sendLabel}
                  disabled={!ready}
                  className="disabled:opacity-40"
                  style={sendButton}
                >
                  {ready && isAction ? <VerbIcon size={16} /> : <ArrowUp size={17} />}
                </ComposerPrimitive.Send>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
