

// ─────────────────────────────────────────────────────────────────────────────
// uploadDocument — the client side of storing a large company document.
//
//   1. ask the server for a signed direct-upload URL (creates the metadata row)
//   2. PUT the raw bytes straight to Supabase Storage (bypasses Vercel's 4.5 MB
//      serverless body limit — the file never transits our API)
//   3. tell the server the upload is complete (kicks off RAG ingestion in Phase 3)
//
// Returns the new document id, or an { error } the caller can surface. Never throws.
// ─────────────────────────────────────────────────────────────────────────────

export type UploadResult =
  | { documentId: string; error?: undefined }
  | { documentId?: undefined; error: string };

export async function uploadDocument(
  file: File,
  opts: { clientId?: string | null; onProgress?: (phase: "signing" | "uploading" | "finalizing") => void } = {}
): Promise<UploadResult> {
  try {
    opts.onProgress?.("signing");
    const signRes = await fetch("/api/documents/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        mimeType: file.type || null,
        sizeBytes: file.size,
        clientId: opts.clientId ?? null,
      }),
    });
    if (!signRes.ok) {
      const body = (await signRes.json().catch(() => ({}))) as { error?: string };
      if (signRes.status === 401) return { error: "Sign in to store documents." };
      if (body.error === "STORAGE_NOT_CONFIGURED")
        return { error: "Document storage isn't configured yet." };
      return { error: body.error ?? "Couldn't start the upload." };
    }
    const { documentId, uploadUrl } = (await signRes.json()) as {
      documentId: string;
      uploadUrl: string;
    };

    opts.onProgress?.("uploading");
    const putRes = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "content-type": file.type || "application/octet-stream",
        "x-upsert": "true",
      },
    });
    if (!putRes.ok) return { error: "Upload to storage failed." };

    opts.onProgress?.("finalizing");
    await fetch(`/api/documents/${documentId}/complete`, { method: "POST" });

    return { documentId };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Upload failed." };
  }
}
