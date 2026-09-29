import { useState } from 'react';
import { useAtom } from 'jotai';
import { Copy, Monitor, RefreshCw, X } from 'lucide-react';
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
  const [copied, setCopied] = useState(false);
  const canExecute = !!workspaceContext && permits(workspaceContext.workspace.role, 'execute');
  const worker = connection.worker;
  const pairingExpired = !!actions.pairing && Date.parse(actions.pairing.expiresAt) <= Date.now();
  const setupCommand = `New-Item -ItemType Directory -Force "$env:USERPROFILE\\Mkoro" | Out-Null\nnode scripts/mkoro/companion.mjs --server '${window.location.origin}' --workspace "$env:USERPROFILE\\Mkoro"`;
  return (
    <div className="mkoro-panel mkoro-settings-body">
      <div className="mkoro-connection-bar">
        <Monitor size={15} aria-hidden />
        {connection.workers.length ? (
          <select
            aria-label="Mkoro computer"
            value={connection.workerId}
            disabled={!canExecute || actions.busy}
            onChange={(event) => connection.setWorkerId(event.target.value)}
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
        Sina delegates computer tasks here when a platform tool cannot do the work. Keep the
        companion running on the selected computer.
      </p>
      {worker?.status === 'online' && !worker.capabilities.includes('sina-delegation-v1') && (
        <p className="mkoro-warning" role="status">
          Update and restart the companion on this computer before Sina can delegate tasks.
        </p>
      )}
      {worker && !worker.capabilities.includes('desktop-screenshots-v1') && (
        <p className="mkoro-notice">
          Desktop screenshots require an updated companion running in the same Windows session as
          Goose.
        </p>
      )}
      <div className="mkoro-controls">
        <button
          type="button"
          disabled={!canExecute || actions.busy}
          onClick={() => {
            setCopied(false);
            void actions.createPairing();
          }}
        >
          Connect a computer
        </button>
        {worker && worker.status !== 'revoked' && (
          <button
            type="button"
            disabled={!canExecute || actions.busy}
            onClick={() => void actions.revoke(worker.id)}
          >
            Disconnect {worker.name}
          </button>
        )}
      </div>
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
      {actions.pairing && (
        <div className="mkoro-pairing" role="region" aria-label="Pair your computer">
          <button
            type="button"
            className="mkoro-icon-button mkoro-close"
            aria-label="Hide pairing code"
            onClick={actions.clearPairing}
          >
            <X size={15} />
          </button>
          <strong>Pair your computer</strong>
          <p>
            From your Inscope project folder, run this in PowerShell. Install Node.js and configure
            the Goose CLI with a model first.
          </p>
          <pre>{setupCommand}</pre>
          <p>
            Paste the code only into the companion when prompted. It links that computer to your
            account in this workspace.
          </p>
          <label>
            Pairing code
            <input
              readOnly
              value={
                pairingExpired ? 'Expired — generate a new code' : actions.pairing.pairingToken
              }
              onFocus={(event) => event.currentTarget.select()}
            />
          </label>
          <button
            type="button"
            disabled={pairingExpired}
            onClick={() =>
              void navigator.clipboard.writeText(actions.pairing?.pairingToken ?? '').then(
                () => setCopied(true),
                () => setCopied(false),
              )
            }
          >
            <Copy size={13} aria-hidden />
            {copied ? 'Copied' : 'Copy code'}
          </button>
          <small>
            Expires {new Date(actions.pairing.expiresAt).toLocaleTimeString()} · Single use
          </small>
        </div>
      )}
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
            Connect a computer for tasks Sina delegates. All new requests stay in your Sina chat.
          </DialogDescription>
        </DialogHeader>
        <ComputerSettingsBody />
      </DialogContent>
    </Dialog>
  );
}
