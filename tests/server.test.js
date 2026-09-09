const assert = require("node:assert/strict");
const net = require("node:net");
const path = require("node:path");
const { spawn } = require("node:child_process");

function availablePort() {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

function waitForReady(process) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error("Java server did not start")), 10000);
    process.stdout.on("data", (chunk) => {
      if (String(chunk).includes("Meal planner running")) {
        clearTimeout(timeout);
        resolve();
      }
    });
    process.once("exit", (code) => {
      clearTimeout(timeout);
      reject(new Error(`Java server exited early with status ${code}`));
    });
  });
}

(async () => {
  const classes = process.argv[2];
  assert.ok(classes, "Pass the compiled Java class directory");
  const port = await availablePort();
  const server = spawn("java", ["-cp", path.resolve(classes), "Main", String(port)], {
    cwd: path.join(__dirname, ".."),
    stdio: ["ignore", "pipe", "inherit"],
  });

  try {
    await waitForReady(server);
    const base = `http://localhost:${port}`;
    const manifest = await fetch(`${base}/manifest.webmanifest`);
    assert.equal(manifest.status, 200);
    assert.match(manifest.headers.get("content-type"), /^application\/manifest\+json/);
    assert.equal((await manifest.json()).scope, "./");

    const serviceWorker = await fetch(`${base}/service-worker.js`);
    assert.equal(serviceWorker.status, 200);
    assert.match(serviceWorker.headers.get("content-type"), /^application\/javascript/);

    const appModule = await fetch(`${base}/modules/groceries.js`);
    assert.equal(appModule.status, 200);
    assert.match(appModule.headers.get("content-type"), /^application\/javascript/);

    const head = await fetch(`${base}/index.html`, { method: "HEAD" });
    assert.equal(head.status, 200);
    assert.equal(await head.text(), "");

    assert.equal((await fetch(`${base}/src/Main.java`)).status, 404);
    assert.equal((await fetch(`${base}/package.json`)).status, 404);
    assert.equal((await fetch(`${base}/`, { method: "POST" })).status, 405);
    console.log("PASS: Java server MIME types, HEAD, methods, and public-file boundary");
  } finally {
    server.kill("SIGTERM");
  }
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
