import { error, info, warning } from "../../../runtime/events";
import {
  dedupeEvidenceRefs,
  dedupeSourceTrace,
} from "../../../runtime/lineage";
import type {
  ToolExecutionContext,
  ToolRunResult,
} from "../../../runtime/types";
import type {
  CalculationOperand,
  CalculationRule,
} from "../../source/calculation-rules/schema";
import {
  collectCalculationRulesFromBackendInput,
  collectNamedValuesFromBackendInput,
  type ResolvedOperand,
} from "./schema";

const REFERENCE_PART_REGEX = /[A-Za-z0-9_:.@-]/;
const REFERENCE_START_REGEX = /[A-Za-z_]/;
const WHITESPACE_REGEX = /\s/;
const SUPPORTED_FORMULA_FUNCTIONS = new Set([
  "abs",
  "max",
  "max_subtract_zero",
  "min",
  "min_multiply_cap",
  "round",
]);

type FormulaToken =
  | { text: string; type: "comma"; value: "," }
  | { text: string; type: "identifier"; value: string }
  | { text: string; type: "number"; value: number }
  | { text: string; type: "operator"; value: "+" | "-" | "*" | "/" }
  | { text: string; type: "paren"; value: "(" | ")" };

type FormulaValue = {
  display: string;
  resolvedOperands: ResolvedOperand[];
  value: number;
  warnings: string[];
};

function getRoleInputs(context: ToolExecutionContext, role: string) {
  return context.inputsByRole[role] || [];
}

function getInlineRulesFromConfig(
  context: ToolExecutionContext
): CalculationRule[] {
  const config = context.block.config as Record<string, unknown>;
  const formulas =
    config.formulas ?? config.calculationRules ?? config.inlineFormulas;
  if (!formulas) {
    return [];
  }
  return collectCalculationRulesFromBackendInput(
    Array.isArray(formulas) ? formulas : { calculationRules: formulas }
  );
}

function getCalculationMode(
  context: ToolExecutionContext
): "auto" | "inline" | "external_rules" {
  const config = context.block.config as Record<string, unknown>;
  const mode = config.mode;
  if (mode === "inline" || mode === "external_rules") {
    return mode;
  }
  return "auto";
}

function getRules(context: ToolExecutionContext): {
  rules: CalculationRule[];
  mode: string;
} {
  const mode = getCalculationMode(context);
  const externalRules = getRoleInputs(context, "calculation_rules").flatMap(
    (input) => collectCalculationRulesFromBackendInput(input)
  );
  const inlineRules = getInlineRulesFromConfig(context);

  if (mode === "external_rules") {
    return { rules: externalRules, mode: "external_rules" };
  }
  if (mode === "inline") {
    return { rules: inlineRules, mode: "inline" };
  }
  // auto: prefer external if connected, else inline
  if (externalRules.length > 0) {
    return { rules: externalRules, mode: "auto:external" };
  }
  return { rules: inlineRules, mode: "auto:inline" };
}

function getNamedValues(context: ToolExecutionContext) {
  const values: Record<string, number> = {};
  for (const role of ["named_values", "protected_inputs", "fapi_inputs"]) {
    for (const input of getRoleInputs(context, role)) {
      for (const [key, value] of collectNamedValuesFromBackendInput(input)) {
        values[key] = value;
      }
    }
  }
  return values;
}

function createErrorResult({
  context,
  errors,
}: {
  context: ToolExecutionContext;
  errors: string[];
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
      },
      formula_trace: { formulaTrace: {} },
      named_values: { namedValues: {} },
    },
    primaryOutputRole: "calculation_summary",
    runId: context.runId,
    sourceTrace: [],
    startedAt: context.startedAt,
    status: "error",
    toolId: "logic.calculation_engine",
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
  if (Object.keys(namedValues).length === 0) {
    errors.push("Calculation Engine needs named_values input.");
  }
  if (rules.length === 0) {
    if (configMode === "external_rules") {
      errors.push(
        "external_rules mode requires a connected Calculation Rules Source."
      );
    } else if (configMode === "inline") {
      errors.push(
        "inline mode requires formulas in the block config. Add at least one formula."
      );
    } else {
      errors.push(
        "No formulas found. Add inline formulas to the Calculation Engine block config, or connect a Calculation Rules Source."
      );
    }
  }
  return errors;
}

function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

// A RATE result (an FX / conversion factor) must NOT be rounded to money cents:
// 2dp rounding destroys its precision (1.3978 → 1.40) and then corrupts every
// amount multiplied by it — e.g. the *_CAD conversions FX_RATE feeds. Rates flow
// through at FULL precision here; only money amounts round to 2dp, and the final
// DISPLAY rounding happens at the surface (worksheet / snapshot formatting). The
// key heuristic matches the worksheet-intel `isRateKey` convention (_RATE suffix
// or FX prefix), so no money line is ever mistaken for a rate.
const RATE_RESULT_KEY = /_RATE$|^FX/i;
function roundResult(value: number, resultKey: string) {
  if (!Number.isFinite(value)) {
    return 0;
  }
  return RATE_RESULT_KEY.test(resultKey) ? value : roundMoney(value);
}

function isDigit(character: string) {
  return character >= "0" && character <= "9";
}

function isReferenceStart(character: string) {
  return REFERENCE_START_REGEX.test(character);
}

function isReferencePart(character: string) {
  return REFERENCE_PART_REGEX.test(character);
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Tokenization is deliberately local and supports calculator-style numbers, refs, operators, parentheses, and function commas.
function tokenizeFormulaExpression(expression: string) {
  const tokens: FormulaToken[] = [];
  const warnings: string[] = [];
  let index = 0;

  while (index < expression.length) {
    const character = expression[index];
    if (WHITESPACE_REGEX.test(character)) {
      index += 1;
      continue;
    }

    if (character === "(" || character === ")") {
      tokens.push({ text: character, type: "paren", value: character });
      index += 1;
      continue;
    }

    if (character === ",") {
      tokens.push({ text: character, type: "comma", value: character });
      index += 1;
      continue;
    }

    if (
      character === "+" ||
      character === "-" ||
      character === "*" ||
      character === "/"
    ) {
      tokens.push({ text: character, type: "operator", value: character });
      index += 1;
      continue;
    }

    if (isDigit(character) || character === ".") {
      let end = index + 1;
      while (
        end < expression.length &&
        (isDigit(expression[end]) || expression[end] === ".")
      ) {
        end += 1;
      }
      const text = expression.slice(index, end);
      const value = Number(text);
      if (Number.isFinite(value)) {
        tokens.push({ text, type: "number", value });
      } else {
        warnings.push(`Invalid number "${text}" in formula expression.`);
      }
      index = end;
      continue;
    }

    if (isReferenceStart(character)) {
      let end = index + 1;
      while (end < expression.length && isReferencePart(expression[end])) {
        end += 1;
      }
      const text = expression.slice(index, end);
      tokens.push({ text, type: "identifier", value: text });
      index = end;
      continue;
    }

    warnings.push(`Unsupported formula character "${character}" was ignored.`);
    index += 1;
  }

  return { tokens, warnings };
}

function isSupportedFormulaFunction(name: string) {
  return SUPPORTED_FORMULA_FUNCTIONS.has(name.toLowerCase());
}

function collectFormulaReferences(expression: string) {
  const { tokens } = tokenizeFormulaExpression(expression);
  const refs = tokens.flatMap((token, index) => {
    if (token.type !== "identifier") {
      return [];
    }
    const next = tokens[index + 1];
    if (
      next?.type === "paren" &&
      next.value === "(" &&
      isSupportedFormulaFunction(token.value)
    ) {
      return [];
    }
    return [token.value];
  });
  return [...new Set(refs)];
}

function resolveOperand({
  namedValues,
  operand,
}: {
  namedValues: Record<string, number>;
  operand: CalculationOperand;
}): ResolvedOperand {
  if (typeof operand === "number") {
    return { missing: false, operand, value: operand };
  }

  const value = namedValues[operand];
  return {
    missing: value === undefined,
    operand,
    value: value ?? 0,
  };
}

function createNumberFormulaValue(token: FormulaToken & { type: "number" }) {
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
    warnings: [
      ...new Set([
        ...values.flatMap((item) => item.warnings),
        ...(warnings || []),
      ]),
    ],
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
    max: () => (values.length > 0 ? Math.max(...values) : 0),
    max_subtract_zero: () => Math.max((values[0] ?? 0) - (values[1] ?? 0), 0),
    min: () => (values.length > 0 ? Math.min(...values) : 0),
    min_multiply_cap: () =>
      Math.min(Math.max(values[0] ?? 0, 0) * (values[1] ?? 0), values[2] ?? 0),
    round: () => roundMoney(values[0] ?? 0),
  };
  const evaluator = evaluators[normalizedName];
  if (!evaluator) {
    warnings.push(`Unsupported formula function ${name} in ${ruleId}.`);
  }
  const value = evaluator ? evaluator() : (values[0] ?? 0);

  return mergeFormulaValues({
    display: `${name}(${args.map((arg) => arg.display).join(", ")})`,
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

  const parseExpression = (): FormulaValue => parseAdditive();

  const parseAdditive = (): FormulaValue => {
    let left = parseMultiplicative();
    let operator = peek();
    while (
      operator?.type === "operator" &&
      (operator.value === "+" || operator.value === "-")
    ) {
      const currentOperator = consume();
      if (currentOperator?.type !== "operator") {
        break;
      }
      const right = parseMultiplicative();
      const value =
        currentOperator.value === "+"
          ? left.value + right.value
          : left.value - right.value;
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
    while (
      operator?.type === "operator" &&
      (operator.value === "*" || operator.value === "/")
    ) {
      const currentOperator = consume();
      if (currentOperator?.type !== "operator") {
        break;
      }
      const right = parseUnary();
      const operationWarnings: string[] = [];
      let value = left.value * right.value;
      if (currentOperator.value === "/" && right.value !== 0) {
        value = left.value / right.value;
      }
      if (currentOperator.value === "/" && right.value === 0) {
        value = 0;
      }
      if (currentOperator.value === "/" && right.value === 0) {
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
    if (token?.type === "operator" && token.value === "-") {
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
    while (index < tokens.length) {
      const token = peek();
      if (token?.type === "paren" && token.value === ")") {
        consume();
        break;
      }
      args.push(parseExpression());
      if (peek()?.type === "comma") {
        consume();
        continue;
      }
      if (peek()?.type === "paren" && peek().value === ")") {
        continue;
      }
      if (index < tokens.length) {
        warnings.push(`Expected comma or closing parenthesis in ${ruleId}.`);
        break;
      }
    }
    return applyFormulaFunction({ args, name, ruleId });
  };

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Primary parsing handles all base token types for the local expression grammar.
  const parsePrimary = (): FormulaValue => {
    const token = consume();
    if (!token) {
      warnings.push(`Formula expression in ${ruleId} is missing a value.`);
      return {
        display: "0",
        resolvedOperands: [],
        value: 0,
        warnings: [],
      };
    }

    if (token.type === "number") {
      return createNumberFormulaValue(token);
    }

    if (token.type === "identifier") {
      const next = peek();
      if (
        next?.type === "paren" &&
        next.value === "(" &&
        isSupportedFormulaFunction(token.value)
      ) {
        return parseFunctionCall(token.value);
      }
      return createReferenceFormulaValue({
        namedValues,
        reference: token.value,
      });
    }

    if (token.type === "paren" && token.value === "(") {
      const value = parseExpression();
      if (peek()?.type === "paren" && peek().value === ")") {
        consume();
      } else {
        warnings.push(
          `Formula expression in ${ruleId} has an unmatched parenthesis.`
        );
      }
      return value;
    }

    warnings.push(`Unexpected token "${token.text}" in ${ruleId}.`);
    return {
      display: "0",
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
  const result = roundResult(parsed.value, resultKey);

  return {
    expression: `${parsed.display} = ${result}`,
    resolvedOperands: parsed.resolvedOperands,
    result,
    warnings,
  };
}

const OPERATION_EVALUATORS: Record<
  CalculationRule["operation"],
  (values: number[]) => number
> = {
  abs: (values) => Math.abs(values[0] ?? 0),
  add: (values) => values.reduce((result, value) => result + value, 0),
  divide: (values) =>
    values
      .slice(1)
      .reduce(
        (result, value) => (value === 0 ? Number.NaN : result / value),
        values[0]
      ),
  max: (values) => Math.max(...values),
  max_subtract_zero: (values) =>
    Math.max((values[0] ?? 0) - (values[1] ?? 0), 0),
  min: (values) => Math.min(...values),
  min_multiply_cap: (values) =>
    Math.min(Math.max(values[0] ?? 0, 0) * (values[1] ?? 0), values[2] ?? 0),
  multiply: (values) => values.reduce((result, value) => result * value, 1),
  pass_through: (values) => values[0] ?? 0,
  round: (values) => roundMoney(values[0] ?? 0),
  subtract: (values) =>
    values.slice(1).reduce((result, value) => result - value, values[0]),
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
      (reference) => namedValues[reference] !== undefined
    );
  }

  return rule.operands.every(
    (operand) =>
      typeof operand === "number" || namedValues[operand] !== undefined
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
  if (formulaExpression) {
    return evaluateFormulaExpression({
      expression: formulaExpression,
      namedValues,
      resultKey: rule.resultKey,
      ruleId: rule.calculationId,
    });
  }

  const resolvedOperands = rule.operands.map((operand) =>
    resolveOperand({ namedValues, operand })
  );
  const warnings = resolvedOperands
    .filter((operand) => operand.missing)
    .map((operand) => `Missing operand ${String(operand.operand)}.`);
  const divideByZero =
    rule.operation === "divide" &&
    resolvedOperands.slice(1).some((operand) => operand.value === 0);
  if (divideByZero) {
    warnings.push(`Divide by zero in ${rule.calculationId}.`);
  }
  const rawResult = divideByZero
    ? 0
    : applyOperation(
        rule,
        resolvedOperands.map((operand) => operand.value)
      );
  const result = roundResult(rawResult, rule.resultKey);

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

  return `${rule.resultKey} = ${rule.operation}(${rule.operands
    .map(String)
    .join(", ")})`;
}

export function runCalculationEngine(
  context: ToolExecutionContext
): ToolRunResult {
  const { rules, mode: resolvedMode } = getRules(context);
  const configMode = getCalculationMode(context);
  const namedValues = getNamedValues(context);
  const missingErrors = getMissingInputErrors({
    configMode,
    namedValues,
    rules,
  });

  if (missingErrors.length > 0) {
    return createErrorResult({ context, errors: missingErrors });
  }

  const pendingRules = [...rules];
  const calculatedResults: Record<string, number> = {};
  const resultDetails: Record<string, Record<string, unknown>> = {};
  const formulaTrace: Record<string, Record<string, unknown>> = {};
  const warnings: string[] = [];
  let progressed = true;

  while (pendingRules.length > 0 && progressed) {
    progressed = false;

    for (let index = pendingRules.length - 1; index >= 0; index -= 1) {
      const rule = pendingRules[index];
      if (!ruleCanRun({ namedValues, rule })) {
        continue;
      }

      const evaluation = evaluateRule({ namedValues, rule });
      namedValues[rule.resultKey] = evaluation.result;
      calculatedResults[rule.resultKey] = evaluation.result;
      resultDetails[rule.resultKey] = {
        calculationId: rule.calculationId,
        description: rule.description,
        label: rule.label,
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

  for (const rule of pendingRules) {
    const evaluation = evaluateRule({ namedValues, rule });
    namedValues[rule.resultKey] = evaluation.result;
    calculatedResults[rule.resultKey] = evaluation.result;
    resultDetails[rule.resultKey] = {
      calculationId: rule.calculationId,
      description: rule.description,
      label: rule.label,
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
    warnings.push(
      `Calculation ${rule.calculationId} ran with unresolved dependency values.`,
      ...evaluation.warnings
    );
  }

  const sourceTrace = dedupeSourceTrace(context.sourceTrace || []);
  const evidenceRefs = dedupeEvidenceRefs(context.evidenceRefs || []);
  const calculationSummary = {
    calculatedCount: Object.keys(calculatedResults).length,
    formulaMode: resolvedMode,
    inputCount: Object.keys(namedValues).length,
    ruleCount: rules.length,
    warningCount: warnings.length,
  };

  return {
    blockId: context.block.id,
    completedAt: new Date().toISOString(),
    errors: [],
    evidenceRefs,
    logs: [
      warnings.length > 0
        ? warning(
            "Calculation Engine completed with warnings.",
            calculationSummary
          )
        : info("Calculation Engine completed.", calculationSummary),
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
    primaryOutputRole: "calculated_results",
    runId: context.runId,
    sourceTrace,
    startedAt: context.startedAt,
    status: warnings.length > 0 ? "warning" : "success",
    toolId: "logic.calculation_engine",
    warnings,
  };
}
