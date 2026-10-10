import type {
  FieldWorksheetDependency,
  FieldWorksheetLineProjection,
  FieldWorksheetProjection,
  WorksheetLine,
} from '@workspace/workflow-contracts/domain/field-worksheet';
import type {
  WorkflowBlock,
  WorkflowDefinition,
} from '@workspace/workflow-contracts/domain/workflow-types';
import type { ToolRunResult } from '@workspace/workflow-contracts/tool-types';
import type { CalculationInputRequirement } from '@workspace/workflow-contracts/domain/calculation-inputs';
import {
  calculationInputOptionsFromOutputs,
  calculationValueKey,
  effectiveCalculationInputRules,
  isSafeCalculationInputName,
  resolveCalculationInputs,
  type CalculationInputRule,
  type CalculationInputOptions,
} from '../core/calculation-inputs';
import { collectFormulaReferences } from '../core/formula-references';
import { getToolIdForBlock } from '../core/tool-resolution';
import { calculationSourcesForBlock } from './calculation-session-inputs';

export type {
  FieldWorksheetDependency,
  FieldWorksheetLineProjection,
  FieldWorksheetProjection,
  WorksheetLine,
} from '@workspace/workflow-contracts/domain/field-worksheet';

type Definition = Pick<WorkflowDefinition, 'blocks' | 'edges'>;
type CalculatorState = {
  owner: WorkflowBlock;
  sources: ReturnType<typeof calculationSourcesForBlock>;
  rules: CalculationInputRule[];
  resolution: ReturnType<typeof resolveCalculationInputs>;
  result: ToolRunResult | undefined;
  stale: boolean;
};
type ProjectionCache = {
  calculations: Map<string, CalculatorState>;
  sourceOptions: Map<string, CalculationInputOptions>;
};
export type FieldWorksheetContext = {
  /** Pass the effective run definition, including accepted run-only input choices. */
  definition: Definition;
  block: WorkflowBlock;
  results?: Record<string, ToolRunResult>;
  /** Authoritative invalidation from the session or the builder's signature owner. */
  stale?: readonly string[];
  history?: readonly ToolRunResult[];
};
const record = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
const finite = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

export function readWorksheetLines(config: Record<string, unknown>) {
  const lines: WorksheetLine[] = [];
  const errors: string[] = [];
  if (config.worksheetLines === undefined) return { declared: false, lines, errors };
  if (!Array.isArray(config.worksheetLines) || config.worksheetLines.length === 0)
    return { declared: true, lines, errors: ['Declare at least one worksheet line.'] };
  const ids = new Set<string>();
  for (const [index, item] of config.worksheetLines.entries()) {
    const line = record(item);
    if (
      !line ||
      !isSafeCalculationInputName(line.id) ||
      typeof line.label !== 'string' ||
      !line.label.trim() ||
      !isSafeCalculationInputName(line.calculationBlockId) ||
      !isSafeCalculationInputName(line.resultKey) ||
      (line.unit !== undefined && typeof line.unit !== 'string')
    ) {
      errors.push(`Worksheet line ${index + 1} needs an ID, label and calculation result.`);
      continue;
    }
    if (ids.has(line.id)) {
      errors.push(`Worksheet line ID ${line.id} is declared more than once.`);
      continue;
    }
    if (
      (line.presentation !== undefined &&
        (typeof line.presentation !== 'string' ||
          !['primary', 'summary', 'detail'].includes(line.presentation))) ||
      (line.group !== undefined && typeof line.group !== 'string') ||
      (line.description !== undefined && typeof line.description !== 'string') ||
      (line.decimalPlaces !== undefined &&
        (typeof line.decimalPlaces !== 'number' ||
          !Number.isInteger(line.decimalPlaces) ||
          line.decimalPlaces < 0 ||
          line.decimalPlaces > 6))
    ) {
      errors.push(
        `Worksheet line ${index + 1} has invalid display settings. Choose primary, summary or detail, text for its group and description, and decimal places from 0 to 6.`,
      );
      continue;
    }
    ids.add(line.id);
    lines.push({
      id: line.id,
      label: line.label,
      calculationBlockId: line.calculationBlockId,
      resultKey: line.resultKey,
      ...(typeof line.unit === 'string' ? { unit: line.unit } : {}),
      ...(line.presentation === 'primary' ||
      line.presentation === 'summary' ||
      line.presentation === 'detail'
        ? { presentation: line.presentation }
        : {}),
      ...(typeof line.group === 'string' ? { group: line.group } : {}),
      ...(typeof line.description === 'string' ? { description: line.description } : {}),
      ...(typeof line.decimalPlaces === 'number' ? { decimalPlaces: line.decimalPlaces } : {}),
    });
  }
  return { declared: true, lines, errors };
}

function hasStaleAncestor(blockId: string, definition: Definition, stale: readonly string[]) {
  const pending = [blockId];
  const visited = new Set<string>();
  while (pending.length) {
    const id = pending.pop()!;
    if (stale.includes(id)) return true;
    if (visited.has(id)) continue;
    visited.add(id);
    for (const edge of definition.edges)
      if (edge.status === 'active' && edge.targetBlockId === id) pending.push(edge.sourceBlockId);
  }
  return false;
}

function computedValue(result: ToolRunResult | undefined, key: string, stale: boolean) {
  if (stale)
    return { status: 'stale' as const, message: 'Rerun the calculation after its inputs changed.' };
  if (!result || result.status === 'skipped')
    return { status: 'missing' as const, message: 'Waiting for the calculation.' };
  if (!['success', 'warning'].includes(result.status))
    return {
      status: 'invalid' as const,
      message: result.errors[0] ?? 'The calculation has not produced a usable result.',
    };
  const backend = record(result.output.backendOutputs);
  const values =
    record(result.output.calculatedResults) ??
    record(record(backend?.calculated_results)?.calculatedResults);
  if (!values || !Object.hasOwn(values, key))
    return {
      status: 'missing' as const,
      message: `The calculation has no recorded result for ${key}.`,
    };
  const value = values[key];
  return finite(value)
    ? { status: 'current' as const, value }
    : { status: 'invalid' as const, message: `${key} is not a finite number.` };
}

function ruleReferences(rule: CalculationInputRule) {
  return rule.formulaExpression?.trim()
    ? collectFormulaReferences(rule.formulaExpression)
    : [
        ...new Set(
          (rule.operands ?? []).filter((value): value is string => typeof value === 'string'),
        ),
      ];
}
function ruleFormula(rule: CalculationInputRule) {
  return (
    rule.formulaExpression ??
    (rule.operation ? `${rule.operation}(${(rule.operands ?? []).join(', ')})` : undefined)
  );
}

function recordedOperandMismatch(
  result: ToolRunResult | undefined,
  key: string,
  dependencies: readonly FieldWorksheetDependency[],
) {
  const backend = record(result?.output.backendOutputs);
  const trace =
    record(result?.output.formulaTrace) ?? record(record(backend?.formula_trace)?.formulaTrace);
  const inputs = record(trace?.[key])?.inputValues;
  if (!Array.isArray(inputs)) return;
  for (const input of inputs) {
    const captured = record(input);
    if (typeof captured?.operand !== 'string' || !finite(captured.value)) continue;
    const dependency = dependencies.find((item) => item.key === captured.operand);
    if (dependency?.status === 'current' && dependency.value !== captured.value)
      return `Recorded operand ${captured.operand} was ${captured.value}, but its displayed dependency is ${dependency.value}. Review input/result names and rerun the calculation.`;
  }
  return undefined;
}

function inputDependency(
  requirement: CalculationInputRequirement | undefined,
  key: string,
  context: FieldWorksheetContext,
): FieldWorksheetDependency {
  const binding = requirement?.binding;
  const provider = binding?.kind === 'source' ? context.results?.[binding.blockId] : undefined;
  const stale =
    binding?.kind === 'source' &&
    hasStaleAncestor(binding.blockId, context.definition, context.stale ?? []);
  return {
    key,
    label: requirement?.label ?? key,
    kind: 'input',
    status: stale
      ? 'stale'
      : requirement?.status === 'provided'
        ? 'current'
        : (requirement?.status ?? 'missing'),
    ...(requirement?.status === 'provided' && !stale ? { value: requirement.value } : {}),
    unit: requirement?.unit,
    origin: requirement?.origin,
    binding,
    message: stale ? 'The selected source needs to run again.' : requirement?.message,
    dependencies: [],
    evidenceRefs: provider?.evidenceRefs ?? [],
    sourceTrace: provider?.sourceTrace ?? [],
  };
}

function projectLine(
  line: WorksheetLine,
  context: FieldWorksheetContext,
  cache: ProjectionCache,
): FieldWorksheetLineProjection {
  const { definition, block, results = {}, stale = [], history = [] } = context;
  const calculation = definition.blocks.find((item) => item.id === line.calculationBlockId);
  const base = { ...line, dependencies: [], evidenceRefs: [], sourceTrace: [] };
  if (!calculation || getToolIdForBlock(calculation) !== 'logic.calculation_engine')
    return { ...base, status: 'invalid', message: 'Choose a calculation block for this line.' };
  if (
    !definition.edges.some(
      (edge) =>
        edge.status === 'active' &&
        edge.sourceBlockId === calculation.id &&
        edge.targetBlockId === block.id,
    )
  )
    return {
      ...base,
      status: 'invalid',
      message: 'Connect this calculation directly to the worksheet.',
    };
  const stateFor = (owner: WorkflowBlock): CalculatorState => {
    const sources = calculationSourcesForBlock(owner, definition, results, stale, history);
    const rules = effectiveCalculationInputRules(owner, definition, sources);
    return {
      owner,
      sources,
      rules,
      resolution: resolveCalculationInputs(
        rules,
        owner.config,
        calculationInputOptionsFromOutputs(sources),
      ),
      result: results[owner.id],
      stale: hasStaleAncestor(owner.id, definition, stale),
    };
  };
  const state = (owner: WorkflowBlock) => {
    if (!cache.calculations.has(owner.id)) cache.calculations.set(owner.id, stateFor(owner));
    return cache.calculations.get(owner.id)!;
  };
  const { rules, resolution } = state(calculation);
  const matching = rules.filter((rule) => rule.resultKey === line.resultKey);
  if (matching.length !== 1)
    return {
      ...base,
      calculationLabel: calculation.label,
      status: 'invalid',
      message: matching.length
        ? 'The calculation result key is duplicated.'
        : 'This result is not declared in the calculation formulas.',
    };
  const providerFor = (
    owner: WorkflowBlock,
    requirement: CalculationInputRequirement | undefined,
    key: string,
  ) => {
    if (
      requirement?.origin === 'manual' ||
      requirement?.origin === 'default' ||
      requirement?.binding?.kind === 'manual'
    )
      return;
    const incoming = definition.edges
      .filter((edge) => edge.status === 'active' && edge.targetBlockId === owner.id)
      .map((edge) => edge.sourceBlockId);
    const choices = definition.blocks.filter((candidate) => incoming.includes(candidate.id));
    const binding = requirement?.binding;
    if (binding?.kind === 'source') {
      const source = choices.find((candidate) => candidate.id === binding.blockId);
      if (!source || getToolIdForBlock(source) !== 'logic.calculation_engine') return;
      const paths = (name: string) => [
        ['calculatedResults', name],
        ['namedValues', name],
        ['backendOutputs', 'calculated_results', 'calculatedResults', name],
        ['backendOutputs', 'named_values', 'namedValues', name],
      ];
      const match = state(source).rules.find((rule) =>
        paths(rule.resultKey).some((path) => JSON.stringify(path) === JSON.stringify(binding.path)),
      );
      return match ? { source, key: match.resultKey } : undefined;
    }
    // Named legacy inputs have no explicit binding. Expand only an unambiguous
    // provider identity, never select a source by comparing equal numeric values.
    const providers = state(owner).sources.filter((source) => {
      if (!cache.sourceOptions.has(source.blockId))
        cache.sourceOptions.set(source.blockId, calculationInputOptionsFromOutputs([source]));
      return Object.hasOwn(cache.sourceOptions.get(source.blockId)?.namedValues ?? {}, key);
    });
    const unique = [...new Set(providers.map((source) => source.blockId))];
    const source = choices.find(
      (candidate) =>
        candidate.id ===
        (unique.length === 1
          ? unique[0]
          : unique.length === 0 && choices.length === 1
            ? choices[0].id
            : undefined),
    );
    if (!source || getToolIdForBlock(source) !== 'logic.calculation_engine') return;
    const match = state(source).rules.find(
      (rule) =>
        rule.resultKey === key ||
        [
          ['calculatedResults', rule.resultKey],
          ['namedValues', rule.resultKey],
        ].some((path) => calculationValueKey(source.id, path) === key),
    );
    return match ? { source, key: match.resultKey } : undefined;
  };
  let count = 0;
  const dependency = (
    owner: WorkflowBlock,
    key: string,
    ancestors: readonly string[],
  ): FieldWorksheetDependency => {
    const current = state(owner);
    const rule = current.rules.find((item) => item.resultKey === key);
    if (!rule) {
      const requirement = current.resolution.requirements.find((item) => item.name === key);
      const input = inputDependency(requirement, key, context);
      const provider = providerFor(owner, requirement, key);
      if (provider) {
        const calculated = dependency(provider.source, provider.key, ancestors);
        input.dependencies = [calculated];
        if (
          calculated.status === 'invalid' ||
          (input.status === 'current' && calculated.status !== 'current')
        ) {
          input.status = calculated.status === 'missing' ? 'stale' : calculated.status;
          input.message = calculated.message;
          delete input.value;
        }
      }
      return input;
    }
    const identity = `${owner.id}\u0000${key}`;
    const node = {
      key,
      label: rule.label ?? key,
      kind: 'calculation' as const,
      calculationBlockId: owner.id,
      calculationLabel: owner.label,
      formula: ruleFormula(rule),
      unit: rule.unit,
      evidenceRefs: current.result?.evidenceRefs ?? [],
      sourceTrace: current.result?.sourceTrace ?? [],
    };
    count += 1;
    if (ancestors.includes(identity) || count > 256)
      return {
        ...node,
        status: 'invalid',
        message: ancestors.includes(identity)
          ? 'Circular calculation dependency.'
          : 'Dependency display limit reached.',
        dependencies: [],
      };
    const dependencies = ruleReferences(rule).map((ref) =>
      dependency(owner, ref, [...ancestors, identity]),
    );
    const value = computedValue(current.result, key, current.stale);
    const invalid = dependencies.find((item) => item.status === 'invalid');
    if (invalid) return { ...node, status: 'invalid', message: invalid.message, dependencies };
    const mismatch =
      value.status === 'current' && recordedOperandMismatch(current.result, key, dependencies);
    if (mismatch) return { ...node, status: 'invalid', message: mismatch, dependencies };
    if (value.status === 'current' && dependencies.some((item) => item.status !== 'current'))
      return {
        ...node,
        status: 'stale',
        message: 'The recorded result no longer has current inputs. Run the calculation again.',
        dependencies,
      };
    return { ...node, ...value, dependencies };
  };
  const projected = dependency(calculation, line.resultKey, []);
  return {
    ...line,
    calculationLabel: calculation.label,
    unit: line.unit ?? projected.unit,
    status: projected.status,
    value: projected.value,
    formula: projected.formula,
    message:
      projected.message ?? (projected.status !== 'current' ? resolution.errors[0] : undefined),
    dependencies: projected.dependencies,
    evidenceRefs: projected.evidenceRefs,
    sourceTrace: projected.sourceTrace,
  };
}

/** Read projection only: it never calculates, changes providers or bypasses graph prerequisites. */
export function projectFieldWorksheet(context: FieldWorksheetContext): FieldWorksheetProjection {
  const declared = readWorksheetLines(context.block.config);
  // Every line reads the same run snapshot. Enumerate each calculator/provider
  // once here, without retaining cached values across edits or source refreshes.
  const cache: ProjectionCache = { calculations: new Map(), sourceOptions: new Map() };
  return { ...declared, lines: declared.lines.map((line) => projectLine(line, context, cache)) };
}
