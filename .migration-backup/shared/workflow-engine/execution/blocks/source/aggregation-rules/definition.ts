import type { ToolDefinition } from "../../../runtime/types";
import { SAMPLE_AGGREGATION_RULES } from "./fixtures";

export const aggregationRulesDefinition: ToolDefinition = {
  defaultConfig: {
    aggregationRules: SAMPLE_AGGREGATION_RULES,
    sourceKind: "aggregation_rules",
  },
  description:
    "Reads category hierarchy, calculator operations, and final-result rollup rules from a rulebook.",
  displayName: "Aggregation Rulebook",
  family: "Source",
  inputRoles: [],
  outputRoles: [
    {
      canRouteToFamilies: ["Logic"],
      description:
        "Aggregation hierarchy and formula rules for downstream rollup tools.",
      id: "aggregation_rules",
      label: "Aggregation rules",
      outputKey: "aggregationRules",
      outputType: "aggregation_rules",
      samplePreview: "7 aggregation nodes",
    },
    {
      canRouteToFamilies: ["Logic", "Output", "Review / Validation"],
      description: "Aggregation rule nodes organized as a rollup hierarchy.",
      id: "aggregation_tree",
      label: "Aggregation tree",
      outputKey: "aggregationTree",
      outputType: "aggregation_tree",
      samplePreview: "aggregation hierarchy",
    },
    {
      canRouteToFamilies: ["Logic", "Output", "Review / Validation"],
      description: "Aggregation rulebook metadata and governance status.",
      id: "rule_metadata",
      label: "Rule metadata",
      outputKey: "ruleMetadata",
      outputType: "rule_metadata",
      samplePreview: "aggregation rule metadata",
    },
    {
      canRouteToFamilies: ["Logic", "Output", "Review / Validation"],
      description: "Aggregation rulebook version reference.",
      id: "rule_version",
      label: "Rule version",
      outputKey: "ruleVersion",
      outputType: "rule_version",
      samplePreview: "v1",
    },
  ],
  runMode: "local_mock",
  subtype: "Aggregation Rules",
  toolGroup: "source",
  toolId: "source.aggregation_rules",
};
