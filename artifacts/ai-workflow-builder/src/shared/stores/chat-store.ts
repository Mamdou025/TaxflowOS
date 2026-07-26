import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// The conversation itself is now owned by CopilotKit (see CopilotWorkspacePanel).
// These two atoms are all that remains: the panel's open state and a small
// page-context label that pages set (e.g. the OrbitalStage breadcrumb).

/**
 * The id of the conversation currently shown in the chat. Persisted to
 * localStorage so a reload stays on the same thread (and so the save path keeps
 * writing to it) before/without server-side hydration. `null` = a brand-new,
 * not-yet-saved conversation; the persistence layer mints an id on first save.
 * See features/assistant/runtime/chat/use-chat-persistence.ts.
 */
export const activeChatThreadIdAtom = atomWithStorage<string | null>(
  'inscope.chat.activeThreadId',
  null
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
