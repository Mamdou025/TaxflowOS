import type { RegisteredToolModule } from "../../../runtime/types";
import { keywordRulesDefinition } from "./definition";
import { runKeywordRulesSource } from "./run";

export const keywordRulesToolModule: RegisteredToolModule = {
  definition: keywordRulesDefinition,
  run: runKeywordRulesSource,
};
