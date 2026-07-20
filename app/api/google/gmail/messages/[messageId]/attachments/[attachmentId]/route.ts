import { gmailDownloadAttachment } from "@/lib/google/client";
import { googleErrorResponse, requireUserId } from "@/lib/google/require-user";

/**
 * GET /api/google/gmail/messages/[messageId]/attachments/[attachmentId]?filename=<name>
 * Stream a Gmail attachment's raw bytes. The client wraps these in a File and
 * runs the shared workbook parser.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ messageId: string; attachmentId: string }> }
) {
  const auth = await requireUserId(request);
  if ("response" in auth) return auth.response;

  try {
    const { messageId, attachmentId } = await params;
    const rawName = new URL(request.url).searchParams.get("filename") ?? "attachment.xlsx";
    const filename = /\.(xlsx|xls)$/i.test(rawName) ? rawName : `${rawName}.xlsx`;
    const bytes = await gmailDownloadAttachment(auth.userId, messageId, attachmentId);
    return new Response(bytes, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(filename)}"`,
        "X-Filename": encodeURIComponent(filename),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    return googleErrorResponse(error);
  }
}
