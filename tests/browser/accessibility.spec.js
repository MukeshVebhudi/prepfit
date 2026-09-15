const { test, expect } = require("@playwright/test");
const AxeBuilder = require("@axe-core/playwright").default;

const viewports = {
  desktop: { width: 1440, height: 1000 },
  mobile: { width: 390, height: 844 },
};

for (const [viewportName, viewport] of Object.entries(viewports)) {
  for (const theme of ["daylight", "evening"]) {
    test(`${viewportName} ${theme} planner has no axe violations`, async ({ browser }) => {
      const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.goto("/");
      await page.getByRole("button", { name: "Continue as guest" }).click();
      const expectedTheme = theme === "daylight" ? "morning" : "evening";
      if ((await page.locator("body").getAttribute("data-theme")) !== expectedTheme) {
        await page.locator("#theme-toggle").click();
        await page.waitForTimeout(500);
      }
      await expect(page.locator("body")).toHaveAttribute("data-theme", expectedTheme);
      await expect(page.locator("#meal-plan .meal-card").first()).toBeVisible();

      const results = await new AxeBuilder({ page }).analyze();
      expect(results.violations).toEqual([]);
      await context.close();
    });
  }
}
