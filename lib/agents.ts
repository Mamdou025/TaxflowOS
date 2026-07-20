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
  /** One-line opener shown when the user clicks the agent (before typing). */
  greeting?: string;
  /** Scripted "thinking" lines revealed one-by-one while the real reply streams,
   *  so a handoff reads as the agent working THROUGH steps, not an instant menu. */
  thinking?: string[];
};

/** Generic fallbacks so any agent (even one without bespoke copy) still greets +
 *  narrates. Named agents override these with domain-flavored lines below. */
export function agentGreeting(agent: Agent): string {
  return agent.greeting ?? `Hi — I'm ${agent.name}, your ${agent.role.toLowerCase()}. Tell me what you'd like and I'll get to work.`;
}
export function agentThinking(agent: Agent): string[] {
  return agent.thinking?.length ? agent.thinking : ['Got it — let me take a look.', 'Reviewing what you’ve shared…', 'Lining up the steps…'];
}

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
    greeting: 'Hi — I’m Sofi, your FAPI specialist. Tell me what you’d like to work on and I’ll take it from there.',
    thinking: ['Got it — let me take a look.', 'Reviewing what you’ve shared…', 'Lining up the FAPI steps…'],
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
    greeting: 'Bonjour — I’m Théo, I handle the art. 85 rollover. What would you like me to work on?',
    thinking: ['On it — let me take a look.', 'Checking the property to transfer…', 'Setting up the election steps…'],
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
    greeting: 'Hi — I’m Mira, I handle expense reimbursements. Tell me what you need and I’ll get started.',
    thinking: ['Sure — let me take a look.', 'Going through the receipts…', 'Applying the policy caps…'],
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
    greeting: 'Hey — I’m Nova, your marketing budget planner. What should I work on?',
    thinking: ['Got it — let me take a look.', 'Reviewing the channel requests…', 'Framing the budget options…'],
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
