import {
  collectFormulaReferences,
  isSupportedFormulaFunction,
  tokenizeFormulaExpression,
  type FormulaToken,
} from '@workspace/workflow-core/formula-references';
export { collectFormulaReferences } from '@workspace/workflow-core/formula-references';
import { error, info, warning } from '../../../runtime/events';
import {
  calculationInputOptionsFromRoles,
  resolveCalculationInputs,
  type CalculationInputRequirement,
} from '../../../../calculation-inputs';
import { dedupeEvidenceRefs, dedupeSourceTrace } from '../../../runtime/lineage';
import type { ToolExecutionContext, ToolRunResult } from '../../../runtime/types';
import type { CalculationOperand, CalculationRule } from '../../source/calculation-rules/schema';
import { collectCalculationRulesFromBackendInput, type ResolvedOperand } from './schema';

type FormulaValue = {
  display: string;
  resolvedOperands: ResolvedOperand[];
  value: number;
  warnings: string[];
};

function getRoleInputs(context: ToolExecutionContext, role: string) {
  return context.inputsByRole[role] || [];
}

function getInlineRulesFromConfig(context: ToolExecutionContext): CalculationRule[] {
  const config = context.block.config as Record<string, unknown>;
  const formulas = config.formulas ?? config.calculationRules ?? config.inlineFormulas;
  if (!formulas) {
    return [];
  }
  return collectCalculationRulesFromBackendInput(
    Array.isArray(formulas) ? formulas : { calculationRules: formulas },
  );
}

function getCalculationMode(context: ToolExecutionContext): 'auto' | 'inline' | 'external_rules' {
  const config = context.block.config as Record<string, unknown>;
  const mode = config.mode;
  if (mode === 'inline' || mode === 'external_rules') {
    return mode;
  }
  return 'auto';
}

function getRules(context: ToolExecutionContext): {
  rules: CalculationRule[];
  mode: string;
} {
  const mode = getCalculationMode(context);
  const externalRules = getRoleInputs(context, 'calculation_rules').flatMap((input) =>
    collectCalculationRulesFromBackendInput(input),
  );
  const inlineRules = getInlineRulesFromConfig(context);

  if (mode === 'external_rules') {
    return { rules: externalRules, mode: 'external_rules' };
  }
  if (mode === 'inline') {
    return { rules: inlineRules, mode: 'inline' };
  }
  // auto: prefer external if connected, else inline
  if (externalRules.length > 0) {
    return { rules: externalRules, mode: 'auto:external' };
  }
  return { rules: inlineRules, mode: 'auto:inline' };
}

function createErrorResult({
  context,
  errors,
  inputRequirements = [],
}: {
  context: ToolExecutionContext;
  errors: string[];
  inputRequirements?: CalculationInputRequirement[];
}): ToolRunResult {
  return {
    blockId: context.block.id,
    completedAt: new Date().toISOString(),
    errors,
    evidenceRefs: [],
    logs: errors.map((message) => error(message)),
    outputs: {
      calculated_results: { calculatedResults: {}, resultDetails: {} },
      calculation_summary: {
        calculatedCount: 0,
        inputCount: 0,
        ruleCount: 0,
        warningCount: 0,
        inputRequirements,
      },
      formula_trace: { formulaTrace: {} },
      named_values: { namedValues: {} },
    },
    primaryOutputRole: 'calculation_summary',
    runId: context.runId,
    sourceTrace: [],
    startedAt: context.startedAt,
    status: 'error',
    toolId: 'logic.calculation_engine',
    warnings: [],
  };
}

function getMissingInputErrors({
  configMode,
  namedValues,
  rules,
}: {
  configMode: string;
  namedValues: Record<string, number>;
  rules: CalculationRule[];
}) {
  const errors: string[] = [];
  const ruleKeys = new Set(rules.map((rule) => rule.resultKey));
  if (ruleKeys.size !== rules.length) errors.push('Calculation result keys must be unique.');
  const visited = new Set<string>();
  const visiting = new Set<string>();
  const visit = (key: string) => {
    if (visited.has(key)) return;
    if (visiting.has(key)) {
      errors.push(`Circular calculation dependency: ${key}.`);
      return;
    }
    visiting.add(key);
    const rule = rules.find((rule) => rule.resultKey === key)!;
    const refs = rule.formulaExpression
      ? collectFormulaReferences(rule.formulaExpression)
      : rule.operands.filter((operand): operand is string => typeof operand === 'string');
    refs.filter((ref) => ruleKeys.has(ref) && !Object.hasOwn(namedValues, ref)).forEach(visit);
    visiting.delete(key);
    visited.add(key);
  };
  ruleKeys.forEach(visit);
  // Numbers alone are valid formulas. Explicit source references, however,
  // must never silently turn an absent API field into a zero.
  for (const rule of rules) {
    const refs = rule.formulaExpression
      ? collectFormulaReferences(rule.formulaExpression)
      : rule.operands.filter((operand): operand is string => typeof operand === 'string');
    for (const ref of refs.filter((ref) => ref.startsWith('source:'))) {
      if (!Object.hasOwn(namedValues, ref))
        errors.push(
          `The connected field ${ref} has no numeric value. Run its source and check the selected field.`,
        );
    }
  }
  if (rules.length === 0) {
    if (configMode === 'external_rules') {
      errors.push('external_rules mode requires a connected Calculation Rules Source.');
    } else if (configMode === 'inline') {
      errors.push('inline mode requires formulas in the block config. Add at least one formula.');
    } else {
      errors.push(
        'No formulas found. Add inline formulas to the Calculation Engine block config, or connect a Calculation Rules Source.',
      );
    }
  }
  return errors;
}

function roundMoney(value: number) {
  return roundTo(value, 2);
}

// Preserve intermediate precision. Rounding is an explicit rule choice.
function roundResult(value: number, _resultKey: string) {
  return value;
}
function roundTo(value: number, digits: number) {
  // Shift the decimal representation before rounding so 1.005 rounds to
  // 1.01 instead of inheriting its binary floating-point approximation.
  const [coefficient, exponent = '0'] = Math.abs(value).toString().split('e');
  const shifted = Number(`${coefficient}e${Number(exponent) + digits}`);
  if (!Number.isFinite(shifted)) return value;
  const [rounded, roundedExponent = '0'] = Math.round(shifted).toString().split('e');
  return Math.sign(value) * Number(`${rounded}e${Number(roundedExponent) - digits}`);
}

function resolveOperand({
  namedValues,
  operand,
}: {
  namedValues: Record<string, number>;
  operand: CalculationOperand;
}): ResolvedOperand {
  if (typeof operand === 'number') {
    return { missing: false, operand, value: operand };
  }

  const value = namedValues[operand];
  return {
    missing: value === undefined,
    operand,
    value: value ?? 0,
  };
}

function createNumberFormulaValue(token: FormulaToken & { type: 'number' }) {
  return {
    display: token.text,
    resolvedOperands: [
      {
        missing: false,
        operand: token.value,
        value: token.value,
      },
    ],
    value: token.value,
    warnings: [],
  } satisfies FormulaValue;
}

function createReferenceFormulaValue({
  namedValues,
  reference,
}: {
  namedValues: Record<string, number>;
  reference: string;
}) {
  const resolved = resolveOperand({ namedValues, operand: reference });
  return {
    display: `${reference}(${resolved.value})`,
    resolvedOperands: [resolved],
    value: resolved.value,
    warnings: resolved.missing ? [`Missing operand ${reference}.`] : [],
  } satisfies FormulaValue;
}

function mergeFormulaValues({
  display,
  values,
  value,
  warnings,
}: {
  display: string;
  values: FormulaValue[];
  value: number;
  warnings?: string[];
}) {
  return {
    display,
    resolvedOperands: values.flatMap((item) => item.resolvedOperands),
    value,
    warnings: [...new Set([...values.flatMap((item) => item.warnings), ...(warnings || [])])],
  } satisfies FormulaValue;
}

function applyFormulaFunction({
  args,
  name,
  ruleId,
}: {
  args: FormulaValue[];
  name: string;
  ruleId: string;
}) {
  const normalizedName = name.toLowerCase();
  const values = args.map((arg) => arg.value);
  const warnings: string[] = [];
  const evaluators: Record<string, () => number> = {
    abs: () => Math.abs(values[0] ?? 0),
    // The condition is itself a formula value — nonzero is true, matching how
    // a comparison (> < >= <= == !=) already reports its result as 1 or 0.
    if: () => (values[0] !== 0 ? (values[1] ?? 0) : (values[2] ?? 0)),
    max: () => (values.length > 0 ? Math.max(...values) : 0),
    max_subtract_zero: () => Math.max((values[0] ?? 0) - (values[1] ?? 0), 0),
    min: () => (values.length > 0 ? Math.min(...values) : 0),
    min_multiply_cap: () =>
      Math.min(Math.max(values[0] ?? 0, 0) * (values[1] ?? 0), values[2] ?? 0),
    round: () => roundTo(values[0] ?? 0, values[1] ?? 2),
  };
  const arity: Record<string, [number, number]> = {
    abs: [1, 1],
    if: [3, 3],
    max: [1, Infinity],
    min: [1, Infinity],
    max_subtract_zero: [2, 2],
    min_multiply_cap: [3, 3],
    round: [1, 2],
  };
  const bounds = arity[normalizedName];
  if (bounds && (args.length < bounds[0] || args.length > bounds[1]))
    warnings.push(`Invalid number of arguments for ${name} in ${ruleId}.`);
  if (
    normalizedName === 'round' &&
    values[1] !== undefined &&
    (!Number.isInteger(values[1]) || values[1] < 0 || values[1] > 15)
  ) {
    warnings.push(`Rounding digits must be a whole number from 0 to 15 in ${ruleId}.`);
    values[1] = 2;
  }
  const evaluator = evaluators[normalizedName];
  if (!evaluator) {
    warnings.push(`Unsupported formula function ${name} in ${ruleId}.`);
  }
  const value = evaluator ? evaluator() : (values[0] ?? 0);

  return mergeFormulaValues({
    display: `${name}(${args.map((arg) => arg.display).join(', ')})`,
    value,
    values: args,
    warnings,
  });
}

function createFormulaParser({
  namedValues,
  ruleId,
  tokens,
}: {
  namedValues: Record<string, number>;
  ruleId: string;
  tokens: FormulaToken[];
}) {
  let index = 0;
  const warnings: string[] = [];

  const peek = () => tokens[index];
  const consume = () => {
    const token = tokens[index];
    index += 1;
    return token;
  };

  const parseExpression = (): FormulaValue => parseComparison();

  const COMPARATORS: Record<string, (a: number, b: number) => boolean> = {
    '>': (a, b) => a > b,
    '<': (a, b) => a < b,
    '>=': (a, b) => a >= b,
    '<=': (a, b) => a <= b,
    '==': (a, b) => a === b,
    '!=': (a, b) => a !== b,
  };

  // A comparison produces 1 or 0, same as any other formula value — so it
  // slots into `if`'s first argument (or anywhere else) with no new type.
  // Deliberately not chained (`a > b > c`) — that reads as ambiguous in most
  // languages that don't special-case it, so at most one comparison per
  // expression keeps the grammar unambiguous.
  const parseComparison = (): FormulaValue => {
    const left = parseAdditive();
    const token = peek();
    if (token?.type === 'comparator') {
      const operator = consume();
      if (operator?.type !== 'comparator') {
        return left;
      }
      const right = parseAdditive();
      const result = COMPARATORS[operator.value](left.value, right.value);
      return mergeFormulaValues({
        display: `(${left.display} ${operator.value} ${right.display})`,
        value: result ? 1 : 0,
        values: [left, right],
      });
    }
    return left;
  };

  const parseAdditive = (): FormulaValue => {
    let left = parseMultiplicative();
    let operator = peek();
    while (operator?.type === 'operator' && (operator.value === '+' || operator.value === '-')) {
      const currentOperator = consume();
      if (currentOperator?.type !== 'operator') {
        break;
      }
      const right = parseMultiplicative();
      const value =
        currentOperator.value === '+' ? left.value + right.value : left.value - right.value;
      left = mergeFormulaValues({
        display: `(${left.display} ${currentOperator.value} ${right.display})`,
        value,
        values: [left, right],
      });
      operator = peek();
    }
    return left;
  };

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Multiplicative parsing handles multiply/divide precedence plus divide-by-zero recovery.
  const parseMultiplicative = (): FormulaValue => {
    let left = parseUnary();
    let operator = peek();
    while (operator?.type === 'operator' && (operator.value === '*' || operator.value === '/')) {
      const currentOperator = consume();
      if (currentOperator?.type !== 'operator') {
        break;
      }
      const right = parseUnary();
      const operationWarnings: string[] = [];
      let value = left.value * right.value;
      if (currentOperator.value === '/' && right.value !== 0) {
        value = left.value / right.value;
      }
      if (currentOperator.value === '/' && right.value === 0) {
        value = 0;
      }
      if (currentOperator.value === '/' && right.value === 0) {
        operationWarnings.push(`Divide by zero in ${ruleId}.`);
      }
      left = mergeFormulaValues({
        display: `(${left.display} ${currentOperator.value} ${right.display})`,
        value,
        values: [left, right],
        warnings: operationWarnings,
      });
      operator = peek();
    }
    return left;
  };

  const parseUnary = (): FormulaValue => {
    const token = peek();
    if (token?.type === 'operator' && token.value === '-') {
      consume();
      const value = parseUnary();
      return mergeFormulaValues({
        display: `-${value.display}`,
        value: -value.value,
        values: [value],
      });
    }
    return parsePrimary();
  };

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Function calls need to parse comma-separated nested expressions and recover from malformed input.
  const parseFunctionCall = (name: string): FormulaValue => {
    consume();
    const args: FormulaValue[] = [];
    let closed = false;
    while (index < tokens.length) {
      const token = peek();
      if (token?.type === 'paren' && token.value === ')') {
        consume();
        closed = true;
        break;
      }
      args.push(parseExpression());
      if (peek()?.type === 'comma') {
        consume();
        continue;
      }
      if (peek()?.type === 'paren' && peek().value === ')') {
        continue;
      }
      if (index < tokens.length) {
        warnings.push(`Expected comma or closing parenthesis in ${ruleId}.`);
        break;
      }
    }
    if (!closed) warnings.push(`Formula expression in ${ruleId} has an unmatched parenthesis.`);
    return applyFormulaFunction({ args, name, ruleId });
  };

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Primary parsing handles all base token types for the local expression grammar.
  const parsePrimary = (): FormulaValue => {
    const token = consume();
    if (!token) {
      warnings.push(`Formula expression in ${ruleId} is missing a value.`);
      return {
        display: '0',
        resolvedOperands: [],
        value: 0,
        warnings: [],
      };
    }

    if (token.type === 'number') {
      return createNumberFormulaValue(token);
    }

    if (token.type === 'identifier') {
      const next = peek();
      if (next?.type === 'paren' && next.value === '(' && isSupportedFormulaFunction(token.value)) {
        return parseFunctionCall(token.value);
      }
      return createReferenceFormulaValue({
        namedValues,
        reference: token.value,
      });
    }

    if (token.type === 'paren' && token.value === '(') {
      const value = parseExpression();
      if (peek()?.type === 'paren' && peek().value === ')') {
        consume();
      } else {
        warnings.push(`Formula expression in ${ruleId} has an unmatched parenthesis.`);
      }
      return value;
    }

    warnings.push(`Unexpected token "${token.text}" in ${ruleId}.`);
    return {
      display: '0',
      resolvedOperands: [],
      value: 0,
      warnings: [],
    };
  };

  return {
    parse() {
      const value = parseExpression();
      if (index < tokens.length) {
        warnings.push(`Formula expression in ${ruleId} has unused tokens.`);
      }
      return {
        ...value,
        warnings: [...new Set([...warnings, ...value.warnings])],
      };
    },
  };
}

function evaluateFormulaExpression({
  expression,
  namedValues,
  resultKey,
  ruleId,
}: {
  expression: string;
  namedValues: Record<string, number>;
  resultKey: string;
  ruleId: string;
}) {
  const tokenized = tokenizeFormulaExpression(expression);
  const parsed = createFormulaParser({
    namedValues,
    ruleId,
    tokens: tokenized.tokens,
  }).parse();
  const warnings = [...new Set([...tokenized.warnings, ...parsed.warnings])];
  if (!Number.isFinite(parsed.value)) warnings.push(`Non-finite result in ${ruleId}.`);
  const result = roundResult(parsed.value, resultKey);

  return {
    expression: `${parsed.display} = ${result}`,
    resolvedOperands: parsed.resolvedOperands,
    result,
    warnings,
  };
}

const OPERATION_EVALUATORS: Record<CalculationRule['operation'], (values: number[]) => number> = {
  abs: (values) => Math.abs(values[0] ?? 0),
  add: (values) => values.reduce((result, value) => result + value, 0),
  divide: (values) =>
    values
      .slice(1)
      .reduce((result, value) => (value === 0 ? Number.NaN : result / value), values[0]),
  max: (values) => Math.max(...values),
  max_subtract_zero: (values) => Math.max((values[0] ?? 0) - (values[1] ?? 0), 0),
  min: (values) => Math.min(...values),
  min_multiply_cap: (values) =>
    Math.min(Math.max(values[0] ?? 0, 0) * (values[1] ?? 0), values[2] ?? 0),
  multiply: (values) => values.reduce((result, value) => result * value, 1),
  pass_through: (values) => values[0] ?? 0,
  round: (values) => roundMoney(values[0] ?? 0),
  subtract: (values) => values.slice(1).reduce((result, value) => result - value, values[0]),
};

function applyOperation(rule: CalculationRule, values: number[]) {
  return OPERATION_EVALUATORS[rule.operation](values);
}

function ruleCanRun({
  namedValues,
  rule,
}: {
  namedValues: Record<string, number>;
  rule: CalculationRule;
}) {
  const formulaExpression = rule.formulaExpression?.trim();
  if (formulaExpression) {
    return collectFormulaReferences(formulaExpression).every(
      (reference) => namedValues[reference] !== undefined,
    );
  }

  return rule.operands.every(
    (operand) => typeof operand === 'number' || namedValues[operand] !== undefined,
  );
}

function evaluateRule({
  namedValues,
  rule,
}: {
  namedValues: Record<string, number>;
  rule: CalculationRule;
}) {
  const formulaExpression = rule.formulaExpression?.trim();
  if (!formulaExpression && !rule.operands.length)
    return {
      resolvedOperands: [],
      result: 0,
      warnings: [`Add a value or formula to ${rule.label || rule.resultKey}.`],
    };
  if (formulaExpression) {
    return evaluateFormulaExpression({
      expression: formulaExpression,
      namedValues,
      resultKey: rule.resultKey,
      ruleId: rule.calculationId,
    });
  }

  const resolvedOperands = rule.operands.map((operand) => resolveOperand({ namedValues, operand }));
  const warnings = resolvedOperands
    .filter((operand) => operand.missing)
    .map((operand) => `Missing operand ${String(operand.operand)}.`);
  const divideByZero =
    rule.operation === 'divide' && resolvedOperands.slice(1).some((operand) => operand.value === 0);
  if (divideByZero) {
    warnings.push(`Divide by zero in ${rule.calculationId}.`);
  }
  const rawResult = divideByZero
    ? 0
    : applyOperation(
        rule,
        resolvedOperands.map((operand) => operand.value),
      );
  const result = roundResult(rawResult, rule.resultKey);
  if (!Number.isFinite(rawResult)) warnings.push(`Non-finite result in ${rule.calculationId}.`);

  return {
    resolvedOperands,
    result,
    warnings,
  };
}

function getRuleExpression(rule: CalculationRule) {
  if (rule.formulaExpression?.trim()) {
    return `${rule.resultKey} = ${rule.formulaExpression.trim()}`;
  }

  return `${rule.resultKey} = ${rule.operation}(${rule.operands.map(String).join(', ')})`;
}

export function runCalculationEngine(context: ToolExecutionContext): ToolRunResult {
  const { rules, mode: resolvedMode } = getRules(context);
  const configMode = getCalculationMode(context);
  const resolvedInputs = resolveCalculationInputs(
    rules,
    context.block.config,
    calculationInputOptionsFromRoles(context.inputsByRole),
  );
  const namedValues = resolvedInputs.values;
  const inputRequirements = resolvedInputs.requirements;
  const missingErrors = [
    ...resolvedInputs.errors,
    ...getMissingInputErrors({
      configMode,
      namedValues,
      rules,
    }),
  ];

  if (missingErrors.length > 0) {
    return createErrorResult({ context, errors: [...new Set(missingErrors)], inputRequirements });
  }

  for (const rule of rules) {
    if (
      rule.roundingDigits !== undefined &&
      (!Number.isInteger(rule.roundingDigits) ||
        rule.roundingDigits < 0 ||
        rule.roundingDigits > 15)
    )
      return createErrorResult({
        context,
        errors: [`Invalid rounding precision for ${rule.resultKey}.`],
        inputRequirements,
      });
  }
  const pendingRules = [...rules];
  const calculatedResults: Record<string, number> = {};
  const resultDetails: Record<string, Record<string, unknown>> = {};
  const formulaTrace: Record<string, Record<string, unknown>> = {};
  const warnings: string[] = [...resolvedInputs.warnings];
  let progressed = true;

  while (pendingRules.length > 0 && progressed) {
    progressed = false;

    for (let index = pendingRules.length - 1; index >= 0; index -= 1) {
      const rule = pendingRules[index];
      if (!ruleCanRun({ namedValues, rule })) {
        continue;
      }

      const evaluation = evaluateRule({ namedValues, rule });
      const invalid = evaluation.warnings;
      if (invalid.length > 0)
        return createErrorResult({ context, errors: invalid, inputRequirements });
      if (rule.roundingDigits !== undefined)
        evaluation.result = roundTo(evaluation.result, rule.roundingDigits);
      namedValues[rule.resultKey] = evaluation.result;
      calculatedResults[rule.resultKey] = evaluation.result;
      resultDetails[rule.resultKey] = {
        calculationId: rule.calculationId,
        description: rule.description,
        label: rule.label,
        unit: rule.unit,
        roundingDigits: rule.roundingDigits,
        operation: rule.operation,
        result: evaluation.result,
        resultKey: rule.resultKey,
        warnings: evaluation.warnings,
      };
      formulaTrace[rule.resultKey] = {
        calculationId: rule.calculationId,
        expression: getRuleExpression(rule),
        inputValues: evaluation.resolvedOperands.map((operand) => ({
          operand: operand.operand,
          value: operand.value,
        })),
        operation: rule.operation,
        result: evaluation.result,
        warnings: evaluation.warnings,
      };
      warnings.push(...evaluation.warnings);
      pendingRules.splice(index, 1);
      progressed = true;
    }
  }

  if (pendingRules.length) {
    return createErrorResult({
      context,
      inputRequirements,
      errors: pendingRules.map((rule) => {
        const refs = rule.formulaExpression
          ? collectFormulaReferences(rule.formulaExpression)
          : rule.operands.filter((item): item is string => typeof item === 'string');
        return `Cannot calculate ${rule.label || rule.resultKey}: missing input ${refs.filter((key) => !Object.hasOwn(namedValues, key)).join(', ')}. Provide the value or set an explicit default in Calculation settings.`;
      }),
    });
  }

  const sourceTrace = dedupeSourceTrace(context.sourceTrace || []);
  const evidenceRefs = dedupeEvidenceRefs(context.evidenceRefs || []);
  const calculationSummary = {
    calculatedCount: Object.keys(calculatedResults).length,
    formulaMode: resolvedMode,
    inputCount: Object.keys(namedValues).length,
    ruleCount: rules.length,
    warningCount: warnings.length,
    inputRequirements,
  };

  return {
    blockId: context.block.id,
    completedAt: new Date().toISOString(),
    errors: [],
    evidenceRefs,
    logs: [
      warnings.length > 0
        ? warning('Calculation Engine completed with warnings.', calculationSummary)
        : info('Calculation Engine completed.', calculationSummary),
    ],
    outputs: {
      calculated_results: {
        calculatedResults,
        resultDetails,
      },
      calculation_summary: calculationSummary,
      formula_trace: {
        formulaTrace,
      },
      named_values: {
        namedValues,
      },
    },
    primaryOutputRole: 'calculated_results',
    runId: context.runId,
    sourceTrace,
    startedAt: context.startedAt,
    status: warnings.length > 0 ? 'warning' : 'success',
    toolId: 'logic.calculation_engine',
    warnings,
  };
}
