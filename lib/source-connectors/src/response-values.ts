/** Provider-independent response selection. No fiscal names or conversion rules. */
export type ResponseValueMapping = {
  name: string;
  path: string;
  type: 'number' | 'text' | 'boolean' | 'json';
  operation?: 'value' | 'mean';
  skipMissing?: boolean;
  positive?: boolean;
  /** Optional workflow config field supplying an explicit override. */
  overrideKey?: string;
};

const forbidden = new Set(['__proto__', 'prototype', 'constructor']);

export function parseResponseValueMappings(value: unknown): ResponseValueMapping[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error('Add at least one named output.');
  }
  const names = new Set<string>();
  return value.map((entry: unknown) => {
    if (!entry || typeof entry !== 'object') throw new Error('Invalid output mapping.');
    const mapping = entry as ResponseValueMapping;
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(mapping.name) || forbidden.has(mapping.name)) {
      throw new Error('Output names must start with a letter or underscore and use letters, numbers or underscores.');
    }
    if (names.has(mapping.name)) throw new Error(`Duplicate output name: ${mapping.name}.`);
    names.add(mapping.name);
    if (typeof mapping.path !== 'string' || mapping.path.split('.').some((key) => forbidden.has(key))) {
      throw new Error(`Invalid response path for ${mapping.name}.`);
    }
    if (!['number', 'text', 'boolean', 'json'].includes(mapping.type) ||
        (mapping.operation !== undefined && !['value', 'mean'].includes(mapping.operation)) ||
        (mapping.operation === 'mean' && mapping.type !== 'number')) {
      throw new Error(`Invalid output type or operation for ${mapping.name}.`);
    }
    if (mapping.overrideKey !== undefined &&
        (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(mapping.overrideKey) || forbidden.has(mapping.overrideKey))) {
      throw new Error(`Invalid override field for ${mapping.name}.`);
    }
    return mapping;
  });
}

function select(value: unknown, segments: string[]): unknown[] {
  if (!segments.length) return [value];
  const [key, ...rest] = segments;
  if (key === '*') {
    if (!Array.isArray(value)) throw new Error('A wildcard path must select an array.');
    return value.flatMap((item) => select(item, rest));
  }
  const next = value !== null && typeof value === 'object' && Object.hasOwn(value, key)
    ? (value as Record<string, unknown>)[key] : undefined;
  return select(next, rest);
}

function typed(value: unknown, mapping: ResponseValueMapping): unknown {
  if (value === undefined || value === null) throw new Error(`${mapping.name}: response value is missing.`);
  if (mapping.type === 'json') return value;
  if (mapping.type === 'number') {
    const number = typeof value === 'number' ? value :
      typeof value === 'string' && value.trim() !== '' ? Number(value) : NaN;
    if (!Number.isFinite(number) || (mapping.positive && number <= 0)) {
      throw new Error(`${mapping.name}: expected ${mapping.positive ? 'a positive' : 'a finite'} number.`);
    }
    return number;
  }
  if (typeof value !== (mapping.type === 'text' ? 'string' : 'boolean')) {
    throw new Error(`${mapping.name}: expected ${mapping.type}.`);
  }
  return value;
}

export function mapResponseValues(payload: unknown, rawMappings: unknown) {
  const mappings = parseResponseValueMappings(rawMappings);
  return Object.fromEntries(mappings.map((mapping) => {
    let values = select(payload, mapping.path ? mapping.path.split('.') : []);
    if (mapping.skipMissing) values = values.filter((value) => value !== undefined && value !== null);
    if (mapping.operation === 'mean') {
      if (!values.length) throw new Error(`${mapping.name}: no observations to average.`);
      const numbers = values.map((value) => typed(value, mapping) as number);
      const mean = numbers.reduce((total, number) => total + number / numbers.length, 0);
      return [mapping.name, typed(mean, mapping)];
    }
    if (values.length !== 1) throw new Error(`${mapping.name}: select one value or choose a reduction.`);
    return [mapping.name, typed(values[0], mapping)];
  }));
}

export function resolveResponseValues(payload: unknown, rawMappings: unknown, config: Record<string, unknown>) {
  const mappings = parseResponseValueMappings(rawMappings);
  const overrides: string[] = [];
  const namedValues = Object.fromEntries(mappings.map((mapping) => {
    const override = mapping.overrideKey ? config[mapping.overrideKey] : undefined;
    if (override !== undefined && override !== null) {
      overrides.push(mapping.name);
      return [mapping.name, typed(override, mapping)];
    }
    return [mapping.name, mapResponseValues(payload, [mapping])[mapping.name]];
  }));
  return { namedValues, overrides };
}
