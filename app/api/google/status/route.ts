import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getConnectedGoogle, REQUIRED_GOOGLE_SCOPES } from "@/lib/google/client";

export type GoogleStatusResponse = {
  connected: boolean;
  missingScopes: string[];
  requiredScopes: string[];
  configured: boolean;
};

/**
 * GET /api/google/status
 * Whether the signed-in user has Google connected with the Drive+Gmail scopes.
 * Degrades gracefully (never 500s) so the picker can show a "connect" state.
 */
export async function GET(request: Request) {
  const configured = !!process.env.GOOGLE_CLIENT_ID;
  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user) {
      return NextResponse.json<GoogleStatusResponse>({
        connected: false,
        missingScopes: REQUIRED_GOOGLE_SCOPES,
        requiredScopes: REQUIRED_GOOGLE_SCOPES,
        configured,
      });
    }
    const { connected, missingScopes } = await getConnectedGoogle(session.user.id);
    return NextResponse.json<GoogleStatusResponse>({
      connected: configured && connected,
      missingScopes,
      requiredScopes: REQUIRED_GOOGLE_SCOPES,
      configured,
    });
  } catch {
    return NextResponse.json<GoogleStatusResponse>({
      connected: false,
      missingScopes: REQUIRED_GOOGLE_SCOPES,
      requiredScopes: REQUIRED_GOOGLE_SCOPES,
      configured,
    });
  }
}
