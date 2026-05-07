import { inputSummary, lines } from "./preview-utils";
import type {
  BlockCodePreview,
  GenerateBlockCodePreviewOptions,
} from "./types";

export function calculationEngineCodePreview({
  inputBindings,
}: GenerateBlockCodePreviewOptions): BlockCodePreview {
  return {
    code: lines(
      "const namedValues = {",
      "  ...inputs.named_values,",
      "  ...inputs.protected_inputs,",
      "  ...inputs.fapi_inputs,",
      "};",
      "const calculationRules = inputs.calculation_rules;",
      "",
      "const calculatedResults = {};",
      "const formulaTrace = {};",
      "",
      "for (const rule of evaluateInDependencyOrder(calculationRules)) {",
      "  const values = rule.operands.map((operand) => {",
      "    return typeof operand === 'number' ? operand : namedValues[operand];",
      "  });",
      "  const result = applyArithmeticOperation(rule.operation, values);",
      "  namedValues[rule.resultKey] = roundMoney(result);",
      "  calculatedResults[rule.resultKey] = namedValues[rule.resultKey];",
      "  formulaTrace[rule.resultKey] = {",
      "    expression: rule.resultKey + ' = ' + rule.operation + '(' + rule.operands.join(', ') + ')',",
      "    inputValues: values,",
      "    result: calculatedResults[rule.resultKey],",
      "  };",
      "}",
      "",
      "outputs.calculated_results = calculatedResults;",
      "outputs.formula_trace = formulaTrace;",
      "outputs.calculation_summary = summarizeCalculations(calculatedResults);"
    ),
    editable: false,
    explanation:
      "This Logic block evaluates formulas from named values and protected/source inputs. It does not group rows or perform keyword mapping.",
    language: "typescript_preview",
    resolvedConfig: {
      supportedOperations: [
        "add",
        "subtract",
        "multiply",
        "divide",
        "min",
        "max",
        "pass_through",
        "round",
        "abs",
        "max_subtract_zero",
        "min_multiply_cap",
      ],
    },
    resolvedInputs: inputSummary(inputBindings),
    title: "Generated Calculation Engine Logic",
  };
}
