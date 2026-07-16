import type { WorkflowRulePack } from "./rule-pack";
import {
  type ExtractedFact,
  type MappingDecision,
  mappingDecisionSchema,
  type ValidationIssue,
} from "./types";

export type ValidationContext = {
  availableReferenceFiles: Set<string>;
  facts: ExtractedFact[];
  mappings: MappingDecision[];
  rulePack: WorkflowRulePack;
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: The validator intentionally keeps all mandatory post-mapping governance checks visible in one auditable pass.
export function validateMappings(context: ValidationContext) {
  const issues: ValidationIssue[] = [];
  const allowedEngineFields = new Set(context.rulePack.allowedEngineFields);
  const knownPrimaryEvidence = new Set(
    context.facts.map(
      (fact) =>
        `${fact.affiliateAlias}|${fact.sourceFile}|${fact.sheetName}|${fact.labelCell}`
    )
  );
  const seen = new Set<string>();

  for (const mapping of context.mappings) {
    const parsed = mappingDecisionSchema.safeParse(mapping);
    if (!parsed.success) {
      issues.push({
        code: "INVALID_MAPPING_SHAPE",
        decisionId: mapping.decisionId,
        message: parsed.error.issues.map((issue) => issue.message).join("; "),
        severity: "error",
      });
      continue;
    }

    if (mapping.engineField && !allowedEngineFields.has(mapping.engineField)) {
      issues.push({
        code: "ENGINE_FIELD_NOT_ALLOWED",
        decisionId: mapping.decisionId,
        message: `Engine field ${mapping.engineField} is not allowed by rule-pack version ${context.rulePack.version}.`,
        severity: "error",
      });
    }
    if (mapping.treatment === "map_to_engine" && !mapping.engineField) {
      issues.push({
        code: "MISSING_ENGINE_FIELD",
        decisionId: mapping.decisionId,
        message: "A map_to_engine decision must include an engine field.",
        severity: "error",
      });
    }
    if (mapping.sourceRequired && mapping.sourceRole !== "primary") {
      issues.push({
        code: "BENCHMARK_USED_AS_PRIMARY",
        decisionId: mapping.decisionId,
        message:
          "Required source evidence must be primary, not benchmark evidence.",
        severity: "error",
      });
    }
    if (mapping.sourceRole === "primary") {
      const evidenceKey = `${mapping.affiliateAlias}|${mapping.evidence.fileName}|${mapping.evidence.sheetName}|${mapping.evidence.labelCell ?? ""}`;
      if (!knownPrimaryEvidence.has(evidenceKey)) {
        issues.push({
          code: "PRIMARY_EVIDENCE_NOT_FOUND",
          decisionId: mapping.decisionId,
          message:
            "The cited primary evidence does not resolve to the same affiliate and extracted source row.",
          severity: "error",
        });
      }
    } else if (
      !context.availableReferenceFiles.has(mapping.evidence.fileName)
    ) {
      issues.push({
        code: "BENCHMARK_FILE_NOT_SUPPLIED",
        decisionId: mapping.decisionId,
        message: `Benchmark file ${mapping.evidence.fileName} was not supplied with this run.`,
        severity: "error",
      });
    }

    const duplicateKey = [
      mapping.affiliateAlias,
      mapping.evidence.fileName,
      mapping.evidence.sheetName,
      mapping.evidence.labelCell ?? mapping.sourceFactLabel,
      mapping.treatment,
      mapping.engineField ?? "",
    ].join("|");
    if (seen.has(duplicateKey)) {
      issues.push({
        code: "DUPLICATE_MAPPING",
        decisionId: mapping.decisionId,
        message:
          "The same source fact and treatment were proposed more than once.",
        severity: "error",
      });
    }
    seen.add(duplicateKey);

    if (mapping.reviewRequirement !== "not_required") {
      issues.push({
        code: "REVIEW_REQUIRED",
        decisionId: mapping.decisionId,
        message: `${mapping.reviewRequirement}: ${mapping.rationale}`,
        severity: "warning",
      });
    }
    if (mapping.discrepancyExpected) {
      issues.push({
        code: "RECONCILIATION_BRIDGE_REQUIRED",
        decisionId: mapping.decisionId,
        message:
          "The accepted baseline expects a source-to-history discrepancy bridge for this fact.",
        severity: "warning",
      });
    }
  }

  const sourceAffiliates = new Set(
    context.facts.map((fact) => fact.affiliateAlias)
  );
  for (const affiliateAlias of sourceAffiliates) {
    const hasIdentity = context.mappings.some(
      (mapping) =>
        mapping.affiliateAlias === affiliateAlias &&
        mapping.rowType === "identity"
    );
    if (!hasIdentity) {
      issues.push({
        code: "MISSING_AFFILIATE_IDENTITY",
        message: `No legal-name confirmation was produced for ${affiliateAlias}.`,
        severity: "error",
      });
    }
  }

  const errors = issues.filter((issue) => issue.severity === "error").length;
  const warnings = issues.filter(
    (issue) => issue.severity === "warning"
  ).length;
  return {
    errors,
    issues,
    passed: errors === 0,
    warnings,
  };
}
