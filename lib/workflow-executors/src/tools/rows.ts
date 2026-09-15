import { type WorkflowBlock } from '@workspace/workflow-executors/workflow/contracts';
import {
  type FiscalRow,
  type EvidenceRef,
  type SourceTraceRef,
  type KeywordRule,
  type ToolRunResult,
  type ToolExecutionContext,
} from './types';
import { DEFAULT_TABLE_ROWS } from './samples';
import { asRecord, parseNumber } from './primitives';

export function getConfiguredRows(config: Record<string, unknown>): FiscalRow[] {
  const rowSource = config.manualRows || config.tableRows || config.rows || config.sampleRows;
  if (!Array.isArray(rowSource)) {
    return DEFAULT_TABLE_ROWS;
  }

  const rows = rowSource
    .map((item, index) => {
      const record = asRecord(item);
      if (!record) {
        return null;
      }

      const amount =
        parseNumber(record.amount) ??
        parseNumber(record.value) ??
        parseNumber(record.balance) ??
        Number.NaN;
      let account: string | undefined;
      if (typeof record.account === 'string') {
        account = record.account;
      } else if (typeof record.accountNumber === 'string') {
        account = record.accountNumber;
      }
      const row: FiscalRow = {
        ...record,
        amount,
        currency: typeof record.currency === 'string' ? record.currency : undefined,
        description: typeof record.description === 'string' ? record.description : undefined,
        label: String(record.label || record.name || `Source row ${index + 1}`),
        rowId: String(record.rowId || record.id || `source-row-${index + 1}`),
      };
      if (account) {
        row.account = account;
      }

      return row;
    })
    .filter((item): item is FiscalRow => Boolean(item));

  return rows;
}

export function sourceEvidenceForRow({
  block,
  row,
}: {
  block: WorkflowBlock;
  row: FiscalRow;
}): EvidenceRef {
  return {
    evidenceId: `${block.id}:${row.rowId}`,
    immutable: true,
    label: row.label,
    locator: block.source?.locator || String(block.config.sourceLocator || ''),
    rowId: row.rowId,
    sourceBlockId: block.id,
    sourceLabel: block.label,
    valuePreview: String(row.amount),
  };
}

export function sourceTraceForEvidence(evidence: EvidenceRef): SourceTraceRef {
  return {
    evidenceRefId: evidence.evidenceId,
    relationshipPath: [evidence.sourceBlockId],
    rowId: evidence.rowId,
    sourceBlockId: evidence.sourceBlockId,
    sourceLabel: evidence.sourceLabel,
    valuePreview: evidence.valuePreview,
  };
}

export function sourceEvidenceForKeywordRule({
  block,
  rule,
}: {
  block: WorkflowBlock;
  rule: KeywordRule;
}): EvidenceRef {
  return {
    evidenceId: `${block.id}:${rule.ruleId}`,
    immutable: true,
    label: `${rule.categoryLabel} keyword rule`,
    locator: block.source?.locator || String(block.config.sourceLocator || 'keyword-rules'),
    rowId: rule.ruleId,
    sourceBlockId: block.id,
    sourceLabel: block.label,
    valuePreview: rule.keywords.join(', '),
  };
}

export function getStringField(record: Record<string, unknown>, key: string) {
  return typeof record[key] === 'string' ? record[key] : undefined;
}

export function getKeywordRuleMatchMode(value: unknown): KeywordRule['matchMode'] {
  if (value === 'exact' || value === 'starts_with') {
    return value;
  }

  if (value === 'starts with') {
    return 'starts_with';
  }

  return 'contains';
}

export function fiscalRowFromOutputRecord({
  record,
  result,
}: {
  record: Record<string, unknown>;
  result: ToolRunResult;
}): FiscalRow {
  const row: FiscalRow = {
    amount:
      parseNumber(record.amount) ?? parseNumber(record.value) ?? parseNumber(record.subtotal) ?? 0,
    evidenceRefs: Array.isArray(record.evidenceRefs)
      ? (record.evidenceRefs as EvidenceRef[])
      : result.evidenceRefs,
    label: String(record.label || record.name || record.rowId || 'Row'),
    rowId: String(record.rowId || record.id || `${result.blockId}-row`),
    sourceTrace: Array.isArray(record.sourceTrace)
      ? (record.sourceTrace as SourceTraceRef[])
      : result.sourceTrace,
  };

  row.account = getStringField(record, 'account');
  row.categoryId = getStringField(record, 'categoryId');
  row.categoryLabel = getStringField(record, 'categoryLabel');
  row.confidence = parseNumber(record.confidence) ?? undefined;
  row.currency = getStringField(record, 'currency');
  row.description = getStringField(record, 'description');
  row.lineId = getStringField(record, 'lineId');
  row.matchedKeyword = getStringField(record, 'matchedKeyword');
  row.matchedRuleId = getStringField(record, 'matchedRuleId');
  row.ruleId = getStringField(record, 'ruleId');
  row.ruleTrace = Array.isArray(record.ruleTrace)
    ? (record.ruleTrace as SourceTraceRef[])
    : undefined;
  row.ruleSourceTrace = Array.isArray(record.ruleSourceTrace)
    ? (record.ruleSourceTrace as SourceTraceRef[])
    : undefined;
  row.sectionId = getStringField(record, 'sectionId');
  row.sourceRow = asRecord(record.sourceRow) || undefined;
  row.status = getStringField(record, 'status');
  row.subsectionId = getStringField(record, 'subsectionId');
  row.suggestedLine = getStringField(record, 'suggestedLine');
  row.suggestedSection = getStringField(record, 'suggestedSection');
  row.suggestedSubsection = getStringField(record, 'suggestedSubsection');
  row.target = getStringField(record, 'target');

  return row;
}

export function collectRowsFromResult(result: ToolRunResult): FiscalRow[] {
  const rows: FiscalRow[] = [];
  const candidates = [
    result.output.rows,
    result.output.mappedRows,
    result.output.transformedRows,
    result.output.includedRows,
  ];
  for (const candidate of candidates) {
    if (!Array.isArray(candidate)) {
      continue;
    }

    for (const item of candidate) {
      const record = asRecord(item);
      if (!record) {
        continue;
      }
      rows.push(fiscalRowFromOutputRecord({ record, result }));
    }
  }

  return rows;
}

export function collectRows(context: ToolExecutionContext): FiscalRow[] {
  return context.upstreamResults.flatMap(collectRowsFromResult);
}

export function collectUnmatchedRows(context: ToolExecutionContext): FiscalRow[] {
  return context.upstreamResults.flatMap((result) => {
    if (!Array.isArray(result.output.unmatchedRows)) {
      return [];
    }

    return result.output.unmatchedRows
      .map((item) => {
        const record = asRecord(item);
        return record ? fiscalRowFromOutputRecord({ record, result }) : null;
      })
      .filter((item): item is FiscalRow => Boolean(item));
  });
}

export function collectEvidence(context: ToolExecutionContext): EvidenceRef[] {
  const byId = new Map<string, EvidenceRef>();
  for (const evidence of [
    ...context.evidenceRefs,
    ...context.upstreamResults.flatMap((result) => result.evidenceRefs),
  ]) {
    byId.set(evidence.evidenceId, evidence);
  }
  return [...byId.values()];
}

export function collectSourceTrace(context: ToolExecutionContext): SourceTraceRef[] {
  const byKey = new Map<string, SourceTraceRef>();
  for (const trace of [
    ...context.sourceTrace,
    ...context.upstreamResults.flatMap((result) => result.sourceTrace),
  ]) {
    byKey.set(
      `${trace.sourceBlockId}:${trace.rowId || 'value'}:${trace.evidenceRefId || ''}`,
      trace,
    );
  }
  return [...byKey.values()];
}
