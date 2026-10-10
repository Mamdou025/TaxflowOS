import type {
  ExcelColumnMapping,
  ExcelNormalizedRow,
  ExcelRowData,
  ExcelSheetData,
  ExcelTableSelection,
  ExcelWorkbookSourceData,
} from './workbook-types';
import {
  ACCOUNT_ALIASES,
  FINANCIAL_ROW_ALIASES,
  LABEL_ALIASES,
  DESCRIPTION_ALIASES,
  AMOUNT_ALIASES,
  CURRENCY_ALIASES,
  DEBIT_ALIASES,
  CREDIT_ALIASES,
  ACCOUNT_TYPE_ALIASES,
  BALANCE_SHEET_TYPE_REGEX,
  DELIMITED_LIST_REGEX,
  NUMBER_PATTERN,
  MAX_PERSISTED_ROWS_PER_SHEET,
  MAX_HEADER_SCAN_ROWS,
  SIGN_PREFIX_REGEX,
  LEADING_ACCOUNT_REGEX,
  PARENTHETICAL_NUMBER_REGEX,
  LETTER_REGEX,
  DIGIT_REGEX,
  CURRENCY_AND_TEXT_REGEX,
  WHITESPACE_REGEX,
  TOTAL_ROW_REGEX,
  CURRENCY_SUFFIX_KEYS,
  normalizeKey,
  headerMatchesAlias,
  normalizeSheetToken,
  columnName,
  formatCellValue,
  normalizeNumericText,
  parseFallbackNumber,
  parseNumber,
  getRecordValue,
  findAlias,
  detectExcelColumnMapping,
  getAmount,
  hasMappedAmount,
  inferCurrency,
  detectSheetCurrency,
  getCurrency,
  getAccountFromLabel,
  getCellRef,
  isLikelyLabelCell,
  isHeaderLikeLabel,
  isDebitHeader,
  isCreditHeader,
  normalizeExcelRow,
  normalizeExtractedExcelRow,
  getBestLabelIndex,
  detectLooseDebitCreditLayout,
  normalizeDebitCreditExtractedRow,
  extractDebitCreditRows,
  extractAdjacentAmountRows,
  getLooseExtractedRows,
  shouldUseLooseExtraction,
} from './workbook-values';
export * from './workbook-types';
export { detectExcelColumnMapping, parseNumber as parseExcelNumber } from './workbook-values';
export type WorkbookFile = {
  name: string;
  size: number;
  arrayBuffer: () => Promise<ArrayBuffer>;
  text: () => Promise<string>;
};
export type ReadWorkbookSheets = (
  bytes: ArrayBuffer,
) => Promise<{ name: string; hidden?: boolean; cells: unknown[][] }[]>;
function getUsedRowCount(rows: string[][]) {
  let lastUsedIndex = rows.length - 1;
  while (lastUsedIndex > 0 && rows[lastUsedIndex].every((cell) => !String(cell).trim())) {
    lastUsedIndex -= 1;
  }
  return lastUsedIndex + 1;
}

function getUsedColumnCount(rows: string[][]) {
  return rows.reduce((max, row) => {
    let lastUsedIndex = row.length - 1;
    while (lastUsedIndex > 0 && !String(row[lastUsedIndex]).trim()) {
      lastUsedIndex -= 1;
    }
    return Math.max(max, lastUsedIndex + 1);
  }, 0);
}

function normalizeHeader(value: string, index: number) {
  return value.trim() || columnName(index);
}

function getHeadersForRow(cells: string[][], rowIndex: number, columnCount: number) {
  return Array.from({ length: columnCount }, (_, index) =>
    normalizeHeader(cells[rowIndex]?.[index] || '', index),
  );
}

function getColumnIndex(headers: string[], columnNameValue?: string) {
  return columnNameValue ? headers.indexOf(columnNameValue) : -1;
}

function hasText(value: unknown) {
  return String(value || '').trim().length > 0;
}

function scoreHeaderCandidate({
  cells,
  columnCount,
  rowIndex,
  rowCount,
}: {
  cells: string[][];
  columnCount: number;
  rowIndex: number;
  rowCount: number;
}) {
  const headers = getHeadersForRow(cells, rowIndex, columnCount);
  const mapping = detectExcelColumnMapping(headers);
  const amountIndex = getColumnIndex(headers, mapping.amount);
  const debitIndex = getColumnIndex(headers, mapping.debit);
  const creditIndex = getColumnIndex(headers, mapping.credit);
  const labelIndex = Math.max(
    getColumnIndex(headers, mapping.label),
    getColumnIndex(headers, mapping.description),
    getColumnIndex(headers, mapping.account),
  );
  const hasAmountMapping = amountIndex >= 0 || debitIndex >= 0 || creditIndex >= 0;
  const hasLabelMapping = labelIndex >= 0;
  let numericRows = 0;
  let textRows = 0;

  const sampleEnd = Math.min(rowCount, rowIndex + 26);
  for (let index = rowIndex + 1; index < sampleEnd; index += 1) {
    const row = cells[index] || [];
    if (amountIndex >= 0 && parseNumber(row[amountIndex]) !== null) {
      numericRows += 1;
    }
    if (
      amountIndex < 0 &&
      (parseNumber(row[debitIndex]) !== null || parseNumber(row[creditIndex]) !== null)
    ) {
      numericRows += 1;
    }
    if (labelIndex >= 0 && hasText(row[labelIndex])) {
      textRows += 1;
    }
  }

  let score = 0;
  if (hasAmountMapping) {
    score += 12;
  }
  if (hasLabelMapping) {
    score += 8;
  }
  score += Math.min(numericRows, 8) * 2;
  score += Math.min(textRows, 8);
  score -= rowIndex * 0.05;

  return { headers, mapping, score };
}

function detectTableSelection({
  cells,
  columnCount,
  rowCount,
}: {
  cells: string[][];
  columnCount: number;
  rowCount: number;
}) {
  const scanRows = Math.min(rowCount, MAX_HEADER_SCAN_ROWS);
  let best = {
    headers: getHeadersForRow(cells, 0, columnCount),
    headerRowNumber: 1,
    score: Number.NEGATIVE_INFINITY,
  };

  for (let rowIndex = 0; rowIndex < scanRows; rowIndex += 1) {
    if (!cells[rowIndex]?.some(hasText)) {
      continue;
    }
    const candidate = scoreHeaderCandidate({
      cells,
      columnCount,
      rowCount,
      rowIndex,
    });
    if (candidate.score > best.score) {
      best = {
        headers: candidate.headers,
        headerRowNumber: rowIndex + 1,
        score: candidate.score,
      };
    }
  }

  return {
    firstDataRowNumber: best.headerRowNumber + 1,
    headerRowNumber: best.headerRowNumber,
    headers: best.headers,
  };
}

export function getExcelTableSelection(
  sheet: ExcelSheetData,
  options: {
    firstDataRowNumber?: number;
    headerRowNumber?: number;
  } = {},
): ExcelTableSelection {
  const headerRowNumber = Math.max(
    1,
    Math.min(
      Number(options.headerRowNumber || sheet.detectedHeaderRowNumber || 1),
      sheet.cells.length || 1,
    ),
  );
  const firstDataRowNumber = Math.max(
    headerRowNumber + 1,
    Number(options.firstDataRowNumber || sheet.detectedFirstDataRowNumber || headerRowNumber + 1),
  );
  const columnCount = Math.max(1, sheet.columnCount);
  const headers = getHeadersForRow(sheet.cells, headerRowNumber - 1, columnCount);
  const inferredRange = `${sheet.sheetName}!A${headerRowNumber}:${columnName(
    columnCount - 1,
  )}${Math.max(firstDataRowNumber, sheet.cells.length)}`;

  return {
    columnCount,
    firstDataRowNumber,
    headerRowNumber,
    headers,
    inferredRange,
  };
}

function createSheetData({
  cells,
  sheetName,
  workbookId,
  rowLimit = MAX_PERSISTED_ROWS_PER_SHEET,
}: {
  cells: string[][];
  sheetName: string;
  workbookId: string;
  rowLimit?: number;
}): ExcelSheetData {
  const rowCount = getUsedRowCount(cells);
  const columnCount = Math.max(1, getUsedColumnCount(cells));
  const detectedTable = detectTableSelection({
    cells,
    columnCount,
    rowCount,
  });
  const headers = detectedTable.headers;
  const mapping = detectExcelColumnMapping(headers);
  const defaultCurrency = detectSheetCurrency(cells);
  const dataStartIndex = detectedTable.firstDataRowNumber - 1;
  const persistedRows = cells
    .slice(dataStartIndex, Math.min(rowCount, dataStartIndex + rowLimit))
    .map((row, rowIndex) => {
      const rowNumber = dataStartIndex + rowIndex + 1;
      const valuesByColumn = Object.fromEntries(
        headers.map((header, index) => [header, row[index] || '']),
      );
      const normalized = normalizeExcelRow({
        defaultCurrency,
        mapping,
        rowIndex,
        rowNumber,
        sheetName,
        valuesByColumn,
        workbookId,
      });
      return {
        normalized,
        raw: valuesByColumn,
        rowId: normalized.rowId,
        rowNumber,
        valuesByColumn,
      };
    })
    .filter((row) => Object.values(row.valuesByColumn).some((value) => String(value).trim()));
  const inferredRange = `${sheetName}!A${detectedTable.headerRowNumber}:${columnName(
    columnCount - 1,
  )}${rowCount}`;

  return {
    cells: cells
      .slice(0, Math.min(rowCount, rowLimit + 1))
      .map((row) => Array.from({ length: columnCount }, (_, index) => row[index] || '')),
    columnCount,
    detectedFirstDataRowNumber: detectedTable.firstDataRowNumber,
    detectedHeaderRowNumber: detectedTable.headerRowNumber,
    totalRowCount: rowCount,
    headers,
    inferredRange,
    persistedRowLimit: rowLimit,
    rowCount: persistedRows.length,
    rows: persistedRows,
    sheetName,
    truncated: rowCount > rowLimit + 1,
  };
}

export async function parseExcelWorkbookFile(
  file: WorkbookFile,
  readSheets: ReadWorkbookSheets,
  options: { sheetName?: string; rowLimit?: number } = {},
): Promise<ExcelWorkbookSourceData> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (extension !== 'xlsx' && extension !== 'xls') {
    throw new Error('Upload a normal Excel workbook (.xlsx).');
  }

  const sourceSheets = await readSheets(await file.arrayBuffer());
  const uploadedAt = new Date().toISOString();
  const workbookId = `workbook-${Date.now().toString(36)}`;
  if (options.sheetName && !sourceSheets.some((sheet) => sheet.name === options.sheetName))
    throw new Error(`Sheet "${options.sheetName}" is no longer available.`);
  const rowLimit = options.rowLimit ?? MAX_PERSISTED_ROWS_PER_SHEET;
  if (!Number.isInteger(rowLimit) || rowLimit < 1 || rowLimit > 50000)
    throw new Error('The worksheet row limit must be between 1 and 50,000.');
  const sheets = sourceSheets
    .filter((sheet) => !options.sheetName || sheet.name === options.sheetName)
    .map((source) => ({
      ...createSheetData({
        cells: source.cells.map((row) => row.map(formatCellValue)),
        sheetName: source.name,
        workbookId,
        rowLimit,
      }),
      hidden: Boolean(source.hidden),
    }))
    .filter((sheet) => sheet.cells.some((row) => row.some((cell) => cell.trim())));

  if (sheets.length === 0) {
    throw new Error('No readable sheets were found in this workbook.');
  }

  return {
    fileName: file.name,
    fileSize: file.size,
    sheets,
    uploadedAt,
    workbookId,
  };
}

export function getExcelWorkbookFromConfig(config: Record<string, unknown>) {
  const workbook = config.excelWorkbook;
  if (
    typeof workbook === 'object' &&
    workbook !== null &&
    Array.isArray((workbook as ExcelWorkbookSourceData).sheets)
  ) {
    return workbook as ExcelWorkbookSourceData;
  }
  return null;
}

export function getExcelSheet(workbook: ExcelWorkbookSourceData | null, sheetName?: string) {
  if (!workbook) {
    return null;
  }
  return (
    workbook.sheets.find((sheet) => sheet.sheetName === sheetName) || workbook.sheets[0] || null
  );
}

export function getExcelColumnMappingFromConfig(
  config: Record<string, unknown>,
  headers: string[],
): ExcelColumnMapping {
  const mapping = config.columnMapping;
  if (typeof mapping === 'object' && mapping !== null) {
    return {
      ...detectExcelColumnMapping(headers),
      ...(mapping as ExcelColumnMapping),
    };
  }
  return detectExcelColumnMapping(headers);
}

export function getNormalizedRowsForSheet({
  allowLooseExtraction = true,
  defaultCurrency,
  firstDataRowNumber,
  headerRowNumber,
  includeRowsWithoutAmount = false,
  includeTotalRows = false,
  mapping,
  sheet,
  workbook,
}: {
  allowLooseExtraction?: boolean;
  defaultCurrency?: string;
  firstDataRowNumber?: number;
  headerRowNumber?: number;
  includeRowsWithoutAmount?: boolean;
  includeTotalRows?: boolean;
  mapping: ExcelColumnMapping;
  sheet: ExcelSheetData;
  workbook: ExcelWorkbookSourceData;
}) {
  const table = getExcelTableSelection(sheet, {
    firstDataRowNumber,
    headerRowNumber,
  });
  const currency = defaultCurrency ?? detectSheetCurrency(sheet.cells);
  const tableRows = sheet.cells
    .slice(
      table.firstDataRowNumber - 1,
      Math.min(sheet.cells.length, table.firstDataRowNumber - 1 + sheet.persistedRowLimit),
    )
    .map((row, rowIndex) => {
      const rowNumber = table.firstDataRowNumber + rowIndex;
      const valuesByColumn = Object.fromEntries(
        table.headers.map((header, index) => [header, row[index] || '']),
      );
      return normalizeExcelRow({
        defaultCurrency: currency,
        mapping,
        rowIndex,
        rowNumber,
        sheetName: sheet.sheetName,
        valuesByColumn,
        workbookId: workbook.workbookId,
      });
    })
    .filter((row) => Object.values(row.raw).some((value) => hasText(value)))
    .filter(
      (row) =>
        includeRowsWithoutAmount ||
        Boolean((row.metadata as Record<string, unknown>).hasMappedAmount),
    )
    .filter((row) => includeTotalRows || !(row.metadata as Record<string, unknown>).isTotalRow)
    // Trial balance: drop balance-sheet (Asset/Liability/Equity) rows — only P&L
    // accounts feed the calculation. Only triggers when an account-type column
    // is present and says so; files without it are unaffected.
    .filter((row) => !(row.metadata as Record<string, unknown>).isBalanceSheetRow);
  if (includeRowsWithoutAmount && !mapping.amount && !mapping.debit && !mapping.credit) {
    return tableRows;
  }
  if (!allowLooseExtraction) return tableRows;
  const fallbackRows = getLooseExtractedRows({
    defaultCurrency: currency,
    includeTotalRows,
    sheet,
    workbook,
  });

  return shouldUseLooseExtraction({
    fallbackRows,
    mapping,
    tableRows,
  })
    ? fallbackRows
    : tableRows;
}

export function buildExcelSourceConfigPatch({
  allowLooseExtraction = true,
  defaultCurrency,
  existingConfig = {},
  firstDataRowNumber,
  headerRowNumber,
  includeRowsWithoutAmount,
  includeTotalRows,
  mapping,
  selectedRange,
  selectedSheetName,
  workbook,
}: {
  allowLooseExtraction?: boolean;
  defaultCurrency?: string;
  workbook: ExcelWorkbookSourceData;
  existingConfig?: Record<string, unknown>;
  firstDataRowNumber?: number;
  headerRowNumber?: number;
  includeRowsWithoutAmount?: boolean;
  includeTotalRows?: boolean;
  mapping?: ExcelColumnMapping;
  selectedRange?: string;
  selectedSheetName?: string;
}) {
  const sheet = getExcelSheet(workbook, selectedSheetName);
  if (!sheet) {
    throw new Error('Select a readable workbook sheet.');
  }
  const table = getExcelTableSelection(sheet, {
    firstDataRowNumber:
      firstDataRowNumber ??
      (typeof existingConfig.firstDataRowNumber === 'number'
        ? existingConfig.firstDataRowNumber
        : undefined),
    headerRowNumber:
      headerRowNumber ??
      (typeof existingConfig.headerRowNumber === 'number'
        ? existingConfig.headerRowNumber
        : undefined),
  });
  const columnMapping = {
    ...detectExcelColumnMapping(table.headers),
    ...(mapping || {}),
  };
  const nextIncludeTotalRows = includeTotalRows ?? existingConfig.includeTotalRows === true;
  const nextIncludeRowsWithoutAmount =
    includeRowsWithoutAmount ?? existingConfig.includeRowsWithoutAmount === true;
  const rows = getNormalizedRowsForSheet({
    allowLooseExtraction,
    defaultCurrency,
    firstDataRowNumber: table.firstDataRowNumber,
    headerRowNumber: table.headerRowNumber,
    includeRowsWithoutAmount: nextIncludeRowsWithoutAmount,
    includeTotalRows: nextIncludeTotalRows,
    mapping: columnMapping,
    sheet,
    workbook,
  });
  const range = selectedRange || table.inferredRange;

  return {
    columnMapping,
    columns: table.headers,
    excelWorkbook: workbook,
    fileName: workbook.fileName,
    fileSize: workbook.fileSize,
    firstDataRowNumber: table.firstDataRowNumber,
    headerRowNumber: table.headerRowNumber,
    includeRowsWithoutAmount: nextIncludeRowsWithoutAmount,
    includeTotalRows: nextIncludeTotalRows,
    outputs: 'selected_rows',
    rows,
    selectedRange: range,
    selectedRowsCount: rows.length,
    selectedSheet: sheet.sheetName,
    sheets: workbook.sheets.map((item) => item.sheetName),
    sourceKind: 'excel_workbook',
    sourceLocator: `local-excel://${workbook.workbookId}/${encodeURIComponent(
      sheet.sheetName,
    )}/${encodeURIComponent(range)}`,
    sourceStatus: 'draft',
    sourceVersion: existingConfig.sourceVersion || 1,
    toolId: 'source.manual_table',
    uploadTimestamp: workbook.uploadedAt,
    workbookFile: {
      fileName: workbook.fileName,
      fileSize: workbook.fileSize,
      uploadedAt: workbook.uploadedAt,
      workbookId: workbook.workbookId,
    },
    workbookId: workbook.workbookId,
    workbookName: workbook.fileName,
  };
}
