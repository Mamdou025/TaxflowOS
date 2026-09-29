import { useState } from 'react';
import { Copy, X } from 'lucide-react';
import type { useMkoroActions } from './use-mkoro';

export function MkoroPairing({
  actions,
  computerName,
}: {
  actions: ReturnType<typeof useMkoroActions>;
  computerName: string;
}) {
  const [copied, setCopied] = useState(false);
  if (!actions.pairing) return null;
  const expired = Date.parse(actions.pairing.expiresAt) <= Date.now();
  const setupCommand = `node scripts/mkoro/companion.mjs --server '${window.location.origin}' --workspace "$env:USERPROFILE\\Mkoro"`;
  return (
    <section className="mkoro-pairing" aria-label="Pair your computer">
      <button
        type="button"
        className="mkoro-icon-button mkoro-close"
        aria-label="Hide pairing code"
        onClick={actions.clearPairing}
      >
        <X size={15} aria-hidden />
      </button>
      <strong>
        {computerName ? `Reconnect ${computerName}` : 'Pair the computer running Goose'}
      </strong>
      <ol>
        <li>
          On the computer running Goose (for example, your Surface), open its existing Mkoro
          companion folder or launcher.
        </li>
        <li>
          Stop the old companion, then run its original startup command with <code>--pair</code>{' '}
          added. Keep the same server or relay address, working folder, Goose path and state
          options.
        </li>
        <li>
          Paste the fresh code below into the companion’s private pairing prompt. Keep it out of
          Sina and Goose chat.
        </li>
        <li>
          Keep the companion running. Return here, refresh the list and select the new computer
          entry.
        </li>
      </ol>
      <p>
        Creating a code does not connect the computer. Wait for it to appear online with delegation
        ready.
        {computerName && ' The old entry stays revoked; its saved task history remains available.'}
      </p>
      <label>
        Pairing code
        <input
          readOnly
          value={expired ? 'Expired — generate a new code' : actions.pairing.pairingToken}
          onFocus={(event) => event.currentTarget.select()}
        />
      </label>
      <button
        type="button"
        disabled={expired}
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
      <button
        type="button"
        disabled={actions.busy}
        onClick={() => {
          setCopied(false);
          void actions.createPairing();
        }}
      >
        Generate a new code
      </button>
      <small>Expires {new Date(actions.pairing.expiresAt).toLocaleTimeString()} · Single use</small>
      <details>
        <summary>First installation on the Goose computer</summary>
        <p>
          Install the complete Mkoro companion bundle or copy the project’s scripts/mkoro folder
          there. Configure the Goose CLI with a model and browser tools, and create the working
          folder first. Run from the folder containing scripts/mkoro, using Node 24.21.0 or the
          bundle’s Node executable.
        </p>
        <pre>{setupCommand}</pre>
        <p>
          The server address must be reachable from that computer. If Inscope uses localhost on your
          chat computer, replace it with your configured reachable server or worker relay address.
          An existing installation should keep its original address.
        </p>
      </details>
    </section>
  );
}
