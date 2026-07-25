import type { MappingRule } from "../rule-pack";
import type { ExtractedFact, MappingDecision } from "../types";
import type { MappingProvider, MappingProviderContext } from "./provider";

function matches(pattern: string | undefined, value: string) {
  return pattern ? new RegExp(pattern, "iu").test(value) : true;
}

function decisionId(
  affiliateAlias: string,
  ruleId: string,
  fact: Pick<ExtractedFact, "labelCell" | "sheetName">
) {
  const seed = `${affiliateAlias}-${ruleId}-${fact.sheetName}-${fact.labelCell}`;
  return seed
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function ruleMatchesFact(
  rule: MappingRule,
  fact: ExtractedFact,
  affiliateAlias: string
) {
  return (
    matches(rule.affiliatePattern, affiliateAlias) &&
    matches(rule.sheetPattern, fact.sheetName) &&
    matches(rule.labelPattern, fact.label)
  );
}

function mappingFromRule(
  workflow: string,
  fact: ExtractedFact,
  rule: MappingRule
): MappingDecision {
  return {
    affiliateAlias: fact.affiliateAlias,
    confidence: rule.confidence,
    decisionId: decisionId(fact.affiliateAlias, rule.id, fact),
    discrepancyExpected: rule.discrepancyExpected,
    engineField: rule.engineField,
    evidence: {
      fileName: fact.sourceFile,
      labelCell: fact.labelCell,
      sheetName: fact.sheetName,
      valueCell: fact.valueCell,
    },
    rationale: rule.rationale,
    reviewRequirement: rule.reviewRequirement,
    rowType: "mapping",
    ruleId: rule.id,
    sourceFactLabel: fact.label,
    sourceFormula: fact.formula,
    sourceRequired: true,
    sourceRole: "primary",
    sourceValue: fact.value,
    treatment: rule.treatment,
    workflow,
  };
}

function identityDecision(
  context: MappingProviderContext,
  affiliateAlias: string,
  facts: ExtractedFact[]
): MappingDecision | undefined {
  const alias = context.rulePack.affiliateAliases.find(
    (item) => item.alias === affiliateAlias
  );
  if (!alias) {
    return;
  }
  const preferredSheet = new RegExp(
    context.rulePack.identity.preferredSheetPattern,
    "iu"
  );
  const namePattern = new RegExp(alias.sourceNamePattern, "iu");
  const fact =
    facts.find(
      (item) =>
        preferredSheet.test(item.sheetName) && namePattern.test(item.label)
    ) ?? facts.find((item) => namePattern.test(item.label));
  if (!fact) {
    return;
  }
  const ruleId = "identity.legal-name-confirmation";
  return {
    affiliateAlias,
    confidence: context.rulePack.identity.confidence,
    decisionId: decisionId(affiliateAlias, ruleId, fact),
    discrepancyExpected: false,
    evidence: {
      fileName: fact.sourceFile,
      labelCell: fact.labelCell,
      sheetName: fact.sheetName,
    },
    rationale: context.rulePack.identity.rationale,
    reviewRequirement: "not_required",
    rowType: "identity",
    ruleId,
    sourceFactLabel: "Legal/source name confirmation",
    sourceRequired: true,
    sourceRole: "primary",
    sourceValue: fact.label,
    treatment: "context_only",
    workflow: context.workflow,
  };
}

export class DeterministicRuleProvider implements MappingProvider {
  readonly id = "deterministic-rule-pack";

  proposeMappings(context: MappingProviderContext) {
    const affiliates = [
      ...new Set(context.facts.map((fact) => fact.affiliateAlias)),
    ];
    const decisions: MappingDecision[] = [];

    for (const affiliateAlias of affiliates) {
      const affiliateFacts = context.facts.filter(
        (fact) => fact.affiliateAlias === affiliateAlias
      );
      const identity = identityDecision(
        context,
        affiliateAlias,
        affiliateFacts
      );
      if (identity) {
        decisions.push(identity);
      }
      for (const rule of context.rulePack.mappingRules) {
        const matchingFacts = affiliateFacts.filter((fact) =>
          ruleMatchesFact(rule, fact, affiliateAlias)
        );
        for (const fact of matchingFacts) {
          decisions.push(mappingFromRule(context.workflow, fact, rule));
        }
      }
    }

    return Promise.resolve(decisions);
  }
}
