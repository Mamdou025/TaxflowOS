import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { createTestRun } from '../../scripts/testing/runtime.mjs';
import { startTestStack } from '../../scripts/testing/stack.mjs';
import { createAccount, createWorkspace, setMember } from './access-fixtures.mjs';

const run = createTestRun('chatgpt-plugin');
let stack, owner, viewer, stranger, workspace, other, workflowId, originalPayload;
let uiPath;
let requestId = 0;
const paths = ['/chatgpt/mcp', '/CHATGPT/MCP/'];
const accept = { Accept: 'application/json, text/event-stream' };
const rpc = (method, params) => ({
  jsonrpc: '2.0',
  id: ++requestId,
  method,
  ...(params ? { params } : {}),
});
const call = (name, args = {}) => rpc('tools/call', { name, arguments: args });
function request(account, body, selectedWorkspace = workspace, path = paths[0]) {
  return account.request(path, {
    method: 'POST',
    workspace: selectedWorkspace,
    headers: accept,
    body,
  });
}
before(
  async () => {
    stack = await startTestStack({
      ...run,
      start(command, args, options) {
        return run.start(command, args, {
          ...options,
          extraEnv: { ...options.extraEnv, ...(uiPath ? { INSCOPE_CHATGPT_UI_PATH: uiPath } : {}) },
        });
      },
    });
    owner = await createAccount(stack, 'Plugin owner');
    viewer = await createAccount(stack, 'Plugin viewer');
    stranger = await createAccount(stack, 'Unrelated user');
    workspace = await createWorkspace(owner);
    other = await createWorkspace(stranger);
    await setMember(owner, workspace, viewer, 'viewer');
    const library = JSON.parse(
      fs.readFileSync('tests/fixtures/backups/document-calculation-v1.json', 'utf8'),
    ).library;
    const entry = Object.values(library)[0];
    workflowId = entry.id;
    entry.versions = [
      { number: 1, savedAt: '2026-10-07T00:00:00.000Z', definition: structuredClone(entry.draft) },
    ];
    entry.sessions = [
      {
        id: 'synthetic-plugin-run',
        version: 1,
        revision: 0,
        createdAt: '2026-10-07T00:01:00.000Z',
        paused: true,
        results: {},
        stale: [],
        reviewed: [],
        sources: [],
        attempts: [],
      },
    ];
    originalPayload = JSON.stringify({ format: 'taxflow-workflow-backup-v1', library });
    const saved = await owner.request('/workflow-library', {
      method: 'PUT',
      workspace,
      body: { payload: originalPayload, revision: 0 },
    });
    assert.equal(saved.status, 200, await saved.clone().text());
  },
  { timeout: 240000 },
);
after(() => run.close());

test('MCP requires a real session, application origin and current membership on all route variants', async () => {
  for (const path of paths) {
    const anonymous = await fetch(stack.baseURL + '/api' + path, {
      method: 'POST',
      headers: {
        ...accept,
        Origin: stack.origin,
        'Content-Type': 'application/json',
        'x-user-id': owner.user.id,
        'x-taxflow-workspace': workspace,
      },
      body: JSON.stringify(rpc('tools/list')),
    });
    assert.equal(anonymous.status, 401);
    assert.equal((await request(stranger, rpc('tools/list'), workspace, path)).status, 403);
    assert.equal((await request(viewer, rpc('tools/list'), other, path)).status, 403);
    assert.equal(
      (
        await owner.request(path, {
          method: 'POST',
          workspace,
          headers: { ...accept, Origin: 'https://foreign.invalid' },
          body: rpc('tools/list'),
        })
      ).status,
      403,
    );
    assert.equal((await request(owner, rpc('tools/list'), 'invalid', path)).status, 400);
  }
});

test('Viewer can discover scoped commands but cannot mutate through any route variant', async () => {
  const initialized = await request(
    viewer,
    rpc('initialize', {
      protocolVersion: '2025-03-26',
      capabilities: {},
      clientInfo: { name: 'synthetic-test', version: '1' },
    }),
  );
  assert.equal(initialized.status, 200);
  const initialization = (await initialized.json()).result;
  assert.equal(initialization.serverInfo.name, 'inscope-workflow-reader');
  assert.match(
    initialization.instructions,
    /open_workflow_view only when the user explicitly asks/,
  );
  assert.match(initialization.instructions, /do not open another viewer/);
  assert.match(initialization.instructions, /read-only grants cannot edit or recalculate/);
  for (const path of paths) {
    const response = await request(viewer, rpc('tools/list'), workspace, path);
    assert.equal(response.status, 200, await response.clone().text());
    const tools = (await response.json()).result.tools;
    assert.deepEqual(tools.map((tool) => tool.name).sort(), [
      'append_workflow_source',
      'apply_workflow_change',
      'begin_workflow_source',
      'capture_workflow_source',
      'get_workflow_version',
      'inspect_workflow_run',
      'inspect_workflow_source',
      'list_workflow_runs',
      'list_workflows',
      'open_workflow_view',
      'preview_workflow_change',
      'read_workflow_source',
      'recalculate_workflow_session',
      'start_workflow_session',
    ]);
    assert.ok(tools.every((tool) => !tool.annotations.destructiveHint));
    assert.deepEqual(
      tools.find((tool) => tool.name === 'apply_workflow_change')._meta.ui.visibility,
      ['app'],
    );
    assert.equal(
      tools.find((tool) => tool.name === 'start_workflow_session').annotations.readOnlyHint,
      false,
    );
    for (const tool of tools) assert.doesNotMatch(tool.description, /embedded.*workflow/);
    const unavailableResource = await (
      await request(
        viewer,
        rpc('resources/read', { uri: 'ui://inscope/workflow-viewer-v3.html' }),
        workspace,
        path,
      )
    ).json();
    assert.ok(unavailableResource.error);
    assert.equal(unavailableResource.result, undefined);
    const unavailableView = (
      await (
        await request(
          viewer,
          call('open_workflow_view', { workflowId, version: 1 }),
          workspace,
          path,
        )
      ).json()
    ).result;
    assert.equal(unavailableView.isError, true);
    assert.equal(unavailableView.structuredContent.error.code, 'UI_UNAVAILABLE');
    assert.equal(unavailableView._meta, undefined);
    for (const method of ['GET', 'DELETE', 'PUT'])
      assert.equal(
        (await viewer.request(path, { method, workspace, headers: accept })).status,
        405,
      );
    const denied = await request(
      viewer,
      call('execute_workflow', { workflowId, version: 1 }),
      workspace,
      path,
    );
    assert.equal((await denied.json()).result.isError, true);
    for (const [name, args] of [
      [
        'start_workflow_session',
        { workflowId, version: 1, expectedLibraryRevision: 1, requestId: 'denied-start' },
      ],
      [
        'preview_workflow_change',
        {
          workflowId,
          runId: 'synthetic-plugin-run',
          expectedRevision: 0,
          expectedLibraryRevision: 1,
          change: { kind: 'inputs', blockId: 'missing', patch: { value: 3 } },
        },
      ],
      ['apply_workflow_change', { reviewToken: 'a'.repeat(43) }],
      [
        'recalculate_workflow_session',
        {
          workflowId,
          runId: 'synthetic-plugin-run',
          expectedRevision: 0,
          expectedLibraryRevision: 1,
          requestId: 'denied-run',
        },
      ],
      [
        'begin_workflow_source',
        {
          workflowId,
          runId: 'synthetic-plugin-run',
          blockId: 'source',
          expectedRevision: 0,
          fileName: 'trial.json',
          size: 10,
          mimeType: 'application/json',
        },
      ],
      ['append_workflow_source', { uploadId: 'missing', offset: 0, base64: 'e30=' }],
      ['inspect_workflow_source', { uploadId: 'missing' }],
      ['capture_workflow_source', { uploadId: 'missing' }],
    ]) {
      const rejected = (await (await request(viewer, call(name, args), workspace, path)).json())
        .result;
      assert.equal(rejected.isError, true, name);
      assert.equal(rejected.structuredContent.error.code, 'FORBIDDEN', name);
    }
  }
});

test('exact saved snapshots and run reads leave server revision and payload unchanged', async () => {
  const versionResponse = await request(
    viewer,
    call('get_workflow_version', { workflowId, version: 1 }),
  );
  const version = (await versionResponse.json()).result;
  assert.equal(version.isError, undefined);
  assert.equal(version._meta.inscope.kind, 'workflow-version');
  assert.equal(version._meta.inscope.workspace.id, workspace);
  assert.equal(version._meta.inscope.version, 1);
  assert.ok(version._meta.inscope.definition.blocks.length > 0);
  assert.equal(version.structuredContent.definition, undefined);
  const inspected = (
    await (
      await request(
        viewer,
        call('inspect_workflow_run', { workflowId, runId: 'synthetic-plugin-run' }),
      )
    ).json()
  ).result;
  assert.equal(inspected._meta.inscope.runId, 'synthetic-plugin-run');
  assert.equal(inspected.structuredContent.paused, true);
  for (const [name, args] of [
    ['get_workflow_version', { workflowId, version: 99 }],
    ['get_workflow_version', { workflowId }],
    ['inspect_workflow_run', { workflowId, runId: 'missing' }],
    ['list_workflows', { workspaceId: other }],
  ])
    assert.equal((await (await request(viewer, call(name, args))).json()).result.isError, true);
  const saved = await (await owner.request('/workflow-library', { workspace })).json();
  assert.equal(saved.revision, 1);
  assert.equal(saved.payload, originalPayload);
});

test('malformed or unknown MCP operations do not expose data or perform writes', async () => {
  for (const body of [{ notRpc: true }, rpc('workflows/delete', { workflowId })]) {
    const response = await request(viewer, body);
    const result = await response.json();
    assert.ok(result.error);
    assert.equal(result.result, undefined);
  }
});

test('membership removal and session revocation take effect before any MCP data', async () => {
  const temporary = viewer;
  assert.equal((await request(temporary, rpc('tools/list'))).status, 200);
  await owner.request(`/workspaces/${workspace}/members/${temporary.user.id}`, {
    method: 'DELETE',
  });
  assert.equal((await request(temporary, call('list_workflows'))).status, 403);
  await setMember(owner, workspace, temporary, 'viewer');
  await stack.db.query(
    "UPDATE sessions SET expires_at=now()-interval '1 second' WHERE user_id=$1",
    [temporary.user.id],
  );
  assert.equal((await request(temporary, call('list_workflows'))).status, 401);
});

test('configured static viewer loads as an MCP resource without accepting a browser file path', async () => {
  uiPath = path.join(run.output, 'synthetic-viewer.html');
  const html = '<!doctype html><html><body>synthetic workflow viewer</body></html>';
  fs.writeFileSync(uiPath, html);
  await stack.restartApi();
  const tools = (await (await request(owner, rpc('tools/list'))).json()).result.tools;
  for (const tool of tools) {
    if (tool.name === 'open_workflow_view') {
      assert.equal(tool._meta.ui.resourceUri, 'ui://inscope/workflow-viewer-v3.html');
      assert.equal(tool._meta['openai/outputTemplate'], 'ui://inscope/workflow-viewer-v3.html');
      assert.match(tool.description, /embedded interactive workflow overview/);
      assert.match(tool.description, /compatible hosts/);
      assert.match(
        tool.description,
        /selectable step details, inputs, sources, changes and an optional canvas/,
      );
    } else if (
      ['get_workflow_version', 'inspect_workflow_run', 'read_workflow_source'].includes(tool.name)
    ) {
      assert.equal(tool._meta.ui.resourceUri, undefined);
      assert.equal(tool._meta['openai/outputTemplate'], undefined);
      assert.deepEqual(tool._meta.ui.visibility, ['model', 'app']);
      assert.equal(tool._meta['openai/widgetAccessible'], true);
      if (tool.name !== 'read_workflow_source')
        assert.match(tool.description, /without opening a viewer/);
      assert.doesNotMatch(tool.description, /embedded.*workflow/);
    } else if (['list_workflows', 'list_workflow_runs'].includes(tool.name)) {
      assert.equal(tool._meta, undefined);
      assert.doesNotMatch(tool.description, /embedded.*workflow/);
    } else {
      assert.deepEqual(tool._meta.ui.visibility, ['app']);
      assert.equal(tool._meta['openai/widgetAccessible'], true);
      assert.equal(tool._meta['openai/outputTemplate'], undefined);
      assert.equal(tool._meta.ui.resourceUri, undefined);
    }
  }
  const resources = (await (await request(owner, rpc('resources/list'))).json()).result.resources;
  assert.equal(resources.length, 1);
  assert.equal(resources[0].uri, 'ui://inscope/workflow-viewer-v3.html');
  assert.match(resources[0].description, /Interactive InScope workspace/);
  assert.match(resources[0].description, /exact workflow version or working run/);
  assert.match(resources[0].description, /Workflow, Inputs, Sources and Changes/);
  const resource = (
    await (
      await request(owner, rpc('resources/read', { uri: 'ui://inscope/workflow-viewer-v3.html' }))
    ).json()
  ).result;
  assert.deepEqual(resource.contents, [
    {
      uri: 'ui://inscope/workflow-viewer-v3.html',
      mimeType: 'text/html;profile=mcp-app',
      text: html,
      _meta: { 'openai/widgetDescription': resources[0].description },
    },
  ]);
  const invalid = (
    await (
      await request(owner, call('get_workflow_version', { workflowId, version: 1, uiPath }))
    ).json()
  ).result;
  assert.equal(invalid.isError, true);
});

test('explicit view opens exact saved data while selected-block followups retain data without a new UI template', async () => {
  const activeViewer = await createAccount(stack, 'Active plugin viewer');
  await setMember(owner, workspace, activeViewer, 'viewer');
  const original = JSON.parse(originalPayload).library[workflowId];
  const blockId = original.versions[0].definition.blocks[0].id;
  const args = [
    ['get_workflow_version', { workflowId, version: 1, blockId }],
    ['inspect_workflow_run', { workflowId, runId: 'synthetic-plugin-run', blockId }],
  ];
  for (const [readName, input] of args) {
    const opened = (await (await request(activeViewer, call('open_workflow_view', input))).json())
      .result;
    const read = (await (await request(activeViewer, call(readName, input))).json()).result;
    assert.equal(opened.isError, undefined);
    assert.equal(opened._meta.inscope.selectedBlockId, blockId);
    assert.equal(opened._meta.inscope.workspace.id, workspace);
    assert.equal(opened._meta.inscope.workflowId, workflowId);
    assert.equal(opened._meta.inscope.version, 1);
    assert.deepEqual(read._meta.inscope.definition, opened._meta.inscope.definition);
    assert.deepEqual(read.structuredContent.selectedBlock, opened.structuredContent.selectedBlock);
    assert.deepEqual(
      read.structuredContent.selectedResult,
      opened.structuredContent.selectedResult,
    );
    assert.equal(read._meta.ui, undefined);
    assert.equal(read._meta['openai/outputTemplate'], undefined);
    assert.equal((await request(stranger, call('open_workflow_view', input))).status, 403);
    assert.equal((await request(owner, call('open_workflow_view', input), other)).status, 403);
    assert.equal((await request(viewer, call('open_workflow_view', input))).status, 401);
  }
  for (const input of [
    { workflowId },
    { workflowId, version: 1, runId: 'synthetic-plugin-run' },
    { workflowId, version: 0 },
    { workflowId, version: 99 },
    { workflowId, runId: 'missing' },
    { workflowId, version: 1, blockId: 'missing' },
    { workflowId, version: 1, workspaceId: other },
  ]) {
    const invalid = (await (await request(owner, call('open_workflow_view', input))).json()).result;
    assert.equal(invalid.isError, true);
    assert.equal(invalid._meta, undefined);
  }
  const saved = await (await owner.request('/workflow-library', { workspace })).json();
  assert.equal(saved.revision, 1);
  assert.equal(saved.payload, originalPayload);
});
