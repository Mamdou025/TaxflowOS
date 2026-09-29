import { useCallback, useEffect, useState } from 'react';
import { atom, useSetAtom } from 'jotai';
import { z } from 'zod';
import { RefreshCw, Square } from 'lucide-react';
import { permits } from '@workspace/api-zod/access';
import {
  MkoroConversationDetailSchema,
  type MkoroEvent,
  type MkoroTask,
} from '@workspace/api-zod/mkoro';
import { workspaceContext } from '@/platform/auth/workspace-context';
import { useMkoroConversation, useMkoroConversations } from './use-mkoro-history';
import { mkoroTaskIsActive, useMkoroActions, useMkoroConnection } from './use-mkoro';
import { MkoroTurn } from './mkoro-turn';
import { MkoroScreen } from './mkoro-screen';
import './mkoro.css';

type Detail = z.infer<typeof MkoroConversationDetailSchema>;
type Progress = {
  threadId: string | null;
  tasks: MkoroTask[];
  events: MkoroEvent[];
  readError: string;
  verified: boolean;
};
const emptyProgress: Progress = {
  threadId: null,
  tasks: [],
  events: [],
  readError: '',
  verified: false,
};
export const mkoroThreadProgressAtom = atom<Progress>(emptyProgress);

export function MkoroConversationActivity({
  id,
  threadId,
  onStatus,
  onReviewTask,
  historyOnly = false,
}: {
  id: string;
  threadId: string | null;
  onStatus?: (id: string, detail: Detail | null, error: string) => void;
  onReviewTask?: (taskId: string) => void;
  historyOnly?: boolean;
}) {
  const history = useMkoroConversation(id, threadId);
  const connection = useMkoroConnection();
  const actions = useMkoroActions();
  const canExecute = !!workspaceContext && permits(workspaceContext.workspace.role, 'execute');
  const canAct = canExecute && !history.error && !connection.readError && !connection.loading;
  useEffect(() => {
    onStatus?.(id, history.detail, history.error);
  }, [id, history.detail, history.error, onStatus]);
  return (
    <div className="mkoro-activity">
      {(history.error || actions.error || history.earlierError) && (
        <p className="mkoro-warning" role="alert">
          {history.error || actions.error || history.earlierError}
        </p>
      )}
      {history.detail?.eventsTruncated && (
        <div className="mkoro-controls">
          <button
            type="button"
            disabled={history.loadingEarlier}
            onClick={() => void history.loadEarlier()}
          >
            Load earlier activity
          </button>
          <span>Earlier activity is saved.</span>
        </div>
      )}
      {history.detail?.tasksTruncated && (
        <p className="mkoro-notice">Showing the latest 100 tasks in this conversation.</p>
      )}
      {history.detail?.tasks.map((task) => {
        const worker = connection.workers.find((candidate) => candidate.id === task.workerId);
        return (
          <div key={task.id} className="mkoro-task-card" data-task-id={task.id}>
            <div className="mkoro-task-computer">
              Computer: {worker?.name ?? 'Previously connected computer'} ·{' '}
              {connection.readError ? 'Unverified' : (worker?.status ?? 'Unavailable')}
            </div>
            <MkoroTurn
              task={task}
              events={history.detail?.events.filter((event) => event.taskId === task.id) ?? []}
              permissions={
                history.detail?.pendingPermissions.filter(
                  (permission) => permission.taskId === task.id,
                ) ?? []
              }
              delegated={threadId !== null}
              busy={actions.busy}
              canAct={canAct}
              onPermission={(taskId, requestId, optionId) =>
                void actions.permission(taskId, requestId, optionId)
              }
            />
            {mkoroTaskIsActive(task.status) && (
              <div className="mkoro-controls">
                <button
                  type="button"
                  disabled={!canAct || actions.busy || task.cancelRequested}
                  onClick={() => void actions.cancel(task.id)}
                >
                  <Square size={12} aria-hidden />
                  {task.cancelRequested ? 'Stopping…' : 'Stop Mkoro task'}
                </button>
              </div>
            )}
            {threadId !== null && !historyOnly && (
              <>
                <MkoroScreen
                  task={task}
                  canView={
                    canAct &&
                    worker?.status === 'online' &&
                    worker.capabilities.includes('desktop-screenshots-v1')
                  }
                  workerName={worker?.name ?? 'Connected computer'}
                />
                {mkoroTaskIsActive(task.status) &&
                  worker?.status === 'online' &&
                  !worker.capabilities.includes('desktop-screenshots-v1') && (
                    <p className="mkoro-notice">
                      Update the companion on this computer to enable screenshots.
                    </p>
                  )}
                {!mkoroTaskIsActive(task.status) && onReviewTask && (
                  <div className="mkoro-controls">
                    <button type="button" disabled={!canAct} onClick={() => onReviewTask(task.id)}>
                      Ask Sina about this result
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

function BoundTasks({
  threadId,
  onReviewTask,
}: {
  threadId: string;
  onReviewTask?: (taskId: string) => void;
}) {
  const { conversations, error, loading } = useMkoroConversations(threadId);
  const connection = useMkoroConnection();
  const [details, setDetails] = useState<Record<string, { detail: Detail | null; error: string }>>(
    {},
  );
  const setProgress = useSetAtom(mkoroThreadProgressAtom);
  const onStatus = useCallback((id: string, detail: Detail | null, readError: string) => {
    setDetails((previous) => ({ ...previous, [id]: { detail, error: readError } }));
  }, []);
  useEffect(() => {
    const current = conversations.map((conversation) => details[conversation.id]);
    const readError =
      error || connection.readError || current.find((item) => item?.error)?.error || '';
    const verified =
      !loading && !connection.loading && !readError && current.every((item) => !!item?.detail);
    setProgress({
      threadId,
      verified,
      readError,
      tasks: verified ? current.flatMap((item) => item.detail?.tasks ?? []) : [],
      events: verified ? current.flatMap((item) => item.detail?.events ?? []) : [],
    });
  }, [
    conversations,
    details,
    error,
    loading,
    connection.loading,
    connection.readError,
    setProgress,
    threadId,
  ]);
  useEffect(() => () => setProgress(emptyProgress), [setProgress]);
  if (!conversations.length && !error) return null;
  return (
    <section className="mkoro-chat-tasks" aria-label="Mkoro tasks in this chat">
      <header>
        <strong>Mkoro · Computer tasks</strong>
        <button
          className="mkoro-icon-button"
          type="button"
          aria-label="Refresh Mkoro task progress"
          onClick={connection.refresh}
        >
          <RefreshCw size={14} />
        </button>
      </header>
      {(error || connection.readError) && (
        <p className="mkoro-warning" role="alert">
          {error || connection.readError}
        </p>
      )}
      {conversations.map((conversation) => (
        <MkoroConversationActivity
          key={conversation.id}
          id={conversation.id}
          threadId={threadId}
          onStatus={onStatus}
          onReviewTask={onReviewTask}
        />
      ))}
    </section>
  );
}

export function MkoroChatTasks({
  threadId,
  onReviewTask,
}: {
  threadId: string | null;
  onReviewTask?: (taskId: string) => void;
}) {
  const setProgress = useSetAtom(mkoroThreadProgressAtom);
  useEffect(() => {
    if (!threadId) setProgress(emptyProgress);
  }, [threadId, setProgress]);
  return threadId ? (
    <BoundTasks key={threadId} threadId={threadId} onReviewTask={onReviewTask} />
  ) : null;
}
