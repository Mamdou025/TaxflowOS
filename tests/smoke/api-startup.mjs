import assert from 'node:assert/strict';
import { test } from 'node:test';

if (!process.env.TEST_API_BASE_URL) {
  throw new Error(
    'Set TEST_API_BASE_URL to an isolated local API started without AI provider credentials.',
  );
}
const base = new URL(process.env.TEST_API_BASE_URL);
if (base.protocol !== 'http:' || !['localhost', '127.0.0.1', '[::1]'].includes(base.hostname)) {
  throw new Error('This startup smoke test only accepts a local HTTP API.');
}

test('the API is healthy and refuses anonymous chat requests', async () => {
  const health = await fetch(new URL('/api/healthz', base), {
    headers: { 'x-request-id': 'phase9-health-probe' },
    signal: AbortSignal.timeout(10000),
  });
  assert.equal(health.status, 200);
  assert.equal(health.headers.get('x-request-id'), 'phase9-health-probe');
  assert.deepEqual(await health.json(), { status: 'ok' });

  const chat = await fetch(new URL('/api/copilotkit', base), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: '{ __typename }' }),
    signal: AbortSignal.timeout(10000),
  });
  assert.equal(chat.status, 401);
});
