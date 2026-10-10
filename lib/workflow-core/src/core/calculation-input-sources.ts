import {
  calculationValueKey,
  numericOutputFields,
  collectNamedValuesFromBackendInput,
} from './calculation-input-values';
import type {
  CalculationInputSource,
  CalculationInputOptions,
} from './calculation-input-resolution';
const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
const numericRoles = ['named_values', 'protected_inputs', 'fapi_inputs'];

/** Shared runtime projection also used by readiness and editor previews. */
export function calculationInputOptionsFromRoles(
  inputsByRole: Record<string, unknown[]>,
): CalculationInputOptions {
  const sources = (inputsByRole.calculation_sources ?? []) as CalculationInputSource[];
  const namedValues: Record<string, number> = {};
  for (const source of sources)
    if (!source.stale && (!source.status || ['success', 'warning'].includes(source.status)))
      for (const field of numericOutputFields(source.output))
        namedValues[calculationValueKey(source.blockId, field.path)] = field.value;
  for (const role of numericRoles)
    for (const input of inputsByRole[role] ?? [])
      for (const [key, value] of collectNamedValuesFromBackendInput(input))
        namedValues[key] = value;
  return { sources, namedValues };
}

/** Mirrors the existing backend adapter's numeric output roles, preserving merge order. */
export function calculationInputOptionsFromOutputs(
  sources: readonly CalculationInputSource[],
): CalculationInputOptions {
  const roles: Record<string, unknown[]> = { calculation_sources: [...sources] };
  const add = (role: string, value: unknown) => {
    if (value !== undefined) (roles[role] ??= []).push(value);
  };
  for (const source of sources) {
    if (source.stale || (source.status && !['success', 'warning'].includes(source.status)))
      continue;
    const output = asRecord(source.output);
    if (!output) continue;
    const backend = asRecord(output.backendOutputs);
    if (backend) {
      for (const role of numericRoles) add(role, backend[role]);
    } else {
      for (const key of ['namedValues', 'calculatedResults'])
        if (asRecord(output[key])) add('named_values', { [key]: output[key] });
      if (asRecord(output.fapiInputs)) add('fapi_inputs', { fapiInputs: output.fapiInputs });
    }
  }
  return calculationInputOptionsFromRoles(roles);
}
