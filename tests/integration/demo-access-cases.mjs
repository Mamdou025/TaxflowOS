import assert from 'node:assert/strict';
import { createDemo } from './access-fixtures.mjs';

export async function checkDemoAccess(stack, owner, accountWorkspace, backup) {
  const first = await createDemo(stack),
    second = await createDemo(stack);
  assert.notEqual(first.user.id, second.user.id);
  assert.equal((await (await first.request('/session')).json()).user.isDemo, true);
  assert.equal((await (await owner.request('/session')).json()).user.isDemo, false);
  const open = async (guest) => {
    const response = await guest.request('/workspaces/demo', { method: 'POST', body: {} });
    assert.equal(response.status, 200, await response.clone().text());
    const { workspaces } = await response.json();
    assert.equal(workspaces.length, 1);
    return workspaces[0].id;
  };
  const ids = await Promise.all([open(first), open(first), open(first)]);
  assert.equal(new Set(ids).size, 1, 'concurrent requests reuse one workspace');
  const workspace = ids[0],
    secondWorkspace = await open(second);
  assert.notEqual(workspace, secondWorkspace);
  assert.equal((await (await first.request('/workspaces')).json()).workspaces.length, 1);
  assert.equal((await owner.request('/workspaces/demo', { method: 'POST', body: {} })).status, 403);
  assert.equal(
    (
      await fetch(stack.baseURL + '/api/workspaces/demo', {
        method: 'POST',
        headers: { Origin: stack.origin },
      })
    ).status,
    401,
  );
  assert.equal(
    (
      await first.request('/WORKSPACES/DEMO/', {
        method: 'POST',
        body: {},
        headers: { Origin: 'https://foreign.invalid' },
      })
    ).status,
    403,
  );

  assert.equal(
    (
      await first.request('/workflow-library', {
        workspace,
        method: 'PUT',
        body: { payload: backup, revision: 0 },
      })
    ).status,
    200,
  );
  assert.equal(
    (await (await first.request('/workflow-library', { workspace })).json()).payload,
    backup,
  );
  for (const actor of [owner, second]) {
    assert.equal((await actor.request('/workflow-library', { workspace })).status, 403);
    assert.equal(
      (
        await actor.request('/workflow-library', {
          workspace,
          method: 'PUT',
          body: { payload: backup, revision: 1 },
        })
      ).status,
      403,
    );
  }
  for (const scope of [accountWorkspace, secondWorkspace])
    assert.equal((await first.request('/workflow-library', { workspace: scope })).status, 403);
  // Guest tools use the normal execution path. Missing provider configuration is
  // reported honestly, rather than rejected as unsigned-in or replaced by sample output.
  const ai = await first.request('/copilotkit', {
    workspace,
    method: 'POST',
    body: { query: '{ __typename }' },
  });
  assert.equal(ai.status, 503);
  assert.equal((await ai.json()).code, 'AI_PROVIDER_NOT_CONFIGURED');
  for (const [path, method, body] of [
    ['/WORKSPACES/', 'POST', { name: 'Extra workspace' }],
    [`/WORKSPACES/${workspace}/MEMBERS/`, 'PUT', { userId: owner.user.id, role: 'owner' }],
    [`/workspaces/${workspace}/members/${first.user.id}`, 'DELETE', undefined],
    ['/WORKFLOW-LIBRARY/CLAIM/', 'POST', { recoveryCode: 'legacy-code' }],
  ])
    assert.equal((await first.request(path, { workspace, method, body })).status, 403, path);
  assert.equal(
    (
      await owner.request(`/workspaces/${accountWorkspace}/members`, {
        method: 'PUT',
        body: { userId: first.user.id, role: 'editor' },
      })
    ).status,
    400,
    'guests cannot be invited into account workspaces',
  );
  assert.equal((await first.request('/auth/sign-out', { method: 'POST', body: {} })).status, 200);
  assert.equal((await first.request('/workflow-library', { workspace })).status, 401);
  const fresh = await createDemo(stack);
  assert.notEqual(await open(fresh), workspace);
  assert.equal((await fresh.request('/workflow-library', { workspace })).status, 403);
}
