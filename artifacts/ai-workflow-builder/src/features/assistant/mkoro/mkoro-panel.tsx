import { useState } from 'react';
import { useAtom } from 'jotai';
import { Monitor, RefreshCw } from 'lucide-react';
import { permits } from '@workspace/api-zod/access';
import { workspaceContext } from '@/platform/auth/workspace-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/ui/dialog';
import { MkoroConversationActivity } from './mkoro-chat-tasks';
import { MkoroPairing } from './mkoro-pairing';
import { useMkoroConversations } from './use-mkoro-history';
import { mkoroSettingsOpenAtom, useMkoroActions, useMkoroConnection } from './use-mkoro';
import './mkoro.css';

function ComputerSettingsBody() {
  const connection = useMkoroConnection();
  const actions = useMkoroActions();
  const legacy = useMkoroConversations(null, true);
  const [selectedHistory, setSelectedHistory] = useState('');
  const selectedConversation = legacy.conversations.find(
    (conversation) => conversation.id === selectedHistory,
  );
  const [reconnecting, setReconnecting] = useState('');
  const [revokeId, setRevokeId] = useState('');
  const canExecute = !!workspaceContext && permits(workspaceContext.workspace.role, 'execute');
  const worker = connection.worker;
  const revoked = connection.workers.filter((item) => item.status === 'revoked');
  const startPairing = (name = '') => {
    setReconnecting(name);
    actions.clearPairing();
    void actions.createPairing();
  };
  return (
    <div className="mkoro-panel mkoro-settings-body">
      <div className="mkoro-connection-bar">
        <Monitor size={15} aria-hidden />
        {connection.workers.length ? (
          <select
            aria-label="Mkoro computer"
            value={connection.workerId}
            disabled={!canExecute || actions.busy}
            onChange={(event) => {
              setRevokeId('');
              connection.setWorkerId(event.target.value);
            }}
          >
            <option value="">Choose a computer</option>
            {connection.workers.map((item) => (
              <option key={item.id} value={item.id} disabled={item.status === 'revoked'}>
                {item.name} · {item.status}
              </option>
            ))}
          </select>
        ) : (
          <span>{connection.loading ? 'Checking connection…' : 'No computer connected'}</span>
        )}
        <span
          className={`mkoro-connection-state ${worker?.status === 'online' && !connection.readError ? 'is-online' : ''}`}
        >
          {connection.readError ? 'Unverified' : (worker?.status ?? 'Offline')}
        </span>
        <button
          className="mkoro-icon-button"
          aria-label="Refresh Mkoro status"
          type="button"
          onClick={connection.refresh}
        >
          <RefreshCw size={15} />
        </button>
      </div>
      <p>
        Use Sina chat on this computer. Mkoro’s companion and Goose run on the computer doing the
        work, such as your Surface. Keep that computer awake and its companion running.
      </p>
      {worker && worker.status !== 'revoked' && !connection.readError && (
        <p role="status">
          {worker.status !== 'online'
            ? 'Offline — start the companion on the Goose computer and check its connection log.'
            : worker.capabilities.includes('sina-delegation-v1')
              ? 'Delegation ready — the companion is online and supports Sina tasks. Goose tools are checked when a task runs.'
              : 'Connected — companion update required before delegation.'}
        </p>
      )}
      {worker?.status === 'online' && !worker.capabilities.includes('sina-delegation-v1') && (
        <p className="mkoro-warning" role="status">
          Update the complete Mkoro companion folder on the computer running Goose, then restart its
          launcher. Keep its existing server or relay address. There is no delegation switch to
          enable.
        </p>
      )}
      {worker && !worker.capabilities.includes('desktop-screenshots-v1') && (
        <p className="mkoro-notice">
          Desktop screenshots require an updated companion running in the same Windows session as
          Goose.
        </p>
      )}
      <div className="mkoro-controls">
        {worker && worker.status !== 'revoked' && (
          <label>
            <input
              type="checkbox"
              checked={worker.autoApprove ?? false}
              disabled={!canExecute || actions.busy || !!connection.readError}
              onChange={(event) =>
                void actions.setAutomaticApproval(worker.id, event.target.checked)
              }
            />
            Automatically approve Mkoro tools on this computer
            <small>
              {' '}
              Covers browser, file and shell actions in delegated tasks, including pending requests.
              Stop remains available. Turning this off does not undo actions already approved.
            </small>
          </label>
        )}
        <button type="button" disabled={!canExecute || actions.busy} onClick={() => startPairing()}>
          Connect a computer
        </button>
        {worker && worker.status !== 'revoked' && (
          <button
            type="button"
            disabled={!canExecute || actions.busy}
            onClick={() => setRevokeId(worker.id)}
          >
            Revoke access to {worker.name}
          </button>
        )}
      </div>
      {worker && worker.status !== 'revoked' && revokeId === worker.id && (
        <section className="mkoro-warning" aria-label="Confirm revocation">
          <p>
            Revoking {worker.name} invalidates its saved connection credential. Reconnecting
            requires a fresh code on the Goose computer. Saved task history remains available. To
            pause work, use Stop on the task instead.
          </p>
          <button
            type="button"
            disabled={!canExecute || actions.busy}
            onClick={() => void actions.revoke(worker.id)}
          >
            Confirm revoke access
          </button>
          <button type="button" onClick={() => setRevokeId('')}>
            Keep connected
          </button>
        </section>
      )}
      {revoked.length > 0 && (
        <section aria-label="Revoked computers">
          <strong>Reconnect a revoked computer</strong>
          <p>
            These entries cannot receive tasks. Pair again to create a new connection for the same
            computer.
          </p>
          <div className="mkoro-controls">
            {revoked.map((item) => (
              <button
                key={item.id}
                type="button"
                disabled={!canExecute || actions.busy}
                onClick={() => startPairing(item.name)}
              >
                Reconnect {item.name}
              </button>
            ))}
          </div>
        </section>
      )}
      {!canExecute && (
        <p className="mkoro-notice">
          Viewer access: you can read your saved history. Connecting, controlling or viewing a
          computer requires Owner or Editor access.
        </p>
      )}
      {(connection.readError || actions.error) && (
        <div className="mkoro-warning" role="alert">
          {connection.readError || actions.error}
          <button type="button" onClick={connection.refresh}>
            Check again
          </button>
        </div>
      )}
      <MkoroPairing
        key={actions.pairing?.pairingToken}
        actions={actions}
        computerName={reconnecting}
      />
      <details className="mkoro-connections">
        <summary>Test delegation and watch the browser</summary>
        <p>
          Ask Sina to delegate opening example.com in a visible browser and report its heading.
          While the task is active, choose “View Mkoro’s computer” on its chat card and review tool
          requests with “Allow once”. Keep the Goose computer unlocked with its browser visible.
        </p>
        <p>The view shows refreshed desktop screenshots and ends when the task finishes.</p>
      </details>
      <details className="mkoro-connections">
        <summary>Computer task history</summary>
        <p>
          Saved computer tasks remain available even if their Sina chat was removed. No new
          messages; existing tasks can still be stopped or approved.
        </p>
        {legacy.error && <p role="alert">{legacy.error}</p>}
        <label>
          Saved computer conversations
          <select
            aria-label="Saved computer conversations"
            value={selectedHistory}
            onChange={(event) => setSelectedHistory(event.target.value)}
          >
            <option value="">Choose a computer conversation</option>
            {legacy.conversations.map((conversation) => (
              <option key={conversation.id} value={conversation.id}>
                {conversation.title}
              </option>
            ))}
          </select>
        </label>
        {selectedConversation && (
          <MkoroConversationActivity
            key={selectedHistory}
            id={selectedHistory}
            threadId={selectedConversation.threadId}
            historyOnly
          />
        )}
      </details>
    </div>
  );
}

export function MkoroComputerSettings() {
  const [open, setOpen] = useAtom(mkoroSettingsOpenAtom);
  const connection = useMkoroConnection();
  const status = connection.readError
    ? 'Unverified'
    : (connection.worker?.status ?? 'Not connected');
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="mkoro-settings-trigger"
          aria-label="Mkoro computer settings"
        >
          <Monitor size={15} aria-hidden />
          <span>Mkoro computer</span>
          <small>{status}</small>
        </button>
      </DialogTrigger>
      <DialogContent className="mkoro-settings-dialog">
        <DialogHeader>
          <DialogTitle>Mkoro computer</DialogTitle>
          <DialogDescription>
            Connect the computer running Goose to Sina. Pairing, readiness and recovery are managed
            here.
          </DialogDescription>
        </DialogHeader>
        <ComputerSettingsBody />
      </DialogContent>
    </Dialog>
  );
}
