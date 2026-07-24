import type { ToolDefinition } from "../../../runtime/types";

export const rollupRulesDefinition: ToolDefinition = {
  defaultConfig: {
    sourceKind: "rollup_rules",
  },
  description:
    "Emits governed rollup rules that group mapped categories into subtotal buckets.",
  displayName: "Rollup Rules Source",
  family: "Source",
  inputRoles: [],
  outputRoles: [
    {
      canRouteToFamilies: ["Logic", "Review / Validation", "Output"],
      description: "Rollup rules for summing mapped categories.",
      id: "rollup_rules",
      label: "Rollup rules",
      outputKey: "rollupRules",
      outputType: "rollup_rules",
      samplePreview: "income_bucket, expense_bucket",
    },
    {
      canRouteToFamilies: ["Review / Validation", "Output"],
      description: "Rollup rule metadata and versioning information.",
      id: "rule_metadata",
      label: "Rule metadata",
      outputKey: "ruleMetadata",
      outputType: "rule_metadata",
    },
    {
      canRouteToFamilies: ["Review / Validation", "Output"],
      description: "Rollup rule source version.",
      id: "rule_version",
      label: "Rule version",
      outputKey: "ruleVersion",
      outputType: "rule_version",
    },
  ],
  runMode: "local_mock",
  subtype: "Rollup Rules",
  toolGroup: "source",
  toolId: "source.rollup_rules",
};
