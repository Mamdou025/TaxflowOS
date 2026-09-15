// ─────────────────────────────────────────────────────────────────────────────
// Company documents API — the backend the Documents Library + Sina's
// searchCompanyDocuments tool call. Mounted at /api/documents.
//
//   GET    /api/documents?clientId=          → the user's stored documents
//   POST   /api/documents/upload-url         → signed direct-upload URL (+ metadata row)
//   POST   /api/documents/:id/complete       → bytes landed → kick off RAG ingestion
//   GET    /api/documents/:id                → { document, downloadUrl (signed) }
//   DELETE /api/documents/:id                → move the source to recoverable deletion
//   POST   /api/documents/search  { query }  → nearest chunks (RAG retrieval)
//
// Ported from the web app's Next.js routes (app/api/documents/**) into Express.
// The RAG/storage internals live in src/lib/{storage,rag}. app.ts checks the session
// and workspace role; resource queries use req.workspaceId. Retrieval failures are
// returned explicitly so callers cannot confuse an outage with an empty search.
// ─────────────────────────────────────────────────────────────────────────────

import { Router, type Request, type Response } from 'express';
import { customAlphabet } from 'nanoid';
import {
  createDocument,
  getDocument,
  listDocuments,
  purgeDocument,
  setDocumentLifecycle,
  SourceContentPurgeError,
  updateDocument,
} from '../lib/rag/documents-repo';
import { enqueueIngest } from '../lib/rag/ingest-queue';
import { searchChunks } from '../lib/rag/retrieve';
import {
  createSignedDownloadUrl,
  createSignedUploadUrl,
  deleteObject,
  isStorageConfigured,
  STORAGE_BUCKET,
} from '../lib/storage';
import {
  SourceLifecycleError,
  transitionSource,
  type SourceLifecycleAction,
  type SourceRetrievalPolicy,
} from '@workspace/source-core';

const generateId = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 21);
const router = Router();

/** Reduce a filename to a safe single storage-key segment (keeps the extension). */
function safeName(name: string): string {
  const cleaned = name.replace(/[^A-Za-z0-9._-]+/g, '_').replace(/^_+|_+$/g, '');
  return cleaned.slice(0, 200) || 'document';
}

/** Serialize a document row's Date columns to ISO strings for the JSON client. */
function serialize<T extends { createdAt?: Date | null; updatedAt?: Date | null }>(row: T) {
  return {
    ...row,
    createdAt: row.createdAt?.toISOString() ?? null,
    updatedAt: row.updatedAt?.toISOString() ?? null,
  };
}

// GET /api/documents?clientId= — the user's stored documents, newest first.
router.get('/', async (req, res) => {
  const clientId = typeof req.query.clientId === 'string' ? req.query.clientId : null;
  const includeDeleted = req.query.includeDeleted === 'true';
  if (includeDeleted && req.workspaceRole !== 'owner') {
    res.status(403).json({ ok: false, error: 'OWNER_REQUIRED' });
    return;
  }
  const documents = await listDocuments(req.workspaceId, { clientId, includeDeleted });
  res.json({ documents: documents.map(serialize) });
});

// POST /api/documents/upload-url — signed direct-upload URL + create the metadata row.
router.post('/upload-url', async (req, res) => {
  if (!isStorageConfigured()) {
    res.status(503).json({ ok: false, error: 'STORAGE_NOT_CONFIGURED' });
    return;
  }

  const body = (req.body ?? {}) as {
    fileName?: unknown;
    mimeType?: unknown;
    sizeBytes?: unknown;
    clientId?: unknown;
  };
  const fileName = typeof body.fileName === 'string' ? body.fileName.trim() : '';
  if (!fileName || fileName.length > 500) {
    res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
    return;
  }
  const mimeType = typeof body.mimeType === 'string' ? body.mimeType : null;
  const sizeBytes =
    typeof body.sizeBytes === 'number' && Number.isFinite(body.sizeBytes)
      ? Math.max(0, Math.trunc(body.sizeBytes))
      : null;
  const clientId = typeof body.clientId === 'string' ? body.clientId : null;

  const id = generateId();
  const key = `${req.workspaceId}/${id}/${safeName(fileName)}`;

  let upload: { uploadUrl: string; token: string; key: string };
  try {
    upload = await createSignedUploadUrl(key);
  } catch (err) {
    req.log.error({ err }, '[documents] signed upload url failed');
    res.status(502).json({ ok: false, error: 'STORAGE_ERROR' });
    return;
  }

  await createDocument({
    id,
    userId: req.userId,
    workspaceId: req.workspaceId,
    clientId,
    fileName,
    mimeType,
    sizeBytes,
    storageBucket: STORAGE_BUCKET,
    storageKey: key,
    status: 'uploading',
  });
  res.json({
    ok: true,
    documentId: id,
    uploadUrl: upload.uploadUrl,
    token: upload.token,
    key,
  });
});

// POST /api/documents/search — embed the query, return nearest chunks (RAG).
router.post('/search', async (req, res) => {
  const body = (req.body ?? {}) as {
    query?: unknown;
    clientId?: unknown;
    k?: unknown;
    selectedSourceIds?: unknown;
    policy?: unknown;
  };
  const query = typeof body.query === 'string' ? body.query.trim() : '';
  if (!query || query.length > 2000) {
    res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
    return;
  }
  const clientId = typeof body.clientId === 'string' ? body.clientId : null;
  const k =
    typeof body.k === 'number' && Number.isFinite(body.k)
      ? Math.min(20, Math.max(1, Math.trunc(body.k)))
      : undefined;
  const policy: SourceRetrievalPolicy =
    body.policy === 'selected-only' ? 'selected-only' : 'selected-and-authorized';
  if (
    body.policy !== undefined &&
    body.policy !== 'selected-only' &&
    body.policy !== 'selected-and-authorized'
  ) {
    res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
    return;
  }
  const selectedSourceIds = Array.isArray(body.selectedSourceIds)
    ? [...new Set(body.selectedSourceIds)]
    : [];
  if (
    selectedSourceIds.length > 50 ||
    selectedSourceIds.some(
      (sourceId) => typeof sourceId !== 'string' || !sourceId || sourceId.length > 128,
    )
  ) {
    res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
    return;
  }

  const result = await searchChunks(req.workspaceId, query, {
    clientId,
    k,
    policy,
    selectedSourceIds: selectedSourceIds as string[],
  });
  res.status(result.status === 'unavailable' ? 503 : 200).json({
    ok: result.status !== 'unavailable',
    ...result,
  });
});

// POST /api/documents/:id/complete — bytes landed → enqueue durable processing.
router.post('/:documentId/complete', async (req, res) => {
  const { documentId } = req.params;
  const doc = await getDocument(req.workspaceId, documentId);
  if (!doc) {
    res.status(404).json({ ok: false, error: 'NOT_FOUND' });
    return;
  }

  // Durably enqueue processing, then mark the document `processing`. The ingest
  // worker (in-process, or a separate dyno) claims the job and survives restarts —
  // the old fire-and-forget path lost the work on any deploy/crash. The client
  // keeps polling GET /api/documents until the status settles.
  try {
    const ingestJobId = await enqueueIngest(req.workspaceId, documentId, req.userId);
    await updateDocument(req.workspaceId, documentId, { status: 'processing', error: null });
    req.log.info({ documentId, ingestJobId }, 'Document ingestion queued');
    res.json({ ok: true, status: 'processing' });
  } catch (err) {
    req.log.error({ err, documentId }, '[documents] failed to enqueue ingestion');
    await updateDocument(req.workspaceId, documentId, {
      status: 'failed',
      error: 'Could not queue processing — please retry.',
    });
    res.status(503).json({ ok: false, error: 'ENQUEUE_FAILED' });
  }
});

// GET /api/documents/:id — the row + a short-lived signed download URL.
router.get('/:documentId', async (req, res) => {
  const { documentId } = req.params;
  const document = await getDocument(req.workspaceId, documentId);
  if (!document) {
    res.status(404).json({ ok: false, error: 'NOT_FOUND' });
    return;
  }

  let downloadUrl: string | null = null;
  try {
    downloadUrl = document.storageKey ? await createSignedDownloadUrl(document.storageKey) : null;
  } catch (err) {
    req.log.error({ err }, '[documents] signed download url failed');
  }

  res.json({ ok: true, document: serialize(document), downloadUrl });
});

// PATCH /api/documents/:id — toggle whether the doc is in Sina's Library (the
// searchable active context). Only `inLibrary` is patchable here; the row still
// lives in the repository either way — this just controls what the RAG tool sees.
router.patch('/:documentId', async (req, res) => {
  const { documentId } = req.params;
  const body = (req.body ?? {}) as { inLibrary?: unknown };
  if (typeof body.inLibrary !== 'boolean') {
    res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
    return;
  }
  const row = await updateDocument(req.workspaceId, documentId, { inLibrary: body.inLibrary });
  if (!row) {
    res.status(404).json({ ok: false, error: 'NOT_FOUND' });
    return;
  }
  res.json({ ok: true, document: serialize(row) });
});

async function applyLifecycleAction(req: Request, res: Response, action: SourceLifecycleAction) {
  const rawDocumentId = req.params.documentId;
  const documentId = Array.isArray(rawDocumentId) ? rawDocumentId[0] : rawDocumentId;
  if (!documentId) {
    res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
    return;
  }
  const current = await getDocument(req.workspaceId, documentId, { includeDeleted: true });
  if (!current) {
    res.status(404).json({ ok: false, error: 'NOT_FOUND' });
    return;
  }
  let target: ReturnType<typeof transitionSource>;
  try {
    target = transitionSource(req.workspaceRole, current.lifecycleStatus, action);
  } catch (error) {
    if (error instanceof SourceLifecycleError) {
      res.status(error.code === 'FORBIDDEN' ? 403 : 409).json({ ok: false, error: error.code });
      return;
    }
    throw error;
  }
  if (target === 'purged') {
    try {
      const purged = await purgeDocument(req.workspaceId, documentId, deleteObject);
      if (!purged) {
        res.status(409).json({ ok: false, error: 'LIFECYCLE_CONFLICT' });
        return;
      }
      res.json({ ok: true, document: serialize(purged) });
      return;
    } catch (err) {
      if (err instanceof SourceContentPurgeError) {
        req.log.error({ err: err.cause, documentId }, '[documents] object purge failed');
        res.status(502).json({ ok: false, error: 'CONTENT_PURGE_FAILED' });
        return;
      }
      throw err;
    }
  }
  if (current.lifecycleStatus === target) {
    res.json({ ok: true, document: serialize(current) });
    return;
  }
  const updated = await setDocumentLifecycle(
    req.workspaceId,
    documentId,
    current.lifecycleStatus,
    target,
  );
  if (!updated) {
    res.status(409).json({ ok: false, error: 'LIFECYCLE_CONFLICT' });
    return;
  }
  res.json({ ok: true, document: serialize(updated) });
}

// POST /api/documents/:id/lifecycle — archive, restore, delete or permanently purge.
router.post('/:documentId/lifecycle', async (req, res) => {
  const action = (req.body as { action?: unknown } | undefined)?.action;
  if (!['archive', 'delete', 'restore', 'purge'].includes(String(action))) {
    res.status(400).json({ ok: false, error: 'INVALID_INPUT' });
    return;
  }
  await applyLifecycleAction(req, res, action as SourceLifecycleAction);
});

// DELETE remains a compatibility alias for recoverable deletion.
router.delete('/:documentId', async (req, res) => {
  await applyLifecycleAction(req, res, 'delete');
});

export default router;
