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

export function approvalGateCodePreview({
  config,
  inputBindings,
}: GenerateBlockCodePreviewOptions): BlockCodePreview {
  const approved = asBoolean(config.approved, true);
  const reviewer = asString(config.reviewer, "Reviewer");
  const notes = asString(config.notes || config.approvalNotes);

  return {
    code: lines(
      "const candidateValue = inputs.value_to_approve;",
      "const validationResult = inputs.validation_result;",
      `const approved = ${String(approved)};`,
      `const reviewer = ${pretty(reviewer)};`,
      `const notes = ${pretty(notes)};`,
      "",
      "outputs.approval_status = {",
      "  status: approved ? 'approved' : 'not_approved',",
      "  approved,",
      "  reviewer,",
      "  notes,",
      "  reviewedInputs: { candidateValue, validationResult },",
      "};"
    ),
    editable: false,
    explanation:
      "This block records an explicit local approval decision before a candidate result can become protected and final.",
    language: "typescript_preview",
    resolvedConfig: { approved, notes, reviewer },
    resolvedInputs: inputSummary(inputBindings),
    title: "Generated Approval Gate Logic",
  };
}
