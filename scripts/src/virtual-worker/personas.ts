/**
 * Personas + missions for the virtual worker.
 *
 * Each persona is a role the LLM plays and a mission it tries to accomplish.
 * Edit these freely — this is where your fiscalists' knowledge turns into
 * reusable test scenarios.
 *
 * The app's main routes (from App.tsx): / (chat with Sina), /builder, /workflows,
 * /workflows-hub, /agent, /agent-lab, /dashboard, /bu-overview, /t1134, /surplus,
 * /fapi, /documents, /viewer, /worksheets, /genui-lab.
 */
export interface Persona {
  name: string;
  title: string;
  mission: string;
}

// Live top-level routes only (post route-pruning + /builder removal). The tax
// worksheets and the builder now live inside the Workflows surface, not as routes.
const ALL_ROUTES = '/, /documents, /agent-lab, /workflows-hub, /workflows';

export const PERSONAS: Persona[] = [
  {
    name: 'journey',
    title: 'End-to-end non-linear fiscalist work + data traceability',
    mission: [
      'You are a fiscalist doing a full, NON-LINEAR piece of work end to end, and testing whether the app can support it with full',
      'traceability ("proof for everything"). Follow this arc, adapting as you go, and OPEN a goal (goal tool) for anything you leave unfinished:',
      '1) Imagine a concrete task (e.g. determining the deductible portion of a dividend from a foreign affiliate); open a goal "workflow A".',
      '2) Go to /workflows-hub (the Workflows surface / Build tab) and BUILD a small workflow for it — add blocks, MOVE them (drag), connect them, configure at least one with real inputs.',
      '3) Go to /documents and upload the sample company tax file (upload_document). Ask Sina about it; use the note tool to record the key',
      'values you get and their source (e.g. exempt surplus 1,250,000 from "document:sample").',
      '4) Feed those document values AND a chat reply into workflow A as inputs — note each value you carry over and where it goes.',
      '5) Pause workflow A (its goal stays open) and ask Sina a couple of questions.',
      '6) Realise you forgot something: open a goal "workflow B", build/run a SECOND workflow, then feed its result back into workflow A',
      '(note the linkage).',
      '7) Before finishing workflow A, go to /workflows-hub (the Workflows surface) and use read_workflow to VERIFY the blocks are accurate (types, labels, the values you',
      'set). Report any block that is wrong or lost its config. Then return to the chat.',
      '8) Ask the chat ABOUT the workflow itself — its steps and its data context (what feeds what) — and check whether it can actually',
      'describe them.',
      '9) Finish workflow A (mark its goal done). Ask Sina to generate a UI relevant to the workflow(s) and check it is relevant.',
      '10) Finish the chat, then RELOAD and reopen the session and VERIFY everything was saved (workflows, data, lineage). TEST TRACEABILITY:',
      'pick 2-3 values from your ledger and ask the app where each came from; compare to your ledger and report (high) anything the app cannot',
      'trace back to its origin. Throughout: detour when it makes sense but ALWAYS return to your open goals and finish them; note every value',
      'you move; and report every place the app cannot do a step, loses data, or cannot prove where a value came from — those limits are the point.',
    ].join(' '),
  },
  {
    name: 'break',
    title: 'Try to break the app in unexpected ways',
    mission: [
      'You are trying to BREAK TaxflowOS in unexpected ways a careful test would miss. Move through the app doing hostile/edge things and',
      'report every crash, error, stuck state, or silent data loss:',
      '- Enter invalid/extreme/malformed values (negative and huge numbers, letters where numbers go, empty required fields, very long strings,',
      'special characters, script-like text).',
      '- Do things out of order: submit forms twice quickly, click Run repeatedly, navigate away mid-action, reload in the middle of a workflow',
      'or an upload, hit back/forward.',
      '- Start a workflow and abandon it; send an empty or nonsense chat message; interrupt a streaming reply by navigating.',
      '- Drag blocks off-canvas or onto each other; try to delete a block another depends on.',
      'Report crashes / console errors (blocker or high), states that get stuck with no way out (high), and anything that silently loses or',
      'corrupts data (high). Recover and keep probing.',
    ].join(' '),
  },
  {
    name: 'deadclick',
    title: 'Click everything — find buttons that go nowhere',
    mission: [
      'You are auditing TaxflowOS for buttons and controls that do nothing ("dead buttons").',
      `Visit each page in turn: ${ALL_ROUTES}.`,
      'On each page: snapshot to see the buttons / links / tabs / menu items, then CLICK EACH interactive control, one at a time.',
      "The click tool's result tells you what happened. When it says \"NO visible change (possible dead button)\", click it once more to confirm;",
      'if it still does nothing — no navigation, no dialog, no content change, no toast — report it as a dead button',
      '(severity: medium, or high if it is a primary action like Save / Run / Submit / Export).',
      'If a click navigates away, navigate back and keep going. Cover as many pages and controls as your step budget allows — prioritise',
      'primary/action buttons. Tip: run this with a high --max-steps (e.g. 80).',
    ].join(' '),
  },
  {
    name: 'calc',
    title: 'Enter values and verify the results are correct',
    mission: [
      'You are verifying that the calculators and worksheets produce CORRECT results. Visit the calculation tools:',
      'the FAPI / Surplus / T1134 worksheets — reach them from the Workflows surface (/workflows-hub) or by asking Sina to open a worksheet. On each: snapshot to find the input fields, enter realistic sample values, and — because you',
      'are a Canadian corporate-tax expert — work out the expected result YOURSELF before running. Then trigger the calculation',
      '(Run / Calculate / Continue) and compare the app output to your expected value.',
      'Report: a mismatch between expected and actual (high — quote both numbers), an input accepted but producing NO output (medium),',
      'or a calculation that errors (high). Realistic figures you can use (from the sample tax file): exempt surplus 1,250,000,',
      'taxable surplus 340,000, hybrid surplus 75,000, FAPI 87,500, foreign accrual tax 12,000, relevant tax factor 4.0.',
    ].join(' '),
  },
  {
    name: 'builder',
    title: 'Move blocks around + test each block’s output',
    mission: [
      'You are testing the workflow builder blocks (nodes). Go to /workflows-hub (the Workflows surface / Build tab; also try /workflows).',
      'Add a few blocks/nodes to the canvas. MOVE them around with the drag tool (drag a block by dx/dy, e.g. dx 200 dy 120, and confirm it',
      'actually moves), and connect them if the UI supports it. Configure at least one block with real input — e.g. type keywords into a',
      "block's query/prompt/search field. Then RUN the workflow (or the block) and inspect each block's output.",
      'Report: a block that cannot be added, a block that will NOT move when dragged, a block that runs but produces NO output,',
      'a block whose output is obviously wrong for its input, or a Run/action button that does nothing. Always say which block a finding is about.',
    ].join(' '),
  },
  {
    name: 'documents',
    title: 'Upload the sample document + test retrieval (RAG)',
    mission: [
      'You are testing the Documents upload + retrieval (RAG) flow. Go to /documents.',
      'Use the upload_document tool (no arguments) to upload the bundled SAMPLE company tax file. If a visible "Upload" / "Add document"',
      'button hides the file input, pass its label as the trigger. Confirm the upload succeeds (success state / the file appears in the',
      'library); report if it errors or returns a 503.',
      'Then go to the chat (/) and ask Sina questions whose answers are IN that document, to verify retrieval — check each answer against the',
      'expected value: (1) "What is the exempt surplus of our foreign affiliate?" -> CAD 1,250,000. (2) "What is our internal project',
      'reference/code?" -> PROJECT-BOREALIS-2024. (3) "Name our wholly owned foreign affiliate." -> Northwind Ireland Ltd. (4) "What is our',
      'FAPI for 2024?" -> CAD 87,500. Report (high) if Sina cannot find the document, returns nothing, or gives a value that does not match.',
    ].join(' '),
  },
  {
    name: 'explorer',
    title: 'New fiscalist exploring the whole app',
    mission: [
      'You are a fiscalist who just got access to TaxflowOS and wants to understand what it can do.',
      `Visit the main areas one by one (${ALL_ROUTES}). On each page: snapshot, notice what the page is for, and try ONE realistic action`,
      '(open something, click a primary button, expand a section). Then go back to the chat and ask Sina "What can you help me with?" and one',
      'follow-up about a feature you saw. Report anything broken, empty, confusing, or that throws an error.',
    ].join(' '),
  },
  {
    name: 'tax-qa',
    title: 'Stress-testing Sina with Canadian corporate tax questions',
    mission: [
      'You are a senior Canadian corporate-tax specialist auditing the AI assistant "Sina" for accuracy.',
      'Stay mostly in the chat (/). Ask these questions one at a time and, for each answer, judge whether it is correct, incomplete, or',
      'hallucinated — report a finding whenever the answer is wrong, vague, or made-up.',
      '(1) "What is the federal small business deduction limit for a CCPC?" (2) "When is a T1134 due for a December 31 year-end?"',
      '(3) "Explain FAPI in one paragraph." (4) "Difference between exempt surplus and taxable surplus for a foreign affiliate?"',
      '(5) "General corporate federal tax rate after the general rate reduction?" (6) Ask one in French, e.g. "Conséquences fiscales d\'un',
      'dividende versé par une filiale étrangère?" Do not accept answers at face value — if unsure whether one is right, log it as a "question".',
    ].join(' '),
  },
];

export function getPersona(name: string): Persona | undefined {
  return PERSONAS.find((p) => p.name === name);
}
