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
// CopilotKit 1.63 note: the live messages + writers live on `useCopilotChatInternal`
// (the same hook react-ui renders from). The legacy `useCopilotChat().visibleMessages`
// is undefined here (renamed to `.messages`), and `useCopilotMessagesContext()` is an
// empty vestigial store — using either meant the autosave never saw any messages.
//
// Ordinary autosave is best-effort. Background delegation requires a confirmed
// save, and restoring an existing thread blocks chat until it loads or is abandoned.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from 'react';
import { useCopilotChatInternal } from '@copilotkit/react-core';
import { useAgent, useCopilotKit } from '@copilotkit/react-core/v2';
import { useAtom, useStore } from 'jotai';
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
  selectAgent: (agent: ChatAgent) => boolean;
  agentSelectionDisabled: boolean;
};

export function useChatPersistence(): ChatPersistence {
  const store = useStore();
  const [workflowBinding, setWorkflowBinding] = useAtom(chatSessionAtom);
  const { messages, isLoading, reset, setMessages, stopGeneration, agent } =
    useCopilotChatInternal() as unknown as ChatInternal;
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
  const [restoreError, setRestoreError] = useState('');
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
    if (authFailedRef.current) return false;
    const complete = projectCompleteMessages(messagesRef.current ?? []);
    const binding = store.get(chatSessionAtom);
    if (complete.length === 0 && !binding) return true;

    // Mint a thread id on the first save of a fresh conversation.
    let id = activeIdRef.current;
    if (!id) {
      id = generateId();
      activeIdRef.current = id;
      setActiveThreadId(id);
    }

    const projected = tagChatAgent(
      withWorkflowBinding(complete, id, binding),
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
            withWorkflowBinding(projected, id, store.get(chatSessionAtom)),
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
    if ((messagesRef.current?.length ?? 0) === 0 && !workflowBinding) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void doSave();
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [signature, isLoading, restoring, restoreError, workflowBinding, chatAgent]);

  const loadThread = useCallback(
    async (id: string): Promise<boolean> => {
      const generation = ++threadGeneration.current;
      switchingRef.current = true;
      setAwaitingAgentThread(null);
      if (timerRef.current) clearTimeout(timerRef.current);
      setRestoring(true);
      setRestoreError('');
      try {
        if (!restoring && !restoreError && !(await doSave())) return false;
        await stopChatBeforeSwitch({ stopGeneration, agent });
        if (generation !== threadGeneration.current) return false;
        const res = await apiFetch(`/api/chat/threads/${encodeURIComponent(id)}`, {
          signal: AbortSignal.timeout(20_000),
        });
        if (!res.ok)
          throw new Error('This saved chat could not be opened. Retry or start a new chat.');
        const data = (await res.json()) as {
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
        // Keep this chat's computer tasks accessible even if model discovery
        // failed. A provisional SDK agent cannot safely own restored messages.
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
        if (generation === threadGeneration.current) {
          switchingRef.current = false;
          setRestoring(false);
        }
      }
    },
    [
      setActiveThreadId,
      setChatAgent,
      stopGeneration,
      agent,
      store,
      setWorkflowBinding,
      doSave,
      restoring,
      restoreError,
    ],
  );

  const startNewThread = useCallback(async () => {
    const generation = ++threadGeneration.current;
    switchingRef.current = true;
    setAwaitingAgentThread(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    setRestoring(true);
    setRestoreError('');
    try {
      if (!restoring && !restoreError && !(await doSave())) return false;
      await stopChatBeforeSwitch({ stopGeneration, agent });
      if (generation !== threadGeneration.current) return false;
      reset();
      messagesRef.current = [];
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
      return true;
    } catch {
      if (generation === threadGeneration.current)
        setRestoreError('The previous reply could not be stopped. Retry opening a new chat.');
      return false;
    } finally {
      if (generation === threadGeneration.current) {
        switchingRef.current = false;
        setRestoring(false);
      }
    }
  }, [
    reset,
    setActiveThreadId,
    stopGeneration,
    agent,
    store,
    setWorkflowBinding,
    doSave,
    restoring,
    restoreError,
  ]);

  const initialRestorePhase = useRef<'pending' | 'unavailable' | 'ready'>('pending');
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
    } else if (runtimeStatus === 'error' && initialRestorePhase.current === 'pending') {
      initialRestorePhase.current = 'unavailable';
      void loadThread(initialThread.current);
    }
  }, [loadThread, agentReady, runtimeStatus, awaitingAgentThread]);

  useEffect(() => {
    if (!initialThread.current || agentReady || runtimeStatus === 'error') return;
    const timeout = setTimeout(() => {
      if (activeIdRef.current !== initialThread.current) return;
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
    selectAgent,
    agentSelectionDisabled: isLoading || restoring || !!restoreError,
  };
}
