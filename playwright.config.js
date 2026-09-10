const { defineConfig, devices } = require("@playwright/test");
const live = process.env.PREPFIT_LIVE === "1";

module.exports = defineConfig({
  testDir: "./tests/browser",
  testMatch: live ? "live.spec.js" : "app.spec.js",
  fullyParallel: false,
  workers: 1,
  timeout: 90_000,
  expect: { timeout: 8_000 },
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: live ? process.env.PREPFIT_BASE_URL : "http://127.0.0.1:4173",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  webServer: live
    ? undefined
    : {
        command: "bash scripts/start-browser-server.sh",
        url: "http://127.0.0.1:4173/",
        reuseExistingServer: false,
        timeout: 30_000,
      },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
