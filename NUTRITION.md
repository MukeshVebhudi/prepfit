# PrepFit nutrition reference contract

Implemented September 9, 2026. Nutrition remains an estimate of reference foods, not a measurement
of a user's meal. This document describes the data and conversion rules; the user-facing
[nutrition reference page](nutrition.html) lists every source, serving, and preparation assumption.

## Data and provenance

- `nutrition-data.js` supplies explicit reference amounts in **grams**, the four displayed nutrients,
  preparation states, selected household weights, source titles/URLs, and the date checked.
- Generic food values were extracted from the official
  [USDA SR Legacy April 2018 JSON archive](https://fdc.nal.usda.gov/fdc-datasets/FoodData_Central_sr_legacy_food_json_2018-04.zip),
  linked on the [USDA download page](https://fdc.nal.usda.gov/download-datasets/).
  `tests/fixtures/usda-reference.json` preserves the selected records' nutrient IDs and household
  portions. Tests compare runtime data with that snapshot. The app does not need a USDA API key
  or contact USDA at runtime.
- Manufacturer references: [Sach Original paneer package](https://sachfoods.com/cdn/shop/files/original_2up.jpg?v=1715695052),
  [Barilla Protein+ Penne panel](https://www.foodserviceexpress.com/Images/document/specs/Barilla/BAI-PenneProteinPlus.pdf),
  [Patak's Tikka Masala label](https://www.pataksusa.com/wp-content/uploads/2023/09/nutritional-tikka-masala-curry-sauce.jpg),
  [Patak's Mild Curry label](https://www.pataksusa.com/wp-content/uploads/2023/09/nutritional-mild-curry-sauce.jpg),
  and [RAGÚ Classic Alfredo](https://www.ragu.com/our-sauces/cheese-sauces/classic-alfredo-sauce/).
  Barilla's panel values also agree with the manufacturer-hosted nutrition iframe linked from its
  [current product page](https://www.barilla.com/en-us/products/pasta/protein-plus/proteinplus-penne).
- The unsupported “light Alfredo” estimate was replaced with a clearly identified Classic Alfredo
  reference. Its milk, egg, and soybean-oil ingredients are reflected in category exclusions.
- Basmati uses a disclosed USDA cooked white long-grain rice proxy. Farro specifically means cooked
  spelt (farro grande), not an undisclosed blend of emmer/einkorn. Baby potatoes use generic raw
  potato with skin; cauliflower rice uses weighed raw cauliflower. These are explicit assumptions.
- Manufacturer label rounding is retained. Patak's protein is reported as **less than 1 g per 64 g**;
  the numeric estimate uses the conservative lower bound zero and retains the exclusive upper bound
  in data. The UI explains that totals can undercount protein by less than 1 g per reference serving.
  No exact missing protein value is invented.

## Conversion rules

1. Convert the supplied amount to edible grams in the reference preparation state.
2. Divide grams by the reference's gram amount.
3. Multiply each reference nutrient by that ratio. Round only for display; scaling preserves six
   decimal places in ingredient quantities instead of imposing a 0.05-unit minimum.

Weight units use 1 lb = 453.59237 g and 1 oz = 28.349523125 g. Volume uses US customary cups,
tablespoons, teaspoons, fluid ounces, mL, and L, consistent with
[NIST conversion tables](https://nvlpubs.nist.gov/nistpubs/Legacy/LC/nbslettercircular1098.pdf):
1 cup = 16 tbsp = 48 tsp = 236.5882365 mL. A mass ounce is never treated as a fluid ounce.

Household-to-weight conversions are ingredient-specific. For example, an olive-oil tablespoon
weighs 13.5 g, a peanut-butter tablespoon 16 g, and the selected salsa tablespoon 18 g. When a USDA
record contains inconsistent rounded household portions, one volume basis is selected and the
others are derived consistently. Salsa uses 2 tbsp = 36 g, so the app's normalized cup is 288 g;
it does not also apply the differently rounded 259 g cup from the same record. Use the displayed
gram quantity for accurate portioning.

No generic density, universal cooked/dry yield, or default 25-calorie fallback remains. Unknown
foods, unsupported measures, negative/nonfinite amounts, and explicit preparation mismatches
throw descriptive errors. Zero amounts return zero nutrients. A Greek-yogurt cup or an unspecified
powder scoop has no documented conversion and is rejected; these recipes now use grams.

Count-like measures are explicit: one large egg is 50 g edible weight, a reference tuna can is
165 g drained solids, a naan piece is 90 g, and a bread slice is 32 g. Other sizes must use grams.
A lemon count represents 48 g of juice yielded, not the mass of an entire lemon.

## Recipes, groceries, and supplements

- Raw/cooked/drained/dry state accompanies ingredient quantities in recipes, groceries, and text
  grocery export. Animal-protein weights are cooked edible amounts; raw purchase yields vary.
- Grains and legumes use cooked/drained weights, except pasta and oats, which use dry weights.
  Recipe instructions explain when to measure. Generic “one pound bag” and “divide by three”
  shopping shortcuts were removed rather than presenting an invented purchase yield.
- `INGREDIENT_BLENDS` defines explicit slaw, fajita vegetables, stir-fry vegetables, tzatziki,
  yogurt sauce, steak seasoning, and masala spice recipes. Components expand into separate weighed
  ingredients before nutrition, exclusions, and shopping aggregation. Each component retains its
  parent mix name so avoiding “slaw mix” still works. Blend ratios are authored recipe choices,
  not USDA claims about a commercial product's composition or the finished mix's volume.
- Instructions use the listed ingredients and water. Any extra oil, butter, seasoning, or topping
  is explicitly optional and outside the estimate; it may conflict with ingredient exclusions.
- Shopping merges equivalent units into grams by ingredient. Nutrition recomputed from the grocery
  amounts equals the complete plan's nutrition multiplied by the number of people.
- Supplemental protein defaults to the generic USDA whey-based powder reference used by recipes,
  not a claim about all brands. Users may instead enter a custom product name, daily product weight,
  protein, calories, carbohydrate, fat, and allergen/category tags from its package label. Custom
  label data stays in the local profile and is not represented as independently verified. Setting
  supplemental protein to zero disables all supplement macros and grocery quantities. Both modes
  participate in target optimization and respect the configured exclusions.

## Verification and maintenance

Fiber and sodium are not displayed because the current reference catalog does not contain validated
values for every ingredient and preparation state. PrepFit will add those totals only after complete
source coverage and unit validation; a partial total would be misleading.

Run:

```bash
node tests/nutrition.test.js
node tests/dietary-restrictions.test.js
node tests/data-integrity.test.js
node tests/plan-math.test.js
```

Nutrition tests include independently computed whole-meal totals, manufacturer serving checks,
the original salsa/pasta/potato errors, mass/volume/count conversions, source snapshots, invalid
units and states, mixed-unit shopping aggregation, and supplement consistency. The generic test
plate is 100 g cooked chicken + 158 g cooked rice + 91 g raw broccoli: 401.34 kcal, 37.8164 g protein,
50.5984 g carbs, and 4.3491 g fat, summed independently from FDC 171477, 168878, and 170379.

After changing references or blend recipes, regenerate the static user-facing source page:

```bash
node scripts/render-nutrition-reference.js
```

Add a source and preparation state for every new ingredient; never silently substitute a reference
with a different preparation state. If a product changes, recheck its label and dietary tags,
update independent expectations where justified, and change the service-worker cache version when
shipping changed assets. Runtime source order is `nutrition-data.js`, `recipe-data.js`,
`plan-math.js`, then `app.js`. All four work without npm or a bundler.

Target fitting uses the explicit portion limits and nutrition tolerances documented in README Step 3.
Local manifest serving and broader service-worker strategy are still Step 6. This step updates the
cache asset list/version for its new files but does not claim those existing offline defects fixed.
