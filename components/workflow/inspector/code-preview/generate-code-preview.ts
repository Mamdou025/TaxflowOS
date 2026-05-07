import { aggregationCodePreview } from "./aggregation-code-preview";
import { approvalGateCodePreview } from "./approval-gate-code-preview";
import { calculationEngineCodePreview } from "./calculation-engine-code-preview";
import { categoryRollupCodePreview } from "./category-rollup-code-preview";
import { formulaCodePreview } from "./formula-code-preview";
import { genericCodePreview } from "./generic-code-preview";
import { hierarchyAggregatorCodePreview } from "./hierarchy-aggregator-code-preview";
import { keywordMapperCodePreview } from "./keyword-mapper-code-preview";
import { outputCodePreview } from "./output-code-preview";
import { getToolId } from "./preview-utils";
import { protectedResultCodePreview } from "./protected-result-code-preview";
import { sourceCodePreview } from "./source-code-preview";
import type {
  BlockCodePreview,
  GenerateBlockCodePreviewOptions,
} from "./types";
import { validationCodePreview } from "./validation-code-preview";

export type { BlockCodePreview } from "./types";

function reviewCodePreview(
  options: GenerateBlockCodePreviewOptions
): BlockCodePreview {
  if (options.block.subtype === "Approval Gate") {
    return approvalGateCodePreview(options);
  }
  return validationCodePreview(options);
}

export function generateBlockCodePreview(
  options: GenerateBlockCodePreviewOptions
): BlockCodePreview {
  const toolId = getToolId(options);

  if (options.block.family === "Source") {
    return sourceCodePreview(options);
  }
  if (toolId === "logic.keyword_mapper") {
    return keywordMapperCodePreview(options);
  }
  if (toolId === "logic.aggregation") {
    return aggregationCodePreview(options);
  }
  if (toolId === "logic.category_rollup_aggregator") {
    return categoryRollupCodePreview(options);
  }
  if (toolId === "logic.calculation_engine") {
    return calculationEngineCodePreview(options);
  }
  if (toolId === "logic.hierarchy_aggregator") {
    return hierarchyAggregatorCodePreview(options);
  }
  if (toolId === "logic.formula") {
    return formulaCodePreview(options);
  }
  if (options.block.family === "Review / Validation") {
    return reviewCodePreview(options);
  }
  if (toolId === "protected.protected_result") {
    return protectedResultCodePreview(options);
  }
  if (options.block.family === "Output") {
    return outputCodePreview(options);
  }

  return genericCodePreview(options);
}
