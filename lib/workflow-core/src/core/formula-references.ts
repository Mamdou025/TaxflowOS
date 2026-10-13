const REFERENCE_PART_REGEX = /[A-Za-z0-9_:.@-]/;
const REFERENCE_START_REGEX = /[A-Za-z_]/;
const WHITESPACE_REGEX = /\s/;
const SUPPORTED_FORMULA_FUNCTIONS = new Set([
  'abs',
  'if',
  'max',
  'max_subtract_zero',
  'min',
  'min_multiply_cap',
  'round',
]);

export type FormulaToken =
  | { text: string; type: 'comma'; value: ',' }
  | { text: string; type: 'comparator'; value: '>' | '<' | '>=' | '<=' | '==' | '!=' }
  | { text: string; type: 'identifier'; value: string }
  | { text: string; type: 'number'; value: number }
  | { text: string; type: 'operator'; value: '+' | '-' | '*' | '/' }
  | { text: string; type: 'paren'; value: '(' | ')' };

function isDigit(character: string) {
  return character >= '0' && character <= '9';
}

function isReferenceStart(character: string) {
  return REFERENCE_START_REGEX.test(character);
}

function isReferencePart(character: string) {
  return REFERENCE_PART_REGEX.test(character);
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Tokenization is deliberately local and supports calculator-style numbers, refs, operators, parentheses, and function commas.
export function tokenizeFormulaExpression(expression: string) {
  const tokens: FormulaToken[] = [];
  const warnings: string[] = [];
  let index = 0;

  while (index < expression.length) {
    const character = expression[index];
    if (WHITESPACE_REGEX.test(character)) {
      index += 1;
      continue;
    }

    if (character === '(' || character === ')') {
      tokens.push({ text: character, type: 'paren', value: character });
      index += 1;
      continue;
    }

    if (character === ',') {
      tokens.push({ text: character, type: 'comma', value: character });
      index += 1;
      continue;
    }

    if (character === '+' || character === '-' || character === '*' || character === '/') {
      tokens.push({ text: character, type: 'operator', value: character });
      index += 1;
      continue;
    }

    if (character === '>' || character === '<' || character === '=' || character === '!') {
      const twoChar = expression.slice(index, index + 2);
      if (twoChar === '>=' || twoChar === '<=' || twoChar === '==' || twoChar === '!=') {
        tokens.push({ text: twoChar, type: 'comparator', value: twoChar });
        index += 2;
        continue;
      }
      if (character === '>' || character === '<') {
        tokens.push({ text: character, type: 'comparator', value: character });
        index += 1;
        continue;
      }
      // A bare '=' or '!' (not followed by '=') has no meaning in this grammar —
      // fall through to the unsupported-character warning below rather than guess.
    }

    if (isDigit(character) || character === '.') {
      const text =
        expression.slice(index).match(/^(?:\d+\.?\d*|\.\d+)(?:[eE][+-]?\d+)?/)?.[0] ?? character;
      const end = index + text.length;
      const value = Number(text);
      if (Number.isFinite(value)) {
        tokens.push({ text, type: 'number', value });
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
      tokens.push({ text, type: 'identifier', value: text });
      index = end;
      continue;
    }

    warnings.push(`Unsupported formula character "${character}" was ignored.`);
    index += 1;
  }

  return { tokens, warnings };
}

export function isSupportedFormulaFunction(name: string) {
  return SUPPORTED_FORMULA_FUNCTIONS.has(name.toLowerCase());
}

export function collectFormulaReferences(expression: string) {
  const { tokens } = tokenizeFormulaExpression(expression);
  const refs = tokens.flatMap((token, index) => {
    if (token.type !== 'identifier') {
      return [];
    }
    const next = tokens[index + 1];
    if (next?.type === 'paren' && next.value === '(' && isSupportedFormulaFunction(token.value)) {
      return [];
    }
    return [token.value];
  });
  return [...new Set(refs)];
}
