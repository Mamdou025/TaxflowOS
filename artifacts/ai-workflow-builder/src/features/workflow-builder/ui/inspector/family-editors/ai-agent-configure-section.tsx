// Configure-tab body for the "AI / Agent" block family. Extracted out of
// block-inspector.tsx's ConfigureSection so that file stays under its
// architecture line budget — this is purely a move, no behavior changed.
import type { WorkflowBlock } from "@/shared/workflow-engine/workflow/contracts";
import type { WorkflowEdge, WorkflowNode } from "@/shared/workflow-engine/state/workflow-store";
import type { LocalRunRecord } from "@/shared/workflow-engine/workflow/contracts";
import { Field, getString } from "../block-inspector";
import { AiAgentProposalNotice } from "./ai-agent-proposal-notice";
import { AiClassificationSuggestionPanel } from "./ai-classification-suggestion-panel";

type AiAgentConfigureSectionProps = {
  block: WorkflowBlock;
  config: Record<string, unknown>;
  disabled?: boolean;
  edges: WorkflowEdge[];
  lastRun?: LocalRunRecord;
  nodes: WorkflowNode[];
  setConfigValue: (key: string, value: unknown) => void;
  setConfigValues: (patch: Record<string, unknown>) => void;
};

export function AiAgentConfigureSection({
  block,
  config,
  disabled,
  edges,
  lastRun,
  nodes,
  setConfigValue,
  setConfigValues,
}: AiAgentConfigureSectionProps) {
  if (block.subtype === "AI Mapping Suggestion") {
    return (
      <AiClassificationSuggestionPanel
        block={block}
        config={config}
        disabled={disabled}
        edges={edges}
        lastRun={lastRun}
        nodes={nodes}
        onConfigPatch={setConfigValues}
      />
    );
  }

  return (
    <div className="space-y-3">
      <Field
        disabled={disabled}
        label="Prompt / config"
        onChange={(value) => setConfigValue("aiPrompt", value)}
        value={getString(config.aiPrompt || config.prompt)}
      />
      <div className="grid gap-2.5 sm:grid-cols-2">
        <Field
          disabled={disabled}
          label="Allowed actions"
          onChange={(value) => setConfigValue("allowedActions", value)}
          value={getString(config.allowedActions, "propose only")}
        />
        <Field
          disabled={disabled}
          label="Selected tools"
          onChange={(value) => setConfigValue("selectedTools", value)}
          value={getString(config.selectedTools, "local catalog")}
        />
      </div>
      <AiAgentProposalNotice />
    </div>
  );
}
