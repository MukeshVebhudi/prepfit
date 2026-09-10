const fs = require("node:fs");
const path = require("node:path");

function read(root, file) {
  return fs.readFileSync(path.join(root, file), "utf8");
}

function loadAppSources(root) {
  const modules = ["modules/utils.js", "modules/storage.js", "modules/groceries.js", "modules/export.js", "modules/planner.js", "modules/profiles.js", "modules/persistence.js", "modules/render.js"].map((file) =>
    read(root, file).replace(/^import.*\n/gm, "").replace(/^export\s+/gm, ""));
  const app = read(root, "app.js")
    .replace(/^import[\s\S]*?from\s+"[^"]+";\n/gm, "")
    .replace(/^initialize\(\);$/m, "");
  return [...modules, "nutrition-data.js", "recipe-data.js", "plan-math.js"].map((item) =>
    item.endsWith?.(".js") ? read(root, item) : item).concat(app);
}

module.exports = { loadAppSources };
