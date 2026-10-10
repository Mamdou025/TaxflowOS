import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { deflateRawSync } from 'node:zlib';
import { decodeBackup } from '../../artifacts/api-server/src/storage/validate-backup';
import { validateWorkflowLibrary } from '../../lib/workflow-contracts/src/library';
import type { WorkflowLibrary } from '../../lib/workflow-contracts/src/library-types';
import { stringifySharedJSON } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/shared-json';

function fixture() {
  return JSON.parse(
    readFileSync('tests/fixtures/backups/document-calculation-v1.json', 'utf8'),
  ) as { format: string; library: WorkflowLibrary };
}
const graph = (nodes: unknown[], root: unknown = [0]) =>
  JSON.stringify({ format: 'taxflow-shared-json-v1', root, nodes });

test('server accepts legacy plain, wrapped, shared and compressed backups with the same validation', () => {
  const backup = fixture();
  const expected = validateWorkflowLibrary(backup);
  const text = JSON.stringify(backup);
  for (const payload of [
    text,
    JSON.stringify(backup.library),
    stringifySharedJSON(backup),
    `taxflow-deflate-v1:${deflateRawSync(text).toString('base64')}`,
  ])
    assert.deepEqual(decodeBackup(payload), expected);
  const invalid = fixture();
  Object.values(invalid.library)[0].draft.id = 'custom:wrong';
  assert.throws(() => decodeBackup(stringifySharedJSON(invalid)), /inconsistent workflow IDs/);
});

test('shared opaque evidence is decoded once and remains shared instead of exhausting traversal', () => {
  const backup = fixture();
  const entry = Object.values(backup.library)[0];
  const evidence = Array.from({ length: 1500 }, (_, row) => ({ row, amount: row - 750 }));
  entry.draft.blocks[0].config.repeatedEvidence = Array(300).fill(evidence);
  const decoded = Object.values(decodeBackup(stringifySharedJSON(backup)))[0];
  const repeated = decoded.draft.blocks[0].config.repeatedEvidence as (typeof evidence)[];
  assert.equal(repeated.length, 300);
  assert.equal(repeated[0], repeated[299]);
  assert.deepEqual(repeated[0][1499], { row: 1499, amount: 749 });
  assert.equal(decoded.draft.blocks.length, entry.draft.blocks.length);
});

test('shared graph rejects cycles, malformed references and more than 200000 encoded nodes', () => {
  assert.throws(() => decodeBackup(graph([['array', [[0]]]])), /Invalid backup reference/);
  assert.throws(
    () =>
      decodeBackup(
        graph([
          ['array', [[1]]],
          ['array', [[0]]],
        ]),
      ),
    /Invalid backup reference/,
  );
  for (const root of [[-1], [0, 1], [0.5], [1]])
    assert.throws(() => decodeBackup(graph([['object', []]], root)), /Invalid backup/);
  assert.throws(
    () => decodeBackup(graph(Array(200_001).fill(['string', 'shared']))),
    /Invalid shared backup/,
  );
});

test('cached subtree height cannot bypass the 128-level limit through a deeper reference', () => {
  const nodes: unknown[] = [['array', [0]]];
  for (let index = 1; index < 128; index++) nodes.push(['array', [[index - 1]]]);
  // First cache a 65-level subtree shallowly, then reference it through 63 more levels.
  nodes.push([
    'object',
    [
      ['shallow', [64]],
      ['deep', [127]],
    ],
  ]);
  assert.throws(() => decodeBackup(graph(nodes, [128])), /Backup graph exceeds its limits/);
});

test('opaque shared graphs cannot amplify later JSON serialization beyond 256 MiB', () => {
  const legitimate = fixture();
  const chunk = 'evidence'.repeat(2048);
  Object.values(legitimate.library)[0].draft.blocks[0].config.repeatedText =
    Array(2000).fill(chunk);
  const restored = Object.values(decodeBackup(stringifySharedJSON(legitimate)))[0].draft.blocks[0]
    .config.repeatedText as string[];
  assert.equal(restored.length, 2000);
  assert.equal(restored[1999], chunk); // 32 MB logical content, tiny shared representation.

  const backup = fixture();
  let amplified: unknown = 0;
  for (let depth = 0; depth < 100; depth++) amplified = [amplified, amplified];
  Object.values(backup.library)[0].draft.blocks[0].config.amplified = amplified;
  assert.throws(
    () => decodeBackup(stringifySharedJSON(backup)),
    /Backup logical expansion exceeds/,
  );

  // The ceiling measures UTF-8 bytes, including repeated multibyte text, not JS characters.
  const unicode = fixture();
  const text = '😀'.repeat(1_000_000);
  Object.values(unicode.library)[0].draft.blocks[0].config.repeatedText = Array(70).fill(text);
  assert.throws(
    () => decodeBackup(stringifySharedJSON(unicode)),
    /Backup logical expansion exceeds/,
  );
});

test('physical traversal and expanded-text limits are unchanged', () => {
  assert.throws(
    () => decodeBackup(graph([['array', Array(500_000).fill(0)]])),
    /Backup graph exceeds its limits/,
  );
  assert.throws(() => decodeBackup(' '.repeat(20_000_001)), /Expanded backup is too large/);
  const bomb = deflateRawSync(' '.repeat(20_000_001)).toString('base64');
  assert.throws(() => decodeBackup(`taxflow-deflate-v1:${bomb}`));
});

test('repeated typed definitions, workflow entries and run arrays cannot amplify Zod work', () => {
  const versions = fixture();
  const entry = Object.values(versions.library)[0];
  entry.versions = Array(2000).fill({ number: 1, savedAt: '2026-10-05', definition: entry.draft });
  assert.throws(() => decodeBackup(stringifySharedJSON(versions)), /Backup validation exceeds/);

  const workflows = fixture();
  const workflow = Object.values(workflows.library)[0];
  workflows.library = Object.fromEntries(
    Array.from({ length: 2000 }, (_, id) => [`custom:${id}`, workflow]),
  );
  assert.throws(() => decodeBackup(stringifySharedJSON(workflows)), /Backup validation exceeds/);

  const runs = fixture();
  Object.values(runs.library)[0].runs = Array(100_000).fill({});
  assert.throws(() => decodeBackup(stringifySharedJSON(runs)), /Backup validation exceeds/);
});

test('passthrough properties are charged each time their containing typed object is cloned', () => {
  const backup = fixture();
  const entry = Object.values(backup.library)[0];
  const extra = Object.fromEntries(
    Array.from({ length: 2000 }, (_, index) => [`extra${index}`, index]),
  );
  entry.runs = Array(300).fill(extra);
  assert.throws(() => decodeBackup(stringifySharedJSON(backup)), /Backup validation exceeds/);
});
