import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  CHAT_TEXT_LIMIT,
  assertSourceRevision,
  emptyChatContext,
  hasChatContext,
  parseChatContext,
  readChatContext,
  withChatContext,
  type ChatContext,
} from '../../artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/chat-context-model';
import { projectChatContext } from '../../artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/chat-context-projection';
import { reconstructMessages } from '../../artifacts/ai-workflow-builder/src/features/assistant/runtime/chat/message-codec';
import { detectExcelColumnMapping } from '../../lib/source-connectors/src/workbook-values';

const source = {
  id: 'chosen-revision',
  sourceId: 'chosen-revision',
  fileName: 'affiliates.xlsx',
  kind: 'workbook' as const,
  sourceRevision: 4,
  contentHash: 'extracted-text-hash',
  fileHash: 'original-file-hash',
  workbookSelection: {
    sheetName: 'Affiliates',
    headerRowNumber: 2,
    mapping: { amount: 'Income', label: 'Affiliate' },
  },
};
const context: ChatContext = {
  ...emptyChatContext(),
  companyName: 'Example Company',
  year: 2025,
  sources: [source],
  workflowSourceId: source.id,
  workflowInteraction: {
    id: 'selection',
    kind: 'saved-version',
    status: 'opened',
    name: 'FAPI',
    requestedWorkflowId: 'saved-fapi',
    workflowId: 'saved-fapi',
    version: 2,
    runId: 'exact-run',
    message: 'Opened FAPI version 2.',
    occurredAt: '2026-10-09T12:00:00.000Z',
  },
};

test('context metadata preserves exact references and selection receipt without becoming model transcript text', () => {
  const original = structuredClone(context);
  const messages = [
    { id: 'question', role: 'user' as const, seq: 0, content: { text: 'Calculate this.' } },
  ];
  const saved = withChatContext(messages, 'thread', context);
  assert.equal(saved[0].id, 'thread:chat-context');
  assert.deepEqual(readChatContext(JSON.parse(JSON.stringify(saved))), context);
  assert.deepEqual(reconstructMessages(saved), [
    { id: 'question', role: 'user', content: 'Calculate this.' },
  ]);
  assert.deepEqual(context, original);
  assert.equal(messages[0].seq, 0);
  assert.notEqual(readChatContext(saved).sources[0], context.sources[0]);
});

test('legacy chats and new chats start with empty labels and no implicit documents', () => {
  assert.deepEqual(
    readChatContext([{ content: { text: 'An older conversation' } }]),
    emptyChatContext(),
  );
  assert.equal(hasChatContext(emptyChatContext()), false);
  assert.equal(hasChatContext({ ...emptyChatContext(), companyName: 'Only a label' }), true);
  assert.deepEqual(
    projectChatContext(emptyChatContext(), {
      ambient: { status: 'ready', text: { kind: 'text', text: 'Not selected', truncated: false } },
    }).sources,
    [],
  );
});

test('chat context accepts every workbook detector field and preserves account-type mapping on reload', () => {
  for (const headers of [
    ['G/L Account', 'Jrnl.Entry Item Text', 'Amount in CC Crcy'],
    ['Account', 'Account Type', 'Label', 'Description', 'Amount', 'Currency', 'Debit', 'Credit'],
  ]) {
    const mapping = detectExcelColumnMapping(headers);
    assert.ok(Object.hasOwn(mapping, 'accountType'));
    const selected = {
      ...context,
      sources: [{ ...source, workbookSelection: { ...source.workbookSelection, mapping } }],
    };
    assert.deepEqual(parseChatContext(selected).sources[0].workbookSelection?.mapping, mapping);
    const restored = readChatContext(
      JSON.parse(JSON.stringify(withChatContext([], 'thread', selected))),
    );
    assert.deepEqual(
      restored.sources[0].workbookSelection?.mapping,
      JSON.parse(JSON.stringify(mapping)),
    );
    if (headers.includes('Account Type'))
      assert.equal(restored.sources[0].workbookSelection?.mapping?.accountType, 'Account Type');
  }
  for (const mapping of [{ accountType: 42 }, { accountType: null }, { unknownColumn: 'Amount' }])
    assert.throws(
      () =>
        parseChatContext({
          ...context,
          sources: [{ ...source, workbookSelection: { ...source.workbookSelection, mapping } }],
        }),
      /saved workbook selection is invalid/,
    );
});

test('invalid source identity and malformed kinds fail explicitly instead of coercing or replacing data', () => {
  for (const bad of [
    { ...context, year: 2025.5 },
    { ...context, sources: [{ ...source, sourceRevision: 0 }] },
    { ...context, sources: [{ ...source, kind: ['workbook'] }] },
    { ...context, sources: [{ ...source, kind: { toString: () => 'workbook' } }] },
    { ...context, sources: [source, source] },
    { ...context, workflowSourceId: 'different-source' },
    { ...context, workflowInteraction: { ...context.workflowInteraction, runId: undefined } },
    {
      ...emptyChatContext(),
      sources: [
        {
          id: 'local',
          fileName: 'notes.txt',
          kind: 'document',
          localText: { kind: ['text'], text: 'Notes', truncated: false },
        },
      ],
    },
  ])
    assert.throws(() => parseChatContext(bad));
});

test('saved source restoration requires its exact active identity, revision and extracted-content hash', () => {
  const document = {
    id: source.id,
    sourceRevision: 4,
    contentHash: 'extracted-text-hash',
    lifecycleStatus: 'active',
  };
  assert.doesNotThrow(() => assertSourceRevision(source, document));
  for (const changed of [
    { ...document, id: 'another-source' },
    { ...document, sourceRevision: 5 },
    { ...document, contentHash: 'original-file-hash' },
    { ...document, lifecycleStatus: 'archived' },
  ])
    assert.throws(() => assertSourceRevision(source, changed), /saved revision was not replaced/);
});

test('local text snapshots are bounded and cannot masquerade as stored source content', () => {
  const local = {
    id: 'local',
    fileName: 'notes.txt',
    kind: 'document' as const,
    localText: { kind: 'text' as const, text: 'Explicit notes', truncated: false },
  };
  const saved = parseChatContext({ ...emptyChatContext(), sources: [local] });
  assert.equal(saved.sources[0].localText?.text, 'Explicit notes');
  assert.throws(() =>
    parseChatContext({
      ...emptyChatContext(),
      sources: [{ ...local, sourceId: 'saved', sourceRevision: 1 }],
    }),
  );
  assert.throws(() =>
    parseChatContext({
      ...emptyChatContext(),
      sources: [
        { ...local, localText: { ...local.localText, text: 'x'.repeat(CHAT_TEXT_LIMIT + 1) } },
      ],
    }),
  );
  assert.throws(() =>
    parseChatContext({
      ...emptyChatContext(),
      sources: [
        local,
        {
          ...local,
          id: 'second',
          localText: { ...local.localText, text: 'x'.repeat(CHAT_TEXT_LIMIT) },
        },
      ],
    }),
  );
});

test('shared provider projection separates selected metadata from loaded text and enforces total context budget', () => {
  const selected = {
    ...context,
    sources: [
      source,
      { id: 'pending', fileName: 'pending.txt', kind: 'document' as const },
      { id: 'missing', fileName: 'missing.txt', kind: 'document' as const },
      { id: 'more', fileName: 'more.txt', kind: 'document' as const },
    ],
  };
  const projected = projectChatContext(selected, {
    [source.id]: {
      status: 'ready',
      text: { kind: 'excel', text: 'a'.repeat(CHAT_TEXT_LIMIT - 2), truncated: false },
    },
    pending: {
      status: 'loading',
      text: { kind: 'text', text: 'Old data must not leak', truncated: false },
    },
    missing: {
      status: 'unavailable',
      error: 'Revision changed',
      text: { kind: 'text', text: 'Stale content', truncated: false },
    },
    more: { status: 'ready', text: { kind: 'text', text: 'tail', truncated: false } },
    ambient: { status: 'ready', text: { kind: 'text', text: 'Workspace data', truncated: false } },
  });
  assert.deepEqual(projected.company, { name: 'Example Company', year: 2025, labelsOnly: true });
  assert.equal(projected.sources.length, 4);
  assert.equal(projected.sources[0].revision, 4);
  assert.equal(projected.sources[1].text, undefined);
  assert.equal(projected.sources[2].text, undefined);
  assert.equal(projected.sources[2].error, 'Revision changed');
  assert.equal(projected.sources[3].text, 'ta');
  assert.equal(projected.sources[3].truncated, true);
  assert.deepEqual(projected.workflowInteraction, context.workflowInteraction);
});
