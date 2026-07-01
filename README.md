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

## Project Structure

```text
.
├── index.html
├── styles.css
├── app.js
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
