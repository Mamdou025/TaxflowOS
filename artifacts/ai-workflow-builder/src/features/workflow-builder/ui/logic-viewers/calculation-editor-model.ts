import type { WorkflowEdge } from '@/shared/workflow-engine/state/workflow-store';
import type { WorkflowBlock } from '@/shared/workflow-engine/workflow/contracts';

export type InlineFormula = {
  calculationId: string;
  description?: string;
  formulaExpression?: string;
  label: string;
  operands: Array<string | number>;
  operation: string;
  resultKey: string;
  roundingDigits?: number;
  unit?: string;
};

export type CalculationMode = 'auto' | 'inline' | 'external_rules';

export type DisplayToken =
  | { type: 'ref'; value: string }
  | { type: 'op'; value: string }
  | { type: 'num'; value: string }
  | { type: 'func'; value: string }
  | { type: 'paren'; value: string };

const KNOWN_FUNCTIONS = new Set([
  'abs',
  'max',
  'min',
  'round',
  'max_subtract_zero',
  'min_multiply_cap',
]);
const DIGIT_CHARACTER_REGEX = /\d/;
const IDENTIFIER_CHARACTER_REGEX = /[A-Za-z0-9_:.@-]/;
const IDENTIFIER_START_REGEX = /[A-Za-z_]/;
const NUMBER_PREFIX_REGEX = /^(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/;
const NUMERIC_LITERAL_REGEX = /^[+-]?(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?$/;
const WHITESPACE_CHARACTER_REGEX = /\s/;
const OPERATOR_TOKENS = new Set(['+', '-', '*', '/']);

export const SPECIAL_FUNCTIONS = [
  { display: 'max(A−B, 0)', name: 'max_subtract_zero' },
  { display: 'min(A×B, C)', name: 'min_multiply_cap' },
  { display: 'abs(…)', name: 'abs' },
  { display: 'max(…)', name: 'max' },
  { display: 'min(…)', name: 'min' },
  { display: 'round(…)', name: 'round' },
] as const;

export const OPERATOR_KEYS = [
  { label: '+', value: '+' },
  { label: '−', value: '-' },
  { label: '×', value: '*' },
  { label: '÷', value: '/' },
  { label: '(', value: '(' },
  { label: ')', value: ')' },
  { label: ',', value: ',' },
] as const;

export const CALCULATION_TOKEN_LEGEND = [
  { cls: 'border-sky-400/40 bg-sky-400/10 text-sky-700', label: 'Upstream' },
  {
    cls: 'border-emerald-400/40 bg-emerald-400/10 text-emerald-700',
    label: 'Term',
  },
  { cls: 'border-amber-400/40 bg-amber-400/10 text-amber-700', label: 'Constant' },
  {
    cls: 'border-violet-400/40 bg-violet-400/10 text-violet-700',
    label: 'Function',
  },
] as const;

function getSingleCharacterToken(character: string): DisplayToken | null {
  if (character === '(' || character === ')') return { type: 'paren', value: character };
  if (character === ',') return { type: 'op', value: character };
  if (OPERATOR_TOKENS.has(character)) return { type: 'op', value: character };
  return null;
}

function readNumberToken(expression: string, startIndex: number) {
  const text =
    expression.slice(startIndex).match(NUMBER_PREFIX_REGEX)?.[0] ?? expression[startIndex];
  const endIndex = startIndex + text.length;
  return {
    nextIndex: endIndex,
    token: { type: 'num', value: expression.slice(startIndex, endIndex) },
  } satisfies { nextIndex: number; token: DisplayToken };
}

function readIdentifierToken(expression: string, startIndex: number) {
  let endIndex = startIndex + 1;
  while (endIndex < expression.length && IDENTIFIER_CHARACTER_REGEX.test(expression[endIndex])) {
    endIndex += 1;
  }
  const word = expression.slice(startIndex, endIndex);
  return {
    nextIndex: endIndex,
    token: { type: KNOWN_FUNCTIONS.has(word) ? 'func' : 'ref', value: word },
  } satisfies { nextIndex: number; token: DisplayToken };
}

function getTokenAt(expression: string, index: number) {
  const character = expression[index];
  if (WHITESPACE_CHARACTER_REGEX.test(character)) return { nextIndex: index + 1, token: null };
  const singleCharacterToken = getSingleCharacterToken(character);
  if (singleCharacterToken) return { nextIndex: index + 1, token: singleCharacterToken };
  if (
    DIGIT_CHARACTER_REGEX.test(character) ||
    (character === '.' && DIGIT_CHARACTER_REGEX.test(expression[index + 1] ?? ''))
  ) {
    return readNumberToken(expression, index);
  }
  if (IDENTIFIER_START_REGEX.test(character)) return readIdentifierToken(expression, index);
  return { nextIndex: index + 1, token: null };
}

export function tokenizeExpression(expression: string): DisplayToken[] {
  const tokens: DisplayToken[] = [];
  let index = 0;
  while (index < expression.length) {
    const result = getTokenAt(expression, index);
    if (result.token) tokens.push(result.token);
    index = result.nextIndex;
  }
  return tokens;
}

export function tokensToExpression(tokens: DisplayToken[]): string {
  return tokens.map((token) => token.value).join(' ');
}

export function getTokenItems(tokens: DisplayToken[]) {
  const counts = new Map<string, number>();
  return tokens.map((token) => {
    const baseKey = `${token.type}:${token.value}`;
    const count = (counts.get(baseKey) ?? 0) + 1;
    counts.set(baseKey, count);
    return { key: `${baseKey}:${count}`, token };
  });
}

export function formulaToExpression(formula: InlineFormula): string {
  if (formula.formulaExpression?.trim()) return formula.formulaExpression.trim();
  const operands = formula.operands.map(String);
  switch (formula.operation) {
    case 'pass_through':
      return operands[0] ?? '';
    case 'add':
      return operands.join(' + ');
    case 'subtract':
      return operands.length > 1
        ? `${operands[0]} - ${operands.slice(1).join(' - ')}`
        : (operands[0] ?? '');
    case 'multiply':
      return operands.join(' * ');
    case 'divide':
      return operands.length > 1
        ? `${operands[0]} / ${operands.slice(1).join(' / ')}`
        : (operands[0] ?? '');
    default:
      return operands.length > 0 ? `${formula.operation}(${operands.join(', ')})` : '';
  }
}

export function getFormulasFromConfig(config: Record<string, unknown>): InlineFormula[] {
  const raw = config.formulas ?? config.calculationRules ?? config.inlineFormulas;
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (item): item is InlineFormula =>
      typeof item === 'object' &&
      item !== null &&
      typeof (item as InlineFormula).calculationId === 'string',
  );
}

export function hasConnectedCalculationRuleSource(block: WorkflowBlock, edges: WorkflowEdge[]) {
  return edges.some(
    (edge) =>
      edge.target === block.id &&
      (edge.data?.targetInputRole === 'calculation_rules' ||
        edge.data?.workflowEdge?.targetInputRole === 'calculation_rules'),
  );
}

export function isValidNumericLiteral(value: string) {
  const trimmed = value.trim();
  return NUMERIC_LITERAL_REGEX.test(trimmed) && Number.isFinite(Number(trimmed));
}
