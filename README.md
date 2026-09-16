# PrepFit

PrepFit is a lightweight meal prep planner that generates high-protein batch cooking plans, macros, grocery lists, prep schedules, favorites, and legible multi-page printouts.

The app is built with plain HTML, CSS, vanilla JavaScript, and a small Java static file server. It
does not use React, Maven, Gradle, external APIs, or a database. npm provides development checks and
Playwright browser tests but is not required to run the app.

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
- Local browser profiles for separate saved plans
- Morning and evening themes
- Print-ready meal plans and shopping lists
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

See [Local server tradeoff](docs/LOCAL_SERVER.md) for why the repository currently keeps the Java
server, the simpler alternatives, and the condition under which replacing it would make sense.

## Quality checks

Install the pinned development tools with `npm ci`, then run:

```bash
npm test
npm run format:check
npm run lint
npm run coverage
npm run test:browser
npm run test:live
```

`npm run release` runs formatting, lint, static-reference validation, the release tests, and coverage.
Coverage is reported for `plan-math.js`, whose direct Node tests provide accurate source mapping,
without enforcing an arbitrary percentage gate. Module and browser behavior remains covered by the
VM integration tests and Playwright journey.

`npm run test:live` verifies the deployed GitHub Pages PWA at
`https://mukeshvebhudi.github.io/prepfit/`, including its subdirectory scope, manifest, service
worker, saved settings, and offline relaunch. Run it after Pages finishes deploying from `main`.

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
├── package.json
├── package-lock.json
├── playwright.config.js
├── modules
│   ├── export.js
│   ├── groceries.js
│   ├── persistence.js
│   ├── planner.js
│   ├── profiles.js
│   ├── render.js
│   ├── storage.js
│   └── utils.js
├── manifest.webmanifest
├── service-worker.js
├── .github
│   └── workflows
│       └── verify.yml
├── assets
│   └── prepfit-icon.svg
├── tests
│   ├── data-integrity.test.js
│   ├── browser
│   │   └── app.spec.js
│   ├── offline.test.js
│   ├── plan-math.test.js
│   ├── persistence.test.js
│   ├── profiles.test.js
│   ├── server.test.js
│   └── usability.test.js
├── scripts
│   ├── check.sh
│   ├── start-browser-server.sh
│   └── render-nutrition-reference.js
└── src
    └── Main.java
```

## Notes

- Profiles are local labels stored in `localStorage`; they are not secure accounts and do not sync.
  Guest data persists in the same browser and can be moved intact to a named profile.
- Meal recipes and macro estimates live in `recipe-data.js`; target fitting and portion bounds live
  in `plan-math.js`. Focused ES modules under `modules/` handle planning, profiles, persistence,
  groceries, rendering, export, storage, and utilities. No bundler or application build is required.
- The Java server serves approved static files from the project root plus `assets`, `modules`, and
  `.well-known`; tests and other project files remain private.

## Testing

Run the complete release suite from the repository root:

```bash
bash scripts/check.sh
```

The command checks JavaScript syntax and runs the dietary, nutrition, target-math, persistence,
profile-migration, offline-cache, accessibility/usability, and Java HTTP-server tests. It compiles
Java into a temporary directory and exits non-zero on any failure. The Java server test binds a
temporary loopback port, so restricted shells may need permission for local networking.

Install and run the pinned Chromium journey suite:

```bash
npm ci
npx playwright install chromium
npm run test:browser
```

Playwright starts the Java server automatically on an isolated port. Failure output is written to
`test-results/`, including screenshots, videos, and traces. CI uploads those files as a seven-day
artifact when the browser job fails.

[GitHub Actions](.github/workflows/verify.yml) runs this same command with Node 22 and Java 21 on
every push and pull request. The production app still has no npm package or build dependency.

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- Java `com.sun.net.httpserver.HttpServer`

## Remaining work

- [ ] On a physical Android phone, install PrepFit from
      `https://mukeshvebhudi.github.io/prepfit/`, open it once online, then confirm it reopens with the
      saved plan in airplane mode.
- [ ] Connect that phone to the Mac with USB debugging enabled, install
      `../PrepFit-Android/app-release-signed.apk`, and verify launch, navigation, persistence, and offline
      relaunch.
- [ ] Back up `../PrepFit-Android/android.keystore` and `.keystore-password` in an owner-controlled
      secure location. These files are intentionally excluded from Git and are required to sign updates.
- [ ] Create the Google Play listing, upload `../PrepFit-Android/app-release-bundle.aab`, complete Play
      Console validation, and publish when the owner approves the release.

The Android package name is `com.mukeshvebhudi.prepfit`. Its release certificate fingerprint is
served from `.well-known/assetlinks.json`, and the signed APK has already passed Android `apksigner`
verification.
