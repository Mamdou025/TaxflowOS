import {
  type WorkflowBlock,
  type BlockRun,
  SAMPLE_CREATED_AT,
  type WorkflowPosition,
  type BlockStatus,
  type WorkflowEdge,
  type WorkflowRelationshipType,
} from '../contracts';
import { createWorkflowEdgeRecord } from '../edges';

export function getSampleBlockRuns(blocks: WorkflowBlock[]): BlockRun[] {
  return blocks.slice(0, 8).map((block, index) => ({
    id: `sample-run-${block.id}`,
    blockId: block.id,
    blockLabel: block.label,
    status: index === 2 ? 'warning' : 'success',
    startedAt: SAMPLE_CREATED_AT,
    completedAt: SAMPLE_CREATED_AT,
    durationMs: 95,
    input: { mock: true },
    output: { outputKey: block.runtime.outputKey, mockOnly: true },
  }));
}

export function getFapiSampleBlockSpecs(): Array<{
  catalogId: string;
  id: string;
  label: string;
  description: string;
  position: WorkflowPosition;
  config?: Record<string, unknown>;
  status?: BlockStatus;
}> {
  const x = {
    source: -980,
    logic: -620,
    review: -260,
    protectedInput: 100,
    official: 460,
    summary: 820,
    output: 1180,
  };
  const y = (row: number) => -520 + row * 150;

  return [
    {
      catalogId: 'source:excel-workbook',
      id: 'source-trial-balance',
      label: 'Trial Balance Rows',
      description: 'Manual table source for the first sample fiscal workflow',
      position: { x: x.source, y: y(1) },
      config: {
        manualRows: [
          {
            account: '4000',
            amount: 12_000,
            label: 'Interest income',
            rowId: 'tb-row-interest-income',
          },
          {
            account: '4100',
            amount: 8000,
            label: 'Rental income',
            rowId: 'tb-row-rental-income',
          },
          {
            account: '5000',
            amount: -600,
            label: 'Bank charges',
            rowId: 'tb-row-bank-charges',
          },
          {
            account: '5200',
            amount: -1200,
            label: 'Professional fees',
            rowId: 'tb-row-professional-fees',
          },
          {
            account: '6000',
            amount: 3000,
            label: 'Other revenue',
            rowId: 'tb-row-other-revenue',
          },
        ],
        outputs: 'trialBalanceRows',
        sourceKind: 'manual_table',
        sourceLocator: 'trial-balance.xlsx#TB!A:K',
        canvasNodeType: 'trigger',
        toolId: 'source.manual_table',
      },
    },
    {
      catalogId: 'source:keyword-rules',
      id: 'source-keyword-rules',
      label: 'Keyword Rulebook',
      description: 'Editable keyword rulebook for local keyword mapping',
      position: { x: x.source, y: y(0) },
      config: {
        keywordRules: [
          {
            confidence: 0.9,
            keywords: ['interest income', 'interest earned', 'bank interest'],
            lineId: 'A',
            ruleId: 'keyword-rule-interest-income',
            subsectionId: 'interest_income',
            target: 'interestIncome',
          },
          {
            confidence: 0.9,
            keywords: ['rental income', 'rent income', 'lease income'],
            lineId: 'A',
            ruleId: 'keyword-rule-rents',
            subsectionId: 'rental_income',
            target: 'rents',
          },
          {
            confidence: 0.8,
            keywords: ['bank charges', 'office expenses', 'general expenses'],
            lineId: 'EXPENSES',
            ruleId: 'keyword-rule-general-expenses',
            subsectionId: 'general_expenses',
            target: 'generalExpenses',
          },
          {
            confidence: 0.8,
            keywords: ['professional fees', 'accounting fees', 'audit fees'],
            lineId: 'EXPENSES',
            ruleId: 'keyword-rule-accounting-expenses',
            subsectionId: 'extra_expenses',
            target: 'accountingExpenses',
          },
          {
            confidence: 0.7,
            keywords: ['other revenue', 'miscellaneous income', 'sundry income'],
            lineId: 'A',
            ruleId: 'keyword-rule-other-fapi-income',
            subsectionId: 'other_fapi_income',
            target: 'otherFapiIncome',
          },
        ],
        outputs: 'keywordRules',
        sourceKind: 'keyword_rules',
        sourceLocator: 'manual-source://keyword-rules',
        toolId: 'source.keyword_rules',
      },
    },
    {
      catalogId: 'source:pdf-document',
      id: 'source-financial-statements-notes',
      label: 'Financial statements and notes',
      description: 'PDF / Document support for statements and notes',
      position: { x: x.source, y: y(2) },
      config: {
        outputs: 'financialStatementEvidence',
        sourceLocator: 'financial-statements.pdf#notes',
      },
    },
    {
      catalogId: 'source:manual-entry',
      id: 'source-fx-rate-override',
      label: 'FX Rate',
      description: 'Manual value source for the sample FX rate',
      position: { x: x.source, y: y(3) },
      config: {
        toolId: 'source.manual_value',
        unit: 'CAD/USD',
        value: 1.35,
        valueLabel: 'FX Rate',
        outputs: 'fxRateOverride',
        sourceLocator: 'manual-entry://fx-rate-override',
        valuePreview: '1.3500 CAD/USD',
      },
    },
    {
      catalogId: 'source:manual-entry',
      id: 'source-inclusion-rate-constant',
      label: 'Inclusion rate constant',
      description: 'Manual Entry source for inclusion rate or constant',
      position: { x: x.source, y: y(4) },
      config: {
        toolId: 'source.manual_value',
        value: 0.5,
        valueLabel: 'Inclusion Rate',
        outputs: 'inclusionRateConstant',
        sourceLocator: 'manual-entry://inclusion-rate',
        valuePreview: '50%',
      },
    },
    {
      catalogId: 'source:api-http-request',
      id: 'source-fx-rate-api',
      label: 'FX rate API source',
      description: 'Mock source value for FX rates; no API call is made',
      position: { x: x.source, y: y(5) },
      config: {
        toolId: 'source.manual_value',
        unit: 'CAD/USD',
        value: 1.34,
        valueLabel: 'Reference FX Rate',
        outputs: 'fxRateApiResponse',
        sourceLocator: 'https://rates.example.test/fx/CAD/USD',
      },
    },
    {
      catalogId: 'logic:classification-mapping',
      id: 'logic-classify-source-rows',
      label: 'Keyword Mapper',
      description: 'Map trial balance rows using connected keyword Sources',
      position: { x: x.logic, y: y(0) },
      config: {
        inputs: 'trialBalanceRows, keywordRules',
        lowConfidenceThreshold: 0.75,
        outputs: 'classifiedRows',
        toolId: 'logic.keyword_mapper',
      },
    },
    {
      catalogId: 'logic:aggregation',
      id: 'logic-property-income',
      label: 'Property income aggregation',
      description: 'Aggregation of mapped income rows',
      position: { x: x.logic, y: y(1) },
      config: {
        aggregationMethod: 'sum',
        amountField: 'amount',
        includeTargets: ['interestIncome', 'rents', 'otherFapiIncome'],
        inputs: 'classifiedRows',
        outputs: 'propertyIncome',
        toolId: 'logic.aggregation',
      },
    },
    {
      catalogId: 'logic:aggregation',
      id: 'logic-capital-gains-losses',
      label: 'Capital gains / losses aggregation',
      description: 'Aggregation of capital gains and losses',
      position: { x: x.logic, y: y(2) },
      config: {
        aggregationMethod: 'sum',
        includeTargets: ['capital_gain'],
        inputs: 'classifiedRows',
        outputs: 'capitalGainsLosses',
        toolId: 'logic.aggregation',
      },
    },
    {
      catalogId: 'logic:aggregation',
      id: 'logic-expenses-deductions',
      label: 'Expenses and deductions aggregation',
      description: 'Aggregation of expense and deduction rows',
      position: { x: x.logic, y: y(3) },
      config: {
        aggregationMethod: 'sum',
        includeTargets: ['generalExpenses', 'accountingExpenses'],
        inputs: 'classifiedRows',
        outputs: 'expensesDeductions',
        toolId: 'logic.aggregation',
      },
    },
    {
      catalogId: 'logic:formula',
      id: 'logic-taxable-capital-gains',
      label: 'Apply FX Rate Formula',
      description: 'Safe local formula applying FX rate to mapped income',
      position: { x: x.logic, y: y(4) },
      config: {
        formula: 'propertyIncome * fxRateOverride',
        inputs: 'propertyIncome, fxRateOverride',
        operands: ['logic-property-income.subtotal', 'source-fx-rate-override.value'],
        operation: 'multiply',
        outputs: 'sampleFiscalResult',
        toolId: 'logic.formula',
      },
    },
    {
      catalogId: 'logic:formula',
      id: 'logic-fat-deduction',
      label: 'FAT deduction calculation',
      description: 'Formula for foreign accrual tax deduction',
      position: { x: x.logic, y: y(5) },
      config: {
        formula: 'fatPaid * rtf',
        inputs: 'fatPaid, relevantTaxFactor',
        outputs: 'fatDeduction',
      },
    },
    {
      catalogId: 'logic:transformation',
      id: 'logic-fx-conversion',
      label: 'FX conversion and normalization',
      description: 'Transformation for FX conversion or normalization',
      position: { x: x.logic, y: y(6) },
      config: {
        inputs: 'fxRateApiResponse, fxRateOverride, documentCurrency',
        outputs: 'normalizedAmounts',
      },
    },
    {
      catalogId: 'logic:condition',
      id: 'logic-missing-source-routing',
      label: 'Missing source review routing',
      description: 'Condition for missing source or review path routing',
      position: { x: x.logic, y: y(7) },
      config: {
        inputs: 'sourceSupportFinding, confidenceWarning',
        outputs: 'reviewRoute',
      },
    },
    {
      catalogId: 'review:required-input-check',
      id: 'review-required-fx-rate',
      label: 'FX rate exists',
      description: 'Required Input Check for FX rate existence',
      position: { x: x.review, y: y(1) },
      config: {
        inputs: 'fxRateApiResponse, fxRateOverride',
        requiredKeys: ['fxRateOverride'],
        toolId: 'review.required_input_check',
      },
    },
    {
      catalogId: 'review:missing-source-check',
      id: 'review-protected-support',
      label: 'Protected values have support',
      description: 'Missing Source Check for protected values',
      position: { x: x.review, y: y(2) },
    },
    {
      catalogId: 'review:low-confidence-warning',
      id: 'review-low-confidence',
      label: 'Low confidence warning',
      description: 'Warning for low-confidence classifications',
      position: { x: x.review, y: y(3) },
      config: {
        threshold: 0.8,
        toolId: 'review.low_confidence_warning',
      },
    },
    {
      catalogId: 'review:unmatched-rows-check',
      id: 'review-unmatched-rows',
      label: 'Unmatched rows check',
      description: 'Review check for rows not mapped by keyword rules',
      position: { x: x.review, y: y(4) },
      config: {
        toolId: 'review.unmatched_rows_check',
      },
    },
    {
      catalogId: 'review:manual-override-review',
      id: 'review-manual-override',
      label: 'Manual override review',
      description: 'Review manual override values',
      position: { x: x.review, y: y(5) },
    },
    {
      catalogId: 'review:approval-gate',
      id: 'review-approval-gate',
      label: 'Approval gate',
      description: 'Approval Gate before governed outputs',
      position: { x: x.review, y: y(6) },
      config: {
        approved: true,
        notes: 'Local sample approval for protected result.',
        reviewer: 'Sample Reviewer',
        toolId: 'review.approval_gate',
      },
    },
    {
      catalogId: 'review:output-readiness-check',
      id: 'review-output-readiness',
      label: 'Output readiness check',
      description: 'Output Readiness Check for handoff artifacts',
      position: { x: x.review, y: y(7) },
      config: {
        toolId: 'review.output_readiness_check',
      },
    },
    ...[
      ['protected-input-fx-rate', 'Locked Rate', 'FX Rate', 'fxRate'],
      [
        'protected-input-reporting-currency',
        'Protected Input',
        'Reporting Currency',
        'reportingCurrency',
      ],
      [
        'protected-input-document-currency',
        'Protected Input',
        'Document Currency',
        'documentCurrency',
      ],
      [
        'protected-input-fapi-year',
        'Protected Input',
        'FAPI Year / Fiscal Period',
        'fapiFiscalPeriod',
      ],
      ['protected-input-inclusion-rate', 'Locked Rate', 'Inclusion Rate', 'inclusionRate'],
      ['protected-input-rtf', 'Locked Rate', 'RTF / relevant tax factor', 'relevantTaxFactor'],
      [
        'protected-input-fat-paid',
        'Protected Input',
        'FAT Paid / Foreign Accrual Tax input',
        'fatPaid',
      ],
    ].map(([id, subtype, label, output], index) => ({
      catalogId: subtype === 'Locked Rate' ? 'protected:locked-rate' : 'protected:protected-input',
      id,
      label,
      description: `Protected Input: ${label}`,
      position: { x: x.protectedInput, y: y(index) },
      config: { outputs: output },
    })),
    ...['A', 'A.1', 'A.2', 'B', 'C', 'D', 'E', 'F', 'F.1', 'G', 'H'].map((line, index) => ({
      catalogId: 'protected:official-line',
      id: `protected-line-${line.toLowerCase().replace('.', '-')}`,
      label: line === 'A' ? 'Sample Official Fiscal Line A' : `Official Line ${line}`,
      description: `Protected official line ${line}`,
      position: { x: x.official, y: y(index - 1) },
      config: { outputs: `officialLine${line.replace('.', '_')}` },
    })),
    ...[
      ['protected-summary-gross', 'Gross', 'gross'],
      ['protected-summary-deductions', 'Deductions', 'deductions'],
      ['protected-summary-fapi-brut', 'FAPI Brut', 'fapiBrut'],
      ['protected-summary-fat-deduction', 'FAT Deduction', 'fatDeduction'],
      ['protected-summary-net-fapi', 'Sample Protected Result', 'sampleProtectedResult'],
      ['protected-summary-fapl-loss', 'FAPL / loss result', 'faplLossResult'],
    ].map(([id, label, output], index) => ({
      catalogId: 'protected:final-reviewed-amount',
      id,
      label,
      description: `Protected summary result: ${label}`,
      position: { x: x.summary, y: y(index + 1) },
      config: { outputs: output, toolId: 'protected.protected_result' },
    })),
    ...[
      ['output-csv-export', 'output:csv-export', 'CSV Export'],
      ['output-excel-export', 'output:excel-export', 'Excel Export'],
      ['output-pdf-review-pack', 'output:pdf-report', 'PDF Review Pack'],
      ['output-evidence-pack', 'output:evidence-pack', 'Evidence Pack'],
      ['output-canonical-json', 'output:canonical-json', 'Canonical JSON'],
      ['output-taxprep-handoff', 'output:taxprep-handoff', 'Taxprep Handoff'],
      ['output-onesource-handoff', 'output:onesource-handoff', 'ONESOURCE Handoff'],
    ].map(([id, catalogId, label], index) => ({
      catalogId,
      id,
      label,
      description: `${label} output artifact`,
      position: { x: x.output, y: y(index) },
      config: {
        inputs: 'approvedProtectedPacket',
        toolId:
          catalogId === 'output:canonical-json'
            ? 'output.canonical_json'
            : 'output.evidence_pack_preview',
      },
    })),
  ];
}

export function getFapiSampleEdges(): WorkflowEdge[] {
  // biome-ignore lint/nursery/useMaxParams: Compact sample-edge DSL keeps the graph readable.
  const edge = (
    sourceBlockId: string,
    targetBlockId: string,
    relationshipType: WorkflowRelationshipType,
    reason: string,
    confidence = 1,
    binding?: Pick<
      WorkflowEdge,
      'bindingLabel' | 'bindingStatus' | 'sourceOutputRole' | 'targetInputRole'
    >,
  ) =>
    createWorkflowEdgeRecord({
      id: `edge-${sourceBlockId}-${targetBlockId}`,
      sourceBlockId,
      targetBlockId,
      relationshipType,
      reason,
      confidence,
      ...binding,
      createdAt: SAMPLE_CREATED_AT,
    });

  const edges: WorkflowEdge[] = [
    edge(
      'source-trial-balance',
      'logic-classify-source-rows',
      'extracted_into',
      'Trial balance rows are extracted into classification logic.',
      1,
      {
        bindingLabel: 'Data rows',
        bindingStatus: 'valid',
        sourceOutputRole: 'rows',
        targetInputRole: 'data_rows',
      },
    ),
    edge(
      'source-keyword-rules',
      'logic-classify-source-rows',
      'referenced_by',
      'Keyword rule Source is referenced by the Keyword Mapper.',
      1,
      {
        bindingLabel: 'Keyword rules',
        bindingStatus: 'valid',
        sourceOutputRole: 'keyword_rules',
        targetInputRole: 'keyword_rules',
      },
    ),
    edge(
      'source-financial-statements-notes',
      'logic-classify-source-rows',
      'referenced_by',
      'Statements and notes are referenced by source row classification.',
    ),
    edge(
      'source-inclusion-rate-constant',
      'logic-taxable-capital-gains',
      'provides_data_to',
      'Inclusion rate provides data to taxable capital gains formula.',
    ),
    edge(
      'source-fx-rate-override',
      'logic-taxable-capital-gains',
      'provides_data_to',
      'FX rate source provides the rate for the sample formula.',
    ),
    edge(
      'logic-classify-source-rows',
      'logic-property-income',
      'aggregates_into',
      'Classified rows aggregate into property income.',
      1,
      {
        bindingLabel: 'Mapped rows',
        bindingStatus: 'valid',
        sourceOutputRole: 'mapped_rows',
        targetInputRole: 'mapped_rows',
      },
    ),
    edge(
      'logic-property-income',
      'logic-taxable-capital-gains',
      'transforms_into',
      'Mapped income aggregation feeds the sample formula.',
    ),
    edge(
      'logic-classify-source-rows',
      'logic-capital-gains-losses',
      'aggregates_into',
      'Classified rows aggregate into capital gains and losses.',
      1,
      {
        bindingLabel: 'Mapped rows',
        bindingStatus: 'valid',
        sourceOutputRole: 'mapped_rows',
        targetInputRole: 'mapped_rows',
      },
    ),
    edge(
      'logic-classify-source-rows',
      'logic-expenses-deductions',
      'aggregates_into',
      'Classified rows aggregate into expenses and deductions.',
      1,
      {
        bindingLabel: 'Mapped rows',
        bindingStatus: 'valid',
        sourceOutputRole: 'mapped_rows',
        targetInputRole: 'mapped_rows',
      },
    ),
    edge(
      'logic-capital-gains-losses',
      'logic-taxable-capital-gains',
      'transforms_into',
      'Capital gains aggregation transforms into taxable capital gains.',
    ),
    edge(
      'logic-expenses-deductions',
      'logic-fat-deduction',
      'transforms_into',
      'Deduction aggregation transforms into FAT deduction calculation.',
    ),
    edge(
      'source-fx-rate-api',
      'logic-fx-conversion',
      'provides_data_to',
      'API FX source provides data to conversion logic.',
    ),
    edge(
      'source-fx-rate-override',
      'logic-fx-conversion',
      'referenced_by',
      'Manual FX override is referenced by conversion logic.',
    ),
    edge(
      'logic-fx-conversion',
      'review-required-fx-rate',
      'checked_by',
      'FX conversion is checked for required rate availability.',
    ),
    edge(
      'logic-classify-source-rows',
      'review-low-confidence',
      'triggers_validation',
      'Classification confidence requires low-confidence review.',
      1,
      {
        bindingLabel: 'Low-confidence rows',
        bindingStatus: 'valid',
        sourceOutputRole: 'low_confidence_rows',
        targetInputRole: 'checked_items',
      },
    ),
    edge(
      'logic-classify-source-rows',
      'review-unmatched-rows',
      'triggers_validation',
      'Unmatched mapped rows require review before governed output.',
      1,
      {
        bindingLabel: 'Unmatched rows',
        bindingStatus: 'valid',
        sourceOutputRole: 'unmatched_rows',
        targetInputRole: 'checked_items',
      },
    ),
    edge(
      'logic-missing-source-routing',
      'review-protected-support',
      'triggers_validation',
      'Missing source routing triggers source support validation.',
    ),
    edge(
      'logic-missing-source-routing',
      'review-manual-override',
      'requires_review_by',
      'Routing logic requires manual override review when needed.',
    ),
    edge(
      'logic-missing-source-routing',
      'review-approval-gate',
      'triggers_validation',
      'Routing logic triggers approval gate validation.',
    ),
    edge(
      'logic-missing-source-routing',
      'review-output-readiness',
      'triggers_validation',
      'Routing logic triggers output readiness validation.',
    ),
    edge(
      'review-required-fx-rate',
      'protected-input-fx-rate',
      'certifies',
      'Required FX rate check certifies the protected FX Rate input.',
    ),
    edge(
      'review-protected-support',
      'protected-summary-gross',
      'certifies',
      'Source support check certifies the protected gross summary.',
    ),
    edge(
      'review-manual-override',
      'protected-input-fx-rate',
      'approves_for',
      'Manual override review approves the protected FX Rate input.',
    ),
    edge(
      'review-output-readiness',
      'protected-summary-net-fapi',
      'certifies',
      'Output readiness certifies the protected Net FAPI summary.',
    ),
  ];

  for (const [source, target] of [
    ['logic-fx-conversion', 'protected-input-fx-rate'],
    ['logic-fx-conversion', 'protected-input-reporting-currency'],
    ['logic-fx-conversion', 'protected-input-document-currency'],
    ['logic-taxable-capital-gains', 'protected-input-inclusion-rate'],
    ['logic-fat-deduction', 'protected-input-rtf'],
    ['logic-fat-deduction', 'protected-input-fat-paid'],
  ]) {
    edges.push(
      edge(source, target, 'feeds_protected_input', 'Logic feeds a governed protected input.'),
    );
  }

  edges.push(
    edge(
      'logic-taxable-capital-gains',
      'protected-input-fapi-year',
      'feeds_protected_input',
      'Taxable capital gains calculation references the governed fiscal period.',
    ),
  );

  for (const target of [
    'protected-input-fx-rate',
    'protected-input-reporting-currency',
    'protected-input-document-currency',
    'protected-input-fapi-year',
    'protected-input-inclusion-rate',
    'protected-input-rtf',
    'protected-input-fat-paid',
  ]) {
    edges.push(
      edge(
        'review-approval-gate',
        target,
        'approves_for',
        'Approval gate approves the governed input.',
      ),
    );
  }

  for (const target of [
    'protected-line-a',
    'protected-line-a-1',
    'protected-line-a-2',
    'protected-line-b',
    'protected-line-c',
    'protected-line-d',
    'protected-line-e',
    'protected-line-f',
    'protected-line-f-1',
    'protected-line-g',
    'protected-line-h',
  ]) {
    edges.push(
      edge(
        'review-approval-gate',
        target,
        'approves_for',
        'Approval gate approves the official line.',
      ),
    );
  }

  for (const [source, target] of [
    ['logic-property-income', 'protected-line-a'],
    ['logic-capital-gains-losses', 'protected-line-a-1'],
    ['logic-taxable-capital-gains', 'protected-line-a-2'],
    ['logic-expenses-deductions', 'protected-line-b'],
    ['logic-fat-deduction', 'protected-line-c'],
    ['logic-fx-conversion', 'protected-line-d'],
    ['logic-fat-deduction', 'protected-line-e'],
    ['logic-taxable-capital-gains', 'protected-line-f'],
    ['logic-fx-conversion', 'protected-line-f-1'],
    ['logic-capital-gains-losses', 'protected-line-g'],
    ['logic-expenses-deductions', 'protected-line-h'],
    ['logic-property-income', 'protected-summary-gross'],
    ['logic-expenses-deductions', 'protected-summary-deductions'],
    ['logic-taxable-capital-gains', 'protected-summary-fapi-brut'],
    ['logic-fat-deduction', 'protected-summary-fat-deduction'],
    ['logic-taxable-capital-gains', 'protected-summary-net-fapi'],
    ['logic-capital-gains-losses', 'protected-summary-fapl-loss'],
  ]) {
    edges.push(
      edge(source, target, 'feeds_protected_result', 'Logic feeds a governed protected result.'),
    );
  }

  for (const [source, target] of [
    ['protected-summary-gross', 'output-csv-export'],
    ['protected-summary-deductions', 'output-excel-export'],
    ['protected-summary-fapi-brut', 'output-pdf-review-pack'],
    ['protected-summary-fat-deduction', 'output-evidence-pack'],
    ['protected-summary-net-fapi', 'output-canonical-json'],
    ['protected-summary-net-fapi', 'output-evidence-pack'],
    ['protected-summary-net-fapi', 'output-taxprep-handoff'],
    ['protected-summary-fapl-loss', 'output-onesource-handoff'],
  ]) {
    edges.push(
      edge(
        source,
        target,
        target.includes('handoff') ? 'included_in_handoff' : 'maps_to_output',
        'Protected summary maps to the local output preview.',
      ),
    );
  }

  return edges;
}
