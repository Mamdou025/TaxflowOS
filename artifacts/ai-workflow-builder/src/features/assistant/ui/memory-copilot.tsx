import { apiFetch } from '@/platform/auth/api-fetch';

// Explicit memory actions remain available. Stored workspace memories are never
// loaded into a chat automatically; chat context is selected and persisted per thread.
import { useCopilotAction } from '@copilotkit/react-core';
import { useAtomValue } from 'jotai';
import { selectedClientAtom } from '@/shared/stores/nav-store';
import { toast } from 'sonner';

export function MemoryCopilot() {
  const companyLabel = useAtomValue(selectedClientAtom);
  useCopilotAction({
    name: 'rememberFact',
    description:
      'Save a durable fact or preference the user EXPLICITLY asked you to remember (e.g. "remember Acme\'s 2025 FX is 1.3978", "always report in CAD", "my default client is Northstar"). Do NOT call this unless the user asked you to remember / save / note something for later — never auto-save. Memory is stored in the current workspace and is not loaded into new chats automatically. Company names in chat are labels, not dataset identities.',
    parameters: [
      {
        name: 'content',
        type: 'string',
        description: 'The fact/preference to remember, as a short self-contained sentence.',
        required: true,
      },
      {
        name: 'subject',
        type: 'string',
        description: 'Optional short label, e.g. "FX rate" or "reporting currency".',
        required: false,
      },
      {
        name: 'global',
        type: 'boolean',
        description:
          'True if this applies to ALL clients (a general preference); omit/false to scope it to the current client.',
        required: false,
      },
    ],
    handler: async ({
      content,
      subject,
      global,
    }: {
      content: string;
      subject?: string;
      global?: boolean;
    }) => {
      try {
        const res = await apiFetch('/api/assistant/memory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            content,
            subject,
            clientId: global ? null : companyLabel || null,
            kind: 'fact',
            source: 'user',
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.memory?.id) {
          const why =
            data?.error === 'AUTH_REQUIRED'
              ? 'you need to be signed in'
              : data?.error === 'STORAGE_UNAVAILABLE'
                ? 'the database is not available'
                : 'it could not be saved';
          return `I could not remember that — ${why}.`;
        }
        toast.success('Saved to memory');
        return `Saved workspace memory ${data.memory.id}: "${content}". It is not automatically loaded into other chats.`;
      } catch {
        return 'I could not remember that (network error).';
      }
    },
  });

  useCopilotAction({
    name: 'forgetFact',
    description:
      'Delete a previously remembered fact/preference by its id (use the id returned when it was saved). Use when the user asks you to forget or remove something you saved.',
    parameters: [
      {
        name: 'id',
        type: 'string',
        description: 'The id of the memory to forget (from its save receipt).',
        required: true,
      },
    ],
    handler: async ({ id }: { id: string }) => {
      try {
        const res = await apiFetch(`/api/assistant/memory?id=${encodeURIComponent(id)}`, {
          method: 'DELETE',
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok || !data?.ok) return 'I could not forget that.';
        return 'Done — I forgot that.';
      } catch {
        return 'I could not forget that (network error).';
      }
    },
  });

  return null;
}
