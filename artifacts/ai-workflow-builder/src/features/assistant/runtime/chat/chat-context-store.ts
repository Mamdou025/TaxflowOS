import { atom } from 'jotai';
import type { Store } from 'jotai/vanilla/store';
import { selectedClientAtom, scopeYearAtom } from '@/shared/stores/nav-store';
import {
  attachedDocsAtom,
  uploadedRowsAtom,
  type UploadedSource,
} from '@/shared/stores/workspace-store';
import { workflowInteractionAtom } from './workflow-interaction-store';
import {
  emptyChatContext,
  parseChatContext,
  type ChatContext,
  type ChatSourceReference,
  type ChatTextSnapshot,
} from './chat-context-model';

const contextSourcesAtom = atom(emptyChatContext());
export const chatContextEpochAtom = atom(0);
export const chatContextLockedAtom = atom(false);
export type LoadedChatSource = {
  status: 'loading' | 'ready' | 'unavailable';
  text?: ChatTextSnapshot;
  source?: UploadedSource;
  error?: string;
};
export const loadedChatSourcesAtom = atom<Record<string, LoadedChatSource>>({});
export const chatContextAtom = atom(
  (get): ChatContext => ({
    ...get(contextSourcesAtom),
    companyName: get(selectedClientAtom),
    year: get(scopeYearAtom),
    workflowInteraction: get(workflowInteractionAtom),
  }),
  (get, set, update: ChatContext | ((previous: ChatContext) => ChatContext)) => {
    const current = get(chatContextAtom);
    const next = parseChatContext(typeof update === 'function' ? update(current) : update);
    set(selectedClientAtom, next.companyName);
    set(scopeYearAtom, next.year);
    set(workflowInteractionAtom, next.workflowInteraction ?? null);
    set(contextSourcesAtom, next);
  },
);
export type ContextStore = Pick<Store, 'get' | 'set'>;
export function localSourceKey(id: string) {
  return `chat-local:${id}`;
}
export function assertChatContextCurrent(store: ContextStore, epoch: number) {
  if (epoch !== store.get(chatContextEpochAtom))
    throw new Error('The conversation changed. Attach the source in the intended chat.');
}
export function beginChatContextSwitch(store: ContextStore) {
  store.set(chatContextEpochAtom, (epoch) => epoch + 1);
  store.set(loadedChatSourcesAtom, (previous) =>
    Object.fromEntries(
      Object.entries(previous).map(([id, source]) => [
        id,
        source.status === 'loading'
          ? {
              status: 'unavailable' as const,
              error:
                'Source loading was interrupted by chat navigation. Retry to load this exact revision.',
            }
          : source,
      ]),
    ),
  );
}
export function syncChatSourceAdapters(store: ContextStore) {
  const context = store.get(chatContextAtom);
  const loaded = store.get(loadedChatSourcesAtom);
  store.set(
    attachedDocsAtom,
    context.sources.flatMap((reference) => {
      const value = loaded[reference.id];
      return value?.status === 'ready' && value.text
        ? [
            {
              ...value.text,
              id: reference.id,
              fileName: reference.fileName,
              chars: value.text.text.length,
              at: 0,
            },
          ]
        : [];
    }),
  );
  const selected = context.workflowSourceId ? loaded[context.workflowSourceId] : undefined;
  store.set(uploadedRowsAtom, (previous) => {
    const next = { ...previous };
    delete next.__unassigned__;
    if (selected?.status === 'ready' && selected.source) next.__unassigned__ = selected.source;
    return next;
  });
}
export function attachChatContextSource(
  store: ContextStore,
  reference: ChatSourceReference,
  loaded: LoadedChatSource,
  epoch: number,
) {
  assertChatContextCurrent(store, epoch);
  if (store.get(chatContextLockedAtom))
    throw new Error(
      'A reply or chat navigation started while the source was loading. Add it again when the chat is ready.',
    );
  store.set(chatContextAtom, (previous) => ({
    ...previous,
    sources: [...previous.sources.filter((source) => source.id !== reference.id), reference],
    workflowSourceId: reference.kind === 'workbook' ? reference.id : previous.workflowSourceId,
  }));
  store.set(loadedChatSourcesAtom, (previous) => ({ ...previous, [reference.id]: loaded }));
  if (!reference.sourceId && loaded.source)
    store.set(uploadedRowsAtom, (previous) => ({
      ...previous,
      [localSourceKey(reference.id)]: loaded.source!,
    }));
  syncChatSourceAdapters(store);
}
export function removeChatContextSource(store: ContextStore, id: string) {
  store.set(chatContextAtom, (previous) => ({
    ...previous,
    sources: previous.sources.filter((source) => source.id !== id),
    workflowSourceId: previous.workflowSourceId === id ? null : previous.workflowSourceId,
  }));
  store.set(loadedChatSourcesAtom, (previous) => {
    const next = { ...previous };
    delete next[id];
    return next;
  });
  syncChatSourceAdapters(store);
}
export function restoreChatContext(store: ContextStore, context: ChatContext) {
  store.set(chatContextEpochAtom, (epoch) => epoch + 1);
  store.set(loadedChatSourcesAtom, {});
  store.set(chatContextAtom, context);
  syncChatSourceAdapters(store);
}
