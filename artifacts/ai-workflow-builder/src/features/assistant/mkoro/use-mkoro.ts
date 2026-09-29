import { useCallback, useEffect, useRef, useState } from 'react';
import { atom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { z } from 'zod';
import {
  MKORO_PATH,
  MkoroPairingSchema,
  MkoroTaskSchema,
  MkoroWorkersSchema,
  type MkoroWorker,
} from '@workspace/api-zod/mkoro';
import { apiJSON } from '@/platform/auth/api-fetch';
import { atomWithStorage } from '@/platform/auth/workspace-atoms';

export const selectedMkoroWorkerAtom = atomWithStorage('inscope.mkoro.worker', '');
export const mkoroRefreshAtom = atom(0);
export const mkoroSettingsOpenAtom = atom(false);
export const mkoroTaskIsActive = (status: string) =>
  ['queued', 'running', 'waiting_permission'].includes(status);
export const mkoroPost = (body: unknown): RequestInit => ({
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
  signal: AbortSignal.timeout(20_000),
});
export function mkoroError(cause: unknown, fallback: string) {
  return cause instanceof z.ZodError
    ? 'Mkoro returned an invalid response. Check the connection before continuing.'
    : cause instanceof Error
      ? cause.message
      : fallback;
}

type ConnectionState = {
  workers: MkoroWorker[];
  loading: boolean;
  readError: string;
  read: () => void;
};
const connectionAtom = atom<ConnectionState>({
  workers: [],
  loading: true,
  readError: '',
  read: () => {},
});
// One subscription owns the poller even when the toolbar, task cards and Sina
// consume it together. Workspace changes reload the store and abort this request.
connectionAtom.onMount = (set) => {
  const controller = new AbortController();
  let inFlight = false;
  const read = async () => {
    if (inFlight || controller.signal.aborted) return;
    inFlight = true;
    try {
      const response = MkoroWorkersSchema.parse(
        await apiJSON(`${MKORO_PATH}/workers`, {
          signal: AbortSignal.any([controller.signal, AbortSignal.timeout(15_000)]),
        }),
      );
      if (!controller.signal.aborted)
        set((state) => ({ ...state, workers: response.workers, loading: false, readError: '' }));
    } catch (cause) {
      if (!controller.signal.aborted)
        set((state) => ({
          ...state,
          loading: false,
          readError: mkoroError(cause, 'Computer status could not be checked.'),
        }));
    } finally {
      inFlight = false;
    }
  };
  set((state) => ({ ...state, loading: true, read: () => void read() }));
  void read();
  const timer = window.setInterval(() => void read(), 1500);
  return () => {
    controller.abort();
    window.clearInterval(timer);
  };
};

export function useMkoroConnection() {
  const connection = useAtomValue(connectionAtom);
  const [workerId, setWorkerId] = useAtom(selectedMkoroWorkerAtom);
  const revision = useAtomValue(mkoroRefreshAtom);
  const setRevision = useSetAtom(mkoroRefreshAtom);
  useEffect(() => {
    connection.read();
  }, [connection.read, revision]);
  useEffect(() => {
    if (workerId || connection.loading || connection.readError) return;
    const online = connection.workers.filter((worker) => worker.status === 'online');
    if (online.length === 1) setWorkerId(online[0].id);
  }, [connection.loading, connection.readError, connection.workers, workerId, setWorkerId]);
  const refresh = useCallback(() => setRevision((value) => value + 1), [setRevision]);
  return {
    ...connection,
    workerId,
    setWorkerId,
    refresh,
    worker: connection.workers.find((worker) => worker.id === workerId) ?? null,
  };
}

export function useMkoroActions() {
  const [pairing, setPairing] = useState<z.infer<typeof MkoroPairingSchema> | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const inFlight = useRef(false);
  const setRevision = useSetAtom(mkoroRefreshAtom);
  const act = async (operation: () => Promise<void>) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError('');
    try {
      await operation();
    } catch (cause) {
      setError(mkoroError(cause, 'The operation could not be confirmed.'));
    } finally {
      inFlight.current = false;
      setBusy(false);
      setRevision((value) => value + 1);
    }
  };
  const taskAction = (id: string, action: string, body: unknown) =>
    act(async () => {
      const response = z
        .object({ task: MkoroTaskSchema })
        .parse(await apiJSON(`${MKORO_PATH}/tasks/${id}/${action}`, mkoroPost(body)));
      if (response.task.id !== id) throw new Error('The returned task did not match this action.');
    });
  return {
    pairing,
    busy,
    error,
    clearPairing: () => setPairing(null),
    setAutomaticApproval: (id: string, autoApprove: boolean) =>
      act(async () => {
        z.object({ ok: z.literal(true) }).parse(
          await apiJSON(`${MKORO_PATH}/workers/${id}/approval`, {
            ...mkoroPost({ autoApprove }),
            method: 'PATCH',
          }),
        );
      }),
    createPairing: () =>
      act(async () => {
        setPairing(
          MkoroPairingSchema.parse(await apiJSON(`${MKORO_PATH}/pairings`, mkoroPost({}))),
        );
      }),
    revoke: (id: string) =>
      act(async () => {
        z.object({ ok: z.literal(true) }).parse(
          await apiJSON(`${MKORO_PATH}/workers/${id}`, {
            method: 'DELETE',
            signal: AbortSignal.timeout(20_000),
          }),
        );
        setPairing(null);
      }),
    cancel: (id: string) => taskAction(id, 'cancel', {}),
    permission: (id: string, requestId: string, optionId: string) =>
      taskAction(id, 'permission', { requestId, optionId }),
  };
}
