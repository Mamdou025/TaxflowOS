import assert from 'node:assert/strict';
import { test } from 'node:test';
import { agentRequestSizeError } from '../../lib/api-zod/src/agent-requests';

test('agent request allowance accepts detailed instructions and checks the exact byte boundary', () => {
  const body = JSON.stringify({ system: 'Detailed instruction. '.repeat(15000) });
  assert.ok(Buffer.byteLength(body) > 102400);
  assert.equal(agentRequestSizeError(Buffer.byteLength(body)), undefined);
  assert.equal(agentRequestSizeError(4194304), undefined);
  assert.match(agentRequestSizeError(4194305) ?? '', /exceeds 4 MiB/);
});

test('agent request size includes UTF-8, JSON escaping and retrieval documents', () => {
  const body = JSON.stringify({
    system: 'Required rules',
    docMode: 'retrieval',
    documents: [{ name: 'Reference', text: '界'.repeat(1500000) }],
  });
  assert.ok(body.length < 4194304);
  assert.match(agentRequestSizeError(Buffer.byteLength(body)) ?? '', /exceeds 4 MiB/);
  const escaped = JSON.stringify({ system: '\n'.repeat(2100000) });
  assert.match(agentRequestSizeError(Buffer.byteLength(escaped)) ?? '', /exceeds 4 MiB/);
});
