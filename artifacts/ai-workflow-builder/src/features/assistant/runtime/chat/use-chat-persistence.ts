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

import { useCallback, useEffect, useRef, useState } from "react";
import { useCopilotChatInternal } from "@copilotkit/react-core";
import { useAgent, useCopilotKit } from "@copilotkit/react-core/v2";
import { useAtom } from "jotai";
import { activeChatThreadIdAtom } from "@/shared/stores/chat-store";
import { generateId } from "@/lib/utils/id";
import {
  type AguiMessage,
  messagesSignature,
  projectMessages,
  projectCompleteMessages,
  reconstructMessages,
} from "./message-codec";
import { assertCurrentChatRequest, stopChatBeforeSwitch } from "./chat-switch";

const SAVE_DEBOUNCE_MS = 900;

// The subset of useCopilotChatInternal we use. Typed loosely: this is CopilotKit's
// "internal" hook, so we pin the shape we depend on rather than its full surface.
type ChatInternal = {
  messages: AguiMessage[];
  isLoading: boolean;
  reset: () => void;
  setMessages: (messages: AguiMessage[]) => void;
  stopGeneration: () => void;
  agent?: { detachActiveRun: () => Promise<void> };
};

function deriveTitle(messages: ReturnType<typeof projectMessages>): string | null {
  const firstUser = messages.find((m) => m.role === "user" && m.content.text);
  const text = firstUser?.content.text?.trim();
  if (!text) return null;
  return text.length > 60 ? `${text.slice(0, 57)}…` : text;
}

export type ChatPersistence = {
  activeThreadId: string | null;
  saving: boolean;
  /** Restore a saved thread into the chat. Returns true if it loaded. */
  loadThread: (id: string) => Promise<boolean>;
  /** Clear the chat; the next message starts a fresh saved thread. */
  startNewThread: () => Promise<void>;
  /** Persist the current conversation before binding a background computer task. */
  ensureThread: (expectedUserMessageId: string) => Promise<string>;
  restoring: boolean;
  restoreError: string;
};

export function useChatPersistence(): ChatPersistence {
  const { messages, isLoading, reset, setMessages, stopGeneration, agent } =
    useCopilotChatInternal() as unknown as ChatInternal;
  const { isReady: agentReady } = useAgent();
  const { copilotkit } = useCopilotKit();
  const runtimeStatus = copilotkit.runtimeConnectionStatus;
  const readyChatRef = useRef(agentReady ? { setMessages } : null);
  readyChatRef.current = agentReady ? { setMessages } : null;
  const [activeThreadId, setActiveThreadId] = useAtom(activeChatThreadIdAtom);
  const [saving, setSaving] = useState(false);
  const initialThread = useRef(activeThreadId);
  const [restoring, setRestoring] = useState(!!activeThreadId && !(messages?.length));
  const [restoreError, setRestoreError] = useState("");
  const [awaitingAgentThread, setAwaitingAgentThread] = useState<string | null>(null);

  // Refs so the debounced effect always sees current values without re-subscribing.
  const activeIdRef = useRef(activeThreadId);
  activeIdRef.current = activeThreadId;
  const messagesRef = useRef<AguiMessage[]>(messages ?? []);
  messagesRef.current = messages ?? [];
  const hydratingRef = useRef(false); // suppress the save that a restore would trigger
  const authFailedRef = useRef(false); // stop hammering the API once it 401s
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const threadGeneration = useRef(0);
  const switchingRef = useRef(false);

  const signature = messagesSignature(messages ?? []);

  const doSave = useCallback(async () => {
    if (authFailedRef.current) return;
    const projected = projectCompleteMessages(messagesRef.current ?? []);
    if (projected.length === 0) return;

    // Mint a thread id on the first save of a fresh conversation.
    let id = activeIdRef.current;
    if (!id) {
      id = generateId();
      activeIdRef.current = id;
      setActiveThreadId(id);
    }

    setSaving(true);
    try {
      const res = await apiFetch(`/api/chat/threads/${id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: projected, title: deriveTitle(projected) }),
      });
      if (res.status === 401) authFailedRef.current = true;
    } catch {
      // fail-soft: keep the conversation working even if the save endpoint is down
    } finally {
      setSaving(false);
    }
  }, [setActiveThreadId]);

  const ensureThread = useCallback(async (expectedUserMessageId: string): Promise<string> => {
    if (switchingRef.current) throw new Error("The chat is changing. No computer task was delegated.");
    assertCurrentChatRequest(messagesRef.current, expectedUserMessageId);
    const projected = projectCompleteMessages(messagesRef.current ?? []);
    if (!projected.some((message) => message.role === "user" && message.id === expectedUserMessageId))
      throw new Error("The request is not part of a complete conversation yet. No computer task was delegated.");
    const generation = threadGeneration.current;
    let id = activeIdRef.current;
    if (!id) {
      id = generateId();
      activeIdRef.current = id;
      setActiveThreadId(id);
    }
    const response = await apiFetch(`/api/chat/threads/${encodeURIComponent(id)}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: projected, title: deriveTitle(projected) }),
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok)
      throw new Error("The conversation could not be saved. No computer task was delegated.");
    if (generation !== threadGeneration.current || activeIdRef.current !== id)
      throw new Error("The chat changed before delegation. Submit the request in the intended chat.");
    assertCurrentChatRequest(messagesRef.current, expectedUserMessageId);
    return id;
  }, [setActiveThreadId]);

  // Debounced autosave: wait until a turn has settled, then persist.
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the message signature + loading
  useEffect(() => {
    if (restoring || restoreError) return;
    if (hydratingRef.current) {
      hydratingRef.current = false;
      return;
    }
    if (isLoading) return;
    if ((messagesRef.current?.length ?? 0) === 0) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void doSave();
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [signature, isLoading, restoring, restoreError]);

  const loadThread = useCallback(
    async (id: string): Promise<boolean> => {
      const generation = ++threadGeneration.current;
      switchingRef.current = true;
      setAwaitingAgentThread(null);
      if (timerRef.current) clearTimeout(timerRef.current);
      setRestoring(true);
      setRestoreError("");
      try {
        await stopChatBeforeSwitch({ stopGeneration, agent });
        if (generation !== threadGeneration.current) return false;
        const res = await apiFetch(`/api/chat/threads/${encodeURIComponent(id)}`, {
          signal: AbortSignal.timeout(20_000),
        });
        if (!res.ok) throw new Error("This saved chat could not be opened. Retry or start a new chat.");
        const data = (await res.json()) as {
          messages?: { id: string; role: string; seq: number; content: unknown }[];
        };
        const rows = (data.messages ?? []).map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant" | "tool" | "system",
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
        setActiveThreadId(id);
        const readyChat = readyChatRef.current;
        if (!readyChat) {
          setAwaitingAgentThread(id);
          throw new Error("Sina is unavailable. Your saved chat is unchanged and its computer tasks remain available. Retry opening the chat after the connection recovers.");
        }
        hydratingRef.current = true;
        authFailedRef.current = false;
        const restored = reconstructMessages(rows);
        readyChat.setMessages(restored);
        messagesRef.current = restored;
        return true;
      } catch (cause) {
        if (generation === threadGeneration.current) {
          hydratingRef.current = false;
          setRestoreError(cause instanceof Error ? cause.message : "This saved chat could not be opened.");
        }
        return false;
      } finally {
        if (generation === threadGeneration.current) {
          switchingRef.current = false;
          setRestoring(false);
        }
      }
    },
    [setActiveThreadId, stopGeneration, agent]
  );

  const startNewThread = useCallback(async () => {
    const generation = ++threadGeneration.current;
    switchingRef.current = true;
    setAwaitingAgentThread(null);
    if (timerRef.current) clearTimeout(timerRef.current);
    setRestoring(true);
    setRestoreError("");
    try {
      await stopChatBeforeSwitch({ stopGeneration, agent });
      if (generation !== threadGeneration.current) return;
      reset();
      messagesRef.current = [];
      authFailedRef.current = false;
      activeIdRef.current = null;
      setActiveThreadId(null);
    } catch {
      if (generation === threadGeneration.current)
        setRestoreError("The previous reply could not be stopped. Retry opening a new chat.");
    } finally {
      if (generation === threadGeneration.current) {
        switchingRef.current = false;
        setRestoring(false);
      }
    }
  }, [reset, setActiveThreadId, stopGeneration, agent]);

  const initialRestorePhase = useRef<"pending" | "unavailable" | "ready">("pending");
  useEffect(() => {
    if (agentReady && awaitingAgentThread && activeIdRef.current === awaitingAgentThread) {
      initialRestorePhase.current = "ready";
      void loadThread(awaitingAgentThread);
      return;
    }
    if (!initialThread.current || initialRestorePhase.current === "ready") return;
    if (activeIdRef.current !== initialThread.current) return;
    // Wait for the canonical agent: each SDK hook has its own temporary agent
    // before discovery, and those temporary message stores are discarded.
    if (agentReady) {
      initialRestorePhase.current = "ready";
      if (messagesRef.current.length === 0) void loadThread(initialThread.current);
    } else if (runtimeStatus === "error" && initialRestorePhase.current === "pending") {
      initialRestorePhase.current = "unavailable";
      void loadThread(initialThread.current);
    }
  }, [loadThread, agentReady, runtimeStatus, awaitingAgentThread]);

  useEffect(() => {
    if (!initialThread.current || agentReady || runtimeStatus === "error") return;
    const timeout = setTimeout(() => {
      if (activeIdRef.current !== initialThread.current) return;
      setRestoreError("Sina is taking too long to connect. Your saved chat is unchanged. Retry opening it after the connection recovers.");
    }, 20_000);
    return () => clearTimeout(timeout);
  }, [agentReady, runtimeStatus]);

  return { activeThreadId, saving, loadThread, startNewThread, ensureThread, restoring, restoreError };
}
