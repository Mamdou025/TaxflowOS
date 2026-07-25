import { NextResponse } from '@/lib/next-server-shim';
import { driveListSpreadsheets, type DriveFile } from "@/platform/integrations/google/client";
import { googleErrorResponse, requireUserId } from "@/platform/integrations/google/require-user";

export type DriveFilesResponse = { files: DriveFile[] };

/**
 * GET /api/google/drive/files?q=<search>
 * List the user's Drive spreadsheets (native .xlsx + Google Sheets).
 */
export async function GET(request: Request) {
  const auth = await requireUserId(request);
  if ("response" in auth) return auth.response;

  try {
    const q = new URL(request.url).searchParams.get("q") ?? undefined;
    const files = await driveListSpreadsheets(auth.userId, q);
    return NextResponse.json<DriveFilesResponse>({ files });
  } catch (error) {
    return googleErrorResponse(error);
  }
}
