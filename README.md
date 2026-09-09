# PrepFit

> Development roadmap: see [Phase 2 improvement plan and implementation prompts](#phase-2-improvement-plan-and-implementation-prompts)
> for the next improvements identified in the September 9, 2026 code review.

PrepFit is a lightweight meal prep planner that generates high-protein batch cooking plans, macros, grocery lists, prep schedules, favorites, and legible multi-page printouts.

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
│   ├── offline.test.js
│   ├── plan-math.test.js
│   ├── persistence.test.js
│   ├── profiles.test.js
│   ├── server.test.js
│   └── usability.test.js
├── scripts
│   ├── check.sh
│   └── render-nutrition-reference.js
└── src
    └── Main.java
```

## Notes

- Profiles are local labels stored in `localStorage`; they are not secure accounts and do not sync.
  Guest data persists in the same browser and can be moved intact to a named profile.
- Meal recipes and macro estimates live in `recipe-data.js`; target fitting, portion bounds, and
  nutrition tolerances live in `plan-math.js`. Both are kept separate from `app.js` so they can be checked by plain
  Node scripts (see Testing) without a bundler or npm dependency. They load as classic `<script>` tags
  before `app.js` (`recipe-data.js` → `plan-math.js` → `app.js`) and share the same global scope, so
  nothing in `app.js` itself had to change to use them.
- The Java server only serves static files from the project root and optional `assets` folder.

## Testing

Run the complete release suite from the repository root:

```bash
bash scripts/check.sh
```

The command checks JavaScript syntax and runs the dietary, nutrition, target-math, persistence,
profile-migration, offline-cache, accessibility/usability, and Java HTTP-server tests. It compiles
Java into a temporary directory and exits non-zero on any failure. The Java server test binds a
temporary loopback port, so restricted shells may need permission for local networking.

[GitHub Actions](.github/workflows/verify.yml) runs this same command with Node 22 and Java 21 on
every push and pull request. The production app still has no npm package or build dependency.

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- Java `com.sun.net.httpserver.HttpServer`

## Release readiness

**Readiness rating: 8.5/10 — ready for a public web beta after deployment verification.**

The September 9, 2026 release suite passes locally. It covers all original repair areas: mandatory
dietary filtering, unit-aware nutrition, multi-target planning, exact persistence, local-profile
migration, scoped offline caching, accessibility structure, food-safety copy, and the Java server.
A headless Chromium journey also passed guest entry, vegetarian and ingredient exclusions,
generation, swap, favorite, grocery checkoff, reload, guest conversion, offline revisit, text
download, and a multi-page PDF.

Before calling the Android wrapper or nutrition experience production-ready:

- Deploy to the intended HTTPS URL and confirm the newly added GitHub Actions workflow passes there.
- Test installation and an offline launch on a physical Android device.
- Replace the Digital Asset Links signing fingerprint placeholder before building a Trusted Web
  Activity.
- Treat nutrition as planning estimates based on the documented references, not medical advice or
  a substitute for packaged-food labels.
- Remember that profiles are local browser organization without authentication, backup, or sync.

Manual browser checklist for future releases:

1. At 1440×1000 and 390×844, open a guest plan in both themes and confirm there is no horizontal
   page overflow.
2. Navigate controls by keyboard, confirm focus remains visible, and enable reduced motion.
3. Generate batch and variety plans with exclusions, swap and favorite a meal, check a grocery
   item, reload, and confirm the exact state remains.
4. Convert the guest to a named profile, switch profiles, and verify isolation.
5. Revisit once offline after an online load, then download the text plan and print to PDF.

## Phase 2 improvement plan and implementation prompts

Review date: September 9, 2026. The original repair plan is complete. This roadmap addresses the
remaining code-quality, product-depth, and release work identified in the codebase review. Complete
the steps in order because later browser, feature, and deployment work should build on the cleaner
module boundaries established in Step 1.

For every step, preserve existing behavior, run `bash scripts/check.sh`, add focused tests for new
behavior, and update this checklist only after the completion criteria pass. Keep the app usable as
a static site and avoid adding a framework unless a later measured need justifies it.

### Phase 2 progress checklist

- [x] 1. Split the application into focused JavaScript modules
- [ ] 2. Run real-browser journeys in GitHub Actions
- [ ] 3. Expand and validate the recipe catalog
- [ ] 4. Improve nutrition feedback and customization
- [ ] 5. Make groceries more practical
- [ ] 6. Add direct plan editing and better recovery controls
- [ ] 7. Add code-quality gates and prepare a verified deployment

### 1. Split the application into focused JavaScript modules

Completed September 9, 2026. `app.js` was reduced from 1,420 to 715 lines and now coordinates
initialization, DOM events, form state, and session transitions. Focused modules own utilities,
guarded storage, profile data and migration, plan persistence and validation, meal planning,
groceries, rendering, and export. They use explicit ES-module imports and small dependency-injected
APIs; the planning, persistence, grocery, profile, and formatting logic can run in the Node test
harness without a browser DOM.

The Java server now serves JavaScript files beneath `modules/` while continuing to block private
project directories. The service-worker app shell includes every module under cache version `v9`.
Existing storage keys and planner schema version remain unchanged. The release suite passed, and a
Chromium journey verified dietary generation, swap, favorite, grocery checkoff, reload, exact guest
conversion, download, PDF output, and offline revisit without page errors.

Move profile management, persistence, plan generation, grocery calculations, rendering, and export
logic out of the roughly 1,300-line `app.js`. Give each module a small public API, keep DOM wiring in
one entry point, and replace implicit script-order globals with explicit imports. Update the service
worker asset list and test harness for the new files.

**Completion criteria:**

- `app.js` is a small entry point that coordinates focused modules.
- Business logic can run without a browser DOM and DOM code does not own storage or plan math.
- Modules communicate through explicit imports and exported functions rather than new globals.
- Existing storage keys and schemas remain backward compatible.
- The complete regression suite and manual core journey still pass.

```text
Implement Phase 2 Step 1 of the PrepFit README improvement plan. Refactor the
current app.js into focused ES modules for profiles, persistence, planning,
groceries, rendering, and export, with a small browser entry point. Preserve all
current behavior, localStorage schemas, offline support, and static hosting. Update
the service-worker asset list and Node test harness as needed. Add tests only where
module boundaries expose meaningful behavior. Run bash scripts/check.sh and verify
the core browser journey before marking the checklist complete.
```

### 2. Run real-browser journeys in GitHub Actions

Add Playwright as development tooling and run a compact Chromium suite against the real Java server.
Cover the user paths that DOM-mocked tests cannot prove, while keeping the faster unit and server
checks as the first CI stage.

**Completion criteria:**

- CI installs a pinned browser version and starts the app on an isolated port.
- Tests cover generation, restrictions, swap, favorite, grocery progress, reload, profile conversion,
  download, print preparation, and an offline revisit.
- At least one mobile viewport checks the plan shortcut and horizontal overflow.
- Failed browser tests retain useful traces or screenshots as CI artifacts.
- Unit/server checks remain fast and browser checks cannot silently skip.

```text
Implement Phase 2 Step 2 of the PrepFit README improvement plan. Add a pinned,
minimal Playwright setup that starts the Java server and tests PrepFit in Chromium.
Automate the existing release journey plus a mobile viewport and offline revisit.
Make GitHub Actions upload traces or screenshots on failure, and ensure browser
tests fail clearly if the server or browser is unavailable. Keep unit and server
checks as fast earlier stages. Document local commands and mark the step complete
only after the full release command and browser suite pass.
```

### 3. Expand and validate the recipe catalog

Reduce repeated template meals by adding meaningfully different recipes across cuisines, dietary
patterns, meal types, and cooking methods. Keep ingredient units and nutrition estimates tied to the
documented reference model, and make the generator avoid repetitive weekly combinations.

**Completion criteria:**

- Each supported dietary pattern has useful breakfast, lunch, and dinner variety.
- Similar recipes do not dominate one generated week unless constraints leave no alternative.
- New recipes include practical quantities, safe instructions, allergens, and normalized nutrition.
- Catalog validation rejects duplicate IDs, missing fields, bad units, and impossible nutrition values.
- Dietary and nutrition regression tests cover every added recipe.

```text
Implement Phase 2 Step 3 of the PrepFit README improvement plan. Audit the recipe
catalog for repeated templates and weak dietary coverage, then add varied recipes
across meal types, cuisines, and preparation methods. Preserve mandatory dietary
filtering and unit-aware nutrition. Improve weekly selection so near-duplicate
meals are avoided when alternatives exist. Validate IDs, fields, units, allergens,
instructions, and nutrition ranges for the entire catalog. Run all checks and
document the resulting coverage before completing the step.
```

### 4. Improve nutrition feedback and customization

Show users why a target could not be met and which constraint limited the plan. Add useful nutrition
signals such as fiber and sodium where source data is reliable, and allow supplement nutrition to be
configured rather than assuming one fixed product.

**Completion criteria:**

- Infeasible plans identify the limiting target or dietary/catalog constraint in plain language.
- Per-meal and daily summaries use the same calculation path as weekly totals.
- Fiber and sodium are included only after their data and units pass catalog validation.
- Users can edit or disable supplement nutrition, with bounded inputs and exact persistence.
- Existing plans migrate safely when new nutrition fields are absent.

```text
Implement Phase 2 Step 4 of the PrepFit README improvement plan. Improve target
feedback so an infeasible plan explains the limiting nutrition or catalog
constraint. Add per-meal consistency and, where validated source data supports it,
fiber and sodium totals. Replace fixed supplement assumptions with bounded,
persisted user settings that can be disabled. Preserve older saved plans through
schema migration, extend meaningful tests, and complete the step only after the
release suite and browser journey pass.
```

### 5. Make groceries more practical

Turn the generated ingredient list into a shopping workflow by grouping compatible units, allowing
pantry items and manual additions, and supporting quantities that match common package decisions
without pretending to know live store inventory or pricing.

**Completion criteria:**

- Compatible quantities combine predictably and incompatible units remain separate.
- Users can mark pantry staples, add/edit/remove custom items, and retain checkmarks after reload.
- Regenerating a plan explains which manual items remain and resets only changed generated items.
- Grocery export and print include the same state shown on screen.
- Migrations preserve existing grocery progress.

```text
Implement Phase 2 Step 5 of the PrepFit README improvement plan. Improve the
grocery workflow with safe unit aggregation, pantry-item controls, and persisted
manual items. Define clear behavior when a plan is regenerated, and keep on-screen,
downloaded, and printed grocery data consistent. Migrate existing progress without
loss and test aggregation, quantity changes, manual items, persistence, profile
isolation, and export before marking the step complete.
```

### 6. Add direct plan editing and better recovery controls

Let users replace, remove, restore, or adjust an individual meal without regenerating the whole week.
Every edit should immediately recompute nutrition and groceries, with undo available for accidental
changes.

**Completion criteria:**

- A meal can be swapped, removed, restored, or portion-adjusted within safe bounds.
- Nutrition warnings and grocery quantities update from the edited plan.
- Undo restores the exact prior plan and grocery state for the current session.
- Saved plans restore all edits after reload and profile switching.
- Dietary restrictions remain mandatory for every replacement path.

```text
Implement Phase 2 Step 6 of the PrepFit README improvement plan. Add direct meal
editing for swap, remove, restore, and bounded portion adjustment. Recompute all
nutrition and grocery state from the resulting plan, preserve dietary restrictions,
and provide session undo for accidental edits. Persist the exact edited plan and
test reload, profile isolation, groceries, targets, restrictions, and undo. Verify
the controls on desktop, mobile, keyboard, and print before completing the step.
```

### 7. Add code-quality gates and prepare a verified deployment

Add lightweight formatting, linting, coverage reporting, and static-document validation. Then deploy
the PWA to its intended HTTPS subdirectory and verify the live installation boundary. Android signing
and Play Console publishing remain separate actions that require owner credentials.

**Completion criteria:**

- Pinned formatter and linter rules run locally and in CI without obscuring application behavior.
- Coverage highlights untested decision paths without enforcing an arbitrary percentage initially.
- HTML, manifest, service-worker asset references, and README commands are checked.
- GitHub Actions passes on the pushed commit and the HTTPS deployment loads from its real subdirectory.
- Live manifest, service worker update, offline launch, and storage persistence are verified.

```text
Implement Phase 2 Step 7 of the PrepFit README improvement plan. Add minimal,
pinned formatting, linting, coverage reporting, and static HTML/manifest/asset
validation to the release command and GitHub Actions. Fix actionable findings.
Prepare and verify deployment at the intended HTTPS subdirectory, including live
manifest paths, service-worker updates, offline launch, and saved-data persistence.
Do not create signing keys, publish to Google Play, or replace owner credentials.
Record CI and live-site evidence, remaining Android work, and an updated codebase
and release-readiness rating.
```

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
