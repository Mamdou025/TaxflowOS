import { atom } from 'jotai';

// The conversation itself is now owned by CopilotKit (see CopilotWorkspacePanel).
// These two atoms are all that remains: the panel's open state and a small
// page-context label that pages set (e.g. the OrbitalStage breadcrumb).

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
