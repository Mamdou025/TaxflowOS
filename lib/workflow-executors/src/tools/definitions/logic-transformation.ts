import { type ToolDefinition } from '../types';
import { collectRows, collectEvidence, collectSourceTrace } from '../rows';
import { completeResult, makeLog } from '../primitives';
import {
  DATA_ROWS_INPUT_ROLE,
  getToolInputSchema,
  ROWS_OUTPUT_ROLE,
  getToolOutputSchema,
} from '../ports';

export const logicTransformationTool: ToolDefinition = {
  defaultConfig: { transformation: 'pass_through_editable_copy' },
  description: 'Creates downstream transformed copies while preserving lineage.',
  displayName: 'Transformation',
  execute: (context) => {
    const rows = collectRows(context);
    const transformation = String(
      context.config.transformation ||
        context.config.transformationMode ||
        'pass_through_editable_copy',
    );
    const transformedRows = rows.map((row) => {
      if (transformation === 'normalize_sign') {
        return { ...row, amount: Math.abs(row.amount), transformed: true };
      }
      if (transformation === 'normalize_currency_label') {
        return {
          ...row,
          currency: context.config.currency || 'CAD',
          transformed: true,
        };
      }
      return { ...row, editableCopy: true, transformed: true };
    });

    return completeResult({
      context,
      evidenceRefs: collectEvidence(context),
      logs: [
        makeLog({
          blockId: context.block.id,
          details: { transformation },
          message: 'Transformation created downstream editable data.',
        }),
      ],
      output: {
        sourceMutation: false,
        transformation,
        transformedRows,
      },
      sourceTrace: collectSourceTrace(context),
      status: 'success',
    });
  },
  family: 'Logic',
  inputRoles: [DATA_ROWS_INPUT_ROLE],
  inputSchema: getToolInputSchema([{ key: 'upstream', type: 'object' }]),
  outputRoles: [
    {
      ...ROWS_OUTPUT_ROLE,
      canRouteToFamilies: ['Logic', 'Review / Validation'],
      description: 'Transformed downstream rows with Source lineage.',
      id: 'transformed_rows',
      outputKey: 'transformedRows',
      outputType: 'transformed_rows',
    },
  ],
  outputSchema: getToolOutputSchema([
    { key: 'transformedRows', type: 'array' },
    { key: 'sourceMutation', type: 'boolean' },
  ]),
  runMode: 'local_mock',
  subtype: 'Transformation',
  toolGroup: 'data_preparation',
  toolId: 'logic.transformation',
};
