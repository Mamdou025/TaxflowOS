import type { RegisteredToolModule } from "../../../runtime/types";
import { aggregationRulesDefinition } from "./definition";
import { runAggregationRulesSource } from "./run";

export const aggregationRulesToolModule: RegisteredToolModule = {
  definition: aggregationRulesDefinition,
  run: runAggregationRulesSource,
};
