import { buildApiRequest, apiRequestToBlockConfig } from '@workspace/source-connectors/connectors';

// ─────────────────────────────────────────────────────────────────────────────
// Foreign Tax Calculator — a from-scratch rebuild of the FAPI Calculation
// template (see ../fapi-template.ts), using what this session's work on the
// block palette actually changed:
//   - the formula engine now supports comparators and if(), so the two
//     statutory "the lesser of / the amount by which X exceeds Y" lines are
//     expressed that way instead of hidden behind min_multiply_cap /
//     max_subtract_zero function names;
//   - the Workpaper block's declared worksheetLines + defaultValue (built
//     earlier this session) replace the undeclared legacy Field blocks for
//     the two calculation-engine-backed displays, so situational lines that
//     are legitimately zero when not applicable show "Default" instead of a
//     blank dash;
//   - keyword coverage is substantially wider, grounded in real trial-balance
//     / general-ledger phrasing rather than the single canonical label each
//     category had before;
//   - classification is no longer silent: a low-confidence warning and an
//     unmatched-rows check sit right after the Keyword Mapper, so an
//     uncertain or unrecognized row gets flagged for review instead of
//     quietly falling out of the numbers.
//
// The underlying FAPI math is UNCHANGED from fapi-template.ts and is not
// re-derived here — it was already verified against the Platform repo. Making
// a formula more transparent is not the same as making it different, and
// every line below computes identically to its fapi-template.ts counterpart.
//
// NOTE ON SCOPE: this gives the template a fully real, runnable Build-canvas
// graph (Test block / Run with upstream blocks / canvas Run all work exactly
// as they do for the existing FAPI template). It does NOT add a matching
// entry to the bespoke chat-guided "Run" walkthrough engine
// (shared/workflow-engine/runtime/workflow-runs/fapi.ts) — that is a second,
// much larger, FAPI-specific subsystem (hand-written sample rows, a
// worksheetProvenance row-filter per line, one editableInputs entry per
// config key) that would need its own dedicated pass to extend correctly
// rather than copy under time pressure.
// ─────────────────────────────────────────────────────────────────────────────

// ── Calculation rules ─────────────────────────────────────────────────────────

// Lines Engine: maps category totals → individual FAPI lines A through H.
// Identical math to FAPI_LINES_CALC_RULES in ../fapi-template.ts.
export const FOREIGN_TAX_LINES_CALC_RULES = [
  {
    calculationId: 'A',
    description: 'A = P × (income_bucket − expense_bucket) + 95(2)',
    formulaExpression: 'pCoefficient * (income_bucket - expense_bucket) + canadianRules95_4',
    label: 'A',
    operands: ['income_bucket', 'expense_bucket'],
    operation: 'max_subtract_zero',
    resultKey: 'A',
  },
  {
    calculationId: 'EXPENSES',
    description: 'Expenses = P × expense_bucket',
    formulaExpression: 'pCoefficient * expense_bucket',
    label: 'Expenses',
    operands: ['expense_bucket'],
    operation: 'pass_through',
    resultKey: 'EXPENSES',
  },
  {
    calculationId: 'COMPUTATION_95_4',
    description: '95(2) = Canadian 95(2) rules amount (flows into A)',
    label: '95(2)',
    operands: ['canadianRules95_4'],
    operation: 'pass_through',
    resultKey: 'COMPUTATION_95_4',
  },
  {
    calculationId: 'A1',
    description: 'A1 = debtForgiveness * 2',
    label: 'A1',
    operands: ['debtForgiveness', 2],
    operation: 'multiply',
    resultKey: 'A1',
  },
  {
    calculationId: 'A2',
    description: 'A2 = priorYearG',
    label: 'A2',
    operands: ['priorYearG'],
    operation: 'pass_through',
    resultKey: 'A2',
  },
  {
    calculationId: 'B',
    description: 'B = capGains * inclusionRate',
    label: 'B',
    operands: ['capGains', 'inclusionRate'],
    operation: 'multiply',
    resultKey: 'B',
  },
  ...['C', 'D', 'E', 'F', 'F1', 'G', 'H'].map((id) => {
    const sourceKeys: Record<string, string> = {
      C: 'cfaIncome',
      D: 'businessLosses',
      E: 'faclCarryforward',
      F: 'prescribedAmount',
      F1: 'prescribedAmountF1',
      G: 'dividendDeductions',
      H: 'partnershipDividends',
    };
    return {
      calculationId: id,
      description: `${id} = ${sourceKeys[id]}`,
      label: id,
      operands: [sourceKeys[id]],
      operation: 'pass_through',
      resultKey: id,
    };
  }),
  {
    calculationId: 'FAT_PAID',
    description: 'FAT_PAID = fatPaid',
    label: 'FAT Paid',
    operands: ['fatPaid'],
    operation: 'pass_through',
    resultKey: 'FAT_PAID',
  },
  {
    calculationId: 'RTF',
    description: 'RTF = rtf',
    label: 'RTF',
    operands: ['rtf'],
    operation: 'pass_through',
    resultKey: 'RTF',
  },
];

// Summary Engine: aggregates lines A-H into FAPI totals + CAD conversion.
// Same totals as FAPI_SUMMARY_CALC_RULES; FAPI_BRUT, FAT_DEDUCTION and
// NET_FAPI are now written with explicit if()/comparators instead of
// max_subtract_zero / min_multiply_cap, matching the statutory wording
// ("the amount, if any, by which X exceeds Y" / "the lesser of A and B")
// directly in the auditable formula text. Numerically identical either way.
export const FOREIGN_TAX_SUMMARY_CALC_RULES = [
  {
    calculationId: 'GROSS',
    description: 'Gross = A + A1 + A2 + B + C',
    label: 'Gross',
    operands: ['A', 'A1', 'A2', 'B', 'C'],
    operation: 'add',
    resultKey: 'GROSS',
  },
  {
    calculationId: 'DEDUCTIONS',
    description: 'Deductions = D + E + F + F1 + G + H',
    label: 'Deductions',
    operands: ['D', 'E', 'F', 'F1', 'G', 'H'],
    operation: 'add',
    resultKey: 'DEDUCTIONS',
  },
  {
    calculationId: 'FAPI_BRUT',
    description: 'FAPI Brut = the amount, if any, by which Gross exceeds Deductions',
    formulaExpression: 'if(GROSS > DEDUCTIONS, GROSS - DEDUCTIONS, 0)',
    label: 'FAPI Brut',
    operands: ['GROSS', 'DEDUCTIONS'],
    operation: 'max_subtract_zero',
    resultKey: 'FAPI_BRUT',
  },
  {
    calculationId: 'FAT_DEDUCTION',
    description:
      's.91(4) foreign accrual tax deduction = the lesser of (FAT_PAID × RTF) and FAPI_BRUT',
    formulaExpression: 'if(FAT_PAID * RTF < FAPI_BRUT, FAT_PAID * RTF, FAPI_BRUT)',
    label: 'FAT Deduction',
    operands: ['FAT_PAID', 'RTF', 'FAPI_BRUT'],
    operation: 'min_multiply_cap',
    resultKey: 'FAT_DEDUCTION',
  },
  {
    calculationId: 'NET_FAPI',
    description: 'Net FAPI = the amount, if any, by which FAPI Brut exceeds the FAT deduction',
    formulaExpression: 'if(FAPI_BRUT > FAT_DEDUCTION, FAPI_BRUT - FAT_DEDUCTION, 0)',
    label: 'Net FAPI',
    operands: ['FAPI_BRUT', 'FAT_DEDUCTION'],
    operation: 'max_subtract_zero',
    resultKey: 'NET_FAPI',
  },
  {
    calculationId: 'FX_RATE',
    description: 'FX_RATE = fxRate (from Bank of Canada source)',
    label: 'FX Rate',
    operands: ['fxRate'],
    operation: 'pass_through',
    resultKey: 'FX_RATE',
  },
  // CAD column — every result line scaled by the annual-average FX rate. Because
  // the FAPI formulas are linear, scaling each line equals recomputing in CAD.
  {
    calculationId: 'GROSS_CAD',
    description: 'Gross CAD = GROSS × FX_RATE',
    label: 'Gross CAD',
    operands: ['GROSS', 'FX_RATE'],
    operation: 'multiply',
    resultKey: 'GROSS_CAD',
  },
  {
    calculationId: 'DEDUCTIONS_CAD',
    description: 'Deductions CAD = DEDUCTIONS × FX_RATE',
    label: 'Deductions CAD',
    operands: ['DEDUCTIONS', 'FX_RATE'],
    operation: 'multiply',
    resultKey: 'DEDUCTIONS_CAD',
  },
  {
    calculationId: 'FAPI_BRUT_CAD',
    description: 'FAPI Brut CAD = FAPI_BRUT × FX_RATE',
    label: 'FAPI Brut CAD',
    operands: ['FAPI_BRUT', 'FX_RATE'],
    operation: 'multiply',
    resultKey: 'FAPI_BRUT_CAD',
  },
  {
    calculationId: 'FAT_DEDUCTION_CAD',
    description: 'FAT Deduction CAD = FAT_DEDUCTION × FX_RATE',
    label: 'FAT Deduction CAD',
    operands: ['FAT_DEDUCTION', 'FX_RATE'],
    operation: 'multiply',
    resultKey: 'FAT_DEDUCTION_CAD',
  },
  {
    calculationId: 'NET_FAPI_CAD',
    description: 'Net FAPI CAD = NET_FAPI × FX_RATE',
    label: 'Net FAPI CAD',
    operands: ['NET_FAPI', 'FX_RATE'],
    operation: 'multiply',
    resultKey: 'NET_FAPI_CAD',
  },
];

// ── Rollup rules ──────────────────────────────────────────────────────────────
export const FOREIGN_TAX_ROLLUP_RULES = [
  {
    description: 'Adds income mapped categories (line A property income).',
    includeCategoryIds: ['interestIncome', 'rents', 'royalties', 'dividends', 'otherFapiIncome'],
    label: 'Income Bucket',
    operation: 'sum',
    rollupId: 'income_bucket',
  },
  {
    description: 'Adds FAPI-allowable expenses using absolute values (subtracted in line A).',
    includeCategoryIds: ['generalExpenses', 'legalExpenses', 'accountingExpenses'],
    label: 'Expense Bucket',
    operation: 'sum_abs',
    rollupId: 'expense_bucket',
  },
  {
    description: 'Line C — controlled foreign affiliate income (classified rows).',
    includeCategoryIds: ['cfaIncome'],
    label: 'CFA Income (C)',
    operation: 'sum',
    rollupId: 'cfaIncome',
  },
  {
    description: 'Line A1 driver — debt forgiveness income (A1 = 2 × this).',
    includeCategoryIds: ['debtForgiveness'],
    label: 'Debt Forgiveness (A1)',
    operation: 'sum',
    rollupId: 'debtForgiveness',
  },
  {
    description: 'Line D — business investment losses as a positive deduction.',
    includeCategoryIds: ['businessLosses'],
    label: 'Business Losses (D)',
    operation: 'sum_abs',
    rollupId: 'businessLosses',
  },
  {
    description: 'Line E — foreign accrual capital losses as a positive deduction.',
    includeCategoryIds: ['faclCarryforward'],
    label: 'FACL Carryforward (E)',
    operation: 'sum_abs',
    rollupId: 'faclCarryforward',
  },
];

// ── Keyword rules ─────────────────────────────────────────────────────────────
// Every category from the FAPI template, with keyword coverage widened to
// realistic trial-balance / general-ledger phrasing (not just the one
// canonical label each category had before). matchMode stays 'contains' —
// each keyword is a substring match against account/label/description.
export const FOREIGN_TAX_KEYWORD_RULES = [
  {
    categoryId: 'interestIncome',
    categoryLabel: 'Interest Income',
    confidence: 0.95,
    description: 'Interest income style row.',
    keywords: [
      'interest income',
      'interest earned',
      'bank interest',
      'interest revenue',
      'investment interest',
      'interest on deposits',
      'interest on loans receivable',
      'accrued interest income',
      'interest income - foreign',
      'loan interest income',
    ],
    matchMode: 'contains',
    priority: 10,
    ruleId: 'rule-interest-income',
  },
  {
    categoryId: 'rents',
    categoryLabel: 'Rents',
    confidence: 0.92,
    description: 'Rental or lease income style row.',
    keywords: [
      'rental income',
      'rent received',
      'lease income',
      'property rental income',
      'real estate rental',
      'rental revenue',
      'net rental income',
      'gross rents',
    ],
    matchMode: 'contains',
    priority: 10,
    ruleId: 'rule-rents',
  },
  {
    categoryId: 'royalties',
    categoryLabel: 'Royalties',
    confidence: 0.9,
    description: 'Royalty income style row.',
    keywords: [
      'royalty income',
      'royalties',
      'patent royalty',
      'royalty revenue',
      'licensing royalty',
      'licence fee income',
      'franchise royalty',
      'mineral royalty',
    ],
    matchMode: 'contains',
    priority: 10,
    ruleId: 'rule-royalties',
  },
  {
    categoryId: 'dividends',
    categoryLabel: 'Dividends',
    confidence: 0.9,
    description: 'Dividend income style row.',
    keywords: [
      'dividend income',
      'portfolio shares',
      'dividends received',
      'dividend revenue',
      'investment dividends',
      'foreign dividend income',
      'shareholder dividends',
      'dividends from investments',
    ],
    matchMode: 'contains',
    priority: 10,
    ruleId: 'rule-dividends',
  },
  {
    categoryId: 'otherFapiIncome',
    categoryLabel: 'Other FAPI Income',
    confidence: 0.72,
    description: 'Other FAPI income style row with lower confidence.',
    keywords: [
      'other fapi income',
      'miscellaneous fapi revenue',
      'other passive income',
      'other investment income',
      'other property income',
      'foreign accrual property income - other',
    ],
    matchMode: 'contains',
    priority: 5,
    ruleId: 'rule-other-fapi-income',
  },
  {
    categoryId: 'generalExpenses',
    categoryLabel: 'General Expenses',
    confidence: 0.9,
    description: 'General expense row.',
    keywords: [
      'general expenses',
      'operating expenses',
      'administrative expenses',
      'general and administrative',
      'office expenses',
      'overhead expenses',
      'g&a expenses',
    ],
    matchMode: 'contains',
    priority: 10,
    ruleId: 'rule-general-expenses',
  },
  {
    categoryId: 'legalExpenses',
    categoryLabel: 'Legal Expenses',
    confidence: 0.9,
    description: 'Legal expense row.',
    keywords: [
      'legal expenses',
      'legal advisory',
      'legal fees',
      'attorney fees',
      'counsel fees',
      'litigation expenses',
      'legal and professional fees',
    ],
    matchMode: 'contains',
    priority: 10,
    ruleId: 'rule-legal-expenses',
  },
  {
    categoryId: 'accountingExpenses',
    categoryLabel: 'Accounting Expenses',
    confidence: 0.9,
    description: 'Accounting expense row.',
    keywords: [
      'accounting expenses',
      'accounting service',
      'accounting fees',
      'audit fees',
      'bookkeeping fees',
      'tax preparation fees',
      'audit and accounting fees',
    ],
    matchMode: 'contains',
    priority: 10,
    ruleId: 'rule-accounting-expenses',
  },
  {
    categoryId: 'debtForgiveness',
    categoryLabel: 'Debt Forgiveness',
    confidence: 0.9,
    description: 'Debt forgiveness amount.',
    keywords: [
      'debt forgiveness',
      'forgiveness of debt',
      'debt relief',
      'cancellation of debt',
      'debt forgiven',
      'waived debt',
      'debt settlement gain',
    ],
    matchMode: 'contains',
    priority: 10,
    ruleId: 'rule-debt-forgiveness',
  },
  {
    categoryId: 'priorYearG',
    categoryLabel: 'Prior Year G',
    confidence: 0.9,
    description: 'Prior year amount G.',
    keywords: ['prior year g', 'prior-year g amount', 'carryforward g amount'],
    matchMode: 'contains',
    priority: 10,
    ruleId: 'rule-prior-year-g',
  },
  {
    categoryId: 'capGains',
    categoryLabel: 'Capital Gains',
    confidence: 0.9,
    description: 'Capital gains amount.',
    keywords: [
      'capital gains',
      'cap gains',
      'gain on disposition',
      'gain on sale of shares',
      'realized capital gain',
      'gain on disposal of investments',
      'gain on sale of securities',
    ],
    matchMode: 'contains',
    priority: 10,
    ruleId: 'rule-cap-gains',
  },
  {
    categoryId: 'cfaIncome',
    categoryLabel: 'CFA Income',
    confidence: 0.9,
    description: 'CFA income amount.',
    keywords: [
      'cfa income',
      'controlled foreign affiliate income',
      'income from controlled foreign affiliate',
      'cfa earnings',
      'foreign affiliate income',
    ],
    matchMode: 'contains',
    priority: 10,
    ruleId: 'rule-cfa-income',
  },
  {
    categoryId: 'businessLosses',
    categoryLabel: 'Business Losses',
    confidence: 0.9,
    description: 'Business losses amount.',
    keywords: [
      'business losses',
      'business investment loss',
      'allowable business investment loss',
      'operating loss',
      'trading loss',
      'net business loss',
    ],
    matchMode: 'contains',
    priority: 10,
    ruleId: 'rule-business-losses',
  },
  {
    categoryId: 'faclCarryforward',
    categoryLabel: 'FACL Carryforward',
    confidence: 0.9,
    description: 'FACL carryforward amount.',
    keywords: [
      'facl carryforward',
      'foreign accrual capital loss',
      'capital loss carryforward',
      'facl',
      'foreign accrual capital loss carryforward',
    ],
    matchMode: 'contains',
    priority: 10,
    ruleId: 'rule-facl-carryforward',
  },
  {
    categoryId: 'prescribedAmount',
    categoryLabel: 'Prescribed Amount',
    confidence: 0.9,
    description: 'Prescribed amount.',
    excludeKeywords: ['f1', 'f.1'],
    keywords: ['prescribed amount', 'prescribed deduction', 'regulation 5907 amount'],
    matchMode: 'contains',
    priority: 10,
    ruleId: 'rule-prescribed-amount',
  },
  {
    categoryId: 'prescribedAmountF1',
    categoryLabel: 'Prescribed Amount F1',
    confidence: 0.9,
    description: 'Prescribed amount F1.',
    keywords: ['prescribed amount f1', 'prescribed amount f.1', 'regulation 5907 f1 amount'],
    matchMode: 'contains',
    priority: 10,
    ruleId: 'rule-prescribed-amount-f1',
  },
  {
    categoryId: 'dividendDeductions',
    categoryLabel: 'Dividend Deductions',
    confidence: 0.9,
    description: 'Dividend deductions amount.',
    keywords: [
      'dividend deductions',
      'deduction for dividends',
      'intercorporate dividend deduction',
    ],
    matchMode: 'contains',
    priority: 10,
    ruleId: 'rule-dividend-deductions',
  },
  {
    categoryId: 'partnershipDividends',
    categoryLabel: 'Partnership Dividends',
    confidence: 0.9,
    description: 'Partnership dividends amount.',
    keywords: [
      'partnership dividends',
      'dividends from partnership',
      'partnership dividend income',
    ],
    matchMode: 'contains',
    priority: 10,
    ruleId: 'rule-partnership-dividends',
  },
];

// ── Block specs ───────────────────────────────────────────────────────────────

export const FOREIGN_TAX_CALC_BLOCK_SPECS = [
  // ── Sources ──────────────────────────────────────────────────────────────
  {
    catalogId: 'source:excel-workbook',
    config: {
      columns: ['rowId', 'account', 'label', 'description', 'amount', 'currency'],
      columnMapping: {
        account: 'account',
        amount: 'amount',
        currency: 'currency',
        description: 'description',
        label: 'label',
      },
      outputs: 'selected_rows',
      requireUpload: true,
      rows: [],
      selectedRange: '',
      selectedRowsCount: 0,
      selectedSheet: '',
      sheets: [],
      sourceKind: 'excel_workbook',
      sourceLocator: 'local-excel://awaiting-upload',
      sourceStatus: 'draft',
      sourceVersion: 1,
      toolId: 'source.manual_table',
      workbookName: 'Upload foreign-affiliate trial balance workbook',
    },
    description: 'Upload the Excel trial balance with foreign affiliate income and expense rows.',
    id: 'foreign-tax-source-trial-balance',
    label: 'Trial Balance',
    position: { x: -220, y: 80 },
  },
  {
    catalogId: 'source:manual-entry',
    config: {
      documentCurrency: 'USD',
      fatPaid: 100,
      fapiYear: 2025,
      inclusionRate: 0.5,
      outputs: 'fapi_inputs, input_metadata',
      reportingCurrency: 'CAD',
      rtf: 4,
      // debtForgiveness/cfaIncome/businessLosses/faclCarryforward intentionally
      // NOT defaulted here — classifying trial-balance rows produces them as
      // named values, and a 0 default here would clobber a classified figure.
      // The Workpaper's own defaultValue (below) covers the display side of
      // "legitimately zero when nothing was classified" instead.
      pCoefficient: 1,
      canadianRules95_4: 0,
      priorYearG: 0,
      prescribedAmount: 0,
      prescribedAmountF1: 0,
      dividendDeductions: 0,
      partnershipDividends: 0,
      sourceKind: 'fapi_inputs',
      sourceLocator: 'manual-source://foreign-tax-inputs',
      sourceStatus: 'draft',
      sourceVersion: 1,
      toolId: 'source.fapi_inputs',
    },
    description:
      'Inclusion rate, RTF, FAT paid, P-coefficient, 95(2) amount, and the A1/A2/C–H line assumptions.',
    id: 'foreign-tax-source-inputs',
    label: 'Foreign Tax Inputs',
    position: { x: -220, y: 360 },
  },
  {
    catalogId: 'source:api-http-request',
    config: {
      ...(() => {
        const request = buildApiRequest('boc.fx_average', { currency: 'USD', year: 2025 });
        if (!request.ok) throw new Error(request.errors.join(' '));
        return apiRequestToBlockConfig('boc.fx_average', request.params, request.spec);
      })(),
      overrideRate: 1.35,
      overrideReason: 'Workbook-provided draft FX rate.',
      outputs: 'named_values, response_metadata',
      sourceKind: 'http_json',
      sourceStatus: 'draft',
      sourceVersion: 1,
      toolId: 'source.http_json',
    },
    description:
      'API source selecting the average USD→CAD rate as fxRate. The explicit workbook override can be cleared to use a fetched response.',
    id: 'foreign-tax-source-fx-rate',
    label: 'Bank of Canada FX Rate',
    position: { x: -220, y: 640 },
  },

  // ── Logic: classify ──────────────────────────────────────────────────────
  {
    catalogId: 'logic:classification-mapping',
    config: {
      conflictStrategy: 'highest_confidence',
      inputs: 'data_rows, keyword_rules',
      keywordRules: FOREIGN_TAX_KEYWORD_RULES,
      lowConfidenceThreshold: 0.75,
      matchFields: ['account', 'label', 'description'],
      matchMode: 'contains',
      outputs: 'mapped_rows, unmatched_rows, low_confidence_rows, mapping_summary',
      toolId: 'logic.keyword_mapper',
      unmatchedStrategy: 'send_to_review',
    },
    description:
      'Classifies trial balance rows into FAPI income and expense categories using a widened keyword rulebook.',
    id: 'foreign-tax-logic-keyword-mapper',
    label: 'Keyword Mapper',
    position: { x: 340, y: 80 },
  },

  // ── Review: flag uncertainty instead of guessing ────────────────────────
  {
    catalogId: 'review:low-confidence-warning',
    config: {
      inputs: 'checked_items',
      outputs: 'validation_result, low_confidence_rows',
      threshold: 0.8,
      toolId: 'review.low_confidence_warning',
    },
    description:
      'Flags rows the Keyword Mapper matched with low confidence, so an uncertain classification gets a second look instead of silently going into the numbers.',
    id: 'foreign-tax-review-low-confidence',
    label: 'Mapping Confidence Check',
    position: { x: 340, y: 360 },
  },
  {
    catalogId: 'review:unmatched-rows-check',
    config: {
      blocking: false,
      inputs: 'checked_items',
      outputs: 'review_status, unmatched_rows',
      overrideUnmatchedRows: false,
      toolId: 'review.unmatched_rows_check',
    },
    description:
      'Flags trial-balance rows that matched no keyword rule at all, so an unrecognized row is surfaced for review rather than silently dropped from the totals.',
    id: 'foreign-tax-review-unmatched',
    label: 'Unmatched Rows Check',
    position: { x: 340, y: 560 },
  },

  // ── Logic: roll up + calculate ───────────────────────────────────────────
  {
    catalogId: 'logic:category-rollup-aggregator',
    config: {
      inputs: 'mapped_rows, rollup_rules',
      operation: 'sum',
      outputs: 'category_totals, rollup_totals, named_values, rollup_summary',
      rollupRules: FOREIGN_TAX_ROLLUP_RULES,
      toolId: 'logic.category_rollup_aggregator',
    },
    description:
      'Groups mapped categories into Income Bucket and Expense Bucket totals using the rollup rules.',
    id: 'foreign-tax-logic-category-rollup',
    label: 'Category Rollup',
    position: { x: 800, y: 80 },
  },
  {
    catalogId: 'logic:calculation-engine',
    config: {
      formulas: FOREIGN_TAX_LINES_CALC_RULES,
      inputs: 'named_values, protected_inputs',
      mode: 'auto',
      outputs: 'calculated_results, formula_trace, calculation_summary, named_values',
      toolId: 'logic.calculation_engine',
    },
    description:
      'Computes individual FAPI lines A through H from category totals and workbook inputs.',
    id: 'foreign-tax-logic-lines-engine',
    label: 'FAPI Lines Engine',
    position: { x: 1260, y: 80 },
  },
  {
    catalogId: 'logic:calculation-engine',
    config: {
      formulas: FOREIGN_TAX_SUMMARY_CALC_RULES,
      inputs: 'named_values',
      mode: 'auto',
      outputs: 'calculated_results, formula_trace, calculation_summary, named_values',
      toolId: 'logic.calculation_engine',
    },
    description:
      'Aggregates lines A-H into Gross, Deductions, FAPI Brut, Net FAPI, and Net FAPI CAD — FAPI Brut, the FAT deduction and Net FAPI are written as explicit if() comparisons matching the statutory wording.',
    id: 'foreign-tax-logic-summary-engine',
    label: 'FAPI Summary Engine',
    position: { x: 1720, y: 80 },
  },

  // ── Workpaper blocks ──────────────────────────────────────────────────────
  // Income & Expense stays an undeclared (legacy-extraction) Field block: its
  // source is the Category Rollup Aggregator, and the declarative
  // worksheetLines mechanism only accepts a logic.calculation_engine block as
  // a line's source — there is no declarative path for a rollup's own totals.
  {
    catalogId: 'field:field-block',
    config: { toolId: 'field.field_block' },
    description: 'Displays income and expense category breakdown from the rollup.',
    id: 'foreign-tax-field-income',
    label: 'Income & Expense',
    position: { x: 800, y: 480 },
  },
  // FAPI Lines and FAPI Summary are declared Workpapers: every line names its
  // calculator + result key explicitly, and the situational lines (debt
  // forgiveness, CFA income, business losses, FACL, prescribed amounts,
  // dividend deductions/partnership dividends, the 95(2) amount) carry a
  // declared default of 0 — shown as "Default" only when nothing has been
  // classified or computed yet, never overriding a real or invalid value.
  {
    catalogId: 'field:field-block',
    config: {
      toolId: 'field.field_block',
      worksheetLines: [
        {
          id: 'line-a',
          label: 'A — Property income',
          calculationBlockId: 'foreign-tax-logic-lines-engine',
          resultKey: 'A',
          presentation: 'primary',
          description: 'P × (income bucket − expense bucket) + 95(2)',
        },
        {
          id: 'line-expenses',
          label: 'Expenses (within A)',
          calculationBlockId: 'foreign-tax-logic-lines-engine',
          resultKey: 'EXPENSES',
          presentation: 'detail',
          group: 'Line A detail',
        },
        {
          id: 'line-95-4',
          label: '95(2) amount (within A)',
          calculationBlockId: 'foreign-tax-logic-lines-engine',
          resultKey: 'COMPUTATION_95_4',
          presentation: 'detail',
          group: 'Line A detail',
          defaultValue: 0,
        },
        {
          id: 'line-a1',
          label: 'A1 — Debt forgiveness (×2)',
          calculationBlockId: 'foreign-tax-logic-lines-engine',
          resultKey: 'A1',
          presentation: 'summary',
          defaultValue: 0,
        },
        {
          id: 'line-a2',
          label: 'A2 — Prior-year G',
          calculationBlockId: 'foreign-tax-logic-lines-engine',
          resultKey: 'A2',
          presentation: 'summary',
          defaultValue: 0,
        },
        {
          id: 'line-b',
          label: 'B — Capital gains × inclusion rate',
          calculationBlockId: 'foreign-tax-logic-lines-engine',
          resultKey: 'B',
          presentation: 'summary',
        },
        {
          id: 'line-c',
          label: 'C — CFA income',
          calculationBlockId: 'foreign-tax-logic-lines-engine',
          resultKey: 'C',
          presentation: 'summary',
          defaultValue: 0,
        },
        {
          id: 'line-d',
          label: 'D — Business losses',
          calculationBlockId: 'foreign-tax-logic-lines-engine',
          resultKey: 'D',
          presentation: 'summary',
          defaultValue: 0,
        },
        {
          id: 'line-e',
          label: 'E — FACL carryforward',
          calculationBlockId: 'foreign-tax-logic-lines-engine',
          resultKey: 'E',
          presentation: 'summary',
          defaultValue: 0,
        },
        {
          id: 'line-f',
          label: 'F — Prescribed amount',
          calculationBlockId: 'foreign-tax-logic-lines-engine',
          resultKey: 'F',
          presentation: 'summary',
          defaultValue: 0,
        },
        {
          id: 'line-f1',
          label: 'F1 — Prescribed amount F1',
          calculationBlockId: 'foreign-tax-logic-lines-engine',
          resultKey: 'F1',
          presentation: 'summary',
          defaultValue: 0,
        },
        {
          id: 'line-g',
          label: 'G — Dividend deductions',
          calculationBlockId: 'foreign-tax-logic-lines-engine',
          resultKey: 'G',
          presentation: 'summary',
          defaultValue: 0,
        },
        {
          id: 'line-h',
          label: 'H — Partnership dividends',
          calculationBlockId: 'foreign-tax-logic-lines-engine',
          resultKey: 'H',
          presentation: 'summary',
          defaultValue: 0,
        },
        {
          id: 'line-fat-paid',
          label: 'FAT Paid',
          calculationBlockId: 'foreign-tax-logic-lines-engine',
          resultKey: 'FAT_PAID',
          presentation: 'detail',
          group: 'FAT deduction inputs',
        },
        {
          id: 'line-rtf',
          label: 'Relevant Tax Factor',
          calculationBlockId: 'foreign-tax-logic-lines-engine',
          resultKey: 'RTF',
          presentation: 'detail',
          group: 'FAT deduction inputs',
        },
      ],
    },
    description: 'Declared worksheet of FAPI lines A through H, with formula and source trace.',
    id: 'foreign-tax-field-lines',
    label: 'FAPI Lines A–H',
    position: { x: 1260, y: 480 },
  },
  {
    catalogId: 'field:field-block',
    config: {
      toolId: 'field.field_block',
      worksheetLines: [
        {
          id: 'line-gross',
          label: 'Gross FAPI',
          calculationBlockId: 'foreign-tax-logic-summary-engine',
          resultKey: 'GROSS',
          presentation: 'primary',
        },
        {
          id: 'line-deductions',
          label: 'Deductions',
          calculationBlockId: 'foreign-tax-logic-summary-engine',
          resultKey: 'DEDUCTIONS',
          presentation: 'primary',
        },
        {
          id: 'line-fapi-brut',
          label: 'FAPI Brut',
          calculationBlockId: 'foreign-tax-logic-summary-engine',
          resultKey: 'FAPI_BRUT',
          presentation: 'primary',
          description: 'The amount, if any, by which Gross exceeds Deductions.',
        },
        {
          id: 'line-fat-deduction',
          label: 'FAT Deduction',
          calculationBlockId: 'foreign-tax-logic-summary-engine',
          resultKey: 'FAT_DEDUCTION',
          presentation: 'summary',
          description: 's.91(4) — the lesser of (FAT Paid × RTF) and FAPI Brut.',
        },
        {
          id: 'line-net-fapi',
          label: 'Net FAPI',
          calculationBlockId: 'foreign-tax-logic-summary-engine',
          resultKey: 'NET_FAPI',
          presentation: 'primary',
        },
        {
          id: 'line-fx-rate',
          label: 'FX Rate (USD → CAD)',
          calculationBlockId: 'foreign-tax-logic-summary-engine',
          resultKey: 'FX_RATE',
          presentation: 'detail',
          group: 'CAD conversion',
        },
        {
          id: 'line-gross-cad',
          label: 'Gross FAPI (CAD)',
          calculationBlockId: 'foreign-tax-logic-summary-engine',
          resultKey: 'GROSS_CAD',
          presentation: 'detail',
          group: 'CAD conversion',
          decimalPlaces: 2,
        },
        {
          id: 'line-deductions-cad',
          label: 'Deductions (CAD)',
          calculationBlockId: 'foreign-tax-logic-summary-engine',
          resultKey: 'DEDUCTIONS_CAD',
          presentation: 'detail',
          group: 'CAD conversion',
          decimalPlaces: 2,
        },
        {
          id: 'line-fapi-brut-cad',
          label: 'FAPI Brut (CAD)',
          calculationBlockId: 'foreign-tax-logic-summary-engine',
          resultKey: 'FAPI_BRUT_CAD',
          presentation: 'detail',
          group: 'CAD conversion',
          decimalPlaces: 2,
        },
        {
          id: 'line-fat-deduction-cad',
          label: 'FAT Deduction (CAD)',
          calculationBlockId: 'foreign-tax-logic-summary-engine',
          resultKey: 'FAT_DEDUCTION_CAD',
          presentation: 'detail',
          group: 'CAD conversion',
          decimalPlaces: 2,
        },
        {
          id: 'line-net-fapi-cad',
          label: 'Net FAPI (CAD)',
          calculationBlockId: 'foreign-tax-logic-summary-engine',
          resultKey: 'NET_FAPI_CAD',
          presentation: 'summary',
          group: 'CAD conversion',
          decimalPlaces: 2,
        },
      ],
    },
    description: 'Declared worksheet of Gross, Deductions, FAPI Brut, FAT Deduction and Net FAPI.',
    id: 'foreign-tax-field-summary',
    label: 'FAPI Summary',
    position: { x: 1720, y: 480 },
  },

  // ── Outputs ───────────────────────────────────────────────────────────────
  {
    catalogId: 'output:evidence-pack',
    config: {
      inputs: 'mapped_rows, review_findings, source_trace',
      outputs: 'preview',
      toolId: 'output.evidence_pack_preview',
    },
    description:
      'Human-readable preview with mapped rows, rollup totals, calculated results, and any confidence/unmatched-row findings.',
    id: 'foreign-tax-output-evidence',
    label: 'Evidence Pack',
    position: { x: 2180, y: 80 },
  },
  {
    catalogId: 'output:canonical-json',
    config: {
      inputs: 'mapped_rows, review_findings, source_trace',
      outputs: 'canonical_json',
      toolId: 'output.canonical_json',
    },
    description: 'Structured JSON package with mapped rows and all FAPI computed results.',
    id: 'foreign-tax-output-json',
    label: 'Canonical JSON',
    position: { x: 2180, y: 380 },
  },
];

// ── Edge specs ────────────────────────────────────────────────────────────────

export const FOREIGN_TAX_CALC_EDGE_SPECS = [
  // Sources → Logic
  {
    bindingLabel: 'Trial balance rows to classify',
    reason: 'Keyword Mapper classifies uploaded trial balance rows into FAPI categories.',
    relationshipType: 'provides_data_to',
    sourceBlockId: 'foreign-tax-source-trial-balance',
    sourceOutputRole: 'selected_rows',
    targetBlockId: 'foreign-tax-logic-keyword-mapper',
    targetInputRole: 'data_rows',
  },

  // Keyword Mapper → review checks
  {
    bindingLabel: 'Mapped rows to check confidence',
    reason: 'Mapping Confidence Check reviews how certain each classification is.',
    relationshipType: 'triggers_validation',
    sourceBlockId: 'foreign-tax-logic-keyword-mapper',
    sourceOutputRole: 'mapped_rows',
    targetBlockId: 'foreign-tax-review-low-confidence',
    targetInputRole: 'checked_items',
  },
  {
    bindingLabel: 'Unmatched rows to review',
    reason: 'Unmatched Rows Check flags rows that matched no keyword rule.',
    relationshipType: 'triggers_validation',
    sourceBlockId: 'foreign-tax-logic-keyword-mapper',
    sourceOutputRole: 'unmatched_rows',
    targetBlockId: 'foreign-tax-review-unmatched',
    targetInputRole: 'checked_items',
  },

  // Keyword Mapper → Rollup → Lines → Summary
  {
    bindingLabel: 'Mapped categories to aggregate',
    reason: 'Category Rollup groups mapped rows into income and expense buckets.',
    relationshipType: 'aggregates_into',
    sourceBlockId: 'foreign-tax-logic-keyword-mapper',
    sourceOutputRole: 'mapped_rows',
    targetBlockId: 'foreign-tax-logic-category-rollup',
    targetInputRole: 'mapped_rows',
  },
  {
    bindingLabel: 'Category totals for FAPI lines',
    reason: 'Lines Engine uses category and rollup totals as named values for A-H formulas.',
    relationshipType: 'provides_data_to',
    sourceBlockId: 'foreign-tax-logic-category-rollup',
    sourceOutputRole: 'named_values',
    targetBlockId: 'foreign-tax-logic-lines-engine',
    targetInputRole: 'named_values',
  },
  {
    bindingLabel: 'Foreign tax workbook inputs',
    reason: 'Lines Engine needs inclusion rate, RTF, and FAT paid from the workbook.',
    relationshipType: 'provides_data_to',
    sourceBlockId: 'foreign-tax-source-inputs',
    sourceOutputRole: 'fapi_inputs',
    targetBlockId: 'foreign-tax-logic-lines-engine',
    targetInputRole: 'protected_inputs',
  },
  {
    bindingLabel: 'FAPI lines A–H for summary',
    reason: 'Summary Engine reads computed lines A-H and FAT/RTF as named values.',
    relationshipType: 'provides_data_to',
    sourceBlockId: 'foreign-tax-logic-lines-engine',
    sourceOutputRole: 'calculated_results',
    targetBlockId: 'foreign-tax-logic-summary-engine',
    targetInputRole: 'named_values',
  },
  {
    bindingLabel: 'FX rate for CAD conversion',
    reason: 'Summary Engine uses the Bank of Canada FX rate to convert Net FAPI to CAD.',
    relationshipType: 'provides_data_to',
    sourceBlockId: 'foreign-tax-source-fx-rate',
    sourceOutputRole: 'named_values',
    targetBlockId: 'foreign-tax-logic-summary-engine',
    targetInputRole: 'named_values',
  },

  // Logic → Field/Workpaper blocks
  {
    bindingLabel: 'Income & expense breakdown',
    reason: 'Income & Expense field displays rollup totals with category detail.',
    relationshipType: 'provides_data_to',
    sourceBlockId: 'foreign-tax-logic-category-rollup',
    sourceOutputRole: 'rollup_totals',
    targetBlockId: 'foreign-tax-field-income',
    targetInputRole: 'computed_values',
  },
  {
    bindingLabel: 'FAPI computation lines',
    reason: 'FAPI Lines Workpaper displays A through H with formula trace.',
    relationshipType: 'provides_data_to',
    sourceBlockId: 'foreign-tax-logic-lines-engine',
    sourceOutputRole: 'calculated_results',
    targetBlockId: 'foreign-tax-field-lines',
    targetInputRole: 'computed_values',
  },
  {
    bindingLabel: 'FAPI summary results',
    reason: 'FAPI Summary Workpaper displays Gross, Net FAPI, and Net FAPI CAD.',
    relationshipType: 'provides_data_to',
    sourceBlockId: 'foreign-tax-logic-summary-engine',
    sourceOutputRole: 'calculated_results',
    targetBlockId: 'foreign-tax-field-summary',
    targetInputRole: 'computed_values',
  },

  // Logic/Review → Outputs
  {
    bindingLabel: 'Mapped rows evidence',
    reason: 'Evidence Pack lists mapped trial balance rows with source trace.',
    relationshipType: 'included_in_output_preview',
    sourceBlockId: 'foreign-tax-logic-keyword-mapper',
    sourceOutputRole: 'mapped_rows',
    targetBlockId: 'foreign-tax-output-evidence',
    targetInputRole: 'mapped_rows',
  },
  {
    bindingLabel: 'Rollup summary evidence',
    reason: 'Evidence Pack includes category and rollup totals.',
    relationshipType: 'included_in_output_preview',
    sourceBlockId: 'foreign-tax-logic-category-rollup',
    sourceOutputRole: 'rollup_summary',
    targetBlockId: 'foreign-tax-output-evidence',
    targetInputRole: 'review_findings',
  },
  {
    bindingLabel: 'Confidence findings evidence',
    reason: 'Evidence Pack includes any low-confidence classification findings.',
    relationshipType: 'included_in_output_preview',
    sourceBlockId: 'foreign-tax-review-low-confidence',
    sourceOutputRole: 'validation_result',
    targetBlockId: 'foreign-tax-output-evidence',
    targetInputRole: 'review_findings',
  },
  {
    bindingLabel: 'Unmatched row findings evidence',
    reason: 'Evidence Pack includes any rows that matched no keyword rule.',
    relationshipType: 'included_in_output_preview',
    sourceBlockId: 'foreign-tax-review-unmatched',
    sourceOutputRole: 'review_status',
    targetBlockId: 'foreign-tax-output-evidence',
    targetInputRole: 'review_findings',
  },
  {
    bindingLabel: 'FAPI calculation summary',
    reason: 'Evidence Pack includes all computed FAPI results.',
    relationshipType: 'included_in_output_preview',
    sourceBlockId: 'foreign-tax-logic-summary-engine',
    sourceOutputRole: 'calculation_summary',
    targetBlockId: 'foreign-tax-output-evidence',
    targetInputRole: 'review_findings',
  },
  {
    bindingLabel: 'Mapped rows JSON',
    reason: 'Canonical JSON includes mapped rows and source trace.',
    relationshipType: 'included_in_handoff',
    sourceBlockId: 'foreign-tax-logic-keyword-mapper',
    sourceOutputRole: 'mapped_rows',
    targetBlockId: 'foreign-tax-output-json',
    targetInputRole: 'mapped_rows',
  },
  {
    bindingLabel: 'FAPI results JSON',
    reason: 'Canonical JSON includes all computed FAPI results.',
    relationshipType: 'included_in_handoff',
    sourceBlockId: 'foreign-tax-logic-summary-engine',
    sourceOutputRole: 'calculation_summary',
    targetBlockId: 'foreign-tax-output-json',
    targetInputRole: 'review_findings',
  },
];
