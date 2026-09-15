import { useState, type FormEvent } from 'react';
import { SessionSchema, WorkspaceListSchema } from '@workspace/api-zod/access';
import { apiFetch } from '../api-fetch';
import { activateWorkspace, forgetSession } from '../workspace-context';

export function SignIn({
  accessError,
  onRetryAccess,
}: {
  accessError?: string;
  onRetryAccess?: () => void;
}) {
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function enterDemo() {
    setBusy(true);
    setError('');
    try {
      const response = await apiFetch('/api/auth/sign-in/anonymous', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      if (!response.ok) {
        const body: unknown = await response.json().catch(() => null);
        // A startup outage can hide a valid guest session. Resume it; the
        // provider still verifies that session and workspace after reloading.
        const alreadyDemo =
          response.status === 400 &&
          body &&
          typeof body === 'object' &&
          'code' in body &&
          body.code === 'ANONYMOUS_USERS_CANNOT_SIGN_IN_AGAIN_ANONYMOUSLY';
        if (!alreadyDemo) throw new Error('The demo could not start. Please try again.');
      }
      // Complete demo provisioning before the single reload. Previously the
      // sign-in reloaded once, then AuthProvider created the workspace and
      // reloaded again. On a cold development build that left a blank page for
      // long enough to look like startup had failed.
      const sessionResponse = await apiFetch('/api/session');
      if (!sessionResponse.ok) throw new Error('The demo session could not be verified.');
      const { user } = SessionSchema.parse(await sessionResponse.json());
      if (!user.isDemo) throw new Error('The server did not create a demo session.');

      const workspaceResponse = await apiFetch('/api/workspaces/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{}',
      });
      if (!workspaceResponse.ok) throw new Error('The demo workspace could not be opened.');
      const { workspaces } = WorkspaceListSchema.parse(await workspaceResponse.json());
      const workspace = workspaces[0];
      if (!workspace) throw new Error('The server did not return a demo workspace.');
      activateWorkspace(user.id, workspace, true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The demo is unavailable.');
    } finally {
      setBusy(false);
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const data = new FormData(event.currentTarget);
    try {
      const response = await apiFetch(`/api/auth/${creating ? 'sign-up' : 'sign-in'}/email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.get('email'),
          password: data.get('password'),
          ...(creating ? { name: data.get('name') } : {}),
        }),
      });
      if (!response.ok) {
        const body: unknown = await response.json();
        const message =
          body && typeof body === 'object' && 'message' in body ? body.message : undefined;
        throw new Error(
          typeof message === 'string' ? message : 'Sign-in failed. Check your email and password.',
        );
      }
      forgetSession();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in is unavailable.');
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="grid min-h-dvh place-items-center bg-background p-6 text-foreground">
      <form
        onSubmit={submit}
        className="w-full max-w-sm space-y-4 rounded-xl border bg-card p-6 shadow-sm"
      >
        <h1 className="text-xl font-semibold">
          {creating ? 'Create your account' : 'Sign in to TaxflowOS'}
        </h1>
        <p className="text-sm text-muted-foreground">
          Try the app without credentials, or sign in to your workspace.
        </p>
        <div className="space-y-2 border-b pb-4">
          <button
            type="button"
            disabled={busy}
            onClick={() => void enterDemo()}
            className="w-full rounded bg-primary p-2 font-medium text-primary-foreground disabled:opacity-50"
          >
            Try demo
          </button>
          <p className="text-xs text-muted-foreground">
            No email or password needed. Explore in your own demo workspace. Export workflows before
            exiting; access depends on this browser session.
          </p>
        </div>
        {(error || accessError) && (
          <p role="alert" className="text-sm text-red-700">
            {error || accessError}
          </p>
        )}
        {accessError && onRetryAccess && (
          <button
            type="button"
            disabled={busy}
            className="text-sm underline"
            onClick={onRetryAccess}
          >
            Retry access check
          </button>
        )}
        {creating && (
          <label className="block text-sm">
            Name
            <input
              className="mt-1 w-full rounded border p-2"
              name="name"
              autoComplete="name"
              required
              maxLength={100}
            />
          </label>
        )}
        <label className="block text-sm">
          Email
          <input
            className="mt-1 w-full rounded border p-2"
            name="email"
            type="email"
            autoComplete="username"
            required
          />
        </label>
        <label className="block text-sm">
          Password
          <input
            className="mt-1 w-full rounded border p-2"
            name="password"
            type="password"
            autoComplete={creating ? 'new-password' : 'current-password'}
            minLength={12}
            required
          />
        </label>
        {creating && (
          <p className="text-xs text-muted-foreground">
            Use at least 12 characters. Workspace membership is granted separately by an Owner.
          </p>
        )}
        <button
          disabled={busy}
          className="w-full rounded border p-2 hover:bg-muted disabled:opacity-50"
          type="submit"
        >
          {busy ? 'Please wait…' : creating ? 'Create account' : 'Sign in'}
        </button>
        <button
          type="button"
          disabled={busy}
          className="text-sm underline"
          onClick={() => {
            setCreating(!creating);
            setError('');
          }}
        >
          {creating ? 'Use an existing account' : 'Create an account'}
        </button>
      </form>
    </main>
  );
}
