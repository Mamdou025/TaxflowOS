import { info } from "../../../runtime/events";
import {
  createEvidenceRef,
  createSourceTraceRef,
} from "../../../runtime/lineage";
import type {
  ToolExecutionContext,
  ToolRunResult,
} from "../../../runtime/types";
import { parseFapiInputsConfig } from "./schema";

export function runFapiInputsSource(
  context: ToolExecutionContext
): ToolRunResult {
  const config = parseFapiInputsConfig(context.config);
  const sourceVersion = Number(context.config.sourceVersion || 1);
  const fapiInputs = {
    documentCurrency: config.documentCurrency,
    expectedResults: config.expectedResults || {},
    fatPaid: config.fatPaid,
    fapiYear: config.fapiYear,
    inclusionRate: config.inclusionRate,
    reportingCurrency: config.reportingCurrency,
    rtf: config.rtf,
    // Line-driving assumptions consumed by the lines engine as named values.
    pCoefficient: config.pCoefficient,
    canadianRules95_4: config.canadianRules95_4,
    debtForgiveness: config.debtForgiveness,
    priorYearG: config.priorYearG,
    cfaIncome: config.cfaIncome,
    businessLosses: config.businessLosses,
    faclCarryforward: config.faclCarryforward,
    prescribedAmount: config.prescribedAmount,
    prescribedAmountF1: config.prescribedAmountF1,
    dividendDeductions: config.dividendDeductions,
    partnershipDividends: config.partnershipDividends,
  };
  const evidenceRef = createEvidenceRef({
    block: context.block,
    label: "FAPI workbook calculation inputs",
    sourceKind: "fapi_inputs",
    valuePreview: `inclusion ${fapiInputs.inclusionRate ?? "n/a"}, RTF ${fapiInputs.rtf ?? "n/a"}, FAT ${fapiInputs.fatPaid ?? "n/a"}`,
  });
  const sourceTrace = [createSourceTraceRef({ evidenceRef })];
  const inputMetadata = {
    importedFromWorkbook: context.config.importedFromWorkbook,
    sourceId: context.block.id,
    sourceKind: "fapi_inputs",
    sourceLocator: context.config.sourceLocator,
    sourceName: context.block.label,
    sourceStatus: context.config.sourceStatus || "draft",
    sourceVersion,
  };

  return {
    blockId: context.block.id,
    completedAt: new Date().toISOString(),
    errors: [],
    evidenceRefs: [evidenceRef],
    logs: [
      info("FAPI input source emitted workbook calculation assumptions.", {
        inputMetadata,
      }),
    ],
    outputs: {
      fapi_inputs: { fapiInputs },
      input_metadata: inputMetadata,
    },
    primaryOutputRole: "fapi_inputs",
    runId: context.runId,
    sourceTrace,
    startedAt: context.startedAt,
    status: "success",
    toolId: "source.fapi_inputs",
    warnings: [],
  };
}
