// ─────────────────────────────────────────────────────────────────────────────
// Statutory Holiday Payroll Accrual — the runnable config.
//
// The generic engine does the real work (classify → count → calculate); this file
// supplies the workflow's identity, its offline sample, and the accrual math.
//
// The election is HOURS ACCRUED PER HOLIDAY, between zero and a full standard
// work day. That is a genuine payroll policy decision — some employers accrue a
// full shift per statutory day, some a prorated amount — and it scales the whole
// liability, so the reviewer's choice visibly moves the answer.
// ─────────────────────────────────────────────────────────────────────────────

import { createHolidayPayrollWorkflow } from '@/shared/workflow-engine/local-fiscal-workflow';
import {
  HOLIDAY_ACCRUAL_CALC_RULES,
  HOLIDAY_COST_CALC_RULES,
  HOLIDAY_PARAMS,
  HOLIDAY_SPEC,
} from '@/shared/workflow-engine/templates/sample-workflows/holiday-payroll-template';
import type { TemplateConfig, SourceRow, CategoryOption, DerivedRow } from './engine';

// Offline sample — real Nager.Date record shapes for Canada. Replaced by the live
// fetch as soon as the API Source block runs. `amount: 1` = one holiday-day.
const ROWS: SourceRow[] = [
  { rowId: 'H-1', label: "New Year's Day", description: '', amount: 1, currency: 'DAY', account: 'CA' },
  { rowId: 'H-2', label: 'Good Friday', description: '', amount: 1, currency: 'DAY', account: 'CA' },
  { rowId: 'H-3', label: 'Canada Day', description: '', amount: 1, currency: 'DAY', account: 'CA' },
  { rowId: 'H-4', label: 'Labour Day', description: '', amount: 1, currency: 'DAY', account: 'CA' },
  { rowId: 'H-5', label: 'Thanksgiving', description: '', amount: 1, currency: 'DAY', account: 'CA' },
  { rowId: 'H-6', label: 'Christmas Day', description: '', amount: 1, currency: 'DAY', account: 'CA' },
  { rowId: 'H-7', label: 'Boxing Day', description: '', amount: 1, currency: 'DAY', account: 'CA' },
  { rowId: 'H-8', label: 'Louis Riel Day', description: 'CA-MB', amount: 1, currency: 'DAY', account: 'CA' },
  { rowId: 'H-9', label: 'Family Day', description: 'CA-ON', amount: 1, currency: 'DAY', account: 'CA' },
  { rowId: 'H-10', label: 'Saint-Jean-Baptiste Day', description: 'CA-QC', amount: 1, currency: 'DAY', account: 'CA' },
];

const CATEGORIES: CategoryOption[] = [
  { id: 'national_holidays', label: 'National (all employees)' },
  { id: 'ab_holidays', label: 'Alberta' },
  { id: 'bc_holidays', label: 'British Columbia' },
  { id: 'mb_holidays', label: 'Manitoba' },
  { id: 'nb_holidays', label: 'New Brunswick' },
  { id: 'nl_holidays', label: 'Newfoundland and Labrador' },
  { id: 'ns_holidays', label: 'Nova Scotia' },
  { id: 'nt_holidays', label: 'Northwest Territories' },
  { id: 'nu_holidays', label: 'Nunavut' },
  { id: 'on_holidays', label: 'Ontario' },
  { id: 'pe_holidays', label: 'Prince Edward Island' },
  { id: 'qc_holidays', label: 'Quebec' },
  { id: 'sk_holidays', label: 'Saskatchewan' },
  { id: 'yt_holidays', label: 'Yukon' },
  { id: '__skip__', label: 'Leave unclassified' },
];

const money = (n: number) => Number(n.toFixed(2));
const pct = (n: number) => Number((n * 100).toFixed(2));

export const HOLIDAY_PAYROLL_CONFIG: TemplateConfig = {
  id: 'holiday-payroll',
  name: 'Statutory Holiday Payroll Accrual',
  documentLabel: 'public holiday calendar',
  steps: [
    { label: 'Fetch the holiday calendar', sub: 'Live from the Nager.Date API' },
    { label: 'Classify each holiday', sub: 'National, or specific to one province' },
    { label: 'Set hours per holiday', sub: 'Elect the accrual policy' },
    { label: 'Review & approve', sub: 'Sign off the payroll accrual' },
  ],
  buildSnapshot: createHolidayPayrollWorkflow as unknown as TemplateConfig['buildSnapshot'],
  // Derived from the connector, so the run's fetch, the canvas block and Sina's
  // `useApiSource` cannot describe different requests.
  apiSource: {
    body: HOLIDAY_SPEC.body,
    currency: HOLIDAY_SPEC.currency ?? 'DAY',
    fieldMap: HOLIDAY_SPEC.fieldMap as Record<string, string>,
    maxRows: HOLIDAY_SPEC.maxRows ?? 400,
    method: HOLIDAY_SPEC.method,
    provider: 'Nager.Date',
    recordLabel: 'public holidays',
    resultsPath: HOLIDAY_SPEC.resultsPath,
    url: HOLIDAY_SPEC.url,
    connectorId: 'nager.public_holidays',
    connectorParams: { ...HOLIDAY_PARAMS },
  },
  sampleRows: ROWS,
  sourceBlockId: 'hol-source-holidays',
  mapperBlockId: 'hol-logic-classifier',
  rollupBlockId: 'hol-logic-rollup',
  linesBlockId: 'hol-logic-calc',
  summaryBlockId: 'hol-logic-calc',
  linesRules: HOLIDAY_ACCRUAL_CALC_RULES,
  summaryRules: HOLIDAY_COST_CALC_RULES,
  defaultRouteUnmatched: true,
  bucketKeys: ['national_days', 'provincial_days', 'holiday_days_total'],
  lineKeys: [
    'HOLIDAY_DAYS',
    'NATIONAL_DAYS',
    'PROVINCIAL_DAYS',
    'HOURS_FLOOR',
    'HOURS_CEILING',
    'HOURS_PER_HOLIDAY',
  ],
  categoryOptions: CATEGORIES,
  headlineKey: 'TOTAL_LIABILITY',
  currency: 'CAD',
  elect: {
    paramBlockId: 'hol-source-params',
    paramKey: 'hours_per_holiday',
    minKey: 'HOURS_FLOOR',
    maxKey: 'HOURS_CEILING',
    label: 'hours accrued per holiday',
    ceilingWord: 'full-work-day',
    floorLabel: 'No accrual',
    ceilingLabel: 'Full day',
    floorNote: ' · accrue nothing per statutory day',
    ceilingNote: ' · accrue a whole shift per statutory day',
    promptSuffix: ' This sets how much statutory pay each employee accrues per holiday.',
  },
  params: {
    annual_payroll: 2_371_200,
    headcount: 40,
    hourly_rate: 28.5,
    premium_multiplier: 1.5,
    provincial_headcount: 12,
    standard_work_day: 8,
  },
  // Editable in the run — change any of these and every figure recomputes.
  editableInputs: [
    { key: 'headcount', label: 'Employees', hint: 'Total headcount in scope', default: 40, block: { blockId: 'hol-source-params', configKey: 'headcount' } },
    { key: 'hourly_rate', label: 'Hourly rate (CAD)', hint: 'Average base rate', default: 28.5, block: { blockId: 'hol-source-params', configKey: 'hourly_rate' } },
    { key: 'premium_multiplier', label: 'Statutory premium', hint: '1.5 = time-and-a-half', default: 1.5, block: { blockId: 'hol-source-params', configKey: 'premium_multiplier' } },
    { key: 'provincial_headcount', label: 'Employees in-province', hint: 'How many staff a provincial holiday applies to', default: 12, block: { blockId: 'hol-source-params', configKey: 'provincial_headcount' } },
    { key: 'standard_work_day', label: 'Standard work day (hours)', hint: 'Caps the hours you can accrue per holiday', default: 8, block: { blockId: 'hol-source-params', configKey: 'standard_work_day' } },
  ],

  computeExtra: ({ rollup, params, elected, mapped, rows }): { lines: DerivedRow[]; summary: DerivedRow[]; boundsMin: number; boundsMax: number } => {
    const headcount = params.headcount ?? 40;
    const rate = params.hourly_rate ?? 28.5;
    const premium = params.premium_multiplier ?? 1.5;
    const inProvince = Math.min(params.provincial_headcount ?? 12, headcount);
    const workDay = params.standard_work_day ?? 8;
    const annualPayroll = params.annual_payroll ?? 2_371_200;

    // Day counts come from the engine's real classification of the fetched rows.
    const nationalDays = rollup.national_days ?? 0;
    const provincialDays = rollup.provincial_days ?? 0;
    const totalDays = rollup.holiday_days_total ?? nationalDays + provincialDays;

    // The election: hours accrued per holiday, zero to a full standard day.
    const floor = 0;
    const ceiling = workDay;
    const hours = Math.min(Math.max(elected ?? workDay, floor), ceiling);

    // A national holiday is paid to everyone; a provincial one only to the staff
    // in that province. Keeping them apart is the whole reason the classifier
    // distinguishes them — a single blended figure would overstate the accrual.
    const perEmployeeDayCost = hours * rate * premium;
    const nationalLiability = nationalDays * headcount * perEmployeeDayCost;
    const provincialLiability = provincialDays * inProvince * perEmployeeDayCost;
    const totalLiability = nationalLiability + provincialLiability;

    const costPerEmployee = headcount > 0 ? totalLiability / headcount : 0;
    const payrollShare = annualPayroll > 0 ? totalLiability / annualPayroll : 0;

    // Reconciliation to the source: holidays the classifier couldn't place are
    // excluded from every count above, so the worksheet must say so and foot.
    const sourceRows = rows.length > 0 ? rows : ROWS;
    const sourceHolidays = sourceRows.length;
    const excludedHolidays = Math.max(sourceHolidays - mapped.length, 0);

    const lines: DerivedRow[] = [
      { key: 'HOLIDAY_DAYS', label: 'Holiday days in scope', value: totalDays, formula: 'every holiday the rulebook placed' },
      { key: 'NATIONAL_DAYS', label: 'National holiday days', value: nationalDays, formula: 'holidays that apply to all employees' },
      { key: 'PROVINCIAL_DAYS', label: 'Provincial holiday days', value: provincialDays, formula: 'holidays that apply in one province only' },
      { key: 'HOURS_FLOOR', label: 'Hours floor', value: floor, formula: 'accrue nothing per holiday' },
      { key: 'HOURS_CEILING', label: 'Hours ceiling', value: ceiling, formula: 'a full standard work day' },
      { key: 'HOURS_PER_HOLIDAY', label: 'Hours accrued per holiday', value: hours, formula: 'elected between the floor and a full work day' },
    ];

    const summary: DerivedRow[] = [
      { key: 'TOTAL_LIABILITY', label: 'Statutory holiday liability', value: money(totalLiability), formula: `national + provincial, at ${hours}h × ${rate} × ${premium}` },
      { key: 'NATIONAL_LIABILITY', label: 'National portion', value: money(nationalLiability), formula: `${nationalDays} days × ${headcount} employees × ${hours}h × ${rate} × ${premium}` },
      { key: 'PROVINCIAL_LIABILITY', label: 'Provincial portion', value: money(provincialLiability), formula: `${provincialDays} days × ${inProvince} in-province employees × ${hours}h × ${rate} × ${premium}` },
      { key: 'COST_PER_EMPLOYEE', label: 'Cost per employee', value: money(costPerEmployee), formula: 'total liability ÷ headcount' },
      { key: 'PAYROLL_SHARE_PCT', label: 'Share of annual payroll %', value: pct(payrollShare), formula: 'liability ÷ annual base payroll' },
      { key: 'UNMATCHED_TOTAL', label: 'Excluded from totals (unmatched)', value: excludedHolidays, formula: `${excludedHolidays} holiday${excludedHolidays === 1 ? '' : 's'} the rulebook could not place — left out of every figure above` },
      { key: 'SOURCE_TOTAL', label: 'Holidays fetched from source', value: sourceHolidays, formula: 'holidays in scope + excluded — reconciles to the API response' },
    ];

    return { lines, summary, boundsMin: floor, boundsMax: ceiling };
  },
};
