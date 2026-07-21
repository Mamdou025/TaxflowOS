import { info } from "../../../runtime/events";
import {
  createEvidenceRef,
  createSourceTraceRef,
} from "../../../runtime/lineage";
import type {
  ToolExecutionContext,
  ToolRunResult,
} from "../../../runtime/types";
import { SAMPLE_AGGREGATION_RULES } from "./fixtures";
import { type AggregationRule, parseAggregationRules } from "./schema";

function getRuleValuePreview(rule: AggregationRule) {
  const operands = (rule.operands || []).map((operand) =>
    operand.refType === "constant"
      ? String(operand.value ?? 0)
      : `${operand.refType}:${operand.refId || ""}`
  );
  return [
    ...(rule.includeCategoryIds || []).map(
      (categoryId) => `category:${categoryId}`
    ),
    ...rule.children.map((childId) => `node:${childId}`),
    ...operands,
    rule.formulaExpression ? `formula:${rule.formulaExpression}` : "",
    rule.value !== undefined ? `value:${rule.value}` : "",
  ]
    .filter(Boolean)
    .join(", ");
}

export function runAggregationRulesSource(
  context: ToolExecutionContext
): ToolRunResult {
  const rules = parseAggregationRules({
    config: context.config,
    fallbackRules: SAMPLE_AGGREGATION_RULES,
  });
  const evidenceRefs = rules.map((rule) =>
    createEvidenceRef({
      block: context.block,
      label: `${rule.label} aggregation rule`,
      ruleId: rule.nodeId,
      sourceKind: "aggregation_rules",
      valuePreview: getRuleValuePreview(rule),
    })
  );
  const sourceTrace = evidenceRefs.map((evidenceRef) =>
    createSourceTraceRef({ evidenceRef })
  );
  const aggregationRuleEvidence = Object.fromEntries(
    rules.map((rule) => [
      rule.nodeId,
      evidenceRefs.filter((ref) => ref.ruleId === rule.nodeId),
    ])
  );
  const aggregationRuleTrace = Object.fromEntries(
    rules.map((rule) => [
      rule.nodeId,
      sourceTrace.filter((trace) => trace.ruleId === rule.nodeId),
    ])
  );
  const aggregationRules = rules.map((rule) => ({
    ...rule,
    evidenceRefs: aggregationRuleEvidence[rule.nodeId],
    immutable: true,
    readOnlyEvidence: true,
    sourceTrace: aggregationRuleTrace[rule.nodeId],
  }));
  const sourceVersion = Number(context.config.sourceVersion || 1);
  const ruleVersion = String(context.config.ruleVersion || `v${sourceVersion}`);
  const aggregationTree = aggregationRules.map((rule) => ({
    children: rule.children,
    includeCategoryIds: rule.includeCategoryIds || [],
    formulaExpression: rule.formulaExpression,
    label: rule.label,
    nodeId: rule.nodeId,
    nodeType: rule.nodeType,
    operands: rule.operands || [],
    operation: rule.operation,
    resultName: rule.resultName,
    value: rule.value,
  }));
  const ruleMetadata = {
    readOnlyEvidence: true,
    ruleCount: rules.length,
    ruleVersion,
    sourceId: context.block.id,
    sourceKind: "aggregation_rules",
    sourceLocator: context.config.sourceLocator,
    sourceName: context.block.label,
    sourceStatus: context.config.sourceStatus || "draft",
    sourceSubtype: context.block.subtype,
    sourceVersion,
    updatedAt: context.block.updatedAt,
  };

  return {
    blockId: context.block.id,
    completedAt: new Date().toISOString(),
    errors: [],
    evidenceRefs,
    logs: [
      info("Aggregation Rulebook emitted governed hierarchy rules.", {
        ruleCount: rules.length,
      }),
    ],
    outputs: {
      aggregation_rules: {
        aggregationRuleEvidence,
        aggregationRules,
        aggregationRuleTrace,
        aggregationTree,
        immutable: true,
        readOnlyEvidence: true,
        ruleCount: rules.length,
        ruleMetadata,
        ruleVersion,
        sourceKind: "aggregation_rules",
      },
      aggregation_tree: {
        aggregationTree,
        immutable: true,
        readOnlyEvidence: true,
        sourceKind: "aggregation_rules",
      },
      rule_metadata: ruleMetadata,
      rule_version: {
        ruleVersion,
        sourceStatus: ruleMetadata.sourceStatus,
        sourceVersion,
      },
    },
    primaryOutputRole: "aggregation_rules",
    runId: context.runId,
    sourceTrace,
    startedAt: context.startedAt,
    status: "success",
    toolId: "source.aggregation_rules",
    warnings: [],
  };
}
