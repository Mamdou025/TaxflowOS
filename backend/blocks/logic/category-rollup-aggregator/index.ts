import type { RegisteredToolModule } from "../../../runtime/types";
import { categoryRollupAggregatorDefinition } from "./definition";
import { runCategoryRollupAggregator } from "./run";

export const categoryRollupAggregatorToolModule: RegisteredToolModule = {
  definition: categoryRollupAggregatorDefinition,
  run: runCategoryRollupAggregator,
};
