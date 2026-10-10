import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash, randomBytes } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { createTestRun } from '../../scripts/testing/runtime.mjs';
import { startTestStack } from '../../scripts/testing/stack.mjs';
import { createAccount, createDemo, createWorkspace, setMember } from './access-fixtures.mjs';

const run = createTestRun('chatgpt-oauth');
const scope = 'inscope.workflows:read';
const writeScope = 'inscope.workflows:write';
const executeScope = 'inscope.workflows:execute';
const allScopes = `${scope} ${writeScope} ${executeScope}`;
const clientId = 'synthetic-chatgpt-client';
const clientSecret = randomBytes(32).toString('base64url');
const callback = 'https://client.example.invalid/exact-callback';
let stack, owner, viewer, outsider, demo, workspace, otherWorkspace;
let pilotIds = '',
  configured = false;
let rpcId = 0;
const resource = () => `${stack.origin}/api/chatgpt/mcp`;
const sha = (value) => createHash('sha256').update(value).digest('base64url');
function token(body) {
  return fetch(`${stack.baseURL}/api/chatgpt/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      resource: resource(),
      ...body,
    }),
  });
}
async function begin(overrides = {}) {
  const verifier = randomBytes(32).toString('base64url');
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    redirect_uri: callback,
    code_challenge: sha(verifier),
    code_challenge_method: 'S256',
    scope,
    state: 'original-client-state',
    resource: resource(),
    ...overrides,
  });
  const response = await fetch(`${stack.baseURL}/api/chatgpt/oauth/authorize?${params}`, {
    redirect: 'manual',
  });
  return {
    response,
    verifier,
    requestId: response.headers.get('location')
      ? new URL(response.headers.get('location')).searchParams.get('request')
      : null,
  };
}
async function consent(account = viewer, target = workspace, requestedScope = scope) {
  const flow = await begin({ scope: requestedScope });
  assert.equal(flow.response.status, 302);
  const details = await account.request(`/chatgpt/oauth/requests/${flow.requestId}`);
  assert.equal(details.status, 200, await details.clone().text());
  const decision = await account.request(`/chatgpt/oauth/requests/${flow.requestId}/decision`, {
    method: 'POST',
    body: { decision: 'allow', workspaceId: target },
  });
  assert.equal(decision.status, 200, await decision.clone().text());
  const redirect = new URL((await decision.json()).redirectUrl);
  assert.equal(redirect.origin + redirect.pathname, callback);
  assert.equal(redirect.searchParams.get('state'), 'original-client-state');
  return { ...flow, code: redirect.searchParams.get('code') };
}
async function exchange(flow, overrides = {}) {
  return token({
    grant_type: 'authorization_code',
    code: flow.code,
    code_verifier: flow.verifier,
    redirect_uri: callback,
    ...overrides,
  });
}
async function connection(account = viewer, target = workspace, requestedScope = scope) {
  const flow = await consent(account, target, requestedScope);
  const response = await exchange(flow);
  assert.equal(response.status, 200, await response.clone().text());
  const credentials = await response.json();
  assert.equal(credentials.scope, requestedScope);
  assert.equal(credentials.token_type.toLowerCase(), 'bearer');
  assert.ok(credentials.expires_in > 0 && credentials.expires_in <= 900);
  return credentials;
}
function mcp(
  accessToken,
  headers = {},
  route = '/api/chatgpt/mcp',
  name = 'list_workflows',
  args = {},
) {
  return fetch(stack.baseURL + route, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
      Authorization: `Bearer ${accessToken}`,
      ...headers,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: ++rpcId,
      method: 'tools/call',
      params: { name, arguments: args },
    }),
  });
}
async function deniedCommand(accessToken, name, route = '/api/chatgpt/mcp') {
  const target = {
    workflowId: 'synthetic-scope-target',
    expectedLibraryRevision: 0,
    requestId: 'scope-denial-test',
  };
  const args =
    name === 'start_workflow_session'
      ? { ...target, version: 1 }
      : { ...target, runId: 'synthetic-scope-run', expectedRevision: 0 };
  const response = await mcp(accessToken, {}, route, name, args);
  assert.equal(response.status, 200);
  const result = (await response.json()).result;
  assert.equal(result.isError, true);
  assert.equal(result.structuredContent.error.code, 'FORBIDDEN');
}
before(
  async () => {
    stack = await startTestStack({
      ...run,
      start(command, args, options) {
        return run.start(command, args, {
          ...options,
          extraEnv: {
            ...options.extraEnv,
            ...(configured
              ? {
                  INSCOPE_CHATGPT_OAUTH_CLIENT_ID: clientId,
                  INSCOPE_CHATGPT_OAUTH_CLIENT_SECRET: clientSecret,
                  INSCOPE_CHATGPT_OAUTH_REDIRECT_URI: callback,
                  INSCOPE_CHATGPT_PILOT_USER_IDS: pilotIds,
                }
              : {}),
          },
        });
      },
    });
    owner = await createAccount(stack, 'OAuth owner');
    viewer = await createAccount(stack, 'OAuth viewer');
    outsider = await createAccount(stack, 'Other account');
    demo = await createDemo(stack);
    workspace = await createWorkspace(owner, 'Selected pilot workspace');
    otherWorkspace = await createWorkspace(outsider, 'Inaccessible workspace');
    await setMember(owner, workspace, viewer, 'viewer');
    assert.equal((await owner.request('/chatgpt/oauth/grants')).status, 503);
    pilotIds = `${owner.user.id},${viewer.user.id}`;
    configured = true;
    await stack.restartApi();
  },
  { timeout: 240000 },
);
after(() => run.close());

test('discovery uses the configured issuer/resource and advertises only supported OAuth methods', async () => {
  const metadata = await fetch(
    `${stack.baseURL}/.well-known/oauth-protected-resource/api/chatgpt/mcp`,
    { headers: { Host: 'untrusted.example.invalid' } },
  );
  assert.equal(metadata.status, 200);
  const resourceMetadata = await metadata.json();
  assert.deepEqual(resourceMetadata.authorization_servers, [stack.origin]);
  assert.deepEqual(resourceMetadata.scopes_supported, [scope, writeScope, executeScope]);
  const auth = await (
    await fetch(`${stack.baseURL}/.well-known/oauth-authorization-server`)
  ).json();
  assert.equal(auth.issuer, stack.origin);
  assert.equal(auth.authorization_endpoint, `${stack.origin}/api/chatgpt/oauth/authorize`);
  assert.deepEqual(auth.token_endpoint_auth_methods_supported, ['client_secret_post']);
  assert.deepEqual(auth.code_challenge_methods_supported, ['S256']);
  assert.deepEqual(auth.scopes_supported, [scope, writeScope, executeScope]);
  assert.equal(auth.registration_endpoint, undefined);
  const response = await fetch(`${stack.baseURL}/api/chatgpt/mcp`, { method: 'POST' });
  assert.equal(response.status, 401);
  assert.match(
    response.headers.get('www-authenticate'),
    /oauth-protected-resource\/api\/chatgpt\/mcp/,
  );
});

test('authorization rejects redirect, scope, PKCE and audience substitution without creating a request', async () => {
  for (const overrides of [
    { redirect_uri: 'https://attacker.example.invalid/callback' },
    { client_id: 'other-client' },
    { scope: 'workflows:write' },
    { scope: writeScope },
    { scope: executeScope },
    { scope: `${scope} ${scope}` },
    { scope: `${scope} unknown` },
    { code_challenge_method: 'plain' },
    { code_challenge: 'short' },
    { resource: 'https://other.example.invalid/mcp' },
  ]) {
    const flow = await begin(overrides);
    assert.equal(flow.requestId, null);
    assert.ok([302, 400].includes(flow.response.status));
    const location = flow.response.headers.get('location');
    if (location) assert.equal(new URL(location).origin + new URL(location).pathname, callback);
  }
});

test('write and execute consent require current owner/editor membership; browser decisions cannot choose scopes', async () => {
  for (const requestedScope of [`${scope} ${writeScope}`, `${scope} ${executeScope}`]) {
    const flow = await begin({ scope: requestedScope });
    assert.ok(flow.requestId);
    const details = await (
      await viewer.request(`/chatgpt/oauth/requests/${flow.requestId}`)
    ).json();
    assert.equal(details.request.scope, requestedScope);
    assert.deepEqual(details.workspaces, []);
    const decision = await viewer.request(`/chatgpt/oauth/requests/${flow.requestId}/decision`, {
      method: 'POST',
      body: { decision: 'allow', workspaceId: workspace },
    });
    assert.equal(decision.status, 403);
  }
  const readFlow = await begin();
  await viewer.request(`/chatgpt/oauth/requests/${readFlow.requestId}`);
  assert.equal(
    (
      await viewer.request(`/chatgpt/oauth/requests/${readFlow.requestId}/decision`, {
        method: 'POST',
        body: { decision: 'allow', workspaceId: workspace, scope: allScopes },
      })
    ).status,
    400,
  );
  await setMember(owner, workspace, viewer, 'editor');
  try {
    const flow = await begin({ scope: allScopes });
    const details = await (
      await viewer.request(`/chatgpt/oauth/requests/${flow.requestId}`)
    ).json();
    assert.equal(details.workspaces[0].role, 'editor');
    await setMember(owner, workspace, viewer, 'viewer');
    assert.equal(
      (
        await viewer.request(`/chatgpt/oauth/requests/${flow.requestId}/decision`, {
          method: 'POST',
          body: { decision: 'allow', workspaceId: workspace },
        })
      ).status,
      403,
    );
  } finally {
    await setMember(owner, workspace, viewer, 'viewer');
  }
});

test('new grants keep their exact consented scope set and old read grants cannot escalate on refresh', async () => {
  const original = await connection(owner);
  const elevated = await connection(owner, workspace, allScopes);
  const executeOnly = await connection(owner, workspace, `${scope} ${executeScope}`);
  const writeOnly = await connection(owner, workspace, `${scope} ${writeScope}`);
  assert.equal(executeOnly.scope.includes(writeScope), false);
  for (const route of ['/api/chatgpt/mcp', '/api/CHATGPT/MCP/']) {
    await deniedCommand(original.access_token, 'start_workflow_session', route);
    await deniedCommand(original.access_token, 'recalculate_workflow_session', route);
  }
  await deniedCommand(executeOnly.access_token, 'start_workflow_session');
  await deniedCommand(writeOnly.access_token, 'recalculate_workflow_session');
  const escalation = await token({
    grant_type: 'refresh_token',
    refresh_token: original.refresh_token,
    scope: allScopes,
  });
  assert.equal(escalation.status, 400);
  assert.equal((await escalation.json()).error, 'invalid_scope');
  assert.equal((await mcp(original.access_token)).status, 200);
  const oldRefreshed = await token({
    grant_type: 'refresh_token',
    refresh_token: original.refresh_token,
  });
  assert.equal(oldRefreshed.status, 200);
  assert.equal((await oldRefreshed.json()).scope, scope);
  const changedSubset = await token({
    grant_type: 'refresh_token',
    refresh_token: elevated.refresh_token,
    scope,
  });
  assert.equal(changedSubset.status, 400);
  assert.equal((await mcp(elevated.access_token)).status, 200);
  const renewed = await token({
    grant_type: 'refresh_token',
    refresh_token: elevated.refresh_token,
    scope: `${executeScope} ${scope} ${writeScope}`,
  });
  assert.equal(renewed.status, 200);
  const next = await renewed.json();
  assert.equal(next.scope, allScopes);
  assert.notEqual(next.refresh_token, elevated.refresh_token);
  const granted = (await (await owner.request('/chatgpt/oauth/grants')).json()).grants;
  assert.ok(granted.some((grant) => grant.scope === scope && !grant.revokedAt));
  assert.ok(granted.some((grant) => grant.scope === allScopes && !grant.revokedAt));
  assert.ok(
    granted.some((grant) => grant.scope === `${scope} ${executeScope}` && !grant.revokedAt),
  );
});

test('editor can consent to elevated access and a later role downgrade preserves reads', async () => {
  await setMember(owner, workspace, viewer, 'editor');
  const credentials = await connection(viewer, workspace, allScopes);
  await setMember(owner, workspace, viewer, 'viewer');
  assert.equal((await mcp(credentials.access_token)).status, 200);
  const refreshed = await token({
    grant_type: 'refresh_token',
    refresh_token: credentials.refresh_token,
  });
  assert.equal(refreshed.status, 200);
  assert.equal((await refreshed.json()).scope, allScopes);
  await deniedCommand(credentials.access_token, 'start_workflow_session');
  await deniedCommand(credentials.access_token, 'recalculate_workflow_session');
});

test('consent requires a real allowed account, same session, current membership and an explicit origin-checked decision', async () => {
  const flow = await begin();
  const route = `/chatgpt/oauth/requests/${flow.requestId}`;
  assert.equal((await fetch(stack.baseURL + '/api' + route)).status, 401);
  assert.equal((await demo.request(route)).status, 403);
  assert.equal((await outsider.request(route)).status, 403);
  const details = await (await viewer.request(route)).json();
  assert.deepEqual(
    details.workspaces.map((item) => item.id),
    [workspace],
  );
  assert.equal(details.request.scope, scope);
  assert.equal((await owner.request(route)).status, 404);
  assert.equal(
    (
      await viewer.request(route + '/decision', {
        method: 'POST',
        headers: { Origin: 'https://attacker.example.invalid' },
        body: { decision: 'allow', workspaceId: workspace },
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await viewer.request(route + '/decision', {
        method: 'POST',
        body: { decision: 'allow', workspaceId: otherWorkspace },
      })
    ).status,
    403,
  );
  assert.equal(
    (await viewer.request(route + '/decision', { method: 'POST', body: { decision: 'allow' } }))
      .status,
    400,
  );
  const denied = await viewer.request(route + '/decision', {
    method: 'POST',
    body: { decision: 'deny' },
  });
  assert.equal(denied.status, 200);
  const redirect = new URL((await denied.json()).redirectUrl);
  assert.equal(redirect.searchParams.get('error'), 'access_denied');
  assert.equal(redirect.searchParams.get('state'), 'original-client-state');
  assert.equal((await viewer.request(route)).status, 404);
});

test('PKCE/client/redirect/resource checks precede minting; concurrent code redemption cannot mint twice', async () => {
  const flow = await consent();
  for (const override of [
    { code_verifier: 'x'.repeat(43) },
    { client_secret: 'wrong' },
    { client_id: 'wrong' },
    { redirect_uri: 'https://client.example.invalid/different' },
    { resource: 'https://other.example.invalid/mcp' },
  ])
    assert.equal((await exchange(flow, override)).status, 400);
  const responses = await Promise.all([exchange(flow), exchange(flow)]);
  assert.deepEqual(responses.map((item) => item.status).sort(), [200, 400]);
  const minted = await responses.find((item) => item.status === 200).json();
  // Replay revokes the family, including credentials returned by the successful exchange.
  assert.equal((await mcp(minted.access_token)).status, 401);
});

test('bearer reads are pinned to the granted workspace and cannot authorize application writes or invalid-token cookie fallback', async () => {
  const credentials = await connection();
  const toolList = await fetch(`${stack.baseURL}/api/chatgpt/mcp`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${credentials.access_token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method: 'tools/list' }),
  });
  assert.equal(toolList.status, 200);
  const descriptors = (await toolList.json()).result.tools;
  const requiredScopes = {
    list_workflows: [scope],
    get_workflow_version: [scope],
    list_workflow_runs: [scope],
    inspect_workflow_run: [scope],
    open_workflow_view: [scope],
    read_workflow_source: [scope],
    start_workflow_session: [scope, writeScope],
    preview_workflow_change: [scope, writeScope],
    apply_workflow_change: [scope, writeScope],
    begin_workflow_source: [scope, writeScope],
    append_workflow_source: [scope, writeScope],
    inspect_workflow_source: [scope, writeScope],
    capture_workflow_source: [scope, writeScope],
    recalculate_workflow_session: [scope, executeScope],
  };
  assert.deepEqual(descriptors.map((tool) => tool.name).sort(), Object.keys(requiredScopes).sort());
  for (const tool of descriptors) {
    assert.deepEqual(tool.securitySchemes, [{ type: 'oauth2', scopes: requiredScopes[tool.name] }]);
    assert.deepEqual(tool._meta.securitySchemes, tool.securitySchemes);
  }
  for (const route of ['/api/chatgpt/mcp', '/api/CHATGPT/MCP/']) {
    const response = await mcp(credentials.access_token, {}, route);
    assert.equal(response.status, 200, await response.clone().text());
    assert.equal((await response.json()).result.structuredContent.workspace.id, workspace);
  }
  assert.equal(
    (await mcp(credentials.access_token, { 'x-taxflow-workspace': otherWorkspace })).status,
    403,
  );
  assert.equal(
    (
      await mcp('x'.repeat(43), {
        Cookie: owner.cookie,
        Origin: stack.origin,
        'x-taxflow-workspace': workspace,
      })
    ).status,
    401,
  );
  const write = await fetch(`${stack.baseURL}/api/workflow-library`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${credentials.access_token}`,
      'Content-Type': 'application/json',
    },
    body: '{}',
  });
  assert.equal(write.status, 401);
  const unknown = await mcp(credentials.access_token, {}, '/api/chatgpt/mcp', 'execute_workflow');
  const result = await unknown.json();
  assert.ok(result.error || result.result?.isError);
});

test('refresh rotates credentials, rejects audience/scope changes and permanently revokes a replayed family', async () => {
  const credentials = await connection();
  for (const override of [{ resource: 'https://other.example.invalid/mcp' }, { scope: 'write' }])
    assert.equal(
      (
        await token({
          grant_type: 'refresh_token',
          refresh_token: credentials.refresh_token,
          ...override,
        })
      ).status,
      400,
    );
  const response = await token({
    grant_type: 'refresh_token',
    refresh_token: credentials.refresh_token,
  });
  assert.equal(response.status, 200);
  const refreshed = await response.json();
  assert.notEqual(refreshed.refresh_token, credentials.refresh_token);
  assert.equal((await mcp(refreshed.access_token)).status, 200);
  assert.equal(
    (await token({ grant_type: 'refresh_token', refresh_token: credentials.refresh_token })).status,
    400,
  );
  assert.equal((await mcp(refreshed.access_token)).status, 401);
  assert.equal(
    (await token({ grant_type: 'refresh_token', refresh_token: refreshed.refresh_token })).status,
    400,
  );
});

test('own grants can be revoked by a Viewer; another actor cannot revoke them', async () => {
  const credentials = await connection();
  const grants = (await (await viewer.request('/chatgpt/oauth/grants')).json()).grants;
  const grant = grants.find((item) => !item.revokedAt);
  assert.ok(grant);
  assert.equal(
    (await owner.request(`/chatgpt/oauth/grants/${grant.id}`, { method: 'DELETE' })).status,
    404,
  );
  // Revoke every active own grant so the selected token is covered independent of list ordering.
  for (const item of grants.filter((candidate) => !candidate.revokedAt))
    assert.equal(
      (await viewer.request(`/chatgpt/oauth/grants/${item.id}`, { method: 'DELETE' })).status,
      204,
    );
  assert.equal((await mcp(credentials.access_token)).status, 401);
  assert.equal(
    (await token({ grant_type: 'refresh_token', refresh_token: credentials.refresh_token })).status,
    400,
  );
});

test('protocol revocation is client-authenticated and survives API restart', async () => {
  const credentials = await connection();
  const response = await fetch(`${stack.baseURL}/api/chatgpt/oauth/revoke`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      token: credentials.access_token,
    }),
  });
  assert.equal(response.status, 200);
  await stack.restartApi();
  assert.equal((await mcp(credentials.access_token)).status, 401);
});

test('membership removal immediately denies access and cannot resurrect an old connection when re-added', async () => {
  const credentials = await connection();
  assert.equal(
    (
      await owner.request(`/workspaces/${workspace}/members/${viewer.user.id}`, {
        method: 'DELETE',
      })
    ).status,
    200,
  );
  assert.equal((await mcp(credentials.access_token)).status, 401);
  await setMember(owner, workspace, viewer, 'viewer');
  assert.equal((await mcp(credentials.access_token)).status, 401);
  assert.equal(
    (await token({ grant_type: 'refresh_token', refresh_token: credentials.refresh_token })).status,
    400,
  );
});

test('pending requests, codes, access tokens and grant lifetime expire independently', async () => {
  const digest = (value) => createHash('sha256').update(value).digest('hex');
  const pending = await begin();
  await stack.db.query(
    "UPDATE chatgpt_oauth_requests SET created_at=now()-interval '20 minutes', expires_at=now()-interval '1 minute' WHERE request_hash=$1",
    [digest(pending.requestId)],
  );
  assert.equal((await viewer.request(`/chatgpt/oauth/requests/${pending.requestId}`)).status, 404);
  const code = await consent();
  await stack.db.query(
    "UPDATE chatgpt_oauth_codes SET created_at=now()-interval '20 minutes', expires_at=now()-interval '1 minute' WHERE code_hash=$1",
    [digest(code.code)],
  );
  assert.equal((await exchange(code)).status, 400);
  const credentials = await connection();
  const saved = await stack.db.query(
    'SELECT token_hash FROM chatgpt_oauth_tokens WHERE token_hash=ANY($1)',
    [[digest(credentials.access_token), digest(credentials.refresh_token)]],
  );
  assert.equal(saved.rowCount, 2);
  assert.equal(
    (
      await stack.db.query('SELECT 1 FROM chatgpt_oauth_tokens WHERE token_hash=ANY($1)', [
        [credentials.access_token, credentials.refresh_token],
      ])
    ).rowCount,
    0,
  );
  await stack.db.query(
    "UPDATE chatgpt_oauth_tokens SET created_at=now()-interval '20 minutes', expires_at=now()-interval '1 minute' WHERE token_hash=$1",
    [digest(credentials.access_token)],
  );
  assert.equal((await mcp(credentials.access_token)).status, 401);
  const renewed = await token({
    grant_type: 'refresh_token',
    refresh_token: credentials.refresh_token,
  });
  assert.equal(renewed.status, 200);
  const next = await renewed.json();
  assert.equal((await mcp(next.access_token)).status, 200);
  await stack.db.query(
    "UPDATE chatgpt_oauth_grants SET created_at=now()-interval '8 days', expires_at=now()-interval '1 minute' WHERE id=(SELECT grant_id FROM chatgpt_oauth_tokens WHERE token_hash=$1)",
    [digest(next.access_token)],
  );
  assert.equal((await mcp(next.access_token)).status, 401);
  assert.equal(
    (await token({ grant_type: 'refresh_token', refresh_token: next.refresh_token })).status,
    400,
  );
});

test('server logs do not disclose client secrets, issued credentials, malformed forms or OAuth query data', async () => {
  const credentials = await connection();
  await mcp(credentials.access_token);
  const marker = 'SYNTHETIC-MALFORMED-SECRET-' + randomBytes(10).toString('hex');
  const malformed = await fetch(`${stack.baseURL}/api/chatgpt/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `client_secret=${marker}&${'a=1&'.repeat(1001)}`,
  });
  assert.equal(malformed.status, 413);
  assert.equal((await malformed.text()).includes(marker), false);
  const log = fs.readFileSync(path.join(run.output, 'api.log'), 'utf8');
  for (const value of [
    clientSecret,
    credentials.access_token,
    credentials.refresh_token,
    'original-client-state',
    marker,
  ])
    assert.equal(log.includes(value), false);
});
