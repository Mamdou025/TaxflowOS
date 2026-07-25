

import { getBlockFamilyRule } from "@/shared/workflow-engine/domain/workflow/workflow-rules";

const AI_AGENT_PROPOSAL_MESSAGE = `${getBlockFamilyRule("AI / Agent").responsibility} ${getBlockFamilyRule("AI / Agent").mustNot}`;

export function AiAgentProposalNotice() {
  return (
    <div className="rounded-md border border-fuchsia-500/30 bg-fuchsia-500/10 p-3 text-muted-foreground text-xs">
      {AI_AGENT_PROPOSAL_MESSAGE}
    </div>
  );
}
