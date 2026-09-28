import { useMemo } from 'react';
import { z } from 'zod';
import { Check, ChevronDown, FileText, LoaderCircle, Terminal, X } from 'lucide-react';
import {
  MkoroPendingPermissionSchema,
  type MkoroEvent,
  type MkoroTask,
} from '@workspace/api-zod/mkoro';
import { projectMkoroEvents, record, string } from './mkoro-transcript';

export function MkoroTurn({
  task,
  events,
  permissions,
  busy,
  canAct,
  onPermission,
}: {
  task: MkoroTask;
  events: MkoroEvent[];
  busy: boolean;
  canAct: boolean;
  permissions: z.infer<typeof MkoroPendingPermissionSchema>[];
  onPermission: (taskId: string, requestId: string, optionId: string) => void;
}) {
  const items = useMemo(() => projectMkoroEvents(events), [events]);
  return (
    <article className="mkoro-turn" aria-label="Mkoro conversation turn">
      <div className="mkoro-user-message">
        <span>You</span>
        <p>{task.message}</p>
      </div>
      <div className="mkoro-agent-message">
        <strong className="mkoro-speaker">Mkoro</strong>
        {items.map((item) =>
          item.kind === 'text' ? (
            <p className="mkoro-message-text" key={item.id}>
              {item.text}
            </p>
          ) : item.kind === 'artifact' ? (
            <div key={item.id} className="mkoro-file">
              <FileText size={16} aria-hidden />
              <div>
                <strong>{item.name}</strong>
                <p>{item.path || 'Saved on the connected computer.'}</p>
              </div>
            </div>
          ) : (
            <details key={item.id} className="mkoro-tool">
              <summary>
                {item.status === 'completed' ? (
                  <Check size={15} aria-hidden />
                ) : item.status === 'failed' || item.status === 'cancelled' ? (
                  <X size={15} aria-hidden />
                ) : (
                  <Terminal size={15} aria-hidden />
                )}
                <span>{item.title}</span>
                <small>{item.status.replaceAll('_', ' ')}</small>
                <ChevronDown size={13} aria-hidden />
              </summary>
              <pre>{item.text || 'No text output was returned for this action.'}</pre>
            </details>
          ),
        )}
        {task.status === 'waiting_permission' &&
          permissions.map((permission) => (
            <div
              key={permission.requestId}
              className="mkoro-permission"
              role="group"
              aria-label="Mkoro permission request"
            >
              <strong>Allow this action?</strong>
              <p>
                {string(
                  record(permission.toolCall).title,
                  'Mkoro needs your permission to continue.',
                )}
              </p>
              <details>
                <summary>View requested action</summary>
                <pre>
                  {string(record(permission.toolCall).argumentsPreview) ||
                    JSON.stringify(permission.toolCall ?? {}, null, 2)}
                </pre>
                {string(record(permission.toolCall).argumentsNotice) && (
                  <p>{string(record(permission.toolCall).argumentsNotice)}</p>
                )}
              </details>
              <div className="mkoro-permission-buttons">
                {permission.options
                  .filter((option) => option.kind === 'allow_once' || option.kind === 'reject_once')
                  .map((option) => (
                    <button
                      key={option.optionId}
                      type="button"
                      disabled={busy || !canAct || task.cancelRequested}
                      onClick={() => onPermission(task.id, permission.requestId, option.optionId)}
                    >
                      {option.kind === 'allow_once' ? 'Allow once' : 'Decline'}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        {task.connectionLost &&
        ['queued', 'running', 'waiting_permission'].includes(task.status) ? (
          <p className="mkoro-warning" role="status">
            Computer disconnected. The action outcome is unknown; it will not be automatically
            repeated.
          </p>
        ) : task.cancelRequested &&
          ['queued', 'running', 'waiting_permission'].includes(task.status) ? (
          <p className="mkoro-task-status" role="status">
            Stop requested. Waiting for the computer to confirm.
          </p>
        ) : task.status === 'queued' || task.status === 'running' ? (
          <p className="mkoro-task-status" role="status">
            <LoaderCircle className="mkoro-spin" size={14} aria-hidden />
            {task.status === 'queued' ? 'Waiting for the connected computer…' : 'Working…'}
          </p>
        ) : task.status === 'failed' ? (
          <p className="mkoro-warning" role="status">
            {task.error || 'The task could not be completed.'}
          </p>
        ) : task.status === 'cancelled' ? (
          <p className="mkoro-task-status" role="status">
            Stopped. Actions already performed have not been undone.
          </p>
        ) : task.status === 'completed' ? (
          <p className="mkoro-task-status">
            Turn finished · Check the result and any remaining questions above.
          </p>
        ) : null}
      </div>
    </article>
  );
}
