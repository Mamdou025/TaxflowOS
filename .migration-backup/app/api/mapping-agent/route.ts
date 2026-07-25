import { NextResponse } from "next/server";
import { runMappingAgent } from "@/services/mapping-agent/src/engine";
import type {
  ReferenceDocumentInput,
  TrialBalanceInput,
} from "@/services/mapping-agent/src/types";

export const runtime = "nodejs";

function isFile(value: FormDataEntryValue): value is File {
  return typeof value !== "string";
}

function uploadedDocuments(
  formData: FormData,
  fieldName: string
): Promise<ReferenceDocumentInput[]> {
  const files = formData.getAll(fieldName).filter(isFile);
  return Promise.all(
    files.map(async (file) => ({
      buffer: Buffer.from(await file.arrayBuffer()),
      fileName: file.name,
    }))
  );
}

export function GET() {
  return NextResponse.json({
    agent: "mapping-agent",
    defaultProvider: "deterministic-rule-pack",
    status: "ready",
    workflows: ["fapi"],
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const workflow = String(formData.get("workflow") ?? "fapi").trim();
    const trialBalances = (await uploadedDocuments(
      formData,
      "trialBalances"
    )) as TrialBalanceInput[];
    const referenceDocuments = await uploadedDocuments(
      formData,
      "referenceDocuments"
    );
    const includeBenchmarkCoverage =
      String(formData.get("includeBenchmarkCoverage") ?? "false") === "true";

    if (trialBalances.length === 0) {
      return NextResponse.json(
        { error: "Upload at least one trial balance using trialBalances." },
        { status: 400 }
      );
    }

    const result = await runMappingAgent({
      includeBenchmarkCoverage,
      referenceDocuments,
      trialBalances,
      workflow,
    });
    return NextResponse.json(result, {
      status: result.status === "failed_validation" ? 422 : 200,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Mapping-agent run failed.",
      },
      { status: 400 }
    );
  }
}
