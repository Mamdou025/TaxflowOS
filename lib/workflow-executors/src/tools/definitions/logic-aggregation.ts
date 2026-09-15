import { type ToolDefinition } from '../types';
import { collectRows, collectEvidence, collectSourceTrace } from '../rows';
import { asStringArray, completeResult, makeLog } from '../primitives';
import {
  MAPPED_ROWS_INPUT_ROLE,
  getToolInputSchema,
  SUBTOTAL_OUTPUT_ROLE,
  INCLUDED_ROWS_OUTPUT_ROLE,
  EXCLUDED_ROWS_OUTPUT_ROLE,
  getToolOutputSchema,
} from '../ports';

export const logicAggregationTool: ToolDefinition = {
  defaultConfig: { aggregationMethod: 'sum', amountField: 'amount' },
  description: 'Aggregates mapped or numeric rows with local sum logic.',
  displayName: 'Aggregation',
  execute: (context) => {
    const rows = collectRows(context);
    const includeTargets = asStringArray(context.config.includeTargets);
    const includeSectionIds = asStringArray(context.config.includeSectionIds);
    const includeSubsectionIds = asStringArray(context.config.includeSubsectionIds);
    const excludeTargets = asStringArray(context.config.excludeTargets);
    const includedRows = rows.filter((row) => {
      const target = row.target || '';
      const sectionId = row.sectionId || row.lineId || '';
      const subsectionId = row.subsectionId || '';
      const included =
        (includeTargets.length === 0 || includeTargets.includes(target)) &&
        (includeSectionIds.length === 0 || includeSectionIds.includes(sectionId)) &&
        (includeSubsectionIds.length === 0 || includeSubsectionIds.includes(subsectionId));
      const excluded = excludeTargets.length > 0 && excludeTargets.includes(target);
      return included && !excluded;
    });
    const excludedRows = rows.filter(
      (row) => !includedRows.some((included) => included.rowId === row.rowId),
    );
    const subtotal = includedRows.reduce((total, row) => total + row.amount, 0);
    const currency =
      includedRows.find((row) => row.currency)?.currency || String(context.config.currency || '');
    const subtotalResult = {
      currency: currency || undefined,
      excludedRows: excludedRows.map((row) => row.rowId),
      formulaTrace:
        includedRows.length === 0
          ? '0 = no included rows'
          : `${subtotal} = ${includedRows.map((row) => row.amount).join(' + ')}`,
      includedRows: includedRows.map((row) => row.rowId),
      sectionId: includeSectionIds[0],
      subsectionId: includeSubsectionIds[0],
      value: subtotal,
    };
    const aggregationSummary = {
      excludedCount: excludedRows.length,
      includedCount: includedRows.length,
      subtotal,
    };
    const warnings = includedRows.length === 0 ? ['No rows matched the aggregation filters.'] : [];

    return completeResult({
      context,
      evidenceRefs: collectEvidence(context),
      logs: [
        makeLog({
          blockId: context.block.id,
          details: { includedRows: includedRows.length, subtotal },
          level: warnings.length > 0 ? 'warning' : 'info',
          message: 'Aggregation completed with deterministic sum.',
        }),
      ],
      output: {
        aggregationSummary,
        aggregation_summary: aggregationSummary,
        aggregationMethod: 'sum',
        excludedRows,
        formulaTrace: subtotalResult.formulaTrace,
        includedRows,
        subtotal: subtotalResult,
        subtotalValue: subtotal,
        value: subtotal,
      },
      sourceTrace: collectSourceTrace(context),
      status: warnings.length > 0 ? 'warning' : 'success',
      warnings,
    });
  },
  family: 'Logic',
  inputRoles: [MAPPED_ROWS_INPUT_ROLE],
  inputSchema: getToolInputSchema([{ key: 'mappedRows', type: 'array' }]),
  outputRoles: [
    SUBTOTAL_OUTPUT_ROLE,
    INCLUDED_ROWS_OUTPUT_ROLE,
    EXCLUDED_ROWS_OUTPUT_ROLE,
    {
      canRouteToFamilies: ['Output', 'Review / Validation'],
      description: 'Formula trace and aggregation metadata.',
      id: 'aggregation_summary',
      label: 'Aggregation summary',
      outputKey: 'aggregationSummary',
      outputType: 'aggregation_summary',
      samplePreview: '5 row(s) summed by amount',
    },
  ],
  outputSchema: getToolOutputSchema([{ key: 'subtotal', type: 'object' }]),
  runMode: 'local_mock',
  subtype: 'Aggregation',
  toolGroup: 'calculation',
  toolId: 'logic.aggregation',
};
