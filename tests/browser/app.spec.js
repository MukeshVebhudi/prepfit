const { test, expect } = require("@playwright/test");

test("complete planning journey persists and works offline", async ({ page, context }, testInfo) => {
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  await page.goto("/");
  await page.getByRole("button", { name: "Continue as guest" }).click();
  await expect(page.locator("#meal-plan .meal-card").first()).toBeVisible();

  await page.getByText("Customize supplement nutrition", { exact: true }).click();
  await page.locator('[name="supplementMode"]').selectOption("custom");
  await page.locator('[name="supplementLabel"]').fill("Rice Protein Blend");
  await page.locator('[name="supplementAmount"]').fill("35");
  await page.locator('[name="supplementCalories"]').fill("150");
  await page.locator('[name="supplementCarbs"]').fill("6");
  await page.locator('[name="supplementFat"]').fill("3");
  await page.locator('[name="supplementAllergens"]').fill("");
  await page.locator("#powder-protein").fill("25");
  await page.locator("#powder-protein").blur();
  await expect(page.locator("#summary-stats")).toContainText("Rice Protein Blend: 25g protein/day");
  await expect(page.locator("#grocery-list")).toContainText("Rice Protein Blend");

  await page.getByText("Variety", { exact: true }).click();
  await page.getByText("Vegetarian", { exact: true }).click();
  await page.locator("#avoid-ingredients").fill("peanut butter");
  await page.locator("#days").fill("3");
  await page.locator("#days").blur();

  const cards = page.locator("#meal-plan .meal-card");
  await expect(cards).toHaveCount(9);
  await expect(page.locator("#meal-plan")).not.toContainText(/chicken|turkey|beef|sirloin steak|salmon|tuna|peanut butter/i);

  const originalMeal = await cards.first().locator("h3").innerText();
  await cards.first().getByRole("button", { name: /^Swap/ }).click();
  await expect(cards.first().locator("h3")).not.toHaveText(originalMeal);
  const swappedMeal = await cards.first().locator("h3").innerText();

  await cards.first().getByRole("button", { name: /^Save/ }).click();
  const grocery = page.locator("#grocery-list input[type=checkbox]").first();
  const groceryKey = await grocery.getAttribute("data-grocery-key");
  await grocery.check();

  await page.reload();
  await expect(cards.first().locator("h3")).toHaveText(swappedMeal);
  await expect(page.locator('[name="supplementLabel"]')).toHaveValue("Rice Protein Blend");
  await expect(page.locator('[name="supplementCalories"]')).toHaveValue("150");
  await expect(page.locator(`input[data-grocery-key="${groceryKey}"]`)).toBeChecked();
  await expect(cards.first().getByRole("button", { name: /^Remove/ })).toBeVisible();

  const convertButton = page.getByRole("button", { name: /move this plan to a named profile/i });
  await convertButton.scrollIntoViewIfNeeded();
  await convertButton.click();
  await page.locator("#auth-username").fill("Browser Test");
  await page.getByRole("button", { name: "Move guest plan" }).click();
  await expect(page.getByText("Browser Test", { exact: true }).first()).toBeVisible();
  await expect(cards.first().locator("h3")).toHaveText(swappedMeal);

  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "Download" }).click();
  const download = await downloadEvent;
  const downloadPath = testInfo.outputPath("prepfit-plan.txt");
  await download.saveAs(downloadPath);
  expect((await require("node:fs/promises").stat(downloadPath)).size).toBeGreaterThan(100);

  await page.emulateMedia({ media: "print" });
  await expect(page.locator("#meal-plan")).toBeVisible();
  expect(await page.evaluate(() => matchMedia("print").matches)).toBe(true);
  await page.emulateMedia({ media: "screen" });

  await page.reload();
  await page.waitForFunction(() => navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload({ waitUntil: "domcontentloaded" });
  await expect(cards.first()).toBeVisible();
  await expect(page.getByText("Browser Test", { exact: true }).first()).toBeVisible();
  expect(pageErrors).toEqual([]);
});

test("mobile layout exposes the plan shortcut without horizontal overflow", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto("/");
  await page.getByRole("button", { name: "Continue as guest" }).click();
  await expect(page.locator("#jump-to-plan")).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
  await page.locator("#jump-to-plan").click();
  await expect(page.locator("#plan-heading")).toBeInViewport();
  await context.close();
});
