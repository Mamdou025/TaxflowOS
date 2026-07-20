import { expect, test, type Page } from "@playwright/test";

// ─────────────────────────────────────────────────────────────────────────────
// Deep smoke of the conversation-first chat after:
//   • the server-side orphan repair (can-chat-after-a-workflow fix),
//   • the coworker-activity indicator, and
//   • the Work-menu increment (record / Open / Jump).
// Runs against the already-running dev server (see e2e-deep.config.ts).
// NOTE: Next dev hydration is slow — we wait for interactivity before driving.
// ─────────────────────────────────────────────────────────────────────────────

const COMPOSER = "textarea.lc-textarea";
const IGNORE = /(telemetry|Lit is in dev mode|shiki|baseline-browser|React DevTools|favicon|hydrat|ResizeObserver|preload|Fast Refresh|\[HMR\]|source map|ERR_ABORTED|Warning:)/i;

async function gotoChat(page: Page): Promise<string[]> {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await expect(page.locator(COMPOSER).first()).toBeVisible({ timeout: 90_000 });
  // Let Next-dev React finish hydrating so onClick/onSend handlers are attached.
  await page.waitForTimeout(3000);
  // CopilotKit's dev-only Web Inspector + Next dev-tools float over the top-right and
  // intercept clicks on the Work menu — hide them (they don't exist in production).
  await page.addStyleTag({
    content: "cpk-web-inspector, nextjs-portal, [data-nextjs-toast], [data-nextjs-dev-tools-button] { display: none !important; pointer-events: none !important; }",
  });
  return errors;
}
const real = (errors: string[]) => errors.filter((e) => !IGNORE.test(e));

test("chat renders with the persistent Work menu, empty state, no page errors", async ({ page }) => {
  const errors = await gotoChat(page);
  const work = page.getByTestId("work-menu");
  await expect(work).toBeVisible();
  await work.click();
  await expect(page.getByTestId("work-menu-panel")).toBeVisible();
  await expect(page.getByText(/Nothing yet/i)).toBeVisible();
  expect(real(errors), "page errors:\n" + real(errors).join("\n")).toEqual([]);
});

test("sidebar run → records a Work item, names the coworker, Jump reaches the card", async ({ page }) => {
  const errors = await gotoChat(page);

  await page.getByRole("button", { name: /Calculate FAPI/ }).first().click();

  // The run card mounts in the thread (tagged for Jump). This proves the launch worked.
  const runCard = page.locator('[data-work-id="workflow-run:fapi"]');
  await expect(runCard).toBeVisible({ timeout: 30_000 });

  // The run proposal offers a Start button.
  const startBtn = page.getByRole("button", { name: /Start .* run/i });
  await expect(startBtn).toBeVisible({ timeout: 15_000 });
  await startBtn.click();

  // Coworker indicator names the specialist working the run.
  await expect(page.getByText(/Sofi/).first()).toBeVisible({ timeout: 20_000 });

  // Work menu lists the run, awaiting/running.
  await page.getByTestId("work-menu").click();
  const panel = page.getByTestId("work-menu-panel");
  await expect(panel).toBeVisible();
  // The item title is the config name ("FAPI"), shown with a Workflow type + live status.
  await expect(panel.getByTestId("work-row").first()).toBeVisible();
  await expect(panel.getByText(/FAPI/).first()).toBeVisible();
  await expect(panel.getByText(/Needs you|Running/).first()).toBeVisible();

  // Jump scrolls to the run card.
  const row = page.getByTestId("work-row").first();
  await row.hover();
  await row.getByRole("button", { name: /Jump/i }).click();
  await expect(runCard).toBeInViewport({ timeout: 10_000 });

  expect(real(errors), "page errors:\n" + real(errors).join("\n")).toEqual([]);
});

test("visual: launched run is inline in one scroll with the composer at the bottom", async ({ page }) => {
  await gotoChat(page);
  await page.getByRole("button", { name: /Calculate FAPI/ }).first().click();
  await page.getByRole("button", { name: /Start .* run/i }).click();
  const sample = page.getByRole("button", { name: /Use sample workbook/i });
  if (await sample.isVisible().catch(() => false)) await sample.click();
  const approve = page.getByRole("button", { name: /Approve/i }).first();
  if (await approve.isVisible({ timeout: 30_000 }).catch(() => false)) await approve.click();
  await page.waitForTimeout(2500);
  await page.screenshot({ path: "test-results/unified-scroll.png", fullPage: false });
  // The composer must be at the very bottom of the viewport (fixed), with the run above.
  const composer = page.locator("textarea.lc-textarea").first();
  const box = await composer.boundingBox();
  const vh = page.viewportSize()!.height;
  expect(box, "composer not found").not.toBeNull();
  expect(box!.y, `composer top (${box!.y}) should be in the lower half of the ${vh}px viewport`).toBeGreaterThan(vh * 0.5);
});

test("LLM round-trip: message + follow-up both get responses; runtime serves; no orphan error", async ({ page }) => {
  const apiStatuses: number[] = [];
  page.on("response", (r) => { if (r.url().includes("/api/copilotkit")) apiStatuses.push(r.status()); });
  const errors = await gotoChat(page);

  const send = async (text: string) => {
    // Re-query each time: the hero composer is replaced by the thread's input after
    // the first message, so a cached handle goes stale.
    const composer = page.locator(COMPOSER).first();
    await composer.click();
    await composer.fill(text);
    await composer.press("Enter");
  };

  await send("In one short sentence, what can you help me with?");
  // The runtime responds — an assistant message row (with .lc-avatar) appears.
  await expect(page.locator(".lc-avatar").first()).toBeVisible({ timeout: 90_000 });
  // Wait for the first response to finish streaming (the Stop button disappears) so the
  // follow-up isn't sent into a busy composer.
  await page.getByRole("button", { name: "Stop" }).waitFor({ state: "hidden", timeout: 90_000 }).catch(() => {});
  await page.waitForTimeout(1500);

  // Follow-up: the chat must stay responsive (this is exactly what the orphan bug broke).
  await send("Thanks. In one sentence, what is FAPI?");
  await expect(async () => {
    expect(await page.locator(".lc-avatar").count()).toBeGreaterThanOrEqual(2);
  }).toPass({ timeout: 90_000 });

  // The runtime was actually hit and never returned a 500.
  expect(apiStatuses.length, "no /api/copilotkit calls were made").toBeGreaterThan(0);
  expect(apiStatuses.filter((s) => s >= 500), "5xx from /api/copilotkit: " + apiStatuses.join(",")).toEqual([]);
  // Capture the header roster + per-message coworker avatars.
  await page.screenshot({ path: "test-results/roster-and-avatars.png", fullPage: false });

  // The "Tool result is missing" orphan error must NOT surface.
  const orphan = errors.filter((e) => /tool result is missing|MissingToolResults/i.test(e));
  expect(orphan, "orphan error surfaced:\n" + orphan.join("\n")).toEqual([]);
});

test("agent roster is present in the thread header and @-mentions include agents", async ({ page }) => {
  await gotoChat(page);
  // Roster: the "Agents" label + agent avatar buttons (initials) in the header.
  await expect(page.getByText("Agents", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "So", exact: true })).toBeVisible(); // Sofi's roster chip
  // @-palette lists agents: typing "@sofi" surfaces Sofi as an assign command.
  const composer = page.locator(COMPOSER).first();
  await composer.click();
  await composer.fill("@sofi");
  await expect(page.getByText(/Assign — FAPI specialist/i).first()).toBeVisible({ timeout: 8_000 });
  await page.screenshot({ path: "test-results/roster-mention.png", fullPage: false });
});
