import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUp, Bot, Copy, Monitor, Plus, RefreshCw, Square, X } from 'lucide-react';
import { permits } from '@workspace/api-zod/access';
import { workspaceContext } from '@/platform/auth/workspace-context';
import { MkoroTurn } from './mkoro-turn';
import { mkoroTaskIsActive, useMkoro } from './use-mkoro';

export function MkoroPanel({ newChatKey }: { newChatKey: number }) {
  const mkoro = useMkoro();
  const [draft, setDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const previousNewChat = useRef(newChatKey);
  const scroll = useRef<HTMLDivElement>(null);
  const keepBottom = useRef(true);
  const worker = mkoro.workers.find((item) => item.id === mkoro.workerId);
  const canExecute = !!workspaceContext && permits(workspaceContext.workspace.role, 'execute');
  const activeTask = mkoro.detail?.tasks.find((task) => mkoroTaskIsActive(task.status));
  const canSend =
    canExecute &&
    !mkoro.busy &&
    !mkoro.loading &&
    !mkoro.readError &&
    worker?.status === 'online' &&
    !activeTask;
  const setupCommand = `New-Item -ItemType Directory -Force "$env:USERPROFILE\\Mkoro" | Out-Null\nnode scripts/mkoro/companion.mjs --server '${window.location.origin}' --workspace "$env:USERPROFILE\\Mkoro"`;

  useEffect(() => {
    if (newChatKey !== previousNewChat.current && !mkoro.busy) {
      previousNewChat.current = newChatKey;
      mkoro.selectConversation(null);
      setDraft('');
    }
  }, [newChatKey, mkoro]);
  useEffect(() => {
    if (keepBottom.current && scroll.current)
      scroll.current.scrollTop = scroll.current.scrollHeight;
  }, [mkoro.detail]);

  const send = async (event: FormEvent) => {
    event.preventDefault();
    if (!canSend || !draft.trim()) return;
    const message = draft.trim();
    if (await mkoro.send(message))
      setDraft((current) => (current.trim() === message ? '' : current));
  };
  const newConversation = () => {
    mkoro.selectConversation(null);
    setDraft('');
  };
  const pairingExpired = !!mkoro.pairing && Date.parse(mkoro.pairing.expiresAt) <= Date.now();

  return (
    <section className="mkoro-panel" aria-label="Mkoro chat">
      <header className="mkoro-header">
        <div className="mkoro-avatar">
          <Bot size={22} aria-hidden />
        </div>
        <div className="mkoro-heading">
          <h2>Mkoro</h2>
          <p>Computer assistant · Powered by Goose</p>
        </div>
        <button
          type="button"
          className="mkoro-icon-button"
          title="Refresh Mkoro status"
          aria-label="Refresh Mkoro status"
          onClick={mkoro.refresh}
        >
          <RefreshCw size={16} />
        </button>
        <button
          type="button"
          className="mkoro-icon-button"
          title="New Mkoro chat"
          aria-label="New Mkoro chat"
          disabled={mkoro.busy}
          onClick={newConversation}
        >
          <Plus size={18} />
        </button>
      </header>

      <div className="mkoro-connection-bar">
        <Monitor size={15} aria-hidden />
        {mkoro.workers.length > 0 ? (
          <select
            aria-label="Mkoro computer"
            value={mkoro.workerId}
            disabled={!!mkoro.selectedId || mkoro.busy}
            onChange={(event) => mkoro.setWorkerId(event.target.value)}
          >
            {mkoro.workers.map((item) => (
              <option value={item.id} key={item.id}>
                {item.name} · {item.status}
              </option>
            ))}
          </select>
        ) : (
          <span>{mkoro.loading ? 'Checking connection…' : 'No computer connected'}</span>
        )}
        <span
          className={`mkoro-connection-state ${worker?.status === 'online' && !mkoro.readError ? 'is-online' : ''}`}
        >
          {mkoro.readError ? 'Unverified' : (worker?.status ?? 'Offline')}
        </span>
      </div>

      <details className="mkoro-connections">
        <summary>Computer connection and chat history</summary>
        <p>
          Your computer runs the task. Messages and progress appear here. Keep the companion running
          while Mkoro works.
        </p>
        <div className="mkoro-controls">
          <button
            type="button"
            disabled={!canExecute || mkoro.busy}
            onClick={() => {
              setCopied(false);
              void mkoro.createPairing();
            }}
          >
            Connect a computer
          </button>
          {worker && worker.status !== 'revoked' && (
            <button
              type="button"
              disabled={!canExecute || mkoro.busy}
              onClick={() => void mkoro.revoke(worker.id)}
            >
              Disconnect {worker.name}
            </button>
          )}
        </div>
        <label>
          Saved Mkoro chats
          <select
            aria-label="Saved Mkoro chats"
            value={mkoro.selectedId ?? ''}
            disabled={mkoro.busy}
            onChange={(event) => {
              mkoro.selectConversation(event.target.value || null);
              setDraft('');
            }}
          >
            <option value="">New conversation</option>
            {mkoro.conversations.map((conversation) => (
              <option key={conversation.id} value={conversation.id}>
                {conversation.title}
              </option>
            ))}
          </select>
        </label>
      </details>

      {mkoro.pairing && (
        <div className="mkoro-pairing" role="region" aria-label="Pair your computer">
          <button
            type="button"
            className="mkoro-icon-button mkoro-close"
            aria-label="Hide pairing code"
            onClick={mkoro.clearPairing}
          >
            <X size={15} />
          </button>
          <strong>Pair your computer</strong>
          <p>
            From your Inscope project folder, run this in PowerShell. Goose CLI and Node.js must be
            installed, and Goose must have a configured model.
          </p>
          <pre>{setupCommand}</pre>
          <p>
            Paste this code only into the companion when prompted. It links that computer to your
            account in this workspace.
          </p>
          <label>
            Pairing code
            <input
              readOnly
              value={pairingExpired ? 'Expired — generate a new code' : mkoro.pairing.pairingToken}
              onFocus={(event) => event.currentTarget.select()}
            />
          </label>
          <button
            type="button"
            disabled={pairingExpired}
            onClick={() => {
              void navigator.clipboard.writeText(mkoro.pairing?.pairingToken ?? '').then(
                () => setCopied(true),
                () => setCopied(false),
              );
            }}
          >
            <Copy size={13} aria-hidden /> {copied ? 'Copied' : 'Copy code'}
          </button>
          <small>
            Expires {new Date(mkoro.pairing.expiresAt).toLocaleTimeString()} · Single use
          </small>
        </div>
      )}

      {(mkoro.error || mkoro.readError) && (
        <div className="mkoro-warning" role="alert">
          {mkoro.error || mkoro.readError}
          <button type="button" onClick={mkoro.refresh}>
            Check again
          </button>
        </div>
      )}
      {!canExecute && (
        <p className="mkoro-notice">
          Viewer access: you can read your saved chats. Connecting a computer or sending commands
          requires Owner or Editor access.
        </p>
      )}

      <div
        className="mkoro-transcript"
        ref={scroll}
        onScroll={() => {
          const element = scroll.current;
          if (element)
            keepBottom.current =
              element.scrollHeight - element.scrollTop - element.clientHeight < 100;
        }}
      >
        {mkoro.detail?.eventsTruncated && (
          <div className="mkoro-controls">
            <button
              type="button"
              disabled={mkoro.busy}
              onClick={() => {
                keepBottom.current = false;
                void mkoro.loadEarlier();
              }}
            >
              Load earlier activity
            </button>
            <span>Earlier messages and action details are saved.</span>
          </div>
        )}
        {mkoro.detail?.tasksTruncated && (
          <p className="mkoro-notice">Showing the latest 100 turns in this conversation.</p>
        )}
        {!mkoro.detail?.tasks.length ? (
          <div className="mkoro-empty">
            <div className="mkoro-empty-icon">
              <Bot size={30} aria-hidden />
            </div>
            <h3>Work with Mkoro here</h3>
            <p>
              Ask it to find a file, use your browser, or follow a saved procedure. Its actions and
              questions stay in this conversation.
            </p>
            {!worker || worker.status !== 'online' ? (
              <>
                <p>Connect your computer to get started. Goose runs there in the background.</p>
                <button
                  type="button"
                  className="mkoro-primary"
                  disabled={!canExecute || mkoro.busy}
                  onClick={() => {
                    setCopied(false);
                    void mkoro.createPairing();
                  }}
                >
                  Connect your computer
                </button>
              </>
            ) : (
              <div className="mkoro-suggestions">
                <button
                  type="button"
                  onClick={() =>
                    setDraft(
                      'Check your working folder and available tools. Report whether you can use my existing signed-in browser. Do not change any files.',
                    )
                  }
                >
                  Check browser and tools
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setDraft(
                      'Use the saved Drive-to-FAPI recipe in your Mkoro workspace. First verify the correct Google account and MKORO folder, then find the workbook, upload it to Inscope and run the existing FAPI workflow. Ask me for missing required choices and leave final human approval pending.',
                    )
                  }
                >
                  Use my Drive-to-FAPI recipe
                </button>
              </div>
            )}
          </div>
        ) : (
          mkoro.detail.tasks.map((task) => (
            <MkoroTurn
              key={task.id}
              task={task}
              events={mkoro.detail?.events.filter((event) => event.taskId === task.id) ?? []}
              permissions={
                mkoro.detail?.pendingPermissions.filter(
                  (permission) => permission.taskId === task.id,
                ) ?? []
              }
              busy={mkoro.busy}
              canAct={canExecute && !mkoro.readError}
              onPermission={(taskId, requestId, optionId) =>
                void mkoro.permission(taskId, requestId, optionId)
              }
            />
          ))
        )}
      </div>

      <form className="mkoro-composer" onSubmit={(event) => void send(event)}>
        <label className="sr-only" htmlFor="mkoro-message">
          Message Mkoro
        </label>
        <textarea
          id="mkoro-message"
          placeholder="Message Mkoro…"
          value={draft}
          maxLength={16000}
          onChange={(event) => setDraft(event.target.value)}
          rows={3}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
              event.preventDefault();
              if (canSend && draft.trim()) void send(event);
            }
          }}
        />
        <div className="mkoro-composer-footer">
          <span>
            {activeTask
              ? 'Follow the progress above'
              : worker?.status === 'online'
                ? 'Runs on your connected computer'
                : 'Computer offline'}
          </span>
          {activeTask ? (
            <button
              type="button"
              className="mkoro-stop"
              disabled={!canExecute || mkoro.busy || activeTask.cancelRequested}
              onClick={() => void mkoro.cancel(activeTask.id)}
            >
              <Square size={13} aria-hidden /> {activeTask.cancelRequested ? 'Stopping…' : 'Stop'}
            </button>
          ) : (
            <button
              type="submit"
              className="mkoro-send"
              aria-label="Send to Mkoro"
              disabled={!canSend || !draft.trim()}
            >
              <ArrowUp size={18} />
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
