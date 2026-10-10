import type { PersonalWorkflow } from '@workspace/workflow-contracts/library-types';
import type { WorkflowDefinition } from '@workspace/workflow-contracts/domain/workflow-types';
import { currentDocumentSourceIds, inspectWorkflowRun } from '@workspace/workflow-core/inspection';
import type { SessionHistory } from './session-types';
import { sessionEditableInputKeys } from './session-service';

export type OmittedCollection = { path: string; total: number; shown: number };
/** Bound evidence previews without changing graph/rules or calculating readiness from partial rows. */
export function boundedEvidence<T>(
  input: T,
  path: string,
  omitted: OmittedCollection[],
  limit = 20,
): T {
  if (Array.isArray(input)) {
    if (input.length > limit) omitted.push({ path, total: input.length, shown: limit });
    return input
      .slice(0, limit)
      .map((item, index) => boundedEvidence(item, `${path}[${index}]`, omitted, limit)) as T;
  }
  if (input && typeof input === 'object')
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [
        key,
        boundedEvidence(value, `${path}.${key}`, omitted, limit),
      ]),
    ) as T;
  if (typeof input === 'string' && input.length > 8000) {
    omitted.push({ path, total: input.length, shown: 8000 });
    return input.slice(0, 8000) as T;
  }
  return input;
}
export function projectDefinition(definition: WorkflowDefinition, omitted: OmittedCollection[]) {
  return {
    ...definition,
    blocks: definition.blocks.map((block) => ({
      ...block,
      config: Object.fromEntries(
        Object.entries(block.config).map(([key, value]) => [
          key,
          [
            'rows',
            'manualRows',
            'tableRows',
            'fetchedRows',
            'fetchedPayload',
            'samplePayload',
            'excelWorkbook',
            'extractions',
            'documentExtractions',
            'workbookFile',
          ].includes(key)
            ? boundedEvidence(value, `definition.${block.id}.${key}`, omitted, 10)
            : value,
        ]),
      ),
    })),
  };
}
export function projectInspection(
  entry: PersonalWorkflow,
  runId: string,
  history: SessionHistory[] = [],
) {
  const inspection = inspectWorkflowRun(entry, runId);
  const session =
    entry.sessions?.find((item) => item.id === runId) ??
    entry.runs.find((item) => item.result.record.execution.id === runId)?.sessionSnapshot;
  const omitted: OmittedCollection[] = [];
  const active = currentDocumentSourceIds({ sources: inspection.sources });
  const sourceSummaries = inspection.sources.map((source) => ({
    id: source.id,
    blockId: source.blockId,
    name: source.name,
    at: source.at,
    mode: source.mode,
    active: active.has(source.id),
    rowCount: source.rows.length,
    previewRows: boundedEvidence(source.rows, `source.${source.id}.rows`, omitted, 10),
    ...(source.extraction
      ? {
          extraction: {
            id: source.extraction.id,
            revision: source.extraction.revision,
            contentHash: source.extraction.contentHash,
            method: source.extraction.method,
            originalDocumentId: source.extraction.originalDocumentId,
            issues: source.extraction.issues,
            segmentCount: source.extraction.segments.length,
          },
        }
      : {}),
  }));
  const attemptSummaries = inspection.attempts.slice(-100).map((attempt) => ({
    at: attempt.at,
    revision: attempt.revision,
    blockId: attempt.blockId,
    status: attempt.result.result.status,
  }));
  if (inspection.attempts.length > 100)
    omitted.push({ path: 'inspection.attempts', total: inspection.attempts.length, shown: 100 });
  if (history.length > 100)
    omitted.push({ path: 'inspection.changeHistory', total: history.length, shown: 100 });
  const { sources: _sources, attempts: _attempts, ...rest } = inspection;
  return {
    definition: projectDefinition(inspection.definition, omitted),
    omitted,
    inspection: {
      ...rest,
      definition: undefined,
      steps: inspection.steps.map((step) => ({
        ...step,
        inputKeys:
          inspection.kind === 'session'
            ? sessionEditableInputKeys(
                inspection.definition.blocks.find((block) => block.id === step.id)!,
              )
            : undefined,
      })),
      results: boundedEvidence(inspection.results, 'inspection.results', omitted),
      sourceSummaries,
      attemptSummaries,
      changeHistory: boundedEvidence(history.slice(-100), 'inspection.changeHistory', omitted, 100),
      inputOverrides: boundedEvidence(
        session?.inputOverrides ?? {},
        'inspection.inputOverrides',
        omitted,
        10,
      ),
      stale: session?.stale ?? [],
      reviewed: session?.reviewed ?? [],
      endedAt: session?.endedAt,
    },
  };
}

export function sourcePage(
  entry: PersonalWorkflow,
  runId: string,
  sourceId: string,
  offset: number,
  limit: number,
) {
  const inspection = inspectWorkflowRun(entry, runId);
  const source = inspection.sources.find((source) => source.id === sourceId);
  if (!source) return undefined;
  const segments = source.extraction?.segments ?? [];
  return {
    sourceId,
    name: source.name,
    offset,
    totalRows: source.rows.length,
    rows: source.rows.slice(offset, offset + limit),
    nextOffset: offset + limit < source.rows.length ? offset + limit : null,
    totalSegments: segments.length,
    segments: segments.slice(offset, offset + limit).map((segment) => ({
      ...segment,
      text: segment.text.slice(0, 8000),
      segmentTruncated: segment.text.length > 8000,
    })),
    nextSegmentOffset: offset + limit < segments.length ? offset + limit : null,
  };
}
