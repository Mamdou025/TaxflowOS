import { hasExcelSourceEvidence as hasConfiguredExcelSourceEvidence } from '@/shared/workflow-engine/domain/workflow/source-rules';
import {
  parseExcelWorkbookFile as parseWorkbook,
  buildExcelSourceConfigPatch,
  type ExcelWorkbookSourceData,
  type ExcelSheetData,
  type WorkbookFile,
} from '@workspace/source-connectors/workbook';
import {
  normalizeKey,
  parseNumber,
  DELIMITED_LIST_REGEX,
  SIGN_PREFIX_REGEX,
} from '@workspace/source-connectors/workbook-values';
export * from '@workspace/source-connectors/workbook';
export function hasExcelSourceEvidence(config: Record<string, unknown>) {
  return hasConfiguredExcelSourceEvidence(config);
}
export async function parseExcelWorkbookFile(
  file: WorkbookFile,
  options: { sheetName?: string; rowLimit?: number } = {},
) {
  return parseWorkbook(
    file,
    async (bytes) => {
      const XLSX = await import('xlsx');
      const workbook = XLSX.read(bytes, { cellDates: true, type: 'array' });
      return workbook.SheetNames.map((name) => ({
        name,
        hidden: Boolean(workbook.Workbook?.Sheets?.find((sheet) => sheet.name === name)?.Hidden),
        cells: XLSX.utils.sheet_to_json<unknown[]>(workbook.Sheets[name], {
          blankrows: true,
          defval: '',
          header: 1,
          raw: false,
          range: 0,
        }),
      }));
    },
    options,
  );
}
const KEYWORD_RULE_SHEET_NAMES = ['Keyword Rules', 'Keyword Rulebook'];
const AGGREGATION_RULE_SHEET_NAMES = [
  'Aggregation Rules',
  'Aggregation Rulebook',
  'Calculation Rules',
];
const FAPI_INPUT_SHEET_NAMES = ['FAPI Inputs', 'Inputs'];
const EXPECTED_RESULT_SHEET_NAMES = ['Expected Results', 'Expected'];
const TRIAL_BALANCE_SHEET_NAMES = ['Trial Balance', 'TrialBalance', 'TB'];

type WorkbookSheetImportPatch = {
  aggregationRules: Record<string, unknown>[];
  excelSourcePatch: Record<string, unknown>;
  expectedResults: Record<string, number>;
  fapiInputs: Record<string, unknown>;
  importedSheets: Record<string, string | null>;
  keywordRules: Record<string, unknown>[];
};

function getRecordValueByAliases(record: Record<string, unknown>, aliases: string[]) {
  const normalizedAliases = new Set(aliases.map(normalizeKey));
  const entry = Object.entries(record).find(([key]) => normalizedAliases.has(normalizeKey(key)));
  return entry?.[1];
}

function stringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
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
  if (typeof value !== 'string') {
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
  if (typeof value !== 'string' || !value.trim().startsWith('[')) {
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
  return value.replace(/[_-]/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function parseMatchModeValue(value: unknown) {
  const normalized = normalizeKey(String(value || 'contains'));
  if (normalized === 'exact') {
    return 'exact';
  }
  if (normalized === 'startswith') {
    return 'starts_with';
  }
  return 'contains';
}

function parseNodeTypeValue(value: unknown) {
  const normalized = normalizeKey(String(value || 'group'));
  if (normalized === 'category' || normalized === 'categorytotal') {
    return 'category_total';
  }
  if (normalized === 'final' || normalized === 'finalresult') {
    return 'final_result';
  }
  if (normalized === 'constant' || normalized === 'formula' || normalized === 'group') {
    return normalized;
  }
  return 'group';
}

function parseOperationValue(value: unknown) {
  const normalized = normalizeKey(String(value || 'sum'));
  const operationByToken: Record<string, string> = {
    add: 'add',
    divide: 'divide',
    maxsubtractzero: 'max_subtract_zero',
    minmultiplycap: 'min_multiply_cap',
    multiply: 'multiply',
    passthrough: 'pass_through',
    subtract: 'subtract',
    sum: 'sum',
    sumabs: 'sum_abs',
  };
  return operationByToken[normalized] || 'sum';
}

function parseOperandToken(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return { refType: 'constant', value };
  }
  if (typeof value !== 'string') {
    return null;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const numericValue = Number(trimmed);
  if (Number.isFinite(numericValue)) {
    return { refType: 'constant', value: numericValue };
  }
  const sign = trimmed.startsWith('-') ? -1 : 1;
  const unsigned = trimmed.replace(SIGN_PREFIX_REGEX, '').trim();
  const [prefix, ...rest] = unsigned.split(':');
  const refId = rest.length > 0 ? rest.join(':').trim() : unsigned;
  const normalizedPrefix = rest.length > 0 ? normalizeKey(prefix) : 'node';
  if (normalizedPrefix === 'category') {
    return { refId, refType: 'category', sign };
  }
  if (normalizedPrefix === 'input' || normalizedPrefix === 'fapi') {
    return { refId, refType: 'input', sign };
  }
  if (normalizedPrefix === 'constant' || normalizedPrefix === 'value') {
    return { refType: 'constant', sign, value: Number(refId) || 0 };
  }
  return { refId, refType: 'node', sign };
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

export function findExcelSheetByName(workbook: ExcelWorkbookSourceData, candidates: string[]) {
  const candidateSet = new Set(candidates.map(normalizeKey));
  return workbook.sheets.find((sheet) => candidateSet.has(normalizeKey(sheet.sheetName))) || null;
}

export function parseKeywordRulesSheet(sheet: ExcelSheetData | null) {
  return sheetRecords(sheet).flatMap((record, index) => {
    const categoryId = stringValue(
      getRecordValueByAliases(record, ['categoryId', 'category', 'target', 'subsectionId']),
    );
    const keywords = parseDelimitedList(
      getRecordValueByAliases(record, ['keywords', 'keyword', 'contains', 'containsKeywords']),
    );
    const exactKeywords = parseDelimitedList(
      getRecordValueByAliases(record, ['exact', 'exactKeywords']),
    );
    const containsKeywords = parseDelimitedList(
      getRecordValueByAliases(record, ['contains', 'containsKeywords']),
    );
    const excludeKeywords = parseDelimitedList(
      getRecordValueByAliases(record, ['exclude', 'excludeKeywords', 'exclusions']),
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
          stringValue(getRecordValueByAliases(record, ['categoryLabel', 'label', 'name'])) ||
          humanizeId(categoryId),
        confidence: parseSheetNumber(getRecordValueByAliases(record, ['confidence'])) ?? 0.85,
        containsKeywords: containsKeywords.length > 0 ? containsKeywords : undefined,
        description: stringValue(getRecordValueByAliases(record, ['description', 'notes'])),
        exactKeywords: exactKeywords.length > 0 ? exactKeywords : undefined,
        excludeKeywords: excludeKeywords.length > 0 ? excludeKeywords : undefined,
        keywords: allKeywords,
        matchMode: parseMatchModeValue(getRecordValueByAliases(record, ['matchMode', 'mode'])),
        priority: parseSheetNumber(getRecordValueByAliases(record, ['priority', 'order'])),
        ruleId:
          stringValue(getRecordValueByAliases(record, ['ruleId', 'id'])) ||
          `keyword-rule-${index + 1}`,
        suggestedLine: stringValue(getRecordValueByAliases(record, ['suggestedLine', 'line'])),
        suggestedSection: stringValue(
          getRecordValueByAliases(record, ['suggestedSection', 'section']),
        ),
        suggestedSubsection: stringValue(
          getRecordValueByAliases(record, ['suggestedSubsection', 'subsection']),
        ),
      },
    ];
  });
}

export function parseAggregationRulesSheet(sheet: ExcelSheetData | null) {
  return sheetRecords(sheet).flatMap((record, index) => {
    const nodeId = stringValue(getRecordValueByAliases(record, ['nodeId', 'node id', 'id']));
    if (!nodeId) {
      return [];
    }

    return [
      {
        children: parseDelimitedList(getRecordValueByAliases(record, ['children', 'childNodes'])),
        description: stringValue(getRecordValueByAliases(record, ['description', 'notes'])),
        formulaExpression: stringValue(
          getRecordValueByAliases(record, ['formulaExpression', 'expression', 'formula']),
        ),
        includeCategoryIds: parseDelimitedList(
          getRecordValueByAliases(record, [
            'includeCategoryIds',
            'includeCategories',
            'categoryIds',
            'categories',
          ]),
        ),
        label:
          stringValue(getRecordValueByAliases(record, ['label', 'name'])) || humanizeId(nodeId),
        nodeId,
        nodeType: parseNodeTypeValue(getRecordValueByAliases(record, ['nodeType', 'type'])),
        operands: parseOperandsValue(getRecordValueByAliases(record, ['operands', 'terms'])),
        operation: parseOperationValue(getRecordValueByAliases(record, ['operation', 'operator'])),
        order: parseSheetNumber(getRecordValueByAliases(record, ['order'])) ?? (index + 1) * 10,
        outputRole: stringValue(getRecordValueByAliases(record, ['outputRole', 'output role'])),
        resultName: stringValue(getRecordValueByAliases(record, ['resultName', 'result', 'line'])),
        value: parseSheetNumber(getRecordValueByAliases(record, ['value'])),
      },
    ];
  });
}

function normalizeInputName(value: string) {
  const normalized = normalizeKey(value);
  const aliasByName: Record<string, string> = {
    documentcurrency: 'documentCurrency',
    exchangerate: 'overrideRate',
    fapiyear: 'fapiYear',
    fat: 'fatPaid',
    fatpaid: 'fatPaid',
    fxoverride: 'overrideRate',
    fxrate: 'overrideRate',
    inclusionrate: 'inclusionRate',
    reportingcurrency: 'reportingCurrency',
    rtf: 'rtf',
    rtfrate: 'rtf',
    sourcecurrency: 'documentCurrency',
    targetcurrency: 'reportingCurrency',
    year: 'fapiYear',
  };
  return aliasByName[normalized] || value;
}

function parseKeyValueSheet(sheet: ExcelSheetData | null) {
  const values: Record<string, unknown> = {};
  for (const record of sheetRecords(sheet)) {
    const key =
      stringValue(getRecordValueByAliases(record, ['key', 'name', 'input', 'field'])) ||
      stringValue(Object.values(record)[0]);
    const value =
      getRecordValueByAliases(record, ['value', 'amount', 'rate']) ?? Object.values(record)[1];
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
      stringValue(getRecordValueByAliases(record, ['resultName', 'line', 'name', 'key'])) ||
      stringValue(Object.values(record)[0]);
    const value =
      parseSheetNumber(getRecordValueByAliases(record, ['expected', 'value', 'amount'])) ??
      parseSheetNumber(Object.values(record)[1]);
    if (resultName && value !== undefined) {
      expectedResults[resultName] = value;
    }
  }
  return expectedResults;
}

export function buildFapiWorkbookImportPatch(
  workbook: ExcelWorkbookSourceData,
  existingExcelConfig: Record<string, unknown> = {},
): WorkbookSheetImportPatch {
  const trialBalanceSheet =
    findExcelSheetByName(workbook, TRIAL_BALANCE_SHEET_NAMES) || workbook.sheets[0];
  const keywordRulesSheet = findExcelSheetByName(workbook, KEYWORD_RULE_SHEET_NAMES);
  const aggregationRulesSheet = findExcelSheetByName(workbook, AGGREGATION_RULE_SHEET_NAMES);
  const fapiInputsSheet = findExcelSheetByName(workbook, FAPI_INPUT_SHEET_NAMES);
  const expectedResultsSheet = findExcelSheetByName(workbook, EXPECTED_RESULT_SHEET_NAMES);
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
  if (typeof size !== 'number') {
    return 'unknown';
  }
  if (size < 1024) {
    return `${size} B`;
  }
  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
