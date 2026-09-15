import { useState } from 'react';
import {
  MemberListSchema,
  WorkspaceSchema,
  type Workspace,
  type WorkspaceRole,
} from '@workspace/api-zod/access';
import { apiJSON } from '../api-fetch';
import { activateWorkspace, forgetSession } from '../workspace-context';

type Member = { userId: string; name: string | null; role: WorkspaceRole };
export function WorkspaceMenu({
  userId,
  workspaces,
  active,
}: {
  userId: string;
  workspaces: Workspace[];
  active?: Workspace;
}) {
  const [name, setName] = useState('');
  const [account, setAccount] = useState('');
  const [role, setRole] = useState('viewer');
  const [members, setMembers] = useState<Member[]>([]);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError('');
    try {
      await action();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'The operation failed.');
    } finally {
      setBusy(false);
    }
  }
  const json = (body: unknown) => ({
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  async function loadMembers() {
    const result = await apiJSON(`/api/workspaces/${active?.id}/members`);
    setMembers(MemberListSchema.parse(result).members);
  }
  return (
    <details
      open={!active}
      className={
        active
          ? 'fixed right-3 top-2 z-50 max-w-sm rounded-lg border bg-background p-2 text-sm shadow'
          : 'w-full max-w-md rounded-xl border bg-card p-6 text-sm shadow'
      }
    >
      <summary className="cursor-pointer">
        {active ? `Workspace: ${active.name} (${active.role})` : 'Choose a workspace'}
      </summary>
      <div className="mt-3 max-h-[75dvh] space-y-3 overflow-auto">
        <label className="block">
          Open workspace
          <select
            aria-label="Open workspace"
            value={active?.id ?? ''}
            className="ml-2 rounded border p-1"
            onChange={(e) => {
              const chosen = workspaces.find((w) => w.id === e.target.value);
              if (chosen) activateWorkspace(userId, chosen);
            }}
          >
            <option value="" disabled>
              Select…
            </option>
            {workspaces.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.role})
              </option>
            ))}
          </select>
        </label>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void run(async () => {
              const created = WorkspaceSchema.parse(
                await apiJSON('/api/workspaces', { method: 'POST', ...json({ name }) }),
              );
              activateWorkspace(userId, created);
            });
          }}
        >
          <input
            aria-label="New workspace name"
            placeholder="New workspace name"
            className="min-w-0 rounded border p-1"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            required
          />
          <button disabled={busy} className="rounded border px-2" type="submit">
            Create workspace
          </button>
        </form>
        <label className="block text-xs">
          Your account ID
          <input
            aria-label="Your account ID"
            readOnly
            value={userId}
            className="mt-1 w-full rounded border p-1"
          />
        </label>
        {active?.role === 'owner' && (
          <div className="space-y-2 border-t pt-2">
            <p>
              Share access with an existing account using its account ID. Email addresses are not
              verified for membership.
            </p>
            <input
              aria-label="Member account ID"
              placeholder="Member account ID"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="w-full rounded border p-1"
            />
            <select aria-label="Member role" value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="viewer">Viewer</option>
              <option value="editor">Editor</option>
              <option value="owner">Owner</option>
            </select>
            <button
              disabled={busy || !account.trim()}
              className="ml-2 underline"
              onClick={() =>
                void run(async () => {
                  await apiJSON(`/api/workspaces/${active.id}/members`, {
                    method: 'PUT',
                    ...json({ userId: account.trim(), role }),
                  });
                  await loadMembers();
                })
              }
            >
              Set member role
            </button>
            <button className="block underline" onClick={() => void run(loadMembers)}>
              Show members
            </button>
            {members.map((m) => (
              <div key={m.userId} className="flex justify-between gap-2">
                <span>
                  {m.name} — {m.role}
                </span>
                <button
                  disabled={busy}
                  onClick={() =>
                    void run(async () => {
                      await apiJSON(
                        `/api/workspaces/${active.id}/members/${encodeURIComponent(m.userId)}`,
                        { method: 'DELETE' },
                      );
                      await loadMembers();
                    })
                  }
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}
        <button
          className="underline"
          onClick={() =>
            void run(async () => {
              await apiJSON('/api/auth/sign-out', { method: 'POST', ...json({}) });
              forgetSession();
            })
          }
        >
          Sign out
        </button>
      </div>
    </details>
  );
}
