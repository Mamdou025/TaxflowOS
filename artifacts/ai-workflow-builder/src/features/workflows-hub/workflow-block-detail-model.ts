import type {
  WorkflowBlock,
  WorkflowDefinition,
} from '@workspace/workflow-contracts/domain/workflow-types';
import type { WorkflowSession } from '@workspace/workflow-contracts/library-types';

type SavedSection = { key: string; label: string; value: unknown };
const record = (value: unknown): Record<string, unknown> | undefined =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : undefined;
const text = (value: unknown) => (typeof value === 'string' && value.trim() ? value : undefined);

function savedSections(block: WorkflowBlock) {
  const sections: SavedSection[] = [];
  const keys = [
    ['keywordRules', 'Saved keyword rules'],
    ['rollupRules', 'Saved rollup rules'],
    ['rollup_rules', 'Saved rollup rules'],
    ['aggregationRules', 'Saved aggregation rules'],
    ['aggregation_rules', 'Saved aggregation rules'],
    ['validationRules', 'Saved validation rules'],
    ['readinessConditions', 'Saved readiness conditions'],
    ['worksheetLines', 'Configured worksheet lines'],
  ];
  for (const [key, label] of keys) {
    if (Array.isArray(block.config[key]) && block.config[key].length)
      sections.push({ key, label, value: block.config[key] });
  }
  const settingKeys =
    block.family === 'Logic'
      ? [
          'aggregationMethod',
          'amountField',
          'includeTargets',
          'includeSectionIds',
          'includeSubsectionIds',
          'excludeTargets',
          'transformation',
          'transformationMode',
          'currency',
          'matchFields',
          'unmatchedStrategy',
          'mode',
          'operation',
          'operands',
          'formulaExpression',
          'expression',
        ]
      : block.family === 'Review / Validation'
        ? [
            'threshold',
            'tolerance',
            'requiredKeys',
            'blocking',
            'maxDeviationPercent',
            'baseCurrency',
          ]
        : [];
  const settings = Object.fromEntries(
    settingKeys
      .filter((key) => block.config[key] !== undefined)
      .map((key) => [key, block.config[key]]),
  );
  if (Object.keys(settings).length)
    sections.push({ key: 'settings', label: 'Saved block settings', value: settings });
  // These generic keys represent rules only on an explicit rule source.
  if (/Rules$/.test(block.subtype)) {
    for (const key of ['rules', 'manualRules', 'rows', 'nodes']) {
      if (Array.isArray(block.config[key]) && block.config[key].length)
        sections.push({ key, label: 'Saved rule rows', value: block.config[key] });
    }
  }
  return sections;
}

function savedFormulas(block: WorkflowBlock) {
  const formulas = ['formulas', 'inlineFormulas', 'calculationRules', 'calculation_rules'].flatMap(
    (key) => {
      const value = block.config[key];
      return Array.isArray(value)
        ? value.flatMap((item) => (record(item) ? [record(item)!] : []))
        : [];
    },
  );
  if (block.formula) formulas.push({ ...block.formula, operands: block.formula.inputs });
  return formulas.map((formula) => ({
    label:
      text(formula.label) ??
      text(formula.calculationId) ??
      text(formula.nodeId) ??
      text(formula.id),
    resultKey: text(formula.resultKey) ?? text(formula.outputKey) ?? text(formula.resultName),
    expression: text(formula.formulaExpression) ?? text(formula.expression),
    operation: text(formula.operation),
    operands: formula.operands,
    description: text(formula.description),
    unit: text(formula.unit),
  }));
}

function hasStaleDependency(
  definition: WorkflowDefinition,
  session: WorkflowSession,
  blockId: string,
) {
  const seen = new Set<string>();
  const pending = [blockId];
  while (pending.length) {
    const id = pending.pop()!;
    if (seen.has(id)) continue;
    seen.add(id);
    if (session.stale.includes(id)) return true;
    pending.push(
      ...definition.edges
        .filter((edge) => edge.status === 'active' && edge.targetBlockId === id)
        .map((edge) => edge.sourceBlockId),
    );
  }
  return false;
}

/** A read-only display projection: no normalization defaults, evaluation or result substitution. */
export function projectWorkflowBlockDetail(
  definition: WorkflowDefinition,
  blockId: string,
  session?: WorkflowSession,
) {
  const block = definition.blocks.find((item) => item.id === blockId);
  if (!block) return undefined;
  const candidate = session?.results[blockId];
  const result = candidate?.blockId === blockId ? candidate : undefined;
  const state =
    candidate && !result
      ? 'unavailable'
      : !result
        ? 'missing'
        : session && hasStaleDependency(definition, session, blockId)
          ? 'previous'
          : ['error', 'skipped'].includes(result.status) || result.errors.length > 0
            ? 'failed'
            : 'recorded';
  return {
    block,
    mode: text(block.config.mode),
    formulas: savedFormulas(block),
    sections: savedSections(block),
    dependencies: definition.edges
      .filter((edge) => edge.status === 'active' && edge.targetBlockId === blockId)
      .map((edge) => ({
        id: edge.id,
        label:
          definition.blocks.find((source) => source.id === edge.sourceBlockId)?.label ??
          edge.sourceBlockId,
        sourceRole: edge.sourceOutputRole,
        targetRole: edge.targetInputRole,
      })),
    state,
    result,
    trace: result?.output.formulaTrace ?? result?.output.formula_trace,
  };
}
