import { test } from 'node:test';
import path from 'node:path';
import { createTestRun, root } from '../../scripts/testing/runtime.mjs';
import { startTestDatabase } from '../../scripts/testing/stack.mjs';

test(
  'session operations persist atomic receipts, current-role checks and library CAS in disposable PostgreSQL',
  { timeout: 240000 },
  async () => {
    const run = createTestRun('chatgpt-session-store');
    try {
      const { connectionString } = await startTestDatabase(run);
      const extraEnv = { DATABASE_URL: connectionString };
      await run.command(process.execPath, ['scripts/migrations.mjs', 'migrate'], {
        cwd: path.join(root, 'lib/db'),
        extraEnv,
        log: 'schema',
      });
      await run.command(
        process.execPath,
        [
          'scripts/node_modules/tsx/dist/cli.mjs',
          '--tsconfig',
          'artifacts/ai-workflow-builder/tsconfig.json',
          'tests/integration/fixtures/chatgpt-session-store.ts',
        ],
        { extraEnv, log: 'session-store' },
      );
    } finally {
      await run.close();
    }
  },
);
