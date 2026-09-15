import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { deflateRawSync } from 'node:zlib';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { createTestRun } from '../../scripts/testing/runtime.mjs';
import { startTestStack } from '../../scripts/testing/stack.mjs';
import { createAccount, createWorkspace, setMember } from './access-fixtures.mjs';
import { checkDemoAccess } from './demo-access-cases.mjs';

const run = createTestRun('workspace-access');
console.log(`Workspace access evidence: ${run.output}`);
let stack, owner, editor, viewer, workspace, other;
const backup = fs.readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8');
before(
  async () => {
    stack = await startTestStack(run);
    owner = await createAccount(stack, 'Owner');
    editor = await createAccount(stack, 'Editor');
    viewer = await createAccount(stack, 'Viewer');
    workspace = await createWorkspace(owner);
    other = await createWorkspace(owner, 'Separate workspace');
    await setMember(owner, workspace, editor, 'editor');
    await setMember(owner, workspace, viewer, 'viewer');
  },
  { timeout: 240000 },
);
after(() => run.close());

test('password-free demos persist, isolate guests, restrict sharing and revoke on exit', async () => {
  await checkDemoAccess(stack, owner, workspace, backup);
});

test('requests without a valid session and forged identities cannot reach data, tools or models', async () => {
  for (const path of [
    '/workflow-library',
    '/workflows',
    '/chat/threads',
    '/documents',
    '/assistant/memory',
    '/copilotkit',
    '/agent-lab',
    '/genui',
    '/http-source',
    '/fx-rate',
    '/agent-actions/grants',
  ]) {
    const result = await fetch(stack.baseURL + '/api' + path, {
      headers: {
        'x-user-id': owner.user.id,
        'x-taxflow-workspace': workspace,
        Cookie: 'better-auth.session_token=forged',
      },
    });
    assert.equal(result.status, 401, path);
  }
  assert.equal((await fetch(stack.baseURL + '/api/healthz')).status, 200);
});
test('session identity and workspace membership come from the server', async () => {
  assert.equal((await (await owner.request('/session')).json()).user.id, owner.user.id);
  assert.equal((await editor.request('/workflow-library', { workspace: other })).status, 403);
  assert.equal((await owner.request('/workflow-library')).status, 400);
  assert.equal((await owner.request('/workflow-library', { workspace: 'invalid' })).status, 400);
  assert.equal(
    (
      await owner.request('/workflow-library', {
        workspace,
        headers: { Origin: 'https://untrusted.invalid' },
      })
    ).status,
    403,
  );
});
test('Viewers read shared libraries but cannot save, delete, claim or execute tools', async () => {
  assert.equal(
    (
      await editor.request('/workflow-library', {
        workspace,
        method: 'PUT',
        body: { payload: backup, revision: 0 },
      })
    ).status,
    200,
  );
  assert.equal(
    (await (await viewer.request('/workflow-library', { workspace })).json()).payload,
    backup,
  );
  for (const method of ['PUT', 'DELETE', 'POST'])
    assert.equal(
      (
        await viewer.request('/workflow-library', {
          workspace,
          method,
          body: method === 'DELETE' ? undefined : { payload: backup, revision: 1 },
        })
      ).status,
      403,
    );
  for (const path of ['/assistant/tools', '/copilotkit', '/agent-lab', '/genui', '/http-source'])
    assert.equal(
      (await viewer.request(path, { workspace, method: 'POST', body: {} })).status,
      403,
      path,
    );
  assert.equal((await viewer.request('/fx-rate', { workspace })).status, 403);
  for (const path of ['/FX-RATE/', '/PARAM-OPTIONS', '/HTTP-SOURCE/']) {
    assert.equal((await viewer.request(path, { workspace })).status, 403, path);
  }
  assert.equal(
    (await viewer.request('/AGENT-ACTIONS/GRANTS/', { workspace })).status,
    403,
    '/AGENT-ACTIONS/GRANTS/',
  );
});

test('agent action grants are scoped, revocable, one-time when required and replay-safe', async () => {
  const action = {
    operationId: randomUUID(),
    agentId: 'sina',
    capability: 'workflow:apply-draft',
    resourceType: 'workflow',
    resourceId: 'custom:synthetic-agent-workflow',
    resourceRevision: 'wf-base-one',
    requestFingerprint: 'wf-change-one',
  };
  assert.equal(
    (
      await viewer.request('/agent-actions/grants', {
        workspace,
        method: 'POST',
        body: { ...action, kind: 'one-time' },
      })
    ).status,
    403,
  );
  let response = await editor.request('/agent-actions/operations/authorize', {
    workspace,
    method: 'POST',
    body: action,
  });
  assert.equal(response.status, 403);
  assert.equal((await response.json()).code, 'GRANT_REQUIRED');

  response = await editor.request('/agent-actions/grants', {
    workspace,
    method: 'POST',
    body: { ...action, kind: 'one-time' },
  });
  assert.equal(response.status, 201);
  const grantId = (await response.json()).grant.id;
  response = await editor.request('/agent-actions/operations/authorize', {
    workspace,
    method: 'POST',
    body: action,
  });
  assert.equal(response.status, 200);
  let result = await response.json();
  assert.equal(result.allowed, true);
  assert.equal(result.authorization.grantId, grantId);
  assert.equal(result.authorization.resourceRevision, action.resourceRevision);

  assert.equal(
    (
      await editor.request('/agent-actions/operations/authorize', {
        workspace,
        method: 'POST',
        body: action,
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await editor.request('/agent-actions/operations/authorize', {
        workspace,
        method: 'POST',
        body: { ...action, resourceRevision: 'changed-after-approval' },
      })
    ).status,
    409,
  );
  assert.equal(
    (
      await editor.request(`/agent-actions/operations/${action.operationId}/outcome`, {
        workspace,
        method: 'POST',
        body: { status: 'succeeded', message: 'Draft applied.' },
      })
    ).status,
    200,
  );
  response = await editor.request('/agent-actions/operations/authorize', {
    workspace,
    method: 'POST',
    body: action,
  });
  result = await response.json();
  assert.equal(result.operationStatus, 'succeeded');

  const reusableGrant = {
    agentId: 'sina',
    capability: 'workflow:execute',
    resourceType: 'workflow',
    resourceId: action.resourceId,
    kind: 'reusable',
  };
  response = await editor.request('/agent-actions/grants', {
    workspace,
    method: 'POST',
    body: reusableGrant,
  });
  assert.equal(response.status, 201);
  const reusableId = (await response.json()).grant.id;
  for (const operationId of [randomUUID(), randomUUID()]) {
    const executeAction = {
      agentId: reusableGrant.agentId,
      capability: reusableGrant.capability,
      resourceType: reusableGrant.resourceType,
      resourceId: reusableGrant.resourceId,
      operationId,
      resourceRevision: '7',
      requestFingerprint: `input-${operationId}`,
    };
    assert.equal(
      (
        await editor.request('/agent-actions/operations/authorize', {
          workspace,
          method: 'POST',
          body: executeAction,
        })
      ).status,
      200,
    );
  }
  assert.equal(
    (
      await editor.request(`/agent-actions/grants/${reusableId}`, {
        workspace,
        method: 'DELETE',
      })
    ).status,
    200,
  );
  assert.equal(
    (
      await editor.request('/agent-actions/operations/authorize', {
        workspace,
        method: 'POST',
        body: {
          agentId: reusableGrant.agentId,
          capability: reusableGrant.capability,
          resourceType: reusableGrant.resourceType,
          resourceId: reusableGrant.resourceId,
          operationId: randomUUID(),
          resourceRevision: '7',
          requestFingerprint: 'after-revocation',
        },
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await editor.request('/agent-actions/grants', {
        workspace,
        method: 'POST',
        body: {
          agentId: 'sina',
          capability: 'connection:external-write',
          resourceType: 'connection',
          resourceId: 'connection-one',
          kind: 'reusable',
        },
      })
    ).status,
    400,
  );
  assert.equal(
    (
      await editor.request('/agent-actions/operations/authorize', {
        workspace: other,
        method: 'POST',
        body: { ...action, operationId: randomUUID() },
      })
    ).status,
    403,
  );
});

test('authenticated chat reports an unavailable provider without fabricating a response', async () => {
  const response = await editor.request('/copilotkit', {
    workspace,
    method: 'POST',
    body: { query: '{ __typename }' },
  });
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, 'AI_PROVIDER_NOT_CONFIGURED');
});
test('connector operations return a traceable receipt even when validation fails', async () => {
  const response = await editor.request('/http-source', {
    workspace,
    method: 'POST',
    body: {},
  });
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.ok, false);
  assert.equal(body.reason, 'No URL was provided.');
  assert.deepEqual(
    {
      connector: body.operation.connector,
      status: body.operation.status,
      attempts: body.operation.attempts,
      retryable: body.operation.retryable,
    },
    { connector: 'http-json', status: 'failed', attempts: 0, retryable: false },
  );
  assert.match(body.operation.operationId, /^[0-9a-f-]{36}$/i);
  assert.ok(Number.isFinite(Date.parse(body.operation.observedAt)));
});
test('invalid, cyclic and oversized compressed backups fail without replacing saved data', async () => {
  for (const payload of [
    'taxflow-deflate-v1:' + deflateRawSync(Buffer.from('x'.repeat(20_000_001))).toString('base64'),
    'taxflow-deflate-v1:invalid!',
    'not json',
    '{}broken',
    JSON.stringify({ format: 'taxflow-shared-json-v1', root: [0], nodes: [['array', [[0]]]] }),
    JSON.stringify({ format: 'unknown', library: {} }),
  ]) {
    assert.equal(
      (
        await editor.request('/workflow-library', {
          workspace,
          method: 'PUT',
          body: { payload, revision: 1 },
        })
      ).status,
      400,
    );
  }
  assert.equal(
    (await (await owner.request('/workflow-library', { workspace })).json()).payload,
    backup,
  );
});
test('valid compressed backups preserve their portable bytes', async () => {
  const target = await createWorkspace(owner);
  const payload = 'taxflow-deflate-v1:' + deflateRawSync(Buffer.from(backup)).toString('base64');
  assert.equal(
    (
      await owner.request('/workflow-library', {
        workspace: target,
        method: 'PUT',
        body: { payload, revision: 0 },
      })
    ).status,
    200,
  );
  assert.equal(
    (await (await owner.request('/workflow-library', { workspace: target })).json()).payload,
    payload,
  );
});
test('saved workflow versions execute durably, idempotently and survive an API restart', async () => {
  const runWorkspace = await createWorkspace(owner, 'Durable execution workspace');
  await setMember(owner, runWorkspace, editor, 'editor');
  await setMember(owner, runWorkspace, viewer, 'viewer');
  const library = JSON.parse(backup);
  const workflow = library['custom:synthetic-recovery'];
  const saved = structuredClone(workflow.versions[0].definition);
  saved.blocks = [
    {
      id: 'explicit-value',
      family: 'Source',
      subtype: 'Manual Entry',
      label: 'Explicit value',
      description: '',
      status: 'configured',
      position: { x: 0, y: 0 },
      config: { toolId: 'source.manual_value', value: 42 },
      runtime: {
        visible: true,
        editableInRuntime: true,
        generatedUiLocked: false,
        masked: false,
        showInRuns: true,
      },
      createdAt: '2024-01-02T03:04:05.000Z',
      updatedAt: '2024-01-02T03:04:05.000Z',
      createdBy: 'fixture',
      updatedBy: 'fixture',
    },
  ];
  saved.edges = [];
  saved.blocks.push({
    ...structuredClone(saved.blocks[0]),
    id: 'saved-table',
    label: 'Saved source rows',
    subtype: 'Excel / Workbook',
    position: { x: 100, y: 0 },
    config: {
      toolId: 'source.manual_table',
      rows: [
        { rowId: 'first', label: 'First line', amount: 10 },
        { rowId: 'second', label: 'Second line', amount: 20 },
      ],
    },
  });
  workflow.versions = [
    { number: 1, savedAt: '2024-01-02T03:04:05.000Z', definition: saved },
    { number: 2, savedAt: '2024-01-02T04:04:05.000Z', definition: saved },
  ];
  library['custom:unsupported-durable'] = {
    ...structuredClone(workflow),
    id: 'custom:unsupported-durable',
    draft: { ...structuredClone(saved), id: 'custom:unsupported-durable' },
    versions: [
      {
        number: 1,
        savedAt: '2024-01-02T03:04:05.000Z',
        definition: {
          ...structuredClone(saved),
          id: 'custom:unsupported-durable',
          blocks: [
            {
              ...saved.blocks[0],
              id: 'remote-source',
              subtype: 'Web / URL',
              config: { toolId: 'source.uninstalled', url: 'https://example.invalid' },
            },
          ],
        },
      },
    ],
  };
  assert.equal(
    (
      await owner.request('/workflow-library', {
        workspace: runWorkspace,
        method: 'PUT',
        body: { payload: JSON.stringify(library), revision: 0 },
      })
    ).status,
    200,
  );

  const requestId = randomUUID();
  assert.equal(
    (
      await viewer.request('/WORKFLOW-RUNS/', {
        workspace: runWorkspace,
        method: 'POST',
        body: { workflowId: workflow.id, version: 1, requestId: randomUUID() },
      })
    ).status,
    403,
  );
  let response = await editor.request('/workflow-runs', {
    workspace: runWorkspace,
    method: 'POST',
    body: { workflowId: workflow.id, version: 1, requestId },
  });
  assert.equal(response.status, 202);
  const created = await response.json();
  assert.equal(created.replayed, false);

  response = await editor.request('/workflow-runs', {
    workspace: runWorkspace,
    method: 'POST',
    body: { workflowId: workflow.id, version: 1, requestId },
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).run.id, created.run.id);
  assert.equal(
    (
      await editor.request('/workflow-runs', {
        workspace: runWorkspace,
        method: 'POST',
        body: { workflowId: workflow.id, version: 2, requestId },
      })
    ).status,
    409,
  );

  let runResult;
  for (let attempt = 0; attempt < 40; attempt++) {
    response = await viewer.request(`/workflow-runs/${created.run.id}`, {
      workspace: runWorkspace,
    });
    assert.equal(response.status, 200);
    runResult = await response.json();
    if (!['pending', 'running'].includes(runResult.status)) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  assert.equal(runResult.status, 'success');
  assert.equal(runResult.result.result.results[0].output.value, 42);
  assert.deepEqual(
    runResult.result.result.results
      .find((item) => item.blockId === 'saved-table')
      .output.rows.map((row) => row.amount),
    [10, 20],
  );

  response = await editor.request('/workflow-runs', {
    workspace: runWorkspace,
    method: 'POST',
    body: {
      workflowId: 'custom:unsupported-durable',
      version: 1,
      requestId: randomUUID(),
    },
  });
  assert.equal(response.status, 422);
  assert.deepEqual((await response.json()).unsupportedToolIds, ['source.uninstalled']);

  const cancellableId = `cancel-${randomUUID()}`;
  await stack.db.query(
    `INSERT INTO workflow_run_jobs(
      id,workspace_id,workflow_id,workflow_version,definition,requested_by,
      request_id,status,run_after
    ) VALUES($1,$2,$3,1,$4,$5,$6,'pending',now()+interval '1 hour')`,
    [cancellableId, runWorkspace, workflow.id, saved, editor.user.id, randomUUID()],
  );
  assert.equal(
    (
      await viewer.request(`/WORKFLOW-RUNS/${cancellableId}/CANCEL/`, {
        workspace: runWorkspace,
        method: 'POST',
        body: {},
      })
    ).status,
    403,
  );
  response = await editor.request(`/workflow-runs/${cancellableId}/cancel`, {
    workspace: runWorkspace,
    method: 'POST',
    body: {},
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, 'cancelled');
  response = await editor.request(`/workflow-runs/${cancellableId}/retry`, {
    workspace: runWorkspace,
    method: 'POST',
    body: { requestId: randomUUID() },
  });
  assert.equal(response.status, 202);
  const retried = await response.json();
  assert.equal(retried.run.workflowVersion, 1);
  assert.equal(retried.run.id === cancellableId, false);

  await stack.restartApi();
  response = await owner.request(`/workflow-runs/${created.run.id}`, {
    workspace: runWorkspace,
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).status, 'success');
});
test('invalid workflow and memory inputs are rejected before persistence', async () => {
  const target = await createWorkspace(owner);
  for (const body of [
    { visibility: 'invented' },
    { name: 42 },
    { nodes: 'invalid' },
    { workspaceId: other },
  ]) {
    assert.equal(
      (await owner.request('/workflows', { workspace: target, method: 'POST', body })).status,
      400,
    );
  }
  for (const body of [
    { content: '' },
    { content: 'x', kind: 'invented' },
    { content: 'x', fiscalYear: 1.5 },
    { content: 'x', userId: editor.user.id },
  ]) {
    assert.equal(
      (await owner.request('/assistant/memory', { workspace: target, method: 'POST', body }))
        .status,
      400,
    );
  }
  assert.deepEqual(await (await owner.request('/workflows', { workspace: target })).json(), []);
  assert.deepEqual(
    (await (await owner.request('/assistant/memory', { workspace: target })).json()).memories,
    [],
  );
});
test('same-account workspaces and other members cannot cross resource boundaries', async () => {
  const memory = await owner.request('/assistant/memory', {
    workspace,
    method: 'POST',
    body: { content: 'Private synthetic memory' },
  });
  assert.equal(memory.status, 201);
  const id = (await memory.json()).memory.id;
  assert.equal(
    (await (await owner.request('/assistant/memory', { workspace: other })).json()).memories.length,
    0,
  );
  await owner.request(`/assistant/memory?id=${id}`, { workspace: other, method: 'DELETE' });
  assert.equal(
    (await (await viewer.request('/assistant/memory', { workspace })).json()).memories.length,
    1,
  );
  const flow = await owner.request('/workflows', {
    workspace,
    method: 'POST',
    body: { name: 'Synthetic graph', nodes: [], edges: [] },
  });
  assert.equal(flow.status, 201);
  const flowId = (await flow.json()).id;
  const editorView = await (await editor.request(`/workflows/${flowId}`, { workspace })).json();
  assert.equal(editorView.isOwner, false);
  assert.equal(editorView.canEdit, true);
  assert.equal(
    (await (await viewer.request(`/workflows/${flowId}`, { workspace })).json()).canEdit,
    false,
  );
  assert.equal((await owner.request(`/workflows/${flowId}`, { workspace: other })).status, 404);
  assert.equal((await viewer.request(`/workflows/${flowId}`, { workspace })).status, 200);
  const documentId = randomUUID();
  await stack.db.query(
    "INSERT INTO documents(id,user_id,workspace_id,file_name,storage_bucket,storage_key) VALUES($1,$2,$3,'synthetic.txt','unused','unused')",
    [documentId, owner.user.id, workspace],
  );
  assert.equal((await owner.request(`/documents/${documentId}`, { workspace: other })).status, 404);
  assert.equal(
    (await (await viewer.request('/documents', { workspace })).json()).documents.length,
    1,
  );
});
test('chat batch message IDs cannot overwrite another thread or workspace', async () => {
  const first = randomUUID(),
    second = randomUUID(),
    messageId = randomUUID();
  const save = (scope, id, text) =>
    owner.request(`/chat/threads/${id}/messages`, {
      workspace: scope,
      method: 'POST',
      body: { messages: [{ id: messageId, role: 'user', seq: 0, content: { text } }] },
    });
  assert.equal((await save(workspace, first, 'Original')).status, 200);
  assert.equal((await save(other, second, 'Attempted overwrite')).status, 409);
  const messages = (
    await (await viewer.request(`/chat/threads/${first}/messages`, { workspace })).json()
  ).messages;
  assert.equal(messages[0].content.text, 'Original');
  assert.equal(
    (await owner.request(`/chat/threads/${first}/messages`, { workspace: other })).status,
    404,
  );
  assert.equal((await save(workspace, first, 'Authorized edit')).status, 200);
});
test('only Owners manage membership and concurrent changes preserve a last Owner', async () => {
  assert.equal(
    (
      await editor.request(`/workspaces/${workspace}/members`, {
        method: 'PUT',
        body: { userId: editor.user.id, role: 'owner' },
      })
    ).status,
    403,
  );
  const target = await createWorkspace(owner);
  await setMember(owner, target, editor, 'owner');
  const responses = await Promise.all(
    [owner, editor].map((account) =>
      account.request(`/workspaces/${target}/members`, {
        method: 'PUT',
        body: { userId: account.user.id, role: 'editor' },
      }),
    ),
  );
  assert.deepEqual(responses.map((r) => r.status).sort(), [200, 409]);
  const { rows } = await stack.db.query(
    "SELECT count(*)::int AS n FROM workspace_members WHERE workspace_id=$1 AND role='owner'",
    [target],
  );
  assert.equal(rows[0].n, 1);
});
test('legacy claims require a code, are atomic and preserve the original backup', async () => {
  const code = randomBytes(32).toString('hex'),
    hash = createHash('sha256').update(code).digest('hex');
  await stack.db.query(
    "INSERT INTO personal_workflow_libraries(workspace_hash,owner_id,payload) VALUES($1,'anonymous',$2)",
    [hash, backup],
  );
  const targets = await Promise.all([createWorkspace(owner), createWorkspace(editor)]);
  const responses = await Promise.all(
    [owner, editor].map((account, i) =>
      account.request('/workflow-library/claim', {
        workspace: targets[i],
        method: 'POST',
        body: { recoveryCode: code },
      }),
    ),
  );
  assert.deepEqual(responses.map((r) => r.status).sort(), [200, 409]);
  const { rows } = await stack.db.query(
    'SELECT payload FROM personal_workflow_libraries WHERE workspace_hash=$1',
    [hash],
  );
  assert.equal(rows[0].payload, backup);
  const winner = responses.findIndex((r) => r.status === 200);
  assert.equal(
    (
      await (
        await [owner, editor][winner].request('/workflow-library', { workspace: targets[winner] })
      ).json()
    ).payload,
    backup,
  );
});
test('source lifecycle is recoverable, role-scoped and keeps a provenance tombstone on purge', async () => {
  const documentId = randomUUID();
  await stack.db.query(
    `INSERT INTO documents(
      id,user_id,workspace_id,file_name,storage_bucket,storage_key,status,
      source_revision,content_hash,lifecycle_status
    ) VALUES($1,$2,$3,'phase-5-synthetic.txt',NULL,NULL,'ready',4,'sha256:synthetic','active')`,
    [documentId, owner.user.id, workspace],
  );
  assert.equal(
    (await viewer.request(`/documents/${documentId}`, { workspace, method: 'DELETE' })).status,
    403,
  );
  assert.equal(
    (
      await viewer.request(`/DOCUMENTS/${documentId}/LIFECYCLE/`, {
        workspace,
        method: 'POST',
        body: { action: 'delete' },
      })
    ).status,
    403,
  );
  let response = await editor.request(`/documents/${documentId}/lifecycle`, {
    workspace,
    method: 'POST',
    body: { action: 'archive' },
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).document.lifecycleStatus, 'archived');
  assert.equal(
    (
      await editor.request(`/documents/${documentId}/lifecycle`, {
        workspace,
        method: 'POST',
        body: { action: 'restore' },
      })
    ).status,
    403,
  );
  response = await owner.request(`/documents/${documentId}/lifecycle`, {
    workspace,
    method: 'POST',
    body: { action: 'restore' },
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).document.inLibrary, false);
  assert.equal(
    (await editor.request(`/documents/${documentId}`, { workspace, method: 'DELETE' })).status,
    200,
  );
  assert.equal((await editor.request('/documents?includeDeleted=true', { workspace })).status, 403);
  assert.equal((await viewer.request('/documents?includeDeleted=true', { workspace })).status, 403);
  const deleted = await (
    await owner.request('/documents?includeDeleted=true', { workspace })
  ).json();
  assert.equal(
    deleted.documents.some(
      (document) => document.id === documentId && document.lifecycleStatus === 'deleted',
    ),
    true,
  );
  assert.equal(
    (
      await editor.request(`/documents/${documentId}/lifecycle`, {
        workspace,
        method: 'POST',
        body: { action: 'purge' },
      })
    ).status,
    403,
  );
  assert.equal(
    (
      await owner.request(`/documents/${documentId}/lifecycle`, {
        workspace: other,
        method: 'POST',
        body: { action: 'restore' },
      })
    ).status,
    404,
  );
  response = await owner.request(`/documents/${documentId}/lifecycle`, {
    workspace,
    method: 'POST',
    body: { action: 'purge' },
  });
  assert.equal(response.status, 200);
  const { rows } = await stack.db.query(
    'SELECT file_name,source_revision,content_hash,lifecycle_status,storage_key FROM documents WHERE id=$1',
    [documentId],
  );
  assert.deepEqual(rows, [
    {
      file_name: 'phase-5-synthetic.txt',
      source_revision: 4,
      content_hash: 'sha256:synthetic',
      lifecycle_status: 'purged',
      storage_key: null,
    },
  ]);
});
test('document retrieval validates policy and reports unavailable embeddings explicitly', async () => {
  assert.equal(
    (
      await viewer.request('/documents/search', {
        workspace,
        method: 'POST',
        body: { query: 'synthetic evidence', policy: 'invented' },
      })
    ).status,
    400,
  );
  const response = await viewer.request('/documents/search', {
    workspace,
    method: 'POST',
    body: {
      query: 'synthetic evidence',
      policy: 'selected-only',
      selectedSourceIds: [randomUUID()],
    },
  });
  assert.equal(response.status, 503);
  const result = await response.json();
  assert.equal(result.ok, false);
  assert.equal(result.status, 'unavailable');
  assert.equal(result.limitations[0].code, 'EMBEDDINGS_UNAVAILABLE');
});
test('revoked memberships and signed-out or expired sessions stop access', async () => {
  await owner.request(`/workspaces/${workspace}/members/${viewer.user.id}`, { method: 'DELETE' });
  assert.equal((await viewer.request('/workflow-library', { workspace })).status, 403);
  const expired = await stack.db.query(
    "UPDATE sessions SET expires_at=now()-interval '1 second' WHERE user_id=$1 RETURNING id,user_id,expires_at,now() AS database_now",
    [viewer.user.id],
  );
  assert.ok(expired.rowCount > 0);
  assert.ok(expired.rows.every((row) => row.expires_at < row.database_now));
  assert.equal((await viewer.request('/session')).status, 401);
  assert.equal((await editor.request('/auth/sign-out', { method: 'POST', body: {} })).status, 200);
  assert.equal((await editor.request('/session')).status, 401);
});
