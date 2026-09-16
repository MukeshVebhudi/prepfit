# Local server tradeoff

PrepFit is a static application. GitHub Pages serves the production files directly, so
`src/Main.java` is development tooling rather than part of the deployed app.

## What the Java server provides

- Running the app does not require Node, npm, or downloaded JavaScript packages. It requires only a
  JDK, then `javac src/Main.java` and `java -cp src Main`.
- The server exposes an explicit set of public root files and approved asset directories. Its path
  checks reject traversal attempts and keep source, tests, repository metadata, and other private
  files unavailable over HTTP.
- `tests/server.test.js` verifies allowed files, MIME types, `HEAD` behavior, unsupported methods,
  missing files, and path-traversal rejection.

## Cost of keeping it

The repository maintains Java and its HTTP tests solely for local development. This adds a second
language and test surface even though production hosting does not use that code. Every new public
root asset must also be added to the server allowlist.

## Alternatives

`python3 -m http.server` is concise and needs no project dependency when Python is already
installed. When run from the repository root, however, it can expose files that the Java allowlist
keeps private. It would need to serve a separately prepared public directory to retain that
boundary.

`npx serve` is also simple, but it requires Node/npm and may download a package unless its version
is pinned and installed. Serving the repository root has the same public-file boundary concern.

## Recommendation

Keep the Java server for now. Its allowlist and existing tests provide a useful local security
boundary at a small, known maintenance cost. Replace it only after adding a documented command that
serves a prepared public-only directory and deciding that removing the Java toolchain from local
development and CI is worth the migration. Do not delete `src/Main.java` or `tests/server.test.js`
without that owner decision.
