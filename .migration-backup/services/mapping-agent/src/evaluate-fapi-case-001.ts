import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { runMappingAgent } from "./engine";
import type { MappingDecision } from "./types";

const root = process.cwd();
const caseRoot = path.join(
  root,
  "tests",
  "fixtures",
  "mapping",
  "fapi",
  "case-001"
);
const expectedPath = path.join(caseRoot, "expected_mapping.csv");
const reportPath = path.join(caseRoot, "agent_evaluation_report.json");
const byteOrderMarkPattern = /^\uFEFF/;
const carriageReturnPattern = /\r$/;

type ExpectedRow = Record<string, string>;

type Difference = {
  actual?: unknown;
  expected?: unknown;
  expectationId?: string;
  field?: string;
  key: string;
  type: "extra" | "mismatch" | "missing";
};

function expectedKey(row: ExpectedRow) {
  return [
    row.affiliate_alias,
    row.expected_row_type,
    row.source_file,
    row.source_sheet,
    row.source_label_cell || row.source_fact_label,
  ].join("|");
}

function actualKey(mapping: MappingDecision) {
  return [
    mapping.affiliateAlias,
    mapping.rowType,
    mapping.evidence.fileName,
    mapping.evidence.sheetName,
    mapping.evidence.labelCell || mapping.sourceFactLabel,
  ].join("|");
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: The CSV state machine keeps quoted values, formulas, and line endings deterministic without another dependency.
function parseCsv(text: string): ExpectedRow[] {
  const records: string[][] = [];
  let record: string[] = [];
  let field = "";
  let quoted = false;
  const source = text.replace(byteOrderMarkPattern, "");

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      record.push(field);
      field = "";
    } else if (character === "\n") {
      record.push(field.replace(carriageReturnPattern, ""));
      records.push(record);
      record = [];
      field = "";
    } else {
      field += character;
    }
  }
  if (field || record.length > 0) {
    record.push(field.replace(carriageReturnPattern, ""));
    records.push(record);
  }
  const [headers, ...rows] = records;
  return rows
    .filter((row) => row.some((value) => value !== ""))
    .map((row) =>
      Object.fromEntries(
        headers.map((header, index) => [header, row[index] ?? ""])
      )
    );
}

function asBoolean(value: string) {
  return value.toLowerCase() === "true";
}

function equivalent(left: unknown, right: unknown) {
  if ((left === undefined || left === null || left === "") && right === "") {
    return true;
  }
  const leftNumber = typeof left === "number" ? left : Number(left);
  const rightNumber = typeof right === "number" ? right : Number(right);
  if (
    String(left).trim() !== "" &&
    String(right).trim() !== "" &&
    Number.isFinite(leftNumber) &&
    Number.isFinite(rightNumber)
  ) {
    return Math.abs(leftNumber - rightNumber) <= 0.000_001;
  }
  return String(left ?? "") === String(right ?? "");
}

function compareRow(row: ExpectedRow, mapping: MappingDecision) {
  const comparisons: [string, unknown, unknown][] = [
    ["treatment", mapping.treatment, row.expected_treatment],
    ["engine_field", mapping.engineField ?? "", row.expected_engine_field],
    ["review_requirement", mapping.reviewRequirement, row.review_requirement],
    ["source_role", mapping.sourceRole, row.source_role],
    ["source_required", mapping.sourceRequired, asBoolean(row.source_required)],
    [
      "discrepancy_expected",
      mapping.discrepancyExpected,
      asBoolean(row.discrepancy_expected),
    ],
    ...(row.source_value
      ? [
          ["source_value", mapping.sourceValue ?? "", row.source_value] as [
            string,
            unknown,
            unknown,
          ],
        ]
      : []),
    ...(row.source_formula
      ? [
          [
            "source_formula",
            mapping.sourceFormula ?? "",
            row.source_formula,
          ] as [string, unknown, unknown],
        ]
      : []),
  ];
  return comparisons
    .filter(([, actual, expected]) => !equivalent(actual, expected))
    .map(([field, actual, expected]) => ({ actual, expected, field }));
}

async function main() {
  const expectedRows = parseCsv(await readFile(expectedPath, "utf8"));

  const trialBalanceNames = [
    "fa-01_trial_balance.xlsx",
    "fa-02_trial_balance.xlsx",
  ];
  const trialBalances = await Promise.all(
    trialBalanceNames.map(async (fileName) => ({
      buffer: await readFile(path.join(caseRoot, fileName)),
      fileName,
    }))
  );
  const referenceFileName = "reference_fapi_workpaper.xlsx";
  const result = await runMappingAgent({
    includeBenchmarkCoverage: true,
    referenceDocuments: [
      {
        buffer: await readFile(path.join(caseRoot, referenceFileName)),
        fileName: referenceFileName,
      },
    ],
    trialBalances,
    workflow: "fapi",
  });

  const actualByKey = new Map(
    result.mappings.map((mapping) => [actualKey(mapping), mapping])
  );
  const expectedByKey = new Map(
    expectedRows.map((row) => [expectedKey(row), row])
  );
  const differences: Difference[] = [];

  for (const [key, row] of expectedByKey) {
    const mapping = actualByKey.get(key);
    if (!mapping) {
      differences.push({
        expectationId: row.expectation_id,
        key,
        type: "missing",
      });
      continue;
    }
    for (const mismatch of compareRow(row, mapping)) {
      differences.push({
        ...mismatch,
        expectationId: row.expectation_id,
        key,
        type: "mismatch",
      });
    }
  }
  for (const key of actualByKey.keys()) {
    if (!expectedByKey.has(key)) {
      differences.push({ key, type: "extra" });
    }
  }

  const matchedExpectations = expectedRows.filter((row) => {
    const key = expectedKey(row);
    return (
      actualByKey.has(key) &&
      !differences.some(
        (difference) => difference.key === key && difference.type !== "extra"
      )
    );
  }).length;
  const report = {
    agentRunStatus: result.status,
    agentValidation: result.validation,
    caseId: "fapi-case-001",
    differences,
    expectedMappings: expectedRows.length,
    generatedAt: new Date().toISOString(),
    mappingAccuracy:
      expectedRows.length === 0 ? 0 : matchedExpectations / expectedRows.length,
    matchedExpectations,
    producedMappings: result.mappings.length,
    provider: result.provider,
    rulePackVersion: result.rulePackVersion,
    status: differences.length === 0 ? "pass" : "fail",
  };
  await writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
  if (differences.length > 0 || !result.validation.passed) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
