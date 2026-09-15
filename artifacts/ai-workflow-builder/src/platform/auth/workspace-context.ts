import { WorkspaceSchema, type Workspace } from '@workspace/api-zod/access';

export const CONTEXT_KEY = 'taxflow:authenticated-workspace';
function readContext(): { userId: string; workspace: Workspace; isDemo: boolean } | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw: unknown = JSON.parse(sessionStorage.getItem(CONTEXT_KEY) ?? 'null');
    if (
      !raw ||
      typeof raw !== 'object' ||
      !('userId' in raw) ||
      typeof raw.userId !== 'string' ||
      !('workspace' in raw)
    )
      return null;
    return {
      userId: raw.userId,
      workspace: WorkspaceSchema.parse(raw.workspace),
      isDemo: 'isDemo' in raw && raw.isDemo === true,
    };
  } catch {
    return null;
  }
}
// Fixed for this page lifetime. Switching reloads all stores and pending UI state.
export const workspaceContext = readContext();
export function activateWorkspace(userId: string, workspace: Workspace, isDemo = false) {
  sessionStorage.setItem(CONTEXT_KEY, JSON.stringify({ userId, workspace, isDemo }));
  window.location.reload();
}
export function forgetSession(destination?: string) {
  sessionStorage.removeItem(CONTEXT_KEY);
  localStorage.setItem('taxflow:session-changed', String(Date.now()));
  if (destination) window.location.assign(destination);
  else window.location.reload();
}
export function workspaceStorageKey(key: string): string {
  if (!workspaceContext)
    throw new Error('Select an authenticated workspace before saving browser data.');
  return `taxflow:scope:${encodeURIComponent(workspaceContext.userId)}:${workspaceContext.workspace.id}:${key}`;
}
export const workspaceStorage = {
  getItem(key: string): string | null {
    return workspaceContext ? localStorage.getItem(workspaceStorageKey(key)) : null;
  },
  setItem(key: string, value: string) {
    localStorage.setItem(workspaceStorageKey(key), value);
  },
  removeItem(key: string) {
    if (workspaceContext) localStorage.removeItem(workspaceStorageKey(key));
  },
  subscribe(key: string, callback: (value: string | null) => void) {
    if (!workspaceContext) return () => {};
    const scoped = workspaceStorageKey(key);
    const listener = (event: StorageEvent) => {
      if (event.storageArea === localStorage && event.key === scoped) callback(event.newValue);
    };
    window.addEventListener('storage', listener);
    return () => window.removeEventListener('storage', listener);
  },
};
