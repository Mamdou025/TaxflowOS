

import { createExpenseReimbursementWorkflow } from "@/shared/workflow-engine/workflow/templates/expense";
import {
  EXPENSE_LINES_CALC_RULES,
  EXPENSE_SUMMARY_CALC_RULES,
} from '@/shared/workflow-engine/templates/sample-workflows/expense-reimbursement-template';
import type { TemplateConfig, SourceRow, CategoryOption, DerivedRow } from './engine';

// Sample expense report — one row per receipt. The classifier matches on label +
// description, so each carries a channel-obvious keyword.
const ROWS: SourceRow[] = [
  { rowId: 'exp-1', account: 'T-100', label: 'Flight to Denver client site', description: 'Air travel — economy airfare', amount: 820, currency: 'USD' },
  { rowId: 'exp-2', account: 'L-100', label: 'Marriott — 3 nights', description: 'Hotel lodging near the client office', amount: 540, currency: 'USD' },
  { rowId: 'exp-3', account: 'M-100', label: 'Team dinner with client', description: 'Restaurant meal — business dinner', amount: 210, currency: 'USD' },
  { rowId: 'exp-4', account: 'T-101', label: 'Airport taxi', description: 'Ground transport taxi to the airport', amount: 65, currency: 'USD' },
  { rowId: 'exp-5', account: 'S-100', label: 'USB-C docking station', description: 'Computer equipment and supplies', amount: 180, currency: 'USD' },
  { rowId: 'exp-6', account: 'M-101', label: 'Client working lunch', description: 'Restaurant meal — working lunch', amount: 95, currency: 'USD' },
  { rowId: 'exp-7', account: 'K-100', label: 'Mileage — warehouse visit', description: 'Personal vehicle mileage reimbursement', amount: 120, currency: 'USD' },
  { rowId: 'exp-8', account: 'S-101', label: 'Analytics software subscription', description: 'Annual software subscription license', amount: 350, currency: 'USD' },
  { rowId: 'exp-9', account: 'X-100', label: 'Client gift — bottle of wine', description: 'Client gift — alcohol (non-reimbursable)', amount: 60, currency: 'USD' },
  { rowId: 'exp-10', account: 'M-102', label: 'Coffee with prospect', description: 'Restaurant meal — coffee meeting', amount: 22, currency: 'USD' },
];

const CATEGORIES: CategoryOption[] = [
  { id: 'travel', label: 'Travel' },
  { id: 'lodging', label: 'Lodging' },
  { id: 'meals', label: 'Meals & entertainment' },
  { id: 'supplies', label: 'Supplies & software' },
  { id: 'mileage', label: 'Personal vehicle mileage' },
  { id: 'nonReimbursable', label: 'Non-reimbursable (policy)' },
  { id: '__skip__', label: 'Leave unclassified' },
];

const money = (n: number) => Number(n.toFixed(2));

export const EXPENSE_CONFIG: TemplateConfig = {
  id: 'expense',
  name: 'Employee Expense Reimbursement',
  agentId: 'mira',
  documentLabel: 'employee expense report',
  resultPage: 'expense',
  steps: [
    { label: 'Collect the expense report', sub: 'Receipts uploaded as rows' },
    { label: 'Classify each receipt', sub: 'Keyword classifier → policy categories' },
    { label: 'Apply policy & total', sub: 'Per-diem caps + net payable' },
    { label: 'Review & approve', sub: 'Sign off before payroll' },
  ],
  buildSnapshot: createExpenseReimbursementWorkflow,
  sampleRows: ROWS,
  sourceBlockId: 'expense-source-receipts',
  mapperBlockId: 'expense-logic-classifier',
  rollupBlockId: 'expense-logic-rollup',
  linesBlockId: 'expense-logic-lines',
  summaryBlockId: 'expense-logic-summary',
  linesRules: EXPENSE_LINES_CALC_RULES,
  summaryRules: EXPENSE_SUMMARY_CALC_RULES,
  // Unmatched receipts don't block — they're flagged for review and left out of
  // the reimbursable total until categorized.
  defaultRouteUnmatched: true,
  bucketKeys: ['travel_total', 'lodging_total', 'meals_total', 'supplies_total', 'mileage_total', 'nonreimbursable_total', 'submitted_total'],
  lineKeys: ['TRAVEL_REIMBURSABLE', 'LODGING_REIMBURSABLE', 'MEALS_REIMBURSABLE', 'SUPPLIES_REIMBURSABLE', 'MILEAGE_REIMBURSABLE', 'MEALS_OVER_CAP'],
  categoryOptions: CATEGORIES,
  headlineKey: 'NET_PAYABLE',
  currency: 'USD',
  // No `block` → these override computeExtra's params (the fapi_inputs source
  // can't emit arbitrary policy keys, so the domain math is done in computeExtra).
  params: { mealCap: 250, fxRate: 1.35 },
  editableInputs: [
    { key: 'mealCap', label: 'Meal per-diem cap', default: 250, step: 25, hint: 'Maximum reimbursable meals total', block: { blockId: 'expense-logic-lines', configKey: 'mealCap' } },
    { key: 'fxRate', label: 'FX rate (USD → CAD)', default: 1.35, step: 0.01, hint: 'Annual average USD→CAD (Bank of Canada)', block: { blockId: 'expense-source-fx', configKey: 'overrideRate' } },
  ],
  // Per-line provenance: which receipts feed each reimbursable category line.
  worksheetProvenance: ({ lineKey, core }) => {
    const map: Record<string, string> = {
      TRAVEL_REIMBURSABLE: 'travel',
      LODGING_REIMBURSABLE: 'lodging',
      MEALS_REIMBURSABLE: 'meals',
      SUPPLIES_REIMBURSABLE: 'supplies',
      MILEAGE_REIMBURSABLE: 'mileage',
    };
    const cat = map[lineKey];
    if (!cat) return [];
    return core.detail.mapped
      .filter((r) => /* categoryLabel or id contains the category token */
        r.category.toLowerCase().includes(cat) ||
        (cat === 'meals' && /meal/i.test(r.category)) ||
        (cat === 'supplies' && /suppl|software/i.test(r.category)) ||
        (cat === 'mileage' && /mileage|vehicle/i.test(r.category)))
      .map((r) => ({
        label: r.label,
        amount: Number(r.amount.toFixed(2)),
        category: r.category,
        keyword: r.keyword || null,
        confidence: Math.round((r.confidence || 0) * 100),
      }));
  },
};
