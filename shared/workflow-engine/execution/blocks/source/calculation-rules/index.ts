import type { RegisteredToolModule } from "../../../runtime/types";
import { calculationRulesDefinition } from "./definition";
import { runCalculationRulesSource } from "./run";

export const calculationRulesToolModule: RegisteredToolModule = {
  definition: calculationRulesDefinition,
  run: runCalculationRulesSource,
};
