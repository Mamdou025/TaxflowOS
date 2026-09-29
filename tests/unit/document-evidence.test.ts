import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import { extractWorkflowDocument } from '../../artifacts/api-server/src/lib/workflow-document-extraction';
import { LOCAL_TOOL_REGISTRY } from '../../lib/workflow-executors/src/tools/registry';
import { createWorkflow, saveVersion } from '../../lib/workflow-core/src/application/commands';
import {
  changeSession,
  startSession,
  getSession,
  sessionDefinition,
} from '../../lib/workflow-core/src/application/sessions';
import { inspectDocumentEvidence } from '../../lib/workflow-core/src/application/document-inspection';
import { createWorkflowEdgeRecord } from '../../lib/workflow-core/src/core/edges';
import { validateWorkflowLibrary } from '../../lib/workflow-contracts/src/library';
import type { DocumentExtraction } from '../../lib/workflow-contracts/src/domain/document-extraction';
import type { WorkflowDefinition } from '../../lib/workflow-contracts/src/domain/workflow-types';
import type {
  ToolExecutionContext,
  ToolRunResult,
} from '../../lib/workflow-contracts/src/tool-types';
import { browserGraphRuntime } from '../../artifacts/ai-workflow-builder/src/shared/workflow-engine/workflow/execute';

const at = '2026-09-29T12:00:00.000Z';
const capture = (): DocumentExtraction => ({
  id: 'capture',
  revision: 1,
  fileName: 'synthetic.pdf',
  contentHash: `sha256:${'a'.repeat(64)}`,
  extractedAt: at,
  method: 'pdf_text',
  rows: [],
  segments: [
    {
      id: 'page-1',
      location: 'Page 1',
      page: 1,
      text: 'Synthetic Company. Fiscal 2025. Revenue CAD 120.',
    },
  ],
  issues: [{ code: 'TEXT_ONLY', message: 'Review the original; no table structure inferred.' }],
});
function definition(): WorkflowDefinition {
  const entry = Object.values(
    JSON.parse(readFileSync('tests/fixtures/backups/document-calculation-v1.json', 'utf8'))
      .library ?? {},
  )[0] as { draft: WorkflowDefinition } | undefined;
  const fallback = JSON.parse(readFileSync('tests/fixtures/backups/legacy-v0.json', 'utf8'))[
    'custom:synthetic-recovery'
  ].draft as WorkflowDefinition;
  const base = entry?.draft ?? fallback;
  const source = {
    ...base.blocks[0],
    id: 'document',
    family: 'Source' as const,
    subtype: 'PDF / Document' as const,
    label: 'Document',
    config: { toolId: 'source.pdf_document', sourceKind: 'pdf_document' },
  };
  const parser = {
    ...base.blocks[0],
    id: 'parser',
    family: 'Logic' as const,
    subtype: 'PDF Text Parser' as const,
    label: 'Read document',
    config: { toolId: 'logic.pdf_text_parser' },
  };
  return {
    ...base,
    id: 'custom:documents',
    blocks: [source, parser],
    edges: [
      createWorkflowEdgeRecord({
        sourceBlockId: source.id,
        targetBlockId: parser.id,
        createdAt: at,
        reason: 'Read captured evidence',
      }),
    ],
  };
}
function context(
  toolId: string,
  upstreamResults: ToolRunResult[] = [],
  config: Record<string, unknown> = {},
): ToolExecutionContext {
  const workflow = definition();
  return {
    workflow,
    block: workflow.blocks[1],
    config: { ...config, toolId },
    runId: 'run',
    startedAt: at,
    upstreamResults,
    upstreamBlocks: upstreamResults.map(() => workflow.blocks[0]),
    upstreamOutputs: {},
    allResults: {},
    evidenceRefs: [],
    sourceTrace: [],
  };
}
function source(document = capture()) {
  return LOCAL_TOOL_REGISTRY['source.pdf_document'].execute(
    context('source.pdf_document', [], { documentExtractions: [document] }),
  );
}

test('all five parser tools fail without evidence instead of inventing sample rows', () => {
  for (const toolId of [
    'logic.pdf_text_parser',
    'logic.pdf_table_parser',
    'logic.ocr_extract',
    'logic.excel_table_reader',
    'logic.api_response_parser',
  ]) {
    const result = LOCAL_TOOL_REGISTRY[toolId].execute(context(toolId));
    assert.equal(result.status, 'error', toolId);
    assert.equal(result.output.rows, undefined);
    assert.ok(result.errors.length);
  }
});
test('text parser preserves exact captured text and lineage while table/OCR readers reject it', () => {
  const upstream = source();
  const result = LOCAL_TOOL_REGISTRY['logic.pdf_text_parser'].execute(
    context('logic.pdf_text_parser', [upstream]),
  );
  assert.equal(result.output.text, capture().segments[0].text);
  assert.deepEqual(result.output.rows, []);
  assert.deepEqual(result.evidenceRefs, upstream.evidenceRefs);
  assert.equal(result.status, 'warning');
  for (const toolId of ['logic.pdf_table_parser', 'logic.ocr_extract', 'logic.excel_table_reader'])
    assert.equal(LOCAL_TOOL_REGISTRY[toolId].execute(context(toolId, [upstream])).status, 'error');
});
test('legacy structured source records remain readable and unrelated source records are rejected', () => {
  const upstream = {
    ...source(),
    toolId: 'source.http_json',
    output: { rows: [{ label: 'Credit', amount: -20 }] },
  };
  assert.deepEqual(
    LOCAL_TOOL_REGISTRY['logic.api_response_parser'].execute(
      context('logic.api_response_parser', [upstream]),
    ).output.rows,
    upstream.output.rows,
  );
  assert.equal(
    LOCAL_TOOL_REGISTRY['logic.excel_table_reader'].execute(
      context('logic.excel_table_reader', [upstream]),
    ).status,
    'error',
  );
});
test('document inspection pages long text and refuses another document or segment', () => {
  const document = capture();
  document.segments[0].text = 'A'.repeat(8000) + 'final 120';
  const result = source(document);
  const first = inspectDocumentEvidence(result, { extractionId: document.id, segmentId: 'page-1' });
  assert.equal(first.nextOffset, 8000);
  const next = inspectDocumentEvidence(result, {
    extractionId: document.id,
    segmentId: 'page-1',
    evidenceOffset: 8000,
  });
  assert.ok('text' in next && 'citationId' in next);
  assert.equal(next.text, 'final 120');
  assert.equal(next.citationId, 'capture:r1:page-1');
  assert.ok(inspectDocumentEvidence(result, { extractionId: 'other' }).error);
  assert.ok(
    inspectDocumentEvidence(result, { extractionId: document.id, segmentId: 'page-2' }).error,
  );
});

test('a malformed or empty connected source cannot disappear behind valid evidence', () => {
  const good = source();
  for (const extractions of [[], 'invalid']) {
    const bad = { ...good, output: { extractions } };
    assert.equal(
      LOCAL_TOOL_REGISTRY['logic.pdf_text_parser'].execute(
        context('logic.pdf_text_parser', [good, bad]),
      ).status,
      'error',
    );
  }
  const invalid = capture();
  invalid.segments.push({ ...invalid.segments[0] });
  assert.equal(source(invalid).status, 'error');
});
test('session source replacement retains extraction history, invalidates results and roundtrips', () => {
  let entry = startSession(
    saveVersion(createWorkflow('custom:documents', 'custom', definition())),
    1,
    'session',
    at,
  );
  const change = (action: Parameters<typeof changeSession>[3]) => {
    entry = changeSession(
      entry,
      'session',
      getSession(entry, 'session').revision,
      action,
      browserGraphRuntime,
      at,
    );
  };
  change({
    kind: 'source',
    blockId: 'document',
    sourceId: 'first',
    name: 'synthetic.pdf',
    mode: 'replace',
    rows: [],
    extraction: capture(),
  });
  change({ kind: 'block', blockId: 'document' });
  change({ kind: 'block', blockId: 'parser' });
  const original = getSession(entry, 'session');
  assert.equal(original.results.parser.output.text, capture().segments[0].text);
  const replacement = capture();
  replacement.segments[0].text = 'Corrected revenue CAD 50.';
  change({
    kind: 'source',
    blockId: 'document',
    sourceId: 'second',
    name: 'synthetic.pdf',
    mode: 'replace',
    rows: [],
    extraction: replacement,
  });
  const updated = getSession(entry, 'session');
  assert.deepEqual(updated.stale.sort(), ['document', 'parser']);
  assert.equal(updated.sources[1].extraction?.revision, 2);
  assert.deepEqual(updated.attempts, original.attempts);
  assert.equal(updated.sources[0].extraction?.segments[0].text, capture().segments[0].text);
  assert.equal(
    (
      sessionDefinition(entry, updated).blocks[0].config.documentExtractions as DocumentExtraction[]
    )[0].segments[0].text,
    'Corrected revenue CAD 50.',
  );
  const restored = validateWorkflowLibrary(JSON.parse(JSON.stringify({ [entry.id]: entry })));
  assert.equal(restored[entry.id].sessions?.[0].sources[1].extraction?.revision, 2);
});
test('real native PDF and Word extraction retain text locations and never invent numeric rows', async () => {
  for (const name of ['sales-check.pdf', 'sales-check.docx']) {
    const extracted = await extractWorkflowDocument(
      new Uint8Array(readFileSync(`e2e/fixtures/demo/${name}`)),
      name,
    );
    assert.ok(extracted.segments.some((segment) => segment.text.trim()));
    assert.match(
      extracted.segments[0].location,
      name.endsWith('.pdf') ? /^Page 1$/ : /^Extracted paragraph 1$/,
    );
    assert.deepEqual(extracted.rows, []);
    assert.match(extracted.contentHash, /^sha256:[a-f0-9]{64}$/);
  }
  const empty = await extractWorkflowDocument(
    new Uint8Array(readFileSync('e2e/fixtures/demo/no-text.pdf')),
    'empty.pdf',
  );
  assert.equal(
    empty.segments.some((segment) => segment.text.trim()),
    false,
  );
  await assert.rejects(() => extractWorkflowDocument(new Uint8Array([1, 2]), 'broken.pdf'));
});
