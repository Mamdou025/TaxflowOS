import type { RegisteredToolModule } from "../../../runtime/types";
import { currencyRateDefinition } from "./definition";
import { runCurrencyRateSource } from "./run";

export const currencyRateToolModule: RegisteredToolModule = {
  definition: currencyRateDefinition,
  run: runCurrencyRateSource,
};
