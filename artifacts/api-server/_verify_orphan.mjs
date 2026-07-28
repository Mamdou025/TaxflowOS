// TEMP verification script — delete after use.
// Replays a generateCopilotResponse request containing an ORPHANED tool call
// (an actionExecutionMessage with no matching resultMessage, followed by a new user
// message) against the live api-server, to prove the orphan-repair middleware fires
// and the AI SDK no longer throws MissingToolResultsError for that call.
// The exact generateCopilotResponse mutation document the client sends.
const MUT =
  "/app/node_modules/.pnpm/@copilotkit+runtime-client-gql@1.63.2_@ag-ui+core@0.0.57_graphql@16.14.2_react@19.1.0/node_modules/@copilotkit/runtime-client-gql/dist/graphql/definitions/mutations.mjs";
const { generateCopilotResponseMutation: doc } = await import(MUT);
const query =
  typeof doc === "string" ? doc : doc?.loc?.source?.body;
if (!query) throw new Error("could not resolve mutation query string");
console.log("operation doc chars:", query.length);

const ORPHAN_ID = "call_VERIFY_orphan_123";
const now = new Date().toISOString();

const variables = {
  data: {
    metadata: {},
    threadId: "verify-thread-1",
    messages: [
      { id: "m1", createdAt: now, textMessage: { role: "user", content: "compute fapi" } },
      // assistant emits a tool call ...
      { id: ORPHAN_ID, createdAt: now, actionExecutionMessage: { name: "runWorkflow", arguments: "{}" } },
      // ... which is NEVER answered (run aborted). Then a NEW user turn:
      { id: "m3", createdAt: now, textMessage: { role: "user", content: "what is net fapi?" } },
    ],
    frontend: { actions: [] },
  },
  properties: {},
};

const res = await fetch("http://localhost:5000/api/copilotkit", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ operationName: "generateCopilotResponse", query, variables }),
});
console.log("HTTP status:", res.status);
const text = await res.text();
console.log("response head:", text.slice(0, 800));
