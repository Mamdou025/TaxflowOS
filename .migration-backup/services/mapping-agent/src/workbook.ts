import { type CellObject, read, utils, type WorkBook } from "xlsx";
import type { WorkflowRulePack } from "./rule-pack";
import type { ExtractedFact, TrialBalanceInput } from "./types";

function cellValue(cell: CellObject | undefined) {
  if (!cell) {
    return null;
  }
  const value = cell.v;
  if (
    value === null ||
    value === undefined ||
    typeof value === "number" ||
    typeof value === "string" ||
    typeof value === "boolean"
  ) {
    return value ?? null;
  }
  return String(value);
}

function workbookText(workbook: WorkBook) {
  const text: string[] = [];
  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet?.["!ref"]) {
      continue;
    }
    const range = utils.decode_range(sheet["!ref"]);
    const lastRow = Math.min(range.e.r, 12);
    const lastColumn = Math.min(range.e.c, 6);
    for (let row = range.s.r; row <= lastRow; row += 1) {
      for (let column = range.s.c; column <= lastColumn; column += 1) {
        const address = utils.encode_cell({ c: column, r: row });
        const value = cellValue(sheet[address]);
        if (typeof value === "string" && value.trim()) {
          text.push(value.trim());
        }
      }
    }
  }
  return text.join("\n");
}

export function detectAffiliateAlias(
  workbook: WorkBook,
  rulePack: WorkflowRulePack,
  suppliedAlias?: string
) {
  if (suppliedAlias?.trim()) {
    return suppliedAlias.trim();
  }
  const sourceText = workbookText(workbook);
  const match = rulePack.affiliateAliases.find(({ sourceNamePattern }) =>
    new RegExp(sourceNamePattern, "iu").test(sourceText)
  );
  if (!match) {
    throw new Error(
      "Unable to identify the foreign affiliate from the workbook. Supply affiliateAlias or add a governed alias pattern to the workflow rule pack."
    );
  }
  return match.alias;
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Trial-balance extraction intentionally keeps row, label, value, formula, and evidence-cell selection in one traceable pass.
export function extractTrialBalanceFacts(
  input: TrialBalanceInput,
  rulePack: WorkflowRulePack
) {
  const workbook = read(input.buffer, {
    cellDates: false,
    cellFormula: true,
    dense: false,
    type: "buffer",
  });
  const affiliateAlias = detectAffiliateAlias(
    workbook,
    rulePack,
    input.affiliateAlias
  );
  const facts: ExtractedFact[] = [];

  for (const sheetName of workbook.SheetNames) {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet?.["!ref"]) {
      continue;
    }
    const range = utils.decode_range(sheet["!ref"]);
    for (let row = range.s.r; row <= range.e.r; row += 1) {
      let labelColumn: number | undefined;
      let label = "";
      for (let column = range.s.c; column <= range.e.c; column += 1) {
        const address = utils.encode_cell({ c: column, r: row });
        const value = cellValue(sheet[address]);
        if (typeof value === "string" && value.trim()) {
          labelColumn = column;
          label = value.trim();
          break;
        }
      }
      if (labelColumn === undefined || !label) {
        continue;
      }

      const labelCell = utils.encode_cell({ c: labelColumn, r: row });
      let valueCell: string | undefined;
      let value: ExtractedFact["value"] = null;
      let formula: string | undefined;
      for (let column = labelColumn + 1; column <= range.e.c; column += 1) {
        const address = utils.encode_cell({ c: column, r: row });
        const cell = sheet[address];
        const candidate = cellValue(cell);
        if (candidate !== null && candidate !== "") {
          valueCell = address;
          value = candidate;
          formula = cell?.f ? `=${cell.f}` : undefined;
          break;
        }
      }

      facts.push({
        affiliateAlias,
        formula,
        label,
        labelCell,
        rowNumber: row + 1,
        sheetName,
        sourceFile: input.fileName,
        value,
        valueCell,
      });
    }
  }

  return { affiliateAlias, facts, workbook };
}
