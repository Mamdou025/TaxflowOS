import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
const files = fs
  .readdirSync('tests/core')
  .filter((name) => name.endsWith('.test.ts'))
  .map((name) => path.join('tests/core', name));
const result = spawnSync(
  process.execPath,
  [
    'scripts/node_modules/tsx/dist/cli.mjs',
    '--tsconfig',
    'tests/core/tsconfig.json',
    '--test',
    ...files,
  ],
  { stdio: 'inherit' },
);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
