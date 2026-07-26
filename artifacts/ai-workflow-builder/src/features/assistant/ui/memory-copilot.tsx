

// ─────────────────────────────────────────────────────────────────────────────
// MemoryCopilot — headless durable-memory instrument for the AI chat.
//
// Mounted ONCE in app-shell (inside the CopilotKit provider), it:
//   • fetches the user's relevant remembered facts for the active client and
//     publishes them as grounding context (useCopilotReadable), and
//   • registers rememberFact / forgetFact so the assistant can persist a fact the
//     user EXPLICITLY asks it to remember (never auto-inferred).
//
// Memory is stored server-side in Postgres, scoped to the authenticated user and
// (optionally) the active client, so it survives refresh/reload without cross-
// client bleed. Fail-soft: no session or no DB → memories are simply empty and the
// chat is unaffected. Renders nothing.
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { useCopilotAction, useCopilotReadable } from '@copilotkit/react-core';
import { toast } from 'sonner';
import { selectedClientAtom } from '@/shared/stores/nav-store';

type MemoryView = {
  id: string;
  clientId: string | null;
  subject: string | null;
  content: string;
  source: string;
  createdAt: string;
};

export function MemoryCopilot() {
  const client = useAtomValue(selectedClientAtom);
  const [memories, setMemories] = useState<MemoryView[]>([]);

  const refresh = useCallback(async (activeClient: string) => {
    try {
      const res = await fetch(`/api/assistant/memory?clientId=${encodeURIComponent(activeClient)}`);
      if (!res.ok) {
        setMemories([]);
        return;
      }
      const data = await res.json();
      setMemories(Array.isArray(data?.memories) ? (data.memories as MemoryView[]) : []);
    } catch {
      setMemories([]); // fail-soft
    }
  }, []);

  useEffect(() => {
    void refresh(client);
  }, [client, refresh]);

  // Grounding: the model sees the remembered facts relevant to the active client.
  useCopilotReadable({
    description:
      'Remembered facts and preferences the user previously asked you to save (durable across sessions), already filtered to the active client. Use the relevant ones as grounding; never invent. Empty means nothing has been saved yet.',
    value: memories.map((m) => ({
      id: m.id,
      scope: m.clientId ?? 'all clients',
      subject: m.subject,
      content: m.content,
    })),
  });

  useCopilotAction({
    name: 'rememberFact',
    description:
      'Save a durable fact or preference the user EXPLICITLY asked you to remember (e.g. "remember Acme\'s 2025 FX is 1.3978", "always report in CAD", "my default client is Northstar"). Do NOT call this unless the user asked you to remember / save / note something for later — never auto-save. By default the memory is scoped to the CURRENT client; set global=true for a preference that applies to every client.',
    parameters: [
      { name: 'content', type: 'string', description: 'The fact/preference to remember, as a short self-contained sentence.', required: true },
      { name: 'subject', type: 'string', description: 'Optional short label, e.g. "FX rate" or "reporting currency".', required: false },
      { name: 'global', type: 'boolean', description: 'True if this applies to ALL clients (a general preference); omit/false to scope it to the current client.', required: false },
    ],
    handler: async ({ content, subject, global }: { content: string; subject?: string; global?: boolean }) => {
      try {
        const res = await fetch('/api/assistant/memory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content, subject, clientId: global ? null : client, kind: 'fact', source: 'user' }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.ok) {
          const why =
            data?.error === 'AUTH_REQUIRED'
              ? 'you need to be signed in'
              : data?.error === 'STORAGE_UNAVAILABLE'
                ? 'the database is not available'
                : 'it could not be saved';
          return `I could not remember that — ${why}.`;
        }
        await refresh(client);
        toast.success('Saved to memory');
        return `Saved to memory${global ? ' (all clients)' : ` for ${client}`}: "${content}".`;
      } catch {
        return 'I could not remember that (network error).';
      }
    },
  });

  useCopilotAction({
    name: 'forgetFact',
    description:
      'Delete a previously remembered fact/preference by its id (ids are listed in the remembered-facts context). Use when the user asks you to forget or remove something you saved.',
    parameters: [{ name: 'id', type: 'string', description: 'The id of the memory to forget (from the remembered-facts context).', required: true }],
    handler: async ({ id }: { id: string }) => {
      try {
        const res = await fetch(`/api/assistant/memory?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.ok) return 'I could not forget that.';
        await refresh(client);
        return 'Done — I forgot that.';
      } catch {
        return 'I could not forget that (network error).';
      }
    },
  });

  return null;
}
