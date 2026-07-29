// ─────────────────────────────────────────────────────────────────────────────
// Company documents API — the backend the Documents Library + Sina's
// searchCompanyDocuments tool call. Mounted at /api/documents.
//
//   GET    /api/documents?clientId=          → the user's stored documents
//   POST   /api/documents/upload-url         → signed direct-upload URL (+ metadata row)
//   POST   /api/documents/:id/complete       → bytes landed → kick off RAG ingestion
//   GET    /api/documents/:id                → { document, downloadUrl (signed) }
//   DELETE /api/documents/:id                → remove the row (+ chunks) + the object
//   POST   /api/documents/search  { query }  → nearest chunks (RAG retrieval)
//
// Ported from the web app's Next.js routes (app/api/documents/**) into Express.
// The RAG/storage internals live in src/lib/{storage,rag}. Scoped to req.userId
// (currently the anonymous user, like the rest of the api-server — re-add a session
// gate here when real auth lands). FAIL-SOFT throughout: no storage / no DB / no
// embeddings degrades gracefully rather than 500-ing the app.
// ─────────────────────────────────────────────────────────────────────────────

import { Router } from "express";
import { customAlphabet } from "nanoid";
import {
  createDocument,
  deleteDocument,
  getDocument,
  listDocuments,
  updateDocument,
} from "../lib/rag/documents-repo";
import { ingestDocument } from "../lib/rag/ingest";
import { searchChunks } from "../lib/rag/retrieve";
import {
  createSignedDownloadUrl,
  createSignedUploadUrl,
  deleteObject,
  isStorageConfigured,
  STORAGE_BUCKET,
} from "../lib/storage";

const generateId = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 21);
const router = Router();

/** Reduce a filename to a safe single storage-key segment (keeps the extension). */
function safeName(name: string): string {
  const cleaned = name.replace(/[^A-Za-z0-9._-]+/g, "_").replace(/^_+|_+$/g, "");
  return cleaned.slice(0, 200) || "document";
}

/** Serialize a document row's Date columns to ISO strings for the JSON client. */
function serialize<T extends { createdAt?: Date | null; updatedAt?: Date | null }>(
  row: T,
) {
  return {
    ...row,
    createdAt: row.createdAt?.toISOString() ?? null,
    updatedAt: row.updatedAt?.toISOString() ?? null,
  };
}

// GET /api/documents?clientId= — the user's stored documents, newest first.
router.get("/", async (req, res) => {
  const clientId = typeof req.query.clientId === "string" ? req.query.clientId : null;
  const documents = await listDocuments(req.userId, { clientId });
  res.json({ documents: documents.map(serialize) });
});

// POST /api/documents/upload-url — signed direct-upload URL + create the metadata row.
router.post("/upload-url", async (req, res) => {
  if (!isStorageConfigured()) {
    res.status(503).json({ ok: false, error: "STORAGE_NOT_CONFIGURED" });
    return;
  }

  const body = (req.body ?? {}) as {
    fileName?: unknown;
    mimeType?: unknown;
    sizeBytes?: unknown;
    clientId?: unknown;
  };
  const fileName = typeof body.fileName === "string" ? body.fileName.trim() : "";
  if (!fileName || fileName.length > 500) {
    res.status(400).json({ ok: false, error: "INVALID_INPUT" });
    return;
  }
  const mimeType = typeof body.mimeType === "string" ? body.mimeType : null;
  const sizeBytes =
    typeof body.sizeBytes === "number" && Number.isFinite(body.sizeBytes)
      ? Math.max(0, Math.trunc(body.sizeBytes))
      : null;
  const clientId = typeof body.clientId === "string" ? body.clientId : null;

  const id = generateId();
  const key = `${req.userId}/${id}/${safeName(fileName)}`;

  let upload: { uploadUrl: string; token: string; key: string };
  try {
    upload = await createSignedUploadUrl(key);
  } catch (err) {
    req.log.error({ err }, "[documents] signed upload url failed");
    res.status(502).json({ ok: false, error: "STORAGE_ERROR" });
    return;
  }

  const row = await createDocument({
    id,
    userId: req.userId,
    clientId,
    fileName,
    mimeType,
    sizeBytes,
    storageBucket: STORAGE_BUCKET,
    storageKey: key,
    status: "uploading",
  });
  if (!row) {
    res.status(503).json({ ok: false, error: "STORAGE_UNAVAILABLE" });
    return;
  }

  res.json({
    ok: true,
    documentId: id,
    uploadUrl: upload.uploadUrl,
    token: upload.token,
    key,
  });
});

// POST /api/documents/search — embed the query, return nearest chunks (RAG).
router.post("/search", async (req, res) => {
  const body = (req.body ?? {}) as { query?: unknown; clientId?: unknown; k?: unknown };
  const query = typeof body.query === "string" ? body.query.trim() : "";
  if (!query || query.length > 2000) {
    res.status(400).json({ ok: false, error: "INVALID_INPUT" });
    return;
  }
  const clientId = typeof body.clientId === "string" ? body.clientId : null;
  const k =
    typeof body.k === "number" && Number.isFinite(body.k)
      ? Math.min(20, Math.max(1, Math.trunc(body.k)))
      : undefined;

  const passages = await searchChunks(req.userId, query, { clientId, k });
  res.json({ ok: true, passages });
});

// POST /api/documents/:id/complete — bytes landed → mark processing + ingest.
router.post("/:documentId/complete", async (req, res) => {
  const { documentId } = req.params;
  const doc = await getDocument(req.userId, documentId);
  if (!doc) {
    res.status(404).json({ ok: false, error: "NOT_FOUND" });
    return;
  }

  // Mark processing now; ingest AFTER responding (fire-and-forget) so the client
  // isn't blocked — it polls GET /api/documents until the status settles.
  await updateDocument(req.userId, documentId, { status: "processing", error: null });
  res.json({ ok: true, status: "processing" });

  void ingestDocument(req.userId, documentId).catch((err) => {
    req.log.error({ err, documentId }, "[documents] background ingestion failed");
  });
});

// GET /api/documents/:id — the row + a short-lived signed download URL.
router.get("/:documentId", async (req, res) => {
  const { documentId } = req.params;
  const document = await getDocument(req.userId, documentId);
  if (!document) {
    res.status(404).json({ ok: false, error: "NOT_FOUND" });
    return;
  }

  let downloadUrl: string | null = null;
  try {
    downloadUrl = await createSignedDownloadUrl(document.storageKey);
  } catch (err) {
    req.log.error({ err }, "[documents] signed download url failed");
  }

  res.json({ ok: true, document: serialize(document), downloadUrl });
});

// DELETE /api/documents/:id — remove the row (+ chunks by cascade) + the object.
router.delete("/:documentId", async (req, res) => {
  const { documentId } = req.params;
  const row = await deleteDocument(req.userId, documentId);
  if (row) {
    try {
      await deleteObject(row.storageKey);
    } catch (err) {
      req.log.error({ err }, "[documents] object delete failed");
    }
  }
  res.json({ ok: Boolean(row) });
});

export default router;
