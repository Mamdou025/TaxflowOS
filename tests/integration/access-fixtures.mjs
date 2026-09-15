import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

export async function createAccount(stack, name = 'Synthetic user') {
  const email = `${randomUUID()}@example.invalid`;
  return createSession(stack, '/sign-up/email', {
    name,
    email,
    password: 'Synthetic-password-2026!',
  });
}
export async function createDemo(stack) {
  return createSession(stack, '/sign-in/anonymous', {});
}
async function createSession(stack, endpoint, data) {
  const response = await fetch(`${stack.baseURL}/api/auth${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: stack.origin },
    body: JSON.stringify(data),
  });
  assert.equal(response.status, 200, await response.clone().text());
  const { user } = await response.json();
  const cookie = response.headers
    .getSetCookie()
    .map((value) => value.split(';')[0])
    .join('; ');
  assert.ok(cookie);
  return {
    user,
    email: user.email,
    cookie,
    request(path, { method = 'GET', body, workspace, headers = {} } = {}) {
      return fetch(`${stack.baseURL}/api${path}`, {
        method,
        headers: {
          Cookie: cookie,
          Origin: stack.origin,
          'Content-Type': 'application/json',
          ...(workspace ? { 'x-taxflow-workspace': workspace } : {}),
          ...headers,
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(20000),
      });
    },
  };
}
export async function createWorkspace(account, name = 'Synthetic workspace') {
  const response = await account.request('/workspaces', { method: 'POST', body: { name } });
  assert.equal(response.status, 201, await response.clone().text());
  return (await response.json()).id;
}
export async function setMember(owner, workspace, account, role) {
  const response = await owner.request(`/workspaces/${workspace}/members`, {
    method: 'PUT',
    body: { userId: account.user.id, role },
  });
  assert.equal(response.status, 200, await response.clone().text());
}
