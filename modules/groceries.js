import { groupBy } from "./utils.js";
import { displayMass, massInGrams } from "./units.js";

export function createGroceryTools({
  categories,
  categoryByIngredient,
  nutrition,
  ingredientGrams,
  nutritionUnit,
  supplementalPowderIngredient,
  getUnitSystem = () => "metric",
}) {
  function normalizeUnit(unit) {
    const normalized = String(unit || "").toLowerCase();
    return (
      { cups: "cup", cloves: "clove", slices: "slice", cans: "can", scoops: "scoop" }[normalized] ||
      normalized
    );
  }

  function displayUnit(unit, amount) {
    if (Math.abs(amount - 1) < 0.001) return unit;
    return (
      {
        cup: "cups",
        clove: "cloves",
        slice: "slices",
        can: "cans",
        scoop: "scoops",
        bag: "bags",
        bottle: "bottles",
        box: "boxes",
        jar: "jars",
        pack: "packs",
        count: "count",
        tbsp: "tbsp",
        tsp: "tsp",
        oz: "oz",
        g: "g",
        kg: "kg",
        lb: "lb",
        ml: "ml",
        l: "l",
      }[unit] || unit
    );
  }

  function formatAmount(value) {
    if (value > 0 && value < 0.01) return "<0.01";
    return Number(value.toFixed(2)).toString();
  }

  function formatIngredient(ingredient, multiplier) {
    const amount = ingredient.amount * multiplier;
    const unit = normalizeUnit(ingredient.unit);
    if (ingredient.manual) {
      if (["g", "kg", "oz", "lb"].includes(unit))
        return `${displayMass(massInGrams(amount, unit), getUnitSystem(), formatAmount)} ${ingredient.name}`;
      return `${formatAmount(amount)} ${displayUnit(normalizeUnit(ingredient.unit), amount)} ${ingredient.name}`;
    }
    if (ingredient.customSupplement)
      return `${displayMass(amount, getUnitSystem(), formatAmount)} ${ingredient.name} (use product label)`;
    const grams = ingredientGrams({ ...ingredient, amount });
    const normalizedUnit = nutritionUnit(ingredient.unit);
    const isMass = ["g", "kg", "oz", "lb"].includes(normalizedUnit);
    const quantity = isMass
      ? displayMass(grams, getUnitSystem(), formatAmount)
      : `${formatAmount(amount)} ${displayUnit(normalizedUnit, amount)}`;
    const weight = isMass ? "" : `; ${displayMass(grams, getUnitSystem(), formatAmount)}`;
    const purpose = ingredient.componentOf ? `; for ${ingredient.componentOf}` : "";
    return `${quantity} ${ingredient.name} (${nutrition[ingredient.name].preparation}${weight}${purpose})`;
  }

  function marketHint(ingredient) {
    if (ingredient.manual) return "Custom shopping item.";
    if (ingredient.customSupplement)
      return "Buy enough product for the configured daily weight; verify its label and allergen statement.";
    const reference = nutrition[ingredient.name];
    if (reference.preparation.startsWith("cooked")) {
      return "Cook enough to yield this cooked weight, or buy ready-cooked. Raw/dry purchase weight depends on cooking yield.";
    }
    if (ingredient.name === "canned tuna")
      return "Required drained weight. Compare the drained grams on your can; can sizes vary.";
    if (ingredient.name === "protein pasta")
      return "Buy this dry weight; nutrition uses Barilla Protein+ Penne.";
    return (
      reference.note ||
      "Use the preparation state shown; compare packaged products with the reference nutrition."
    );
  }

  function groceryItemKey(item) {
    if (item.manual) return `manual:${item.id}`;
    return `${item.name.toLowerCase()}|${normalizeUnit(item.unit)}`;
  }

  function groceryQuantitySignature(item) {
    return Number(item.amount).toFixed(3);
  }

  function reconcilePurchases(groceries, purchases) {
    const next = new Map();
    groceries.forEach((item) => {
      const key = groceryItemKey(item);
      const signature = groceryQuantitySignature(item);
      if (purchases.get(key) === signature) next.set(key, signature);
    });
    return next;
  }

  function aggregateGroceries(days, people, supplement = 0) {
    const map = new Map();
    function add(ingredient) {
      const amount = ingredientGrams(ingredient) * people;
      const current = map.get(ingredient.name) || {
        name: ingredient.name,
        unit: "g",
        amount: 0,
        preparation: nutrition[ingredient.name].preparation,
        category: categoryByIngredient[ingredient.name] || "Other",
      };
      current.amount += amount;
      map.set(ingredient.name, current);
    }
    function addCustomSupplement(settings) {
      const name = settings.supplementLabel || "Custom supplement";
      const amount = (Number(settings.supplementAmount) || 0) * people;
      if (!amount) return;
      const current = map.get(name) || {
        name,
        unit: "g",
        amount: 0,
        preparation: "use product label",
        category: "Pantry",
        customSupplement: true,
      };
      current.amount += amount;
      map.set(name, current);
    }
    const settings =
      typeof supplement === "number" ? { powderProtein: supplement } : supplement || {};
    days.forEach((day) => {
      day.meals.filter((meal) => !meal.removed).forEach((meal) => meal.ingredients.forEach(add));
      if (settings.powderProtein) {
        if (settings.supplementMode === "custom") addCustomSupplement(settings);
        else add(supplementalPowderIngredient(settings.powderProtein));
      }
    });
    return [...map.values()].sort((a, b) => {
      const categoryDelta = categories.indexOf(a.category) - categories.indexOf(b.category);
      return categoryDelta || a.name.localeCompare(b.name);
    });
  }

  function combineGroceries(generated, manualItems) {
    return [
      ...generated,
      ...manualItems.map((item) => ({
        ...item,
        manual: true,
        category: "Other",
        preparation: "manual item",
      })),
    ];
  }

  function groceryText(groceries, purchases = new Map(), pantry = new Set()) {
    const groups = groupBy(groceries, "category");
    return categories
      .filter((category) => groups[category]?.length)
      .map((category) => {
        const lines = groups[category]
          .map((item) => {
            const key = groceryItemKey(item);
            const marker = pantry.has(key)
              ? "[pantry]"
              : purchases.get(key) === groceryQuantitySignature(item)
                ? "[x]"
                : "[ ]";
            return `${marker} ${formatIngredient(item, 1)} (${marketHint(item)})`;
          })
          .join("\n");
        return `${category}\n${lines}`;
      })
      .join("\n\n");
  }

  return {
    aggregateGroceries,
    combineGroceries,
    formatIngredient,
    groceryItemKey,
    groceryQuantitySignature,
    groceryText,
    marketHint,
    reconcilePurchases,
  };
}
