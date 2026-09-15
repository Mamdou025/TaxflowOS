import { type BlockSubtype } from '@workspace/workflow-executors/workflow/contracts';
import { type ToolDefinition } from './types';
import { collectRows, collectEvidence, collectSourceTrace } from './rows';
import { DEFAULT_TABLE_ROWS } from './samples';
import { completeResult, makeLog } from './primitives';
import { getToolInputSchema, ROWS_OUTPUT_ROLE, getToolOutputSchema } from './ports';

export function createMockParserTool({
  displayName,
  subtype,
  toolId,
}: {
  displayName: string;
  subtype: BlockSubtype;
  toolId: string;
}): ToolDefinition {
  return {
    defaultConfig: {},
    description:
      'Local parser stub that preserves Source lineage until real parser integration is added.',
    displayName,
    execute: (context) => {
      const upstreamRows = collectRows(context);
      const rows = upstreamRows.length > 0 ? upstreamRows : DEFAULT_TABLE_ROWS;
      const warning = 'Mock parser only in v1. Real parser integration comes later.';

      return completeResult({
        context,
        evidenceRefs: collectEvidence(context),
        logs: [
          makeLog({
            blockId: context.block.id,
            details: { rowCount: rows.length },
            level: 'warning',
            message: warning,
          }),
        ],
        output: {
          mockOnly: true,
          parserNotice: warning,
          rows: rows.map((row) => ({
            ...row,
            parsedBy: toolId,
            sourceMutation: false,
          })),
          sourceMutation: false,
        },
        sourceTrace: collectSourceTrace(context),
        status: 'warning',
        warnings: [warning],
      });
    },
    family: 'Logic',
    inputRoles: [
      {
        acceptedFamilies: ['Source'],
        allowMultiple: true,
        description: 'Immutable document, workbook, or API response Source.',
        id: 'source_evidence',
        label: 'Source evidence',
        required: true,
      },
    ],
    inputSchema: getToolInputSchema([{ key: 'sourceEvidence', type: 'object' }]),
    outputRoles: [
      {
        ...ROWS_OUTPUT_ROLE,
        description: 'Mock parser output rows that preserve lineage to the Source.',
        outputType: 'parsed_table',
      },
    ],
    outputSchema: getToolOutputSchema([
      { key: 'rows', type: 'array' },
      { key: 'parserNotice', type: 'string' },
    ]),
    runMode: 'local_mock',
    subtype,
    toolGroup: 'data_extraction',
    toolId,
  };
}
