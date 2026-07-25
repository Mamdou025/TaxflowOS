import type { ToolDefinition } from "../../../runtime/types";
import { SAMPLE_KEYWORD_RULES } from "./fixtures";

export const keywordRulesDefinition: ToolDefinition = {
  defaultConfig: {
    keywordRules: SAMPLE_KEYWORD_RULES,
    sourceKind: "keyword_rules",
  },
  description: "Reads keyword-to-category matching rules from a rulebook.",
  displayName: "Keyword Rulebook",
  family: "Source",
  inputRoles: [],
  outputRoles: [
    {
      canRouteToFamilies: ["Logic"],
      description: "Keyword-to-category rules for downstream mapping tools.",
      id: "keyword_rules",
      label: "Keyword rules",
      outputKey: "keywordRules",
      outputType: "keyword_rules",
      samplePreview: "5 keyword rules",
    },
    {
      canRouteToFamilies: ["Logic", "Output", "Review / Validation"],
      description: "Keyword rulebook metadata and governance status.",
      id: "rule_metadata",
      label: "Rule metadata",
      outputKey: "ruleMetadata",
      outputType: "rule_metadata",
      samplePreview: "keyword rule metadata",
    },
    {
      canRouteToFamilies: ["Logic", "Output", "Review / Validation"],
      description: "Keyword rulebook version reference.",
      id: "rule_version",
      label: "Rule version",
      outputKey: "ruleVersion",
      outputType: "rule_version",
      samplePreview: "v1",
    },
  ],
  runMode: "local_mock",
  subtype: "Keyword Rules",
  toolGroup: "source",
  toolId: "source.keyword_rules",
};
