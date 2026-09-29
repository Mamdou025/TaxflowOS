import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  createFoundryAdapter,
  createFoundryFetch,
  foundryResponseBody,
  readFoundryConfig,
} from '../../artifacts/api-server/src/lib/foundry-model';
import { readChatAgent, tagChatAgent } from '@/features/assistant/runtime/chat/chat-agent';
import {
  projectMessages,
  reconstructMessages,
} from '@/features/assistant/runtime/chat/message-codec';

const env = {
  AZURE_AI_PROJECT_ENDPOINT: 'https://synthetic.services.ai.azure.com/api/projects/test',
  MICROSINA_AGENT_VERSION: '2',
  AZURE_TENANT_ID: 'test-tenant',
  AZURE_CLIENT_ID: 'test-client',
  AZURE_CLIENT_SECRET: 'synthetic-secret',
};
const tool = {
  type: 'function',
  name: 'listAvailableWorkflows',
  parameters: { type: 'object', properties: {} },
};

test('Foundry owns model and base instructions; history and host function tools cross the adapter', () => {
  const input = [
    { role: 'user', content: 'Show workflows' },
    { type: 'function_call_output', call_id: 'one', output: '[]' },
  ];
  const body = foundryResponseBody(
    {
      input,
      tools: [tool],
      stream: true,
      model: 'another-model',
      instructions: 'override',
      previous_response_id: 'another-users-response',
      conversation: 'shared',
      temperature: 2,
    },
    readFoundryConfig(env),
  );
  assert.deepEqual(body, {
    agent_reference: { type: 'agent_reference', name: 'MicroSina', version: '2' },
    input,
    stream: true,
    store: false,
    tools: [tool],
    tool_choice: {
      type: 'allowed_tools',
      mode: 'auto',
      tools: [{ type: 'function', name: 'listAvailableWorkflows' }],
    },
  });
  assert.equal(foundryResponseBody({ input: 'Hello' }, readFoundryConfig(env)).tool_choice, 'none');
  assert.throws(
    () =>
      foundryResponseBody(
        { input: 'Hello', tools: [{ type: 'web_search' }] },
        readFoundryConfig(env),
      ),
    /function tools/,
  );
});

test('missing configuration fails before any network call, without a Sina fallback', async () => {
  let calls = 0;
  const transport: typeof fetch = async () => {
    calls++;
    throw new Error('Unexpected network');
  };
  await assert.rejects(
    createFoundryFetch({}, transport)('https://unused', { body: '{}' }),
    /not connected/,
  );
  assert.equal(calls, 0);
  assert.throws(
    () => readFoundryConfig({ ...env, MICROSINA_AGENT_VERSION: 'latest' }),
    /explicit numeric/,
  );
  assert.throws(
    () =>
      readFoundryConfig({
        ...env,
        AZURE_AI_PROJECT_ENDPOINT: 'https://untrusted.invalid/api/projects/test',
      }),
    /project endpoint/,
  );
});

test('server OAuth token is reused and provider errors do not expose secrets or request content', async () => {
  const calls: { url: string; init?: RequestInit }[] = [];
  let fail = false;
  const transport: typeof fetch = async (url, init) => {
    calls.push({ url: String(url), init });
    if (String(url).includes('/oauth2/'))
      return Response.json({ access_token: 'synthetic-token', expires_in: 3600 });
    return fail
      ? new Response('sensitive upstream body', { status: 403 })
      : Response.json({ ok: true });
  };
  const request = createFoundryFetch(env, transport);
  const init = { body: JSON.stringify({ input: 'Hello', tools: [tool] }) };
  await request('https://unused', init);
  await request('https://unused', init);
  assert.equal(calls.filter((call) => call.url.includes('/oauth2/')).length, 1);
  assert.equal(
    new URLSearchParams(calls[0].init?.body as URLSearchParams).get('scope'),
    'https://ai.azure.com/.default',
  );
  assert.equal(calls[1].url, `${env.AZURE_AI_PROJECT_ENDPOINT}/openai/v1/responses`);
  assert.equal(new Headers(calls[1].init?.headers).get('Authorization'), 'Bearer synthetic-token');
  assert.equal(calls[1].init?.redirect, 'error');
  fail = true;
  await assert.rejects(request('https://unused', init), {
    message:
      'MicroSina Foundry request failed (403). Check project access, the saved agent version and model availability.',
  });
});

test('CopilotKit SDK consumes Foundry streamed text and function calls', async () => {
  let sent: Record<string, unknown> | undefined;
  const events = [
    { type: 'response.created', response: { id: 'r1', created_at: 1, model: 'foundry-model' } },
    {
      type: 'response.output_item.added',
      output_index: 0,
      item: { type: 'message', id: 'm1', role: 'assistant' },
    },
    {
      type: 'response.output_text.delta',
      item_id: 'm1',
      output_index: 0,
      content_index: 0,
      delta: 'Checking workflows.',
    },
    {
      type: 'response.output_item.done',
      output_index: 0,
      item: { type: 'message', id: 'm1', role: 'assistant' },
    },
    {
      type: 'response.output_item.added',
      output_index: 1,
      item: {
        type: 'function_call',
        id: 'f1',
        call_id: 'c1',
        name: 'listAvailableWorkflows',
        arguments: '',
      },
    },
    { type: 'response.function_call_arguments.delta', item_id: 'f1', output_index: 1, delta: '{}' },
    {
      type: 'response.output_item.done',
      output_index: 1,
      item: {
        type: 'function_call',
        id: 'f1',
        call_id: 'c1',
        name: 'listAvailableWorkflows',
        arguments: '{}',
        status: 'completed',
      },
    },
    {
      type: 'response.completed',
      response: { id: 'r1', status: 'completed', usage: { input_tokens: 5, output_tokens: 6 } },
    },
  ];
  const transport: typeof fetch = async (url, init) => {
    if (String(url).includes('/oauth2/'))
      return Response.json({ access_token: 'test', expires_in: 3600 });
    sent = JSON.parse(String(init?.body));
    return new Response(events.map((event) => `data: ${JSON.stringify(event)}\n\n`).join(''), {
      headers: { 'content-type': 'text/event-stream' },
    });
  };
  const model = createFoundryAdapter(env, transport).getLanguageModel();
  assert.notEqual(typeof model, 'string');
  if (typeof model === 'string') throw new Error('Expected a configured model');
  const result = await model.doStream({
    prompt: [{ role: 'user', content: [{ type: 'text', text: 'Show workflows' }] }],
    tools: [
      {
        type: 'function',
        name: 'listAvailableWorkflows',
        inputSchema: { type: 'object', properties: {} },
      },
    ],
    providerOptions: { openai: { store: false } },
  });
  const parts = [];
  const reader = result.stream.getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    parts.push(value);
  }
  assert.deepEqual(
    parts.filter((part) => part.type === 'error'),
    [],
  );
  assert.ok(
    parts.some((part) => part.type === 'text-delta' && part.delta === 'Checking workflows.'),
  );
  assert.ok(
    parts.some(
      (part) =>
        part.type === 'tool-call' &&
        part.toolCallId === 'c1' &&
        part.toolName === 'listAvailableWorkflows' &&
        part.input === '{}',
    ),
    JSON.stringify(parts),
  );
  assert.deepEqual(sent?.agent_reference, {
    type: 'agent_reference',
    name: 'MicroSina',
    version: '2',
  });
});

test('saved chat agent metadata restores across devices, stays outside the prompt and preserves legacy Sina', () => {
  const original = [{ id: 'u1', role: 'user', content: 'Hello' }];
  const projected = projectMessages(original);
  assert.equal(readChatAgent(projected), 'sina');
  const tagged = tagChatAgent(projected, 'microsina');
  assert.equal(readChatAgent(tagged), 'microsina');
  assert.deepEqual(reconstructMessages(tagged), original);
  assert.equal(readChatAgent(projected), 'sina');
  assert.throws(
    () => readChatAgent([{ seq: 0, content: { chatAgent: 'unknown' } }]),
    /unsupported agent/,
  );
});
