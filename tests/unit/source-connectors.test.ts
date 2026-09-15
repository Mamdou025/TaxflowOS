import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  assertPublicHttpUrl,
  fetchJsonPayload,
  HttpJsonSourceError,
  mapRecordsToRows,
  parseHttpJsonConfig,
} from '../../lib/source-connectors/src/http-json';
import { buildApiRequest } from '../../lib/source-connectors/src/connectors';

test('row mapping preserves explicit zero and applies defaultAmount only without a numeric value', () => {
  const config = parseHttpJsonConfig({ url: 'https://example.com', defaultAmount: 7 });
  assert.equal(config.defaultAmount, 7);
  const mapped = mapRecordsToRows({
    records: [{ label: 'Zero', amount: 0 }, { label: 'Missing' }],
    fieldMap: { label: 'label', amount: 'amount' },
    defaultAmount: 7,
    maxRows: 100,
  });
  assert.deepEqual(
    mapped.rows.map((row) => row.amount),
    [0, 7],
  );
});

test('HTTP JSON retrieval retries transient responses and records its attempts', async () => {
  let attempts = 0;
  const result = await fetchJsonPayload(
    { url: 'https://example.com/data', method: 'GET', headers: {} },
    {
      maxAttempts: 3,
      retryDelayMs: 0,
      fetchImpl: async () => {
        attempts += 1;
        return attempts < 3
          ? new Response('temporarily unavailable', { status: 503 })
          : new Response(JSON.stringify({ records: [] }), { status: 200 });
      },
    },
  );
  assert.equal(attempts, 3);
  assert.equal(result.responseMeta.attempts, 3);
});

test('HTTP JSON retrieval does not retry an invalid successful response', async () => {
  let attempts = 0;
  await assert.rejects(
    fetchJsonPayload(
      { url: 'https://example.com/data', method: 'GET', headers: {} },
      {
        maxAttempts: 3,
        retryDelayMs: 0,
        fetchImpl: async () => {
          attempts += 1;
          return new Response('<html>not json</html>', { status: 200 });
        },
      },
    ),
    (error) =>
      error instanceof HttpJsonSourceError &&
      error.code === 'INVALID_JSON' &&
      error.retryable === false,
  );
  assert.equal(attempts, 1);
});

test('invalid URLs and unknown connector IDs fail predictably', () => {
  assert.throws(() => assertPublicHttpUrl('file:///local/file'));
  assert.throws(() => assertPublicHttpUrl('http://127.0.0.1/data'));
  assert.equal(buildApiRequest('does-not-exist').ok, false);
});
