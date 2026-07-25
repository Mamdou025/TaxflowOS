// @ts-nocheck — server-only file; not compiled in the Vite frontend build.


import { and, eq } from "drizzle-orm";
import { db } from "@/platform/db";
import { accounts } from "@/platform/db/schema";

// ─────────────────────────────────────────────────────────────────────────────
// Google Drive + Gmail access, built on the Google OAuth tokens better-auth
// already stores in the `accounts` table (provider "google"). We add the
// read-only Drive/Gmail scopes on the provider (lib/auth.ts); this module reads
// the stored token, refreshes it when expired, and exposes thin Drive/Gmail
// helpers. No `googleapis` dependency — plain fetch against the REST APIs.
//
// Downloads return RAW workbook bytes on purpose: the client wraps them in a
// File and runs the SAME parser as a local upload (lib/workflow-runs/parse-
// upload.ts), so a Drive/Gmail workbook and a disk workbook produce identical
// rows and identical numbers.
// ─────────────────────────────────────────────────────────────────────────────

export const GOOGLE_DRIVE_SCOPE = "https://www.googleapis.com/auth/drive.readonly";
export const GOOGLE_GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.readonly";
export const REQUIRED_GOOGLE_SCOPES = [GOOGLE_DRIVE_SCOPE, GOOGLE_GMAIL_SCOPE];

const XLSX_MIME =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
const GOOGLE_SHEET_MIME = "application/vnd.google-apps.spreadsheet";

export type GoogleAuthErrorCode =
  | "not_configured"
  | "not_connected"
  | "missing_scopes"
  | "no_refresh"
  | "refresh_failed"
  | "api_error";

export class GoogleAuthError extends Error {
  code: GoogleAuthErrorCode;
  status: number;
  constructor(message: string, code: GoogleAuthErrorCode, status = 400) {
    super(message);
    this.name = "GoogleAuthError";
    this.code = code;
    this.status = status;
  }
}

function googleCreds() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new GoogleAuthError(
      "Google OAuth is not configured on the server.",
      "not_configured",
      503
    );
  }
  return { clientId, clientSecret };
}

async function getGoogleAccount(userId: string) {
  const [row] = await db
    .select()
    .from(accounts)
    .where(and(eq(accounts.userId, userId), eq(accounts.providerId, "google")))
    .limit(1);
  return row ?? null;
}

/** Is this user connected to Google, and do they have the scopes we need? */
export async function getConnectedGoogle(userId: string): Promise<{
  connected: boolean;
  grantedScopes: string[];
  missingScopes: string[];
}> {
  let account: Awaited<ReturnType<typeof getGoogleAccount>>;
  try {
    account = await getGoogleAccount(userId);
  } catch {
    // DB unreachable — treat as not connected so the UI degrades gracefully.
    return { connected: false, grantedScopes: [], missingScopes: REQUIRED_GOOGLE_SCOPES };
  }
  if (!account) {
    return { connected: false, grantedScopes: [], missingScopes: REQUIRED_GOOGLE_SCOPES };
  }
  const granted = (account.scope ?? "").split(/[\s,]+/).filter(Boolean);
  const missing = REQUIRED_GOOGLE_SCOPES.filter((s) => !granted.includes(s));
  return { connected: missing.length === 0, grantedScopes: granted, missingScopes: missing };
}

/**
 * A valid Google access token for the user, refreshing via the stored refresh
 * token when the current one is expired (or within 60s of expiry).
 */
export async function getGoogleAccessToken(userId: string): Promise<string> {
  const account = await getGoogleAccount(userId);
  if (!account) {
    throw new GoogleAuthError("No Google account is connected.", "not_connected", 401);
  }

  const now = Date.now();
  const expiresAt = account.accessTokenExpiresAt
    ? new Date(account.accessTokenExpiresAt).getTime()
    : 0;

  if (account.accessToken && expiresAt - now > 60_000) {
    return account.accessToken;
  }

  if (!account.refreshToken) {
    if (account.accessToken && expiresAt > now) return account.accessToken;
    throw new GoogleAuthError(
      "Google session expired and no refresh token is available — reconnect Google.",
      "no_refresh",
      401
    );
  }

  const { clientId, clientSecret } = googleCreds();
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
      refresh_token: account.refreshToken,
    }),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new GoogleAuthError(
      `Failed to refresh Google token (${res.status}). Reconnect Google. ${text}`.trim(),
      "refresh_failed",
      401
    );
  }

  const data = (await res.json()) as {
    access_token: string;
    expires_in?: number;
    scope?: string;
  };
  const newExpiry = new Date(now + (data.expires_in ?? 3600) * 1000);
  await db
    .update(accounts)
    .set({
      accessToken: data.access_token,
      accessTokenExpiresAt: newExpiry,
      updatedAt: new Date(),
      ...(data.scope ? { scope: data.scope } : {}),
    })
    .where(eq(accounts.id, account.id));

  return data.access_token;
}

/** Authorized fetch against a Google API. Throws GoogleAuthError on failure. */
async function googleFetch(
  userId: string,
  url: string,
  init?: RequestInit
): Promise<Response> {
  const token = await getGoogleAccessToken(userId);
  const res = await fetch(url, {
    ...init,
    headers: { ...(init?.headers ?? {}), Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new GoogleAuthError(
      `Google API error (${res.status}). ${text}`.trim(),
      "api_error",
      res.status === 401 || res.status === 403 ? 401 : 502
    );
  }
  return res;
}

// ── Drive ────────────────────────────────────────────────────────────────────

export type DriveFile = {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime?: string;
  isGoogleSheet: boolean;
};

/** List spreadsheets (native xlsx + Google Sheets), newest first, name-filtered. */
export async function driveListSpreadsheets(
  userId: string,
  query?: string
): Promise<DriveFile[]> {
  const clauses = [
    `(mimeType = '${GOOGLE_SHEET_MIME}' or mimeType = '${XLSX_MIME}' or mimeType = 'application/vnd.ms-excel')`,
    "trashed = false",
  ];
  if (query && query.trim()) {
    clauses.push(`name contains '${query.trim().replace(/'/g, "\'")}'`);
  }
  const params = new URLSearchParams({
    q: clauses.join(" and "),
    fields: "files(id,name,mimeType,modifiedTime)",
    orderBy: "modifiedTime desc",
    pageSize: "25",
    spaces: "drive",
    supportsAllDrives: "true",
    includeItemsFromAllDrives: "true",
  });
  const res = await googleFetch(
    userId,
    `https://www.googleapis.com/drive/v3/files?${params.toString()}`
  );
  const data = (await res.json()) as {
    files?: Array<{ id: string; name: string; mimeType: string; modifiedTime?: string }>;
  };
  return (data.files ?? []).map((f) => ({
    ...f,
    isGoogleSheet: f.mimeType === GOOGLE_SHEET_MIME,
  }));
}

export type DriveDownload = {
  bytes: ArrayBuffer;
  filename: string;
  contentType: string;
};

/** Download a Drive file as a workbook. Google Sheets are exported to .xlsx. */
export async function driveDownloadWorkbook(
  userId: string,
  fileId: string
): Promise<DriveDownload> {
  // First learn the file's type + name.
  const metaRes = await googleFetch(
    userId,
    `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?fields=id,name,mimeType&supportsAllDrives=true`
  );
  const meta = (await metaRes.json()) as { name: string; mimeType: string };

  let url: string;
  let filename = meta.name;
  if (meta.mimeType === GOOGLE_SHEET_MIME) {
    url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}/export?mimeType=${encodeURIComponent(XLSX_MIME)}`;
    if (!/\.xlsx$/i.test(filename)) filename = `${filename}.xlsx`;
  } else {
    url = `https://www.googleapis.com/drive/v3/files/${encodeURIComponent(fileId)}?alt=media&supportsAllDrives=true`;
    // The parser requires a .xlsx/.xls extension on the File name.
    if (!/\.(xlsx|xls)$/i.test(filename)) {
      filename = `${filename}.${meta.mimeType === "application/vnd.ms-excel" ? "xls" : "xlsx"}`;
    }
  }

  const fileRes = await googleFetch(userId, url);
  const bytes = await fileRes.arrayBuffer();
  return { bytes, filename, contentType: XLSX_MIME };
}

// ── Gmail ────────────────────────────────────────────────────────────────────

export type GmailAttachment = {
  attachmentId: string;
  filename: string;
  size: number;
};
export type GmailMessage = {
  messageId: string;
  subject: string;
  from: string;
  date: string;
  attachments: GmailAttachment[];
};

type GmailPart = {
  filename?: string;
  mimeType?: string;
  body?: { attachmentId?: string; size?: number };
  parts?: GmailPart[];
  headers?: Array<{ name: string; value: string }>;
};

/** Walk the MIME tree collecting spreadsheet attachments. */
function collectAttachments(part: GmailPart | undefined, out: GmailAttachment[]) {
  if (!part) return;
  const name = part.filename ?? "";
  if (name && /\.(xlsx|xls)$/i.test(name) && part.body?.attachmentId) {
    out.push({
      attachmentId: part.body.attachmentId,
      filename: name,
      size: part.body.size ?? 0,
    });
  }
  for (const child of part.parts ?? []) collectAttachments(child, out);
}

function header(headers: Array<{ name: string; value: string }> | undefined, name: string) {
  return headers?.find((h) => h.name.toLowerCase() === name.toLowerCase())?.value ?? "";
}

/** Search recent messages that carry an .xlsx/.xls attachment. */
export async function gmailListAttachmentMessages(
  userId: string,
  query?: string
): Promise<GmailMessage[]> {
  const q = ["has:attachment", "(filename:xlsx OR filename:xls)", (query ?? "").trim()]
    .filter(Boolean)
    .join(" ");
  const listParams = new URLSearchParams({ q, maxResults: "15" });
  const listRes = await googleFetch(
    userId,
    `https://gmail.googleapis.com/gmail/v1/users/me/messages?${listParams.toString()}`
  );
  const list = (await listRes.json()) as { messages?: Array<{ id: string }> };
  const ids = (list.messages ?? []).map((m) => m.id);

  const messages = await Promise.all(
    ids.map(async (id): Promise<GmailMessage | null> => {
      try {
        const res = await googleFetch(
          userId,
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${id}?format=full`
        );
        const msg = (await res.json()) as {
          id: string;
          payload?: GmailPart;
        };
        const attachments: GmailAttachment[] = [];
        collectAttachments(msg.payload, attachments);
        if (attachments.length === 0) return null;
        return {
          messageId: msg.id,
          subject: header(msg.payload?.headers, "Subject") || "(no subject)",
          from: header(msg.payload?.headers, "From"),
          date: header(msg.payload?.headers, "Date"),
          attachments,
        };
      } catch {
        return null;
      }
    })
  );
  return messages.filter((m): m is GmailMessage => m !== null);
}

/** Download one Gmail attachment's bytes. */
export async function gmailDownloadAttachment(
  userId: string,
  messageId: string,
  attachmentId: string
): Promise<ArrayBuffer> {
  const res = await googleFetch(
    userId,
    `https://gmail.googleapis.com/gmail/v1/users/me/messages/${encodeURIComponent(messageId)}/attachments/${encodeURIComponent(attachmentId)}`
  );
  const data = (await res.json()) as { data?: string };
  if (!data.data) {
    throw new GoogleAuthError("Attachment had no data.", "api_error", 502);
  }
  const buf = Buffer.from(data.data, "base64url");
  return buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
}
