import { type ToolDefinition } from '../types';
import { collectExportRows, resolveExportColumns, toCsv, slugify } from '../output-evidence';
import { completeResult, makeLog } from '../primitives';
import { collectEvidence, collectSourceTrace } from '../rows';
import {
  MAPPED_ROWS_INPUT_ROLE,
  SOURCE_TRACE_INPUT_ROLE,
  getToolInputSchema,
  OUTPUT_PACKAGE_ROLE,
  getToolOutputSchema,
} from '../ports';

export const outputCsvExportTool: ToolDefinition = {
  defaultConfig: { fileName: 'workflow-rows.csv' },
  description:
    "Serialises the workflow's rows to CSV text. Pure — the browser turns the text into a download.",
  displayName: 'CSV Export',
  execute: (context) => {
    const rows = collectExportRows(context);
    const columns = resolveExportColumns(rows, context.config.columns);
    const csv = toCsv(rows, columns);
    const fileName = String(context.config.fileName || `${slugify(context.workflow.name)}.csv`);
    const warnings = rows.length === 0 ? ['No rows reached the CSV export.'] : [];

    return completeResult({
      context,
      evidenceRefs: collectEvidence(context),
      logs: [
        makeLog({
          blockId: context.block.id,
          details: { columns: columns.length, rowCount: rows.length },
          level: warnings.length > 0 ? 'warning' : 'info',
          message: 'CSV export generated locally.',
        }),
      ],
      output: {
        columns,
        csv,
        exportFormat: 'csv',
        fileName,
        generatedAt: new Date().toISOString(),
        mimeType: 'text/csv;charset=utf-8',
        preview: csv.split('\n').slice(0, 12).join('\n'),
        rowCount: rows.length,
        warnings,
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
      description: 'CSV text ready for download.',
      id: 'csv_file',
      label: 'CSV file',
      outputKey: 'csv',
      outputType: 'csv_file',
    },
  ],
  outputSchema: getToolOutputSchema([
    { key: 'csv', type: 'string' },
    { key: 'fileName', type: 'string' },
  ]),
  runMode: 'local_mock',
  subtype: 'CSV Export',
  toolGroup: 'output',
  toolId: 'output.csv_export',
};
