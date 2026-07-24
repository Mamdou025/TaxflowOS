import { info } from "../../../runtime/events";
import {
  createEvidenceRef,
  createSourceTraceRef,
} from "../../../runtime/lineage";
import type {
  ToolExecutionContext,
  ToolRunResult,
} from "../../../runtime/types";
import { SAMPLE_KEYWORD_RULES } from "./fixtures";
import { parseKeywordRules } from "./schema";

export function runKeywordRulesSource(
  context: ToolExecutionContext
): ToolRunResult {
  const rules = parseKeywordRules({
    config: context.config,
    fallbackRules: SAMPLE_KEYWORD_RULES,
  });
  const evidenceRefs = rules.map((rule) =>
    createEvidenceRef({
      block: context.block,
      label: `${rule.categoryLabel} keyword rule`,
      ruleId: rule.ruleId,
      sourceKind: "keyword_rules",
      valuePreview: rule.keywords.join(", "),
    })
  );
  const sourceTrace = evidenceRefs.map((evidenceRef) =>
    createSourceTraceRef({ evidenceRef })
  );
  const keywordRuleEvidence = Object.fromEntries(
    rules.map((rule) => [
      rule.ruleId,
      evidenceRefs.filter((ref) => ref.ruleId === rule.ruleId),
    ])
  );
  const keywordRuleTrace = Object.fromEntries(
    rules.map((rule) => [
      rule.ruleId,
      sourceTrace.filter((trace) => trace.ruleId === rule.ruleId),
    ])
  );
  const rulesWithTrace = rules.map((rule) => ({
    ...rule,
    evidenceRefs: keywordRuleEvidence[rule.ruleId],
    immutable: true,
    readOnlyEvidence: true,
    sourceTrace: keywordRuleTrace[rule.ruleId],
  }));
  const sourceVersion = Number(context.config.sourceVersion || 1);
  const ruleVersion = String(context.config.ruleVersion || `v${sourceVersion}`);
  const ruleMetadata = {
    readOnlyEvidence: true,
    ruleCount: rules.length,
    ruleVersion,
    sourceId: context.block.id,
    sourceKind: "keyword_rules",
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
      info("Keyword Rulebook emitted governed keyword rules.", {
        ruleCount: rules.length,
      }),
    ],
    outputs: {
      keyword_rules: {
        immutable: true,
        keywordRuleEvidence,
        keywordRules: rulesWithTrace,
        keywordRuleTrace,
        readOnlyEvidence: true,
        ruleCount: rules.length,
        ruleMetadata,
        ruleVersion,
        sourceKind: "keyword_rules",
      },
      rule_metadata: ruleMetadata,
      rule_version: {
        ruleVersion,
        sourceStatus: ruleMetadata.sourceStatus,
        sourceVersion,
      },
    },
    primaryOutputRole: "keyword_rules",
    runId: context.runId,
    sourceTrace,
    startedAt: context.startedAt,
    status: "success",
    toolId: "source.keyword_rules",
    warnings: [],
  };
}
