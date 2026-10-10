import assert from 'node:assert/strict';
import {
  readFileSync,
  mkdtempSync,
  writeFileSync,
  truncateSync,
  unlinkSync,
  rmdirSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { createWorkflow, saveVersion } from '../../lib/workflow-core/src/application/commands';
import {
  startSession,
  changeSession,
  getSession,
  isDocumentSource,
} from '../../lib/workflow-core/src/application/sessions';
import { sessionRuntime } from '../../artifacts/api-server/src/lib/chatgpt-plugin/session-runtime';
import { decodeBackup } from '../../artifacts/api-server/src/storage/validate-backup';
import {
  MAX_TOOL_RESPONSE_BYTES,
  runReadTool,
  type ReadToolDependencies,
} from '../../artifacts/api-server/src/lib/chatgpt-plugin/read-tools';
import {
  loadChatgptPluginUi,
  MAX_UI_RESOURCE_BYTES,
} from '../../artifacts/api-server/src/lib/chatgpt-plugin/ui-resource';
import { projectCredentialFields } from '../../artifacts/api-server/src/lib/chatgpt-plugin/credential-projection';

function fixture() {
  const library = decodeBackup(
    readFileSync('tests/fixtures/backups/document-calculation-v1.json', 'utf8'),
  );
  const source = Object.values(library)[0];
  const saved = saveVersion(source, '2026-10-07T00:00:00.000Z');
  const entry = startSession(saved, 1, 'synthetic-plugin-run', '2026-10-07T00:01:00.000Z');
  library[entry.id] = entry;
  const dependencies: ReadToolDependencies = {
    readWorkspace: async () => ({
      workspace: { id: 'synthetic-workspace', name: 'Synthetic workspace' },
      libraryRevision: 4,
      library,
    }),
    now: () => new Date('2026-10-07T00:02:00.000Z'),
  };
  return { library, entry, dependencies };
}

test('plugin validates exact arguments before reading and exposes no write or generic operation', async () => {
  let reads = 0;
  const dependencies: ReadToolDependencies = {
    readWorkspace: async () => {
      reads++;
      throw new Error('must not read');
    },
  };
  for (const [name, input] of [
    ['execute_workflow', {}],
    ['__proto__', {}],
    ['get_workflow_version', { workflowId: 'example' }],
    ['get_workflow_version', { workflowId: 'example', version: 0 }],
    ['list_workflows', { workspaceId: 'other' }],
    ['inspect_workflow_run', { workflowId: 'example', runId: '', actorId: 'forged' }],
    ['open_workflow_view', { workflowId: 'example' }],
    ['open_workflow_view', { workflowId: 'example', version: 1, runId: 'run' }],
    ['open_workflow_view', { workflowId: 'example', version: 0 }],
    ['open_workflow_view', { workflowId: 'example', runId: '' }],
    ['open_workflow_view', { workflowId: 'example', version: 1, workspaceId: 'forged' }],
  ] as const) {
    assert.equal((await runReadTool(name, input, dependencies)).isError, true);
  }
  assert.equal(reads, 0);
});

test('opening an exact viewer reuses data-read snapshots and selects the requested block without writes', async () => {
  const { entry, library, dependencies } = fixture();
  const blockId = entry.versions[0].definition.blocks[0].id;
  const before = JSON.stringify(library);
  let reads = 0;
  const counted: ReadToolDependencies = {
    ...dependencies,
    readWorkspace: async () => {
      reads++;
      return dependencies.readWorkspace();
    },
  };
  for (const [name, input] of [
    ['get_workflow_version', { workflowId: entry.id, version: 1, blockId }],
    ['inspect_workflow_run', { workflowId: entry.id, runId: 'synthetic-plugin-run', blockId }],
  ] as const) {
    const expected = await runReadTool(name, input, dependencies);
    const opened = await runReadTool('open_workflow_view', input, counted);
    assert.deepEqual(opened, expected);
    assert.equal((opened._meta?.inscope as { selectedBlockId: string }).selectedBlockId, blockId);
    assert.equal(opened._meta?.['openai/outputTemplate'], undefined);
  }
  assert.equal(reads, 2);
  assert.equal(JSON.stringify(library), before);
});

test('exact saved version and run reads preserve the entire library and hide graph inputs from model summaries', async () => {
  const { entry, library, dependencies } = fixture();
  entry.versions[0].definition.blocks[0].config.privateEvidenceMarker = 'ONLY-IN-VIEWER';
  const before = JSON.stringify(library);
  const result = await runReadTool(
    'get_workflow_version',
    { workflowId: entry.id, version: 1 },
    dependencies,
  );
  assert.equal(result.isError, undefined);
  assert.equal(result.structuredContent?.version, 1);
  assert.equal(JSON.stringify(result.content).includes('ONLY-IN-VIEWER'), false);
  assert.equal(JSON.stringify(result.structuredContent).includes('ONLY-IN-VIEWER'), false);
  assert.equal(JSON.stringify(result._meta).includes('ONLY-IN-VIEWER'), true);
  const run = await runReadTool(
    'inspect_workflow_run',
    { workflowId: entry.id, runId: 'synthetic-plugin-run' },
    dependencies,
  );
  assert.equal(run.isError, undefined);
  assert.equal(run.structuredContent?.runId, 'synthetic-plugin-run');
  assert.equal(run.structuredContent?.paused, true);
  assert.equal(JSON.stringify(library), before);
});

test('missing explicit versions, workflows and runs fail instead of selecting another record', async () => {
  const { entry, dependencies } = fixture();
  for (const [name, input] of [
    ['get_workflow_version', { workflowId: entry.id, version: 99 }],
    ['get_workflow_version', { workflowId: 'missing', version: 1 }],
    ['inspect_workflow_run', { workflowId: entry.id, runId: 'missing' }],
    ['list_workflow_runs', { workflowId: 'missing' }],
    ['get_workflow_version', { workflowId: entry.id, version: 1, blockId: 'missing' }],
    [
      'inspect_workflow_run',
      { workflowId: entry.id, runId: 'synthetic-plugin-run', blockId: 'missing' },
    ],
    ['open_workflow_view', { workflowId: entry.id, version: 99 }],
    ['open_workflow_view', { workflowId: 'missing', version: 1 }],
    ['open_workflow_view', { workflowId: entry.id, runId: 'missing' }],
    ['open_workflow_view', { workflowId: entry.id, version: 1, blockId: 'missing' }],
  ] as const) {
    const result = await runReadTool(name, input, dependencies);
    assert.equal(result.isError, true);
    assert.deepEqual(result._meta, undefined);
  }
});

test('explicit block selection exposes its formula and recorded evidence, omits credential fields and preserves stored values', async () => {
  const { entry, library, dependencies } = fixture();
  const block = entry.versions[0].definition.blocks.find(
    (item) => item.config.toolId === 'logic.calculation_engine',
  )!;
  block.config.apiKey = 'PRIVATE-CREDENTIAL';
  block.config.nested = { headers: { Authorization: 'PRIVATE-HEADER' }, safeValue: 12 };
  entry.sessions![0].results[block.id] = {
    runId: 'synthetic-plugin-run',
    blockId: block.id,
    toolId: 'logic.calculation_engine',
    status: 'success',
    input: { item_total: 12, password: 'PRIVATE-INPUT' },
    output: { RESULT: 24, accessToken: 'PRIVATE-OUTPUT' },
    configSignature: JSON.stringify(block.config),
    logs: [],
    warnings: [],
    errors: [],
    evidenceRefs: [],
    sourceTrace: [],
    startedAt: '2026-10-07T00:01:00.000Z',
    completedAt: '2026-10-07T00:01:01.000Z',
  };
  const before = JSON.stringify(library);
  const version = await runReadTool(
    'get_workflow_version',
    { workflowId: entry.id, version: 1, blockId: block.id },
    dependencies,
  );
  assert.match(JSON.stringify(version.content), /item_total \* 2/);
  assert.equal(version.structuredContent?.credentialFieldsOmitted, true);
  assert.equal(JSON.stringify(version).includes('PRIVATE-'), false);
  const result = await runReadTool(
    'inspect_workflow_run',
    { workflowId: entry.id, runId: 'synthetic-plugin-run', blockId: block.id },
    dependencies,
  );
  assert.match(JSON.stringify(result.content), /item_total \* 2/);
  assert.deepEqual(
    result.structuredContent?.selectedResult &&
      (result.structuredContent.selectedResult as { output: unknown }).output,
    { RESULT: 24 },
  );
  assert.equal(JSON.stringify(result).includes('PRIVATE-'), false);
  const opened = await runReadTool(
    'open_workflow_view',
    { workflowId: entry.id, runId: 'synthetic-plugin-run', blockId: block.id },
    dependencies,
  );
  assert.deepEqual(opened, result);
  assert.equal(JSON.stringify(library), before);
});

test('UI assets are server-configured, bounded, optional and successful loads are cached until restart', async () => {
  const directory = mkdtempSync(path.join(tmpdir(), 'inscope-plugin-test-'));
  const asset = path.join(directory, 'viewer.html');
  const warnings: string[] = [];
  const warn = (message: string) => {
    warnings.push(message);
  };
  try {
    assert.equal(await loadChatgptPluginUi(undefined, warn), undefined);
    assert.equal(await loadChatgptPluginUi('relative.html', warn), undefined);
    assert.equal(await loadChatgptPluginUi(asset, warn), undefined);
    writeFileSync(asset, 'not HTML');
    assert.equal(await loadChatgptPluginUi(asset, warn), undefined);
    truncateSync(asset, MAX_UI_RESOURCE_BYTES + 1);
    assert.equal(await loadChatgptPluginUi(asset, warn), undefined);
    const html = '<!doctype html><html><body>synthetic viewer</body></html>';
    writeFileSync(asset, html);
    assert.deepEqual(await loadChatgptPluginUi(asset, warn), { html });
    writeFileSync(asset, 'changed after successful load');
    assert.deepEqual(await loadChatgptPluginUi(asset, warn), { html });
    assert.equal(warnings.length, 4);
    assert.equal(
      warnings.some((message) => message.includes(directory)),
      false,
    );
  } finally {
    unlinkSync(asset);
    rmdirSync(directory);
  }
});

test('credential projection preserves semantic field and worksheet dependency keys', () => {
  const projected = projectCredentialFields({
    definition: { config: { fields: [{ key: 'RESULT', label: 'Result' }], key: 'PRIVATE-KEY' } },
    result: {
      output: {
        fieldWorksheet: {
          lines: [
            {
              dependencies: [
                { key: 'RESULT', dependencies: [{ key: 'item_total', dependencies: [] }] },
              ],
            },
          ],
        },
      },
    },
  });
  assert.equal(projected.fieldsOmitted, true);
  assert.deepEqual(projected.value, {
    definition: { config: { fields: [{ key: 'RESULT', label: 'Result' }] } },
    result: {
      output: {
        fieldWorksheet: {
          lines: [
            {
              dependencies: [
                { key: 'RESULT', dependencies: [{ key: 'item_total', dependencies: [] }] },
              ],
            },
          ],
        },
      },
    },
  });
});

test('worksheet column titles survive projection while HTTP authentication headers remain private', () => {
  const result = projectCredentialFields({
    sheets: [{ headers: ['Account', 'Amount'] }],
    block: { headers: { Authorization: 'secret' } },
  });
  assert.deepEqual(result.value, { sheets: [{ headers: ['Account', 'Amount'] }], block: {} });
  assert.equal(result.fieldsOmitted, true);
});

test('large sources use labelled previews and exact source pages without dropping stored rows', async () => {
  const { entry, dependencies, library } = fixture();
  const block = entry.versions[0].definition.blocks.find((item) => item.family === 'Source')!;
  const rows = Array.from({ length: 500 }, (_, i) => ({
    rowId: `row-${i}`,
    label: `Account ${i}`,
    amount: i,
  }));
  entry.sessions![0].sources = [
    {
      id: 'first-file',
      blockId: block.id,
      name: 'First.json',
      mode: 'replace',
      at: '2026-10-07T00:01:00.000Z',
      rows,
    },
    {
      id: 'replacement-file',
      blockId: block.id,
      name: 'Correct.json',
      mode: 'replace',
      at: '2026-10-07T00:01:01.000Z',
      rows: [{ rowId: 'correct', label: 'Correct', amount: 0 }],
    },
  ];
  const before = JSON.stringify(library);
  const result = await runReadTool(
    'inspect_workflow_run',
    { workflowId: entry.id, runId: 'synthetic-plugin-run' },
    dependencies,
  );
  assert.equal(result.isError, undefined);
  const view = result._meta?.inscope as {
    inspection: {
      sourceSummaries: { id: string; active: boolean; rowCount: number; previewRows: unknown[] }[];
    };
    disclosure: { omittedCollections: unknown[] };
  };
  assert.deepEqual(
    view.inspection.sourceSummaries.map((source) => [
      source.id,
      source.active,
      source.rowCount,
      source.previewRows.length,
    ]),
    [
      ['first-file', false, 500, 10],
      ['replacement-file', true, 1, 1],
    ],
  );
  assert.ok(view.disclosure.omittedCollections.length);
  const page = await runReadTool(
    'read_workflow_source',
    {
      workflowId: entry.id,
      runId: 'synthetic-plugin-run',
      sourceId: 'first-file',
      offset: 480,
      limit: 20,
    },
    dependencies,
  );
  assert.deepEqual(page.structuredContent?.rows, rows.slice(480));
  assert.equal(page.structuredContent?.nextOffset, null);
  assert.equal(
    (
      await runReadTool(
        'read_workflow_source',
        { workflowId: entry.id, runId: 'synthetic-plugin-run', sourceId: 'wrong' },
        dependencies,
      )
    ).isError,
    true,
  );
  assert.equal(JSON.stringify(library), before);
});

test('recorded runs remain readable when session-only change history is unavailable', async () => {
  const { entry, library, dependencies } = fixture();
  const saved = entry.versions[0].definition;
  const manual = {
    ...saved.blocks[0],
    id: 'synthetic-record-input',
    family: 'Source' as const,
    subtype: 'Manual Entry' as const,
    config: { toolId: 'source.manual_value', sourceKind: 'manual_value', value: 8 },
  };
  let current = startSession(
    saveVersion(
      createWorkflow(entry.id, entry.templateId, { ...saved, blocks: [manual], edges: [] }),
    ),
    1,
    'synthetic-record-session',
    '2026-10-08T00:00:00.000Z',
  );
  current = changeSession(
    current,
    'synthetic-record-session',
    0,
    { kind: 'block', blockId: manual.id },
    sessionRuntime,
  );
  current = changeSession(
    current,
    'synthetic-record-session',
    1,
    { kind: 'record' },
    sessionRuntime,
  );
  library[entry.id] = current;
  const runId = current.runs[0].result.record.execution.id;
  let historyReads = 0;
  const reader = {
    ...dependencies,
    readHistory: async () => {
      historyReads++;
      throw new Error('A recorded run is not a mutable session.');
    },
  };
  const result = await runReadTool(
    'inspect_workflow_run',
    { workflowId: entry.id, runId, blockId: manual.id },
    reader,
  );
  assert.equal(result.isError, undefined);
  assert.equal(result.structuredContent?.kind, 'record');
  assert.equal(
    (result.structuredContent?.selectedResult as { output: { value: number } }).output.value,
    8,
  );
  assert.equal(historyReads, 0);
});

test('5000-row core source captures remain bounded when opened or selected and source pages retain exact rows', async () => {
  const { entry, library, dependencies } = fixture();
  const block = entry.versions[0].definition.blocks.find(isDocumentSource)!;
  assert.ok(block);
  const rows = Array.from({ length: 5000 }, (_, index) => ({
    rowId: `synthetic-${index}`,
    label: `Account ${index}`,
    amount: index,
    memo: 'Captured synthetic source evidence. '.repeat(8),
  }));
  const action = {
    kind: 'source' as const,
    blockId: block.id,
    sourceId: 'large-captured-source',
    name: 'synthetic-source.json',
    mode: 'replace' as const,
    rows,
    extraction: {
      id: 'large-captured-source',
      revision: 1,
      fileName: 'synthetic-source.json',
      contentHash: `sha256:${'b'.repeat(64)}`,
      extractedAt: '2026-10-08T00:00:00.000Z',
      method: 'json' as const,
      rows,
      segments: [],
      issues: [],
    },
  };
  const next = changeSession(entry, 'synthetic-plugin-run', 0, action, sessionRuntime);
  library[entry.id] = next;
  const stored = JSON.stringify(library);
  for (const name of ['inspect_workflow_run', 'open_workflow_view']) {
    const result = await runReadTool(
      name,
      { workflowId: entry.id, runId: 'synthetic-plugin-run', blockId: block.id },
      dependencies,
    );
    assert.equal(result.isError, undefined, JSON.stringify(result.structuredContent));
    assert.ok(Buffer.byteLength(JSON.stringify(result)) < MAX_TOOL_RESPONSE_BYTES);
    const view = result._meta?.inscope as {
      definition: { blocks: { id: string; config: Record<string, unknown> }[] };
      disclosure: { omittedCollections: { path: string; total: number; shown: number }[] };
    };
    const config = view.definition.blocks.find((item) => item.id === block.id)!.config;
    for (const key of ['rows', 'manualRows', 'tableRows'])
      assert.equal((config[key] as unknown[]).length, 10);
    assert.ok(view.disclosure.omittedCollections.some((item) => item.total === 5000));
  }
  const page = await runReadTool(
    'read_workflow_source',
    {
      workflowId: entry.id,
      runId: 'synthetic-plugin-run',
      sourceId: action.sourceId,
      offset: 4980,
      limit: 20,
    },
    dependencies,
  );
  assert.equal(page.isError, undefined);
  assert.deepEqual(page.structuredContent?.rows, rows.slice(4980));
  assert.equal(getSession(next, 'synthetic-plugin-run').sources[0].rows.length, 5000);
  assert.equal(JSON.stringify(library), stored);
});

test('lists report actual saved versions and paused sessions without executing them', async () => {
  const { entry, library, dependencies } = fixture();
  const before = JSON.stringify(library);
  const workflows = await runReadTool('list_workflows', {}, dependencies);
  assert.deepEqual(workflows.structuredContent?.workflows, [
    { workflowId: entry.id, name: entry.draft.name, versions: [1], draftIsAvailable: true },
  ]);
  const runs = await runReadTool('list_workflow_runs', { workflowId: entry.id }, dependencies);
  assert.deepEqual(runs.structuredContent?.runs, [
    {
      workflowId: entry.id,
      workflowName: entry.versions[0].definition.name,
      runId: 'synthetic-plugin-run',
      version: 1,
      at: '2026-10-07T00:01:00.000Z',
      status: 'paused',
    },
  ]);
  assert.equal(JSON.stringify(library), before);
});

test('oversize snapshots and failed reads return explicit errors without partial graph data', async () => {
  const { entry, dependencies } = fixture();
  entry.versions[0].definition.blocks[0].config.largeEvidence = 'x'.repeat(MAX_TOOL_RESPONSE_BYTES);
  const result = await runReadTool(
    'get_workflow_version',
    { workflowId: entry.id, version: 1 },
    dependencies,
  );
  assert.equal(result.isError, true);
  assert.equal(result._meta, undefined);
  assert.match(JSON.stringify(result.structuredContent), /RESPONSE_TOO_LARGE/);
  const failed = await runReadTool(
    'list_workflows',
    {},
    {
      readWorkspace: async () => {
        throw new Error('private database detail');
      },
    },
  );
  assert.equal(failed.isError, true);
  assert.equal(JSON.stringify(failed).includes('private database detail'), false);
  assert.match(JSON.stringify(failed.structuredContent), /READ_UNAVAILABLE/);
});
