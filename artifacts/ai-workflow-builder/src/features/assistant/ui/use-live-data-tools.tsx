import { useCopilotAction } from '@copilotkit/react-core';
import { useSetAtom, useStore } from 'jotai';
import { apiFetch } from '@/platform/auth/api-fetch';
import { pushTrailAtom } from '@/shared/stores/workspace-store';
import {
  webSearchKey,
  webSearchResultsAtom,
  type WebSearchResult,
  type WebSearchScope,
} from '@/shared/stores/web-search-store';
import { WebSearchCard } from '@/features/assistant/workspace/web-search-card';

export function useLiveDataTools() {
  const store = useStore();
  const pushTrail = useSetAtom(pushTrailAtom);
  const callServerTool = async (tool: string, args: Record<string, unknown>) => {
    try {
      const response = await apiFetch('/api/assistant/tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool, args }),
      });
      if (!response.ok) return { error: 'Tool unavailable (HTTP ' + response.status + ').' };
      return await response.json();
    } catch {
      return { error: 'Tool call failed.' };
    }
  };
  const runWebSearch = async (
    scope: WebSearchScope,
    tool: string,
    query: string,
    limit?: number,
  ) => {
    const trimmed = query.trim();
    const key = webSearchKey(scope, trimmed);
    store.set(webSearchResultsAtom, (previous) => ({
      ...previous,
      [key]: { scope, status: 'searching', query: trimmed, results: [], at: Date.now() },
    }));
    const data = (await callServerTool(tool, { query: trimmed, limit })) as {
      results?: WebSearchResult[];
      note?: string;
      error?: string;
    };
    const results = Array.isArray(data.results) ? data.results : [];
    const note = data.error ?? data.note;
    store.set(webSearchResultsAtom, (previous) => ({
      ...previous,
      [key]: {
        scope,
        status: results.length ? 'done' : note ? 'error' : 'empty',
        query: trimmed,
        results,
        note,
        at: Date.now(),
      },
    }));
    pushTrail({
      text:
        (scope === 'ca-tax' ? 'Searched Canadian tax sources: ' : 'Searched the web: ') + trimmed,
      tone: 'info',
    });
    return data;
  };

  useCopilotAction({
    name: 'searchWeb',
    description:
      'Search the public web for current information and return source links that must be cited.',
    parameters: [
      { name: 'query', type: 'string', description: 'the web search query', required: true },
      { name: 'limit', type: 'number', description: 'max results', required: false },
    ],
    handler: async ({ query, limit }: { query: string; limit?: number }) =>
      runWebSearch('web', 'searchWeb', query, limit),
    render: ({ args, result }: { args: { query?: string }; result?: unknown }) =>
      args?.query ? (
        <WebSearchCard query={args.query} scope="web" result={result} />
      ) : (
        <div style={{ fontSize: 12.5, color: '#71717a', padding: '8px 0' }}>
          Preparing web search…
        </div>
      ),
  });
  useCopilotAction({
    name: 'searchCanadianTax',
    description:
      'Search official Canadian tax sources for current rules, rates, forms and deadlines.',
    parameters: [
      { name: 'query', type: 'string', description: 'what to look up', required: true },
      { name: 'limit', type: 'number', description: 'max results', required: false },
    ],
    handler: async ({ query, limit }: { query: string; limit?: number }) =>
      runWebSearch('ca-tax', 'searchCanadianTax', query, limit),
    render: ({ args, result }: { args: { query?: string }; result?: unknown }) =>
      args?.query ? (
        <WebSearchCard query={args.query} scope="ca-tax" result={result} />
      ) : (
        <div style={{ fontSize: 12.5, color: '#71717a', padding: '8px 0' }}>
          Searching Canadian tax sources…
        </div>
      ),
  });
  useCopilotAction({
    name: 'fetchWebPage',
    description: 'Fetch a public web page and return its readable text.',
    parameters: [{ name: 'url', type: 'string', description: 'public URL', required: true }],
    handler: async ({ url }: { url: string }) => callServerTool('fetchWebPage', { url }),
  });
  useCopilotAction({
    name: 'getFxRate',
    description: 'Get an annual-average exchange rate from live Bank of Canada data.',
    parameters: [
      { name: 'from', type: 'string', description: 'source currency', required: true },
      { name: 'to', type: 'string', description: 'target currency', required: true },
      { name: 'year', type: 'number', description: 'calendar year', required: false },
    ],
    handler: async ({ from, to, year }: { from: string; to: string; year?: number }) =>
      callServerTool('getFxRate', { from, to, year }),
  });
  useCopilotAction({
    name: 'estimateForeignIncomeTax',
    description: 'Estimate Canadian corporate tax on foreign-currency income.',
    parameters: [
      { name: 'grossIncome', type: 'number', description: 'gross income', required: true },
      { name: 'currency', type: 'string', description: 'currency code', required: true },
      { name: 'taxYear', type: 'number', description: 'tax year', required: true },
    ],
    handler: async ({
      grossIncome,
      currency,
      taxYear,
    }: {
      grossIncome: number;
      currency: string;
      taxYear: number;
    }) => callServerTool('estimateForeignIncomeTax', { grossIncome, currency, taxYear }),
  });
  useCopilotAction({
    name: 'callApi',
    description: 'Call a public JSON HTTP API. Never invent a response; report connector failures.',
    parameters: [
      { name: 'url', type: 'string', description: 'public URL', required: true },
      { name: 'method', type: 'string', description: 'GET or POST', required: false },
      { name: 'body', type: 'string', description: 'JSON request body', required: false },
      {
        name: 'resultsPath',
        type: 'string',
        description: 'dotted path to records',
        required: false,
      },
    ],
    handler: async ({
      url,
      method,
      body,
      resultsPath,
    }: {
      url: string;
      method?: string;
      body?: string;
      resultsPath?: string;
    }) => callServerTool('callApi', { url, method, body, resultsPath }),
  });
  useCopilotAction({
    name: 'calculate',
    description: 'Evaluate basic arithmetic using numbers and + - * / ( ) .',
    parameters: [
      { name: 'expression', type: 'string', description: 'math expression', required: true },
    ],
    handler: async ({ expression }: { expression: string }) => {
      if (!/^[0-9+\-*/().\s]+$/.test(expression))
        return { error: 'Only numbers and + - * / ( ) are allowed.' };
      try {
        const result = Function('"use strict"; return (' + expression + ');')() as number;
        return { expression, result };
      } catch {
        return { error: 'Could not evaluate that expression.' };
      }
    },
  });
  useCopilotAction({
    name: 'getCurrentDateTime',
    description: 'Get the current date and time.',
    parameters: [],
    handler: async () => {
      const now = new Date();
      return { iso: now.toISOString(), readable: now.toString() };
    },
  });
}
