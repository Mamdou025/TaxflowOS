import { WORKSPACE_ID_HEADER } from '@workspace/api-zod/access';
import { REQUEST_ID_HEADER } from '@workspace/api-zod/observability';
import { workspaceContext } from './workspace-context';

/** Session cookies and workspace headers are sent only to this app's API. */
export const apiFetch: typeof fetch = (input, init) => {
  const url = new URL(input instanceof Request ? input.url : String(input), window.location.origin);
  if (url.origin !== window.location.origin || !url.pathname.startsWith('/api/'))
    return fetch(input, init);
  const headers = new Headers(input instanceof Request ? input.headers : undefined);
  new Headers(init?.headers).forEach((value, key) => headers.set(key, value));
  if (!headers.has(REQUEST_ID_HEADER)) headers.set(REQUEST_ID_HEADER, crypto.randomUUID());
  if (workspaceContext && !headers.has(WORKSPACE_ID_HEADER))
    headers.set(WORKSPACE_ID_HEADER, workspaceContext.workspace.id);
  return fetch(input, { ...init, headers, credentials: 'same-origin' });
};
export async function apiJSON(path: string, init?: RequestInit): Promise<unknown> {
  const response = await apiFetch(path, init);
  const body: unknown = await response.json();
  if (!response.ok) {
    const message = body && typeof body === 'object' && 'error' in body ? body.error : undefined;
    throw new Error(typeof message === 'string' ? message : 'The request failed.');
  }
  return body;
}
