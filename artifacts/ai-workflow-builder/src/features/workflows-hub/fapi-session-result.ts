import type { WorkflowSession } from '@workspace/workflow-contracts/library-types';
import type { WorkflowDefinition } from '@workspace/workflow-contracts/domain/workflow-types';
import {
  FAPI_LINES_CALC_RULES,
  FAPI_SUMMARY_CALC_RULES,
} from '@/shared/workflow-engine/templates/fapi/fapi-template';

const LINES = 'fapi-logic-lines-engine';
const SUMMARY = 'fapi-logic-summary-engine';
const INPUTS = 'fapi-source-inputs';
const referenceRules: Record<string, Record<string, unknown>[]> = {
  [LINES]: FAPI_LINES_CALC_RULES,
  [SUMMARY]: FAPI_SUMMARY_CALC_RULES,
};

// Presentation from DevReplit's FAPI worksheet. Arithmetic belongs to the saved graph.
const sections = [
  { title: 'Currency conversion', rows: [['FX', 'FX_RATE', 'Annual average FX rate']] },
  { title: 'Property income', rows: [['A', 'A', 'Property income (net of deductible expenses)']] },
  {
    title: 'Deductible expenses',
    rows: [['EXP', 'EXPENSES', 'Deductible expenses — already subtracted within line A']],
  },
  { title: 'Component B', rows: [['B', 'B', 'Gains on disposition (derived)']] },
  {
    title: 'Canadian 95(2) rules',
    rows: [['95(2)', 'COMPUTATION_95_4', 'Canadian 95(2) rules amount']],
  },
  {
    title: 'Other income components',
    rows: [
      ['A.1', 'A1', 'Debt forgiveness (× 2)'],
      ['A.2', 'A2', 'Prior-year G'],
      ['C', 'C', 'Controlled foreign affiliate income'],
    ],
  },
  {
    title: 'Advanced deductions',
    rows: [
      ['D', 'D', 'Business losses'],
      ['E', 'E', 'FACL carryforward'],
      ['F', 'F', 'Prescribed amount'],
      ['F.1', 'F1', 'Prescribed amount (F.1)'],
      ['G', 'G', 'Dividend deductions'],
      ['H', 'H', 'Partnership dividends'],
    ],
  },
  {
    title: 'FAT calculation',
    rows: [
      ['FAT', 'FAT_PAID', 'Foreign accrual tax paid'],
      ['RTF', 'RTF', 'Relevant tax factor'],
    ],
  },
] as const;

const summaryRows = [
  ['GROSS', 'Gross (property income net of expenses + gains)'],
  ['DEDUCTIONS', 'Deductions (lines D–H — excludes operating expenses)'],
  ['FAPI_BRUT', 'FAPI brut'],
  ['FAT_DEDUCTION', 'FAT deduction'],
  ['NET_FAPI', 'Net FAPI'],
] as const;

export type FapiRecordedValue = {
  key: string;
  blockId: string;
  status: 'current' | 'missing' | 'stale' | 'invalid';
  value?: number;
  formula?: string;
};

function object(value: unknown): Record<string, unknown> {
  return value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

/** Identify the saved FAPI field contract, allowing edited calculations with the same outputs. */
function currencies(definition: WorkflowDefinition) {
  const inputs = definition.blocks.find((block) => block.id === INPUTS);
  const source = inputs?.config.documentCurrency;
  const reporting = inputs?.config.reportingCurrency;
  if (typeof source !== 'string' || !/^[A-Z]{3}$/.test(source) || reporting !== 'CAD') return null;
  const required = [
    [
      LINES,
      sections
        .flatMap((section) => section.rows.map((row) => row[1]))
        .filter((key) => key !== 'FX_RATE'),
    ],
    [SUMMARY, ['FX_RATE', ...summaryRows.flatMap(([key]) => [key, `${key}_CAD`])]],
  ] as const;
  for (const [id, keys] of required) {
    const block = definition.blocks.find((item) => item.id === id);
    if (
      block?.config.toolId !== 'logic.calculation_engine' ||
      !Array.isArray(block.config.formulas)
    )
      return null;
    const formulas = block.config.formulas.map(object);
    if (keys.some((key) => !formulas.some((formula) => formula.resultKey === key))) return null;
    // Explicit units must match the prescribed headings, including rate and factor rows.
    if (
      formulas.some((formula) => {
        const key = String(formula.resultKey);
        if (
          !keys.some((requiredKey) => requiredKey === key) ||
          formula.unit === undefined ||
          formula.unit === null ||
          formula.unit === ''
        )
          return false;
        const unit =
          key === 'FX_RATE'
            ? `${source} → ${reporting}`
            : key === 'RTF'
              ? 'factor'
              : key.endsWith('_CAD')
                ? reporting
                : source;
        return formula.unit !== unit;
      })
    )
      return null;
  }
  if (
    !definition.edges.some(
      (edge) =>
        edge.sourceBlockId === LINES && edge.targetBlockId === SUMMARY && edge.status === 'active',
    )
  )
    return null;
  return { source, reporting };
}

export function supportsFapiWorksheet(definition: WorkflowDefinition) {
  return currencies(definition) !== null;
}

function savedLabel(
  definition: WorkflowDefinition,
  blockId: string,
  key: string,
  referenceLabel: string,
) {
  const block = definition.blocks.find((item) => item.id === blockId);
  const formula = Array.isArray(block?.config.formulas)
    ? block.config.formulas.map(object).find((rule) => rule.resultKey === key)
    : undefined;
  const original = referenceRules[blockId]?.find((rule) => rule.resultKey === key);
  if (!formula || !original) return key;
  // Only describe the reference arithmetic when the saved rule still declares it.
  const fields = [
    'formulaExpression',
    'operation',
    'operands',
    'roundingDigits',
    'unit',
    'label',
    'description',
  ];
  const unchanged = fields.every(
    (field) => JSON.stringify(formula[field]) === JSON.stringify(original[field]),
  );
  return unchanged
    ? referenceLabel
    : typeof formula.label === 'string' && formula.label.trim()
      ? formula.label
      : key;
}

function recorded(session: WorkflowSession, blockId: string, key: string): FapiRecordedValue {
  const result = session.results[blockId];
  const base = { key, blockId };
  if (session.stale.includes(blockId)) return { ...base, status: 'stale' };
  if (!result) return { ...base, status: 'missing' };
  if (
    result.blockId !== blockId ||
    result.toolId !== 'logic.calculation_engine' ||
    result.errors.length ||
    !['success', 'warning', 'needs_review'].includes(result.status)
  ) {
    return { ...base, status: 'invalid' };
  }
  const values = object(result.output.calculatedResults);
  if (!Object.hasOwn(values, key)) return { ...base, status: 'missing' };
  const value = values[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) return { ...base, status: 'invalid' };
  const expression = object(object(result.output.formulaTrace)[key]).expression;
  return {
    ...base,
    status: 'current',
    value,
    formula: typeof expression === 'string' ? expression : undefined,
  };
}

/** Read recorded results only: never run the template, scale FX, or substitute a default. */
export function projectFapiSessionWorksheet(
  definition: WorkflowDefinition,
  session: WorkflowSession,
) {
  const currency = currencies(definition);
  if (!currency) return null;
  return {
    ...currency,
    runId: session.id,
    version: session.version,
    revision: session.revision,
    approvedAt: session.approvedAt,
    sources: session.sources.map((source) => ({ id: source.id, name: source.name })),
    messages: [
      ...new Set(
        [LINES, SUMMARY].flatMap((id) => {
          const result = session.results[id];
          return result ? [...result.errors, ...result.warnings] : [];
        }),
      ),
    ],
    sections: sections.map((section) => ({
      title: section.title,
      rows: section.rows.map(([code, key, label]) => ({
        code,
        label: savedLabel(definition, key === 'FX_RATE' ? SUMMARY : LINES, key, label),
        unit:
          key === 'FX_RATE'
            ? `${currency.source} → CAD`
            : key === 'RTF'
              ? 'factor'
              : currency.source,
        digits: key === 'FX_RATE' ? 6 : key === 'RTF' ? 1 : 2,
        ...recorded(session, key === 'FX_RATE' ? SUMMARY : LINES, key),
      })),
    })),
    summary: summaryRows.map(([key, label]) => ({
      key,
      label: savedLabel(definition, SUMMARY, key, label),
      source: recorded(session, SUMMARY, key),
      cad: recorded(session, SUMMARY, `${key}_CAD`),
    })),
  };
}

export type FapiWorksheetProjection = NonNullable<ReturnType<typeof projectFapiSessionWorksheet>>;

function csvCell(value: string | number | undefined) {
  if (typeof value === 'number') return String(value);
  const text = value ?? '';
  const safe = /^\s*[=+@\-]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
}

/** Full precision is preserved; unavailable cells export blank with their explicit status. */
export function fapiWorksheetCsv(sheet: FapiWorksheetProjection) {
  const rows: Array<Array<string | number | undefined>> = [
    ['Run', sheet.runId, 'Version', sheet.version, 'Revision', sheet.revision],
    ['Review', sheet.approvedAt ? 'Approved' : 'Not approved', sheet.approvedAt],
    ...sheet.sources.map((source) => ['Source history', source.id, source.name]),
    ['Section', 'Line', 'Description', 'Currency / unit', 'Status', 'Value', 'Block', 'Result key'],
  ];
  for (const section of sheet.sections) {
    for (const row of section.rows)
      rows.push([
        section.title,
        row.code,
        row.label,
        row.unit,
        row.status,
        row.value,
        row.blockId,
        row.key,
      ]);
  }
  for (const row of sheet.summary) {
    for (const [unit, cell] of [
      [sheet.source, row.source],
      [sheet.reporting, row.cad],
    ] as const) {
      rows.push([
        'Results summary',
        row.key,
        row.label,
        unit,
        cell.status,
        cell.value,
        cell.blockId,
        cell.key,
      ]);
    }
  }
  return rows.map((row) => row.map(csvCell).join(',')).join('\r\n');
}
