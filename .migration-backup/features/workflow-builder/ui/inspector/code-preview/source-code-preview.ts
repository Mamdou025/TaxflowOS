import { asString, inputSummary, lines, pretty } from "./preview-utils";
import type {
  BlockCodePreview,
  GenerateBlockCodePreviewOptions,
} from "./types";

function getRuleSourcePreview({
  block,
  config,
  toolId,
}: {
  block: GenerateBlockCodePreviewOptions["block"];
  config: Record<string, unknown>;
  toolId?: string;
}) {
  const sourceKind = asString(config.sourceKind, "manual_table");
  const isKeywordRules =
    sourceKind === "keyword_rules" ||
    toolId === "source.keyword_rules" ||
    block.subtype === "Keyword Rules";
  const isAggregationRules =
    sourceKind === "aggregation_rules" ||
    toolId === "source.aggregation_rules" ||
    block.subtype === "Aggregation Rules";
  const isRollupRules =
    sourceKind === "rollup_rules" ||
    toolId === "source.rollup_rules" ||
    block.subtype === "Rollup Rules";
  const isCalculationRules =
    sourceKind === "calculation_rules" ||
    toolId === "source.calculation_rules" ||
    block.subtype === "Calculation Rules";

  if (isAggregationRules) {
    return {
      configKey: "aggregationRules",
      outputRole: "aggregation_rules",
      title: "Generated Aggregation Rulebook Preview",
    };
  }
  if (isRollupRules) {
    return {
      configKey: "rollupRules",
      outputRole: "rollup_rules",
      title: "Generated Rollup Rulebook Preview",
    };
  }
  if (isCalculationRules) {
    return {
      configKey: "calculationRules",
      outputRole: "calculation_rules",
      title: "Generated Calculation Rulebook Preview",
    };
  }
  if (isKeywordRules) {
    return {
      configKey: "keywordRules",
      outputRole: "keyword_rules",
      title: "Generated Keyword Rulebook Preview",
    };
  }
  return {
    configKey: "rows",
    outputRole: "selected_rows",
    title: "Generated Source Evidence Preview",
  };
}

export function sourceCodePreview({
  block,
  config,
  inputBindings,
  tool,
}: GenerateBlockCodePreviewOptions): BlockCodePreview {
  const sourceKind = asString(config.sourceKind, "manual_table");
  const preview = getRuleSourcePreview({
    block,
    config,
    toolId: tool?.toolId,
  });
  const isRuleSource = preview.outputRole.includes("rules");

  return {
    code: lines(
      `const ${preview.outputRole} = block.config.${preview.configKey} ?? sample.${isRuleSource ? preview.outputRole : "rows"};`,
      "",
      `outputs.${preview.outputRole} = ${preview.outputRole}.map((item) => ({`,
      "  ...item,",
      "  immutable: true,",
      `  sourceBlockId: ${pretty(block.id)},`,
      `  sourceLabel: ${pretty(block.label)},`,
      "}));",
      "",
      "// Source execution emits evidence/reference data only.",
      "// Corrections or interpretations are modeled in downstream Logic."
    ),
    editable: false,
    explanation: isRuleSource
      ? "This Source emits immutable rule knowledge. Logic blocks read these rules, but do not own or mutate them."
      : "This Source emits immutable input evidence. Downstream Logic may classify or transform it without changing the Source.",
    language: "typescript_preview",
    resolvedConfig: {
      outputRole: preview.outputRole,
      sourceKind,
      sourceVersion: config.sourceVersion || 1,
    },
    resolvedInputs: inputSummary(inputBindings),
    title: preview.title,
  };
}
