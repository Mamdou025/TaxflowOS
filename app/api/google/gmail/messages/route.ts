import { NextResponse } from "next/server";
import { gmailListAttachmentMessages, type GmailMessage } from "@/platform/integrations/google/client";
import { googleErrorResponse, requireUserId } from "@/platform/integrations/google/require-user";

export type GmailMessagesResponse = { messages: GmailMessage[] };

/**
 * GET /api/google/gmail/messages?q=<search>
 * Recent emails carrying an .xlsx/.xls attachment (with each attachment's id).
 */
export async function GET(request: Request) {
  const auth = await requireUserId(request);
  if ("response" in auth) return auth.response;

  try {
    const q = new URL(request.url).searchParams.get("q") ?? undefined;
    const messages = await gmailListAttachmentMessages(auth.userId, q);
    return NextResponse.json<GmailMessagesResponse>({ messages });
  } catch (error) {
    return googleErrorResponse(error);
  }
}
