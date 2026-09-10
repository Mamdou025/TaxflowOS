import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { canReuseProductionBundle } from './prod-build-freshness.ts';

function fixture() {
  const root = mkdtempSync(path.join(tmpdir(), 'prod-build-freshness-'));
  const source = path.join(root, 'src');
  const sourceFile = path.join(source, 'main.ts');
  const index = path.join(root, 'dist', 'public', 'index.html');
  mkdirSync(source, { recursive: true });
  mkdirSync(path.dirname(index), { recursive: true });
  writeFileSync(sourceFile, 'source');
  writeFileSync(index, 'bundle');

  return {
    index,
    source,
    sourceFile,
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
}

test('reuses a bundle newer than every build input when enabled', () => {
  const files = fixture();
  try {
    utimesSync(files.sourceFile, new Date(1_000), new Date(1_000));
    utimesSync(files.source, new Date(1_000), new Date(1_000));
    utimesSync(files.index, new Date(2_000), new Date(2_000));
    assert.equal(canReuseProductionBundle(files.index, [files.source], '1'), true);
  } finally {
    files.cleanup();
  }
});

test('rejects a bundle when any build input is newer', () => {
  const files = fixture();
  try {
    utimesSync(files.index, new Date(1_000), new Date(1_000));
    utimesSync(files.sourceFile, new Date(2_000), new Date(2_000));
    assert.equal(canReuseProductionBundle(files.index, [files.source], '1'), false);
  } finally {
    files.cleanup();
  }
});

test('rejects a missing production bundle', () => {
  const files = fixture();
  try {
    rmSync(files.index);
    assert.equal(canReuseProductionBundle(files.index, [files.source], '1'), false);
  } finally {
    files.cleanup();
  }
});

test('rejects a current bundle unless reuse is enabled', () => {
  const files = fixture();
  try {
    utimesSync(files.sourceFile, new Date(1_000), new Date(1_000));
    utimesSync(files.source, new Date(1_000), new Date(1_000));
    utimesSync(files.index, new Date(2_000), new Date(2_000));
    assert.equal(canReuseProductionBundle(files.index, [files.source], undefined), false);
    assert.equal(canReuseProductionBundle(files.index, [files.source], '0'), false);
  } finally {
    files.cleanup();
  }
});

test('rejects a bundle after a nested build input is deleted', () => {
  const files = fixture();
  try {
    utimesSync(files.sourceFile, new Date(1_000), new Date(1_000));
    utimesSync(files.source, new Date(1_000), new Date(1_000));
    utimesSync(files.index, new Date(2_000), new Date(2_000));
    rmSync(files.sourceFile);
    assert.equal(canReuseProductionBundle(files.index, [files.source], '1'), false);
  } finally {
    files.cleanup();
  }
});

test('rejects a bundle when an expected build input is missing', () => {
  const files = fixture();
  try {
    const missingInput = path.join(path.dirname(files.source), 'missing-public');
    assert.equal(canReuseProductionBundle(files.index, [files.source, missingInput], '1'), false);
  } finally {
    files.cleanup();
  }
});