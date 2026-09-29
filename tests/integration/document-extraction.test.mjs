import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createTestRun } from '../../scripts/testing/runtime.mjs';
import { startTestStack } from '../../scripts/testing/stack.mjs';
import { createAccount, createWorkspace, setMember } from './access-fixtures.mjs';

const run = createTestRun('document-extraction');
console.log(`Document extraction evidence: ${run.output}`);
let stack, owner, viewer, workspace;
before(
  async () => {
    stack = await startTestStack(run);
    owner = await createAccount(stack);
    viewer = await createAccount(stack);
    workspace = await createWorkspace(owner);
    await setMember(owner, workspace, viewer, 'viewer');
  },
  { timeout: 240000 },
);
after(() => run.close());
function extract(account, name = 'sales-check.pdf', path = '/workflow-extract') {
  const body = new FormData();
  body.append('file', new Blob([fs.readFileSync(`e2e/fixtures/demo/${name}`)]), name);
  return fetch(`${stack.baseURL}/api${path}`, {
    method: 'POST',
    body,
    headers: {
      Cookie: account.cookie,
      Origin: stack.origin,
      'x-taxflow-workspace': workspace,
    },
    signal: AbortSignal.timeout(30000),
  });
}
test('document extraction denies viewers for case and trailing-slash variants', async () => {
  for (const path of ['/workflow-extract', '/WORKFLOW-EXTRACT/'])
    assert.equal((await extract(viewer, 'sales-check.pdf', path)).status, 403);
});
test('real extraction is persisted with source history in the workspace library', async () => {
  const response = await extract(owner);
  assert.equal(response.status, 200, await response.clone().text());
  const { extraction } = await response.json();
  assert.equal(extraction.method, 'pdf_text');
  assert.equal(extraction.segments[0].page, 1);
  const library = JSON.parse(
    fs.readFileSync('tests/fixtures/backups/document-calculation-v1.json', 'utf8'),
  ).library;
  const entry = Object.values(library)[0];
  entry.versions = [{ number: 1, savedAt: extraction.extractedAt, definition: entry.draft }];
  entry.runs = [];
  entry.sessions = [
    {
      id: 'document-run',
      version: 1,
      revision: 1,
      createdAt: extraction.extractedAt,
      paused: true,
      results: {},
      stale: [],
      reviewed: [],
      attempts: [],
      sources: [
        {
          id: extraction.id,
          blockId: entry.draft.blocks.find((block) => block.family === 'Source').id,
          name: extraction.fileName,
          mode: 'replace',
          at: extraction.extractedAt,
          rows: [],
          extraction,
        },
      ],
    },
  ];
  entry.sessions[0].documentReviews = [
    {
      id: 'persisted-review',
      at: extraction.extractedAt,
      sessionRevision: 1,
      sourceId: extraction.id,
      sourceRevision: extraction.revision,
      sourceHash: extraction.contentHash,
      fileName: extraction.fileName,
      blockId: entry.sessions[0].sources[0].blockId,
      draft: {
        observations: [
          {
            field: 'fact',
            value: 'Captured quotation retained for review',
            citations: [
              {
                segmentId: extraction.segments[0].id,
                quote: extraction.segments[0].text.slice(0, 20),
              },
            ],
          },
        ],
        questions: ['document_type', 'company', 'reporting_period', 'currency'].map((field) => ({
          field,
          kind: 'missing',
          question: `Review ${field}`,
          citations: [],
        })),
      },
    },
  ];
  const saved = await owner.request('/workflow-library', {
    method: 'PUT',
    workspace,
    body: { revision: 0, payload: JSON.stringify(library) },
  });
  assert.equal(saved.status, 200, await saved.clone().text());
  const loaded = await (await owner.request('/workflow-library', { workspace })).json();
  assert.deepEqual(JSON.parse(loaded.payload)[entry.id].sessions, entry.sessions);
  const denied = await viewer.request('/workflow-library', {
    method: 'PUT',
    workspace,
    body: { revision: loaded.revision, payload: JSON.stringify(library) },
  });
  assert.equal(denied.status, 403);
});
test('empty image PDF reports OCR requirement without a fabricated extraction', async () => {
  const response = await extract(owner, 'no-text.pdf');
  assert.equal(response.status, 200);
  const result = await response.json();
  assert.equal(result.needsOcr, true);
  assert.equal(result.extraction, undefined);
});
