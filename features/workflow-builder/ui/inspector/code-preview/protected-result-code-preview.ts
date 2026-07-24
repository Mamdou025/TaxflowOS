import {
  asBoolean,
  asString,
  inputSummary,
  lines,
  pretty,
} from "./preview-utils";
import type {
  BlockCodePreview,
  GenerateBlockCodePreviewOptions,
} from "./types";

export function protectedResultCodePreview({
  block,
  config,
  inputBindings,
}: GenerateBlockCodePreviewOptions): BlockCodePreview {
  const resultName = asString(config.resultName || config.name, block.label);
  const runtimeLocked = asBoolean(config.runtimeLocked, true);

  return {
    code: lines(
      "const candidateValue = inputs.candidate_value;",
      "const approval = inputs.approval_status;",
      "const approved = approval?.approved === true || approval?.status === 'approved';",
      `const resultName = ${pretty(resultName)};`,
      `const runtimeLockRequested = ${String(runtimeLocked)};`,
      "",
      "outputs.protected_result = {",
      "  name: resultName,",
      "  value: candidateValue?.value ?? candidateValue,",
      "  currency: candidateValue?.currency,",
      "  status: approved ? 'locked' : 'needs_review',",
      "  final: approved,",
      "  runtimeLocked: approved && runtimeLockRequested,",
      "  approvedBy: approval?.reviewer,",
      "  sourceTrace: collectTrace(candidateValue, approval),",
      "};"
    ),
    editable: false,
    explanation:
      "This block turns an approved candidate value into a governed result. If approval is missing, the value remains a non-final review candidate.",
    language: "typescript_preview",
    resolvedConfig: { resultName, runtimeLocked },
    resolvedInputs: inputSummary(inputBindings),
    title: "Generated Protected Result Logic",
  };
}
