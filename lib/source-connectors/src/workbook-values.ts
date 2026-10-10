import type {
  ExcelColumnMapping,
  ExcelNormalizedRow,
  ExcelRowData,
  ExcelSheetData,
  ExcelTableSelection,
  ExcelWorkbookSourceData,
} from './workbook-types';
export const ACCOUNT_ALIASES = [
  'account',
  'accountcode',
  'accountnumber',
  'code',
  'acct',
  'glaccount',
];
export const FINANCIAL_ROW_ALIASES = [
  'financialrow',
  'financialline',
  'financialstatementrow',
  'rowlabel',
  'line',
  'lineitem',
];
export const LABEL_ALIASES = [
  'label',
  'name',
  'accountlabel',
  'accountname',
  ...FINANCIAL_ROW_ALIASES,
];
export const DESCRIPTION_ALIASES = [
  'description',
  'memo',
  'notes',
  'details',
  'jrnlentryitemtext',
  ...FINANCIAL_ROW_ALIASES,
];
export const AMOUNT_ALIASES = ['amount', 'value', 'balance', 'amountincccrcy'];
export const CURRENCY_ALIASES = ['currency', 'curr'];
export const DEBIT_ALIASES = ['debit', 'debits'];
export const CREDIT_ALIASES = ['credit', 'credits'];
export const ACCOUNT_TYPE_ALIASES = ['accounttype', 'statementtype', 'postingtype'];
// Balance-sheet account types — dropped from a trial balance, since only P&L
// (Revenue/Expense) accounts are relevant to value-extraction workflows (FAPI).
// Applied ONLY to an explicit account-type column value, never to the label.
export const BALANCE_SHEET_TYPE_REGEX = /\b(asset|liabilit|equity)/i;
export const DELIMITED_LIST_REGEX = /[,;\n|]/;
export const NUMBER_PATTERN = /-?\d+(\.\d+)?/;
export const MAX_PERSISTED_ROWS_PER_SHEET = 1000;
export const MAX_HEADER_SCAN_ROWS = 50;
export const SIGN_PREFIX_REGEX = /^[+-]/;
export const LEADING_ACCOUNT_REGEX = /^\s*([0-9]{3,})\b/;
export const PARENTHETICAL_NUMBER_REGEX = /^\(.*\)$/;
export const LETTER_REGEX = /[A-Za-zÀ-ÖØ-öø-ÿ]/;
export const DIGIT_REGEX = /\d/;
export const CURRENCY_AND_TEXT_REGEX = /[^\d.,()\-+\s]/g;
export const WHITESPACE_REGEX = /\s+/g;
export const TOTAL_ROW_REGEX =
  /^(totals?|subtotals?|grand totals?|sous-totals?|total(?:s|aux)?|totals? g[ée]n[ée]ra(?:l|ux))\b/i;

// Currency-code suffixes seen on trial-balance headers like "Debit (USD)".
export const CURRENCY_SUFFIX_KEYS = new Set([
  'usd',
  'cad',
  'eur',
  'gbp',
  'aud',
  'jpy',
  'chf',
  'us',
  'ca',
]);

export function normalizeKey(key: string) {
  return key
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');
}

// Match a header against an alias, tolerating a trailing currency code — so
// "Debit (USD)" matches "debit" and "Balance (USD)" matches "balance", while
// "Account Type" does NOT match "account" (remainder "type" isn't a currency).
export function headerMatchesAlias(header: string, alias: string) {
  const normalizedHeader = normalizeKey(header);
  const normalizedAlias = normalizeKey(alias);
  if (!normalizedAlias) {
    return false;
  }
  if (normalizedHeader === normalizedAlias) {
    return true;
  }
  if (normalizedHeader.startsWith(normalizedAlias)) {
    const rest = normalizedHeader.slice(normalizedAlias.length);
    return rest.length === 0 || CURRENCY_SUFFIX_KEYS.has(rest);
  }
  return false;
}

export function normalizeSheetToken(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function columnName(index: number) {
  let value = '';
  let current = index + 1;
  while (current > 0) {
    const remainder = (current - 1) % 26;
    value = String.fromCharCode(65 + remainder) + value;
    current = Math.floor((current - remainder) / 26);
  }
  return value;
}

export function formatCellValue(value: unknown) {
  if (value === undefined || value === null) {
    return '';
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value);
}

export function normalizeNumericText(value: string) {
  const numericText = value.replace(CURRENCY_AND_TEXT_REGEX, '').replace(WHITESPACE_REGEX, '');
  const lastComma = numericText.lastIndexOf(',');
  const lastDot = numericText.lastIndexOf('.');

  if (lastComma >= 0 && lastDot >= 0) {
    return lastComma > lastDot
      ? numericText.replaceAll('.', '').replace(',', '.')
      : numericText.replaceAll(',', '');
  }

  if (lastComma < 0) {
    return numericText;
  }

  const decimalDigits = numericText.length - lastComma - 1;
  return decimalDigits > 0 && decimalDigits <= 2
    ? numericText.replace(',', '.')
    : numericText.replaceAll(',', '');
}

export function parseFallbackNumber(trimmed: string, negativeByParentheses: boolean) {
  const match = trimmed.replaceAll(',', '').match(NUMBER_PATTERN);
  if (!match) {
    return null;
  }

  const fallback = Number(match[0]);
  if (!Number.isFinite(fallback)) {
    return null;
  }

  return negativeByParentheses ? -fallback : fallback;
}

export function parseNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== 'string') {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const negativeByParentheses = PARENTHETICAL_NUMBER_REGEX.test(trimmed);
  const numericText = trimmed.replace(CURRENCY_AND_TEXT_REGEX, '').replace(WHITESPACE_REGEX, '');
  const normalized = normalizeNumericText(trimmed);
  const parsed = Number(normalized);
  if (!Number.isFinite(parsed)) {
    return parseFallbackNumber(trimmed, negativeByParentheses);
  }

  if (!DIGIT_REGEX.test(numericText)) {
    return null;
  }

  return negativeByParentheses ? -parsed : parsed;
}

export { parseNumber as parseExcelNumber };

export function getRecordValue(record: Record<string, unknown>, columnNameValue?: string) {
  return columnNameValue ? record[columnNameValue] : undefined;
}

export function findAlias(headers: string[], aliases: string[]) {
  return headers.find((header) => aliases.some((alias) => headerMatchesAlias(header, alias)));
}

export function detectExcelColumnMapping(headers: string[]): ExcelColumnMapping {
  return {
    account: findAlias(headers, ACCOUNT_ALIASES),
    accountType: findAlias(headers, ACCOUNT_TYPE_ALIASES),
    amount: findAlias(headers, AMOUNT_ALIASES),
    credit: findAlias(headers, CREDIT_ALIASES),
    currency: findAlias(headers, CURRENCY_ALIASES),
    debit: findAlias(headers, DEBIT_ALIASES),
    description: findAlias(headers, DESCRIPTION_ALIASES),
    label: findAlias(headers, LABEL_ALIASES),
  };
}

export function getAmount(valuesByColumn: Record<string, unknown>, mapping: ExcelColumnMapping) {
  // Trial balance: when BOTH debit and credit columns exist, the signed amount is
  // credit − debit (income → positive, expense → negative). A "Balance" column is
  // ambiguous/sign-flipped for credit accounts, so it must NOT override this.
  if (mapping.debit && mapping.credit) {
    const debit = parseNumber(getRecordValue(valuesByColumn, mapping.debit)) ?? 0;
    const credit = parseNumber(getRecordValue(valuesByColumn, mapping.credit)) ?? 0;
    return credit - debit;
  }

  const amount = parseNumber(getRecordValue(valuesByColumn, mapping.amount));
  if (amount !== null) {
    return amount;
  }

  const debit = parseNumber(getRecordValue(valuesByColumn, mapping.debit)) ?? 0;
  const credit = parseNumber(getRecordValue(valuesByColumn, mapping.credit)) ?? 0;
  return credit - debit;
}

export function hasMappedAmount(
  valuesByColumn: Record<string, unknown>,
  mapping: ExcelColumnMapping,
) {
  return [mapping.amount, mapping.debit, mapping.credit].some((column) => {
    const value = getRecordValue(valuesByColumn, column);
    return value !== undefined && String(value).trim().length > 0;
  });
}

export function inferCurrency(value: unknown, fallback = 'USD') {
  const text = String(value || '').toLowerCase();
  if (text.includes('€') || text.includes('eur') || text.includes('euro')) {
    return 'EUR';
  }
  if (text.includes('cad') || text.includes('c$')) {
    return 'CAD';
  }
  if (text.includes('usd') || text.includes('us$') || text.includes('$')) {
    return 'USD';
  }
  if (text.includes('gbp') || text.includes('£')) {
    return 'GBP';
  }
  return fallback;
}

export function detectSheetCurrency(cells: string[][]) {
  const headerText = cells.slice(0, 12).flat().map(String).join(' ');
  return inferCurrency(headerText, 'USD');
}

export function getCurrency({
  defaultCurrency,
  mapping,
  valuesByColumn,
}: {
  defaultCurrency: string;
  mapping: ExcelColumnMapping;
  valuesByColumn: Record<string, unknown>;
}) {
  const explicitCurrency = getRecordValue(valuesByColumn, mapping.currency);
  if (explicitCurrency) {
    return String(explicitCurrency);
  }
  return inferCurrency(getRecordValue(valuesByColumn, mapping.amount), defaultCurrency);
}

export function getAccountFromLabel(value: unknown) {
  const match = String(value || '').match(LEADING_ACCOUNT_REGEX);
  return match?.[1] || '';
}

export function getCellRef(rowNumber: number, columnIndex: number) {
  return `${columnName(columnIndex)}${rowNumber}`;
}

export function isLikelyLabelCell(value: unknown) {
  const text = String(value || '').trim();
  return text.length > 0 && LETTER_REGEX.test(text);
}

export function isHeaderLikeLabel(value: unknown) {
  const normalized = normalizeKey(String(value || ''));
  return (
    LABEL_ALIASES.some((alias) => normalizeKey(alias) === normalized) ||
    DESCRIPTION_ALIASES.some((alias) => normalizeKey(alias) === normalized) ||
    ACCOUNT_ALIASES.some((alias) => normalizeKey(alias) === normalized)
  );
}

export function isDebitHeader(value: unknown) {
  return DEBIT_ALIASES.some((alias) => headerMatchesAlias(String(value || ''), alias));
}

export function isCreditHeader(value: unknown) {
  return CREDIT_ALIASES.some((alias) => headerMatchesAlias(String(value || ''), alias));
}

export function normalizeExcelRow({
  defaultCurrency,
  mapping,
  rowIndex,
  rowNumber,
  sheetName,
  valuesByColumn,
  workbookId,
}: {
  defaultCurrency: string;
  mapping: ExcelColumnMapping;
  rowIndex: number;
  rowNumber: number;
  sheetName: string;
  valuesByColumn: Record<string, unknown>;
  workbookId: string;
}): ExcelNormalizedRow {
  const label =
    getRecordValue(valuesByColumn, mapping.label) ||
    getRecordValue(valuesByColumn, mapping.description) ||
    `Excel row ${rowNumber}`;
  const account = getRecordValue(valuesByColumn, mapping.account) || getAccountFromLabel(label);
  const rowId = `${normalizeSheetToken(sheetName) || 'sheet'}-row-${String(rowNumber).padStart(
    3,
    '0',
  )}`;
  const raw = { ...valuesByColumn };
  const amount = getAmount(valuesByColumn, mapping);
  const labelText = String(label);

  return {
    account: String(account || ''),
    amount,
    currency: getCurrency({ defaultCurrency, mapping, valuesByColumn }),
    description: String(getRecordValue(valuesByColumn, mapping.description) || labelText),
    label: labelText,
    metadata: {
      accountType: String(getRecordValue(valuesByColumn, mapping.accountType) || ''),
      hasMappedAmount: hasMappedAmount(valuesByColumn, mapping),
      isBalanceSheetRow: BALANCE_SHEET_TYPE_REGEX.test(
        String(getRecordValue(valuesByColumn, mapping.accountType) || ''),
      ),
      isTotalRow: TOTAL_ROW_REGEX.test(labelText.trim()),
      raw,
      rowIndex,
      rowNumber,
      sheetName,
      workbookId,
    },
    raw,
    rowId,
    rowNumber,
  };
}

export function normalizeExtractedExcelRow({
  amount,
  amountColumnIndex,
  credit,
  creditColumnIndex,
  debit,
  debitColumnIndex,
  defaultCurrency,
  extractionMode,
  label,
  labelColumnIndex,
  rawRow,
  rowIndex,
  rowNumber,
  sheetName,
  workbookId,
}: {
  amount: number;
  amountColumnIndex?: number;
  credit?: number | null;
  creditColumnIndex?: number;
  debit?: number | null;
  debitColumnIndex?: number;
  defaultCurrency: string;
  extractionMode: 'adjacent_amount' | 'debit_credit';
  label: string;
  labelColumnIndex: number;
  rawRow: string[];
  rowIndex: number;
  rowNumber: number;
  sheetName: string;
  workbookId: string;
}): ExcelNormalizedRow {
  const amountCell = amountColumnIndex === undefined ? undefined : rawRow[amountColumnIndex] || '';
  const debitCell = debitColumnIndex === undefined ? undefined : rawRow[debitColumnIndex] || '';
  const creditCell = creditColumnIndex === undefined ? undefined : rawRow[creditColumnIndex] || '';
  const raw: Record<string, unknown> = {
    amount,
    amountCell,
    credit,
    creditCell,
    debit,
    debitCell,
    extractedLabel: label,
    label,
  };
  const rowId = `${normalizeSheetToken(sheetName) || 'sheet'}-row-${String(rowNumber).padStart(
    3,
    '0',
  )}-${columnName(labelColumnIndex).toLowerCase()}`;

  return {
    account: getAccountFromLabel(label),
    amount,
    currency: inferCurrency(String(amountCell || debitCell || creditCell || ''), defaultCurrency),
    description: label,
    label,
    metadata: {
      amountCellRef:
        amountColumnIndex === undefined ? undefined : getCellRef(rowNumber, amountColumnIndex),
      creditCellRef:
        creditColumnIndex === undefined ? undefined : getCellRef(rowNumber, creditColumnIndex),
      debitCellRef:
        debitColumnIndex === undefined ? undefined : getCellRef(rowNumber, debitColumnIndex),
      extractionMode,
      hasMappedAmount: true,
      isTotalRow: TOTAL_ROW_REGEX.test(label.trim()),
      labelCellRef: getCellRef(rowNumber, labelColumnIndex),
      rawRow,
      rowIndex,
      rowNumber,
      sheetName,
      workbookId,
    },
    raw,
    rowId,
    rowNumber,
  };
}

export function getBestLabelIndex(row: string[], maxColumnIndex: number) {
  for (let index = Math.min(maxColumnIndex - 1, row.length - 1); index >= 0; index -= 1) {
    const value = row[index];
    if (isLikelyLabelCell(value) && !isHeaderLikeLabel(value)) {
      return index;
    }
  }
  return -1;
}

export function detectLooseDebitCreditLayout(cells: string[][]) {
  const scanRows = Math.min(cells.length, MAX_HEADER_SCAN_ROWS);

  for (let rowIndex = 0; rowIndex < scanRows; rowIndex += 1) {
    const row = cells[rowIndex] || [];
    const debitIndex = row.findIndex(isDebitHeader);
    const creditIndex = row.findIndex(isCreditHeader);
    if (debitIndex >= 0 || creditIndex >= 0) {
      return {
        creditIndex,
        debitIndex,
        headerRowNumber: rowIndex + 1,
      };
    }
  }

  return null;
}

export function normalizeDebitCreditExtractedRow({
  amountStartIndex,
  defaultCurrency,
  includeTotalRows,
  layout,
  row,
  rowNumber,
  rowOffset,
  sheetName,
  workbookId,
}: {
  amountStartIndex: number;
  defaultCurrency: string;
  includeTotalRows: boolean;
  layout: NonNullable<ReturnType<typeof detectLooseDebitCreditLayout>>;
  row: string[];
  rowNumber: number;
  rowOffset: number;
  sheetName: string;
  workbookId: string;
}) {
  const debit = layout.debitIndex >= 0 ? parseNumber(row[layout.debitIndex]) : null;
  const credit = layout.creditIndex >= 0 ? parseNumber(row[layout.creditIndex]) : null;
  if (debit === null && credit === null) {
    return null;
  }

  const labelIndex = getBestLabelIndex(row, amountStartIndex);
  if (labelIndex < 0) {
    return null;
  }

  const label = String(row[labelIndex] || '').trim();
  if (!(includeTotalRows || !TOTAL_ROW_REGEX.test(label))) {
    return null;
  }

  return normalizeExtractedExcelRow({
    amount: (credit ?? 0) - (debit ?? 0),
    credit,
    creditColumnIndex: layout.creditIndex >= 0 ? layout.creditIndex : undefined,
    debit,
    debitColumnIndex: layout.debitIndex >= 0 ? layout.debitIndex : undefined,
    defaultCurrency,
    extractionMode: 'debit_credit',
    label,
    labelColumnIndex: labelIndex,
    rawRow: row,
    rowIndex: rowOffset,
    rowNumber,
    sheetName,
    workbookId,
  });
}

export function extractDebitCreditRows({
  cells,
  defaultCurrency,
  includeTotalRows,
  sheetName,
  workbookId,
}: {
  cells: string[][];
  defaultCurrency: string;
  includeTotalRows: boolean;
  sheetName: string;
  workbookId: string;
}) {
  const layout = detectLooseDebitCreditLayout(cells);
  if (!layout) {
    return [];
  }

  const amountStartIndex = Math.min(
    ...[layout.debitIndex, layout.creditIndex].filter((index) => index >= 0),
  );

  return cells
    .slice(layout.headerRowNumber)
    .map((row, rowOffset) =>
      normalizeDebitCreditExtractedRow({
        amountStartIndex,
        defaultCurrency,
        includeTotalRows,
        layout,
        row,
        rowNumber: layout.headerRowNumber + rowOffset + 1,
        rowOffset,
        sheetName,
        workbookId,
      }),
    )
    .filter((row): row is ExcelNormalizedRow => Boolean(row));
}

export function extractAdjacentAmountRows({
  cells,
  defaultCurrency,
  includeTotalRows,
  sheetName,
  workbookId,
}: {
  cells: string[][];
  defaultCurrency: string;
  includeTotalRows: boolean;
  sheetName: string;
  workbookId: string;
}) {
  return cells.flatMap((row, rowIndex) => {
    const rowNumber = rowIndex + 1;
    const extractedRows: ExcelNormalizedRow[] = [];

    row.forEach((cell, columnIndex) => {
      if (!(isLikelyLabelCell(cell) && !isHeaderLikeLabel(cell))) {
        return;
      }

      const amountColumnIndex = columnIndex + 1;
      const amount = parseNumber(row[amountColumnIndex]);
      if (amount === null) {
        return;
      }

      const label = String(cell || '').trim();
      if (!(includeTotalRows || !TOTAL_ROW_REGEX.test(label))) {
        return;
      }

      extractedRows.push(
        normalizeExtractedExcelRow({
          amount,
          amountColumnIndex,
          defaultCurrency,
          extractionMode: 'adjacent_amount',
          label,
          labelColumnIndex: columnIndex,
          rawRow: row,
          rowIndex,
          rowNumber,
          sheetName,
          workbookId,
        }),
      );
    });

    return extractedRows;
  });
}

export function getLooseExtractedRows({
  defaultCurrency,
  includeTotalRows,
  sheet,
  workbook,
}: {
  defaultCurrency: string;
  includeTotalRows: boolean;
  sheet: ExcelSheetData;
  workbook: ExcelWorkbookSourceData;
}) {
  const debitCreditRows = extractDebitCreditRows({
    cells: sheet.cells,
    defaultCurrency,
    includeTotalRows,
    sheetName: sheet.sheetName,
    workbookId: workbook.workbookId,
  });
  const debitCreditLabelCells = new Set(
    debitCreditRows.map((row) => (row.metadata as Record<string, unknown>).labelCellRef),
  );
  const adjacentRows = extractAdjacentAmountRows({
    cells: sheet.cells,
    defaultCurrency,
    includeTotalRows,
    sheetName: sheet.sheetName,
    workbookId: workbook.workbookId,
  }).filter(
    (row) => !debitCreditLabelCells.has((row.metadata as Record<string, unknown>).labelCellRef),
  );
  const rowsByKey = new Map<string, ExcelNormalizedRow>();

  for (const row of [...debitCreditRows, ...adjacentRows]) {
    const metadata = row.metadata as Record<string, unknown>;
    const key = `${row.rowNumber}:${metadata.labelCellRef}:${row.amount}`;
    rowsByKey.set(key, row);
  }

  return [...rowsByKey.values()].slice(0, sheet.persistedRowLimit);
}

export function shouldUseLooseExtraction({
  fallbackRows,
  mapping,
  tableRows,
}: {
  fallbackRows: ExcelNormalizedRow[];
  mapping: ExcelColumnMapping;
  tableRows: ExcelNormalizedRow[];
}) {
  if (fallbackRows.length === 0) {
    return false;
  }

  const hasTableLabel = Boolean(mapping.account || mapping.description || mapping.label);
  const hasTableAmount = Boolean(mapping.amount || mapping.debit || mapping.credit);
  if (!(hasTableLabel && hasTableAmount)) {
    return true;
  }

  if (tableRows.length === 0) {
    return true;
  }

  const generatedLabelRows = tableRows.filter((row) => row.label.startsWith('Excel row ')).length;
  return generatedLabelRows > tableRows.length / 2;
}
