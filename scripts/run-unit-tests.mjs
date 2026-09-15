import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const files = fs
  .readdirSync(path.join(root, 'tests/unit'))
  .filter((name) => name.endsWith('.test.ts'))
  .sort()
  .map((name) => path.join(root, 'tests/unit', name));
const result = spawnSync(
  process.execPath,
  [
    path.join(root, 'scripts/node_modules/tsx/dist/cli.mjs'),
    '--tsconfig',
    path.join(root, 'artifacts/ai-workflow-builder/tsconfig.json'),
    '--test',
    ...files,
  ],
  { cwd: root, stdio: 'inherit' },
);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
