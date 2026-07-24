import { inputSummary, lines } from "./preview-utils";
import type {
  BlockCodePreview,
  GenerateBlockCodePreviewOptions,
} from "./types";

export function outputCodePreview({
  block,
  inputBindings,
  tool,
}: GenerateBlockCodePreviewOptions): BlockCodePreview {
  const isCanonical =
    tool?.toolId === "output.canonical_json" ||
    block.subtype === "Canonical JSON";

  if (isCanonical) {
    return {
      code: lines(
        "const protectedResult = inputs.protected_result;",
        "const trace = inputs.source_trace ?? protectedResult?.sourceTrace ?? [];",
        "",
        "outputs.canonical_json = {",
        "  workflowName: workflow.name,",
        "  finalResult: {",
        "    name: protectedResult.name,",
        "    value: protectedResult.value,",
        "    currency: protectedResult.currency,",
        "    status: protectedResult.status,",
        "    final: protectedResult.final,",
        "  },",
        "  inputItem: findInputItem(trace),",
        "  ruleUsed: findRuleUsed(trace),",
        "  validation: findValidationSummary(workflowRun),",
        "  approval: findApprovalSummary(workflowRun),",
        "  trace,",
        "};"
      ),
      editable: false,
      explanation:
        "This block assembles a local structured JSON deliverable from protected results, review state, and trace data.",
      language: "typescript_preview",
      resolvedInputs: inputSummary(inputBindings),
      title: "Generated Canonical JSON Assembly",
    };
  }

  return {
    code: lines(
      "const protectedResult = inputs.protected_result;",
      "const mappedRows = inputs.mapped_rows ?? [];",
      "const validation = inputs.validation_result;",
      "const approval = inputs.approval_status;",
      "",
      "outputs.preview = renderEvidencePreview({",
      "  finalResult: protectedResult,",
      "  inputRows: mappedRows.map((row) => row.sourceRow ?? row),",
      "  rulesUsed: mappedRows.map((row) => row.matchedRuleId),",
      "  validation,",
      "  approval,",
      "  transformations: [",
      "    'Keyword Mapper classified the row.',",
      "    'Section Aggregator calculated the subtotal.',",
      "    'Review blocks judged confidence and approval.',",
      "    'Protected Result locked the final value when approved.',",
      "  ],",
      "  trace: collectTrace(protectedResult, mappedRows, validation, approval),",
      "});"
    ),
    editable: false,
    explanation:
      "This block assembles a local human-readable evidence preview. It is a mock deliverable, not a real export integration.",
    language: "typescript_preview",
    resolvedInputs: inputSummary(inputBindings),
    title: "Generated Evidence Preview Assembly",
  };
}
