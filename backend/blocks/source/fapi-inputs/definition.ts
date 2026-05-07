import type { ToolDefinition } from "../../../runtime/types";

export const fapiInputsDefinition: ToolDefinition = {
  defaultConfig: {
    documentCurrency: "USD",
    expectedResults: {},
    fatPaid: 100,
    fapiYear: 2025,
    inclusionRate: 0.5,
    reportingCurrency: "CAD",
    rtf: 1.9,
    sourceKind: "fapi_inputs",
  },
  description:
    "Emits workbook calculation assumptions such as inclusion rate, RTF, FAT paid, and expected results. FX rates are supplied by a separate rate source/review path.",
  displayName: "FAPI Inputs Source",
  family: "Source",
  inputRoles: [],
  outputRoles: [
    {
      canRouteToFamilies: ["Logic", "Review / Validation", "Output"],
      description:
        "Calculation inputs imported from the workbook input sheet, excluding reviewed FX rate.",
      id: "fapi_inputs",
      label: "FAPI inputs",
      outputKey: "fapiInputs",
      outputType: "fapi_inputs",
      samplePreview: "inclusion 0.5, RTF 1.9, FAT paid 100",
    },
    {
      canRouteToFamilies: ["Review / Validation", "Output"],
      description:
        "Input source, workbook sheet, version, and status metadata.",
      id: "input_metadata",
      label: "Input metadata",
      outputKey: "inputMetadata",
      outputType: "source_metadata",
      samplePreview: "FAPI Inputs sheet",
    },
  ],
  runMode: "local_mock",
  subtype: "Manual Entry",
  toolGroup: "source",
  toolId: "source.fapi_inputs",
};
