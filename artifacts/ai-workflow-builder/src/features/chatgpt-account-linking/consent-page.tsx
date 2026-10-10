import { useEffect, useState } from 'react';
import { AccessNotice } from './access-notice';
import {
  accountLinkingPath,
  consentSchema,
  decisionSchema,
  LinkingError,
  linkingRequest,
  scopeAccess,
  type Consent,
} from './api';

export function ConsentPage() {
  const query = new URLSearchParams(window.location.search);
  const requestId = query.getAll('request').length === 1 ? (query.get('request') ?? '') : '';
  const validRequest = /^[A-Za-z0-9_-]{43}$/.test(requestId);
  const [consent, setConsent] = useState<Consent | null>(null);
  const [workspaceId, setWorkspaceId] = useState('');
  const [error, setError] = useState<unknown>(null);
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    setConsent(null);
    setError(null);
    setWorkspaceId('');
    if (!validRequest) {
      setError(new LinkingError(404, 'The account-linking request is invalid.'));
      return;
    }
    void linkingRequest(`/requests/${encodeURIComponent(requestId)}`, { signal: controller.signal })
      .then((value) => {
        const next = consentSchema.parse(value);
        if (next.request.id !== requestId) throw new Error('Unexpected authorization request.');
        if (!controller.signal.aborted) setConsent(next);
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure);
      });
    return () => controller.abort();
  }, [requestId, validRequest, attempt]);

  async function decide(decision: 'allow' | 'deny') {
    if (!consent || busy || (decision === 'allow' && !workspaceId)) return;
    setBusy(true);
    try {
      const response = decisionSchema.parse(
        await linkingRequest(`/requests/${encodeURIComponent(requestId)}/decision`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ decision, ...(decision === 'allow' ? { workspaceId } : {}) }),
        }),
      );
      // Only the validated server response supplies the callback; query parameters never do.
      window.location.assign(response.redirectUrl);
    } catch (failure) {
      setConsent(null);
      setError(failure);
      setBusy(false);
    }
  }
  if (error)
    return <AccessNotice error={error} standalone retry={() => setAttempt((value) => value + 1)} />;
  if (!consent)
    return (
      <p role="status" className="p-6">
        Checking the account-linking request…
      </p>
    );
  const expired = Date.parse(consent.request.expiresAt) <= Date.now();
  const access = scopeAccess(consent.request.scope);
  return (
    <main className="mx-auto w-full max-w-xl space-y-5 rounded-xl border bg-card p-6 text-foreground shadow-sm">
      <div>
        <p className="text-sm text-muted-foreground">InScope account linking</p>
        <h1 className="mt-1 text-xl font-semibold">Connect InScope to ChatGPT</h1>
      </div>
      <p>
        <strong>{consent.request.clientName}</strong> requests {access.label.toLowerCase()} access
        to one workspace.
      </p>
      <p className="text-sm">
        Signed in as {consent.account.name ?? consent.account.email ?? consent.account.id}
        {consent.account.name && consent.account.email ? ` (${consent.account.email})` : ''}.
      </p>
      <label className="block space-y-2 text-sm">
        <span>Workspace to share</span>
        <select
          aria-label="Workspace to share"
          value={workspaceId}
          disabled={busy}
          onChange={(event) => setWorkspaceId(event.target.value)}
          className="w-full rounded border bg-background p-2"
        >
          <option value="" disabled>
            Choose a workspace…
          </option>
          {consent.workspaces.map((workspace) => (
            <option key={workspace.id} value={workspace.id}>
              {workspace.name} ({workspace.role})
            </option>
          ))}
        </select>
      </label>
      {!consent.workspaces.length && (
        <p role="status">
          This account has no eligible workspaces for the requested access.{' '}
          {access.write || access.execute
            ? 'Changing inputs or executing requires a current owner or editor role.'
            : 'Ask a workspace owner for access before linking.'}
        </p>
      )}
      <div className="space-y-2 rounded-lg bg-muted p-4 text-sm">
        <p>
          ChatGPT can list saved workflows and runs, inspect exact saved versions, and read block
          configurations and recorded results in the selected workspace.
        </p>
        {access.write && (
          <p>
            Change inputs: create a paused working run, review and apply its input changes and
            source file replacements in this workspace. Applying a change does not automatically run
            calculations.
          </p>
        )}
        {access.execute && (
          <p>
            Execute: calculate or recalculate a selected workflow run after an explicit execution
            request. This is separate from changing inputs and does not approve results.
          </p>
        )}
        {!access.write && !access.execute ? (
          <p>It cannot edit, execute, approve, or save workflows through this connection.</p>
        ) : (
          <p>
            Owner or editor membership is checked for each change or execution. This consent does
            not run a workflow or approve any result. Existing read-only connections stay read-only.
          </p>
        )}
        <p>
          Access expires after {consent.request.grantDurationDays} days. You can revoke it sooner in
          Connections → ChatGPT access.
        </p>
        <p>
          Revoking stops future access. It does not remove information already copied into a ChatGPT
          conversation.
        </p>
      </div>
      <p className="text-xs text-muted-foreground">
        This approval request expires {new Date(consent.request.expiresAt).toLocaleString()}.
      </p>
      {expired && (
        <p role="alert">This request has expired. Start account linking again from ChatGPT.</p>
      )}
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={busy || expired || !workspaceId}
          className="rounded bg-primary px-4 py-2 text-primary-foreground disabled:opacity-50"
          onClick={() => void decide('allow')}
        >
          {busy
            ? 'Returning to ChatGPT…'
            : access.write || access.execute
              ? 'Allow requested access'
              : 'Allow read-only access'}
        </button>
        <button
          type="button"
          disabled={busy || expired}
          className="rounded border px-4 py-2 disabled:opacity-50"
          onClick={() => void decide('deny')}
        >
          Deny
        </button>
      </div>
      <a href={accountLinkingPath('connections')} className="inline-block text-sm underline">
        Manage existing ChatGPT access
      </a>
    </main>
  );
}
