import type { RegisteredToolModule } from "../../../runtime/types";
import { hierarchyAggregatorDefinition } from "./definition";
import { runHierarchyAggregator } from "./run";

export const hierarchyAggregatorToolModule: RegisteredToolModule = {
  definition: hierarchyAggregatorDefinition,
  run: runHierarchyAggregator,
};
