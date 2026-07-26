import { asBoolean, asNumber, inputSummary, lines } from "./preview-utils";
import type {
  BlockCodePreview,
  GenerateBlockCodePreviewOptions,
} from "./types";

export function validationCodePreview({
  config,
  inputBindings,
}: GenerateBlockCodePreviewOptions): BlockCodePreview {
  const threshold = asNumber(config.threshold, 0.75);
  const blocking = asBoolean(config.blocking, true);

  return {
    code: lines(
      "const checkedItems = inputs.checked_items;",
      `const threshold = ${threshold};`,
      `const blocking = ${String(blocking)};`,
      "",
      "const failed = checkedItems.filter(",
      "  (item) => (item.confidence ?? 0) < threshold",
      ");",
      "",
      "outputs.validation_result = {",
      "  status: failed.length === 0 ? 'pass' : blocking ? 'fail' : 'warning',",
      "  threshold,",
      "  checkedCount: checkedItems.length,",
      "  failedCount: failed.length,",
      "  message:",
      "    failed.length === 0",
      "      ? 'All mapped rows meet the confidence threshold.'",
      "      : failed.length + ' item(s) need review.',",
      "};",
      "",
      "outputs.low_confidence_rows = failed;"
    ),
    editable: false,
    explanation:
      "This block judges whether mapped rows meet the configured confidence threshold. It validates trust; it does not transform the rows.",
    language: "typescript_preview",
    resolvedConfig: { blocking, threshold },
    resolvedInputs: inputSummary(inputBindings),
    title: "Generated Confidence Check Logic",
  };
}
