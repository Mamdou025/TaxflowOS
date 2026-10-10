import type {
  CalculationInputChoice,
  CalculationInputDefinition,
  CalculationInputRequirement,
} from '@workspace/workflow-contracts/domain/calculation-inputs';
import { inferCalculationInputs, type CalculationInputRule } from './calculation-input-inference';
export type CalculationInputSource = {
  blockId: string;
  output: unknown;
  /** Legacy isolated callers may omit status; recorded run callers supply it. */
  status?: string;
  stale?: boolean;
};
export type CalculationInputOptions = {
  namedValues?: Record<string, number>;
  sources?: readonly CalculationInputSource[];
};

const unsafeNames = new Set(['__proto__', 'prototype', 'constructor']);
export const isSafeCalculationInputName = (name: unknown): name is string =>
  typeof name === 'string' && !!name.trim() && !unsafeNames.has(name);
export function isCalculationInputChoice(value: unknown): value is CalculationInputChoice {
  const choice = asRecord(value);
  if (!choice) return false;
  if (choice.kind === 'manual')
    return (
      Object.keys(choice).every((key) => ['kind', 'value'].includes(key)) &&
      (choice.value === undefined ||
        (typeof choice.value === 'number' && Number.isFinite(choice.value)))
    );
  return (
    choice.kind === 'source' &&
    Object.keys(choice).every((key) => ['kind', 'blockId', 'path'].includes(key)) &&
    isSafeCalculationInputName(choice.blockId) &&
    Array.isArray(choice.path) &&
    choice.path.length > 0 &&
    choice.path.length <= 16 &&
    choice.path.every((part) => isSafeCalculationInputName(part))
  );
}
const asRecord = (value: unknown): Record<string, unknown> | undefined =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;

function definitionsFromConfig(config: Record<string, unknown>) {
  const definitions = new Map<string, CalculationInputDefinition>();
  const errors: string[] = [];
  if (config.inputDefinitions === undefined) return { definitions, errors };
  if (!Array.isArray(config.inputDefinitions))
    return { definitions, errors: ['Calculation input definitions must be a list.'] };
  for (const value of config.inputDefinitions) {
    const entry = asRecord(value);
    const name = entry?.name;
    if (!entry || typeof name !== 'string' || !name.trim() || unsafeNames.has(name)) {
      errors.push('Each calculation input needs a valid name.');
      continue;
    }
    if (definitions.has(name)) {
      errors.push(`Calculation input ${name} is defined more than once.`);
      continue;
    }
    if (
      [entry.label, entry.unit].some((value) => value !== undefined && typeof value !== 'string')
    ) {
      errors.push(`Calculation input ${name} needs text labels and units.`);
      continue;
    }
    const binding = entry.binding === undefined ? undefined : asRecord(entry.binding);
    const validBinding =
      entry.binding === undefined ||
      binding?.kind === 'manual' ||
      (binding?.kind === 'source' &&
        typeof binding.blockId === 'string' &&
        binding.blockId.trim() &&
        Array.isArray(binding.path) &&
        binding.path.length <= 16 &&
        binding.path.every((part) => typeof part === 'string' && !unsafeNames.has(part)));
    if (
      entry.type !== 'number' ||
      !validBinding ||
      (entry.label !== undefined && typeof entry.label !== 'string') ||
      (entry.unit !== undefined && typeof entry.unit !== 'string')
    ) {
      errors.push(`Calculation input ${name} needs a number type and a valid binding.`);
      continue;
    }
    definitions.set(name, entry as unknown as CalculationInputDefinition);
  }
  return { definitions, errors };
}

function sourceNumber(value: unknown): number | undefined {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string' || !/^[+-]?(?:\d+\.?\d*|\.\d+)$/.test(value.trim()))
    return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function resolveSource(
  requirement: CalculationInputRequirement,
  sources: readonly CalculationInputSource[],
): CalculationInputRequirement {
  const binding = requirement.binding;
  if (binding?.kind !== 'source') return requirement;
  // A graph may connect more than one output role from the same source. Each edge
  // carries the same result object; that is one capture, not conflicting evidence.
  const candidates = [
    ...new Map(
      sources
        .filter((source) => source.blockId === binding.blockId)
        .map((source) => [source.output, source]),
    ).values(),
  ];
  if (candidates.length !== 1)
    return {
      ...requirement,
      origin: 'source',
      status: candidates.length ? 'invalid' : 'missing',
      message: candidates.length
        ? `More than one result was supplied for the source of ${requirement.label}.`
        : `Run the connected source for ${requirement.label}.`,
    };
  if (
    candidates[0].stale ||
    (candidates[0].status && !['success', 'warning'].includes(candidates[0].status))
  )
    return {
      ...requirement,
      origin: 'source',
      status: 'missing',
      message: `Run the selected source successfully for ${requirement.label}; its current result is unavailable or outdated.`,
    };
  let value = candidates[0].output;
  for (const part of binding.path) {
    if (!value || typeof value !== 'object' || !Object.hasOwn(value, part))
      return {
        ...requirement,
        origin: 'source',
        message: `The selected source field for ${requirement.label} is missing. Check its field mapping.`,
      };
    value = (value as Record<string, unknown>)[part];
  }
  const number = sourceNumber(value);
  return number === undefined
    ? {
        ...requirement,
        origin: 'source',
        status: 'invalid',
        message: `The selected source field for ${requirement.label} must contain a finite number.`,
      }
    : { ...requirement, origin: 'source', status: 'provided', value: number };
}

function resolveRequirement(
  requirement: CalculationInputRequirement,
  config: Record<string, unknown>,
  options: CalculationInputOptions,
): CalculationInputRequirement {
  const choices = asRecord(config.inputChoices);
  if (choices && Object.hasOwn(choices, requirement.name)) {
    const choice = choices[requirement.name];
    if (!isCalculationInputChoice(choice))
      return {
        ...requirement,
        status: 'invalid',
        message: `Choose a valid value provider for ${requirement.label}.`,
      };
    if (choice.kind === 'source')
      return resolveSource({ ...requirement, binding: choice }, options.sources ?? []);
    return choice.value === undefined
      ? {
          ...requirement,
          binding: { kind: 'manual' },
          origin: 'manual',
          message: `Enter ${requirement.label}.`,
        }
      : {
          ...requirement,
          binding: { kind: 'manual' },
          origin: 'manual',
          status: 'provided',
          value: choice.value,
        };
  }
  if (requirement.binding?.kind === 'source')
    return resolveSource(requirement, options.sources ?? []);
  if (requirement.binding?.kind === 'manual') {
    const values = asRecord(config.inputValues);
    if (!values || !Object.hasOwn(values, requirement.name))
      return { ...requirement, origin: 'manual', message: `Enter ${requirement.label}.` };
    const value = values[requirement.name];
    return typeof value === 'number' && Number.isFinite(value)
      ? { ...requirement, origin: 'manual', status: 'provided', value }
      : {
          ...requirement,
          origin: 'manual',
          status: 'invalid',
          message: `${requirement.label} must be a finite number.`,
        };
  }
  const connected = options.namedValues;
  if (
    connected &&
    Object.hasOwn(connected, requirement.name) &&
    Number.isFinite(connected[requirement.name])
  )
    return {
      ...requirement,
      origin: 'connected',
      status: 'provided',
      value: connected[requirement.name],
    };
  const defaults = asRecord(config.inputDefaults);
  const fallback = defaults?.[requirement.name];
  if (typeof fallback === 'number' && Number.isFinite(fallback))
    return { ...requirement, origin: 'default', status: 'provided', value: fallback };
  return {
    ...requirement,
    message: `Provide ${requirement.label} from a connected source or choose Enter a value.`,
  };
}

export function resolveCalculationInputs(
  rules: readonly CalculationInputRule[],
  config: Record<string, unknown>,
  options: CalculationInputOptions = {},
) {
  const { definitions, errors } = definitionsFromConfig(config);
  const warnings: string[] = [];
  const resultKeys = new Set(rules.map((rule) => rule.resultKey));
  const requiredNames = new Set(inferCalculationInputs(rules));
  const choices = asRecord(config.inputChoices);
  if (config.inputChoices !== undefined && !choices)
    errors.push('Calculation input choices must be a map.');
  for (const [name, choice] of Object.entries(choices ?? {}))
    if (
      !isSafeCalculationInputName(name) ||
      !requiredNames.has(name) ||
      !isCalculationInputChoice(choice)
    )
      errors.push(`Invalid calculation input choice: ${name}.`);
  for (const name of definitions.keys())
    if (resultKeys.has(name))
      errors.push(`${name} is a formula result and cannot also be an input.`);
  const requirements = [...requiredNames].map((name) => {
    const definition = definitions.get(name);
    return resolveRequirement(
      {
        ...definition,
        name,
        label: definition?.label || name,
        type: 'number',
        status: 'missing',
      },
      config,
      options,
    );
  });
  const values = { ...options.namedValues };
  // Preserve the existing explicit-default behavior for unbound legacy inputs.
  for (const [name, value] of Object.entries(asRecord(config.inputDefaults) ?? {})) {
    if (
      !Object.hasOwn(values, name) &&
      !definitions.get(name)?.binding &&
      !Object.hasOwn(choices ?? {}, name) &&
      !unsafeNames.has(name) &&
      typeof value === 'number' &&
      Number.isFinite(value)
    ) {
      values[name] = value;
      warnings.push(`Used your explicit default for ${name}: ${value}.`);
    }
  }
  for (const item of requirements) {
    if (item.status === 'provided' && item.value !== undefined) values[item.name] = item.value;
    else {
      delete values[item.name];
      errors.push(item.message || `Provide ${item.label}.`);
    }
  }
  return { requirements, values, errors, warnings };
}

/** The editor and execution views use the same variable discovery and status rules. */
export function describeCalculationInputs(
  rules: readonly CalculationInputRule[],
  config: Record<string, unknown>,
  options: CalculationInputOptions = {},
): CalculationInputRequirement[] {
  return resolveCalculationInputs(rules, config, options).requirements;
}
