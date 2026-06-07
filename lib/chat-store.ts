import { atom } from 'jotai';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

export type ChatPageContext = {
  page: string;
  label: string;
  description?: string;
};

export const chatOpenAtom = atom(false);
export const chatMessagesAtom = atom<ChatMessage[]>([]);
export const chatPageContextAtom = atom<ChatPageContext>({
  page: 'home',
  label: 'InScope',
});
export const chatTakeoverAtom = atom(false);
