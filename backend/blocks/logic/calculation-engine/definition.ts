import type { ToolDefinition } from "../../../runtime/types";

export const calculationEngineDefinition: ToolDefinition = {
  defaultConfig: {},
  description:
    "Applies calculation rules to named values and source/protected inputs.",
  displayName: "Calculation Engine",
  family: "Logic",
  inputRoles: [
    {
      acceptedFamilies: ["Logic", "Source", "Protected"],
      acceptedOutputTypes: [
        "named_values",
        "calculated_results",
        "fapi_inputs",
        "protected_result",
        "governed_value",
      ],
      allowMultiple: true,
      description:
        "Named numeric values from rollups, inputs, or protected values.",
      id: "named_values",
      label: "Named values",
      required: true,
    },
    {
      acceptedFamilies: ["Source"],
      acceptedOutputTypes: ["calculation_rules"],
      acceptedSourceKinds: ["calculation_rules"],
      allowMultiple: true,
      description:
        "Optional external formula rules. When connected, overrides inline formulas (auto mode) or is required (external_rules mode).",
      id: "calculation_rules",
      label: "Calculation rules (optional)",
      required: false,
    },
    {
      acceptedFamilies: ["Source", "Review / Validation", "Protected"],
      acceptedOutputTypes: [
        "fapi_inputs",
        "exchange_rate",
        "reviewed_exchange_rate",
        "governed_value",
      ],
      allowMultiple: true,
      description: "Optional source or protected fiscal inputs.",
      id: "protected_inputs",
      label: "Protected/source inputs",
      required: false,
    },
  ],
  outputRoles: [
    {
      canRouteToFamilies: ["Protected", "Review / Validation", "Output"],
      description: "Calculated formula results keyed by result name.",
      id: "calculated_results",
      label: "Calculated results",
      outputKey: "calculatedResults",
      outputType: "calculated_results",
    },
    {
      canRouteToFamilies: ["Review / Validation", "Output"],
      description: "Formula trace for every calculated result.",
      id: "formula_trace",
      label: "Formula trace",
      outputKey: "formulaTrace",
      outputType: "formula_trace",
    },
    {
      canRouteToFamilies: ["Review / Validation", "Output"],
      description: "Calculation execution summary.",
      id: "calculation_summary",
      label: "Calculation summary",
      outputKey: "calculationSummary",
      outputType: "calculation_summary",
    },
    {
      canRouteToFamilies: ["Logic", "Output", "Review / Validation"],
      description:
        "Input and calculated values exposed for downstream formulas.",
      id: "named_values",
      label: "Named values",
      outputKey: "namedValues",
      outputType: "named_values",
    },
  ],
  runMode: "local_mock",
  subtype: "Calculation Engine",
  toolGroup: "calculation",
  toolId: "logic.calculation_engine",
};
