import type { WorkflowBlock } from '@workspace/workflow-contracts/domain/workflow-types';
import {
  apiRequestToBlockConfig,
  buildApiRequest,
  CUSTOM_CONNECTOR_ID,
  getApiConnector,
  type ApiParamValues,
} from '@workspace/source-connectors/connectors';
import {
  isDocumentSource,
  runInputKeys,
  validateRunInputPatch,
} from '@workspace/workflow-core/sessions';
import {
  buildExcelSourceConfigPatch,
  detectExcelColumnMapping,
  getExcelColumnMappingFromConfig,
  getExcelWorkbookFromConfig,
  getExcelTableSelection,
} from '@/shared/workflow-engine/parsing/excel-utils';

function prepareHttpInputProposal(block: WorkflowBlock, requested: Record<string, unknown>) {
  const connectorId = String(
    requested.connectorId ?? block.config.connectorId ?? CUSTOM_CONNECTOR_ID,
  );
  const connector = getApiConnector(connectorId);
  if (!connector && connectorId !== CUSTOM_CONNECTOR_ID)
    throw new Error('Choose an existing API or the custom endpoint option.');
  if (!connector) {
    if ('connectorParams' in requested && Object.keys(requested.connectorParams ?? {}).length)
      throw new Error('Choose a named API before setting connector parameters.');
    return validateRunInputPatch(block, {
      ...requested,
      ...('connectorId' in requested ? { connectorParams: {} } : {}),
    });
  }
  if (
    Object.keys(requested).some(
      (key) => !['connectorId', 'connectorParams', 'headers', 'body'].includes(key),
    )
  )
    throw new Error(
      'This API derives its request and mapping from its parameters. Use those fields or select the custom endpoint.',
    );
  const supplied = requested.connectorParams;
  if (
    supplied !== undefined &&
    (!supplied || typeof supplied !== 'object' || Array.isArray(supplied))
  )
    throw new Error('Supply connector parameters as an object.');
  if (
    supplied &&
    Object.keys(supplied).some((key) => !connector.params.some((param) => param.key === key))
  )
    throw new Error('Use the parameter fields exposed by the selected API.');
  if (!('connectorId' in requested || 'connectorParams' in requested))
    return validateRunInputPatch(block, requested);
  const params = {
    ...(connectorId === block.config.connectorId
      ? (block.config.connectorParams as ApiParamValues)
      : {}),
    ...(supplied as ApiParamValues),
  };
  const built = buildApiRequest(connectorId, params);
  if (!built.ok) throw new Error(built.errors.join(' '));
  const patch = apiRequestToBlockConfig(connectorId, built.params, built.spec);
  return validateRunInputPatch(block, {
    ...Object.fromEntries(Object.entries(patch).map(([key, value]) => [key, value ?? null])),
    ...('headers' in requested ? { headers: requested.headers } : {}),
    ...('body' in requested ? { body: requested.body } : {}),
  });
}

/** Agent edits use the same workbook projection as the form, never supplied model rows. */
export function prepareSessionInputProposal(
  block: WorkflowBlock,
  requested: Record<string, unknown>,
) {
  if (
    Object.keys(requested).some((key) =>
      [
        'fetchedRows',
        'responseMeta',
        'fetchedAt',
        'fetchedRequestSignature',
        'samplePayload',
      ].includes(key),
    )
  )
    throw new Error('Use the actual source form to fetch HTTP response records and evidence.');
  if (runInputKeys(block).includes('connectorId'))
    return prepareHttpInputProposal(block, requested);
  if (
    runInputKeys(block).includes('liveRate') &&
    Object.keys(requested).some((key) =>
      [
        'liveRate',
        'rateFetchedAt',
        'rateFetchedFor',
        'rateProvider',
        'rateType',
        'sourceLocator',
      ].includes(key),
    )
  )
    throw new Error('Use the source form to fetch a published rate, or propose an overrideRate.');
  if (!isDocumentSource(block)) return validateRunInputPatch(block, requested);
  const editable = [
    'columnMapping',
    'selectedSheet',
    'selectedRange',
    'headerRowNumber',
    'firstDataRowNumber',
    'includeRowsWithoutAmount',
    'includeTotalRows',
  ];
  if (Object.keys(requested).some((key) => !editable.includes(key)))
    throw new Error('Use the actual attachment form to add or replace source files and evidence.');
  const workbook = getExcelWorkbookFromConfig(block.config);
  if (!workbook)
    throw new Error(
      'Open the source form and upload the workbook to change its selection. Captured records alone cannot reconstruct the original workbook.',
    );
  const config = { ...block.config, ...requested };
  if ('headerRowNumber' in requested && !('firstDataRowNumber' in requested))
    config.firstDataRowNumber = Number(requested.headerRowNumber) + 1;
  const sheet = String(config.selectedSheet ?? '');
  const selected = workbook.sheets.find((item) => item.sheetName === sheet);
  if (!selected) throw new Error('Choose an existing workbook sheet.');
  const table = getExcelTableSelection(selected, {
    headerRowNumber:
      typeof config.headerRowNumber === 'number' ? config.headerRowNumber : undefined,
    firstDataRowNumber:
      typeof config.firstDataRowNumber === 'number' ? config.firstDataRowNumber : undefined,
  });
  const mapping =
    'selectedSheet' in requested || 'headerRowNumber' in requested
      ? detectExcelColumnMapping(table.headers)
      : getExcelColumnMappingFromConfig(block.config, table.headers);
  if ('columnMapping' in requested) {
    const requestedMapping = requested.columnMapping;
    if (
      !requestedMapping ||
      typeof requestedMapping !== 'object' ||
      Array.isArray(requestedMapping)
    )
      throw new Error('Supply the workbook column mapping as an object.');
    for (const [field, column] of Object.entries(requestedMapping)) {
      if (
        !['account', 'label', 'description', 'amount', 'debit', 'credit', 'currency'].includes(
          field,
        ) ||
        (column != null &&
          column !== '' &&
          (typeof column !== 'string' || !table.headers.includes(column)))
      )
        throw new Error('Choose a column shown in the source form, or leave the mapping empty.');
    }
    Object.assign(
      mapping,
      Object.fromEntries(
        Object.entries(requestedMapping).map(([key, value]) => [key, value || undefined]),
      ),
    );
  }
  const patch = buildExcelSourceConfigPatch({
    workbook,
    existingConfig: config,
    selectedSheetName: sheet,
    selectedRange: typeof config.selectedRange === 'string' ? config.selectedRange : undefined,
    mapping,
    defaultCurrency:
      typeof config.defaultCurrency === 'string' ? config.defaultCurrency : undefined,
  });
  const keys = runInputKeys(block);
  return validateRunInputPatch(
    block,
    Object.fromEntries(
      Object.entries({ ...requested, ...patch }).filter(([key]) => keys.includes(key)),
    ),
  );
}
