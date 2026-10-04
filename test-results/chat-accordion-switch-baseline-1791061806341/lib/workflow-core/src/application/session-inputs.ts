import type { WorkflowBlock } from '@workspace/workflow-contracts/domain/workflow-types';
import { WorkflowCommandError } from './commands';

const scalar = [
  'value',
  'manualValue',
  'scalarValue',
  'valuePreview',
  'unit',
  'currency',
  'valueLabel',
];
const fx = [
  'documentCurrency',
  'reportingCurrency',
  'fapiYear',
  'overrideRate',
  'liveRate',
  'rateFetchedAt',
  'rateFetchedFor',
  'rateProvider',
  'rateType',
  'sourceLocator',
];
const fiscal = ['inclusionRate', 'rtf', 'fatPaid', 'fapiYear'];
const document = [
  'columnMapping',
  'columns',
  'excelWorkbook',
  'fileName',
  'fileSize',
  'firstDataRowNumber',
  'headerRowNumber',
  'includeRowsWithoutAmount',
  'includeTotalRows',
  'rows',
  'selectedRange',
  'selectedRowsCount',
  'selectedSheet',
  'sheets',
  'sourceLocator',
  'sourceStatus',
  'sourceVersion',
  'sourceUsedInRun',
  'sourceVersionCreatedAt',
  'uploadTimestamp',
  'workbookFile',
  'workbookId',
  'workbookName',
  'defaultCurrency',
];
const http = [
  'url',
  'method',
  'headers',
  'body',
  'resultsPath',
  'fieldMap',
  'defaultAmount',
  'currency',
  'maxRows',
  'connectorId',
  'connectorParams',
  'fetchedRows',
  'responseMeta',
  'fetchedAt',
  'fetchedRequestSignature',
  'samplePayload',
  'sourceLocator',
];

/** Runtime data only. Rules, tool identities, edges and governance require a draft proposal. */
export function runInputKeys(block: WorkflowBlock): string[] {
  if (
    block.family !== 'Source' ||
    /rules|rulebook|rule_knowledge/i.test(`${block.subtype} ${block.config.sourceKind}`)
  )
    return [];
  const kind = String(block.config.sourceKind ?? block.config.toolId ?? block.subtype);
  if (/currency_rate/.test(kind)) return fx;
  if (/fapi_inputs/.test(kind)) return fiscal;
  if (/manual_value|Manual Entry/.test(kind)) return scalar;
  if (/http_json|API \/ HTTP/.test(kind)) return http;
  if (/excel|workbook|uploaded|manual_table|pdf_document/i.test(kind)) return document;
  return Object.keys(block.config).filter((key) => scalar.includes(key));
}

export function hasRunExchangeRate(config: Record<string, unknown>) {
  const from = String(config.documentCurrency ?? '')
    .trim()
    .toUpperCase();
  const to = String(config.reportingCurrency ?? '')
    .trim()
    .toUpperCase();
  if (from && from === to) return true;
  const rate = config.overrideRate ?? config.liveRate;
  return typeof rate === 'number' && Number.isFinite(rate) && rate > 0;
}

export function validateRunInputPatch(block: WorkflowBlock, patch: Record<string, unknown>) {
  const keys = runInputKeys(block);
  if (!Object.keys(patch).length || Object.keys(patch).some((key) => !keys.includes(key)))
    throw new WorkflowCommandError(
      'INVALID_REQUEST',
      'Only this source block’s input fields can change. Use a reviewed workflow proposal for rules or steps.',
    );
  const next = { ...block.config, ...patch };
  const numeric = [
    'value',
    'manualValue',
    'scalarValue',
    'valuePreview',
    'overrideRate',
    'liveRate',
    'fatPaid',
    'inclusionRate',
    'rtf',
    'fapiYear',
    'defaultAmount',
  ];
  for (const key of numeric)
    if (
      key in patch &&
      patch[key] != null &&
      (typeof patch[key] !== 'number' || !Number.isFinite(patch[key]))
    )
      throw new WorkflowCommandError('INVALID_REQUEST', `${key} must be a finite number.`);
  if (keys === fx && !hasRunExchangeRate(next))
    throw new WorkflowCommandError('INVALID_REQUEST', 'Supply or fetch a positive exchange rate.');
  if (
    keys === scalar &&
    (('value' in patch && patch.value == null) ||
      !scalar
        .slice(0, 4)
        .some((key) => typeof next[key] === 'number' && Number.isFinite(next[key])))
  )
    throw new WorkflowCommandError(
      'INVALID_REQUEST',
      'Enter a numeric source value; no inferred value will be used.',
    );
  if (
    Array.isArray(next.rows) &&
    (next.rows.length > 50000 ||
      next.rows.some((row) => !row || typeof row !== 'object' || Array.isArray(row)))
  )
    throw new WorkflowCommandError(
      'INVALID_REQUEST',
      'Source rows must contain at most 50,000 records.',
    );
  const workbook = next.excelWorkbook as { sheets?: { truncated?: boolean }[] } | undefined;
  if (workbook?.sheets?.some((sheet) => sheet.truncated))
    throw new WorkflowCommandError(
      'INVALID_REQUEST',
      'This workbook preview was truncated. Import a complete supported source before running.',
    );
  return structuredClone(patch);
}
