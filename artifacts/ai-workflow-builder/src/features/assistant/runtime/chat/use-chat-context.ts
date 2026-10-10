import { useCallback, useEffect, useRef } from 'react';
import { useAtomValue, useStore } from 'jotai';
import { useCopilotKit } from '@copilotkit/react-core/v2';
import { projectChatContext } from './chat-context-projection';
import { chatContextAtom, chatContextEpochAtom, loadedChatSourcesAtom } from './chat-context-store';
import { restoreChatSource } from './chat-context-sources';

/** One registration shared by both providers; publishing before send avoids an effect-timing race. */
export function useChatContext() {
  const store = useStore();
  const context = useAtomValue(chatContextAtom);
  const loaded = useAtomValue(loadedChatSourcesAtom);
  const epoch = useAtomValue(chatContextEpochAtom);
  const { copilotkit } = useCopilotKit();
  const registration = useRef<string | null>(null);
  const publish = useCallback(() => {
    if (registration.current) copilotkit.removeContext(registration.current);
    registration.current = copilotkit.addContext({
      description: 'Explicit context for this chat',
      value: JSON.stringify(
        projectChatContext(store.get(chatContextAtom), store.get(loadedChatSourcesAtom)),
      ),
    });
  }, [copilotkit, store]);
  useEffect(() => {
    publish();
  }, [context, loaded, publish]);
  useEffect(
    () => () => {
      if (registration.current) copilotkit.removeContext(registration.current);
      registration.current = null;
    },
    [copilotkit],
  );
  useEffect(() => {
    for (const reference of context.sources) {
      if (!store.get(loadedChatSourcesAtom)[reference.id])
        void restoreChatSource(store, reference, epoch);
    }
  }, [context.sources, epoch, store]);
  return { publish };
}
