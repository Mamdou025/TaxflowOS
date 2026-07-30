/**
 * Personas + missions for the virtual worker.
 *
 * Each persona is a role the LLM plays and a mission it tries to accomplish.
 * Edit these freely — this is where your fiscalists' knowledge turns into
 * reusable test scenarios. Add real Canadian corporate-tax questions to the
 * `tax-qa` mission and the worker will ask them and judge the answers.
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

export const PERSONAS: Persona[] = [
  {
    name: 'explorer',
    title: 'New fiscalist exploring the whole app',
    mission: [
      'You are a fiscalist who just got access to TaxflowOS and wants to understand what it can do.',
      'Visit the main areas one by one: the chat (/), Dashboard (/dashboard), Workflows (/workflows),',
      'the T1134 tool (/t1134), Surplus (/surplus), FAPI (/fapi), Documents (/documents), and the Agent page (/agent).',
      'On each page: take a snapshot, notice what the page is for, and try ONE realistic action (open something,',
      'click a primary button, expand a section). Then go back to the chat and ask Sina "What can you help me with?"',
      'and one follow-up about a feature you saw. Report anything broken, empty, confusing, or that throws an error.',
    ].join(' '),
  },
  {
    name: 'tax-qa',
    title: 'Stress-testing Sina with Canadian corporate tax questions',
    mission: [
      'You are a senior Canadian corporate-tax specialist auditing the AI assistant "Sina" for accuracy.',
      'Stay mostly in the chat (/). Ask these questions one at a time and, for each answer, judge whether it is',
      'correct, incomplete, or hallucinated — report a finding whenever the answer is wrong, vague, or made-up.',
      'Questions: (1) "What is the federal small business deduction limit for a CCPC?"',
      '(2) "When is a T1134 information return due for a corporation with a December 31 year-end?"',
      '(3) "Explain FAPI (Foreign Accrual Property Income) in one paragraph."',
      '(4) "What is the difference between exempt surplus and taxable surplus for a foreign affiliate?"',
      '(5) "What is the general corporate federal tax rate in Canada after the general rate reduction?"',
      '(6) Ask one question in French, e.g. "Quelles sont les conséquences fiscales d\'un dividende versé par une filiale étrangère?"',
      'Do not accept an answer at face value — if you are unsure whether it is right, say so in the finding as a "question".',
    ].join(' '),
  },
  {
    name: 'documents',
    title: 'Document upload + RAG (searchCompanyDocuments)',
    mission: [
      'You are a fiscalist who wants to work with company documents. Go to /documents.',
      'Explore the Documents Library UI: is there an upload control? Try to use it (you have no real file to attach,',
      'so just verify the upload flow surfaces clearly and does not silently fail — note if it errors or 503s).',
      'Then go to the chat (/) and ask Sina to "search my company documents for the tax residency of our subsidiary"',
      'and one more document-related question. Report if document search is broken, returns nothing with no explanation,',
      'or if the upload path is confusing or errors.',
    ].join(' '),
  },
  {
    name: 'workflows',
    title: 'Trying to run a real tax workflow',
    mission: [
      'You are a fiscalist who wants to actually get work done with the workflow tools.',
      'Visit /workflows and /workflows-hub, and the T1134 (/t1134), Surplus (/surplus) and FAPI (/fapi) pages.',
      'On one of them, attempt to start or fill in a workflow as a real user would — enter plausible sample data,',
      'click the primary action (Run / Calculate / Continue), and see what happens.',
      'Then ask Sina to explain what that workflow does and whether you did it correctly.',
      'Report anything that: does nothing when clicked, throws an error, gives no feedback, or produces a result',
      'that looks obviously wrong.',
    ].join(' '),
  },
  {
    name: 'chaos',
    title: 'Curious user poking at everything',
    mission: [
      'You are a curious, slightly impatient user clicking around fast to see what breaks.',
      'Move through several pages, click primary buttons, open menus and tabs, type into inputs, and send a couple of',
      'odd or ambiguous messages to Sina (e.g. an empty-ish request, a very broad request, and a nonsense request).',
      'Your goal is to surface crashes, dead buttons, blank states, console errors, and unhelpful AI responses.',
      'Report each concrete problem with what you did and what went wrong.',
    ].join(' '),
  },
];

export function getPersona(name: string): Persona | undefined {
  return PERSONAS.find((p) => p.name === name);
}
