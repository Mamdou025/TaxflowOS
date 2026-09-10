import type { RollupRule } from './execution/blocks/source/rollup-rules/schema';

export type RollupEvaluation = {
  result: number;
  inputValues: { categoryId: string; value: number }[];
  leafCategoryIds: string[];
  warnings: string[];
};

// Shared by the editor's test panel and the workflow runner.
export function evaluateRollupGroups(rules: RollupRule[], categories: Record<string, number>) {
  const byId = new Map(rules.map(rule => [rule.rollupId, rule]));
  if (byId.size !== rules.length) throw new Error('Aggregation group IDs must be unique.');
  const results = new Map<string, RollupEvaluation>();
  const visiting = new Set<string>();
  const evaluate = (id: string): RollupEvaluation => {
    const cached = results.get(id);
    if (cached) return cached;
    if (visiting.has(id)) throw new Error(`Circular aggregation group reference: ${id}.`);
    visiting.add(id);
    const rule = byId.get(id)!;
    const warnings: string[] = [];
    const leaves = new Set<string>();
    const inputValues = rule.includeCategoryIds.map(categoryId => {
      // A same-name group wraps the original category, not itself.
      if (categoryId !== id && byId.has(categoryId)) {
        const child = evaluate(categoryId);
        child.leafCategoryIds.forEach(leaf => leaves.add(leaf));
        warnings.push(...child.warnings);
        return { categoryId, value: child.result };
      }
      leaves.add(categoryId);
      if (!(categoryId in categories)) warnings.push(`Missing category reference: ${categoryId}.`);
      return { categoryId, value: categories[categoryId] ?? 0 };
    });
    const values = inputValues.map(input => input.value);
    let result = 0;
    if (values.length > 0) {
      switch (rule.operation) {
        case 'sum': result = values.reduce((a, b) => a + b, 0); break;
        case 'sum_abs': result = values.reduce((a, b) => a + Math.abs(b), 0); break;
        case 'subtract': result = values.slice(1).reduce((a, b) => a - b, values[0]); break;
        case 'multiply': result = values.reduce((a, b) => a * b, 1); break;
        case 'divide':
          if (values.slice(1).includes(0)) throw new Error(`Divide by zero in aggregation group ${id}.`);
          result = values.slice(1).reduce((a, b) => a / b, values[0]); break;
        case 'pass_through': result = values[0]; break;
      }
    }
    if (!Number.isFinite(result)) throw new Error(`Non-finite result in aggregation group ${id}.`);
    const evaluation = { result, inputValues, leafCategoryIds: [...leaves], warnings: [...new Set(warnings)] };
    visiting.delete(id);
    results.set(id, evaluation);
    return evaluation;
  };
  rules.forEach(rule => evaluate(rule.rollupId));
  return results;
}
