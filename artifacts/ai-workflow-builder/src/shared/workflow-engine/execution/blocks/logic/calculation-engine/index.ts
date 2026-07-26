import type { RegisteredToolModule } from "../../../runtime/types";
import { calculationEngineDefinition } from "./definition";
import { runCalculationEngine } from "./run";

export const calculationEngineToolModule: RegisteredToolModule = {
  definition: calculationEngineDefinition,
  run: runCalculationEngine,
};
