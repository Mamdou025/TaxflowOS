import assert from 'node:assert/strict';
import { test } from 'node:test';
import { extractWorkflowDocumentReferences } from '../../artifacts/api-server/src/lib/entity-references/extract';
import type {
  PersonalWorkflow,
  WorkflowLibrary,
  WorkflowSession,
} from '../../lib/workflow-contracts/src/library-types';
import type { DocumentExtraction } from '../../lib/workflow-contracts/src/domain/document-extraction';
import type { WorkflowDefinition } from '../../lib/workflow-contracts/src/domain/workflow-types';
import type { LocalToolRunnerResult } from '../../lib/workflow-contracts/src/execution-result';

// These fields are irrelevant to extractWorkflowDocumentReferences; cast rather than
// construct full, unrelated-schema fixtures that would make this test brittle against
// changes this function doesn't care about.
const draft = {} as WorkflowDefinition;
const result = {} as LocalToolRunnerResult;

function extraction(overrides: Partial<DocumentExtraction> = {}): DocumentExtraction {
  return {
    id: 'extraction-1',
    revision: 1,
    fileName: 't4.pdf',
    contentHash: 'hash-1',
    extractedAt: '2026-10-17T00:00:00.000Z',
    method: 'pdf_text',
    originalDocumentId: 'doc-1',
    segments: [],
    rows: [],
    issues: [],
    ...overrides,
  };
}

function session(sources: WorkflowSession['sources']): WorkflowSession {
  return {
    id: 'session-1',
    version: 1,
    revision: 1,
    createdAt: '2026-10-17T00:00:00.000Z',
    paused: false,
    results: {},
    stale: [],
    reviewed: [],
    sources,
    attempts: [],
  };
}

function library(entry: Partial<PersonalWorkflow>): WorkflowLibrary {
  return {
    'workflow-1': {
      id: 'workflow-1',
      templateId: 'template-1',
      draft,
      versions: [],
      runs: [],
      ...entry,
    },
  };
}

test('a run whose source has a document extraction produces a workflow-to-document edge', () => {
  const lib = library({
    runs: [
      {
        version: 1,
        at: '2026-10-17T12:00:00.000Z',
        result,
        sessionSnapshot: session([
          {
            id: 'source-1',
            blockId: 'block-1',
            name: 't4.pdf',
            at: '2026-10-17T11:00:00.000Z',
            mode: 'add',
            rows: [],
            extraction: extraction(),
          },
        ]),
      },
    ],
  });
  const edges = extractWorkflowDocumentReferences(lib);
  assert.equal(edges.length, 1);
  assert.deepEqual(edges[0], {
    fromType: 'workflow',
    fromId: 'workflow-1',
    toType: 'document',
    toId: 'doc-1',
    context: {
      via: 'extraction',
      runAt: '2026-10-17T12:00:00.000Z',
      sourceId: 'source-1',
      extractionId: 'extraction-1',
      revision: 1,
    },
  });
});

test('a source without extraction, or an extraction without originalDocumentId, produces no edge', () => {
  const noExtraction = library({
    runs: [
      {
        version: 1,
        at: '2026-10-17T12:00:00.000Z',
        result,
        sessionSnapshot: session([
          {
            id: 's1',
            blockId: 'b1',
            name: 'manual',
            at: '2026-10-17T11:00:00.000Z',
            mode: 'add',
            rows: [],
          },
        ]),
      },
    ],
  });
  assert.deepEqual(extractWorkflowDocumentReferences(noExtraction), []);

  const unresolvedDocument = library({
    runs: [
      {
        version: 1,
        at: '2026-10-17T12:00:00.000Z',
        result,
        sessionSnapshot: session([
          {
            id: 's1',
            blockId: 'b1',
            name: 'pasted.csv',
            at: '2026-10-17T11:00:00.000Z',
            mode: 'add',
            rows: [],
            extraction: extraction({ originalDocumentId: undefined }),
          },
        ]),
      },
    ],
  });
  assert.deepEqual(extractWorkflowDocumentReferences(unresolvedDocument), []);
});

test('a run with no session snapshot (e.g. a durable-queue run) produces no edge', () => {
  const lib = library({ runs: [{ version: 1, at: '2026-10-17T12:00:00.000Z', result }] });
  assert.deepEqual(extractWorkflowDocumentReferences(lib), []);
});

test('multiple workflows and multiple document-backed sources each produce their own edge', () => {
  const run = (documentId: string, sourceId: string) => ({
    version: 1,
    at: '2026-10-17T12:00:00.000Z',
    result,
    sessionSnapshot: session([
      {
        id: sourceId,
        blockId: 'block-1',
        name: `${documentId}.pdf`,
        at: '2026-10-17T11:00:00.000Z',
        mode: 'add' as const,
        rows: [],
        extraction: extraction({ id: `${sourceId}-extraction`, originalDocumentId: documentId }),
      },
    ]),
  });
  const lib: WorkflowLibrary = {
    ...library({ runs: [run('doc-1', 'source-1'), run('doc-2', 'source-2')] }),
    'workflow-2': {
      id: 'workflow-2',
      templateId: 'template-1',
      draft,
      versions: [],
      runs: [run('doc-3', 'source-3')],
    },
  };
  const edges = extractWorkflowDocumentReferences(lib);
  assert.deepEqual(edges.map((edge) => [edge.fromId, edge.toId]).sort(), [
    ['workflow-1', 'doc-1'],
    ['workflow-1', 'doc-2'],
    ['workflow-2', 'doc-3'],
  ]);
});
