import { type ToolDefinition } from '../types';
import { getProtectedValue } from '../arithmetic';
import { completeResult, makeLog } from '../primitives';
import { collectEvidence, collectSourceTrace } from '../rows';
import {
  APPROVED_VALUE_INPUT_ROLE,
  getToolInputSchema,
  GOVERNED_VALUE_OUTPUT_ROLE,
  getToolOutputSchema,
} from '../ports';

export const protectedProtectedInputTool: ToolDefinition = {
  defaultConfig: { runtimeLocked: true },
  description: 'Creates a governed runtime-locked input value.',
  displayName: 'Protected Input',
  execute: (context) => {
    const value = getProtectedValue(context);
    const warnings = value === null ? ['No protected input value found.'] : [];
    const fapiInputKey =
      typeof context.config.fapiInputKey === 'string' ? context.config.fapiInputKey : undefined;
    const fapiInputs = fapiInputKey && value !== null ? { [fapiInputKey]: value } : undefined;

    return completeResult({
      context,
      evidenceRefs: collectEvidence(context),
      logs: [
        makeLog({
          blockId: context.block.id,
          level: warnings.length > 0 ? 'warning' : 'info',
          message: 'Protected input emitted with runtime lock metadata.',
        }),
      ],
      output: {
        fapiInputs,
        governedValue: value,
        protectedKind: context.block.governance?.protectedKind || 'input',
        runtimeLocked: true,
        sourceTrace: collectSourceTrace(context),
      },
      sourceTrace: collectSourceTrace(context),
      status: warnings.length > 0 ? 'needs_review' : 'success',
      warnings,
    });
  },
  family: 'Protected',
  inputRoles: [APPROVED_VALUE_INPUT_ROLE],
  inputSchema: getToolInputSchema([{ key: 'approvedValue', type: 'object' }]),
  outputRoles: [GOVERNED_VALUE_OUTPUT_ROLE],
  outputSchema: getToolOutputSchema([
    { key: 'governedValue', type: 'number' },
    { key: 'runtimeLocked', type: 'boolean' },
  ]),
  runMode: 'local_mock',
  subtype: 'Protected Input',
  toolGroup: 'protected',
  toolId: 'protected.protected_input',
};
