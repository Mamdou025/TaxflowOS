import { info } from "../../../runtime/events";
import {
  createEvidenceRef,
  createSourceTraceRef,
} from "../../../runtime/lineage";
import type {
  ToolExecutionContext,
  ToolRunResult,
} from "../../../runtime/types";
import { SAMPLE_ROLLUP_RULES } from "./fixtures";
import { parseRollupRules } from "./schema";

export function runRollupRulesSource(
  context: ToolExecutionContext
): ToolRunResult {
  const rules = parseRollupRules({
    config: context.config,
    fallbackRules: SAMPLE_ROLLUP_RULES,
  });
  const evidenceRefs = rules.map((rule) =>
    createEvidenceRef({
      block: context.block,
      label: `${rule.label} rollup rule`,
      ruleId: rule.rollupId,
      sourceKind: "rollup_rules",
      valuePreview: `${rule.operation}: ${rule.includeCategoryIds.join(", ")}`,
    })
  );
  const sourceTrace = evidenceRefs.map((evidenceRef) =>
    createSourceTraceRef({ evidenceRef })
  );
  const rollupRuleEvidence = Object.fromEntries(
    rules.map((rule) => [
      rule.rollupId,
      evidenceRefs.filter((ref) => ref.ruleId === rule.rollupId),
    ])
  );
  const rollupRuleTrace = Object.fromEntries(
    rules.map((rule) => [
      rule.rollupId,
      sourceTrace.filter((trace) => trace.ruleId === rule.rollupId),
    ])
  );
  const rollupRules = rules.map((rule) => ({
    ...rule,
    evidenceRefs: rollupRuleEvidence[rule.rollupId],
    immutable: true,
    readOnlyEvidence: true,
    sourceTrace: rollupRuleTrace[rule.rollupId],
  }));
  const sourceVersion = Number(context.config.sourceVersion || 1);
  const ruleVersion = String(context.config.ruleVersion || `v${sourceVersion}`);
  const ruleMetadata = {
    readOnlyEvidence: true,
    ruleCount: rules.length,
    ruleVersion,
    sourceId: context.block.id,
    sourceKind: "rollup_rules",
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
      info("Rollup Rules Source emitted governed rollup rules.", {
        ruleCount: rules.length,
      }),
    ],
    outputs: {
      rollup_rules: {
        immutable: true,
        readOnlyEvidence: true,
        rollupRuleEvidence,
        rollupRules,
        rollupRuleTrace,
        ruleCount: rules.length,
        ruleMetadata,
        ruleVersion,
        sourceKind: "rollup_rules",
      },
      rule_metadata: ruleMetadata,
      rule_version: {
        ruleVersion,
        sourceStatus: ruleMetadata.sourceStatus,
        sourceVersion,
      },
    },
    primaryOutputRole: "rollup_rules",
    runId: context.runId,
    sourceTrace,
    startedAt: context.startedAt,
    status: "success",
    toolId: "source.rollup_rules",
    warnings: [],
  };
}
