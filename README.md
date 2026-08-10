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
├── plan-math.js
├── app.js
├── manifest.webmanifest
├── service-worker.js
├── assets
│   └── prepfit-icon.svg
├── tests
│   ├── data-integrity.test.js
│   └── plan-math.test.js
└── src
    └── Main.java
```

## Notes

- Accounts are local browser profiles stored in `localStorage`. A "Try it now as a guest" option on
  the sign-in screen skips account creation entirely — guest data still persists on the device, and a
  hint on the dashboard offers to convert it to a named profile later.
- The Gmail profile option does not contact Google or use real OAuth.
- Meal recipes and macro estimates live in `recipe-data.js`; the protein-scaling and calorie-capping
  math lives in `plan-math.js`. Both are kept separate from `app.js` so they can be checked by plain
  Node scripts (see Testing) without a bundler or npm dependency. They load as classic `<script>` tags
  before `app.js` (`recipe-data.js` → `plan-math.js` → `app.js`) and share the same global scope, so
  nothing in `app.js` itself had to change to use them.
- The Java server only serves static files from the project root and optional `assets` folder.

## Testing

`recipe-data.js` and `plan-math.js` both export via `module.exports` when run under Node (guarded by
`typeof module !== "undefined"`, so it's a no-op in the browser) — the same pattern used to load them
as plain `<script>` tags in `index.html`, just consumed by `require()` instead. That's what lets these
two dependency-free Node scripts run without a test framework or `package.json`:

```bash
node tests/data-integrity.test.js   # every recipe ingredient has a macro entry and a grocery category
node tests/plan-math.test.js        # protein scaling, calorie capping, and macro aggregation
```

`data-integrity` catches the class of bug that silently under-reports a recipe's protein/calories.
`plan-math` covers the part of the app that actually decides what the numbers on screen are: that
scaling meals toward a protein target lands in range (and clamps instead of overshooting when the
target is unreachable), that the calorie cap never *raises* a meal's calories, and that its 0.72x
floor is respected even when a meal is too dense to fully cap. Both exit non-zero on failure, so
either can be wired into a pre-commit hook or CI step later if desired.

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
