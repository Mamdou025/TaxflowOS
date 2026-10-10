import { useEffect, useState } from 'react';
import { AccessNotice } from './access-notice';
import {
  accountLinkingPath,
  errorMessage,
  grantsSchema,
  linkingRequest,
  scopeAccess,
  type Grant,
} from './api';

export function ChatGPTGrantsPanel({ standalone = false }: { standalone?: boolean }) {
  const [grants, setGrants] = useState<Grant[] | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [attempt, setAttempt] = useState(0);
  const [busy, setBusy] = useState('');
  const [feedback, setFeedback] = useState('');
  const [actionError, setActionError] = useState('');
  useEffect(() => {
    const controller = new AbortController();
    setGrants(null);
    setError(null);
    void linkingRequest('/grants', { signal: controller.signal })
      .then((value) => {
        const next = grantsSchema.parse(value);
        if (!controller.signal.aborted) setGrants(next.grants);
      })
      .catch((failure) => {
        if (!controller.signal.aborted) setError(failure);
      });
    return () => controller.abort();
  }, [attempt]);

  async function revoke(grant: Grant) {
    if (busy) return;
    setBusy(grant.id);
    setFeedback('');
    setActionError('');
    try {
      await linkingRequest(`/grants/${encodeURIComponent(grant.id)}`, { method: 'DELETE' });
      // A confirmed revocation can be removed locally; never invent a server timestamp.
      setGrants((current) => current?.filter((item) => item.id !== grant.id) ?? null);
      setFeedback(`ChatGPT access to ${grant.workspaceName} was revoked.`);
    } catch (failure) {
      setActionError(errorMessage(failure));
    } finally {
      setBusy('');
    }
  }

  return (
    <section
      aria-label="ChatGPT access"
      className="mt-6 space-y-4 rounded-2xl border bg-card p-4 text-foreground"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-semibold">ChatGPT access</h2>
        <button
          type="button"
          className="rounded border px-3 py-1 text-sm"
          disabled={!!busy}
          onClick={() => setAttempt((value) => value + 1)}
        >
          Refresh access
        </button>
      </div>
      <p className="text-sm text-muted-foreground">
        Manage the ChatGPT connections authorized by your account. Revoking stops future access;
        information already copied into a conversation remains there.
      </p>
      {error ? (
        <AccessNotice
          error={error}
          standalone={standalone}
          retry={() => setAttempt((value) => value + 1)}
        />
      ) : grants === null ? (
        <p role="status" className="text-sm">
          Loading ChatGPT access…
        </p>
      ) : (
        <>
          {!grants.length && (
            <p className="text-sm">No ChatGPT access grants are listed for this account.</p>
          )}
          <ul className="space-y-3">
            {grants.map((grant) => {
              const expired = Date.parse(grant.expiresAt) <= Date.now();
              return (
                <li key={grant.id} className="space-y-2 rounded-lg border p-3 text-sm">
                  <p className="font-semibold">{grant.clientName}</p>
                  <p>
                    {grant.workspaceName} · {scopeAccess(grant.scope).label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Linked {new Date(grant.createdAt).toLocaleString()} · Expires{' '}
                    {new Date(grant.expiresAt).toLocaleString()}
                  </p>
                  {grant.revokedAt ? (
                    <p>Revoked {new Date(grant.revokedAt).toLocaleString()}</p>
                  ) : expired ? (
                    <p>Expired</p>
                  ) : (
                    <button
                      type="button"
                      disabled={!!busy}
                      className="rounded border px-3 py-2 disabled:opacity-50"
                      aria-label={`Revoke ChatGPT access to ${grant.workspaceName}`}
                      onClick={() => void revoke(grant)}
                    >
                      {busy === grant.id ? 'Revoking…' : 'Revoke access'}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
      {feedback && (
        <p role="status" className="text-sm">
          {feedback}
        </p>
      )}
      {actionError && (
        <p role="alert" className="text-sm">
          {actionError}
        </p>
      )}
      {!standalone && (
        <a href={accountLinkingPath('connections')} className="inline-block text-sm underline">
          Open account access management
        </a>
      )}
    </section>
  );
}
