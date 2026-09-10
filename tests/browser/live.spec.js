const { test, expect } = require("@playwright/test");

test("deployed PWA works at its HTTPS subdirectory", async ({ page, context, baseURL }) => {
  expect(baseURL).toMatch(/^https:\/\/[^/]+\/prepfit\/$/);
  await page.goto(baseURL);
  expect(new URL(page.url()).pathname).toBe("/prepfit/");

  const manifest = await page.evaluate(async () => {
    const response = await fetch("./manifest.webmanifest");
    return { ok: response.ok, value: await response.json() };
  });
  expect(manifest.ok).toBe(true);
  expect(manifest.value.id).toBe("./");
  expect(manifest.value.start_url).toBe("./");
  expect(manifest.value.scope).toBe("./");

  await page.getByRole("button", { name: "Continue as guest" }).click();
  await page.locator("#days").fill("3");
  await page.locator("#days").blur();
  await expect(page.locator("#meal-plan .meal-card")).toHaveCount(3);
  await page.reload();
  await expect(page.locator("#days")).toHaveValue("3");
  await page.waitForFunction(() => navigator.serviceWorker.controller?.scriptURL.includes("/prepfit/service-worker.js"));

  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(page.locator("#meal-plan .meal-card")).toHaveCount(3);
  await expect(page.locator("#days")).toHaveValue("3");
});
