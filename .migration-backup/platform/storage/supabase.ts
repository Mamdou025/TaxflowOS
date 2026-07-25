import "server-only";

// ─────────────────────────────────────────────────────────────────────────────
// Supabase Storage — server-only client for large company-document bytes.
//
// The raw files live in a PRIVATE bucket; Postgres holds only metadata + the
// storage key (platform/db/schema.ts → documents). This module brokers access
// with the SERVICE-ROLE key (bypasses RLS) — it must never be imported client-side.
//
//   • createSignedUploadUrl(key)  → a direct browser→Storage upload URL. Large
//     files skip the Vercel 4.5 MB serverless body limit entirely.
//   • createSignedDownloadUrl(key) → a short-lived read URL for the viewer.
//   • downloadObject(key)          → bytes, for server-side extraction/RAG.
//   • deleteObject(key)            → remove the object.
//
// FAIL-SOFT: if SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY are unset, isStorageConfigured()
// is false and the mutating helpers throw a clear StorageNotConfiguredError the
// routes turn into a 503 — the rest of the app is unaffected.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** The private bucket that holds document bytes. Override via env. */
export const STORAGE_BUCKET =
  process.env.SUPABASE_STORAGE_BUCKET || "company-documents";

export class StorageNotConfiguredError extends Error {
  constructor() {
    super(
      "Supabase Storage is not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
    this.name = "StorageNotConfiguredError";
  }
}

export function isStorageConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);
}

// HMR-safe singleton (mirrors platform/db/index.ts).
const globalForStorage = globalThis as unknown as {
  supabaseAdmin: SupabaseClient | undefined;
};

function admin(): SupabaseClient {
  if (!(SUPABASE_URL && SERVICE_ROLE_KEY)) throw new StorageNotConfiguredError();
  const client =
    globalForStorage.supabaseAdmin ??
    createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  if (process.env.NODE_ENV !== "production") {
    globalForStorage.supabaseAdmin = client;
  }
  return client;
}

/**
 * A signed URL the browser PUTs the file bytes to directly. The token is embedded
 * in the URL, so no service key touches the client. Returns an absolute URL.
 */
export async function createSignedUploadUrl(
  key: string
): Promise<{ uploadUrl: string; token: string; key: string }> {
  const { data, error } = await admin()
    .storage.from(STORAGE_BUCKET)
    .createSignedUploadUrl(key);
  if (error || !data) {
    throw error ?? new Error("Failed to create signed upload URL");
  }
  // data.signedUrl is a path like "/object/upload/sign/<bucket>/<key>?token=…".
  const uploadUrl = data.signedUrl.startsWith("http")
    ? data.signedUrl
    : `${SUPABASE_URL}/storage/v1${data.signedUrl}`;
  return { uploadUrl, token: data.token, key: data.path ?? key };
}

/** A short-lived signed URL to READ an object (viewer, downloads). */
export async function createSignedDownloadUrl(
  key: string,
  expiresInSeconds = 60 * 10
): Promise<string> {
  const { data, error } = await admin()
    .storage.from(STORAGE_BUCKET)
    .createSignedUrl(key, expiresInSeconds);
  if (error || !data) {
    throw error ?? new Error("Failed to create signed download URL");
  }
  return data.signedUrl;
}

/** Download an object's bytes for server-side processing (extraction/RAG). */
export async function downloadObject(key: string): Promise<Uint8Array> {
  const { data, error } = await admin()
    .storage.from(STORAGE_BUCKET)
    .download(key);
  if (error || !data) {
    throw error ?? new Error("Failed to download object");
  }
  return new Uint8Array(await data.arrayBuffer());
}

/** Remove an object (best-effort — a missing object is not an error). */
export async function deleteObject(key: string): Promise<void> {
  const { error } = await admin().storage.from(STORAGE_BUCKET).remove([key]);
  if (error) throw error;
}
