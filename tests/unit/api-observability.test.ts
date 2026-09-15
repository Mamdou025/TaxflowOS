import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isRequestId } from '../../lib/api-zod/src/observability';
import { resolveRequestId } from '../../artifacts/api-server/src/observability/request-id';

test('request correlation accepts bounded IDs and replaces unsafe input', () => {
  assert.equal(isRequestId('browser:run_123.4-5'), true);
  assert.equal(
    resolveRequestId('browser:run_123.4-5', () => 'generated'),
    'browser:run_123.4-5',
  );

  for (const invalid of ['', 'contains spaces', 'x'.repeat(129), ['ambiguous', 'headers']]) {
    assert.equal(
      resolveRequestId(invalid, () => 'generated'),
      'generated',
    );
  }
});
