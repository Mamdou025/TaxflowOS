import { apiFetch } from '@/platform/auth/api-fetch';

// ─────────────────────────────────────────────────────────────────────────────
// useChatPersistence — the client half of "save chats".
//
// Additive layer over CopilotKit: it observes the live conversation and autosaves
// a serializable projection to /api/chat/threads/:id/messages after each turn, and
// can restore a saved thread back into the chat. CopilotKit's AG-UI agent owns
// the message store; navigation stops its current reply before replacing history.
//
//   • autosave  — debounced, fires when a turn settles (isLoading false)
//   • restore   — loadThread(id) → setMessages(reconstructed AG-UI messages)
//   • new chat  — startNewThread() → reset() clears the store; next msg opens a fresh thread
//
// The assistant's single connection owner supplies its live AG-UI messages and
// writers. This observer must not mount another useCopilotChatInternal: every
// instance opens/reconnects the same agent stream, even when used only for reads.
//
// Ordinary autosave is best-effort. Background delegation requires a confirmed
// save, and restoring an existing thread blocks chat until it loads or is abandoned.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from 'react';
import type { useCopilotChatInternal } from '@copilotkit/react-core';
import { useAgent, useCopilotKit } from '@copilotkit/react-core/v2';
import { useAtom, useAtomValue, useStore } from 'jotai';
import {
  emptyChatContext,
  hasChatContext,
  readChatContext,
  withChatContext,
} from './chat-context-model';
import { chatContextAtom, beginChatContextSwitch, restoreChatContext } from './chat-context-store';
import {
  activeSessionAtom,
  chatSessionAtom,
  chatMessageAnchorAtom,
  workflowInspectionAtom,
} from '@/features/workflows-hub/workflow-session-store';
import {
  readWorkflowBinding,
  withWorkflowBinding,
  workflowAnchorForMessages,
} from './workflow-binding';
import { activeChatThreadIdAtom, chatAgentAtom, type ChatAgent } from '@/shared/stores/chat-store';
import {
  chatAuthorsAtom,
  originalChatAgentAtom,
  readChatAgent,
  readChatAuthors,
  readOriginalChatAgent,
  rememberChatAuthors,
  tagChatAgent,
} from './chat-agent';
import { generateId } from '@/lib/utils/id';
import {
  type AguiMessage,
  messagesSignature,
  projectMessages,
  projectCompleteMessages,
  reconstructMessages,
} from './message-codec';
import { assertCurrentChatRequest, stopChatBeforeSwitch } from './chat-switch';
import { createChatTransition } from './chat-transition';

const SAVE_DEBOUNCE_MS = 900;

// The subset of useCopilotChatInternal we use. Typed loosely: this is CopilotKit's
// "internal" hook, so we pin the shape we depend on rather than its full surface.
type ChatInternal = {
  messages: AguiMessage[];
  isLoading: boolean;
  reset: () => void;
  setMessages: (messages: AguiMessage[]) => void;
  stopGeneration: () => void;
  agent?: { detachActiveRun: () => Promise<void>; messages?: AguiMessage[]; isRunning?: boolean };
};

function deriveTitle(messages: ReturnType<typeof projectMessages>): string | null {
  const firstUser = messages.find((m) => m.role === 'user' && m.content.text);
  const text = firstUser?.content.text?.trim();
  if (!text) return null;
  return text.length > 60 ? `${text.slice(0, 57)}…` : text;
}

export type ChatPersistence = {
  activeThreadId: string | null;
  saving: boolean;
  saveError: string;
  /** Restore a saved thread into the chat. Returns true if it loaded. */
  loadThread: (id: string) => Promise<boolean>;
  /** Clear the chat; the next message starts a fresh saved thread. */
  startNewThread: () => Promise<boolean>;
  /** Persist the current conversation before binding a background computer task. */
  ensureThread: (expectedUserMessageId: string) => Promise<string>;
  restoring: boolean;
  restoreError: string;
  restoreThreadId: string | null;
  selectAgent: (agent: ChatAgent) => boolean;
  agentSelectionDisabled: boolean;
};

export function useChatPersistence(
  chat: ReturnType<typeof useCopilotChatInternal>,
): ChatPersistence {
  const store = useStore();
  const [workflowBinding, setWorkflowBinding] = useAtom(chatSessionAtom);
  const context = useAtomValue(chatContextAtom);
  const contextSignature = JSON.stringify(context);
  const { messages, isLoading, reset, setMessages, stopGeneration, agent } =
    chat as unknown as ChatInternal;
  const { isReady: agentReady } = useAgent();
  const { copilotkit } = useCopilotKit();
  const runtimeStatus = copilotkit.runtimeConnectionStatus;
  const readyChatRef = useRef(agentReady ? { setMessages } : null);
  readyChatRef.current = agentReady ? { setMessages } : null;
  const [activeThreadId, setActiveThreadId] = useAtom(activeChatThreadIdAtom);
  const [chatAgent, setChatAgent] = useAtom(chatAgentAtom);
  const chatAgentRef = useRef(chatAgent);
  chatAgentRef.current = chatAgent;
  const originalAgentRef = useRef(store.get(originalChatAgentAtom) ?? chatAgent);
  const loadingRef = useRef(isLoading);
  loadingRef.current = isLoading;
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const pendingSave = useRef<Promise<unknown>>(Promise.resolve());
  const initialThread = useRef(activeThreadId);
  const [restoring, setRestoring] = useState(!!activeThreadId && !messages?.length);
  // Errors do not make outgoing history disposable. Only save when the message
  // store belongs to this active ID, never while its saved history is unhydrated.
  const canSaveConversation = useRef(!restoring);
  const [restoreError, setRestoreError] = useState('');
  const [restoreThreadId, setRestoreThreadId] = useState(activeThreadId);
  const [awaitingAgentThread, setAwaitingAgentThread] = useState<string | null>(null);

  // Refs so the debounced effect always sees current values without re-subscribing.
  const activeIdRef = useRef(activeThreadId);
  activeIdRef.current = activeThreadId;
  const messagesRef = useRef<AguiMessage[]>(messages ?? []);
  messagesRef.current = messages ?? [];
  const agentRef = useRef(agent);
  agentRef.current = agent;
  useEffect(() => {
    const anchor = {
      read: () => workflowAnchorForMessages(agentRef.current?.messages ?? messagesRef.current),
    };
    store.set(chatMessageAnchorAtom, anchor);
    return () => {
      if (store.get(chatMessageAnchorAtom) === anchor) store.set(chatMessageAnchorAtom, null);
    };
  }, [store]);
  const hydratingRef = useRef(false); // suppress the save that a restore would trigger
  const authFailedRef = useRef(false); // stop hammering the API once it 401s
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const threadGeneration = useRef(0);
  const switchingRef = useRef(false);
  const transitionRef = useRef<ReturnType<typeof createChatTransition> | null>(null);
  const initialRestorePhase = useRef<'pending' | 'unavailable' | 'ready'>('pending');
  useEffect(
    () => () => {
      threadGeneration.current++;
      transitionRef.current?.cancel();
      if (timerRef.current) clearTimeout(timerRef.current);
      initialRestorePhase.current = 'pending';
    },
    [],
  );

  const signature = messagesSignature(messages ?? []);

  const captureAuthors = useCallback(() => {
    const authors = rememberChatAuthors(
      agentRef.current?.messages ?? messagesRef.current,
      store.get(chatAuthorsAtom),
      chatAgentRef.current,
    );
    store.set(chatAuthorsAtom, authors);
    store.set(originalChatAgentAtom, originalAgentRef.current);
    return authors;
  }, [store]);

  useEffect(() => {
    if (!restoring && !restoreError) captureAuthors();
  }, [signature, restoring, restoreError, captureAuthors]);

  const selectAgent = useCallback(
    (next: ChatAgent): boolean => {
      if (next === chatAgentRef.current) return true;
      if (
        switchingRef.current ||
        loadingRef.current ||
        agentRef.current?.isRunning ||
        restoring ||
        restoreError
      )
        return false;
      // Freeze the settled turn before changing the provider header. Neither the
      // transcript, workflow binding nor outstanding approval requests is replaced.
      captureAuthors();
      if (!messagesRef.current.length && !activeIdRef.current) {
        originalAgentRef.current = next;
        store.set(originalChatAgentAtom, next);
      }
      chatAgentRef.current = next;
      setChatAgent(next);
      return true;
    },
    [captureAuthors, restoring, restoreError, setChatAgent, store],
  );

  const doSave = useCallback(async () => {
    if (authFailedRef.current || !canSaveConversation.current) return false;
    const complete = projectCompleteMessages(messagesRef.current ?? []);
    const binding = store.get(chatSessionAtom);
    const context = store.get(chatContextAtom);
    if (complete.length === 0 && !binding && !hasChatContext(context)) return true;

    // Mint a thread id on the first save of a fresh conversation.
    let id = activeIdRef.current;
    if (!id) {
      id = generateId();
      activeIdRef.current = id;
      setActiveThreadId(id);
    }

    const projected = tagChatAgent(
      withChatContext(withWorkflowBinding(complete, id, binding), id, context),
      chatAgentRef.current,
      originalAgentRef.current,
      captureAuthors(),
    );
    const previous = pendingSave.current;
    let release!: () => void;
    pendingSave.current = new Promise<void>((resolve) => {
      release = resolve;
    });
    await previous;
    setSaving(true);
    try {
      const res = await apiFetch(`/api/chat/threads/${id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: projected,
          title: deriveTitle(projected) ?? (binding ? 'Workflow conversation' : null),
        }),
        signal: AbortSignal.timeout(20_000),
      });
      if (res.status === 401) authFailedRef.current = true;
      if (!res.ok) throw new Error('Chat save failed.');
      setSaveError('');
      return true;
    } catch {
      setSaveError(
        'This conversation and its workflow link could not be saved. Keep this chat open and retry after the connection recovers.',
      );
      return false;
    } finally {
      setSaving(false);
      release();
    }
  }, [setActiveThreadId, store, captureAuthors]);

  const ensureThread = useCallback(
    async (expectedUserMessageId: string): Promise<string> => {
      if (switchingRef.current)
        throw new Error('The chat is changing. No computer task was delegated.');
      assertCurrentChatRequest(messagesRef.current, expectedUserMessageId);
      const projected = tagChatAgent(
        projectCompleteMessages(messagesRef.current ?? []),
        chatAgentRef.current,
        originalAgentRef.current,
        captureAuthors(),
      );
      if (
        !projected.some(
          (message) => message.role === 'user' && message.id === expectedUserMessageId,
        )
      )
        throw new Error(
          'The request is not part of a complete conversation yet. No computer task was delegated.',
        );
      const generation = threadGeneration.current;
      let id = activeIdRef.current;
      if (!id) {
        id = generateId();
        activeIdRef.current = id;
        setActiveThreadId(id);
      }
      const response = await apiFetch(`/api/chat/threads/${encodeURIComponent(id)}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: tagChatAgent(
            withChatContext(
              withWorkflowBinding(projected, id, store.get(chatSessionAtom)),
              id,
              store.get(chatContextAtom),
            ),
            chatAgentRef.current,
            originalAgentRef.current,
            store.get(chatAuthorsAtom),
          ),
          title: deriveTitle(projected),
        }),
        signal: AbortSignal.timeout(20_000),
      });
      if (!response.ok)
        throw new Error('The conversation could not be saved. No computer task was delegated.');
      if (generation !== threadGeneration.current || activeIdRef.current !== id)
        throw new Error(
          'The chat changed before delegation. Submit the request in the intended chat.',
        );
      assertCurrentChatRequest(messagesRef.current, expectedUserMessageId);
      return id;
    },
    [setActiveThreadId, store, captureAuthors],
  );

  // Debounced autosave: wait until a turn has settled, then persist.
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the message signature + loading
  useEffect(() => {
    if (restoring || restoreError) return;
    if (hydratingRef.current) {
      hydratingRef.current = false;
      return;
    }
    if (isLoading) return;
    if ((messagesRef.current?.length ?? 0) === 0 && !workflowBinding && !hasChatContext(context))
      return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void doSave();
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [signature, contextSignature, isLoading, restoring, restoreError, workflowBinding, chatAgent]);

  const loadThread = useCallback(
    async (id: string): Promise<boolean> => {
      initialRestorePhase.current = 'ready';
      transitionRef.current?.cancel();
      const transition = createChatTransition(
        'Opening your saved chat took too long. Your conversation is unchanged. Retry or start a new chat.',
      );
      transitionRef.current = transition;
      const generation = ++threadGeneration.current;
      switchingRef.current = true;
      beginChatContextSwitch(store);
      setAwaitingAgentThread(null);
      if (timerRef.current) clearTimeout(timerRef.current);
      setRestoring(true);
      setRestoreError('');
      setRestoreThreadId(id);
      try {
        if (canSaveConversation.current && !(await transition.wait(doSave))) return false;
        await transition.wait(() => stopChatBeforeSwitch({ stopGeneration, agent }));
        if (generation !== threadGeneration.current) return false;
        const res = await transition.wait(() =>
          apiFetch(`/api/chat/threads/${encodeURIComponent(id)}`, { signal: transition.signal }),
        );
        if (!res.ok)
          throw new Error('This saved chat could not be opened. Retry or start a new chat.');
        const data = (await transition.wait(() => res.json())) as {
          messages?: { id: string; role: string; seq: number; content: unknown }[];
        };
        const rows = (data.messages ?? []).map((m) => ({
          id: m.id,
          role: m.role as 'user' | 'assistant' | 'tool' | 'system',
          seq: m.seq,
          content: (m.content ?? {}) as {
            text?: string;
            toolCall?: { name: string; args?: unknown; result?: unknown; callId?: string };
          },
        }));
        if (generation !== threadGeneration.current) return false;
        const restoredContext = readChatContext(rows);
        // Keep this chat's computer tasks accessible even if model discovery
        // failed. A provisional SDK agent cannot safely own restored messages.
        canSaveConversation.current = false;
        activeIdRef.current = id;
        const restoredAgent = readChatAgent(rows);
        const restoredAuthors = readChatAuthors(rows);
        originalAgentRef.current = readOriginalChatAgent(rows);
        store.set(originalChatAgentAtom, originalAgentRef.current);
        const restoredBinding = readWorkflowBinding(rows);
        chatAgentRef.current = restoredAgent;
        setChatAgent(restoredAgent);
        store.set(chatAuthorsAtom, restoredAuthors);
        setActiveThreadId(id);
        setWorkflowBinding(restoredBinding);
        store.set(activeSessionAtom, restoredBinding);
        store.set(workflowInspectionAtom, null);
        restoreChatContext(store, restoredContext);
        const readyChat = readyChatRef.current;
        const restored = reconstructMessages(rows);
        if (!readyChat && restored.length > 0) {
          setAwaitingAgentThread(id);
          throw new Error(
            'Sina is unavailable. Your saved chat is unchanged and its computer tasks remain available. Retry opening the chat after the connection recovers.',
          );
        }
        hydratingRef.current = true;
        authFailedRef.current = false;
        (readyChat?.setMessages ?? setMessages)(restored);
        messagesRef.current = restored;
        canSaveConversation.current = true;
        setRestoreThreadId(null);
        return true;
      } catch (cause) {
        if (generation === threadGeneration.current) {
          hydratingRef.current = false;
          setRestoreError(
            cause instanceof Error ? cause.message : 'This saved chat could not be opened.',
          );
        }
        return false;
      } finally {
        transition.finish();
        if (generation === threadGeneration.current) {
          switchingRef.current = false;
          setRestoring(false);
        }
      }
    },
    [setActiveThreadId, setChatAgent, stopGeneration, agent, store, setWorkflowBinding, doSave],
  );

  const startNewThread = useCallback(async () => {
    initialRestorePhase.current = 'ready';
    transitionRef.current?.cancel();
    const transition = createChatTransition(
      'The previous reply could not be stopped in time. Your conversation is unchanged. Retry starting a new chat.',
    );
    transitionRef.current = transition;
    const generation = ++threadGeneration.current;
    switchingRef.current = true;
    beginChatContextSwitch(store);
    setAwaitingAgentThread(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    setRestoring(true);
    setRestoreError('');
    setRestoreThreadId(null);
    try {
      if (canSaveConversation.current && !(await transition.wait(doSave))) return false;
      await transition.wait(() => stopChatBeforeSwitch({ stopGeneration, agent }));
      if (generation !== threadGeneration.current) return false;
      reset();
      messagesRef.current = [];
      canSaveConversation.current = true;
      store.set(chatAuthorsAtom, {});
      originalAgentRef.current = chatAgentRef.current;
      store.set(originalChatAgentAtom, originalAgentRef.current);
      authFailedRef.current = false;
      activeIdRef.current = null;
      setActiveThreadId(null);
      setSaveError('');
      setWorkflowBinding(null);
      store.set(activeSessionAtom, null);
      store.set(workflowInspectionAtom, null);
      restoreChatContext(store, emptyChatContext());
      return true;
    } catch (cause) {
      if (generation === threadGeneration.current)
        setRestoreError(
          cause instanceof Error
            ? cause.message
            : 'The previous reply could not be stopped. Retry opening a new chat.',
        );
      return false;
    } finally {
      transition.finish();
      if (generation === threadGeneration.current) {
        switchingRef.current = false;
        setRestoring(false);
      }
    }
  }, [reset, setActiveThreadId, stopGeneration, agent, store, setWorkflowBinding, doSave]);

  useEffect(() => {
    if (agentReady && awaitingAgentThread && activeIdRef.current === awaitingAgentThread) {
      initialRestorePhase.current = 'ready';
      void loadThread(awaitingAgentThread);
      return;
    }
    if (!initialThread.current || initialRestorePhase.current === 'ready') return;
    if (activeIdRef.current !== initialThread.current) return;
    // Wait for the canonical agent: each SDK hook has its own temporary agent
    // before discovery, and those temporary message stores are discarded.
    if (agentReady) {
      initialRestorePhase.current = 'ready';
      if (messagesRef.current.length === 0) void loadThread(initialThread.current);
      else {
        canSaveConversation.current = true;
        setRestoring(false);
        setRestoreError('');
        setRestoreThreadId(null);
      }
    } else if (runtimeStatus === 'error' && initialRestorePhase.current === 'pending') {
      initialRestorePhase.current = 'unavailable';
      void loadThread(initialThread.current);
    }
  }, [loadThread, agentReady, runtimeStatus, awaitingAgentThread]);

  useEffect(() => {
    if (!initialThread.current || agentReady || runtimeStatus === 'error') return;
    const timeout = setTimeout(() => {
      if (
        activeIdRef.current !== initialThread.current ||
        initialRestorePhase.current !== 'pending'
      )
        return;
      setRestoring(false);
      setRestoreError(
        'Sina is taking too long to connect. Your saved chat is unchanged. Retry opening it after the connection recovers.',
      );
    }, 20_000);
    return () => clearTimeout(timeout);
  }, [agentReady, runtimeStatus]);

  return {
    activeThreadId,
    saving,
    saveError,
    loadThread,
    startNewThread,
    ensureThread,
    restoring,
    restoreError,
    restoreThreadId,
    selectAgent,
    agentSelectionDisabled: isLoading || restoring || !!restoreError,
  };
}
