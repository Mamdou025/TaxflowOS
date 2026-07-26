import { inputSummary, pretty } from "./preview-utils";
import type {
  BlockCodePreview,
  GenerateBlockCodePreviewOptions,
} from "./types";

export function genericCodePreview({
  block,
  config,
  inputBindings,
  tool,
}: GenerateBlockCodePreviewOptions): BlockCodePreview {
  return {
    code: pretty({
      blockFamily: block.family,
      blockSubtype: block.subtype,
      config,
      inputRoles: tool?.inputRoles || [],
      outputRoles: tool?.outputRoles || [],
      toolId: tool?.toolId || config.toolId || "local_preview",
    }),
    editable: false,
    explanation:
      "This structured block uses local mock configuration. A more specific generated preview can be added when this tool graduates from the prototype catalog.",
    language: "json_config",
    resolvedConfig: config,
    resolvedInputs: inputSummary(inputBindings),
    title: `${block.label} Configuration Preview`,
  };
}
