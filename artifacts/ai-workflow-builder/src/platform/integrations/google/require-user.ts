// @ts-nocheck — server-only file; not compiled in the Vite frontend build.


import { NextResponse } from "next/server";
import { auth } from "@/platform/auth/auth";
import { GoogleAuthError } from "@/platform/integrations/google/client";

/**
 * Resolve the signed-in user's id for a Google API route, or return a 401
 * response. Google routes always act as the session user — never a
 * client-supplied id — so one user can't reach another's tokens.
 */
export async function requireUserId(
  request: Request
): Promise<{ userId: string } | { response: NextResponse }> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return { response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { userId: session.user.id };
}

/** Map an error thrown by a Google helper to a JSON response. */
export function googleErrorResponse(error: unknown): NextResponse {
  if (error instanceof GoogleAuthError) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: error.status });
  }
  console.error("Google route error:", error);
  return NextResponse.json(
    { error: error instanceof Error ? error.message : "Unknown error", code: "api_error" },
    { status: 500 }
  );
}
