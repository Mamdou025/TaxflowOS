import type { ToolDefinition } from "../../../runtime/types";

export const calculationRulesDefinition: ToolDefinition = {
  defaultConfig: {
    sourceKind: "calculation_rules",
  },
  description:
    "Emits governed formula rules for calculating named results from named values.",
  displayName: "Calculation Rules Source",
  family: "Source",
  inputRoles: [],
  outputRoles: [
    {
      canRouteToFamilies: ["Logic", "Review / Validation", "Output"],
      description: "Formula rules consumed by the Calculation Engine.",
      id: "calculation_rules",
      label: "Calculation rules",
      outputKey: "calculationRules",
      outputType: "calculation_rules",
      samplePreview: "GROSS, NET_FAPI, NET_FAPI_CAD",
    },
    {
      canRouteToFamilies: ["Review / Validation", "Output"],
      description: "Calculation rule metadata and versioning information.",
      id: "rule_metadata",
      label: "Rule metadata",
      outputKey: "ruleMetadata",
      outputType: "rule_metadata",
    },
    {
      canRouteToFamilies: ["Review / Validation", "Output"],
      description: "Calculation rule source version.",
      id: "rule_version",
      label: "Rule version",
      outputKey: "ruleVersion",
      outputType: "rule_version",
    },
  ],
  runMode: "local_mock",
  subtype: "Calculation Rules",
  toolGroup: "source",
  toolId: "source.calculation_rules",
};
