import { useEffect, useRef, useState } from 'react';
import { Monitor, X } from 'lucide-react';
import {
  MKORO_PATH,
  MkoroScreenResponseSchema,
  MkoroScreenViewResponseSchema,
  type MkoroScreenFrame,
  type MkoroTask,
} from '@workspace/api-zod/mkoro';
import { apiJSON } from '@/platform/auth/api-fetch';
import { mkoroError, mkoroPost, mkoroTaskIsActive } from './use-mkoro';

export function MkoroScreen({
  task,
  canView,
  workerName,
}: {
  task: MkoroTask;
  canView: boolean;
  workerName: string;
}) {
  const [open, setOpen] = useState(false);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(document.visibilityState === 'visible');
  const [inView, setInView] = useState(true);
  const [frame, setFrame] = useState<MkoroScreenFrame | null>(null);
  const [message, setMessage] = useState('Waiting for a screenshot from the computer…');
  const [lastCapturedAt, setLastCapturedAt] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const eligible =
    canView && mkoroTaskIsActive(task.status) && !task.connectionLost && !task.cancelRequested;
  const watching = open && eligible && visible && inView && !paused;
  useEffect(() => {
    const change = () => setVisible(document.visibilityState === 'visible');
    document.addEventListener('visibilitychange', change);
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    if (root.current) observer.observe(root.current);
    return () => {
      document.removeEventListener('visibilitychange', change);
      observer.disconnect();
    };
  }, []);
  useEffect(() => {
    setFrame(null);
    if (!watching) return;
    const controller = new AbortController();
    let busy = false;
    let nextRenew = 0;
    let nextRead = 0;
    let expiresAt = 0;
    const waitingSince = Date.now();
    const tick = async () => {
      const now = Date.now();
      setFrame((previous) =>
        previous && (now - Date.parse(previous.capturedAt) >= 15_000 || now >= expiresAt)
          ? null
          : previous,
      );
      if (busy || controller.signal.aborted) return;
      busy = true;
      try {
        const signal = AbortSignal.any([controller.signal, AbortSignal.timeout(8_000)]);
        if (now >= nextRenew) {
          const result = MkoroScreenViewResponseSchema.parse(
            await apiJSON(`${MKORO_PATH}/tasks/${task.id}/screen-view`, {
              ...mkoroPost({ enabled: true }),
              signal,
            }),
          );
          if (!result.lease || result.lease.taskId !== task.id)
            throw new Error('Screen viewing is no longer active for this task.');
          expiresAt = Date.parse(result.lease.expiresAt);
          nextRenew = Date.now() + 5000;
        }
        if (controller.signal.aborted || now < nextRead) return;
        const result = MkoroScreenResponseSchema.parse(
          await apiJSON(`${MKORO_PATH}/tasks/${task.id}/screen`, { signal, cache: 'no-store' }),
        );
        if (result.taskId !== task.id)
          throw new Error('The screenshot did not belong to this task.');
        if (controller.signal.aborted) return;
        nextRead = Date.now() + 2000;
        const capturedAt = result.frame ? Date.parse(result.frame.capturedAt) : 0;
        const fresh = capturedAt > Date.now() - 15_000 && capturedAt < Date.now() + 5000;
        if (
          result.status === 'ready' &&
          result.frame &&
          fresh &&
          result.leaseExpiresAt &&
          Date.parse(result.leaseExpiresAt) > Date.now()
        ) {
          setFrame(result.frame);
          setLastCapturedAt(result.frame.capturedAt);
          setMessage('View only · Refreshes about every 2 seconds');
        } else {
          setFrame(null);
          setMessage(
            result.error?.message ??
              (result.status === 'inactive'
                ? 'Screen sharing stopped.'
                : result.status === 'unavailable'
                  ? 'The computer could not capture its desktop.'
                  : Date.now() - waitingSince > 15000
                    ? 'No screenshot has arrived. On the Goose computer, update the complete companion bundle, keep Windows unlocked, and run Check-MkoroScreen.cmd. Check that the relay allows screenshot uploads.'
                    : 'Waiting for a current screenshot from the computer…'),
          );
        }
      } catch (cause) {
        if (!controller.signal.aborted) {
          setFrame(null);
          setMessage(mkoroError(cause, 'The desktop view is unavailable.'));
          // A failed access check or invalid response must not keep renewing
          // capture. The user can retry after the connection is verified.
          setPaused(true);
        }
      } finally {
        busy = false;
      }
    };
    setMessage('Waiting for a screenshot from the computer…');
    void tick();
    const timer = window.setInterval(() => void tick(), 1000);
    return () => {
      controller.abort();
      window.clearInterval(timer);
      // Best effort release; the short server lease expires even if access or
      // the network disappears. Frames never enter storage or model context.
      void apiJSON(`${MKORO_PATH}/tasks/${task.id}/screen-view`, {
        ...mkoroPost({ enabled: false }),
        signal: AbortSignal.timeout(4000),
      }).catch(() => {});
    };
  }, [task.id, watching]);
  return (
    <div ref={root} className="mkoro-screen">
      <div className="mkoro-controls">
        <button
          type="button"
          disabled={!eligible && !open}
          aria-expanded={open}
          onClick={() => {
            setOpen((value) => !value);
            setPaused(false);
          }}
        >
          {open ? <X size={14} aria-hidden /> : <Monitor size={14} aria-hidden />}
          {open ? 'Close desktop view' : 'View Mkoro’s computer'}
        </button>
      </div>
      {open && (
        <div role="region" aria-label="Mkoro desktop view" className="mkoro-screen-view">
          <strong>{workerName}</strong>
          <p role="status">
            {!eligible
              ? task.cancelRequested
                ? 'Desktop capture stopped while the computer confirms Stop.'
                : 'Desktop view unavailable: this task is no longer active or the computer is disconnected.'
              : !visible || !inView
                ? 'Desktop capture paused while this view is hidden.'
                : message}
          </p>
          {paused && eligible && (
            <div className="mkoro-controls">
              <button type="button" onClick={() => setPaused(false)}>
                Retry desktop view
              </button>
            </div>
          )}
          {watching && frame && (
            <img
              alt={`Mkoro desktop on ${workerName}`}
              src={`data:${frame.mimeType};base64,${frame.data}`}
              width={frame.width}
              height={frame.height}
              onError={() => {
                setFrame(null);
                setMessage('The screenshot could not be displayed.');
              }}
            />
          )}
          {lastCapturedAt && (
            <small>
              Last screenshot:{' '}
              <time dateTime={lastCapturedAt}>{new Date(lastCapturedAt).toLocaleTimeString()}</time>
            </small>
          )}
          <small>
            Viewing does not send screenshots to Sina. Capture stops when you close or hide this
            view.
          </small>
        </div>
      )}
    </div>
  );
}
