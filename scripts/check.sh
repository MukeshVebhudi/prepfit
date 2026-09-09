#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

node --check nutrition-data.js
node --check recipe-data.js
node --check plan-math.js
node --check app.js
node --check service-worker.js

node tests/data-integrity.test.js
node tests/nutrition.test.js
node tests/plan-math.test.js
node tests/dietary-restrictions.test.js
node tests/persistence.test.js
node tests/profiles.test.js
node tests/offline.test.js
node tests/usability.test.js

JAVA_OUTPUT="${TMPDIR:-/tmp}/prepfit-java-test"
rm -rf "$JAVA_OUTPUT"
mkdir -p "$JAVA_OUTPUT"
javac -d "$JAVA_OUTPUT" src/Main.java
node tests/server.test.js "$JAVA_OUTPUT"

echo "PrepFit release checks passed."
