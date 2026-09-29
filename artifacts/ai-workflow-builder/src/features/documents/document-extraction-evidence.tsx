import { useState } from 'react';
import { DocumentExtractionSchema } from '@workspace/workflow-contracts/generated-schemas';
import type { DocumentExtraction } from '@workspace/workflow-contracts/domain/document-extraction';
import { apiFetch } from '@/platform/auth/api-fetch';
import { ReadableData } from '@/features/workflow-builder/ui/workspace/readable-data';

export function DocumentExtractionEvidence({ value }: { value: unknown }) {
  const [error, setError] = useState('');
  const parsed = DocumentExtractionSchema.array().safeParse(value);
  if (!parsed.success || !parsed.data.length) return null;
  const download = async (extraction: DocumentExtraction) => {
    try {
      setError('');
      const metadata = await apiFetch(
        `/api/documents/${encodeURIComponent(extraction.originalDocumentId!)}`,
        { signal: AbortSignal.timeout(30000) },
      );
      if (!metadata.ok) throw new Error('The original is unavailable or access was denied.');
      const { downloadUrl } = await metadata.json();
      if (typeof downloadUrl !== 'string') throw new Error('The original file is unavailable.');
      const response = await apiFetch(downloadUrl, { signal: AbortSignal.timeout(120000) });
      if (!response.ok) throw new Error('Could not download the original.');
      const bytes = await response.arrayBuffer();
      const hash = `sha256:${Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), (byte) => byte.toString(16).padStart(2, '0')).join('')}`;
      if (hash !== extraction.contentHash)
        throw new Error(
          'The stored file differs from this recorded extraction. No replacement was displayed.',
        );
      const url = URL.createObjectURL(new Blob([bytes]));
      const link = document.createElement('a');
      link.href = url;
      link.download = extraction.fileName;
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Original unavailable.');
    }
  };
  return (
    <section aria-label="Document evidence" className="space-y-3 rounded border p-3">
      <h4 className="font-medium">Document evidence</h4>
      {parsed.data.map((extraction) => (
        <div key={`${extraction.id}:${extraction.revision}`} className="space-y-2">
          <p>
            {extraction.fileName} · source revision {extraction.revision} ·{' '}
            {extraction.method.replaceAll('_', ' ')}
          </p>
          <p className="text-xs break-all">
            Source {extraction.id} · {extraction.contentHash}
          </p>
          {extraction.originalDocumentId ? (
            <button className="underline text-sm" onClick={() => void download(extraction)}>
              Download original: {extraction.fileName}
            </button>
          ) : (
            <p className="text-sm">Original file not confirmed saved in Sources.</p>
          )}
          {extraction.issues.map((issue, index) => (
            <p key={index} className="text-sm text-amber-700">
              {issue.message}
            </p>
          ))}
          {extraction.segments.map((segment) => (
            <details key={segment.id}>
              <summary>{segment.location}</summary>
              <p className="text-xs">
                Evidence {extraction.id}:r{extraction.revision}:{segment.id}
              </p>
              <pre className="whitespace-pre-wrap text-sm">
                {segment.text || 'No extractable text at this location.'}
              </pre>
            </details>
          ))}
          {extraction.rows.length > 0 && (
            <details>
              <summary>{extraction.rows.length} captured records</summary>
              <ReadableData value={extraction.rows} />
            </details>
          )}
        </div>
      ))}
      {error && <p role="alert">{error}</p>}
    </section>
  );
}
