import type { DocumentExtraction } from '@workspace/workflow-contracts/domain/document-extraction';
import { createDocument, getDocument, updateDocument } from '../rag/documents-repo';
import { enqueueIngest } from '../rag/ingest-queue';
import { createSignedUploadUrl, isStorageConfigured, STORAGE_BUCKET } from '../storage';
import { queueStoredSourceIndexing } from './source-indexing-status';

/** Same original-file preservation policy as the InScope capture adapter. Never claim storage on failure. */
export async function preserveSourceOriginal(
  actor: { userId: string; workspaceId: string },
  id: string,
  bytes: Buffer,
  fileName: string,
  mimeType: string,
  extraction: DocumentExtraction,
) {
  if (!isStorageConfigured()) {
    extraction.issues.push({
      code: 'ORIGINAL_NOT_STORED',
      message:
        'The extracted evidence is retained in this run. Original-file storage is not configured; keep your original file.',
    });
    return;
  }
  const key = `${actor.workspaceId}/${id}/${fileName.replace(/[^A-Za-z0-9._-]+/g, '_').slice(0, 200) || 'document'}`;
  try {
    const existing = await getDocument(actor.workspaceId, id);
    if (existing?.contentHash === extraction.contentHash) {
      extraction.originalDocumentId = id;
      return;
    }
    if (!existing)
      await createDocument({
        id,
        userId: actor.userId,
        workspaceId: actor.workspaceId,
        fileName,
        mimeType,
        sizeBytes: bytes.length,
        storageBucket: STORAGE_BUCKET,
        storageKey: key,
        status: 'uploading',
      });
    const upload = await createSignedUploadUrl(key);
    const response = await fetch(upload.uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': mimeType || 'application/octet-stream' },
      body: Uint8Array.from(bytes),
      signal: AbortSignal.timeout(30000),
    });
    if (!response.ok) throw new Error('Original upload failed.');
    const saved = await updateDocument(actor.workspaceId, id, {
      status: 'processing',
      contentHash: extraction.contentHash,
      extractedChars: extraction.segments.reduce(
        (total, segment) => total + segment.text.length,
        0,
      ),
    });
    if (!saved) throw new Error('Original metadata could not be saved.');
    extraction.originalDocumentId = id;
    await queueStoredSourceIndexing(extraction, {
      enqueue: () => enqueueIngest(actor.workspaceId, id, actor.userId),
      markFailed: () =>
        updateDocument(actor.workspaceId, id, {
          status: 'failed',
          error: 'The original was stored, but search indexing could not be queued.',
        }),
    });
  } catch {
    extraction.issues.push({
      code: 'ORIGINAL_NOT_STORED',
      message:
        'The extracted evidence is retained, but original-file storage could not be confirmed. Keep your original file.',
    });
  }
}
