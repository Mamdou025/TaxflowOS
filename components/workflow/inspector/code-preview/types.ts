import type { WorkflowBlock } from "@/lib/local-fiscal-workflow";
import type { ToolDefinition } from "@/lib/local-tool-registry";

export type BlockCodePreviewLanguage =
  | "formula"
  | "json_config"
  | "plain_english"
  | "typescript_preview";

export type BlockCodePreview = {
  code: string;
  editable: boolean;
  explanation: string;
  language: BlockCodePreviewLanguage;
  resolvedConfig?: Record<string, unknown>;
  resolvedInputs?: Record<string, unknown>;
  title: string;
};

export type InputBindingPreview = {
  label: string;
  value: unknown;
};

export type GenerateBlockCodePreviewOptions = {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  inputBindings: InputBindingPreview[];
  tool: ToolDefinition | null;
};
