import { calculationEngineToolModule } from "../blocks/logic/calculation-engine";
import { categoryRollupAggregatorToolModule } from "../blocks/logic/category-rollup-aggregator";
import { hierarchyAggregatorToolModule } from "../blocks/logic/hierarchy-aggregator";
import { keywordMapperToolModule } from "../blocks/logic/keyword-mapper";
import { aggregationRulesToolModule } from "../blocks/source/aggregation-rules";
import { calculationRulesToolModule } from "../blocks/source/calculation-rules";
import { currencyRateToolModule } from "../blocks/source/currency-rate";
import { fapiInputsToolModule } from "../blocks/source/fapi-inputs";
import { keywordRulesToolModule } from "../blocks/source/keyword-rules";
import { manualTableToolModule } from "../blocks/source/manual-table";
import { rollupRulesToolModule } from "../blocks/source/rollup-rules";
import type {
  RegisteredToolModule,
  ToolDefinition,
  ToolExecutionContext,
  ToolRunResult,
} from "./types";

const toolModules = new Map<string, RegisteredToolModule>();

export function registerToolModule(module: RegisteredToolModule) {
  toolModules.set(module.definition.toolId, module);
}

for (const module of [
  manualTableToolModule,
  keywordRulesToolModule,
  aggregationRulesToolModule,
  rollupRulesToolModule,
  calculationRulesToolModule,
  fapiInputsToolModule,
  currencyRateToolModule,
  keywordMapperToolModule,
  categoryRollupAggregatorToolModule,
  calculationEngineToolModule,
  hierarchyAggregatorToolModule,
]) {
  registerToolModule(module);
}

export function getToolDefinition(toolId: string): ToolDefinition | undefined {
  return toolModules.get(toolId)?.definition;
}

export function listToolDefinitions(): ToolDefinition[] {
  return [...toolModules.values()].map((module) => module.definition);
}

export function executeTool(
  toolId: string,
  context: ToolExecutionContext
): ToolRunResult {
  const module = toolModules.get(toolId);
  if (!module) {
    throw new Error(`No backend tool module registered for ${toolId}.`);
  }

  return module.run(context);
}
