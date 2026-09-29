import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { z } from 'zod';
import {
  MKORO_PATH,
  MkoroConversationDetailSchema,
  MkoroConversationsSchema,
  type MkoroConversation,
  type MkoroEvent,
} from '@workspace/api-zod/mkoro';
import { apiJSON } from '@/platform/auth/api-fetch';
import { mkoroError, mkoroRefreshAtom } from './use-mkoro';

type Detail = z.infer<typeof MkoroConversationDetailSchema>;

export function useMkoroConversations(threadId: string | null, history = false) {
  const revision = useAtomValue(mkoroRefreshAtom);
  const [state, setState] = useState<{
    conversations: MkoroConversation[];
    error: string;
    loading: boolean;
  }>({ conversations: [], error: '', loading: true });
  useEffect(() => {
    setState({ conversations: [], error: '', loading: true });
  }, [threadId, history]);
  useEffect(() => {
    if (!threadId && !history) return;
    const controller = new AbortController();
    let inFlight = false;
    const read = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const response = MkoroConversationsSchema.parse(
          await apiJSON(
            history
              ? `${MKORO_PATH}/conversations`
              : `${MKORO_PATH}/threads/${encodeURIComponent(threadId!)}/conversations`,
            { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15_000)]) },
          ),
        );
        if (!controller.signal.aborted)
          setState({
            conversations: history
              ? response.conversations
              : response.conversations.filter((conversation) => conversation.threadId === threadId),
            error: '',
            loading: false,
          });
      } catch (cause) {
        if (!controller.signal.aborted)
          setState({
            conversations: [],
            error: mkoroError(cause, 'Computer task history is unavailable.'),
            loading: false,
          });
      } finally {
        inFlight = false;
      }
    };
    void read();
    const timer = window.setInterval(() => void read(), 1500);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [threadId, history, revision]);
  return state;
}

export function useMkoroConversation(id: string, threadId: string | null) {
  const revision = useAtomValue(mkoroRefreshAtom);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [error, setError] = useState('');
  const [loadingEarlier, setLoadingEarlier] = useState(false);
  const [earlierError, setEarlierError] = useState('');
  const cache = useRef({
    id,
    events: new Map<string, MkoroEvent>(),
    initialized: false,
    hasOlder: false,
  });
  useEffect(() => {
    const controller = new AbortController();
    if (cache.current.id !== id) {
      cache.current = { id, events: new Map(), initialized: false, hasOlder: false };
      setDetail(null);
    }
    let inFlight = false;
    const read = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const next = MkoroConversationDetailSchema.parse(
          await apiJSON(`${MKORO_PATH}/conversations/${id}`, {
            signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15_000)]),
          }),
        );
        if (next.conversation.id !== id || next.conversation.threadId !== threadId)
          throw new Error('The computer task does not belong to this chat.');
        if (
          next.tasks.some(
            (task) => task.conversationId !== id || task.workerId !== next.conversation.workerId,
          )
        )
          throw new Error('The returned task does not belong to this computer conversation.');
        if (controller.signal.aborted) return;
        const events = cache.current;
        if (
          events.initialized &&
          events.events.size &&
          next.eventsTruncated &&
          !next.events.some((event) => events.events.has(event.id))
        ) {
          events.events.clear();
          events.initialized = false;
        }
        if (!events.initialized) {
          events.hasOlder = next.eventsTruncated;
          events.initialized = true;
        }
        for (const event of next.events) events.events.set(event.id, event);
        next.events = [...events.events.values()].sort((a, b) => a.cursor - b.cursor);
        next.eventsTruncated = events.hasOlder;
        setDetail(next);
        setError('');
      } catch (cause) {
        if (!controller.signal.aborted) {
          setDetail(null);
          setError(mkoroError(cause, 'Task status could not be verified.'));
        }
      } finally {
        inFlight = false;
      }
    };
    void read();
    const timer = window.setInterval(() => void read(), 1500);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [id, threadId, revision]);
  const loadEarlier = async () => {
    if (loadingEarlier) return;
    const current = cache.current;
    const before = Math.min(...[...current.events.values()].map((event) => event.cursor));
    if (!Number.isFinite(before)) return;
    setLoadingEarlier(true);
    setEarlierError('');
    try {
      const previous = MkoroConversationDetailSchema.parse(
        await apiJSON(`${MKORO_PATH}/conversations/${id}?before=${before}`, {
          signal: AbortSignal.timeout(15_000),
        }),
      );
      if (previous.conversation.id !== id || previous.conversation.threadId !== threadId)
        throw new Error('The earlier activity does not belong to this chat.');
      if (current !== cache.current) return;
      for (const event of previous.events) current.events.set(event.id, event);
      current.hasOlder = previous.eventsTruncated;
      setDetail((value) =>
        value?.conversation.id === id
          ? {
              ...value,
              events: [...current.events.values()].sort((a, b) => a.cursor - b.cursor),
              eventsTruncated: current.hasOlder,
            }
          : value,
      );
    } catch (cause) {
      setEarlierError(mkoroError(cause, 'Earlier activity could not be loaded.'));
    } finally {
      setLoadingEarlier(false);
    }
  };
  return { detail, error, earlierError, loadingEarlier, loadEarlier };
}
