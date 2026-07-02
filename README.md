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
├── app.js
├── manifest.webmanifest
├── service-worker.js
├── assets
│   └── prepfit-icon.svg
└── src
    └── Main.java
```

## Notes

- Accounts are local browser profiles stored in `localStorage`.
- The Gmail profile option does not contact Google or use real OAuth.
- Meal recipes and macro estimates are stored directly in `app.js`.
- The Java server only serves static files from the project root and optional `assets` folder.

## Tech Stack

- HTML
- CSS
- Vanilla JavaScript
- Java `com.sun.net.httpserver.HttpServer`
