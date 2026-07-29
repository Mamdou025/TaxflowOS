// Ambient declaration for the shared agent-tool registry we reuse from the web
// package via the `@` alias (esbuild resolves it at build; tsc uses this stub so it
// doesn't pull the whole web source tree into this package's program). Keep in sync
// with platform/agent-tools/registry.ts.
declare module "@/platform/agent-tools/registry" {
  export function isAgentToolId(id: string): boolean;
  export function runAgentTool(id: string, rawArgs: unknown): Promise<unknown>;
}
