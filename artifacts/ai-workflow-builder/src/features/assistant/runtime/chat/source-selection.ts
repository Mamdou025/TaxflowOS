import { atom } from 'jotai';
import { chatContextAtom } from './chat-context-store';
export type ComposerWorkflowScope = { id: string; name: string };
/** Draft identity is explicit per-chat context, not execution authorization. */
export const selectedChatWorkflowAtom = atom(
  (get) => get(chatContextAtom).workflowScope,
  (get, set, workflowScope: ComposerWorkflowScope | null) =>
    set(chatContextAtom, { ...get(chatContextAtom), workflowScope }),
);
