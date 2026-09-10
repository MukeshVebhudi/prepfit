const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const exists = (file) => fs.existsSync(path.join(root, file));
const fail = (message) => {
  throw new Error(message);
};

const htmlFiles = ["index.html", "nutrition.html"];
const localReferences = new Set();
for (const file of htmlFiles) {
  const html = read(file);
  if (!/^<!doctype html>/i.test(html.trim())) fail(`${file}: missing HTML doctype`);
  if (!/<html[^>]+lang="[^"]+"/i.test(html)) fail(`${file}: missing document language`);
  if (!/<meta[^>]+name="viewport"/i.test(html)) fail(`${file}: missing viewport metadata`);
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const reference = match[1].split(/[?#]/)[0];
    if (!reference || reference.startsWith("#") || /^(?:https?:|mailto:|data:)/.test(reference))
      continue;
    localReferences.add(reference.replace(/^\.\//, ""));
  }
}
for (const reference of localReferences)
  if (!exists(reference)) fail(`Missing HTML asset: ${reference}`);

const manifest = JSON.parse(read("manifest.webmanifest"));
for (const field of ["name", "short_name", "id", "start_url", "scope", "display", "icons"]) {
  if (!manifest[field]) fail(`manifest.webmanifest: missing ${field}`);
}
if (manifest.start_url !== "./" || manifest.scope !== "./" || manifest.id !== "./") {
  fail("Manifest id, start_url, and scope must remain relative for subdirectory deployment");
}
for (const icon of manifest.icons)
  if (!exists(icon.src.replace(/^\.\//, ""))) fail(`Missing manifest icon: ${icon.src}`);

const worker = read("service-worker.js");
const shellMatch = worker.match(/const APP_SHELL = \[([\s\S]*?)\]\.map/);
if (!shellMatch) fail("service-worker.js: APP_SHELL could not be parsed");
const shellAssets = [...shellMatch[1].matchAll(/"\.\/([^"?]*)"/g)].map(
  (match) => match[1] || "index.html",
);
for (const asset of shellAssets) if (!exists(asset)) fail(`Missing service-worker asset: ${asset}`);
for (const reference of localReferences) {
  if (/\.(?:css|js|webmanifest|svg)$/.test(reference) && !shellAssets.includes(reference)) {
    fail(`HTML asset is absent from APP_SHELL: ${reference}`);
  }
}

const packageJson = JSON.parse(read("package.json"));
const readme = read("README.md");
for (const command of [
  "npm test",
  "npm run lint",
  "npm run format:check",
  "npm run coverage",
  "npm run test:browser",
  "npm run test:live",
]) {
  if (!readme.includes(command)) fail(`README.md: missing documented command \`${command}\``);
}
for (const script of [
  "test",
  "lint",
  "format:check",
  "coverage",
  "validate",
  "test:browser",
  "test:live",
]) {
  if (!packageJson.scripts?.[script]) fail(`package.json: missing ${script} script`);
}

console.log(
  `PASS: ${htmlFiles.length} HTML documents, ${localReferences.size} local references, manifest, service-worker shell, and README commands`,
);
