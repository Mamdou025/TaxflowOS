import { info } from "../../../runtime/events";
import {
  createEvidenceRef,
  createSourceTraceRef,
} from "../../../runtime/lineage";
import type {
  ToolExecutionContext,
  ToolRunResult,
} from "../../../runtime/types";
import { SAMPLE_CALCULATION_RULES } from "./fixtures";
import { parseCalculationRules } from "./schema";

export function runCalculationRulesSource(
  context: ToolExecutionContext
): ToolRunResult {
  const rules = parseCalculationRules({
    config: context.config,
    fallbackRules: SAMPLE_CALCULATION_RULES,
  });
  const evidenceRefs = rules.map((rule) =>
    createEvidenceRef({
      block: context.block,
      label: `${rule.label} calculation rule`,
      ruleId: rule.calculationId,
      sourceKind: "calculation_rules",
      valuePreview: rule.formulaExpression
        ? `${rule.resultKey} = ${rule.formulaExpression}`
        : `${rule.resultKey} = ${rule.operation}(${rule.operands.join(", ")})`,
    })
  );
  const sourceTrace = evidenceRefs.map((evidenceRef) =>
    createSourceTraceRef({ evidenceRef })
  );
  const calculationRuleEvidence = Object.fromEntries(
    rules.map((rule) => [
      rule.calculationId,
      evidenceRefs.filter((ref) => ref.ruleId === rule.calculationId),
    ])
  );
  const calculationRuleTrace = Object.fromEntries(
    rules.map((rule) => [
      rule.calculationId,
      sourceTrace.filter((trace) => trace.ruleId === rule.calculationId),
    ])
  );
  const calculationRules = rules.map((rule) => ({
    ...rule,
    evidenceRefs: calculationRuleEvidence[rule.calculationId],
    immutable: true,
    readOnlyEvidence: true,
    sourceTrace: calculationRuleTrace[rule.calculationId],
  }));
  const sourceVersion = Number(context.config.sourceVersion || 1);
  const ruleVersion = String(context.config.ruleVersion || `v${sourceVersion}`);
  const ruleMetadata = {
    readOnlyEvidence: true,
    ruleCount: rules.length,
    ruleVersion,
    sourceId: context.block.id,
    sourceKind: "calculation_rules",
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
      info("Calculation Rules Source emitted governed formula rules.", {
        ruleCount: rules.length,
      }),
    ],
    outputs: {
      calculation_rules: {
        calculationRuleEvidence,
        calculationRules,
        calculationRuleTrace,
        immutable: true,
        readOnlyEvidence: true,
        ruleCount: rules.length,
        ruleMetadata,
        ruleVersion,
        sourceKind: "calculation_rules",
      },
      rule_metadata: ruleMetadata,
      rule_version: {
        ruleVersion,
        sourceStatus: ruleMetadata.sourceStatus,
        sourceVersion,
      },
    },
    primaryOutputRole: "calculation_rules",
    runId: context.runId,
    sourceTrace,
    startedAt: context.startedAt,
    status: "success",
    toolId: "source.calculation_rules",
    warnings: [],
  };
}
