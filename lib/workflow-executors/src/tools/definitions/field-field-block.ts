import { type ToolDefinition } from '../types';
import { asRecord, completeResult, makeLog } from '../primitives';
import { collectEvidence, collectSourceTrace } from '../rows';
import { getToolInputSchema, getToolOutputSchema } from '../ports';

export const fieldFieldBlockTool: ToolDefinition = {
  defaultConfig: {},
  description: 'Displays computed values sourced from upstream logic blocks.',
  displayName: 'Field Block',
  execute: (context) => {
    const computedValues: Record<string, unknown> = {};
    for (const result of context.upstreamResults) {
      const output = asRecord(result.output) ?? {};
      const namedValues = asRecord(output.namedValues ?? output.calculatedResults) ?? {};
      for (const [k, v] of Object.entries(namedValues)) {
        computedValues[k] = v;
      }
    }
    return completeResult({
      context,
      evidenceRefs: collectEvidence(context),
      logs: [
        makeLog({
          blockId: context.block.id,
          level: 'info',
          message: `Field block displaying ${Object.keys(computedValues).length} computed value(s).`,
        }),
      ],
      output: { computedValues },
      sourceTrace: collectSourceTrace(context),
      status: 'success',
      warnings: [],
    });
  },
  family: 'Field',
  inputRoles: [
    {
      acceptedFamilies: ['Logic', 'Field'],
      acceptedOutputTypes: [
        'named_values',
        'calculated_results',
        'rollup_totals',
        'final_totals',
        'computed_values',
      ],
      allowMultiple: true,
      description: 'Computed values produced by an upstream logic block.',
      id: 'computed_values',
      label: 'Computed values',
      required: false,
    },
  ],
  inputSchema: getToolInputSchema([{ key: 'computedValues', type: 'object' }]),
  outputRoles: [
    {
      canRouteToFamilies: ['Output'],
      description: 'Computed field values passed downstream.',
      id: 'computed_values',
      label: 'Computed values',
      outputKey: 'computedValues',
      outputType: 'computed_values',
    },
  ],
  outputSchema: getToolOutputSchema([{ key: 'computedValues', type: 'object' }]),
  runMode: 'local_mock',
  subtype: 'Field Block',
  toolGroup: 'field',
  toolId: 'field.field_block',
};
