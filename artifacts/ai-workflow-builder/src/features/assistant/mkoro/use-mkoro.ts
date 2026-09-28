import { useCallback, useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { z } from 'zod';
import {
  MKORO_PATH,
  MkoroConversationDetailSchema,
  MkoroConversationsSchema,
  MkoroConversationSchema,
  MkoroPairingSchema,
  MkoroTaskSchema,
  MkoroWorkersSchema,
  type MkoroConversation,
  type MkoroWorker,
  type MkoroEvent,
} from '@workspace/api-zod/mkoro';
import { apiJSON } from '@/platform/auth/api-fetch';
import { atomWithStorage } from '@/platform/auth/workspace-atoms';

const selectedConversationAtom = atomWithStorage<string | null>('inscope.mkoro.conversation', null);
type Detail = z.infer<typeof MkoroConversationDetailSchema>;
type Pairing = z.infer<typeof MkoroPairingSchema>;
const post = (body: unknown): RequestInit => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
  signal: AbortSignal.timeout(20_000),
});
export const mkoroTaskIsActive = (status: string) =>
  ['queued', 'running', 'waiting_permission'].includes(status);

export function useMkoro() {
  const [workers, setWorkers] = useState<MkoroWorker[]>([]);
  const [conversations, setConversations] = useState<MkoroConversation[]>([]);
  const [selectedId, setSelectedId] = useAtom(selectedConversationAtom);
  const [workerId, setWorkerId] = useState('');
  const [detail, setDetail] = useState<Detail | null>(null);
  const [pairing, setPairing] = useState<Pairing | null>(null);
  const [error, setError] = useState('');
  const [readError, setReadError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const actionInFlight = useRef(false);
  const eventCache = useRef<{
    id: string | null;
    events: Map<string, MkoroEvent>;
    hasOlder: boolean;
    initialized: boolean;
  }>({
    id: null,
    events: new Map(),
    hasOlder: false,
    initialized: false,
  });
  const pendingSend = useRef<{ conversationId: string; message: string; requestId: string } | null>(
    null,
  );
  const refresh = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    if (eventCache.current.id !== selectedId) {
      eventCache.current = {
        id: selectedId,
        events: new Map(),
        hasOlder: false,
        initialized: false,
      };
    }
    let inFlight = false;
    const read = async () => {
      if (inFlight) return;
      inFlight = true;
      try {
        const init = { signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15_000)]) };
        const [workerResponse, conversationResponse] = await Promise.all([
          apiJSON(`${MKORO_PATH}/workers`, init),
          apiJSON(`${MKORO_PATH}/conversations`, init),
        ]);
        const nextWorkers = MkoroWorkersSchema.parse(workerResponse).workers;
        const nextConversations =
          MkoroConversationsSchema.parse(conversationResponse).conversations;
        const nextDetail = selectedId
          ? MkoroConversationDetailSchema.parse(
              await apiJSON(`${MKORO_PATH}/conversations/${selectedId}`, init),
            )
          : null;
        if (controller.signal.aborted) return;
        if (nextDetail) {
          const cache = eventCache.current;
          // After a long disconnection, reload contiguous pages instead of silently joining a gap.
          if (
            cache.initialized &&
            cache.events.size > 0 &&
            nextDetail.eventsTruncated &&
            !nextDetail.events.some((event) => cache.events.has(event.id))
          ) {
            cache.events.clear();
            cache.initialized = false;
          }
          if (!cache.initialized) {
            cache.hasOlder = nextDetail.eventsTruncated;
            cache.initialized = true;
          }
          for (const event of nextDetail.events) cache.events.set(event.id, event);
          nextDetail.events = [...cache.events.values()].sort((a, b) => a.cursor - b.cursor);
          nextDetail.eventsTruncated = cache.hasOlder;
        }
        setWorkers(nextWorkers);
        setConversations(nextConversations);
        setDetail(nextDetail);
        setWorkerId(
          (previous) =>
            nextDetail?.conversation.workerId ??
            (nextWorkers.some((worker) => worker.id === previous && worker.status !== 'revoked')
              ? previous
              : (nextWorkers.find((worker) => worker.status === 'online')?.id ??
                nextWorkers.find((worker) => worker.status !== 'revoked')?.id ??
                '')),
        );
        setReadError('');
      } catch (cause) {
        if (!controller.signal.aborted) {
          setReadError(
            cause instanceof z.ZodError
              ? 'Mkoro returned an invalid status response. Commands are paused until status can be verified.'
              : cause instanceof Error
                ? cause.message
                : 'Mkoro status could not be checked.',
          );
        }
      } finally {
        inFlight = false;
        if (!controller.signal.aborted) setLoading(false);
      }
    };
    void read();
    const timer = window.setInterval(() => void read(), 1500);
    return () => {
      controller.abort();
      window.clearInterval(timer);
    };
  }, [selectedId, revision]);

  const selectConversation = (id: string | null) => {
    setDetail(null);
    setLoading(true);
    setSelectedId(id);
    setError('');
    refresh();
  };

  const act = async (operation: () => Promise<void>): Promise<boolean> => {
    if (actionInFlight.current) return false;
    actionInFlight.current = true;
    setBusy(true);
    setError('');
    try {
      await operation();
      refresh();
      return true;
    } catch (cause) {
      setError(
        cause instanceof z.ZodError
          ? 'The operation response could not be verified. Check the conversation before trying again.'
          : cause instanceof Error
            ? cause.message
            : 'The operation could not be confirmed.',
      );
      refresh();
      return false;
    } finally {
      actionInFlight.current = false;
      setBusy(false);
    }
  };

  const send = (message: string) =>
    act(async () => {
      let conversationId = selectedId;
      if (!conversationId) {
        const response = z
          .object({ conversation: MkoroConversationSchema })
          .parse(
            await apiJSON(
              `${MKORO_PATH}/conversations`,
              post({ workerId, title: message.trim().slice(0, 100) }),
            ),
          );
        conversationId = response.conversation.id;
        setSelectedId(conversationId);
      }
      const previous = pendingSend.current;
      const requestId =
        previous?.conversationId === conversationId && previous.message === message
          ? previous.requestId
          : crypto.randomUUID();
      pendingSend.current = { conversationId, message, requestId };
      z.object({ task: MkoroTaskSchema }).parse(
        await apiJSON(
          `${MKORO_PATH}/conversations/${conversationId}/messages`,
          post({ message, requestId }),
        ),
      );
      pendingSend.current = null;
    });

  const createPairing = () =>
    act(async () => {
      setPairing(MkoroPairingSchema.parse(await apiJSON(`${MKORO_PATH}/pairings`, post({}))));
    });
  const revoke = (id: string) =>
    act(async () => {
      await apiJSON(`${MKORO_PATH}/workers/${id}`, { method: 'DELETE' });
      setPairing(null);
    });
  const cancel = (id: string) =>
    act(async () => {
      await apiJSON(`${MKORO_PATH}/tasks/${id}/cancel`, post({}));
    });
  const permission = (taskId: string, requestId: string, optionId: string) =>
    act(async () => {
      await apiJSON(`${MKORO_PATH}/tasks/${taskId}/permission`, post({ requestId, optionId }));
    });
  const loadEarlier = () =>
    act(async () => {
      const cache = eventCache.current;
      const before = Math.min(...[...cache.events.values()].map((event) => event.cursor));
      if (!selectedId || !Number.isFinite(before)) return;
      const response = MkoroConversationDetailSchema.parse(
        await apiJSON(`${MKORO_PATH}/conversations/${selectedId}?before=${before}`, {
          signal: AbortSignal.timeout(15_000),
        }),
      );
      if (eventCache.current !== cache) return;
      for (const event of response.events) cache.events.set(event.id, event);
      cache.hasOlder = response.eventsTruncated;
      setDetail((current) =>
        current?.conversation.id === selectedId
          ? {
              ...current,
              events: [...cache.events.values()].sort((a, b) => a.cursor - b.cursor),
              eventsTruncated: cache.hasOlder,
            }
          : current,
      );
    });

  return {
    workers,
    conversations,
    workerId,
    setWorkerId,
    selectedId,
    detail,
    pairing,
    clearPairing: () => setPairing(null),
    error,
    readError,
    busy,
    loading,
    refresh,
    selectConversation,
    send,
    createPairing,
    revoke,
    cancel,
    permission,
    loadEarlier,
  };
}
