import type { RegisteredToolModule } from "../../../runtime/types";
import { httpJsonDefinition } from "./definition";
import { runHttpJsonSource } from "./run";

export const httpJsonToolModule: RegisteredToolModule = {
  definition: httpJsonDefinition,
  run: runHttpJsonSource,
};

export { httpJsonDefinition } from "./definition";
export { runHttpJsonSource } from "./run";
export {
  assertPublicHttpUrl,
  fetchJsonSource,
  parseHttpJsonConfig,
} from "./schema";
export type {
  FetchJsonSourceResult,
  HttpJsonFieldMap,
  HttpJsonResponseMeta,
  HttpJsonSourceConfig,
} from "./schema";
