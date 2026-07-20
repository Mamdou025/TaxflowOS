// ─────────────────────────────────────────────────────────────────────────────
// Agent shells + workflow catalog for the chat launcher.
//
// "Agents" are named specialists the chat can hand off to. Today they are shells
// (display + which workflow they own); Sofi is the only live one — she takes over
// when the user chooses to calculate FAPI. Later each agent gets its own tools /
// CoAgent. "Workflows" are the runnable procedures surfaced as suggestions.
// ─────────────────────────────────────────────────────────────────────────────

export type Agent = {
  id: string;
  name: string;
  role: string;
  tagline: string;
  accent: string;
  initials: string;
  /** The workflow id this agent owns, if any. */
  workflow?: string;
  live: boolean;
};

export const AGENTS: Agent[] = [
  {
    id: 'sofi',
    name: 'Sofi',
    role: 'FAPI specialist',
    tagline: 'Runs the FAPI calculation end-to-end and pauses whenever a judgment call is yours.',
    accent: '#18181b',
    initials: 'So',
    workflow: 'fapi',
    live: true,
  },
  {
    id: 'theo',
    name: 'Théo',
    role: 'Rollover specialist (art. 85)',
    tagline: 'Runs the art. 85 rollover — classifies transferred property, computes the election bounds, and pauses for you to elect the amount.',
    accent: '#1e3a2f',
    initials: 'Th',
    workflow: 'roulement',
    live: true,
  },
  {
    id: 'mira',
    name: 'Mira',
    role: 'Expense reimbursement',
    tagline: 'Classifies an expense report, applies the per-diem cap and reimbursement policy, and computes the net payable to the employee.',
    accent: '#1e3a5f',
    initials: 'Mi',
    workflow: 'expense',
    live: true,
  },
  {
    id: 'nova',
    name: 'Nova',
    role: 'Marketing budget planner',
    tagline: 'Classifies channel spend requests, then pauses for you to elect the approved budget between the committed floor and the cap.',
    accent: '#4a2f5f',
    initials: 'No',
    workflow: 'campaign',
    live: true,
  },
  {
    id: 'remy',
    name: 'Rémy',
    role: 'Surplus & T1134',
    tagline: 'Surplus accounts and foreign-affiliate reporting. Coming soon.',
    accent: '#a1a1aa',
    initials: 'Ré',
    live: false,
  },
];

export function getAgent(id: string): Agent | null {
  return AGENTS.find((a) => a.id === id) ?? null;
}

export function getAgentForWorkflow(workflowId: string): Agent | null {
  return AGENTS.find((a) => a.workflow === workflowId) ?? null;
}

export type WorkflowSuggestion = {
  id: string;
  name: string;
  sub: string;
  agentId?: string;
  ready: boolean;
};

export const WORKFLOWS: WorkflowSuggestion[] = [
  { id: 'fapi', name: 'Calculate FAPI', sub: 'Foreign accrual property income', agentId: 'sofi', ready: true },
  { id: 'roulement', name: 'Roulement fiscal (art. 85)', sub: 'Rollover election → T2057', agentId: 'theo', ready: true },
  { id: 'expense', name: 'Expense reimbursement', sub: 'Receipts → policy caps → net payable', agentId: 'mira', ready: true },
  { id: 'campaign', name: 'Campaign budget allocation', sub: 'Requests → elect budget → projection', agentId: 'nova', ready: true },
  { id: 'surplus', name: 'Surplus continuity', sub: 'Exempt / taxable surplus', ready: false },
];
