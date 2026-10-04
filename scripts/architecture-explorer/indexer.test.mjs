import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { buildIndex, createResolver, hash, inspectSource, isIndexable } from './indexer.mjs';

function fixture(t, entries) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'taxflow-explorer-'));
  for (const [file, value] of Object.entries(entries)) {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(
      path.join(root, file),
      typeof value === 'string' ? value : JSON.stringify(value),
    );
  }
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, paths: Object.keys(entries).sort() };
}

test('resolves inherited aliases, .js TypeScript substitutions and workspace export boundaries', (t) => {
  const { root, paths } = fixture(t, {
    'tsconfig.base.json': {
      compilerOptions: {
        moduleResolution: 'bundler',
        module: 'esnext',
        baseUrl: '.',
        paths: { '@/*': ['web/src/*'] },
        customConditions: ['workspace'],
      },
    },
    'web/tsconfig.json': { extends: '../tsconfig.base.json', include: ['src'] },
    'web/src/main.ts': '',
    'web/src/util.ts': '',
    'web/src/panel/index.tsx': '',
    'lib/core/package.json': {
      name: '@workspace/core',
      exports: {
        '.': { workspace: './src/index.ts', default: './dist/index.js' },
        './commands': './src/commands.ts',
        './parts/*': './src/parts/*.ts',
      },
    },
    'lib/core/src/index.ts': '',
    'lib/core/src/commands.ts': '',
    'lib/core/src/parts/one.ts': '',
    'lib/core/src/private.ts': '',
  });
  const resolver = createResolver(root, paths);
  assert.equal(resolver.resolve('web/src/main.ts', '@/util'), 'web/src/util.ts');
  assert.equal(resolver.resolve('web/src/main.ts', './util.js'), 'web/src/util.ts');
  assert.equal(resolver.resolve('web/src/main.ts', './panel'), 'web/src/panel/index.tsx');
  assert.equal(resolver.resolve('web/src/main.ts', '@workspace/core'), 'lib/core/src/index.ts');
  assert.equal(
    resolver.resolve('web/src/main.ts', '@workspace/core/commands'),
    'lib/core/src/commands.ts',
  );
  assert.equal(
    resolver.resolve('web/src/main.ts', '@workspace/core/parts/one'),
    'lib/core/src/parts/one.ts',
  );
  assert.equal(resolver.resolve('web/src/main.ts', '@workspace/core/src/private'), null);
  assert.equal(resolver.resolve('web/src/main.ts', './missing'), null);
  assert.equal(resolver.resolve('web/src/main.ts', 'react'), null);
});

test('parses real module syntax without treating comments or runtime expressions as imports', () => {
  const parsed = inspectSource(
    'demo.ts',
    `
    // import wrong from 'comment';
    const text = "require('not-an-import')";
    import type { Input } from './types';
    import { type OnlyType } from './only-types';
    import Default, { type Mixed } from './mixed';
    export type { Output } from './output';
    export { renamed as outward } from './exports';
    export * from './barrel';
    export * as collection from './collection';
    type Lazy = import('./lazy-type').Thing;
    const lazy = import('./lazy');
    const unknown = import(name);
    const required = require('./required');
    import common = require('./common');
    export const { left, right: renamed } = { left: 1, right: 2 };
    export namespace Types { export interface Nested {} }
    export default function main() {}
  `,
  );
  assert.deepEqual(
    parsed.imports.map(({ specifier }) => specifier),
    [
      './types',
      './only-types',
      './mixed',
      './output',
      './exports',
      './barrel',
      './collection',
      './lazy-type',
      './lazy',
      './required',
      './common',
    ],
  );
  assert.deepEqual(
    parsed.imports.filter(({ typeOnly }) => typeOnly).map(({ specifier }) => specifier),
    ['./types', './only-types', './output', './lazy-type'],
  );
  assert.deepEqual(
    parsed.imports.filter(({ dynamic }) => dynamic).map(({ specifier }) => specifier),
    ['./lazy'],
  );
  assert.deepEqual(parsed.exports, [
    '* (re-export)',
    'Output',
    'Types',
    'collection',
    'default',
    'left',
    'outward',
    'renamed',
  ]);
});

test('keeps syntax observations separate from reviewed behavior and detects stale explanations', (t) => {
  const implementation = 'export function save() { return fetch("/api/items"); }\n';
  const { root, paths } = fixture(t, {
    'lib/save.ts': implementation,
    'lib/other.ts': 'export const other = 1;\n',
    'tests/save.test.ts': "import { save } from '../lib/save.js';\n",
    'package.json': { name: 'fixture', dependencies: { react: '19.1.0' } },
  });
  const content = {
    modules: [
      { id: 'lib', prefixes: ['lib/'] },
      { id: 'specific', prefixes: ['lib/save.ts'] },
    ],
    notes: [
      {
        path: 'lib/save.ts',
        summary: 'Requests an item save.',
        reviewedRevision: 'cited-revision',
        reviewedHash: hash(implementation),
        reviewedAt: '2026-10-01',
        writes: ['The fetch call requests an API operation.'],
        sources: [{ path: 'lib/save.ts', line: 1 }],
        tests: ['tests/save.test.ts'],
      },
    ],
  };
  const state = { revision: 'current-revision', dirty: false, dirtyPaths: [] };
  const first = buildIndex({ root, paths, content, state, generatedAt: 'fixed-time' });
  const file = first.files.find((entry) => entry.path === 'lib/save.ts');
  assert.equal(file.moduleId, 'specific');
  assert.equal(file.reviewStatus, 'current');
  assert.equal(file.reviewedRevision, 'cited-revision');
  assert.equal(file.reviewedAt, '2026-10-01');
  assert.deepEqual(file.importedBy, ['tests/save.test.ts']);
  assert.equal(file.tests.length, 1);
  assert.equal(file.effects[0].kind, 'syntax');
  const other = first.files.find((entry) => entry.path === 'lib/other.ts');
  assert.equal(other.summaryKind, 'structural');
  assert.equal(other.reviewedAt, null);
  assert.deepEqual(other.writes, []);
  assert.match(other.summary, /not been individually reviewed/);
  fs.writeFileSync(
    path.join(root, 'lib/save.ts'),
    implementation.replace('/api/items', '/api/other'),
  );
  const second = buildIndex({ root, paths, content, state, generatedAt: 'fixed-time' });
  assert.equal(
    second.files.find((entry) => entry.path === 'lib/save.ts').reviewStatus,
    'needs-review',
  );
  assert.notEqual(first.meta.inputHash, second.meta.inputHash);
  assert.equal(
    JSON.stringify(first).includes('/api/items'),
    false,
    'Full source bodies and URL literals are not exported',
  );
});

test('excludes secrets and generated output while retaining build tooling and database migrations', () => {
  for (const file of [
    '.env',
    '.env.local',
    'lib/.env.example',
    'archive/a.ts',
    'web/.next/a.js',
    'node_modules/x/index.ts',
    '.archify/explorer-data.js',
    'web/dist/a.js',
    'attached_assets/private.json',
  ])
    assert.equal(isIndexable(file), false, file);
  for (const file of [
    'lib/db/migrations/0001.sql',
    'web/build/runtime-overlay.ts',
    'scripts/check.mjs',
    'tests/core/test.ts',
    'package.json',
    'tsconfig.base.json',
    'docker-compose.yml',
    'scripts/mkoro/capture-windows.ps1',
    'scripts/post-merge.sh',
  ])
    assert.equal(isIndexable(file), true, file);
});

test('rejects broken curated evidence instead of publishing unsupported links', (t) => {
  const { root, paths } = fixture(t, { 'main.ts': 'export const main = 1;\n' });
  assert.throws(
    () =>
      buildIndex({
        root,
        paths,
        state: { revision: 'test' },
        content: { notes: [{ path: 'main.ts', sources: [{ path: 'main.ts', line: 300 }] }] },
      }),
    /Invalid evidence range/,
  );
});

test('validates diagram and journey links, allowing existing documentation references', (t) => {
  const { root, paths } = fixture(t, {
    'main.ts': 'export const main = 1;\n',
    'README.md': '# Guide\n',
  });
  const indexedPaths = paths.filter((file) => isIndexable(file));
  const content = {
    modules: [{ id: 'main', prefixes: ['main.ts'] }],
    views: [
      {
        id: 'system',
        nodes: [{ id: 'app', moduleIds: ['main'], filePaths: ['main.ts', 'README.md'] }],
        edges: [],
      },
    ],
    journeys: [{ id: 'run', steps: [{ moduleIds: ['main'], filePaths: ['main.ts'] }] }],
  };
  const build = (candidate) =>
    buildIndex({ root, paths: indexedPaths, state: { revision: 'test' }, content: candidate });
  assert.doesNotThrow(() => build(content));
  const badModule = structuredClone(content);
  badModule.views[0].nodes[0].moduleIds = ['missing'];
  assert.throws(() => build(badModule), /Unknown module/);
  const badEdge = structuredClone(content);
  badEdge.views[0].edges = [{ from: 'app', to: 'missing' }];
  assert.throws(() => build(badEdge), /Unknown edge endpoint/);
  const badJourney = structuredClone(content);
  badJourney.journeys[0].steps[0].filePaths = ['missing.md'];
  assert.throws(() => build(badJourney), /Missing or out-of-scope file reference/);
});
