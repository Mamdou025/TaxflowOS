import { test } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import {
  createTestRun,
  isolatedEnvironment,
  assertRunPath,
  root,
} from '../../scripts/testing/runtime.mjs';

test('test processes exclude ambient database, provider and build-upload credentials', () => {
  const env = isolatedEnvironment(
    { DATABASE_URL: 'owned-test-database' },
    {
      PATH: 'tool-path',
      SystemRoot: 'system-path',
      DATABASE_URL: 'shared-database',
      AI_GATEWAY_API_KEY: 'do-not-inherit',
      OPENAI_API_KEY: 'do-not-inherit',
      SENTRY_AUTH_TOKEN: 'do-not-upload',
      NODE_OPTIONS: '--require external-hook',
      VITE_API_URL: 'https://shared.example',
    },
  );
  assert.deepEqual(env, {
    PATH: 'tool-path',
    SystemRoot: 'system-path',
    DATABASE_URL: 'owned-test-database',
  });
});

test('test output paths reject the parent directory and paths outside it', () => {
  const parent = path.join(root, 'test-results/phase2');
  assert.throws(() => assertRunPath(parent, parent));
  assert.throws(() => assertRunPath(parent, path.join(parent, '..', 'other')));
  assert.equal(assertRunPath(parent, path.join(parent, 'owned')), path.join(parent, 'owned'));
});

test('a failing test command remains failed and cleanup stops only its owned child', async () => {
  const first = createTestRun('cleanup-check');
  const second = createTestRun('cleanup-neighbor');
  const child = first.start(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], {
    log: 'owned-child',
  });
  const neighbor = second.start(process.execPath, ['-e', 'setInterval(() => {}, 1000)'], {
    log: 'neighbor',
  });
  try {
    await assert.rejects(
      first.command(process.execPath, ['-e', 'process.exit(7)'], { log: 'intentional-failure' }),
      /exited 7/,
    );
    await first.close();
    assert.ok(child.child.exitCode !== null || child.child.signalCode !== null);
    assert.equal(neighbor.child.exitCode, null);
    assert.equal(neighbor.child.signalCode, null);
    assert.notEqual(first.output, second.output);
  } finally {
    await first.close();
    await second.close();
  }
});
