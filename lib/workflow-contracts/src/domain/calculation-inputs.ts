/** Optional calculation configuration; values and bindings stay separate for run input edits. */
export type CalculationInputBinding =
  { kind: 'manual' } | { kind: 'source'; blockId: string; path: string[] };

/** Explicit value-provider choice for this run; an absent key retains the saved setting. */
export type CalculationInputChoice =
  { kind: 'manual'; value?: number } | { kind: 'source'; blockId: string; path: string[] };
export type CalculationInputChoices = Record<string, CalculationInputChoice>;

export type CalculationInputDefinition = {
  name: string;
  label?: string;
  type: 'number';
  /** Descriptive only. This version does not perform dimensional validation. */
  unit?: string;
  binding?: CalculationInputBinding;
};

export type CalculationInputRequirement = CalculationInputDefinition & {
  label: string;
  status: 'provided' | 'missing' | 'invalid';
  origin?: 'manual' | 'source' | 'connected' | 'default';
  value?: number;
  message?: string;
};
