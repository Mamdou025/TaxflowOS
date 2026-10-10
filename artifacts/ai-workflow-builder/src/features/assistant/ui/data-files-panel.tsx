import { useMemo, useState } from 'react';
import { useAgent } from '@copilotkit/react-core/v2';
import { ExternalLink, FileText, Globe } from 'lucide-react';
import { apiFetch } from '@/platform/auth/api-fetch';
import { buildToolCallInfo } from '../workspace/tool-receipt';

type ChatDoc = {
  key: string;
  fileName: string;
  documentId?: string;
  revision?: number;
  passages: number;
  bestSim: number;
};
type ChatWeb = { url: string; title: string; scope: string };
function record(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}
function parseResult(value: unknown): Record<string, unknown> | null {
  if (typeof value !== 'string') return record(value);
  try {
    return record(JSON.parse(value));
  } catch {
    return null;
  }
}
function safeWebUrl(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? value : null;
  } catch {
    return null;
  }
}
function domainOf(url: string): string {
  return new URL(url).hostname.replace(/^www\./, '');
}

/** Historical evidence comes from receipts, never from the current selected-source count. */
function deriveChatTrace(messages: ReturnType<typeof useAgent>['agent']['messages']) {
  const toolCallInfo = buildToolCallInfo(messages);
  const docs = new Map<string, ChatDoc>();
  const web = new Map<string, ChatWeb>();
  for (const message of messages) {
    if (message.role !== 'tool') continue;
    const call = toolCallInfo.get(message.toolCallId);
    const result = parseResult(message.content);
    if (!call || !result) continue;
    if (call.name === 'searchCompanyDocuments' && Array.isArray(result.passages)) {
      for (const value of result.passages) {
        const passage = record(value);
        if (!passage) continue;
        const fileName =
          typeof passage.source === 'string'
            ? passage.source
            : typeof passage.fileName === 'string'
              ? passage.fileName
              : 'Document';
        const documentId =
          typeof passage.sourceId === 'string'
            ? passage.sourceId
            : typeof passage.documentId === 'string'
              ? passage.documentId
              : undefined;
        const revision = typeof passage.revision === 'number' ? passage.revision : undefined;
        const key = JSON.stringify([documentId ?? fileName, revision ?? null]);
        const similarity = typeof passage.similarity === 'number' ? passage.similarity : 0;
        const existing = docs.get(key);
        if (existing) {
          existing.passages += 1;
          existing.bestSim = Math.max(existing.bestSim, similarity);
        } else
          docs.set(key, { key, fileName, documentId, revision, passages: 1, bestSim: similarity });
      }
    } else if (
      (call.name === 'searchWeb' || call.name === 'searchCanadianTax') &&
      Array.isArray(result.results)
    ) {
      for (const value of result.results) {
        const found = record(value);
        const url = safeWebUrl(found?.url);
        if (!found || !url || web.has(url)) continue;
        web.set(url, {
          url,
          title: typeof found.title === 'string' ? found.title : url,
          scope: call.name === 'searchCanadianTax' ? 'CA tax' : 'Web',
        });
      }
    } else if (call.name === 'fetchWebPage') {
      const url = safeWebUrl(result.url) ?? safeWebUrl(record(call.args)?.url);
      if (url && !web.has(url)) web.set(url, { url, title: url, scope: 'Read' });
    }
  }
  return { docs: [...docs.values()], web: [...web.values()] };
}

/** Evidence only: workspace Library management remains on Sources. */
export function ChatEvidence() {
  const { agent } = useAgent();
  const messages = agent.messages;
  const trace = useMemo(() => deriveChatTrace(messages), [messages, messages.length]);
  const [error, setError] = useState('');
  const openDocument = async (source: ChatDoc) => {
    if (!source.documentId) return;
    setError('');
    try {
      const response = await apiFetch(`/api/documents/${encodeURIComponent(source.documentId)}`);
      if (!response.ok) throw new Error('This source is unavailable or you no longer have access.');
      const data = (await response.json()) as {
        document?: { sourceRevision?: number };
        downloadUrl?: string | null;
      };
      if (source.revision !== undefined && data.document?.sourceRevision !== source.revision)
        throw new Error(
          `This evidence refers to revision ${source.revision}. The saved source has changed; its current file is not that revision.`,
        );
      const url = safeWebUrl(data.downloadUrl);
      if (!url) throw new Error('This source has no available download.');
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not open this source.');
    }
  };
  return (
    <details className="chat-scope-disclosure" aria-label="Evidence used in this conversation">
      <summary>
        Evidence used in this conversation{' '}
        <span className="chat-scope-count">{trace.docs.length + trace.web.length}</span>
      </summary>
      <p className="chat-scope-note">
        Documents and web pages retrieved in earlier replies. This history does not add them to your
        current selections.
      </p>
      {!trace.docs.length && !trace.web.length && (
        <p className="chat-scope-empty">No retrieved evidence yet.</p>
      )}
      {trace.docs.map((source) => (
        <div className="chat-scope-evidence-row" key={source.key}>
          <FileText size={15} />
          <div>
            {source.documentId ? (
              <button type="button" onClick={() => void openDocument(source)}>
                {source.fileName} <ExternalLink size={12} />
              </button>
            ) : (
              <strong>{source.fileName}</strong>
            )}
            <p className="chat-scope-note">
              {source.revision !== undefined ? `Revision ${source.revision} · ` : ''}
              {source.passages} passage{source.passages === 1 ? '' : 's'}
              {source.bestSim
                ? ` · ${Math.round(Math.max(0, Math.min(1, source.bestSim)) * 100)}% match`
                : ''}
            </p>
          </div>
        </div>
      ))}
      {trace.web.map((source) => (
        <div className="chat-scope-evidence-row" key={source.url}>
          <Globe size={15} />
          <div>
            <a href={source.url} target="_blank" rel="noopener noreferrer">
              {source.title} <ExternalLink size={12} />
            </a>
            <p className="chat-scope-note">
              {domainOf(source.url)} · {source.scope}
            </p>
          </div>
        </div>
      ))}
      {error && (
        <p role="alert" className="chat-scope-error">
          {error}
        </p>
      )}
    </details>
  );
}
