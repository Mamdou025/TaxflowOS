import { type ToolDefinition } from '../types';
import { collectExportRows, resolveExportColumns, slugify, pickColumns } from '../output-evidence';
import { asRecord, completeResult, makeLog } from '../primitives';
import { collectEvidence, collectSourceTrace } from '../rows';
import {
  MAPPED_ROWS_INPUT_ROLE,
  SOURCE_TRACE_INPUT_ROLE,
  getToolInputSchema,
  OUTPUT_PACKAGE_ROLE,
  getToolOutputSchema,
} from '../ports';

export const outputExcelExportTool: ToolDefinition = {
  defaultConfig: { fileName: 'workflow-export.xlsx' },
  description:
    'Builds a multi-sheet workbook spec (rows + category totals + run summary) for the browser to write as .xlsx.',
  displayName: 'Excel Export',
  execute: (context) => {
    const rows = collectExportRows(context);
    const columns = resolveExportColumns(rows, context.config.columns);
    const fileName = String(context.config.fileName || `${slugify(context.workflow.name)}.xlsx`);

    // Category totals, when a rollup ran upstream.
    const totals = context.upstreamResults.flatMap((result) => {
      const named = asRecord(result.output.calculatedResults ?? result.output.namedValues);
      return named
        ? Object.entries(named).flatMap(([key, value]) =>
            typeof value === 'number' && Number.isFinite(value) && !key.startsWith('source:')
              ? [{ Key: key, Value: value }]
              : [],
          )
        : [];
    });

    const summary = [
      { Field: 'Workflow', Value: context.workflow.name },
      { Field: 'Run ID', Value: context.runId },
      { Field: 'Generated', Value: new Date().toISOString() },
      { Field: 'Rows exported', Value: rows.length },
    ];

    const sheets = [
      { columns, name: 'Rows', rows: rows.map((row) => pickColumns(row, columns)) },
      ...(totals.length > 0 ? [{ columns: ['Key', 'Value'], name: 'Totals', rows: totals }] : []),
      {
        columns: ['Finding'],
        name: 'Review findings',
        rows: [...new Set(context.upstreamResults.flatMap((result) => result.warnings))].map(
          (Finding) => ({ Finding }),
        ),
      },
      { columns: ['Field', 'Value'], name: 'Run summary', rows: summary },
    ];
    const warnings = rows.length === 0 ? ['No rows reached the Excel export.'] : [];

    return completeResult({
      context,
      evidenceRefs: collectEvidence(context),
      logs: [
        makeLog({
          blockId: context.block.id,
          details: { rowCount: rows.length, sheets: sheets.length },
          level: warnings.length > 0 ? 'warning' : 'info',
          message: 'Excel workbook spec generated locally.',
        }),
      ],
      output: {
        exportFormat: 'xlsx',
        fileName,
        generatedAt: new Date().toISOString(),
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        rowCount: rows.length,
        sheetNames: sheets.map((sheet) => sheet.name),
        sheets,
        warnings,
        workbookSpec: { fileName, sheets },
      },
      sourceTrace: collectSourceTrace(context),
      status: warnings.length > 0 ? 'warning' : 'success',
      warnings,
    });
  },
  family: 'Output',
  inputRoles: [MAPPED_ROWS_INPUT_ROLE, SOURCE_TRACE_INPUT_ROLE],
  inputSchema: getToolInputSchema([{ key: 'mappedRows', type: 'array' }]),
  outputRoles: [
    {
      ...OUTPUT_PACKAGE_ROLE,
      description: 'Workbook spec ready for the browser to write as .xlsx.',
      id: 'workbook_file',
      label: 'Workbook',
      outputKey: 'workbookSpec',
      outputType: 'workbook_file',
    },
  ],
  outputSchema: getToolOutputSchema([
    { key: 'sheets', type: 'array' },
    { key: 'fileName', type: 'string' },
  ]),
  runMode: 'local_mock',
  subtype: 'Excel Export',
  toolGroup: 'output',
  toolId: 'output.excel_export',
};
