import { spawnSync } from 'node:child_process';

const packageManager = process.env.npm_execpath;
if (!packageManager) {
  throw new Error('Run this command through the pinned pnpm package script.');
}

function run(args, extraEnvironment = {}) {
  const result = spawnSync(process.execPath, [packageManager, ...args], {
    env: { ...process.env, ...extraEnvironment },
    stdio: 'inherit',
  });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run(['run', 'recovery:verify']);
run(['run', 'verify']);
run(['--filter', '@workspace/api-server', 'run', 'build']);
run(['--filter', '@workspace/ai-workflow-builder', 'run', 'build'], {
  BASE_PATH: '/',
  NODE_ENV: 'production',
  PORT: '5188',
  SENTRY_AUTH_TOKEN: '',
  SENTRY_ORG: '',
  SENTRY_PROJECT: '',
  VITE_SENTRY_DSN: '',
});
run(['run', 'performance:check']);
run(['run', 'test:production-ui']);
run(['run', 'test:workflow-reliability']);
