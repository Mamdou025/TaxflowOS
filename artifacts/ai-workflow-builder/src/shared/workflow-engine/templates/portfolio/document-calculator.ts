import type { PortfolioWorkflowDef } from './portfolio-workflows';

export const DOCUMENT_CALCULATOR: PortfolioWorkflowDef = {
  id: 'pf-document-calculator', name: 'Document Calculator', group: 'demo',
  sub: 'Document → keyword rules → groups → calculations → results',
  description: 'A neutral starting point for any subject. Upload and review a document, classify records, aggregate numeric fields, and calculate your final results. The editable example matches “Item” and doubles its total. No tax categories or tax rates are included.',
  blocks: [
    { catalogId: 'trigger:manual', id: 'start', label: 'Start', description: 'Readiness is advisory; you can always start a manual test.', stage: 0, row: 0, config: { readinessConditions: [{ id: 'document-ready', kind: 'document', sourceId: 'pf-document-calculator--document' }] } },
    { catalogId: 'source:excel-workbook', id: 'document', label: 'Document', description: 'Upload a document and choose its text and numeric fields.', stage: 1, row: 0, config: { sourceKind: 'manual_table', toolId: 'source.manual_table', rows: [], manualRows: [], requireUpload: true } },
    { catalogId: 'logic:classification-mapping', id: 'rules', label: 'Keyword rules', description: 'Edit the example keyword or add your own categories.', stage: 2, row: 0, config: { toolId: 'logic.keyword_mapper', matchFields: ['label', 'description'], keywordRules: [{ ruleId: 'items', categoryId: 'items', categoryLabel: 'Items', keyword: 'Item', matchType: 'contains', matchField: 'label', priority: 1, confidence: 1, enabled: true }], unmatchedStrategy: 'send_to_review' } },
    { catalogId: 'logic:category-rollup-aggregator', id: 'groups', label: 'Aggregation groups', description: 'Combine categories into named totals.', stage: 3, row: 0, config: { toolId: 'logic.category_rollup_aggregator', rollupRules: [{ rollupId: 'item_total', label: 'Item total', operation: 'sum', includeCategoryIds: ['items'] }] } },
    { catalogId: 'logic:calculation-engine', id: 'calculate', label: 'Calculate', description: 'Use groups, connected fields, or numbers. Keep precision unless you explicitly round.', stage: 4, row: 0, config: { toolId: 'logic.calculation_engine', mode: 'inline', formulas: [{ calculationId: 'total', resultKey: 'RESULT', label: 'Adjusted total', operands: [], operation: 'pass_through', formulaExpression: 'item_total * 2', unit: 'units' }] } },
    { catalogId: 'output:canonical-json', id: 'result', label: 'Final result', description: 'Review final values or export their structured representation.', stage: 5, row: 0, config: {} },
  ],
  edges: [
    { from: 'start', to: 'document', label: 'Start', reason: 'Manual start', rel: 'triggers' },
    { from: 'document', to: 'rules', label: 'Document records', reason: 'Classify uploaded text', fromRole: 'rows', toRole: 'rows' },
    { from: 'rules', to: 'groups', label: 'Classified records', reason: 'Aggregate matched records', fromRole: 'mapped_rows', toRole: 'mapped_rows' },
    { from: 'groups', to: 'calculate', label: 'Group totals', reason: 'Use named totals in calculations', fromRole: 'named_values', toRole: 'named_values' },
    { from: 'calculate', to: 'result', label: 'Calculated results', reason: 'Publish final values', fromRole: 'calculated_results', toRole: 'calculated_results' },
  ],
};
