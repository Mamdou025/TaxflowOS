import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateWorkflowLibrary } from '../../lib/workflow-contracts/src/library';
import {
  filterWorkflowChoices,
  resolveWorkflowChoice,
  workflowChoices,
} from '../../artifacts/ai-workflow-builder/src/features/assistant/ui/workflow-choice-model';
import { workflowMessageIndex } from '../../artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/workflow-position';

const libraryFixture = () =>
  validateWorkflowLibrary(
    JSON.parse(readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8')),
  );
const template = (id: string) => id === 'fapi';

test('resume choices retain the exact run and reject an ended or mismatched session', () => {
  const library = libraryFixture();
  const id = 'custom:synthetic-recovery';
  const entry = library[id];
  const version = entry.versions[0].number;
  // A paused historical record: resolving a choice must not execute its graph.
  library[id] = {
    ...entry,
    sessions: [
      {
        id: 'selected-run',
        version,
        revision: 0,
        createdAt: '2026-10-09T12:00:00.000Z',
        paused: true,
        results: {},
        stale: [],
        reviewed: [],
        sources: [],
        attempts: [],
      },
    ],
  };
  const choice = {
    workflowId: id,
    name: entry.draft.name,
    target: { kind: 'resume' as const, version, runId: 'selected-run' },
  };
  assert.deepEqual(resolveWorkflowChoice(choice, library, template), {
    kind: 'resume',
    workflowId: id,
    version,
    runId: 'selected-run',
  });
  assert.ok(
    'error' in
      resolveWorkflowChoice(
        { ...choice, target: { ...choice.target, runId: 'missing' } },
        library,
        template,
      ),
  );
  library[id].sessions![0].endedAt = '2026-10-09T12:01:00.000Z';
  assert.ok('error' in resolveWorkflowChoice(choice, library, template));
});

test('workflow name search prefers exact matches without collapsing duplicate saved records', () => {
  const records = [
    { id: 'first', name: 'FAPI Calculation' },
    { id: 'near', name: 'FAPI Calculation - old draft' },
    { id: 'second', name: 'FAPI Calculation' },
    { id: 'other', name: 'Other workpaper', description: 'Contains FAPI inputs' },
  ];
  assert.deepEqual(filterWorkflowChoices(records, '  fapi calculation '), [records[0], records[2]]);
  assert.deepEqual(filterWorkflowChoices(records, 'FAPI'), records);
  assert.deepEqual(filterWorkflowChoices(records, 'missing'), []);
  assert.equal(filterWorkflowChoices(records), records);
});

test('template choices preserve catalog identity without inventing a saved version', () => {
  const result = [{ workflowId: 'fapi', name: 'FAPI Calculation', source: 'Trial balance' }];
  const before = structuredClone(result);
  const parsed = workflowChoices(JSON.stringify(result), 'available');
  assert.deepEqual(parsed.choices, [
    {
      workflowId: 'fapi',
      name: 'FAPI Calculation',
      description: 'Trial balance',
      target: { kind: 'template' },
    },
  ]);
  assert.deepEqual(resolveWorkflowChoice(parsed.choices[0], {}, template), {
    kind: 'session',
    workflowId: 'fapi',
  });
  assert.ok('error' in resolveWorkflowChoice(parsed.choices[0], {}, () => false));
  assert.deepEqual(result, before);
});

test('saved choices retain the listed immutable version even when a newer version exists', () => {
  const library = libraryFixture();
  const entry = library['custom:synthetic-recovery'];
  const saved = entry.versions[0];
  const parsed = workflowChoices(
    [
      {
        id: entry.id,
        name: 'Renamed draft',
        latestVersion: saved.number,
        latestVersionName: saved.definition.name,
        latestVersionSavedAt: saved.savedAt,
      },
    ],
    'saved',
  );
  entry.versions.push({ ...structuredClone(saved), number: saved.number + 1 });
  const before = structuredClone(library);
  assert.equal(parsed.choices[0].name, 'Renamed draft');
  assert.equal(parsed.choices[0].versionName, saved.definition.name);
  assert.equal(parsed.choices[0].date, saved.savedAt);
  assert.deepEqual(resolveWorkflowChoice(parsed.choices[0], library, template), {
    kind: 'session',
    workflowId: entry.id,
    version: saved.number,
  });
  assert.deepEqual(library, before);
  entry.versions = entry.versions.filter((version) => version.number !== saved.number);
  const unavailable = resolveWorkflowChoice(parsed.choices[0], library, template);
  assert.ok('error' in unavailable);
  assert.match(unavailable.error, /No other version was selected/);
});

test('renamed drafts remain searchable by both visible names without changing the selected version', () => {
  const rows = [
    { id: 'renamed', name: 'FAPI 2026', latestVersionName: 'FAPI 2025', latestVersion: 1 },
    { id: 'similar', name: 'FAPI 2026 archive', latestVersion: null },
  ];
  assert.deepEqual(filterWorkflowChoices(rows, 'FAPI 2026'), [rows[0]]);
  assert.deepEqual(filterWorkflowChoices(rows, 'FAPI 2025'), [rows[0]]);
  const choice = workflowChoices(filterWorkflowChoices(rows, 'FAPI 2025'), 'saved').choices[0];
  assert.equal(choice.name, 'FAPI 2026');
  assert.equal(choice.versionName, 'FAPI 2025');
  assert.deepEqual(choice.target, { kind: 'saved-version', version: 1 });
});

test('draft-only choices open the exact draft and never become a session or template fallback', () => {
  const library = libraryFixture();
  const entry = library['custom:synthetic-recovery'];
  entry.versions = [];
  const parsed = workflowChoices(
    [
      {
        id: entry.id,
        name: 'FAPI Calculation',
        latestVersion: null,
        updatedAt: '2026-10-09T12:00:00Z',
      },
    ],
    'saved',
  );
  const before = structuredClone(library);
  assert.deepEqual(parsed.choices[0].target, { kind: 'draft' });
  assert.deepEqual(resolveWorkflowChoice(parsed.choices[0], library, template), {
    kind: 'draft',
    workflowId: entry.id,
  });
  assert.deepEqual(library, before);
  assert.ok('error' in resolveWorkflowChoice(parsed.choices[0], {}, () => true));
});

test('duplicate titles keep separate exact identities and invalid results cannot become draft choices', () => {
  const parsed = workflowChoices(
    [
      { id: 'one', name: 'FAPI', latestVersion: 2 },
      { id: 'two', name: 'FAPI', latestVersion: 3 },
    ],
    'saved',
  );
  assert.deepEqual(
    parsed.choices.map((choice) => [choice.workflowId, choice.target]),
    [
      ['one', { kind: 'saved-version', version: 2 }],
      ['two', { kind: 'saved-version', version: 3 }],
    ],
  );
  for (const invalid of [
    '{broken',
    null,
    { error: 'Access denied' },
    [{ id: 'bad', name: 'FAPI', latestVersion: '2' }],
    [{ id: 'bad', name: 'FAPI' }],
  ]) {
    const result = workflowChoices(invalid, 'saved');
    assert.deepEqual(result.choices, []);
    assert.ok(result.error);
  }
  assert.deepEqual(workflowChoices('[]', 'saved'), { choices: [] });
});

test('a list selection anchor remains at its receipt across follow-up messages and JSON restore', () => {
  const messages = [
    { id: 'request', role: 'user', content: 'Find FAPI' },
    {
      id: 'choices',
      role: 'assistant',
      toolCalls: [{ id: 'list-call', function: { name: 'listSavedWorkflows', arguments: '{}' } }],
    },
    { id: 'listed', role: 'tool', toolCallId: 'list-call', content: '[]' },
  ];
  const binding = { workflowId: 'saved-exact', runId: 'session-exact', afterMessageId: 'listed' };
  assert.equal(workflowMessageIndex(messages, binding), 2);
  messages.push({ id: 'follow-up', role: 'user', content: 'Explain the steps' });
  assert.equal(
    workflowMessageIndex(JSON.parse(JSON.stringify(messages)), JSON.parse(JSON.stringify(binding))),
    2,
  );
});
