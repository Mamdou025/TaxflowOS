// ─────────────────────────────────────────────────────────────────────────────
// Ambient declarations for the server-safe Agent Lab modules we reuse from the
// web package (@workspace/ai-workflow-builder) via the `@` alias.
//
// At RUNTIME esbuild resolves `@/...` to ../ai-workflow-builder/src (build.mjs
// alias) and bundles the real files. For TYPECHECK we don't want tsc to pull the
// entire web source tree into this package's program (different lib/rootDir), so
// we declare just the surface this api-server touches. Keep these in sync with
// features/agent-lab/{agent,catalog,model-router}.ts.
// ─────────────────────────────────────────────────────────────────────────────

declare module "@/features/agent-lab/model-router" {
  export type EffortLevel = "low" | "medium" | "high" | "xhigh" | "max";
  export const EFFORT_LEVELS: EffortLevel[];
}

declare module "@/features/agent-lab/catalog" {
  export type AgentLabMessage = { role: "user" | "assistant"; content: string };
  export type AgentLabDoc = { name: string; text: string };
  export type DocMode = "full" | "retrieval";
}

declare module "@/features/agent-lab/agent" {
  import type { EffortLevel } from "@/features/agent-lab/model-router";

  export function runAgent(opts: {
    model: string;
    system: string;
    temperature: number;
    maxSteps: number;
    enabledTools: string[];
    messages: { role: "user" | "assistant"; content: string }[];
    documents: { name: string; text: string }[];
    docMode: "full" | "retrieval";
    effort?: EffortLevel;
  }): Promise<unknown>;
}
