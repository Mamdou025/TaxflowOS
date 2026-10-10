import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { maintainedPaths } from './maintained-paths.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const targets = [
  ...maintainedPaths.flatMap((directory) =>
    fs.statSync(path.join(root, directory)).isFile()
      ? [directory]
      : fs
          .readdirSync(path.join(root, directory), { recursive: true })
          .map((name) => `${directory}/${name}`.replaceAll('\\', '/'))
          .filter((name) => /\.(ts|tsx|mjs)$/.test(name) && !name.endsWith('generated-schemas.ts')),
  ),
  'scripts/check-architecture.mjs',
  'scripts/check-toolchain.mjs',
  'scripts/check-package-manager.mjs',
  'scripts/generate-workflow-schemas.mjs',
  'scripts/run-unit-tests.mjs',
  'scripts/run-browser-tests.mjs',
  'scripts/format-maintained.mjs',
  'scripts/maintained-paths.mjs',
];
// Windows caps the complete command line. Keep every target, but bound each invocation.
const batches = [];
let batch = [];
let length = 0;
for (const target of targets) {
  if (batch.length && length + target.length + 3 > 12000) {
    batches.push(batch);
    batch = [];
    length = 0;
  }
  batch.push(target);
  length += target.length + 3;
}
if (batch.length) batches.push(batch);
process.exitCode = 0;
for (const files of batches) {
  const result = spawnSync(
    process.execPath,
    [
      path.join(root, 'node_modules/prettier/bin/prettier.cjs'),
      process.argv.includes('--write') ? '--write' : '--check',
      ...files,
    ],
    { cwd: root, stdio: 'inherit' },
  );
  if (result.error) throw result.error;
  if (result.status !== 0) process.exitCode = result.status ?? 1;
}
