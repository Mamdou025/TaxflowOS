import { and, eq } from "drizzle-orm";
import { NextResponse } from '@/lib/next-server-shim';
import { auth } from "@/platform/auth/auth";
import { db } from "@/platform/db";
import { workflows } from "@/platform/db/schema";
import { generateWorkflowSDKCode } from "@/shared/workflow-engine/codegen/workflow-codegen-sdk";

export async function GET(
  request: Request,
  context: { params: Promise<{ workflowId: string }> }
) {
  try {
    const { workflowId } = await context.params;
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workflow = await db.query.workflows.findFirst({
      where: and(
        eq(workflows.id, workflowId),
        eq(workflows.userId, session.user.id)
      ),
    });

    if (!workflow) {
      return NextResponse.json(
        { error: "Workflow not found" },
        { status: 404 }
      );
    }

    // Generate code
    const code = generateWorkflowSDKCode(
      workflow.name,
      workflow.nodes,
      workflow.edges
    );

    return NextResponse.json({
      code,
      workflowName: workflow.name,
    });
  } catch (error) {
    console.error("Failed to get workflow code:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to get workflow code",
      },
      { status: 500 }
    );
  }
}
