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
const result = spawnSync(
  process.execPath,
  [
    path.join(root, 'node_modules/prettier/bin/prettier.cjs'),
    process.argv.includes('--write') ? '--write' : '--check',
    ...targets,
  ],
  { cwd: root, stdio: 'inherit' },
);
if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
