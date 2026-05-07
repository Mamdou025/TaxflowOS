import type { RegisteredToolModule } from "../../../runtime/types";
import { keywordMapperDefinition } from "./definition";
import { runKeywordMapper } from "./run";

export const keywordMapperToolModule: RegisteredToolModule = {
  definition: keywordMapperDefinition,
  run: runKeywordMapper,
};
