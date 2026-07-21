import { asString, inputSummary, lines } from "./preview-utils";
import type {
  BlockCodePreview,
  GenerateBlockCodePreviewOptions,
} from "./types";

export function formulaCodePreview({
  block,
  config,
  inputBindings,
}: GenerateBlockCodePreviewOptions): BlockCodePreview {
  const operation = asString(
    config.operation || config.formulaOperation,
    "add"
  );
  const expression = asString(config.formula || block.formula?.expression);

  return {
    code: lines(
      "const values = inputs.values.map((item) => Number(item.value ?? item));",
      `const operation = ${JSON.stringify(operation)};`,
      "",
      "const result = calculateSafeOperation(operation, values);",
      "",
      "outputs.result = {",
      "  value: result,",
      "  operation,",
      "  inputValues: values,",
      "  formulaTrace:",
      "    operation + '(' + values.join(', ') + ') = ' + result,",
      "  sourceTrace: inputs.values.flatMap((item) => item.sourceTrace ?? []),",
      "};"
    ),
    editable: false,
    explanation:
      "This block applies a safe local arithmetic operation to upstream numeric values. It does not evaluate arbitrary JavaScript.",
    language: "typescript_preview",
    resolvedConfig: {
      expression: expression || "configured operation",
      operation,
    },
    resolvedInputs: inputSummary(inputBindings),
    title: "Generated Formula Logic",
  };
}
