import { test, expect } from "@playwright/test";

test("defined aggregation terms are available without a run and saved versions retain edited rules", async ({
  page,
}) => {
  await page.goto("/");
  const result = await page.evaluate(async () => {
    const engine =
      await import("/src/shared/workflow-engine/local-fiscal-workflow.ts");
    const { templateDefinition } =
      await import("/src/features/workflows-hub/saved-workflow-run.tsx");
    const { saveVersion } =
      await import("/src/features/workflows-hub/workflow-library.ts");
    const { runLocalWorkflowTools } =
      await import("/src/shared/workflow-engine/local-tool-runner.ts");
    const { availableCalculationValues } =
      await import("/src/features/workflow-builder/ui/logic-viewers/available-calculation-values.ts");
    const definition = templateDefinition("pf-fapi")!;
    const rules = definition.blocks.find(
      (block) =>
        Array.isArray(block.config.keywordRules) &&
        block.config.keywordRules.length,
    )!;
    const source = definition.blocks.find(
      (block) => block.config.toolId === "source.manual_table",
    )!;
    const keyword = "unique roundtrip keyword";
    rules.config.keywordRules[0].keywords = [keyword];
    const rows = [
      {
        rowId: "roundtrip",
        label: keyword,
        description: keyword,
        amount: 4321,
        customQuantity: 17,
      },
    ];
    source.config = {
      ...source.config,
      rows,
      manualRows: rows,
      tableRows: rows,
    };
    let entry = saveVersion({
      id: "custom:test",
      templateId: "pf-fapi",
      draft: definition,
      versions: [],
      runs: [],
    });
    const first = entry.versions[0].definition;
    rules.config.keywordRules[0].keywords = ["changed again"];
    entry = saveVersion(entry);
    const canvas = engine.workflowDefinitionToCanvas(first);
    const run = runLocalWorkflowTools({ ...canvas, workflowName: first.name });
    const computation = first.blocks.find((block) =>
      /calculation.engine/.test(String(block.config.toolId)),
    );
    const terms = computation
      ? availableCalculationValues(computation, canvas.edges, canvas.nodes)
      : [];
    return {
      classified: run.result.results.some(result => Array.isArray(result.output.mappedRows) && result.output.mappedRows.some(row => row.rowId === "roundtrip" && row.matchedKeyword === keyword)),
      versions: entry.versions.length,
      savedKeyword: first.blocks.find((block) => block.id === rules.id)!.config
        .keywordRules[0].keywords,
      output: JSON.stringify(run.result.results),
      terms,
    };
  });
  expect(result.classified).toBeTruthy();
  expect(result.versions).toBe(2);
  expect(result.savedKeyword).toEqual(["unique roundtrip keyword"]);
  expect(result.output).toContain("4321");
  expect(result.output).toContain("unique roundtrip keyword");
  expect(result.output).toContain("customQuantity");
  expect(result.terms.length).toBeGreaterThan(0);
  expect(result.terms.some((term) => term.value === null)).toBeTruthy();
});

test("Build uploads create a personal workflow that survives Run and reload", async ({
  page,
}, testInfo) => {
  await page.goto("/w/pf-fapi");
  await page.getByRole("button", { name: "Build", exact: true }).click();
  await page
    .getByText("Test data — upload document or enter examples", { exact: true })
    .click();
  await page
    .getByLabel("Upload test document")
    .setInputFiles({
      name: "records.json",
      mimeType: "application/json",
      buffer: Buffer.from(
        JSON.stringify([
          { label: "Interest income", amount: 1234, quantity: 7 },
        ]),
      ),
    });
  await page
    .getByRole("button", { name: "Use this test data", exact: true })
    .click();
  await expect(page.getByText("MY WORKFLOWS", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Run", exact: true }).first().click();
  await page
    .getByRole("button", { name: "Save changes and run", exact: true })
    .click();
  const stored = await page.evaluate(async () => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return readWorkflowLibrary(); });
  const entry = Object.values(stored)[0] as any;
  expect(Object.keys(stored)).toHaveLength(1);
  expect(
    entry.draft.blocks.some((block: any) =>
      block.config.rows?.some((row: any) => row.amount === 1234),
    ),
  ).toBeTruthy();
  expect(entry.runs).toHaveLength(1);
  expect(entry.runs[0].result.result.workflowId).toBe(entry.id);
  expect(JSON.stringify(entry.runs[0].result)).toContain("1234");
  await page.reload();
  await page.getByRole("button", { name: "Workflows", exact: true }).click();
  await page
    .getByRole("button", { name: entry.draft.name, exact: true })
    .click();
  await page.getByRole("button", { name: "Build", exact: true }).click();
  const after = await page.evaluate(async () => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return readWorkflowLibrary(); });
  expect(Object.keys(after)).toHaveLength(1);
  expect(after[entry.id].draft.blocks).toEqual(entry.draft.blocks);
  const rulebook = entry.draft.blocks.find(
    (block: any) =>
      Array.isArray(block.config.keywordRules),
  );
  await page
    .locator(`.react-flow__node[data-id="${rulebook.id}"]`)
    .click();
  await page.getByRole("button", { name: "Test block", exact: true }).click();
  await expect(page.getByTestId("block-io-panel")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Received", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Produced", exact: true }),
  ).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("block-test.png") });
});

test('uploading CSV into a blank workflow adds a source and preserves its Start block', async ({ page }) => {
  await page.goto('/w/pf-fapi');
  await page.getByRole('button', { name: 'New workflow', exact: true }).click();
  await page.getByText('Test data — upload document or enter examples', { exact: true }).click();
  await page.getByLabel('Upload test document').setInputFiles({ name: 'inventory.csv', mimeType: 'text/csv', buffer: Buffer.from('Product,Quantity\nPens,12\nPaper,0') });
  await page.getByRole('button', { name: 'Use this test data', exact: true }).click();
  const entries = await page.evaluate(async () => { const { readWorkflowLibrary } = await import('/src/features/workflows-hub/workflow-library.ts'); return Object.values(readWorkflowLibrary()); }) as any[];
  expect(entries).toHaveLength(1);
  expect(entries[0].draft.blocks).toHaveLength(2);
  expect(entries[0].draft.blocks.some((block: any) => block.label === 'Start')).toBeTruthy();
  expect(entries[0].draft.blocks.find((block: any) => block.label === 'Document').config.rows[0].Product).toBe('Pens');
});

test("text-only records and custom fields survive parsing; empty input never becomes sample data", async ({
  page,
}) => {
  await page.goto("/");
  const result = await page.evaluate(async () => {
    const { parseManualTableRows } =
      await import("/src/shared/workflow-engine/execution/blocks/source/manual-table/schema.ts");
    const { presentToolOutput } =
      await import("/src/shared/workflow-engine/present-tool-output.ts");
    const fallbackRows = [{ rowId: "sample", label: "Sample", amount: 99 }];
    const rows = parseManualTableRows({
      config: {
        rows: [
          { label: "A document without numbers", department: "Operations" },
          { label: "Valid zero", amount: 0 },
        ],
      },
      fallbackRows,
    });
    const empty = parseManualTableRows({ config: { rows: [] }, fallbackRows });
    return {
      count: rows.length,
      missing: Number.isNaN(rows[0].amount),
      zero: rows[1].amount,
      raw: rows[0].raw,
      empty,
      display: presentToolOutput({
        output: {
          value: 0,
          absent: {},
          empty: [],
          bindingValidation: [],
          upstreamBlockIds: [],
        },
      } as any),
    };
  });
  expect(result.count).toBe(2);
  expect(result.missing).toBeTruthy();
  expect(result.zero).toBe(0);
  expect(result.raw?.department).toBe("Operations");
  expect(result.empty).toEqual([]);
  expect(result.display).toEqual({ value: 0 });
});
