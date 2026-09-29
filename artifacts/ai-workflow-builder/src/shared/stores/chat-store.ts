import { atom } from 'jotai';
import { atomWithStorage } from '@/platform/auth/workspace-atoms';
export type ChatAgent = 'sina' | 'microsina';

/** Selected provider; scoped to the signed-in account and workspace like the thread ID. */
export const chatAgentAtom = atomWithStorage<ChatAgent>('inscope.chat.agent', 'sina', { getOnInit: true });

// The conversation itself is now owned by CopilotKit (see CopilotWorkspacePanel).
// These atoms hold the saved thread identity and workspace display state.

/**
 * The id of the conversation currently shown in the chat. Persisted to
 * localStorage so a reload stays on the same thread (and so the save path keeps
 * writing to it) before/without server-side hydration. `null` = a brand-new,
 * not-yet-saved conversation; the persistence layer mints an id on first save.
 * See features/assistant/runtime/chat/use-chat-persistence.ts.
 */
export const activeChatThreadIdAtom = atomWithStorage<string | null>(
  'inscope.chat.activeThreadId',
  null,
  // Restoration decides what to load on the first render. Read the account- and
  // workspace-scoped ID immediately rather than hydrating it after that decision.
  { getOnInit: true },
);

export type ChatPageContext = {
  page: string;
  label: string;
  description?: string;
};

export const chatPageContextAtom = atom<ChatPageContext>({
  page: 'home',
  label: 'InScope',
});

/** Drives the chat workspace panel (open/closed). */
export const chatWorkspaceOpenAtom = atom(false);

/**
 * Drives the global docked AssistantPanel — the orb toggles this. The panel is
 * an ambient layer over whatever page you're on (chat-as-layer); the `/` route
 * stays a full-screen focus mode that owns the assistant there instead.
 */
export const assistantOpenAtom = atom(false);

/**
 * How the Scope chat shares space with an open inline page:
 *  - 'split'     : page (left) + chat (right, fixed) — the default
 *  - 'collapsed' : chat folded away, page takes the full width
 *  - 'expanded'  : chat takes over full width, the page is tucked behind its tab
 * Only meaningful while a page is open; when none is, the chat always fills.
 */
export type ChatPanelMode = 'split' | 'collapsed' | 'expanded';
export const chatPanelModeAtom = atom<ChatPanelMode>('split');
