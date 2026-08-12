// ─────────────────────────────────────────────────────────────────────────────
// Friendly, human labels for Sina's tools — one shared source so the Tools menu,
// the per-answer "Tools used" bar, and receipts all name a tool the same way.
// Covers every tool the agent can call (not just the runnable ones), because the
// "Tools used" bar must be able to name a background action too. Unmapped names
// fall back to a prettified version of the raw name.
// ─────────────────────────────────────────────────────────────────────────────

export const TOOL_LABELS: Record<string, string> = {
  // Search & documents
  searchWeb: 'Web search',
  searchCanadianTax: 'Canadian tax search',
  searchCompanyDocuments: 'Document search',
  fetchWebPage: 'Read web page',
  // Live data & calculators
  getFxRate: 'Exchange rate',
  estimateForeignIncomeTax: 'Foreign-income tax estimate',
  calculate: 'Calculator',
  getCurrentDateTime: 'Current date & time',
  // Worksheet reasoning
  searchWorksheet: 'Worksheet search',
  explainWorksheetLine: 'Explain worksheet line',
  whyWorksheetValue: 'Worksheet value trace',
  editField: 'Edit a field',
  // Workflows
  runWorkflow: 'Run a workflow',
  showWorkflowElement: 'Show a workflow element',
  openWorkflowBuilder: 'Open the builder',
  // Workspace & navigation
  openPage: 'Open a page',
  focusAnchor: 'Focus a section',
  commandPage: 'Command the page',
  bringIntoChat: 'Bring into chat',
  closePage: 'Close a page',
  closeAll: 'Close all pages',
  generateUI: 'Generate a view',
  // Memory
  rememberFact: 'Remember a fact',
  forgetFact: 'Forget a fact',
  // Builder actions
  focusBlock: 'Focus a block',
  addBlock: 'Add a block',
  editBlockConfig: 'Edit block config',
  connectBlocks: 'Connect blocks',
};

/** camelCase / snake → "Camel case" for tools without an explicit label. */
function prettify(name: string): string {
  const spaced = name.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ');
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

export function toolLabel(name: string | undefined | null): string {
  if (!name) return 'Tool';
  return TOOL_LABELS[name] ?? prettify(name);
}
