import type { RegisteredToolModule } from "../../../runtime/types";
import { rollupRulesDefinition } from "./definition";
import { runRollupRulesSource } from "./run";

export const rollupRulesToolModule: RegisteredToolModule = {
  definition: rollupRulesDefinition,
  run: runRollupRulesSource,
};
