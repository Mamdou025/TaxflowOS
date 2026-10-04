import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { LocalWorkflowSnapshotSchema } from '../../lib/workflow-contracts/src/generated-schemas';
import type { WorkflowBlock } from '../../lib/workflow-contracts/src/domain/workflow-types';
import { validateRunInputPatch } from '../../lib/workflow-core/src/application/session-inputs';
import { apiRequestSignature } from '../../lib/workflow-executors/src/api-snapshot';
import { runHttpJsonSource } from '../../lib/workflow-executors/src/execution/blocks/source/http-json/run';
import { prepareSessionInputProposal } from '../../artifacts/ai-workflow-builder/src/features/workflows-hub/session-input-proposal';
import {
  parseExcelWorkbookFile,
  buildExcelSourceConfigPatch,
} from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/parsing/excel-utils';

test('agent workbook field proposals derive real rows and reject invented sources or missing sheets', async () => {
  const XLSX = createRequire(
    new URL('../../artifacts/ai-workflow-builder/package.json', import.meta.url),
  )('xlsx');
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([
      ['label', 'amount', 'corrected'],
      ['Synthetic item', 200, 250],
    ]),
    'Records',
  );
  XLSX.utils.book_append_sheet(
    workbook,
    XLSX.utils.aoa_to_sheet([
      ['name', 'value'],
      ['Different layout', 300],
    ]),
    'Other',
  );
  const file = new File(
    [XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })],
    'records.xlsx',
  );
  const parsed = await parseExcelWorkbookFile(file);
  const backup = JSON.parse(
    readFileSync('tests/fixtures/backups/document-calculation-v1.json', 'utf8'),
  );
  const block = LocalWorkflowSnapshotSchema.parse(
    backup.library['custom:synthetic-document-calculation'].draft,
  ).blocks[0];
  block.family = 'Source';
  block.subtype = 'Excel / Workbook';
  block.config = buildExcelSourceConfigPatch({ workbook: parsed, selectedSheetName: 'Records' });
  block.config.columnMapping = { ...(block.config.columnMapping as object), description: 'label' };
  const original = structuredClone(block);
  const patch = prepareSessionInputProposal(block, {
    columnMapping: { label: 'label', amount: 'corrected' },
  });
  assert.equal((patch.rows as { amount: number }[])[0].amount, 250);
  assert.equal((patch.columnMapping as { description: string }).description, 'label');
  assert.equal((block.config.rows as { amount: number }[])[0].amount, 200);
  assert.deepEqual(block, original);
  const other = prepareSessionInputProposal(block, { selectedSheet: 'Other' });
  assert.equal((other.rows as { amount: number }[])[0].amount, 300);
  assert.equal((other.columnMapping as { amount: string }).amount, 'value');
  assert.throws(
    () => prepareSessionInputProposal(block, { columnMapping: { amount: 'not a real column' } }),
    /column shown in the source form/,
  );
  assert.throws(
    () => prepareSessionInputProposal(block, { columnMapping: { hiddenRule: 'label' } }),
    /column shown in the source form/,
  );
  assert.throws(
    () => prepareSessionInputProposal(block, { rows: [{ amount: 999 }] }),
    /actual attachment/,
  );
  assert.throws(
    () => prepareSessionInputProposal(block, { selectedSheet: 'missing' }),
    /existing workbook sheet/,
  );
  assert.throws(
    () =>
      prepareSessionInputProposal(
        { ...block, config: { sourceKind: 'manual_table', rows: [] } },
        { selectedSheet: 'Records' },
      ),
    /original workbook/,
  );
});

test('trusted HTTP response patches retain their request signature and reject stale replay', () => {
  const backup = JSON.parse(
    readFileSync('tests/fixtures/backups/document-calculation-v1.json', 'utf8'),
  );
  const workflow = LocalWorkflowSnapshotSchema.parse(
    backup.library['custom:synthetic-document-calculation'].draft,
  );
  const block: WorkflowBlock = {
    ...workflow.blocks[0],
    family: 'Source',
    subtype: 'API / HTTP Request',
    config: {
      sourceKind: 'http_json',
      toolId: 'source.http_json',
      url: 'https://example.invalid/previous',
      method: 'GET',
    },
  };
  block.config.fetchedRequestSignature = apiRequestSignature(block.config);
  const nextRequest = { ...block.config, url: 'https://example.invalid/current' };
  const captured = {
    url: nextRequest.url,
    fetchedRows: [{ rowId: 'one', label: 'Captured item', amount: 250 }],
    responseMeta: { status: 200, fetchedAt: '2026-01-02T03:04:05.000Z', recordCount: 1 },
    fetchedRequestSignature: apiRequestSignature(nextRequest),
    samplePayload: [{ label: 'Captured item', amount: 250 }],
  };
  const patch = validateRunInputPatch(block, captured);
  assert.deepEqual(patch, captured);
  assert.notEqual(patch.fetchedRequestSignature, block.config.fetchedRequestSignature);
  const replay = (config: Record<string, unknown>) =>
    runHttpJsonSource({
      inputsByRole: {},
      block: { ...block, config },
      config,
      evidenceRefs: [],
      runId: 'http-response-test',
      sourceTrace: [],
      startedAt: '2026-01-02T03:04:05.000Z',
      upstreamBlocks: [],
      upstreamResults: [],
      workflow,
    });
  const current = { ...block.config, ...patch };
  const result = replay(current);
  assert.equal(result.status, 'success');
  assert.equal((result.outputs.rows as { rows: { amount: number }[] }).rows[0].amount, 250);
  const stale = replay({ ...current, url: 'https://example.invalid/changed-without-fetch' });
  assert.equal(stale.status, 'error');
  assert.match(stale.errors[0], /Fetch again/);

  assert.deepEqual(prepareSessionInputProposal(block, { url: nextRequest.url }), {
    url: nextRequest.url,
  });
  for (const [key, value] of Object.entries({
    fetchedRows: captured.fetchedRows,
    responseMeta: captured.responseMeta,
    fetchedAt: captured.responseMeta.fetchedAt,
    fetchedRequestSignature: captured.fetchedRequestSignature,
    samplePayload: captured.samplePayload,
  })) {
    assert.throws(
      () => prepareSessionInputProposal(block, { [key]: value }),
      /actual source form/,
      `Agent proposals must not supply ${key}`,
    );
  }
});

test('agent API parameters use the same request builder and restrictions as the source form', () => {
  const backup = JSON.parse(
    readFileSync('tests/fixtures/backups/document-calculation-v1.json', 'utf8'),
  );
  const block: WorkflowBlock = {
    ...LocalWorkflowSnapshotSchema.parse(
      backup.library['custom:synthetic-document-calculation'].draft,
    ).blocks[0],
    family: 'Source',
    subtype: 'API / HTTP Request',
    config: {
      sourceKind: 'http_json',
      connectorId: 'boc.fx_observations',
      connectorParams: { currency: 'EUR', year: 2024 },
      url: 'https://example.invalid/old-request',
    },
  };
  const patch = prepareSessionInputProposal(block, { connectorParams: { year: 2025 } });
  assert.equal(
    patch.url,
    'https://www.bankofcanada.ca/valet/observations/FXEURCAD/json?start_date=2025-01-01&end_date=2025-12-31',
  );
  assert.deepEqual(patch.connectorParams, { currency: 'EUR', year: 2025 });
  assert.deepEqual(patch.fieldMap, { rowId: 'd', label: 'd', amount: 'FXEURCAD.v' });
  assert.throws(
    () => prepareSessionInputProposal(block, { connectorParams: { year: 1900 } }),
    /1950/,
  );
  assert.throws(
    () => prepareSessionInputProposal(block, { connectorParams: { nonexistent: 1 } }),
    /parameter fields/,
  );
  assert.throws(
    () => prepareSessionInputProposal(block, { fieldMap: { amount: 'other' } }),
    /derives its request/,
  );
  assert.throws(
    () => prepareSessionInputProposal(block, { url: 'https://example.invalid/override' }),
    /derives its request/,
  );
  assert.deepEqual(
    prepareSessionInputProposal(block, {
      connectorId: 'custom',
      url: 'https://example.invalid/custom',
    }),
    {
      connectorId: 'custom',
      url: 'https://example.invalid/custom',
      connectorParams: {},
    },
  );
});

test('agent FX edits allow the override field but cannot fabricate fetched rate evidence', () => {
  const backup = JSON.parse(
    readFileSync('tests/fixtures/backups/document-calculation-v1.json', 'utf8'),
  );
  const block: WorkflowBlock = {
    ...LocalWorkflowSnapshotSchema.parse(
      backup.library['custom:synthetic-document-calculation'].draft,
    ).blocks[0],
    family: 'Source',
    subtype: 'Manual Entry',
    config: { sourceKind: 'currency_rate', documentCurrency: 'USD', reportingCurrency: 'CAD' },
  };
  assert.deepEqual(prepareSessionInputProposal(block, { overrideRate: 1.4 }), {
    overrideRate: 1.4,
  });
  assert.throws(
    () => prepareSessionInputProposal(block, { overrideRate: -1 }),
    /positive exchange rate/,
  );
  assert.throws(() => prepareSessionInputProposal(block, { liveRate: 1.4 }), /source form/);
  assert.throws(
    () =>
      prepareSessionInputProposal(block, {
        rateFetchedFor: { documentCurrency: 'USD', reportingCurrency: 'CAD', year: 2025 },
      }),
    /source form/,
  );
});
