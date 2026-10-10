import { collectFormulaReferences } from './formula-references';

export type CalculationInputRule = {
  resultKey: string;
  label?: string;
  unit?: string;
  operation?: string;
  formulaExpression?: string;
  operands?: readonly unknown[];
};

/** Formula results are dependencies inside the calculator, not external input fields. */
export function inferCalculationInputs(rules: readonly CalculationInputRule[]): string[] {
  const outputs = new Set(rules.map((rule) => rule.resultKey));
  return [
    ...new Set(
      rules.flatMap((rule) =>
        (rule.formulaExpression?.trim()
          ? collectFormulaReferences(rule.formulaExpression)
          : (rule.operands ?? []).filter((value): value is string => typeof value === 'string')
        ).filter((name) => !outputs.has(name)),
      ),
    ),
  ];
}
