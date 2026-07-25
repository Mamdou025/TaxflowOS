import type { RegisteredToolModule } from "../../../runtime/types";
import { manualTableDefinition } from "./definition";
import { runManualTableSource } from "./run";

export const manualTableToolModule: RegisteredToolModule = {
  definition: manualTableDefinition,
  run: runManualTableSource,
};
