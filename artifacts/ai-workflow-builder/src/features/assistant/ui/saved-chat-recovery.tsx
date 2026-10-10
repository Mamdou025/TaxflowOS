import { LoaderCircle, MessageSquareWarning } from 'lucide-react';
import { LC } from '@/lib/librechat-theme';
import type { Assistant } from './use-assistant';
import { MkoroChatTasks } from '../mkoro/mkoro-chat-tasks';

/** Recovery belongs inside the chat shell; it never replaces the workspace. */
export function SavedChatRecovery({ assistant }: { assistant: Assistant }) {
  if (!assistant.restoring && !assistant.restoreError) return null;
  const retryId = assistant.restoreThreadId;
  return (
    <section
      aria-label="Saved chat recovery"
      aria-busy={assistant.restoring}
      className="mx-3 mb-3 flex flex-wrap items-start gap-3 rounded-2xl border p-4 text-sm"
      style={{ background: LC.surface, borderColor: LC.borderSubtle, color: LC.body }}
    >
      {assistant.restoring ? (
        <LoaderCircle size={18} className="mt-0.5 motion-safe:animate-spin" aria-hidden />
      ) : (
        <MessageSquareWarning size={18} className="mt-0.5" aria-hidden />
      )}
      <div className="min-w-0 flex-1">
        <p role={assistant.restoreError ? 'alert' : 'status'}>
          {assistant.restoreError || 'Opening your saved chat…'}
        </p>
        <p className="mt-1 text-xs" style={{ color: LC.muted }}>
          {assistant.restoring
            ? 'Your conversation and Scope will appear here. Sending resumes when they are ready.'
            : 'Your saved conversation is kept. Retry opening it, or start a new chat.'}
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          {assistant.restoreError && retryId && (
            <button
              type="button"
              className="rounded-lg border px-3 py-1.5 font-medium"
              style={{ borderColor: LC.border, color: LC.text }}
              onClick={() => void assistant.openThread(retryId)}
            >
              Retry saved chat
            </button>
          )}
          <button
            type="button"
            className="rounded-lg px-3 py-1.5 underline underline-offset-4"
            onClick={() => void assistant.newChat()}
          >
            Start a new chat
          </button>
        </div>
      </div>
      <div className="w-full min-w-0">
        <MkoroChatTasks
          threadId={assistant.activeThreadId}
          onReviewTask={assistant.reviewMkoroTask}
        />
      </div>
    </section>
  );
}
