import { driveDownloadWorkbook } from "@/lib/google/client";
import { googleErrorResponse, requireUserId } from "@/lib/google/require-user";

/**
 * GET /api/google/drive/files/[fileId]/content
 * Stream a Drive spreadsheet's raw workbook bytes (Google Sheets exported to
 * .xlsx). The client wraps these in a File and runs the shared parser.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ fileId: string }> }
) {
  const auth = await requireUserId(request);
  if ("response" in auth) return auth.response;

  try {
    const { fileId } = await params;
    const { bytes, filename, contentType } = await driveDownloadWorkbook(auth.userId, fileId);
    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "X-Filename": encodeURIComponent(filename),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return googleErrorResponse(error);
  }
}
