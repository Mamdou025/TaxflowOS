import { test, expect } from "./workflow-audit-isolation";

test("resizing the workspace and block panels does not open an error overlay", async ({
  page,
}) => {
  await page.addInitScript(() => {
    (window as any).resizeErrors = [];
    window.addEventListener("error", (event) =>
      (window as any).resizeErrors.push({
        message: event.message,
        error: String(event.error),
      }),
    );
  });
  await page.goto("/w/pf-fapi");
  await page.getByRole("button", { name: "Build", exact: true }).click();
  const seam = page.getByTitle("Drag to resize", { exact: true });
  const box = await seam.boundingBox();
  expect(box).not.toBeNull();
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2);
  await page.mouse.down();
  for (const dx of [-150, 100, -100, 140, 0])
    await page.mouse.move(box!.x + dx, box!.y + box!.height / 2, { steps: 15 });
  await page.mouse.up();
  await expect(page.locator("vite-error-overlay")).toHaveCount(0);
  await page
    .getByRole("button", { name: "Keyword Mapper", exact: true })
    .click();
  const divider = page.getByRole("button", { name: "Resize panels" });
  const bounds = await divider.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(
    bounds!.x + bounds!.width / 2,
    bounds!.y + bounds!.height / 2,
  );
  await page.mouse.down();
  for (const dx of [-80, 130, -50, 60, 0])
    await page.mouse.move(bounds!.x + dx, bounds!.y + bounds!.height / 2, {
      steps: 15,
    });
  await page.mouse.up();
  const settled = await page.evaluate(async () => {
    const frames = () =>
      new Promise<void>((resolve) => {
        let remaining = 8;
        const next = () => {
          if (--remaining === 0) resolve();
          else requestAnimationFrame(next);
        };
        requestAnimationFrame(next);
      });
    await frames();
    const before = (window as any).resizeErrors.length;
    await frames();
    return { before, after: (window as any).resizeErrors.length };
  });
  expect(settled.after).toBe(settled.before);
  await expect(page.locator("vite-error-overlay")).toHaveCount(0);
});

test("browser resize notifications are excluded without suppressing real exceptions", async ({
  page,
}) => {
  const forwarded: string[] = [];
  page.on("websocket", (socket) =>
    socket.on("framesent", (frame) => {
      try {
        const data = JSON.parse(String(frame.payload));
        if (data.event === "runtime-error-plugin:error")
          forwarded.push(data.data.message);
      } catch {
        /* Other websocket frames are not error reports. */
      }
    }),
  );
  await page.goto("/w/pf-fapi");
  await page.getByRole("button", { name: "Build", exact: true }).waitFor();
  const messages = [
    "ResizeObserver loop completed with undelivered notifications.",
    "ResizeObserver loop limit exceeded",
  ];
  await page.evaluate((messages) => {
    for (const message of messages)
      window.dispatchEvent(new ErrorEvent("error", { message }));
    // This rejection serves as a round-trip marker through the same reporter.
    window.dispatchEvent(
      new PromiseRejectionEvent("unhandledrejection", {
        promise: Promise.resolve(),
        reason: new Error("Genuine rejection regression check"),
      }),
    );
  }, messages);
  await expect(page.locator("vite-error-overlay")).toHaveCount(1);
  await expect(page.locator("vite-error-overlay")).toContainText(
    "Genuine rejection regression check",
  );
  expect(forwarded).toEqual(["Genuine rejection regression check"]);
  await page
    .locator("vite-error-overlay")
    .evaluate((element) => element.remove());
  await page.evaluate(
    (message) =>
      window.dispatchEvent(
        new ErrorEvent("error", { message, error: new Error(message) }),
      ),
    messages[0],
  );
  await expect(page.locator("vite-error-overlay")).toContainText(messages[0]);
});

test("window errors without an Error object retain their original message", async ({
  page,
}) => {
  await page.goto("/w/pf-fapi");
  await page.getByRole("button", { name: "Build", exact: true }).waitFor();
  await page.evaluate(() =>
    window.dispatchEvent(
      new ErrorEvent("error", {
        message: "Specific browser error regression check",
      }),
    ),
  );
  await expect(page.locator("vite-error-overlay")).toContainText(
    "Specific browser error regression check",
  );
  await expect(page.locator("vite-error-overlay")).not.toContainText(
    "(unknown runtime error)",
  );
});
