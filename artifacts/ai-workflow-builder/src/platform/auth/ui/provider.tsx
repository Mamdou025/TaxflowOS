import { useEffect, useState, type ReactNode } from 'react';
import { SessionSchema, WorkspaceListSchema, type Workspace } from '@workspace/api-zod/access';
import { apiFetch } from '../api-fetch';
import { workspaceContext, activateWorkspace, forgetSession } from '../workspace-context';
import { SignIn } from './sign-in';
import { WorkspaceMenu } from './workspace-menu';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{
    userId: string;
    workspaces: Workspace[];
    isDemo: boolean;
  } | null>();
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let cancelled = false;
    let checking = false;
    let pending: AbortController | undefined;
    async function refresh() {
      if (checking) return;
      checking = true;
      const controller = new AbortController();
      pending = controller;
      // Session and workspace verification are two sequential requests. Leave
      // room for both when the local frontend proxy is busy, but remain bounded.
      const timeout = setTimeout(() => controller.abort(), 30000);
      try {
        const session = await apiFetch('/api/session', { signal: controller.signal });
        if (session.status === 401) {
          if (!cancelled) {
            setError('');
            setState(null);
            if (workspaceContext) forgetSession();
          }
          return;
        }
        if (!session.ok) {
          if (!cancelled && session.status === 403) setState(undefined);
          throw new Error('The app service is temporarily unavailable. Please retry.');
        }
        const { user } = SessionSchema.parse(await session.json());
        const response = await apiFetch(user.isDemo ? '/api/workspaces/demo' : '/api/workspaces', {
          signal: controller.signal,
          ...(user.isDemo
            ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' }
            : {}),
        });
        if (response.status === 401) {
          if (!cancelled) {
            setError('');
            setState(null);
            if (workspaceContext) forgetSession();
          }
          return;
        }
        if (!response.ok) {
          if (!cancelled && response.status === 403) setState(undefined);
          throw new Error('Workspace access could not be verified.');
        }
        const { workspaces } = WorkspaceListSchema.parse(await response.json());
        if (cancelled) return;
        if (workspaceContext && workspaceContext.userId !== user.id) {
          forgetSession();
          return;
        }
        const active = workspaces.find((w) => w.id === workspaceContext?.workspace.id);
        if (user.isDemo && !active && workspaces[0]) {
          activateWorkspace(user.id, workspaces[0], true);
          return;
        }
        if (
          active &&
          (active.role !== workspaceContext?.workspace.role ||
            user.isDemo !== workspaceContext?.isDemo)
        ) {
          activateWorkspace(user.id, active, user.isDemo);
          return;
        }
        setState({ userId: user.id, workspaces, isDemo: user.isDemo });
        setError('');
      } catch (e) {
        if (!cancelled) {
          // A timeout/network/5xx failure is not proof of logout. Keep an already
          // verified tree mounted (but hidden and inert below) so retrying cannot
          // erase uploads, open editors or unsent drafts. Explicit denials above
          // still discard it, as do membership/account/role changes.
          setError(
            controller.signal.aborted
              ? 'The app service is taking too long to respond. Please retry.'
              : e instanceof Error
                ? e.message
                : 'Access could not be verified.',
          );
        }
      } finally {
        clearTimeout(timeout);
        checking = false;
      }
    }
    const focus = () => void refresh();
    const changed = (e: StorageEvent) => {
      if (e.key === 'taxflow:session-changed') {
        setState(undefined);
        window.location.reload();
      }
    };
    void refresh();
    window.addEventListener('focus', focus);
    window.addEventListener('storage', changed);
    const timer = setInterval(focus, 60000);
    return () => {
      cancelled = true;
      pending?.abort();
      clearInterval(timer);
      window.removeEventListener('focus', focus);
      window.removeEventListener('storage', changed);
    };
  }, [attempt]);
  if (error && !state)
    return (
      <SignIn
        accessError={error}
        onRetryAccess={() => {
          setError('');
          setAttempt((value) => value + 1);
        }}
      />
    );
  if (state === undefined)
    return <main className="grid h-dvh place-content-center">Checking access…</main>;
  if (state === null) return <SignIn />;
  const active = state.workspaces.find((w) => w.id === workspaceContext?.workspace.id);
  if (!active)
    return (
      <main className="grid h-dvh place-items-center bg-background p-6">
        <WorkspaceMenu userId={state.userId} workspaces={state.workspaces} />
      </main>
    );
  return (
    <>
      <div
        style={{ display: error ? 'none' : 'contents' }}
        inert={!!error}
        aria-hidden={error ? true : undefined}
      >
        {!state.isDemo && (
          <WorkspaceMenu userId={state.userId} workspaces={state.workspaces} active={active} />
        )}
        {active.role === 'viewer' && (
          <div
            role="status"
            className="fixed bottom-2 left-1/2 z-50 rounded border bg-background px-3 py-1 text-xs"
          >
            Viewer access: server data is read-only. Local previews cannot be saved.
          </div>
        )}
        {children}
      </div>
      {error && (
        <main
          role="alert"
          className="grid h-dvh place-content-center gap-4 bg-background p-6 text-center"
        >
          <h1 className="text-xl font-semibold">Connection interrupted</h1>
          <p>{error}</p>
          <p>
            Your workspace and drafts are kept in place. Access must be verified before you
            continue.
          </p>
          <button
            type="button"
            className="rounded border px-4 py-2"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Retry access check
          </button>
        </main>
      )}
    </>
  );
}
