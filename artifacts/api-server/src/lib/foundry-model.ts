import { OpenAIAdapter } from '@copilotkit/runtime';
import OpenAI from 'openai';

type Environment = Record<string, string | undefined>;
type FoundryConfig = {
  endpoint: string;
  name: string;
  version: string;
  tenant: string;
  client: string;
  secret: string;
};

export function readFoundryConfig(env: Environment): FoundryConfig {
  const endpoint = env.AZURE_AI_PROJECT_ENDPOINT?.replace(/\/$/, '');
  const version = env.MICROSINA_AGENT_VERSION;
  const tenant = env.AZURE_TENANT_ID;
  const client = env.AZURE_CLIENT_ID;
  const secret = env.AZURE_CLIENT_SECRET;
  if (!endpoint || !version || !tenant || !client || !secret) {
    throw new Error(
      'MicroSina is not connected. Configure the Foundry project, agent version and Azure server identity in the backend secrets.',
    );
  }
  const url = new URL(endpoint);
  if (
    url.protocol !== 'https:' ||
    !url.hostname.endsWith('.services.ai.azure.com') ||
    !/^\/api\/projects\/[^/]+$/.test(url.pathname) ||
    url.search ||
    url.hash ||
    url.username ||
    url.password
  ) {
    throw new Error('MicroSina requires a Microsoft Foundry project endpoint.');
  }
  if (!/^[a-zA-Z0-9.-]+$/.test(tenant) || !/^\d+$/.test(version)) {
    throw new Error(
      'MicroSina requires a valid Azure tenant and an explicit numeric agent version.',
    );
  }
  return { endpoint, name: 'MicroSina', version, tenant, client, secret };
}

/** Keep the Foundry definition authoritative; only supply this turn and host tools. */
export function foundryResponseBody(
  body: Record<string, unknown>,
  config: Pick<FoundryConfig, 'name' | 'version'>,
) {
  if (!Array.isArray(body.input) && typeof body.input !== 'string') {
    throw new Error('MicroSina requires a Responses API input.');
  }
  const tools = Array.isArray(body.tools) ? body.tools : [];
  if (tools.some((tool) => tool.type !== 'function' || typeof tool.name !== 'string')) {
    throw new Error('MicroSina accepts only Inscope function tools.');
  }
  return {
    agent_reference: { type: 'agent_reference', name: config.name, version: config.version },
    input: body.input,
    stream: body.stream === true,
    store: false,
    tools,
    // Also constrain inherited Foundry tools (including the portal's default Bing tool).
    tool_choice: tools.length
      ? {
          type: 'allowed_tools',
          mode: 'auto',
          tools: tools.map((tool) => ({ type: 'function', name: tool.name })),
        }
      : 'none',
  };
}

/** OAuth credentials never leave the API server. Cache tokens, never conversation state. */
export function createFoundryFetch(
  env: Environment,
  transport: typeof fetch = fetch,
): typeof fetch {
  let cached: { token: string; expires: number } | undefined;
  return async (_url, init) => {
    const config = readFoundryConfig(env);
    const signal = init?.signal
      ? AbortSignal.any([init.signal, AbortSignal.timeout(120_000)])
      : AbortSignal.timeout(120_000);
    if (!cached || cached.expires <= Date.now()) {
      const tokenResponse = await transport(
        `https://login.microsoftonline.com/${encodeURIComponent(config.tenant)}/oauth2/v2.0/token`,
        {
          method: 'POST',
          redirect: 'error',
          signal,
          body: new URLSearchParams({
            grant_type: 'client_credentials',
            client_id: config.client,
            client_secret: config.secret,
            scope: 'https://ai.azure.com/.default',
          }),
        },
      );
      if (!tokenResponse.ok)
        throw new Error(
          `MicroSina Azure authentication failed (${tokenResponse.status}). Check the backend identity configuration.`,
        );
      const token = (await tokenResponse.json()) as {
        access_token?: unknown;
        expires_in?: unknown;
      };
      if (typeof token.access_token !== 'string' || typeof token.expires_in !== 'number') {
        throw new Error('MicroSina Azure authentication returned an invalid token response.');
      }
      cached = {
        token: token.access_token,
        expires: Date.now() + Math.max(0, token.expires_in - 60) * 1000,
      };
    }
    if (typeof init?.body !== 'string')
      throw new Error('MicroSina received an invalid model request.');
    const body = foundryResponseBody(JSON.parse(init.body), config);
    const response = await transport(`${config.endpoint}/openai/v1/responses`, {
      method: 'POST',
      redirect: 'error',
      signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${cached.token}` },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      if (response.status === 401) cached = undefined;
      // Never echo provider response bodies, which can contain request content.
      throw new Error(
        `MicroSina Foundry request failed (${response.status}). Check project access, the saved agent version and model availability.`,
      );
    }
    return response;
  };
}

export function createFoundryAdapter(
  env: Environment = process.env,
  transport: typeof fetch = fetch,
) {
  // Use CopilotKit's own SDK version, as Sina does, to preserve its stream/tool contract.
  return new OpenAIAdapter({
    openai: new OpenAI({
      apiKey: 'server-authenticated',
      fetch: createFoundryFetch(env, transport),
    }),
    model: 'gpt-5', // SDK serialization hint only; the wire model comes from Foundry.
  });
}
