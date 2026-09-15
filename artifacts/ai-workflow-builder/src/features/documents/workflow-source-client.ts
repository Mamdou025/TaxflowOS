import { apiFetch } from '@/platform/auth/api-fetch';
import { parseUploadToRows } from '@/shared/workflow-engine/runtime/workflow-runs/parse-upload';
import type { UploadedSource } from '@/shared/stores/workspace-store';

export type WorkflowSourceDocument = {
  id: string;
  fileName: string;
  mimeType: string | null;
  status: string;
  lifecycleStatus: string;
  sourceRevision: number;
  contentHash?: string | null;
  sizeBytes?: number | null;
};

export function isWorkflowSource(document: WorkflowSourceDocument) {
  return (
    document.lifecycleStatus === 'active' &&
    document.status !== 'uploading' &&
    /\.(xlsx|xls|json)$/i.test(document.fileName)
  );
}

export async function loadWorkflowSource(id: string): Promise<UploadedSource> {
  const response = await apiFetch(`/api/documents/${encodeURIComponent(id)}`, {
    signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new Error('This source is unavailable or you no longer have access.');
  const { document, downloadUrl } = (await response.json()) as {
    document: WorkflowSourceDocument;
    downloadUrl: string | null;
  };
  if (!isWorkflowSource(document))
    throw new Error('Choose an active Excel or JSON source with a completed upload.');
  if (!Number.isInteger(document.sourceRevision) || document.sourceRevision < 1)
    throw new Error('The source revision could not be verified. Please reload Sources.');
  if (!downloadUrl) throw new Error('The original source file is unavailable. Please retry.');
  if (document.sizeBytes && document.sizeBytes > 20 * 1024 * 1024)
    throw new Error('Use a source file smaller than 20 MB.');
  const download = await apiFetch(downloadUrl, { signal: AbortSignal.timeout(60000) });
  if (!download.ok) throw new Error('Could not download the selected source. Please retry.');
  const bytes = await download.arrayBuffer();
  const digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
  const file = new File([bytes], document.fileName, {
    type: document.mimeType ?? 'application/octet-stream',
  });
  const parsed = await parseUploadToRows(file);
  return {
    ...parsed,
    at: Date.now(),
    sourceId: document.id,
    sourceRevision: document.sourceRevision,
    contentHash: `sha256:${digest}`,
    rows: parsed.rows.map((row) => ({
      ...row,
      sourceDocumentId: document.id,
      sourceRevision: document.sourceRevision,
      sourceFileHash: `sha256:${digest}`,
      sourceContentHash: document.contentHash,
      sourceFileName: document.fileName,
    })),
  };
}
