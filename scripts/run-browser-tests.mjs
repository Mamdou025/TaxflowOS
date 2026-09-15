import path from 'node:path';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { createTestRun, root } from './testing/runtime.mjs';
import { startTestStack } from './testing/stack.mjs';

const suite = process.argv[2];
const configs = {
  reliability: 'playwright.reliability.config.mjs',
  workflow: 'playwright.workflow.config.mjs',
  persistence: 'playwright.persistence.config.mjs',
  probe: 'playwright.probe.config.mjs',
};
if (!configs[suite]) throw new Error('Choose reliability, persistence, workflow or probe');
const run = createTestRun(suite);
console.log(`Test run ${run.id}; reports and logs: ${run.output}`);
let interrupted = false;
async function interrupt() {
  interrupted = true;
  await run.close();
  process.exitCode = 130;
}
process.once('SIGINT', interrupt);
process.once('SIGTERM', interrupt);
try {
  const stack = ['reliability', 'probe'].includes(suite) ? undefined : await startTestStack(run);
  if (interrupted) throw new Error('Test run interrupted');
  const vite = run.start(process.execPath, ['scripts/testing/vite-server.mjs'], {
    log: 'vite',
    ipc: true,
    extraEnv: {
      PORT: '1',
      TAXFLOW_TEST_WEB_PORT: stack ? String(stack.webPort) : '',
      BASE_PATH: '/',
      API_BASE: stack?.baseURL ?? 'http://127.0.0.1:1',
      TAXFLOW_TEST_OUTPUT_DIR: run.output,
      TAXFLOW_TEST_SUITE: suite,
    },
  });
  const baseURL = await run.ready(vite);
  fs.writeFileSync(
    path.join(run.output, 'endpoints.json'),
    JSON.stringify(
      {
        browser: baseURL,
        api: stack?.baseURL ?? null,
      },
      null,
      2,
    ),
  );
  if (suite !== 'probe') {
    console.log('Preparing the isolated browser dependency cache…');
    await run.command(process.execPath, ['scripts/testing/browser-warmup.mjs'], {
      log: 'browser-warmup',
      extraEnv: { TAXFLOW_TEST_BASE_URL: baseURL, TAXFLOW_TEST_OUTPUT_DIR: run.output },
    });
  }
  if (interrupted) throw new Error('Test run interrupted');
  const require = createRequire(path.join(root, 'package.json'));
  const result = run.start(
    process.execPath,
    [
      require.resolve('@playwright/test/cli'),
      'test',
      '--config',
      configs[suite],
      '--tsconfig',
      'e2e/tsconfig.json',
      ...process.argv.slice(3),
    ],
    {
      log: 'playwright',
      extraEnv: {
        TAXFLOW_TEST_BASE_URL: baseURL,
        TAXFLOW_TEST_API_URL: stack?.baseURL ?? '',
        TAXFLOW_TEST_OUTPUT_DIR: run.output,
      },
    },
  );
  result.child.stdout.pipe(process.stdout);
  result.child.stderr.pipe(process.stderr);
  await result.done;
  fs.writeFileSync(path.join(run.output, 'passed'), 'All selected browser tests passed.\n');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await run.close();
}
