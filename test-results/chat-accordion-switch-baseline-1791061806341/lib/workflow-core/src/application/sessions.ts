import type {
  PersonalWorkflow,
  WorkflowSession,
} from '@workspace/workflow-contracts/library-types';
import type { WorkflowDefinition } from '@workspace/workflow-contracts/domain/workflow-types';
import type { GraphRuntime } from '../core/ports';
import { executeGraph } from '../core/graph';
import { getSavedVersion, recordWorkflowExecution, WorkflowCommandError } from './commands';
import type { DocumentExtraction } from '@workspace/workflow-contracts/domain/document-extraction';
import { DocumentExtractionSchema } from '@workspace/workflow-contracts/generated-schemas';
import { makeDocumentReview, documentReviewSummaries } from './document-review';
import type { DocumentReviewDraft } from '@workspace/workflow-contracts/domain/document-review';
import { runInputKeys, validateRunInputPatch, hasRunExchangeRate } from './session-inputs';
export { runInputKeys, validateRunInputPatch } from './session-inputs';

export function isDocumentSource(block: WorkflowDefinition['blocks'][number]) {
  return (
    block.family === 'Source' &&
    (/excel|workbook|uploaded|manual_table|pdf_document/.test(String(block.config.sourceKind)) ||
      ['source.manual_table', 'source.pdf_document'].includes(String(block.config.toolId)))
  );
}

function inputRequired(block: WorkflowDefinition['blocks'][number]) {
  const config = block.config;
  if (isDocumentSource(block))
    return !(
      ['rows', 'manualRows', 'tableRows'].some(
        (key) => Array.isArray(config[key]) && config[key].length > 0,
      ) ||
      (Array.isArray(config.documentExtractions) && config.documentExtractions.length > 0)
    );
  if (config.sourceKind === 'currency_rate') return !hasRunExchangeRate(config);
  // Specialized sources can share the Manual Entry catalog subtype without being scalars.
  if (config.sourceKind === 'fapi_inputs') return false;
  if (config.sourceKind === 'api_reference') {
    const locator = config.sourceLocator || block.source?.locator;
    return typeof locator !== 'string' || !locator.trim();
  }
  if (
    config.toolId === 'source.manual_value' ||
    config.sourceKind === 'manual_value' ||
    block.subtype === 'Manual Entry'
  )
    return !['value', 'manualValue', 'scalarValue', 'valuePreview'].some(
      (key) => typeof config[key] === 'number' && Number.isFinite(config[key]),
    );
  return false;
}

function fail(message: string): never {
  throw new WorkflowCommandError('INVALID_REQUEST', message);
}
export function getSession(entry: PersonalWorkflow, id: string): WorkflowSession {
  const session = entry.sessions?.find((item) => item.id === id);
  if (!session)
    throw new WorkflowCommandError('NOT_FOUND', 'The requested workflow run is unavailable.');
  return structuredClone(session);
}
function put(entry: PersonalWorkflow, session: WorkflowSession): PersonalWorkflow {
  return {
    ...entry,
    sessions: (entry.sessions ?? []).map((item) => (item.id === session.id ? session : item)),
  };
}
export function startSession(
  entry: PersonalWorkflow,
  version: number,
  id: string,
  at: string,
): PersonalWorkflow {
  orderedBlocks(getSavedVersion(entry, version).definition);
  if (!id || entry.sessions?.some((item) => item.id === id))
    fail('A new run requires a unique ID.');
  return {
    ...entry,
    sessions: [
      ...(entry.sessions ?? []),
      {
        id,
        version,
        revision: 0,
        createdAt: at,
        paused: true,
        results: {},
        stale: [],
        reviewed: [],
        sources: [],
        attempts: [],
      },
    ],
  };
}
function orderedBlocks(definition: WorkflowDefinition) {
  const ids = new Set(definition.blocks.map((block) => block.id));
  const edges = definition.edges.filter((edge) => edge.status === 'active');
  if (edges.some((edge) => !ids.has(edge.sourceBlockId) || !ids.has(edge.targetBlockId)))
    fail('The workflow has a missing dependency. Fix its connections in Build.');
  const ordered: WorkflowDefinition['blocks'] = [];
  const visited = new Set<string>();
  const remaining = [...definition.blocks];
  while (remaining.length) {
    const index = remaining.findIndex((block) =>
      edges
        .filter((edge) => edge.targetBlockId === block.id)
        .every((edge) => visited.has(edge.sourceBlockId)),
    );
    if (index < 0) fail('The workflow has a dependency cycle. Fix its connections in Build.');
    const [block] = remaining.splice(index, 1);
    ordered.push(block);
    visited.add(block.id);
  }
  return ordered;
}
export function sessionDefinition(
  entry: PersonalWorkflow,
  session: WorkflowSession,
): WorkflowDefinition {
  const definition = getSavedVersion(entry, session.version).definition;
  for (const block of definition.blocks) {
    block.config = {
      ...block.config,
      ...(session.inputOverrides?.[block.id]
        ? validateRunInputPatch(block, session.inputOverrides[block.id])
        : {}),
    };
    if (isDocumentSource(block) && Array.isArray(session.inputOverrides?.[block.id]?.rows)) {
      block.config = {
        ...block.config,
        requireUpload: false,
        sourceKind: 'manual_table',
        toolId: 'source.manual_table',
        manualRows: block.config.rows,
        tableRows: block.config.rows,
      };
      continue;
    }
    const attachments = session.sources.filter((item) => item.blockId === block.id);
    if (!attachments.length) continue;
    let rows: Record<string, unknown>[] = [];
    let extractions: DocumentExtraction[] = [];
    for (const source of attachments) {
      if (source.mode === 'replace') {
        rows = [];
        extractions = [];
      }
      const sourceRows = source.rows.map((row, index) => ({
        ...row,
        rowId: `${source.id}:${String(row.rowId ?? index + 1)}`,
        sourceFileName: source.name,
        ...(source.extraction
          ? {
              sourceExtractionId: source.extraction.id,
              sourceRevision: source.extraction.revision,
              sourceContentHash: source.extraction.contentHash,
            }
          : {}),
      }));
      rows.push(...sourceRows);
      if (source.extraction) extractions.push({ ...source.extraction, rows: sourceRows });
    }
    const textSource = extractions.some((item) =>
      ['pdf_text', 'docx_text', 'ocr'].includes(item.method),
    );
    block.config = {
      ...block.config,
      sourceKind: textSource ? 'pdf_document' : 'manual_table',
      toolId: textSource ? 'source.pdf_document' : 'source.manual_table',
      documentExtractions: extractions.length ? extractions : undefined,
      requireUpload: false,
      rows,
      manualRows: rows,
      tableRows: rows,
      selectedRowsCount: rows.length,
      sourceStatus: 'draft',
      sourceUsedInRun: false,
      sourceLocator: `run://${session.id}/${block.id}`,
      workbookFile: undefined,
      excelWorkbook: undefined,
    };
  }
  return definition;
}
function descendants(definition: WorkflowDefinition, id: string): string[] {
  const ids = new Set([id]);
  let size = 0;
  while (size !== ids.size) {
    size = ids.size;
    for (const edge of definition.edges)
      if (edge.status === 'active' && ids.has(edge.sourceBlockId)) ids.add(edge.targetBlockId);
  }
  return [...ids];
}
function invalidate(session: WorkflowSession, ids: string[]) {
  session.approvedAt = undefined;
  session.reviewed = session.reviewed.filter((id) => !ids.includes(id));
  session.stale = [...new Set([...session.stale, ...ids.filter((id) => !!session.results[id])])];
}
export type SessionAction =
  | { kind: 'inputs'; blockId: string; patch: Record<string, unknown> }
  | { kind: 'document_review'; sourceId: string; reviewId: string; draft: DocumentReviewDraft }
  | { kind: 'pause' | 'resume' | 'approve' | 'end' | 'record' }
  | { kind: 'block'; blockId: string }
  | { kind: 'review'; blockId: string }
  | {
      kind: 'source';
      blockId: string;
      sourceId: string;
      name: string;
      mode: 'add' | 'replace';
      rows: Record<string, unknown>[];
      extraction?: DocumentExtraction;
    };
export function sessionContext(entry: PersonalWorkflow, session: WorkflowSession) {
  const definition = sessionDefinition(entry, session);
  const steps = orderedBlocks(definition).map((block) => {
    const dependencies = definition.edges
      .filter((edge) => edge.status === 'active' && edge.targetBlockId === block.id)
      .map((edge) => edge.sourceBlockId);
    const result = session.results[block.id];
    const status = session.stale.includes(block.id)
      ? 'outdated'
      : session.reviewed.includes(block.id)
        ? 'reviewed'
        : (result?.status ?? 'pending');
    const ready = dependencies.every(
      (id) =>
        session.results[id] &&
        !session.stale.includes(id) &&
        (!['error', 'skipped', 'needs_review'].includes(session.results[id].status) ||
          session.reviewed.includes(id)),
    );
    return {
      id: block.id,
      label: block.label,
      family: block.family,
      dependencies,
      status,
      ready,
      inputKeys: runInputKeys(block),
      inputRequired: inputRequired(block),
      warnings: result?.warnings ?? [],
      errors: result?.errors ?? [],
    };
  });
  return {
    workflowId: entry.id,
    workflowName: definition.name,
    runId: session.id,
    version: session.version,
    revision: session.revision,
    paused: session.paused,
    endedAt: session.endedAt,
    approvedAt: session.approvedAt,
    documentReviews: documentReviewSummaries(session).map(({ draft, ...review }) => ({
      ...review,
      observations: draft.observations.length,
      questions: draft.questions.length,
    })),
    sources: session.sources.map(({ rows, extraction, ...source }) => ({
      ...source,
      records: rows.length,
      extraction: extraction
        ? {
            id: extraction.id,
            revision: extraction.revision,
            method: extraction.method,
            segments: extraction.segments.length,
            issues: extraction.issues,
            contentHash: extraction.contentHash,
          }
        : undefined,
    })),
    steps,
  };
}
export function changeSession(
  entry: PersonalWorkflow,
  id: string,
  revision: number,
  action: SessionAction,
  runtime: GraphRuntime,
  at = new Date().toISOString(),
): PersonalWorkflow {
  const session = getSession(entry, id);
  if (revision !== session.revision)
    throw new WorkflowCommandError(
      'CONFLICT',
      'The run changed. Review its current state before retrying.',
    );
  const definition = sessionDefinition(entry, session);
  if (session.endedAt && action.kind !== 'pause')
    fail('This workflow has ended. Start a new run to execute or change inputs.');
  if (action.kind === 'end') {
    session.endedAt = at;
    session.paused = true;
  }
  if (action.kind === 'inputs') {
    if (!session.paused) fail('Pause execution before applying input changes.');
    const block = definition.blocks.find((item) => item.id === action.blockId);
    if (!block) fail('Choose an existing input block.');
    const patch = validateRunInputPatch(block, action.patch);
    session.inputOverrides = {
      ...session.inputOverrides,
      [block.id]: { ...session.inputOverrides?.[block.id], ...patch },
    };
    invalidate(session, descendants(definition, block.id));
  }
  if (action.kind === 'document_review') {
    if (!session.paused) fail('Pause the run before saving document interpretation notes.');
    const review = makeDocumentReview(session, action.sourceId, action.draft, action.reviewId, at);
    session.documentReviews = [...(session.documentReviews ?? []), review];
  }
  if (action.kind === 'pause') session.paused = true;
  if (action.kind === 'resume') {
    const missing = definition.blocks.filter(inputRequired);
    if (missing.length)
      fail(
        `Trigger readiness: provide inputs for ${missing.map((block) => block.label).join(', ')} before execution.`,
      );
    session.paused = false;
  }
  if (action.kind === 'source') {
    if (!session.paused) fail('Pause execution before applying source changes.');
    const block = definition.blocks.find((item) => item.id === action.blockId);
    if (!block || !isDocumentSource(block))
      fail('Choose an existing document source block from this run.');
    if (action.extraction && !DocumentExtractionSchema.safeParse(action.extraction).success)
      fail('Supply a valid captured extraction for this document.');
    if (
      !action.name.trim() ||
      !action.sourceId.trim() ||
      (!action.rows.length &&
        !action.extraction?.segments.some((segment) => segment.text.trim())) ||
      action.rows.length > 50000 ||
      action.rows.some((row) => !row || typeof row !== 'object' || Array.isArray(row))
    )
      fail('Supply a named source containing document text or 1–50,000 records.');
    if (
      new Set(action.rows.map((row, index) => String(row.rowId ?? index + 1))).size !==
      action.rows.length
    )
      fail('Source row IDs must be unique within each document.');
    if (session.sources.some((item) => item.id === action.sourceId))
      fail('This source operation already exists.');
    const previous = session.sources.filter((item) => item.blockId === block.id);
    if (action.mode === 'add') {
      const text = (method: string | undefined) =>
        ['pdf_text', 'docx_text', 'ocr'].includes(method ?? '');
      const reverseIndex = [...previous].reverse().findIndex((source) => source.mode === 'replace');
      const lastReplacement = reverseIndex < 0 ? 0 : previous.length - reverseIndex - 1;
      if (
        previous
          .slice(Math.max(0, lastReplacement))
          .some((source) => text(source.extraction?.method) !== text(action.extraction?.method))
      )
        fail(
          'Use separate source blocks for text documents and structured records, or replace the current source.',
        );
    }
    let extraction: DocumentExtraction | undefined;
    if (action.extraction) {
      const parsed = DocumentExtractionSchema.safeParse(action.extraction);
      if (
        !parsed.success ||
        parsed.data.fileName !== action.name ||
        !/^sha256:[a-f0-9]{64}$/.test(parsed.data.contentHash) ||
        parsed.data.segments.some((segment) => !segment.id || !segment.location) ||
        new Set(parsed.data.segments.map((segment) => segment.id)).size !==
          parsed.data.segments.length ||
        parsed.data.segments.reduce((size, segment) => size + segment.text.length, 0) > 1_000_000
      )
        fail('Supply a valid captured extraction for this document.');
      extraction = {
        ...parsed.data,
        id: action.sourceId,
        revision: previous.length + 1,
        rows: structuredClone(action.rows),
      };
    }
    if (action.mode === 'add' && !previous.length)
      fail('Attach the first source with Replace, then add further sources.');
    session.sources.push({
      id: action.sourceId,
      blockId: block.id,
      name: action.name,
      at,
      mode: action.mode,
      rows: structuredClone(action.rows),
      ...(extraction ? { extraction } : {}),
    });
    if (session.inputOverrides) delete session.inputOverrides[block.id];
    if (
      (
        sessionDefinition(entry, session).blocks.find((item) => item.id === block.id)?.config
          .rows as unknown[]
      ).length > 50000
    )
      fail('The combined source exceeds 50,000 records.');
    invalidate(session, descendants(definition, block.id));
    session.paused = true;
  }
  if (action.kind === 'block') {
    const block = definition.blocks.find((item) => item.id === action.blockId);
    if (!block) fail('Choose an existing block from this run.');
    const step = sessionContext(entry, session).steps.find((item) => item.id === block.id)!;
    if (step.inputRequired) fail('Provide this block’s required inputs before execution.');
    if (!step.ready) fail('Run the missing or outdated dependencies first.');
    // Supply only actual, current direct predecessors. Never fabricate test inputs.
    const inputs = step.dependencies.map((blockId) => ({
      block: definition.blocks.find((item) => item.id === blockId)!,
      result: session.results[blockId],
    }));
    const result = executeGraph(
      {
        definition: structuredClone(definition),
        mode: 'isolated',
        selectedBlockId: block.id,
        isolatedInputs: structuredClone(inputs),
        testInputSource: 'recorded',
      },
      runtime,
    );
    const output = result.result.results.find((item) => item.blockId === block.id);
    if (!output) fail('The block returned no execution result.');
    invalidate(session, descendants(definition, block.id));
    session.results[block.id] = structuredClone(output);
    session.stale = session.stale.filter((item) => item !== block.id);
    session.attempts.push({
      at,
      revision: session.revision,
      blockId: block.id,
      result: structuredClone(result),
    });
    if (['error', 'skipped', 'needs_review'].includes(output.status)) session.paused = true;
  }
  if (action.kind === 'review') {
    if (
      !session.results[action.blockId] ||
      session.stale.includes(action.blockId) ||
      !['needs_review', 'warning'].includes(session.results[action.blockId].status)
    )
      fail('Only a current review checkpoint or finding can be acknowledged.');
    session.reviewed = [...new Set([...session.reviewed, action.blockId])];
  }
  if (action.kind === 'approve' || action.kind === 'record') {
    const steps = sessionContext(entry, session).steps;
    if (
      !steps.length ||
      steps.some((step) => !['success', 'warning', 'reviewed'].includes(step.status))
    )
      fail('Complete all steps and resolve outdated or blocked results before approving.');
    if (action.kind === 'approve') session.approvedAt = at;
    session.paused = true;
    const last = session.attempts.at(-1);
    if (!last) fail('This run has no execution evidence.');
    const recordedId =
      action.kind === 'approve'
        ? `${session.id}:${session.revision}`
        : `${session.id}:history:${session.attempts.length}`;
    if (entry.runs.some((run) => run.result.record.execution.id === recordedId))
      return put(entry, session);
    const results = Object.values(session.results).map((result) => ({
      ...structuredClone(result),
      runId: recordedId,
    }));
    const warnings = results.flatMap((result) => result.warnings);
    entry = recordWorkflowExecution(
      entry,
      session.version,
      {
        blockStatuses: Object.fromEntries(
          results.map((result) => [result.blockId, 'success' as const]),
        ),
        edgeStatuses: Object.fromEntries(
          definition.edges
            .filter((edge) => edge.status === 'active')
            .map((edge) => [edge.id, 'success' as const]),
        ),
        result: {
          ...last.result.result,
          runId: recordedId,
          workflowId: entry.id,
          workflowName: definition.name,
          startedAt: session.createdAt,
          completedAt: at,
          results,
          warnings,
          errors: [],
          status: warnings.length ? 'warning' : 'success',
          logs: results.flatMap((result) => result.logs),
        },
        record: {
          execution: {
            ...last.result.record.execution,
            id: recordedId,
            workflowId: entry.id,
            startedAt: new Date(session.createdAt),
            completedAt: new Date(at),
            status: 'success',
          },
          logs: definition.blocks
            .flatMap(
              (block) =>
                [...session.attempts].reverse().find((attempt) => attempt.blockId === block.id)
                  ?.result.record.logs ?? [],
            )
            .map((log) => ({ ...log, executionId: recordedId })),
        },
      },
      at,
    );
    entry = {
      ...entry,
      runs: entry.runs.map((run) =>
        run.result.record.execution.id === recordedId
          ? {
              ...run,
              sessionSnapshot: structuredClone(session),
              documentReviews: structuredClone(
                documentReviewSummaries(session)
                  .filter((review) => review.status === 'current')
                  .map(({ status, ...review }) => review),
              ),
            }
          : run,
      ),
    };
  }
  session.revision += 1;
  return put(entry, session);
}
