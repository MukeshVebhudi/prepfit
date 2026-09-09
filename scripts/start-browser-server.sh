#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
JAVA_OUTPUT="${TMPDIR:-/tmp}/prepfit-browser-server"
rm -rf "$JAVA_OUTPUT"
mkdir -p "$JAVA_OUTPUT"
javac -d "$JAVA_OUTPUT" src/Main.java
exec java -cp "$JAVA_OUTPUT" Main 4173
