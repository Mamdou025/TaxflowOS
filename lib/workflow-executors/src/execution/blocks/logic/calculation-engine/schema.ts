import type { CalculationOperand, CalculationRule } from '../../source/calculation-rules/schema';
import { normalizeCalculationRule } from '../../source/calculation-rules/schema';

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

function parseNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value !== 'string') {
    return null;
  }
  if (!value.trim()) return null;
  const parsed = Number(value.trim());
  return Number.isFinite(parsed) ? parsed : null;
}

function calculationRuleFromRecord(
  record: Record<string, unknown>,
  index: number,
): CalculationRule | null {
  const rule = normalizeCalculationRule(record, index);
  return rule
    ? {
        ...rule,
        evidenceRefs: Array.isArray(record.evidenceRefs)
          ? (record.evidenceRefs as CalculationRule['evidenceRefs'])
          : undefined,
        sourceTrace: Array.isArray(record.sourceTrace)
          ? (record.sourceTrace as CalculationRule['sourceTrace'])
          : undefined,
      }
    : null;
}

export function collectCalculationRulesFromBackendInput(value: unknown): CalculationRule[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => asRecord(item))
      .filter((item): item is Record<string, unknown> => Boolean(item))
      .map(calculationRuleFromRecord)
      .filter((rule): rule is CalculationRule => Boolean(rule));
  }

  const record = asRecord(value);
  if (!record) {
    return [];
  }

  for (const key of ['calculationRules', 'calculation_rules', 'rules', 'nodes']) {
    const rules = record[key];
    if (Array.isArray(rules)) {
      return collectCalculationRulesFromBackendInput(rules);
    }
  }

  return [];
}

export { collectNamedValuesFromBackendInput } from '@workspace/workflow-core/calculation-inputs';

export type ResolvedOperand = {
  operand: CalculationOperand;
  value: number;
  missing: boolean;
};
