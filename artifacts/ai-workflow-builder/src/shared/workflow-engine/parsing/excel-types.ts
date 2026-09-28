export type ExcelColumnMapping = {
  account?: string;
  label?: string;
  description?: string;
  amount?: string;
  currency?: string;
  debit?: string;
  credit?: string;
  accountType?: string;
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
  hidden?: boolean;
  totalRowCount?: number;
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
