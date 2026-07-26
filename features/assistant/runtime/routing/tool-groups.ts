// ─────────────────────────────────────────────────────────────────────────────
// Tool RISK groups + mode policy.
//
// Maps the app's real CopilotKit action names (registered in use-assistant.tsx and
// builder-copilot.tsx) to risk groups, and declares which groups the conductor may
// use in each mode. The gate uses this to compute the DENY set for a turn.
//
// Design bias: keep read / navigation / answer / propose tools available almost
// always; only the genuinely state-starting tools (`runWorkflow`) and destructive
// builder-mutation tools are withheld on non-execute turns. That is the smallest
// intervention that stops "a mention starts a workflow" without degrading the
// assistant's ability to explain, open, search, or show an inline value.
// ─────────────────────────────────────────────────────────────────────────────

export type ToolRiskGroup =
  | 'execute' // starts/advances a run — the tool whose spurious firing is the bug
  | 'builder_mutate' // structural, potentially destructive builder edits
  | 'field_edit' // brings an editable value inline (reversible proposal)
  | 'page_command' // runs a command on an open page surface
  | 'generate_ui' // renders an ephemeral generated view
  | 'read_nav' // open/show/focus/search/explain — no business side effect
  | 'unknown'; // any tool we don't recognize → treated as safe (never withheld)

/** Known action name → risk group. Unlisted names resolve to 'unknown' (kept). */
export const TOOL_GROUP_OF: Record<string, ToolRiskGroup> = {
  // execute
  runWorkflow: 'execute',
  runBuilderWorkflow: 'execute',
  // builder_mutate
  addBlock: 'builder_mutate',
  connectBlocks: 'builder_mutate',
  deleteBlock: 'builder_mutate',
  editBlockConfig: 'builder_mutate',
  renameWorkflow: 'builder_mutate',
  saveWorkflow: 'builder_mutate',
  loadWorkflow: 'builder_mutate',
  // field_edit
  editField: 'field_edit',
  // page_command
  commandPage: 'page_command',
  // generate_ui
  generateUI: 'generate_ui',
  // read_nav
  openPage: 'read_nav',
  focusAnchor: 'read_nav',
  closePage: 'read_nav',
  closeAll: 'read_nav',
  openWorkflowBuilder: 'read_nav',
  showWorkflowElement: 'read_nav',
  bringIntoChat: 'read_nav',
  explainWorksheetLine: 'read_nav',
  whyWorksheetValue: 'read_nav',
  searchWorksheet: 'read_nav',
  // Read-only retrieval / lookup tools — never a business side effect, always safe.
  searchWeb: 'read_nav',
  searchCanadianTax: 'read_nav',
  searchCompanyDocuments: 'read_nav',
  fetchWebPage: 'read_nav',
  getFxRate: 'read_nav',
  getCurrentDateTime: 'read_nav',
  calculate: 'read_nav',
  focusBlock: 'read_nav',
  listBlocks: 'read_nav',
  checkHealth: 'read_nav',
};

export function groupOfTool(name: string): ToolRiskGroup {
  return TOOL_GROUP_OF[name] ?? 'unknown';
}

import type { AssistantMode } from './route-schema';

/**
 * Risk groups the gate WITHHOLDS in each mode. Everything not listed is allowed.
 * - ask: no state-starting or destructive edits (the model may still open/show/
 *   explain/search, bring a field inline, generate a view, run a page command).
 * - propose: same as ask — a proposal must never itself start/execute.
 * - execute: nothing withheld — the user explicitly asked to act.
 */
export const MODE_DENIED_GROUPS: Record<AssistantMode, ToolRiskGroup[]> = {
  ask: ['execute', 'builder_mutate'],
  propose: ['execute', 'builder_mutate'],
  execute: [],
};

/**
 * Compute the set of tool NAMES to withhold this turn, given the available tools
 * and the mode. Only ever returns names that are actually present. Never returns
 * a set that would remove every tool (caller also guards, but this keeps the
 * contract explicit): `unknown`-group tools are never withheld.
 */
export function deniedToolNames(availableToolNames: readonly string[], mode: AssistantMode): string[] {
  const denyGroups = new Set(MODE_DENIED_GROUPS[mode]);
  if (denyGroups.size === 0) return [];
  return availableToolNames.filter((n) => denyGroups.has(groupOfTool(n)));
}
