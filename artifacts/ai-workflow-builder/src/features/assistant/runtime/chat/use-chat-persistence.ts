

// ─────────────────────────────────────────────────────────────────────────────
// useChatPersistence — the client half of "save chats".
//
// Additive layer over CopilotKit: it observes the live conversation and autosaves
// a serializable projection to /api/chat/threads/:id/messages after each turn, and
// can restore a saved thread back into CopilotKit. It does NOT change how the chat
// runs — the message store stays owned by CopilotKit.
//
//   • autosave  — debounced, fires when a turn settles (isLoading false)
//   • restore   — loadThread(id) → setMessages(reconstructed)
//   • new chat  — startNewThread() → clears the store, next message opens a fresh thread
//
// FAIL-SOFT: every network call is best-effort. No session / no DB → saves quietly
// no-op and the chat works exactly as before (unsaved).
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from "react";
import {
  useCopilotChat,
  useCopilotMessagesContext,
} from "@copilotkit/react-core";
import { useAtom } from "jotai";
import { activeChatThreadIdAtom } from "@/shared/stores/chat-store";
import { generateId } from "@/lib/utils/id";
import {
  messagesSignature,
  projectMessages,
  reconstructMessages,
} from "./message-codec";

const SAVE_DEBOUNCE_MS = 900;

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
  startNewThread: () => void;
};

export function useChatPersistence(): ChatPersistence {
  const { visibleMessages, isLoading, reset } = useCopilotChat();
  const { setMessages } = useCopilotMessagesContext();
  const [activeThreadId, setActiveThreadId] = useAtom(activeChatThreadIdAtom);
  const [saving, setSaving] = useState(false);

  // Refs so the debounced effect always sees current values without re-subscribing.
  const activeIdRef = useRef(activeThreadId);
  activeIdRef.current = activeThreadId;
  const hydratingRef = useRef(false); // suppress the save that a restore would trigger
  const authFailedRef = useRef(false); // stop hammering the API once it 401s
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messages = visibleMessages ?? [];
  const signature = messagesSignature(messages);

  const doSave = useCallback(async () => {
    if (authFailedRef.current) return;
    const projected = projectMessages(visibleMessages ?? []);
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
      const res = await fetch(`/api/chat/threads/${id}/messages`, {
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
  }, [visibleMessages, setActiveThreadId]);

  // Debounced autosave: wait until a turn has settled, then persist.
  // biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the message signature + loading
  useEffect(() => {
    if (hydratingRef.current) {
      hydratingRef.current = false;
      return;
    }
    if (isLoading) return;
    if ((visibleMessages?.length ?? 0) === 0) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      void doSave();
    }, SAVE_DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [signature, isLoading]);

  const loadThread = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await fetch(`/api/chat/threads/${id}`);
        if (!res.ok) return false;
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
        hydratingRef.current = true;
        authFailedRef.current = false;
        setMessages(reconstructMessages(rows));
        activeIdRef.current = id;
        setActiveThreadId(id);
        return true;
      } catch {
        hydratingRef.current = false;
        return false;
      }
    },
    [setMessages, setActiveThreadId]
  );

  const startNewThread = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    reset();
    authFailedRef.current = false;
    activeIdRef.current = null;
    setActiveThreadId(null);
  }, [reset, setActiveThreadId]);

  return { activeThreadId, saving, loadThread, startNewThread };
}
