import { type ToolDefinition } from '../types';
import { asRecord, completeResult, makeLog } from '../primitives';
import { collectEvidence, collectSourceTrace } from '../rows';
import { getToolInputSchema, getToolOutputSchema } from '../ports';
import { projectFieldWorksheet } from '@workspace/workflow-core/field-worksheet';

export const fieldFieldBlockTool: ToolDefinition = {
  defaultConfig: {},
  description: 'Displays computed values sourced from upstream logic blocks.',
  displayName: 'Field Block',
  execute: (context) => {
    const worksheet = projectFieldWorksheet({
      definition: context.workflow,
      block: { ...context.block, config: context.config },
      results: context.allResults,
    });
    if (worksheet.declared) {
      const invalid = worksheet.lines.filter((line) => line.status === 'invalid');
      const pending = worksheet.lines.filter((line) => line.status !== 'current');
      const errors = [
        ...worksheet.errors,
        ...invalid.map((line) => `${line.label}: ${line.message}`),
      ];
      return completeResult({
        context,
        output: {
          computedValues: Object.fromEntries(
            worksheet.lines
              .filter((line) => line.status === 'current')
              .map((line) => [line.id, line.value]),
          ),
          worksheet,
        },
        status: errors.length ? 'error' : pending.length ? 'needs_review' : 'success',
        errors,
        warnings: pending
          .filter((line) => line.status !== 'invalid')
          .map((line) => `${line.label}: ${line.message}`),
        evidenceRefs: collectEvidence(context),
        sourceTrace: collectSourceTrace(context),
      });
    }
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
  outputSchema: getToolOutputSchema([
    { key: 'computedValues', type: 'object' },
    { key: 'worksheet', type: 'object' },
  ]),
  runMode: 'local_mock',
  subtype: 'Field Block',
  toolGroup: 'field',
  toolId: 'field.field_block',
};
