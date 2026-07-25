import type { RegisteredToolModule } from "../../../runtime/types";
import { fapiInputsDefinition } from "./definition";
import { runFapiInputsSource } from "./run";

export const fapiInputsToolModule: RegisteredToolModule = {
  definition: fapiInputsDefinition,
  run: runFapiInputsSource,
};
