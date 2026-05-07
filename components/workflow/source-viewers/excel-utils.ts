"use client";

import { hasExcelSourceEvidence as hasConfiguredExcelSourceEvidence } from "@/src/domain/workflow/source-rules";

export type ExcelColumnMapping = {
  account?: string;
  label?: string;
  description?: string;
  amount?: string;
  currency?: string;
  debit?: string;
  credit?: string;
};

export type ExcelNormalizedRow = {
  rowId: string;
  rowNumber: number;
  account: string;
  label: string;
  description: string;
  amount: number;
  currency: string;
  raw: Record<string, unknown>;
  metadata: Record<string, unknown>;
};

export type ExcelRowData = {
  rowId: string;
  rowNumber: number;
  valuesByColumn: Record<string, unknown>;
  normalized: ExcelNormalizedRow;
  raw: Record<string, unknown>;
};

export type ExcelSheetData = {
  sheetName: string;
  rowCount: number;
  columnCount: number;
  headers: string[];
  detectedHeaderRowNumber: number;
  detectedFirstDataRowNumber: number;
  rows: ExcelRowData[];
  cells: string[][];
  inferredRange: string;
  persistedRowLimit: number;
  truncated: boolean;
};

export type ExcelTableSelection = {
  columnCount: number;
  firstDataRowNumber: number;
  headerRowNumber: number;
  headers: string[];
  inferredRange: string;
};

export type ExcelWorkbookSourceData = {
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  workbookId: string;
  sheets: ExcelSheetData[];
};

const ACCOUNT_ALIASES = [
  "account",
  "accountcode",
  "accountnumber",
  "code",
  "acct",
];
const FINANCIAL_ROW_ALIASES = [
  "financialrow",
  "financialline",
  "financialstatementrow",
  "rowlabel",
  "line",
  "lineitem",
];
const LABEL_ALIASES = [
  "label",
  "name",
  "accountlabel",
  "accountname",
  ...FINANCIAL_ROW_ALIASES,
];
const DESCRIPTION_ALIASES = [
  "description",
  "memo",
  "notes",
  "details",
  ...FINANCIAL_ROW_ALIASES,
];
const AMOUNT_ALIASES = ["amount", "value", "balance"];
const CURRENCY_ALIASES = ["currency", "curr"];
const DEBIT_ALIASES = ["debit", "debits"];
const CREDIT_ALIASES = ["credit", "credits"];
const DELIMITED_LIST_REGEX = /[,;\n|]/;
const NUMBER_PATTERN = /-?\d+(\.\d+)?/;
const MAX_PERSISTED_ROWS_PER_SHEET = 1000;
const MAX_HEADER_SCAN_ROWS = 50;
const SIGN_PREFIX_REGEX = /^[+-]/;
const LEADING_ACCOUNT_REGEX = /^\s*([0-9]{3,})\b/;
const PARENTHETICAL_NUMBER_REGEX = /^\(.*\)$/;
const LETTER_REGEX = /[A-Za-zÀ-ÖØ-öø-ÿ]/;
const DIGIT_REGEX = /\d/;
const CURRENCY_AND_TEXT_REGEX = /[^\d.,()\-+\s]/g;
const WHITESPACE_REGEX = /\s+/g;
const TOTAL_ROW_REGEX =
  /^(total|subtotal|grand total|sous-total|total general|total général)\b/i;

function normalizeKey(key: string) {
  return key
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function normalizeSheetToken(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function columnName(index: number) {
  let value = "";
  let current = index + 1;
  while (current > 0) {
    const remainder = (current - 1) % 26;
    value = String.fromCharCode(65 + remainder) + value;
    current = Math.floor((current - remainder) / 26);
  }
  return value;
}

function formatCellValue(value: unknown) {
  if (value === undefined || value === null) {
    return "";
  }
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }
  return String(value);
}

function normalizeNumericText(value: string) {
  const numericText = value
    .replace(CURRENCY_AND_TEXT_REGEX, "")
    .replace(WHITESPACE_REGEX, "");
  const lastComma = numericText.lastIndexOf(",");
  const lastDot = numericText.lastIndexOf(".");

  if (lastComma >= 0 && lastDot >= 0) {
    return lastComma > lastDot
      ? numericText.replaceAll(".", "").replace(",", ".")
      : numericText.replaceAll(",", "");
  }

  if (lastComma < 0) {
    return numericText;
  }

  const decimalDigits = numericText.length - lastComma - 1;
  return decimalDigits > 0 && decimalDigits <= 2
    ? numericText.replace(",", ".")
    : numericText.replaceAll(",", "");
}

function parseFallbackNumber(trimmed: string, negativeByParentheses: boolean) {
  const match = trimmed.replaceAll(",", "").match(NUMBER_PATTERN);
  if (!match) {
    return null;
  }

  const fallback = Number(match[0]);
  if (!Number.isFinite(fallback)) {
    return null;
  }

  return negativeByParentheses ? -fallback : fallback;
}

function parseNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const negativeByParentheses = PARENTHETICAL_NUMBER_REGEX.test(trimmed);
  const numericText = trimmed
    .replace(CURRENCY_AND_TEXT_REGEX, "")
    .replace(WHITESPACE_REGEX, "");
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

function getRecordValue(
  record: Record<string, unknown>,
  columnNameValue?: string
) {
  return columnNameValue ? record[columnNameValue] : undefined;
}

function findAlias(headers: string[], aliases: string[]) {
  const normalizedAliases = new Set(aliases.map(normalizeKey));
  return headers.find((header) => normalizedAliases.has(normalizeKey(header)));
}

export function detectExcelColumnMapping(
  headers: string[]
): ExcelColumnMapping {
  return {
    account: findAlias(headers, ACCOUNT_ALIASES),
    amount: findAlias(headers, AMOUNT_ALIASES),
    credit: findAlias(headers, CREDIT_ALIASES),
    currency: findAlias(headers, CURRENCY_ALIASES),
    debit: findAlias(headers, DEBIT_ALIASES),
    description: findAlias(headers, DESCRIPTION_ALIASES),
    label: findAlias(headers, LABEL_ALIASES),
  };
}

function getAmount(
  valuesByColumn: Record<string, unknown>,
  mapping: ExcelColumnMapping
) {
  const amount = parseNumber(getRecordValue(valuesByColumn, mapping.amount));
  if (amount !== null) {
    return amount;
  }

  const debit = parseNumber(getRecordValue(valuesByColumn, mapping.debit)) ?? 0;
  const credit =
    parseNumber(getRecordValue(valuesByColumn, mapping.credit)) ?? 0;
  return credit - debit;
}

function hasMappedAmount(
  valuesByColumn: Record<string, unknown>,
  mapping: ExcelColumnMapping
) {
  return [mapping.amount, mapping.debit, mapping.credit].some((column) => {
    const value = getRecordValue(valuesByColumn, column);
    return value !== undefined && String(value).trim().length > 0;
  });
}

function inferCurrency(value: unknown, fallback = "USD") {
  const text = String(value || "").toLowerCase();
  if (text.includes("€") || text.includes("eur") || text.includes("euro")) {
    return "EUR";
  }
  if (text.includes("cad") || text.includes("c$")) {
    return "CAD";
  }
  if (text.includes("usd") || text.includes("us$") || text.includes("$")) {
    return "USD";
  }
  if (text.includes("gbp") || text.includes("£")) {
    return "GBP";
  }
  return fallback;
}

function detectSheetCurrency(cells: string[][]) {
  const headerText = cells.slice(0, 12).flat().map(String).join(" ");
  return inferCurrency(headerText, "USD");
}

function getCurrency({
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
  return inferCurrency(
    getRecordValue(valuesByColumn, mapping.amount),
    defaultCurrency
  );
}

function getAccountFromLabel(value: unknown) {
  const match = String(value || "").match(LEADING_ACCOUNT_REGEX);
  return match?.[1] || "";
}

function getCellRef(rowNumber: number, columnIndex: number) {
  return `${columnName(columnIndex)}${rowNumber}`;
}

function isLikelyLabelCell(value: unknown) {
  const text = String(value || "").trim();
  return text.length > 0 && LETTER_REGEX.test(text);
}

function isHeaderLikeLabel(value: unknown) {
  const normalized = normalizeKey(String(value || ""));
  return (
    LABEL_ALIASES.some((alias) => normalizeKey(alias) === normalized) ||
    DESCRIPTION_ALIASES.some((alias) => normalizeKey(alias) === normalized) ||
    ACCOUNT_ALIASES.some((alias) => normalizeKey(alias) === normalized)
  );
}

function isDebitHeader(value: unknown) {
  const normalized = normalizeKey(String(value || ""));
  return DEBIT_ALIASES.some((alias) => normalizeKey(alias) === normalized);
}

function isCreditHeader(value: unknown) {
  const normalized = normalizeKey(String(value || ""));
  return CREDIT_ALIASES.some((alias) => normalizeKey(alias) === normalized);
}

function normalizeExcelRow({
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
  const account =
    getRecordValue(valuesByColumn, mapping.account) ||
    getAccountFromLabel(label);
  const rowId = `${normalizeSheetToken(sheetName) || "sheet"}-row-${String(
    rowNumber
  ).padStart(3, "0")}`;
  const raw = { ...valuesByColumn };
  const amount = getAmount(valuesByColumn, mapping);
  const labelText = String(label);

  return {
    account: String(account || ""),
    amount,
    currency: getCurrency({ defaultCurrency, mapping, valuesByColumn }),
    description: String(
      getRecordValue(valuesByColumn, mapping.description) || labelText
    ),
    label: labelText,
    metadata: {
      hasMappedAmount: hasMappedAmount(valuesByColumn, mapping),
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

function normalizeExtractedExcelRow({
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
  extractionMode: "adjacent_amount" | "debit_credit";
  label: string;
  labelColumnIndex: number;
  rawRow: string[];
  rowIndex: number;
  rowNumber: number;
  sheetName: string;
  workbookId: string;
}): ExcelNormalizedRow {
  const amountCell =
    amountColumnIndex === undefined
      ? undefined
      : rawRow[amountColumnIndex] || "";
  const debitCell =
    debitColumnIndex === undefined ? undefined : rawRow[debitColumnIndex] || "";
  const creditCell =
    creditColumnIndex === undefined
      ? undefined
      : rawRow[creditColumnIndex] || "";
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
  const rowId = `${normalizeSheetToken(sheetName) || "sheet"}-row-${String(
    rowNumber
  ).padStart(3, "0")}-${columnName(labelColumnIndex).toLowerCase()}`;

  return {
    account: getAccountFromLabel(label),
    amount,
    currency: inferCurrency(
      String(amountCell || debitCell || creditCell || ""),
      defaultCurrency
    ),
    description: label,
    label,
    metadata: {
      amountCellRef:
        amountColumnIndex === undefined
          ? undefined
          : getCellRef(rowNumber, amountColumnIndex),
      creditCellRef:
        creditColumnIndex === undefined
          ? undefined
          : getCellRef(rowNumber, creditColumnIndex),
      debitCellRef:
        debitColumnIndex === undefined
          ? undefined
          : getCellRef(rowNumber, debitColumnIndex),
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

function getBestLabelIndex(row: string[], maxColumnIndex: number) {
  for (
    let index = Math.min(maxColumnIndex - 1, row.length - 1);
    index >= 0;
    index -= 1
  ) {
    const value = row[index];
    if (isLikelyLabelCell(value) && !isHeaderLikeLabel(value)) {
      return index;
    }
  }
  return -1;
}

function detectLooseDebitCreditLayout(cells: string[][]) {
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

function normalizeDebitCreditExtractedRow({
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
  const debit =
    layout.debitIndex >= 0 ? parseNumber(row[layout.debitIndex]) : null;
  const credit =
    layout.creditIndex >= 0 ? parseNumber(row[layout.creditIndex]) : null;
  if (debit === null && credit === null) {
    return null;
  }

  const labelIndex = getBestLabelIndex(row, amountStartIndex);
  if (labelIndex < 0) {
    return null;
  }

  const label = String(row[labelIndex] || "").trim();
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
    extractionMode: "debit_credit",
    label,
    labelColumnIndex: labelIndex,
    rawRow: row,
    rowIndex: rowOffset,
    rowNumber,
    sheetName,
    workbookId,
  });
}

function extractDebitCreditRows({
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
    ...[layout.debitIndex, layout.creditIndex].filter((index) => index >= 0)
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
      })
    )
    .filter((row): row is ExcelNormalizedRow => Boolean(row));
}

function extractAdjacentAmountRows({
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

      const label = String(cell || "").trim();
      if (!(includeTotalRows || !TOTAL_ROW_REGEX.test(label))) {
        return;
      }

      extractedRows.push(
        normalizeExtractedExcelRow({
          amount,
          amountColumnIndex,
          defaultCurrency,
          extractionMode: "adjacent_amount",
          label,
          labelColumnIndex: columnIndex,
          rawRow: row,
          rowIndex,
          rowNumber,
          sheetName,
          workbookId,
        })
      );
    });

    return extractedRows;
  });
}

function getLooseExtractedRows({
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
    debitCreditRows.map(
      (row) => (row.metadata as Record<string, unknown>).labelCellRef
    )
  );
  const adjacentRows = extractAdjacentAmountRows({
    cells: sheet.cells,
    defaultCurrency,
    includeTotalRows,
    sheetName: sheet.sheetName,
    workbookId: workbook.workbookId,
  }).filter(
    (row) =>
      !debitCreditLabelCells.has(
        (row.metadata as Record<string, unknown>).labelCellRef
      )
  );
  const rowsByKey = new Map<string, ExcelNormalizedRow>();

  for (const row of [...debitCreditRows, ...adjacentRows]) {
    const metadata = row.metadata as Record<string, unknown>;
    const key = `${row.rowNumber}:${metadata.labelCellRef}:${row.amount}`;
    rowsByKey.set(key, row);
  }

  return [...rowsByKey.values()].slice(0, MAX_PERSISTED_ROWS_PER_SHEET);
}

function shouldUseLooseExtraction({
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

  const hasTableLabel = Boolean(
    mapping.account || mapping.description || mapping.label
  );
  const hasTableAmount = Boolean(
    mapping.amount || mapping.debit || mapping.credit
  );
  if (!(hasTableLabel && hasTableAmount)) {
    return true;
  }

  if (tableRows.length === 0) {
    return true;
  }

  const generatedLabelRows = tableRows.filter((row) =>
    row.label.startsWith("Excel row ")
  ).length;
  return generatedLabelRows > tableRows.length / 2;
}

function getUsedRowCount(rows: string[][]) {
  let lastUsedIndex = rows.length - 1;
  while (
    lastUsedIndex > 0 &&
    rows[lastUsedIndex].every((cell) => !String(cell).trim())
  ) {
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

function getHeadersForRow(
  cells: string[][],
  rowIndex: number,
  columnCount: number
) {
  return Array.from({ length: columnCount }, (_, index) =>
    normalizeHeader(cells[rowIndex]?.[index] || "", index)
  );
}

function getColumnIndex(headers: string[], columnNameValue?: string) {
  return columnNameValue ? headers.indexOf(columnNameValue) : -1;
}

function hasText(value: unknown) {
  return String(value || "").trim().length > 0;
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
    getColumnIndex(headers, mapping.account)
  );
  const hasAmountMapping =
    amountIndex >= 0 || debitIndex >= 0 || creditIndex >= 0;
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
      (parseNumber(row[debitIndex]) !== null ||
        parseNumber(row[creditIndex]) !== null)
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
  } = {}
): ExcelTableSelection {
  const headerRowNumber = Math.max(
    1,
    Math.min(
      Number(options.headerRowNumber || sheet.detectedHeaderRowNumber || 1),
      sheet.cells.length || 1
    )
  );
  const firstDataRowNumber = Math.max(
    headerRowNumber + 1,
    Number(
      options.firstDataRowNumber ||
        sheet.detectedFirstDataRowNumber ||
        headerRowNumber + 1
    )
  );
  const columnCount = Math.max(1, sheet.columnCount);
  const headers = getHeadersForRow(
    sheet.cells,
    headerRowNumber - 1,
    columnCount
  );
  const inferredRange = `${sheet.sheetName}!A${headerRowNumber}:${columnName(
    columnCount - 1
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
}: {
  cells: string[][];
  sheetName: string;
  workbookId: string;
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
    .slice(
      dataStartIndex,
      Math.min(rowCount, dataStartIndex + MAX_PERSISTED_ROWS_PER_SHEET)
    )
    .map((row, rowIndex) => {
      const rowNumber = dataStartIndex + rowIndex + 1;
      const valuesByColumn = Object.fromEntries(
        headers.map((header, index) => [header, row[index] || ""])
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
    .filter((row) =>
      Object.values(row.valuesByColumn).some((value) => String(value).trim())
    );
  const inferredRange = `${sheetName}!A${detectedTable.headerRowNumber}:${columnName(
    columnCount - 1
  )}${rowCount}`;

  return {
    cells: cells
      .slice(0, Math.min(rowCount, MAX_PERSISTED_ROWS_PER_SHEET + 1))
      .map((row) =>
        Array.from({ length: columnCount }, (_, index) => row[index] || "")
      ),
    columnCount,
    detectedFirstDataRowNumber: detectedTable.firstDataRowNumber,
    detectedHeaderRowNumber: detectedTable.headerRowNumber,
    headers,
    inferredRange,
    persistedRowLimit: MAX_PERSISTED_ROWS_PER_SHEET,
    rowCount: persistedRows.length,
    rows: persistedRows,
    sheetName,
    truncated: rowCount > MAX_PERSISTED_ROWS_PER_SHEET + 1,
  };
}

export async function parseExcelWorkbookFile(
  file: File
): Promise<ExcelWorkbookSourceData> {
  const extension = file.name.split(".").pop()?.toLowerCase();
  if (extension !== "xlsx" && extension !== "xls") {
    throw new Error("Upload a normal Excel workbook (.xlsx).");
  }

  const XLSX = await import("xlsx");
  const buffer = await file.arrayBuffer();
  const workbook = XLSX.read(buffer, {
    cellDates: true,
    type: "array",
  });
  const uploadedAt = new Date().toISOString();
  const workbookId = `workbook-${Date.now().toString(36)}`;
  const sheets = workbook.SheetNames.map((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
      blankrows: false,
      defval: "",
      header: 1,
      raw: false,
    });
    const cells = rows.map((row) =>
      Array.isArray(row) ? row.map(formatCellValue) : []
    );
    return createSheetData({ cells, sheetName, workbookId });
  }).filter((sheet) => sheet.columnCount > 0);

  if (sheets.length === 0) {
    throw new Error("No readable sheets were found in this workbook.");
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
    typeof workbook === "object" &&
    workbook !== null &&
    Array.isArray((workbook as ExcelWorkbookSourceData).sheets)
  ) {
    return workbook as ExcelWorkbookSourceData;
  }
  return null;
}

export function hasExcelSourceEvidence(config: Record<string, unknown>) {
  return hasConfiguredExcelSourceEvidence(config);
}

export function getExcelSheet(
  workbook: ExcelWorkbookSourceData | null,
  sheetName?: string
) {
  if (!workbook) {
    return null;
  }
  return (
    workbook.sheets.find((sheet) => sheet.sheetName === sheetName) ||
    workbook.sheets[0] ||
    null
  );
}

export function getExcelColumnMappingFromConfig(
  config: Record<string, unknown>,
  headers: string[]
): ExcelColumnMapping {
  const mapping = config.columnMapping;
  if (typeof mapping === "object" && mapping !== null) {
    return {
      ...detectExcelColumnMapping(headers),
      ...(mapping as ExcelColumnMapping),
    };
  }
  return detectExcelColumnMapping(headers);
}

export function getNormalizedRowsForSheet({
  defaultCurrency,
  firstDataRowNumber,
  headerRowNumber,
  includeRowsWithoutAmount = false,
  includeTotalRows = false,
  mapping,
  sheet,
  workbook,
}: {
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
  const currency = defaultCurrency || detectSheetCurrency(sheet.cells);
  const tableRows = sheet.cells
    .slice(
      table.firstDataRowNumber - 1,
      Math.min(
        sheet.cells.length,
        table.firstDataRowNumber - 1 + MAX_PERSISTED_ROWS_PER_SHEET
      )
    )
    .map((row, rowIndex) => {
      const rowNumber = table.firstDataRowNumber + rowIndex;
      const valuesByColumn = Object.fromEntries(
        table.headers.map((header, index) => [header, row[index] || ""])
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
        Boolean((row.metadata as Record<string, unknown>).hasMappedAmount)
    )
    .filter(
      (row) =>
        includeTotalRows ||
        !(row.metadata as Record<string, unknown>).isTotalRow
    );
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
    throw new Error("Select a readable workbook sheet.");
  }
  const table = getExcelTableSelection(sheet, {
    firstDataRowNumber:
      firstDataRowNumber ??
      (typeof existingConfig.firstDataRowNumber === "number"
        ? existingConfig.firstDataRowNumber
        : undefined),
    headerRowNumber:
      headerRowNumber ??
      (typeof existingConfig.headerRowNumber === "number"
        ? existingConfig.headerRowNumber
        : undefined),
  });
  const columnMapping = {
    ...detectExcelColumnMapping(table.headers),
    ...(mapping || {}),
  };
  const nextIncludeTotalRows =
    includeTotalRows ?? existingConfig.includeTotalRows === true;
  const nextIncludeRowsWithoutAmount =
    includeRowsWithoutAmount ??
    existingConfig.includeRowsWithoutAmount === true;
  const rows = getNormalizedRowsForSheet({
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
    outputs: "selected_rows",
    rows,
    selectedRange: range,
    selectedRowsCount: rows.length,
    selectedSheet: sheet.sheetName,
    sheets: workbook.sheets.map((item) => item.sheetName),
    sourceKind: "excel_workbook",
    sourceLocator: `local-excel://${workbook.workbookId}/${encodeURIComponent(
      sheet.sheetName
    )}/${encodeURIComponent(range)}`,
    sourceStatus: "draft",
    sourceVersion: existingConfig.sourceVersion || 1,
    toolId: "source.manual_table",
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

const KEYWORD_RULE_SHEET_NAMES = ["Keyword Rules", "Keyword Rulebook"];
const AGGREGATION_RULE_SHEET_NAMES = [
  "Aggregation Rules",
  "Aggregation Rulebook",
  "Calculation Rules",
];
const FAPI_INPUT_SHEET_NAMES = ["FAPI Inputs", "Inputs"];
const EXPECTED_RESULT_SHEET_NAMES = ["Expected Results", "Expected"];
const TRIAL_BALANCE_SHEET_NAMES = ["Trial Balance", "TrialBalance", "TB"];

type WorkbookSheetImportPatch = {
  aggregationRules: Record<string, unknown>[];
  excelSourcePatch: Record<string, unknown>;
  expectedResults: Record<string, number>;
  fapiInputs: Record<string, unknown>;
  importedSheets: Record<string, string | null>;
  keywordRules: Record<string, unknown>[];
};

function getRecordValueByAliases(
  record: Record<string, unknown>,
  aliases: string[]
) {
  const normalizedAliases = new Set(aliases.map(normalizeKey));
  const entry = Object.entries(record).find(([key]) =>
    normalizedAliases.has(normalizeKey(key))
  );
  return entry?.[1];
}

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parseSheetNumber(value: unknown) {
  return parseNumber(value) ?? undefined;
}

function parseDelimitedList(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map(String)
      .map((item) => item.trim())
      .filter(Boolean);
  }
  if (typeof value !== "string") {
    return [];
  }
  return value
    .split(DELIMITED_LIST_REGEX)
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseJsonArray(value: unknown): unknown[] | null {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value !== "string" || !value.trim().startsWith("[")) {
    return null;
  }
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function humanizeId(value: string) {
  return value
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function parseMatchModeValue(value: unknown) {
  const normalized = normalizeKey(String(value || "contains"));
  if (normalized === "exact") {
    return "exact";
  }
  if (normalized === "startswith") {
    return "starts_with";
  }
  return "contains";
}

function parseNodeTypeValue(value: unknown) {
  const normalized = normalizeKey(String(value || "group"));
  if (normalized === "category" || normalized === "categorytotal") {
    return "category_total";
  }
  if (normalized === "final" || normalized === "finalresult") {
    return "final_result";
  }
  if (
    normalized === "constant" ||
    normalized === "formula" ||
    normalized === "group"
  ) {
    return normalized;
  }
  return "group";
}

function parseOperationValue(value: unknown) {
  const normalized = normalizeKey(String(value || "sum"));
  const operationByToken: Record<string, string> = {
    add: "add",
    divide: "divide",
    maxsubtractzero: "max_subtract_zero",
    minmultiplycap: "min_multiply_cap",
    multiply: "multiply",
    passthrough: "pass_through",
    subtract: "subtract",
    sum: "sum",
    sumabs: "sum_abs",
  };
  return operationByToken[normalized] || "sum";
}

function parseOperandToken(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return { refType: "constant", value };
  }
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const numericValue = Number(trimmed);
  if (Number.isFinite(numericValue)) {
    return { refType: "constant", value: numericValue };
  }
  const sign = trimmed.startsWith("-") ? -1 : 1;
  const unsigned = trimmed.replace(SIGN_PREFIX_REGEX, "").trim();
  const [prefix, ...rest] = unsigned.split(":");
  const refId = rest.length > 0 ? rest.join(":").trim() : unsigned;
  const normalizedPrefix = rest.length > 0 ? normalizeKey(prefix) : "node";
  if (normalizedPrefix === "category") {
    return { refId, refType: "category", sign };
  }
  if (normalizedPrefix === "input" || normalizedPrefix === "fapi") {
    return { refId, refType: "input", sign };
  }
  if (normalizedPrefix === "constant" || normalizedPrefix === "value") {
    return { refType: "constant", sign, value: Number(refId) || 0 };
  }
  return { refId, refType: "node", sign };
}

function parseOperandsValue(value: unknown) {
  const jsonArray = parseJsonArray(value);
  if (jsonArray) {
    return jsonArray;
  }
  return parseDelimitedList(value).map(parseOperandToken).filter(Boolean);
}

function sheetRecords(sheet: ExcelSheetData | null) {
  if (!sheet) {
    return [];
  }
  return sheet.rows.map((row) => row.valuesByColumn);
}

export function findExcelSheetByName(
  workbook: ExcelWorkbookSourceData,
  candidates: string[]
) {
  const candidateSet = new Set(candidates.map(normalizeKey));
  return (
    workbook.sheets.find((sheet) =>
      candidateSet.has(normalizeKey(sheet.sheetName))
    ) || null
  );
}

export function parseKeywordRulesSheet(sheet: ExcelSheetData | null) {
  return sheetRecords(sheet).flatMap((record, index) => {
    const categoryId = stringValue(
      getRecordValueByAliases(record, [
        "categoryId",
        "category",
        "target",
        "subsectionId",
      ])
    );
    const keywords = parseDelimitedList(
      getRecordValueByAliases(record, [
        "keywords",
        "keyword",
        "contains",
        "containsKeywords",
      ])
    );
    const exactKeywords = parseDelimitedList(
      getRecordValueByAliases(record, ["exact", "exactKeywords"])
    );
    const containsKeywords = parseDelimitedList(
      getRecordValueByAliases(record, ["contains", "containsKeywords"])
    );
    const excludeKeywords = parseDelimitedList(
      getRecordValueByAliases(record, [
        "exclude",
        "excludeKeywords",
        "exclusions",
      ])
    );
    const allKeywords =
      exactKeywords.length + containsKeywords.length > 0
        ? [...exactKeywords, ...containsKeywords]
        : keywords;
    if (!categoryId || allKeywords.length === 0) {
      return [];
    }

    return [
      {
        categoryId,
        categoryLabel:
          stringValue(
            getRecordValueByAliases(record, ["categoryLabel", "label", "name"])
          ) || humanizeId(categoryId),
        confidence:
          parseSheetNumber(getRecordValueByAliases(record, ["confidence"])) ??
          0.85,
        containsKeywords:
          containsKeywords.length > 0 ? containsKeywords : undefined,
        description: stringValue(
          getRecordValueByAliases(record, ["description", "notes"])
        ),
        exactKeywords: exactKeywords.length > 0 ? exactKeywords : undefined,
        excludeKeywords:
          excludeKeywords.length > 0 ? excludeKeywords : undefined,
        keywords: allKeywords,
        matchMode: parseMatchModeValue(
          getRecordValueByAliases(record, ["matchMode", "mode"])
        ),
        priority: parseSheetNumber(
          getRecordValueByAliases(record, ["priority", "order"])
        ),
        ruleId:
          stringValue(getRecordValueByAliases(record, ["ruleId", "id"])) ||
          `keyword-rule-${index + 1}`,
        suggestedLine: stringValue(
          getRecordValueByAliases(record, ["suggestedLine", "line"])
        ),
        suggestedSection: stringValue(
          getRecordValueByAliases(record, ["suggestedSection", "section"])
        ),
        suggestedSubsection: stringValue(
          getRecordValueByAliases(record, ["suggestedSubsection", "subsection"])
        ),
      },
    ];
  });
}

export function parseAggregationRulesSheet(sheet: ExcelSheetData | null) {
  return sheetRecords(sheet).flatMap((record, index) => {
    const nodeId = stringValue(
      getRecordValueByAliases(record, ["nodeId", "node id", "id"])
    );
    if (!nodeId) {
      return [];
    }

    return [
      {
        children: parseDelimitedList(
          getRecordValueByAliases(record, ["children", "childNodes"])
        ),
        description: stringValue(
          getRecordValueByAliases(record, ["description", "notes"])
        ),
        formulaExpression: stringValue(
          getRecordValueByAliases(record, [
            "formulaExpression",
            "expression",
            "formula",
          ])
        ),
        includeCategoryIds: parseDelimitedList(
          getRecordValueByAliases(record, [
            "includeCategoryIds",
            "includeCategories",
            "categoryIds",
            "categories",
          ])
        ),
        label:
          stringValue(getRecordValueByAliases(record, ["label", "name"])) ||
          humanizeId(nodeId),
        nodeId,
        nodeType: parseNodeTypeValue(
          getRecordValueByAliases(record, ["nodeType", "type"])
        ),
        operands: parseOperandsValue(
          getRecordValueByAliases(record, ["operands", "terms"])
        ),
        operation: parseOperationValue(
          getRecordValueByAliases(record, ["operation", "operator"])
        ),
        order:
          parseSheetNumber(getRecordValueByAliases(record, ["order"])) ??
          (index + 1) * 10,
        outputRole: stringValue(
          getRecordValueByAliases(record, ["outputRole", "output role"])
        ),
        resultName: stringValue(
          getRecordValueByAliases(record, ["resultName", "result", "line"])
        ),
        value: parseSheetNumber(getRecordValueByAliases(record, ["value"])),
      },
    ];
  });
}

function normalizeInputName(value: string) {
  const normalized = normalizeKey(value);
  const aliasByName: Record<string, string> = {
    documentcurrency: "documentCurrency",
    exchangerate: "overrideRate",
    fapiyear: "fapiYear",
    fat: "fatPaid",
    fatpaid: "fatPaid",
    fxoverride: "overrideRate",
    fxrate: "overrideRate",
    inclusionrate: "inclusionRate",
    reportingcurrency: "reportingCurrency",
    rtf: "rtf",
    rtfrate: "rtf",
    sourcecurrency: "documentCurrency",
    targetcurrency: "reportingCurrency",
    year: "fapiYear",
  };
  return aliasByName[normalized] || value;
}

function parseKeyValueSheet(sheet: ExcelSheetData | null) {
  const values: Record<string, unknown> = {};
  for (const record of sheetRecords(sheet)) {
    const key =
      stringValue(
        getRecordValueByAliases(record, ["key", "name", "input", "field"])
      ) || stringValue(Object.values(record)[0]);
    const value =
      getRecordValueByAliases(record, ["value", "amount", "rate"]) ??
      Object.values(record)[1];
    if (key) {
      values[normalizeInputName(key)] = value;
    }
  }
  return values;
}

export function parseFapiInputsSheet(sheet: ExcelSheetData | null) {
  const keyValueInputs = parseKeyValueSheet(sheet);
  const tableInputs = Object.assign({}, ...sheetRecords(sheet));
  const source = { ...tableInputs, ...keyValueInputs };
  const result: Record<string, unknown> = { rawInputs: source };
  for (const [key, value] of Object.entries(source)) {
    const normalizedKey = normalizeInputName(key);
    const numericValue = parseSheetNumber(value);
    result[normalizedKey] = numericValue ?? value;
  }
  if (result.overrideRate !== undefined) {
    result.fxRate = result.overrideRate;
  }
  return result;
}

export function parseExpectedResultsSheet(sheet: ExcelSheetData | null) {
  const expectedResults: Record<string, number> = {};
  for (const record of sheetRecords(sheet)) {
    const resultName =
      stringValue(
        getRecordValueByAliases(record, ["resultName", "line", "name", "key"])
      ) || stringValue(Object.values(record)[0]);
    const value =
      parseSheetNumber(
        getRecordValueByAliases(record, ["expected", "value", "amount"])
      ) ?? parseSheetNumber(Object.values(record)[1]);
    if (resultName && value !== undefined) {
      expectedResults[resultName] = value;
    }
  }
  return expectedResults;
}

export function buildFapiWorkbookImportPatch(
  workbook: ExcelWorkbookSourceData,
  existingExcelConfig: Record<string, unknown> = {}
): WorkbookSheetImportPatch {
  const trialBalanceSheet =
    findExcelSheetByName(workbook, TRIAL_BALANCE_SHEET_NAMES) ||
    workbook.sheets[0];
  const keywordRulesSheet = findExcelSheetByName(
    workbook,
    KEYWORD_RULE_SHEET_NAMES
  );
  const aggregationRulesSheet = findExcelSheetByName(
    workbook,
    AGGREGATION_RULE_SHEET_NAMES
  );
  const fapiInputsSheet = findExcelSheetByName(
    workbook,
    FAPI_INPUT_SHEET_NAMES
  );
  const expectedResultsSheet = findExcelSheetByName(
    workbook,
    EXPECTED_RESULT_SHEET_NAMES
  );
  const expectedResults = parseExpectedResultsSheet(expectedResultsSheet);
  const fapiInputs = {
    ...parseFapiInputsSheet(fapiInputsSheet),
    expectedResults,
  };

  return {
    aggregationRules: parseAggregationRulesSheet(aggregationRulesSheet),
    excelSourcePatch: buildExcelSourceConfigPatch({
      existingConfig: existingExcelConfig,
      selectedSheetName: trialBalanceSheet?.sheetName,
      workbook,
    }),
    expectedResults,
    fapiInputs,
    importedSheets: {
      aggregationRules: aggregationRulesSheet?.sheetName || null,
      expectedResults: expectedResultsSheet?.sheetName || null,
      fapiInputs: fapiInputsSheet?.sheetName || null,
      keywordRules: keywordRulesSheet?.sheetName || null,
      trialBalance: trialBalanceSheet?.sheetName || null,
    },
    keywordRules: parseKeywordRulesSheet(keywordRulesSheet),
  };
}

export function formatFileSize(size?: unknown) {
  if (typeof size !== "number") {
    return "unknown";
  }
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
