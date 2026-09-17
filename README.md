# PrepFit

A static meal prep planner with nutrition targets, dietary filters, editable meals,
grocery lists, prep schedules, favorites, and print/text export. Built with HTML,
CSS, and vanilla JavaScript; no application build or backend is required.

[Open PrepFit](https://mukeshvebhudi.github.io/prepfit/)

## Run locally

From the project root, with a JDK installed (Java 21 is used in CI):

```bash
javac src/Main.java
java -cp src Main
```

Open [localhost:8080](http://localhost:8080/). To use another port, run
`java -cp src Main 3000`. Stop the server with Ctrl+C.

## Development checks

Use Node.js 22 and Java 21:

```bash
npm ci
npm run release
npx playwright install chromium
npm run test:browser
```

`release` runs formatting, lint, static-file validation, regression tests, and
plan-math coverage. Browser tests cover planning, persistence, export, offline use,
and accessibility. Individual commands:

```bash
npm test
npm run lint
npm run format:check
npm run validate
npm run coverage
```

Use `npm run test:live` to check the deployed site after a release.

## Editing the app

- `app.js` wires the UI; `modules/` contains planning, storage, rendering, and export logic.
- `index.html` and `styles*.css` define the interface.
- `recipe-data.js`, `nutrition-data.js`, and `plan-math.js` define recipes and nutrition calculations.
- After editing nutrition data, run `node scripts/render-nutrition-reference.js` to refresh `nutrition.html`.
- When changing cached app files, increment `CACHE_VERSION` in `service-worker.js`.
  Add new public assets to its `APP_SHELL` and the allowlist in `src/Main.java`.

## Storage and offline use

Profiles, plans, and shopping progress stay in this browser's local storage. Profiles
are local labels, with no login or cloud sync; clearing browser data removes them.
After an online visit, the app supports offline use. On Android, open the live site
in Chrome and use **Add to Home screen** to install it.

Nutrition values are estimates. See [nutrition sources and calculation notes](NUTRITION.md).
