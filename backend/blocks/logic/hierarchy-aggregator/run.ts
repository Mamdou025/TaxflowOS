import { error, info, warning } from "../../../runtime/events";
import {
  dedupeEvidenceRefs,
  dedupeSourceTrace,
} from "../../../runtime/lineage";
import type {
  EvidenceRef,
  SourceTraceRef,
  ToolExecutionContext,
  ToolRunResult,
} from "../../../runtime/types";
import type {
  AggregationOperand,
  AggregationOperation,
  AggregationRule,
} from "../../source/aggregation-rules/schema";
import {
  collectAggregationRulesFromBackendInput,
  collectMappedRowsFromBackendInput,
  type HierarchyMappedRow,
} from "./schema";

const REFERENCE_PART_REGEX = /[A-Za-z0-9_:.@-]/;
const REFERENCE_START_REGEX = /[A-Za-z_]/;
const WHITESPACE_REGEX = /\s/;

type FormulaInputValue = {
  label: string;
  refId?: string;
  refType: AggregationOperand["refType"];
  sign: 1 | -1;
  signedValue: number;
  value: number;
};

type FormulaTraceEntry = {
  expression: string;
  inputRefs: string[];
  inputValues: FormulaInputValue[];
  label: string;
  nodeId: string;
  nodeType: AggregationRule["nodeType"];
  operation: AggregationRule["operation"];
  result: number;
  warnings: string[];
};

type CategoryTotalDetail = {
  amount: number;
  categoryId: string;
  categoryLabel: string;
  currency?: string;
  includedRows: string[];
  rowCount: number;
  value: number;
};

type NodeTotal = {
  amount: number;
  currency?: string;
  formulaTrace: FormulaTraceEntry;
  includedRows: string[];
  label: string;
  nodeId: string;
  nodeType: AggregationRule["nodeType"];
  operation: AggregationRule["operation"];
  resultName?: string;
  rowCount: number;
  value: number;
  warnings: string[];
};

type ResolvedOperand = FormulaInputValue & {
  includedRows: string[];
  warnings: string[];
};

type FapiInputs = {
  documentCurrency?: string;
  expectedResults?: Record<string, number>;
  fatPaid?: number;
  fapiYear?: number;
  fxRate?: number;
  inclusionRate?: number;
  reportingCurrency?: string;
  rtf?: number;
};

function getRoleInputs(context: ToolExecutionContext, role: string) {
  return context.inputsByRole[role] || [];
}

function getMappedRows(context: ToolExecutionContext): HierarchyMappedRow[] {
  return getRoleInputs(context, "mapped_rows").flatMap((input) =>
    collectMappedRowsFromBackendInput(input)
  );
}

function getAggregationRules(context: ToolExecutionContext): AggregationRule[] {
  return getRoleInputs(context, "aggregation_rules").flatMap((input) =>
    collectAggregationRulesFromBackendInput(input)
  );
}

function parseFapiInputs(value: unknown): FapiInputs {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  const record = value as Record<string, unknown>;
  const nested =
    typeof record.fapiInputs === "object" && record.fapiInputs !== null
      ? (record.fapiInputs as Record<string, unknown>)
      : record;

  return {
    documentCurrency: optionalString(nested.documentCurrency),
    expectedResults:
      typeof nested.expectedResults === "object" && nested.expectedResults
        ? Object.fromEntries(
            Object.entries(nested.expectedResults as Record<string, unknown>)
              .map(([key, item]) => [key, parseNumber(item)])
              .filter((entry): entry is [string, number] => entry[1] !== null)
          )
        : undefined,
    fatPaid:
      parseNumber(nested.fatPaid) ??
      parseNumber(nested.fat_paid) ??
      parseNumber(nested.fatPaidUsd) ??
      undefined,
    fapiYear: parseNumber(nested.fapiYear) ?? undefined,
    fxRate:
      parseNumber(nested.fxRate) ??
      parseNumber(nested.exchangeRate) ??
      parseNumber(nested.exchange_rate) ??
      parseNumber(nested.rate) ??
      parseNumber(nested.overrideRate) ??
      undefined,
    inclusionRate: parseNumber(nested.inclusionRate) ?? undefined,
    reportingCurrency: optionalString(nested.reportingCurrency),
    rtf: parseNumber(nested.rtf) ?? parseNumber(nested.rtfRate) ?? undefined,
  };
}

function getFapiInputs(context: ToolExecutionContext): FapiInputs {
  const inputs = [
    ...getRoleInputs(context, "fapi_inputs"),
    ...getRoleInputs(context, "exchange_rate"),
    ...getRoleInputs(context, "reviewed_exchange_rate"),
  ].map(parseFapiInputs);
  const merged: FapiInputs = {};

  for (const input of inputs) {
    for (const [key, value] of Object.entries(input)) {
      if (key !== "expectedResults" && value !== undefined) {
        (merged as Record<string, unknown>)[key] = value;
      }
    }
    merged.expectedResults = {
      ...(merged.expectedResults || {}),
      ...(input.expectedResults || {}),
    };
  }

  return merged;
}

function groupRowsByCategory(rows: HierarchyMappedRow[]) {
  return rows.reduce<Record<string, HierarchyMappedRow[]>>((groups, row) => {
    groups[row.categoryId] = [...(groups[row.categoryId] || []), row];
    return groups;
  }, {});
}

function getCurrency(rows: HierarchyMappedRow[]) {
  return rows.find((row) => row.currency)?.currency;
}

function sumRows(rows: HierarchyMappedRow[]) {
  return rows.reduce((total, row) => total + row.amount, 0);
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function parseNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== "string") {
    return null;
  }
  const normalized = value.replaceAll(",", "").trim();
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function getRowTrace(rows: HierarchyMappedRow[]): SourceTraceRef[] {
  return dedupeSourceTrace(rows.flatMap((row) => row.sourceTrace || []));
}

function getRowEvidence(rows: HierarchyMappedRow[]): EvidenceRef[] {
  return dedupeEvidenceRefs(rows.flatMap((row) => row.evidenceRefs || []));
}

function formatNumber(value: number) {
  if (Number.isInteger(value)) {
    return String(value);
  }
  return String(Number(value.toFixed(6)));
}

function getOperandRef(operand: FormulaInputValue) {
  return operand.refType === "constant"
    ? `constant:${operand.label}`
    : `${operand.refType}:${operand.refId || operand.label}`;
}

function getOperator(operation: AggregationOperation) {
  if (operation === "sum_abs") {
    return "+ abs";
  }
  if (operation === "subtract") {
    return "-";
  }
  if (operation === "multiply") {
    return "*";
  }
  if (operation === "divide") {
    return "/";
  }
  return "+";
}

function getExpression({
  operation,
  operands,
  result,
}: {
  operation: AggregationOperation;
  operands: FormulaInputValue[];
  result: number;
}) {
  if (operands.length === 0) {
    return `0 = ${formatNumber(result)}`;
  }

  const formattedOperands = operands.map((operand) => {
    const label = operand.refId || operand.label;
    return `${label}(${formatNumber(operand.signedValue)})`;
  });
  if (operation === "pass_through") {
    return `${formattedOperands[0]} = ${formatNumber(result)}`;
  }
  if (operation === "max_subtract_zero") {
    return `max(${formattedOperands.join(" - ")}, 0) = ${formatNumber(result)}`;
  }
  if (operation === "min_multiply_cap") {
    const [base, multiplier, cap] = formattedOperands;
    return `min(max(${base || "0"}, 0) * ${multiplier || "1"}, ${cap || "0"}) = ${formatNumber(result)}`;
  }

  return `${formattedOperands.join(` ${getOperator(operation)} `)} = ${formatNumber(result)}`;
}

type FormulaExpressionToken =
  | { text: string; type: "number"; value: number }
  | { text: string; type: "operator"; value: "+" | "-" | "*" | "/" | "neg" }
  | { text: string; type: "paren"; value: "(" | ")" }
  | { text: string; type: "ref"; value: string };

type FormulaExpressionValue = {
  display: string;
  includedRows: string[];
  inputValues: FormulaInputValue[];
  value: number;
  warnings: string[];
};

function isDigit(character: string) {
  return character >= "0" && character <= "9";
}

function isReferenceStart(character: string) {
  return REFERENCE_START_REGEX.test(character);
}

function isReferencePart(character: string) {
  return REFERENCE_PART_REGEX.test(character);
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Formula tokenization has several token types but stays local and deterministic.
function tokenizeFormulaExpression(expression: string) {
  const tokens: FormulaExpressionToken[] = [];
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
      tokens.push({ text, type: "ref", value: text });
      index = end;
      continue;
    }

    warnings.push(`Unsupported formula character "${character}" was ignored.`);
    index += 1;
  }

  return { tokens, warnings };
}

function getExpressionOperatorPrecedence(operator: string) {
  if (operator === "neg") {
    return 3;
  }
  if (operator === "*" || operator === "/") {
    return 2;
  }
  return 1;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Shunting-yard parsing is branchy by nature and isolated to formula expressions.
function toFormulaRpn(tokens: FormulaExpressionToken[]) {
  const output: FormulaExpressionToken[] = [];
  const operators: FormulaExpressionToken[] = [];
  const warnings: string[] = [];
  let expectsValue = true;

  for (const token of tokens) {
    if (token.type === "number" || token.type === "ref") {
      output.push(token);
      expectsValue = false;
      continue;
    }

    if (token.type === "paren" && token.value === "(") {
      operators.push(token);
      expectsValue = true;
      continue;
    }

    if (token.type === "paren" && token.value === ")") {
      while (operators.length > 0 && operators.at(-1)?.type !== "paren") {
        const operator = operators.pop();
        if (operator) {
          output.push(operator);
        }
      }
      if (operators.at(-1)?.type === "paren") {
        operators.pop();
      } else {
        warnings.push(
          "Formula expression has an unmatched closing parenthesis."
        );
      }
      expectsValue = false;
      continue;
    }

    if (token.type === "operator") {
      const operator =
        token.value === "-" && expectsValue
          ? { ...token, text: "-", value: "neg" as const }
          : token;
      const precedence = getExpressionOperatorPrecedence(operator.value);
      const rightAssociative = operator.value === "neg";

      while (operators.length > 0) {
        const top = operators.at(-1);
        if (!top) {
          break;
        }
        if (top.type !== "operator") {
          break;
        }
        const topPrecedence = getExpressionOperatorPrecedence(top.value);
        if (
          topPrecedence > precedence ||
          (!rightAssociative && topPrecedence === precedence)
        ) {
          const popped = operators.pop();
          if (popped) {
            output.push(popped);
          }
          continue;
        }
        break;
      }

      operators.push(operator);
      expectsValue = true;
    }
  }

  while (operators.length > 0) {
    const operator = operators.pop();
    if (!operator) {
      continue;
    }
    if (operator.type === "paren") {
      warnings.push("Formula expression has an unmatched opening parenthesis.");
      continue;
    }
    output.push(operator);
  }

  return { rpn: output, warnings };
}

function mergeFormulaValues({
  display,
  value,
  values,
  warnings,
}: {
  display: string;
  value: number;
  values: FormulaExpressionValue[];
  warnings?: string[];
}): FormulaExpressionValue {
  return {
    display,
    includedRows: [...new Set(values.flatMap((item) => item.includedRows))],
    inputValues: values.flatMap((item) => item.inputValues),
    value,
    warnings: [
      ...new Set([
        ...values.flatMap((item) => item.warnings),
        ...(warnings || []),
      ]),
    ],
  };
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Evaluator handles refs, constants, unary, and binary operators in one small stack machine.
function evaluateFormulaExpression({
  expression,
  resolveReference,
  ruleId,
}: {
  expression: string;
  resolveReference: (reference: string) => ResolvedOperand;
  ruleId: string;
}) {
  const tokenized = tokenizeFormulaExpression(expression);
  const { rpn, warnings: rpnWarnings } = toFormulaRpn(tokenized.tokens);
  const stack: FormulaExpressionValue[] = [];
  const warnings = [...tokenized.warnings, ...rpnWarnings];

  for (const token of rpn) {
    if (token.type === "number") {
      stack.push({
        display: token.text,
        includedRows: [],
        inputValues: [
          {
            label: token.text,
            refType: "constant",
            sign: 1,
            signedValue: token.value,
            value: token.value,
          },
        ],
        value: token.value,
        warnings: [],
      });
      continue;
    }

    if (token.type === "ref") {
      const resolved = resolveReference(token.value);
      stack.push({
        display: `${resolved.refId || resolved.label}(${formatNumber(resolved.signedValue)})`,
        includedRows: resolved.includedRows,
        inputValues: [toFormulaInputValue(resolved)],
        value: resolved.signedValue,
        warnings: resolved.warnings,
      });
      continue;
    }

    if (token.type !== "operator") {
      continue;
    }

    if (token.value === "neg") {
      const operand = stack.pop();
      if (!operand) {
        warnings.push(`Missing value after unary minus in ${ruleId}.`);
        continue;
      }
      stack.push(
        mergeFormulaValues({
          display: `-${operand.display}`,
          value: -operand.value,
          values: [operand],
        })
      );
      continue;
    }

    const right = stack.pop();
    const left = stack.pop();
    if (!(left && right)) {
      warnings.push(`Formula expression in ${ruleId} is missing an operand.`);
      continue;
    }

    let value = 0;
    const operationWarnings: string[] = [];
    if (token.value === "+") {
      value = left.value + right.value;
    } else if (token.value === "-") {
      value = left.value - right.value;
    } else if (token.value === "*") {
      value = left.value * right.value;
    } else if (right.value === 0) {
      operationWarnings.push(
        `Divide by zero in ${ruleId}; result was set to 0.`
      );
      value = 0;
    } else {
      value = left.value / right.value;
    }

    stack.push(
      mergeFormulaValues({
        display: `(${left.display} ${token.value} ${right.display})`,
        value,
        values: [left, right],
        warnings: operationWarnings,
      })
    );
  }

  if (stack.length !== 1) {
    warnings.push(
      `Formula expression in ${ruleId} could not be fully evaluated.`
    );
  }

  const result = stack.at(-1) || {
    display: "0",
    includedRows: [],
    inputValues: [],
    value: 0,
    warnings: [],
  };

  return {
    expression: `${result.display} = ${formatNumber(result.value)}`,
    includedRows: result.includedRows,
    inputValues: result.inputValues,
    value: result.value,
    warnings: [...new Set([...warnings, ...result.warnings])],
  };
}

function buildImplicitOperands(rule: AggregationRule): AggregationOperand[] {
  if (rule.operands && rule.operands.length > 0) {
    return rule.operands;
  }

  const categoryIds =
    rule.nodeType === "category_total" &&
    (rule.includeCategoryIds || []).length === 0
      ? [rule.nodeId]
      : rule.includeCategoryIds || [];
  const operands: AggregationOperand[] = [
    ...categoryIds.map((refId) => ({
      refId,
      refType: "category" as const,
    })),
    ...rule.children.map((refId) => ({
      refId,
      refType: "node" as const,
    })),
  ];

  if (
    operands.length === 0 &&
    (rule.nodeType === "constant" || rule.value !== undefined)
  ) {
    return [
      {
        label: rule.nodeId,
        refType: "constant",
        value: rule.value ?? 0,
      },
    ];
  }

  return operands;
}

function applyOperation({
  operation,
  operands,
  rule,
}: {
  operation: AggregationOperation;
  operands: FormulaInputValue[];
  rule: AggregationRule;
}) {
  const warnings: string[] = [];
  const values = operands.map((operand) => operand.signedValue);
  if (values.length === 0) {
    return { value: rule.value ?? 0, warnings };
  }

  if (operation === "pass_through") {
    return { value: values[0] ?? rule.value ?? 0, warnings };
  }

  if (operation === "sum_abs") {
    return {
      value: values.reduce((total, value) => total + Math.abs(value), 0),
      warnings,
    };
  }

  if (operation === "multiply") {
    return {
      value: values.reduce((total, value) => total * value, 1),
      warnings,
    };
  }

  if (operation === "subtract") {
    return {
      value: values
        .slice(1)
        .reduce((total, value) => total - value, values[0] ?? 0),
      warnings,
    };
  }

  if (operation === "divide") {
    const value = values.slice(1).reduce((total, divisor) => {
      if (divisor === 0) {
        warnings.push(`Divide by zero in ${rule.nodeId}; result was set to 0.`);
        return 0;
      }
      return total / divisor;
    }, values[0] ?? 0);
    return { value, warnings };
  }

  if (operation === "max_subtract_zero") {
    const value = values
      .slice(1)
      .reduce((total, item) => total - item, values[0] ?? 0);
    return { value: Math.max(value, 0), warnings };
  }

  if (operation === "min_multiply_cap") {
    const [base = 0, multiplier = 1, cap = Number.POSITIVE_INFINITY] = values;
    return {
      value: Math.min(Math.max(base, 0) * multiplier, cap),
      warnings,
    };
  }

  return {
    value: values.reduce((total, value) => total + value, 0),
    warnings,
  };
}

function createEmptyNodeTotal(
  rule: AggregationRule,
  message: string
): NodeTotal {
  const trace: FormulaTraceEntry = {
    expression: `${rule.nodeId} = 0`,
    inputRefs: [],
    inputValues: [],
    label: rule.label,
    nodeId: rule.nodeId,
    nodeType: rule.nodeType,
    operation: rule.operation,
    result: 0,
    warnings: [message],
  };

  return {
    amount: 0,
    formulaTrace: trace,
    includedRows: [],
    label: rule.label,
    nodeId: rule.nodeId,
    nodeType: rule.nodeType,
    operation: rule.operation,
    resultName: rule.resultName,
    rowCount: 0,
    value: 0,
    warnings: [message],
  };
}

function toFormulaInputValue(operand: ResolvedOperand): FormulaInputValue {
  return {
    label: operand.label,
    refId: operand.refId,
    refType: operand.refType,
    sign: operand.sign,
    signedValue: operand.signedValue,
    value: operand.value,
  };
}

function sortAggregationRules(rules: AggregationRule[]) {
  return rules
    .map((rule, index) => ({ index, rule }))
    .sort(
      (left, right) =>
        (left.rule.order ?? left.index) - (right.rule.order ?? right.index)
    )
    .map(({ rule }) => rule);
}

function getOperandSign(operand: AggregationOperand): 1 | -1 {
  return operand.sign === -1 ? -1 : 1;
}

function resolveConstantOperand(
  operand: AggregationOperand,
  sign: 1 | -1
): ResolvedOperand {
  const value = operand.value ?? 0;
  return {
    includedRows: [],
    label: operand.label || String(value),
    refType: "constant",
    sign,
    signedValue: value * sign,
    value,
    warnings: [],
  };
}

function resolveCategoryOperand({
  allWarnings,
  categoryTotalDetails,
  operand,
  ruleId,
  sign,
}: {
  allWarnings: string[];
  categoryTotalDetails: Record<string, CategoryTotalDetail>;
  operand: AggregationOperand;
  ruleId: string;
  sign: 1 | -1;
}): ResolvedOperand {
  const label = operand.label || operand.refId || "missing_category";
  const detail = operand.refId
    ? categoryTotalDetails[operand.refId]
    : undefined;
  const warnings = detail
    ? []
    : [
        `Missing category reference ${operand.refId || label} in ${ruleId}; treated as 0.`,
      ];
  allWarnings.push(...warnings);
  const value = detail?.value ?? 0;
  return {
    includedRows: detail?.includedRows || [],
    label,
    refId: operand.refId,
    refType: "category",
    sign,
    signedValue: value * sign,
    value,
    warnings,
  };
}

function getFapiInputValue(inputs: FapiInputs, refId?: string) {
  if (!refId) {
    return;
  }
  const normalized = refId
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const aliases: Record<string, keyof FapiInputs> = {
    documentcurrency: "documentCurrency",
    exchange_rate: "fxRate",
    exchangerate: "fxRate",
    fapiperiod: "fapiYear",
    fapiyear: "fapiYear",
    fatpaid: "fatPaid",
    fxoverride: "fxRate",
    fxrate: "fxRate",
    inclusionrate: "inclusionRate",
    reportingcurrency: "reportingCurrency",
    rtf: "rtf",
    rtfrate: "rtf",
  };
  const key = aliases[normalized] || (refId as keyof FapiInputs);
  const value = inputs[key];
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : undefined;
}

function resolveInputOperand({
  allWarnings,
  fapiInputs,
  operand,
  ruleId,
  sign,
}: {
  allWarnings: string[];
  fapiInputs: FapiInputs;
  operand: AggregationOperand;
  ruleId: string;
  sign: 1 | -1;
}): ResolvedOperand {
  const label = operand.label || operand.refId || "missing_input";
  const value = getFapiInputValue(fapiInputs, operand.refId);
  const warnings =
    value === undefined
      ? [
          `Missing FAPI input ${operand.refId || label} in ${ruleId}; treated as 0.`,
        ]
      : [];
  allWarnings.push(...warnings);
  return {
    includedRows: [],
    label,
    refId: operand.refId,
    refType: "input",
    sign,
    signedValue: (value ?? 0) * sign,
    value: value ?? 0,
    warnings,
  };
}

function resolveNodeOperand({
  allWarnings,
  computeRuleTotal,
  operand,
  ruleId,
  rulesById,
  sign,
  visiting,
}: {
  allWarnings: string[];
  computeRuleTotal: (rule: AggregationRule, visiting: Set<string>) => NodeTotal;
  operand: AggregationOperand;
  ruleId: string;
  rulesById: Map<string, AggregationRule>;
  sign: 1 | -1;
  visiting: Set<string>;
}): ResolvedOperand {
  const label = operand.label || operand.refId || "missing_node";
  const childRule = operand.refId ? rulesById.get(operand.refId) : null;
  const warnings = childRule
    ? []
    : [
        `Missing node reference ${operand.refId || label} in ${ruleId}; treated as 0.`,
      ];
  allWarnings.push(...warnings);
  const total = childRule ? computeRuleTotal(childRule, visiting) : undefined;
  const value = total?.value ?? 0;
  return {
    includedRows: total?.includedRows || [],
    label,
    refId: operand.refId,
    refType: "node",
    sign,
    signedValue: value * sign,
    value,
    warnings: [...warnings, ...(total?.warnings || [])],
  };
}

export function runHierarchyAggregator(
  context: ToolExecutionContext
): ToolRunResult {
  const mappedRows = getMappedRows(context);
  const aggregationRules = sortAggregationRules(getAggregationRules(context));
  const fapiInputs = getFapiInputs(context);
  const errors = [
    mappedRows.length === 0
      ? "Rollup & Calculation Engine needs mapped_rows input."
      : "",
    aggregationRules.length === 0
      ? "Rollup & Calculation Engine needs aggregation_rules input."
      : "",
  ].filter(Boolean);

  if (errors.length > 0) {
    return {
      blockId: context.block.id,
      completedAt: new Date().toISOString(),
      errors,
      evidenceRefs: [],
      logs: errors.map((message) => error(message)),
      outputs: {
        aggregation_summary: {
          excludedCount: 0,
          finalResultCount: 0,
          formulaTraceCount: 0,
          mappedCount: mappedRows.length,
          nodeCount: aggregationRules.length,
          ruleCount: aggregationRules.length,
          warnings: errors,
        },
        aggregation_tree: { aggregationTree: [] },
        category_totals: { categoryTotalDetails: {}, categoryTotals: {} },
        excluded_rows: { excludedRows: [], rowCount: 0 },
        final_totals: { finalTotalDetails: {}, finalTotals: {} },
        formula_trace: { formulaTrace: {}, formulaTraceText: [] },
        group_totals: { groupTotals: {} },
        included_rows_by_node: { includedRowsByNode: {} },
        node_totals: { nodeTotalDetails: {}, nodeTotals: {} },
        official_line_values: {
          officialLineDetails: {},
          officialLineValues: {},
        },
      },
      primaryOutputRole: "aggregation_summary",
      runId: context.runId,
      sourceTrace: [],
      startedAt: context.startedAt,
      status: "error",
      toolId: "logic.hierarchy_aggregator",
      warnings: [],
    };
  }

  const rowsByCategory = groupRowsByCategory(mappedRows);
  const categoryTotalDetails = Object.fromEntries(
    Object.entries(rowsByCategory).map(([categoryId, rows]) => [
      categoryId,
      {
        amount: sumRows(rows),
        categoryId,
        categoryLabel: rows[0]?.categoryLabel || categoryId,
        currency: getCurrency(rows),
        includedRows: rows.map((row) => row.rowId),
        rowCount: rows.length,
        value: sumRows(rows),
      } satisfies CategoryTotalDetail,
    ])
  );
  const categoryTotals = Object.fromEntries(
    Object.entries(categoryTotalDetails).map(([categoryId, detail]) => [
      categoryId,
      detail.value,
    ])
  );
  const rulesById = new Map(
    aggregationRules.map((rule) => [rule.nodeId, rule])
  );
  const nodeTotalDetails = new Map<string, NodeTotal>();
  const includedRowsByNode: Record<string, string[]> = {};
  const allWarnings: string[] = [];

  // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Rule evaluation coordinates legacy operands, formula expressions, cycle checks, and trace assembly.
  function computeRuleTotal(
    rule: AggregationRule,
    visiting: Set<string> = new Set()
  ): NodeTotal {
    const cached = nodeTotalDetails.get(rule.nodeId);
    if (cached) {
      return cached;
    }
    if (visiting.has(rule.nodeId)) {
      const message = `Circular aggregation reference detected at ${rule.nodeId}; treated as 0.`;
      allWarnings.push(message);
      const empty = createEmptyNodeTotal(rule, message);
      nodeTotalDetails.set(rule.nodeId, empty);
      return empty;
    }

    const nextVisiting = new Set(visiting);
    nextVisiting.add(rule.nodeId);
    const directOperands = buildImplicitOperands(rule);
    const resolveOperand = (operand: AggregationOperand): ResolvedOperand => {
      const sign = getOperandSign(operand);
      if (operand.refType === "constant") {
        return resolveConstantOperand(operand, sign);
      }
      if (operand.refType === "category") {
        return resolveCategoryOperand({
          allWarnings,
          categoryTotalDetails,
          operand,
          ruleId: rule.nodeId,
          sign,
        });
      }
      if (operand.refType === "input") {
        return resolveInputOperand({
          allWarnings,
          fapiInputs,
          operand,
          ruleId: rule.nodeId,
          sign,
        });
      }
      return resolveNodeOperand({
        allWarnings,
        computeRuleTotal,
        operand,
        ruleId: rule.nodeId,
        rulesById,
        sign,
        visiting: nextVisiting,
      });
    };

    // biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Reference resolution supports explicit prefixes and inferred category/node refs.
    const resolveFormulaReference = (reference: string): ResolvedOperand => {
      const [prefix, ...rest] = reference.split(":");
      const hasPrefix = rest.length > 0;
      const normalizedPrefix = hasPrefix ? prefix.toLowerCase() : "";
      const refId = hasPrefix ? rest.join(":") : reference;

      if (normalizedPrefix === "constant" || normalizedPrefix === "value") {
        return resolveConstantOperand(
          { refType: "constant", value: Number(refId) || 0 },
          1
        );
      }
      if (normalizedPrefix === "category") {
        return resolveCategoryOperand({
          allWarnings,
          categoryTotalDetails,
          operand: { refId, refType: "category" },
          ruleId: rule.nodeId,
          sign: 1,
        });
      }
      if (normalizedPrefix === "input" || normalizedPrefix === "fapi") {
        return resolveInputOperand({
          allWarnings,
          fapiInputs,
          operand: { refId, refType: "input" },
          ruleId: rule.nodeId,
          sign: 1,
        });
      }
      if (normalizedPrefix === "node") {
        return resolveNodeOperand({
          allWarnings,
          computeRuleTotal,
          operand: { refId, refType: "node" },
          ruleId: rule.nodeId,
          rulesById,
          sign: 1,
          visiting: nextVisiting,
        });
      }
      if (categoryTotalDetails[reference]) {
        return resolveCategoryOperand({
          allWarnings,
          categoryTotalDetails,
          operand: { refId: reference, refType: "category" },
          ruleId: rule.nodeId,
          sign: 1,
        });
      }
      return resolveNodeOperand({
        allWarnings,
        computeRuleTotal,
        operand: { refId: reference, refType: "node" },
        ruleId: rule.nodeId,
        rulesById,
        sign: 1,
        visiting: nextVisiting,
      });
    };

    const formulaExpression = rule.formulaExpression?.trim();
    const expressionResult = formulaExpression
      ? evaluateFormulaExpression({
          expression: formulaExpression,
          resolveReference: resolveFormulaReference,
          ruleId: rule.nodeId,
        })
      : null;
    const resolvedOperands = expressionResult
      ? []
      : directOperands.map(resolveOperand);
    const operationResult =
      expressionResult ||
      applyOperation({
        operands: resolvedOperands,
        operation: rule.operation,
        rule,
      });
    allWarnings.push(...operationResult.warnings);
    const includedRows = expressionResult
      ? [...new Set(expressionResult.includedRows)]
      : [
          ...new Set(
            resolvedOperands.flatMap((operand) => operand.includedRows)
          ),
        ];
    const formulaWarnings = [
      ...new Set([
        ...resolvedOperands.flatMap((operand) => operand.warnings),
        ...operationResult.warnings,
      ]),
    ];
    const formulaTrace: FormulaTraceEntry = {
      expression:
        expressionResult?.expression ||
        getExpression({
          operands: resolvedOperands,
          operation: rule.operation,
          result: operationResult.value,
        }),
      inputRefs: expressionResult
        ? expressionResult.inputValues.map(getOperandRef)
        : resolvedOperands.map(getOperandRef),
      inputValues:
        expressionResult?.inputValues ||
        resolvedOperands.map(toFormulaInputValue),
      label: rule.label,
      nodeId: rule.nodeId,
      nodeType: rule.nodeType,
      operation: rule.operation,
      result: operationResult.value,
      warnings: formulaWarnings,
    };
    const nodeTotal: NodeTotal = {
      amount: operationResult.value,
      currency:
        getCurrency(
          mappedRows.filter((row) => includedRows.includes(row.rowId))
        ) || getCurrency(mappedRows),
      formulaTrace,
      includedRows,
      label: rule.label,
      nodeId: rule.nodeId,
      nodeType: rule.nodeType,
      operation: rule.operation,
      resultName: rule.resultName,
      rowCount: includedRows.length,
      value: operationResult.value,
      warnings: formulaWarnings,
    };

    includedRowsByNode[rule.nodeId] = includedRows;
    nodeTotalDetails.set(rule.nodeId, nodeTotal);
    return nodeTotal;
  }

  for (const rule of aggregationRules) {
    computeRuleTotal(rule);
  }

  const nodeTotalDetailRecord = Object.fromEntries(nodeTotalDetails);
  const nodeTotals = Object.fromEntries(
    [...nodeTotalDetails.values()].map((total) => [total.nodeId, total.value])
  );
  const officialLineDetails = Object.fromEntries(
    aggregationRules
      .filter((rule) => rule.outputRole === "official_line")
      .map((rule) => [
        rule.resultName || rule.nodeId,
        nodeTotalDetails.get(rule.nodeId),
      ])
      .filter((entry): entry is [string, NodeTotal] => Boolean(entry[1]))
  );
  const officialLineValues = Object.fromEntries(
    Object.entries(officialLineDetails).map(([resultName, detail]) => [
      resultName,
      detail.value,
    ])
  );
  const groupTotals = Object.fromEntries(
    [...nodeTotalDetails.values()]
      .filter((total) => total.nodeType === "group")
      .map((total) => [total.nodeId, total.value])
  );
  const finalTotalDetails = Object.fromEntries(
    aggregationRules
      .filter((rule) => rule.nodeType === "final_result")
      .map((rule) => [
        rule.resultName || rule.nodeId,
        nodeTotalDetails.get(rule.nodeId),
      ])
      .filter((entry): entry is [string, NodeTotal] => Boolean(entry[1]))
  );
  const finalTotals = Object.fromEntries(
    Object.entries(finalTotalDetails).map(([resultName, detail]) => [
      resultName,
      detail.value,
    ])
  );
  const finalIncludedRows = new Set(
    Object.values(finalTotalDetails).flatMap((total) => total.includedRows)
  );
  const excludedRows = mappedRows.filter(
    (row) => !finalIncludedRows.has(row.rowId)
  );
  const formulaTrace = Object.fromEntries(
    [...nodeTotalDetails.values()].map((total) => [
      total.nodeId,
      total.formulaTrace,
    ])
  );
  const formulaTraceText = [...nodeTotalDetails.values()].map(
    (total) => `${total.nodeId}: ${total.formulaTrace.expression}`
  );
  const aggregationTree = aggregationRules.map((rule) => ({
    ...rule,
    formulaTrace: nodeTotalDetails.get(rule.nodeId)?.formulaTrace,
    total: nodeTotalDetails.get(rule.nodeId)?.value ?? 0,
  }));
  const warnings = [
    ...new Set([
      ...allWarnings,
      ...(excludedRows.length > 0
        ? [
            `${excludedRows.length} mapped row(s) were not included in final results.`,
          ]
        : []),
    ]),
  ];
  const aggregationSummary = {
    categoryCount: Object.keys(categoryTotals).length,
    excludedCount: excludedRows.length,
    expectedResults: fapiInputs.expectedResults || {},
    finalResultCount: Object.keys(finalTotals).length,
    formulaTraceCount: Object.keys(formulaTrace).length,
    groupCount: Object.keys(groupTotals).length,
    mappedCount: mappedRows.length,
    nodeCount: Object.keys(nodeTotals).length,
    officialLineCount: Object.keys(officialLineValues).length,
    ruleCount: aggregationRules.length,
    warnings,
  };
  const hasCalculationWarning = warnings.some((message) =>
    message.includes("Divide by zero")
  );
  let status: ToolRunResult["status"] = "success";
  if (hasCalculationWarning) {
    status = "needs_review";
  } else if (warnings.length > 0) {
    status = "warning";
  }

  return {
    blockId: context.block.id,
    completedAt: new Date().toISOString(),
    errors: [],
    evidenceRefs: dedupeEvidenceRefs([
      ...getRowEvidence(mappedRows),
      ...aggregationRules.flatMap((rule) => rule.evidenceRefs || []),
    ]),
    logs: [
      warnings.length > 0
        ? warning("Rollup & Calculation Engine completed with warnings.", {
            ...aggregationSummary,
          })
        : info(
            "Rollup & Calculation Engine completed through aggregation rules.",
            {
              ...aggregationSummary,
            }
          ),
    ],
    outputs: {
      aggregation_summary: aggregationSummary,
      aggregation_tree: { aggregationTree },
      category_totals: { categoryTotalDetails, categoryTotals },
      excluded_rows: { excludedRows, rowCount: excludedRows.length },
      final_totals: { finalTotalDetails, finalTotals },
      fapi_inputs: { fapiInputs },
      formula_trace: { formulaTrace, formulaTraceText },
      group_totals: { groupTotals },
      included_rows_by_node: { includedRowsByNode },
      node_totals: { nodeTotalDetails: nodeTotalDetailRecord, nodeTotals },
      official_line_values: { officialLineDetails, officialLineValues },
    },
    primaryOutputRole: "final_totals",
    runId: context.runId,
    sourceTrace: dedupeSourceTrace([
      ...getRowTrace(mappedRows),
      ...aggregationRules.flatMap((rule) => rule.sourceTrace || []),
    ]),
    startedAt: context.startedAt,
    status,
    toolId: "logic.hierarchy_aggregator",
    warnings,
  };
}
