import { randomUUID } from "node:crypto";
import { DeterministicRuleProvider } from "./providers/deterministic";
import type { MappingProvider } from "./providers/provider";
import { loadRulePack } from "./rule-pack";
import {
  type MappingDecision,
  type MappingRequest,
  mappingRunSchema,
} from "./types";
import { validateMappings } from "./validator";
import { extractTrialBalanceFacts } from "./workbook";

export type MappingAgentOptions = {
  provider?: MappingProvider;
};

function benchmarkDecisions(
  workflow: string,
  rulePack: Awaited<ReturnType<typeof loadRulePack>>,
  availableReferenceFiles: Set<string>
): MappingDecision[] {
  return rulePack.benchmarkExpectations
    .filter((item) => availableReferenceFiles.has(item.sourceFile))
    .map((item) => ({
      affiliateAlias: item.affiliateAlias,
      confidence: 0.6,
      decisionId: `${workflow}-${item.ruleId}`,
      discrepancyExpected: false,
      engineField: item.engineField,
      evidence: {
        fileName: item.sourceFile,
        sheetName: item.sheetName,
      },
      rationale: item.rationale,
      reviewRequirement: item.reviewRequirement,
      rowType: item.rowType,
      ruleId: item.ruleId,
      sourceFactLabel: item.label,
      sourceRequired: false,
      sourceRole: "benchmark",
      sourceValue: null,
      treatment: item.treatment,
      workflow,
    }));
}

export async function runMappingAgent(
  request: MappingRequest,
  options: MappingAgentOptions = {}
) {
  if (request.trialBalances.length === 0) {
    throw new Error("At least one trial balance is required.");
  }
  const startedAt = new Date().toISOString();
  const runId = randomUUID();
  const rulePack = await loadRulePack(request.workflow);
  const extracted = request.trialBalances.map((input) =>
    extractTrialBalanceFacts(input, rulePack)
  );
  const facts = extracted.flatMap((item) => item.facts);
  const provider = options.provider ?? new DeterministicRuleProvider();

  const proposedMappings = await provider.proposeMappings({
    facts,
    rulePack,
    workflow: request.workflow,
  });
  const availableReferenceFiles = new Set(
    (request.referenceDocuments ?? []).map((document) => document.fileName)
  );
  const mappings = [
    ...proposedMappings,
    ...(request.includeBenchmarkCoverage
      ? benchmarkDecisions(request.workflow, rulePack, availableReferenceFiles)
      : []),
  ];

  const validation = validateMappings({
    availableReferenceFiles,
    facts,
    mappings,
    rulePack,
  });
  let status: "completed" | "needs_review" | "failed_validation" =
    "failed_validation";
  if (validation.passed) {
    status = validation.warnings > 0 ? "needs_review" : "completed";
  }

  return mappingRunSchema.parse({
    completedAt: new Date().toISOString(),
    mappings,
    provider: provider.id,
    rulePackVersion: rulePack.version,
    runId,
    startedAt,
    status,
    validation,
    workflow: request.workflow,
  });
}
