import { useState } from 'react';
import { apiFetch } from '@/platform/auth/api-fetch';
import { forgetSession } from '@/platform/auth/workspace-context';
import { SignIn } from '@/platform/auth/ui/sign-in';
import { accountLinkingPath, errorMessage, LinkingError } from './api';

export function AccessNotice({
  error,
  retry,
  standalone = false,
}: {
  error: unknown;
  retry: () => void;
  standalone?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  if (standalone && error instanceof LinkingError && error.status === 401)
    return <SignIn allowDemo={false} />;
  const status = error instanceof LinkingError ? error.status : 0;
  async function changeAccount() {
    setBusy(true);
    setSignOutError('');
    try {
      const response = await apiFetch('/api/auth/sign-out', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
        signal: AbortSignal.timeout(15000),
      });
      if (!response.ok) throw new Error('Sign-out failed.');
      forgetSession();
    } catch {
      setSignOutError('The account could not be signed out. Please retry.');
      setBusy(false);
    }
  }
  return (
    <div className="space-y-3 rounded-xl border bg-card p-4 text-sm">
      <p role="alert">
        {status === 503
          ? 'ChatGPT connection is unavailable or not configured.'
          : errorMessage(error)}
      </p>
      {status === 403 && (
        <p>
          This private pilot requires an eligible registered account. Demo accounts cannot link to
          ChatGPT.
        </p>
      )}
      {status === 404 && (
        <p>
          This request is unavailable, expired, or belongs to another sign-in session. Start account
          linking again from ChatGPT.
        </p>
      )}
      <button type="button" className="rounded border px-3 py-2" onClick={retry}>
        Retry access check
      </button>
      {standalone && status === 403 && (
        <button
          type="button"
          disabled={busy}
          className="ml-2 rounded border px-3 py-2"
          onClick={() => void changeAccount()}
        >
          {busy ? 'Signing out…' : 'Use a different account'}
        </button>
      )}
      {!standalone && (status === 401 || status === 403) && (
        <a className="ml-2 underline" href={accountLinkingPath('connections')}>
          Manage account access
        </a>
      )}
      {signOutError && <p role="alert">{signOutError}</p>}
    </div>
  );
}
