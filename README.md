# PrepFit

PrepFit is a lightweight meal prep planner that generates high-protein batch cooking plans, macros, grocery lists, prep schedules, favorites, and print-ready one-page meal plans.

The app is built with plain HTML, CSS, vanilla JavaScript, and a small Java static file server. It does not use React, npm, Maven, Gradle, external APIs, or a database.

## Features

- Batch or variety meal planning
- Protein, calorie, carb, and fat targets
- Cuisine and protein-source filters
- Budget, standard, and high-protein planning modes
- Avoid-ingredient filtering
- Automatic meal generation when inputs change
- Manual shuffle and individual meal swap
- Grocery list grouped by market category
- Practical batch-cooking prep schedule
- Favorites saved in local storage
- Local account profiles for separate saved settings
- Morning and evening themes
- Print-ready one-page meal plan
- Downloadable plan text file

## Run Locally

Compile and start the Java static server:

```bash
javac src/Main.java
java -cp src Main
```

Then open:

```text
http://localhost:8080/
```

You can also use a custom port:

```bash
java -cp src Main 3000
```

Then open:

```text
http://localhost:3000/
```

## Android Web App

PrepFit can run on an Android phone as an installable web app through GitHub Pages.

To publish it from GitHub:

1. Open the repository on GitHub.
2. Go to `Settings -> Pages`.
3. Set `Source` to `Deploy from a branch`.
4. Select branch `main` and folder `/root`.
5. Save.

After GitHub Pages finishes deploying, open the Pages URL in Chrome on Android, then choose:

```text
Menu -> Add to Home screen
```

Chrome will install PrepFit like an app shortcut. Saved settings, local profiles, favorites, and generated plans are stored on that phone through browser storage.

The APK-style Java server is not used on Android. Android uses the static files directly:

- `index.html`
- `styles.css`
- `app.js`
- `manifest.webmanifest`
- `service-worker.js`

## Project Structure

```text
.
├── index.html
├── styles.css
├── recipe-data.js
├── app.js
├── manifest.webmanifest
├── service-worker.js
├── assets
│   └── prepfit-icon.svg
├── tests
│   └── data-integrity.test.js
└── src
    └── Main.java
```

## Notes

- Accounts are local browser profiles stored in `localStorage`. A "Try it now as a guest" option on
  the sign-in screen skips account creation entirely — guest data still persists on the device, and a
  hint on the dashboard offers to convert it to a named profile later.
- The Gmail profile option does not contact Google or use real OAuth.
- Meal recipes and macro estimates live in `recipe-data.js`, kept separate from `app.js` so the data
  can be validated by a plain Node script (see Testing) without a bundler or npm dependency. It's
  loaded as a second classic `<script>` tag before `app.js` and shares the same global scope, so
  nothing in `app.js` had to change to use it.
- The Java server only serves static files from the project root and optional `assets` folder.

## Testing

`recipe-data.js` exports its data via `module.exports` when run under Node (guarded by
`typeof module !== "undefined"`, so it's a no-op in the browser), which lets a dependency-free Node
script check that every ingredient referenced by a recipe has both a macro entry and a grocery
category — the exact class of bug that under-reports a recipe's protein/calories without any visible
error.

```bash
node tests/data-integrity.test.js
```

No test framework or `package.json` required. Exits non-zero on failure, so it can be wired into a
pre-commit hook or CI step later if desired.

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- Java `com.sun.net.httpserver.HttpServer`

## Publish to Google Play

PrepFit can be wrapped as an Android app with a [Trusted Web Activity](https://developer.chrome.com/docs/android/trusted-web-activity/)
(TWA) using [Bubblewrap](https://github.com/GoogleChromeLabs/bubblewrap) — a thin native shell around
the deployed PWA, not a rebuild. This needs the app to already be live over HTTPS (GitHub Pages works)
and a Google Play Console developer account (one-time $25 fee, created by you — not something that
can be automated here).

1. **Deploy first.** Follow the "Android Web App" steps above so `manifest.webmanifest` is reachable
   at a public HTTPS URL, e.g. `https://mukeshvebhudi.github.io/prepfit/manifest.webmanifest`.
2. **Generate the Android project** (via `npx`, so Bubblewrap never becomes a project dependency —
   the app itself still has no npm/build-tool requirement):
   ```bash
   npx @bubblewrap/cli init --manifest=https://mukeshvebhudi.github.io/prepfit/manifest.webmanifest
   ```
   Bubblewrap will ask a few confirmation questions (package name, colors, icon) pre-filled from the
   manifest, and generates all required Android icon sizes automatically from `assets/prepfit-icon.svg`.
3. **Build the signed app bundle:**
   ```bash
   npx @bubblewrap/cli build
   ```
   This creates a release keystore (back it up — losing it means you can't update the app later) and
   produces an `app-release-bundle.aab`.
4. **Verify domain ownership.** Get the release key's SHA-256 fingerprint:
   ```bash
   keytool -list -v -keystore android.keystore -alias android
   ```
   Put it into `.well-known/assetlinks.json` in this repo (a placeholder is already checked in),
   replacing `PLACEHOLDER_SHA256_FINGERPRINT`, then redeploy so it's live at
   `https://mukeshvebhudi.github.io/prepfit/.well-known/assetlinks.json`. Without this file matching,
   the installed app shows browser UI instead of a full-screen native experience.
5. **Upload to Play Console.** Create an app listing at [play.google.com/console](https://play.google.com/console)
   and upload the `.aab` from step 3. This step requires your own developer account.
