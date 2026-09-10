import { error, info, warning } from "../../../runtime/events";
import { evaluateRollupGroups } from '@/shared/workflow-engine/rollup-evaluation';
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
import type { RollupRule } from "../../source/rollup-rules/schema";
import type { HierarchyMappedRow } from "../hierarchy-aggregator/schema";
import {
  collectMappedRowsFromRollupInput,
  collectRollupRulesFromBackendInput,
} from "./schema";

type CategoryDetail = {
  categoryId: string;
  categoryLabel: string;
  includedRows: string[];
  rowCount: number;
  value: number;
};

function getRoleInputs(context: ToolExecutionContext, role: string) {
  return context.inputsByRole[role] || [];
}

function getMappedRows(context: ToolExecutionContext) {
  return getRoleInputs(context, "mapped_rows").flatMap((input) =>
    collectMappedRowsFromRollupInput(input)
  );
}

function getRollupRules(context: ToolExecutionContext) {
  const fromUpstream = getRoleInputs(context, "rollup_rules").flatMap((input) =>
    collectRollupRulesFromBackendInput(input)
  );
  if (fromUpstream.length > 0) return fromUpstream;
  return collectRollupRulesFromBackendInput(context.config);
}

function sumRows(rows: HierarchyMappedRow[]) {
  return rows.reduce((total, row) => total + row.amount, 0);
}

function traceRows(rows: HierarchyMappedRow[]) {
  return rows.flatMap((row) => row.sourceTrace || []);
}

function evidenceRows(rows: HierarchyMappedRow[]): EvidenceRef[] {
  return rows.flatMap((row) => row.evidenceRefs || []);
}

function traceRules(rules: RollupRule[]) {
  return rules.flatMap((rule) => rule.sourceTrace || []);
}

function evidenceRules(rules: RollupRule[]): EvidenceRef[] {
  return rules.flatMap((rule) => rule.evidenceRefs || []);
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
      category_totals: { categoryTotals: {}, categoryTotalDetails: {} },
      excluded_rows: { excludedRows: [], rowCount: 0 },
      included_rows_by_category: { includedRowsByCategory: {} },
      included_rows_by_rollup: { includedRowsByRollup: {} },
      named_values: { namedValues: {} },
      rollup_formula_trace: { rollupFormulaTrace: {} },
      rollup_summary: {
        categoryCount: 0,
        mappedRowCount: 0,
        rollupCount: 0,
        warningCount: 0,
      },
      rollup_totals: { rollupTotals: {}, rollupTotalDetails: {} },
    },
    primaryOutputRole: "rollup_summary",
    runId: context.runId,
    sourceTrace: [],
    startedAt: context.startedAt,
    status: "error",
    toolId: "logic.category_rollup_aggregator",
    warnings: [],
  };
}

function getMissingInputErrors({
  rows,
  rules,
}: {
  rows: HierarchyMappedRow[];
  rules: RollupRule[];
}) {
  return [
    rows.length === 0
      ? "Category Rollup Aggregator needs mapped_rows input."
      : "",
    rules.length === 0
      ? "Category Rollup Aggregator needs rollup_rules input."
      : "",
  ].filter(Boolean);
}

function getCategoryDetails(rows: HierarchyMappedRow[]) {
  const byCategory = new Map<string, HierarchyMappedRow[]>();
  for (const row of rows) {
    byCategory.set(row.categoryId, [
      ...(byCategory.get(row.categoryId) || []),
      row,
    ]);
  }

  return Object.fromEntries(
    [...byCategory.entries()].map(([categoryId, categoryRows]) => {
      const first = categoryRows[0];
      const detail: CategoryDetail = {
        categoryId,
        categoryLabel: first?.categoryLabel || categoryId,
        includedRows: categoryRows.map((row) => row.rowId),
        rowCount: categoryRows.length,
        value: sumRows(categoryRows),
      };
      return [categoryId, detail];
    })
  );
}

function getCategoryTotals(details: Record<string, CategoryDetail>) {
  return Object.fromEntries(
    Object.entries(details).map(([categoryId, detail]) => [
      categoryId,
      detail.value,
    ])
  );
}

export function runCategoryRollupAggregator(
  context: ToolExecutionContext
): ToolRunResult {
  const rows = getMappedRows(context);
  // Do not silently drop a matched record whose numeric field is missing.
  const invalidRows = getRoleInputs(context, 'mapped_rows').flatMap(input => {
    const record = input as Record<string, unknown>;
    const raw = Array.isArray(input) ? input : record?.mappedRows ?? record?.mapped_rows ?? record?.rows;
    return Array.isArray(raw) ? raw.filter(row => collectMappedRowsFromRollupInput([row]).length === 0) : [];
  });
  if (invalidRows.length) return createErrorResult({ context, errors: invalidRows.map((row, index) => `Cannot aggregate ${String(row?.label ?? row?.rowId ?? `row ${index + 1}`)}: its category or numeric value is missing. Review the document fields.`) });
  const rules = getRollupRules(context);
  const missingErrors = getMissingInputErrors({ rows, rules });

  if (missingErrors.length > 0) {
    return createErrorResult({ context, errors: missingErrors });
  }

  const categoryDetails = getCategoryDetails(rows);
  // The mapper declares its configured categories independently of matches.
  // An empty, known category has a computed zero total; an unknown input does not.
  for (const input of getRoleInputs(context, 'mapping_summary')) {
    const declared = (input as { rulesUsed?: { categoryId?: string; categoryLabel?: string }[] }).rulesUsed;
    if (!Array.isArray(declared)) continue;
    for (const category of declared) {
      if (category.categoryId && !Object.hasOwn(categoryDetails, category.categoryId)) categoryDetails[category.categoryId] = {
        categoryId: category.categoryId, categoryLabel: category.categoryLabel || category.categoryId,
        includedRows: [], rowCount: 0, value: 0,
      };
    }
  }
  const categoryTotals = getCategoryTotals(categoryDetails);
  const rollupTotals: Record<string, number> = {};
  const rollupTotalDetails: Record<string, Record<string, unknown>> = {};
  const includedRowsByRollup: Record<string, HierarchyMappedRow[]> = {};
  const rollupFormulaTrace: Record<string, Record<string, unknown>> = {};
  const warnings: string[] = [];
  const includedCategoryIds = new Set<string>();
  let evaluated: ReturnType<typeof evaluateRollupGroups>;
  try {
    evaluated = evaluateRollupGroups(rules, categoryTotals);
  } catch (error) {
    return createErrorResult({ context, errors: [error instanceof Error ? error.message : 'Could not evaluate aggregation groups.'] });
  }

  for (const rule of rules) {
    const rollup = evaluated.get(rule.rollupId)!;
    rollupTotals[rule.rollupId] = rollup.result;
    for (const categoryId of rollup.leafCategoryIds) {
      includedCategoryIds.add(categoryId);
    }
    const rollupRows = rows.filter((row) =>
      rollup.leafCategoryIds.includes(row.categoryId)
    );
    includedRowsByRollup[rule.rollupId] = rollupRows;
    rollupTotalDetails[rule.rollupId] = {
      includedCategoryIds: rule.includeCategoryIds,
      label: rule.label,
      operation: rule.operation,
      result: rollup.result,
      rollupId: rule.rollupId,
      warnings: rollup.warnings,
    };
    rollupFormulaTrace[rule.rollupId] = {
      description: rule.description,
      formula: `${rule.operation}(${rule.includeCategoryIds.join(', ')})`,
      inputValues: rollup.inputValues,
      operation: rule.operation,
      result: rollup.result,
      rollupId: rule.rollupId,
      warnings: rollup.warnings,
    };
    warnings.push(...rollup.warnings);
  }

  const excludedRows = rows.filter(
    (row) => !includedCategoryIds.has(row.categoryId)
  );
  const includedRowsByCategory = Object.fromEntries(
    Object.entries(categoryDetails).map(([categoryId, detail]) => [
      categoryId,
      rows.filter((row) => detail.includedRows.includes(row.rowId)),
    ])
  );
  const namedValues = {
    ...categoryTotals,
    ...rollupTotals,
  };
  const sourceTrace = dedupeSourceTrace([
    ...traceRows(rows),
    ...traceRules(rules),
  ] as SourceTraceRef[]);
  const evidenceRefs = dedupeEvidenceRefs([
    ...evidenceRows(rows),
    ...evidenceRules(rules),
  ]);
  const rollupSummary = {
    categoryCount: Object.keys(categoryTotals).length,
    excludedRowCount: excludedRows.length,
    mappedRowCount: rows.length,
    namedValueCount: Object.keys(namedValues).length,
    rollupCount: rules.length,
    warningCount: warnings.length,
  };

  return {
    blockId: context.block.id,
    completedAt: new Date().toISOString(),
    errors: [],
    evidenceRefs,
    logs: [
      warnings.length > 0
        ? warning("Category rollup completed with warnings.", rollupSummary)
        : info("Category rollup completed.", rollupSummary),
    ],
    outputs: {
      category_totals: {
        categoryTotalDetails: categoryDetails,
        categoryTotals,
      },
      excluded_rows: {
        excludedRows,
        rowCount: excludedRows.length,
      },
      included_rows_by_category: {
        includedRowsByCategory,
      },
      included_rows_by_rollup: {
        includedRowsByRollup,
      },
      named_values: {
        namedValues,
        sourceKind: "rollup_named_values",
      },
      rollup_formula_trace: {
        rollupFormulaTrace,
      },
      rollup_summary: rollupSummary,
      rollup_totals: {
        rollupTotalDetails,
        rollupTotals,
      },
    },
    primaryOutputRole: "named_values",
    runId: context.runId,
    sourceTrace,
    startedAt: context.startedAt,
    status: warnings.length > 0 ? "warning" : "success",
    toolId: "logic.category_rollup_aggregator",
    warnings,
  };
}
