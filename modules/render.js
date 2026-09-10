import { escapeAttr, escapeHtml, groupBy, listWords, plural } from "./utils.js";

export function createRenderer({ dom, cuisines, categories, proteins, categoryByIngredient,
  targetResults, nutritionTargetLabel, formatTargetDelta, formatIngredient, marketHint,
  groceryItemKey, groceryQuantitySignature, getFavorites, getPurchases, getPantry }) {
  const budgetLabel = (value) => ({ standard: "Standard", budget: "Budget", "high-protein": "High protein" }[value] || "Standard");

  function renderSummary(settings, plan, averages, warning) {
    if (!plan.days.length) {
      dom.summaryTitle.textContent = "No matching plan"; dom.summaryText.textContent = warning;
      dom.summaryStats.innerHTML = ""; dom.planStatus.textContent = "No matches";
      dom.planStatus.dataset.status = "unavailable"; return;
    }
    const results = targetResults(averages, settings);
    const outside = results.filter((result) => result.kind !== "near");
    const status = outside.length
      ? { kind: outside.some((result) => result.kind === "under") ? "under" : "over", label: `${outside.length} ${plural("target", outside.length)} outside range` }
      : { kind: "near", label: "All targets near" };
    dom.summaryTitle.textContent = `${settings.days}-day ${settings.mealMode} plan`;
    const activeMealCount = plan.days.reduce((count, day) => count + day.meals.filter((meal) => !meal.removed).length * settings.people, 0);
    dom.summaryText.textContent = warning || `${status.label}. ${settings.people} ${plural("person", settings.people)} with ${activeMealCount} planned meals.`;
    dom.planStatus.textContent = status.label; dom.planStatus.dataset.status = status.kind;
    const stats = [
      ["Duration", `${settings.days} ${plural("day", settings.days)}`], ["People", settings.people],
      ...results.map((result) => [nutritionTargetLabel(result.nutrient), `${Math.round(result.actual)}${result.unit} / ${Math.round(result.target)}${result.unit} (${formatTargetDelta(result)})`]),
      ["Supplement", settings.powderProtein ? `${settings.supplementMode === "custom" ? settings.supplementLabel : "Whey protein powder"}: ${settings.powderProtein}g protein/day` : "Disabled"], ["Cuisine", settings.cuisine === "random" ? "Mixed" : cuisines[settings.cuisine]],
      ["Budget", budgetLabel(settings.budget)], ["Avg calories", Math.round(averages.calories)],
      ["Avg carbs", `${Math.round(averages.carbs)}g`], ["Avg fat", `${Math.round(averages.fat)}g`],
      ["Total meals", activeMealCount], ["Target status", outside.length ? `${outside.length} outside tolerance` : "Within tolerance"],
    ];
    dom.summaryStats.innerHTML = stats.map(([label, value]) => `<div class="stat"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`).join("");
  }

  function renderMeal(meal, dayIndex, mealIndex, servings, servingLabel = servings === 1 ? "person" : "people") {
    const favorites = getFavorites();
    if (meal.removed) return `<article class="meal-card removed-meal"><p class="meal-kicker">${escapeHtml(meal.label)}</p><h3>Meal removed</h3><p class="auth-hint">Restore ${escapeHtml(meal.name)} to add its nutrition and groceries back.</p><div class="meal-actions"><button class="icon-button" type="button" data-action="restore" data-day="${dayIndex}" data-meal="${mealIndex}">Restore meal</button></div></article>`;
    const source = proteins[meal.proteinType]?.source || "mixed protein";
    return `<article class="meal-card"><div class="meal-top"><div class="meal-icon" aria-hidden="true">${meal.label.charAt(0)}</div><div>
      <p class="meal-kicker">${escapeHtml(meal.label)} · ${escapeHtml(cuisines[meal.cuisine] || "Classic")}</p><h3>${escapeHtml(meal.name)}</h3><small>${escapeHtml(source)}</small></div></div>
      <p class="auth-hint">Estimated nutrition per serving; ingredient quantities below cover all listed servings.</p>
      <div class="badge-row" aria-label="Meal macros"><span class="badge protein">${Math.round(meal.macros.protein)}g protein</span><span class="badge calories">${Math.round(meal.macros.calories)} kcal</span><span class="badge carb">${Math.round(meal.macros.carbs)}g carbs</span><span class="badge fat">${Math.round(meal.macros.fat)}g fat</span></div>
      <div class="meal-section"><p class="meal-kicker">Ingredients for ${servings} ${servingLabel}</p><ul>${meal.ingredients.map((item) => `<li>${escapeHtml(formatIngredient(item, servings))}</li>`).join("")}</ul></div>
      <div class="meal-section"><p class="meal-kicker">Prep</p><ol>${meal.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol></div>
      <div class="meal-actions"><button class="icon-button" type="button" data-action="favorite" data-name="${escapeAttr(meal.name)}" aria-label="${favorites.has(meal.name) ? "Remove" : "Save"} ${escapeAttr(meal.name)} ${favorites.has(meal.name) ? "from" : "to"} favorites" aria-pressed="${favorites.has(meal.name)}">${favorites.has(meal.name) ? "Saved" : "Save"}</button>
      <button class="icon-button" type="button" data-action="portion-down" data-day="${dayIndex}" data-meal="${mealIndex}" aria-label="Decrease ${escapeAttr(meal.name)} portion">− Portion</button>
      <span class="portion-value" aria-label="Current portion">${Math.round((meal.portionRatio || 1) * 100)}%</span>
      <button class="icon-button" type="button" data-action="portion-up" data-day="${dayIndex}" data-meal="${mealIndex}" aria-label="Increase ${escapeAttr(meal.name)} portion">+ Portion</button>
      <button class="icon-button" type="button" data-action="swap" data-day="${dayIndex}" data-meal="${mealIndex}" aria-label="Swap ${escapeAttr(meal.label)} ${escapeAttr(meal.name)}">Swap</button>
      <button class="icon-button danger-button" type="button" data-action="remove" data-day="${dayIndex}" data-meal="${mealIndex}" aria-label="Remove ${escapeAttr(meal.label)} ${escapeAttr(meal.name)}">Remove</button></div></article>`;
  }

  function renderMeals(plan, settings) {
    if (!plan.days.length) { dom.mealPlan.innerHTML = `<div class="empty-state">No complete plan matches your choices. Review the unavailable meal types above and change your filters; avoided ingredients will never be added automatically.</div>`; return; }
    if (settings.mealMode === "batch") {
      const day = plan.days[0]; const servings = settings.people * settings.days;
      dom.mealPlan.innerHTML = `<article class="day-card"><div class="day-header"><div><p class="eyebrow">Batch cook set</p><h3>${Math.round(day.macros.protein)}g protein/day · ${Math.round(day.macros.calories)} calories/day</h3><p>Cook once for ${settings.days} ${plural("day", settings.days)} and portion ${servings * 3} total meals.</p></div><div class="badge-row"><span class="badge protein">${servings} ${plural("serving", servings)}</span><span class="badge calories">${settings.budget.replace("-", " ")}</span></div></div><div class="meal-grid">${day.meals.map((meal, index) => renderMeal(meal, 0, index, servings, "batch servings")).join("")}</div></article>`;
      return;
    }
    dom.mealPlan.innerHTML = plan.days.map((day, dayIndex) => `<article class="day-card"><div class="day-header"><div><p class="eyebrow">Day ${day.day}</p><h3>${Math.round(day.macros.protein)}g protein · ${Math.round(day.macros.calories)} calories</h3><p>Unique daily set</p></div><div class="badge-row"><span class="badge protein">${settings.people} ${plural("person", settings.people)}</span><span class="badge calories">${settings.budget.replace("-", " ")}</span></div></div><div class="meal-grid">${day.meals.map((meal, index) => renderMeal(meal, dayIndex, index, settings.people)).join("")}</div></article>`).join("");
  }

  function renderGroceries(groceries) {
    if (!groceries.length) { dom.groceryList.innerHTML = `<p class="empty-state">Generate a plan to see the shopping list.</p>`; return; }
    const groups = groupBy(groceries, "category"); const purchases = getPurchases(); const pantry = getPantry();
    dom.groceryList.innerHTML = categories.filter((category) => groups[category]?.length).map((category) => `<section class="grocery-category"><h3>${category}<span class="badge">${groups[category].length}</span></h3><ul>${groups[category].map((item) => {
      const key = groceryItemKey(item); const checked = purchases.get(key) === groceryQuantitySignature(item);
      const inPantry = pantry.has(key);
      return `<li class="${inPantry ? "is-pantry" : ""}"><label><input type="checkbox" data-grocery-key="${escapeAttr(key)}" ${checked ? "checked" : ""} aria-label="Mark ${escapeAttr(item.name)} purchased" /><span><strong>${escapeHtml(formatIngredient(item, 1))}</strong><small>${escapeHtml(marketHint(item))}</small></span></label><div class="grocery-item-actions"><label><input type="checkbox" data-pantry-key="${escapeAttr(key)}" ${inPantry ? "checked" : ""} /> In pantry</label>${item.manual ? `<button class="link-button" type="button" data-grocery-action="edit" data-manual-id="${escapeAttr(item.id)}">Edit</button><button class="link-button" type="button" data-grocery-action="remove" data-manual-id="${escapeAttr(item.id)}">Remove</button>` : ""}</div></li>`;
    }).join("")}</ul></section>`).join("");
  }

  function renderPrepSchedule(plan, settings) {
    if (!plan.days.length) { dom.prepSchedule.innerHTML = `<p class="empty-state">A prep schedule will appear when a complete plan matches your choices.</p>`; return; }
    const seen = new Set(); const meals = plan.days.flatMap((day) => day.meals).filter((meal) => !meal.removed && !seen.has(meal.name) && seen.add(meal.name));
    const ingredients = new Set(meals.flatMap((meal) => meal.ingredients.map((item) => item.name)));
    const hasSauces = [...ingredients].some((name) => /sauce|salsa|hummus|tzatziki|oil|yogurt/i.test(name));
    const hasGrains = [...ingredients].some((name) => categoryByIngredient[name] === "Grains");
    const hasProduce = [...ingredients].some((name) => ["Produce", "Frozen"].includes(categoryByIngredient[name]));
    const proteinNames = [...ingredients].filter((name) => categoryByIngredient[name] === "Protein");
    const blocks = [
      { title: "Cook proteins", text: proteinNames.length ? `Batch cook ${listWords(proteinNames.slice(0, 4))} first. Use wide pans or sheet trays, cook to safe temperature, then rest before slicing or portioning.` : "Prepare the main protein components first so the rest of the assembly moves quickly." },
      hasGrains && { title: "Cook grains", text: "Start grains and potatoes early. Weigh pasta dry and potatoes raw; measure rice, quinoa, and other grains after cooking in water. Follow the preparation state next to each quantity." },
      hasProduce && { title: "Chop vegetables", text: "Wash, dry, and cut vegetables into similar sizes. Cook sturdy vegetables tender-crisp and keep raw greens separate until serving." },
      { title: "Portion meals", text: `Set out ${settings.days * settings.people * 3} shallow containers or sections. Add carb base first, vegetables second, protein third, then sauce last or on the side. Refrigerate or freeze perishable food within 2 hours.` },
      hasSauces && { title: "Store sauces separately", text: "Pack creamy, yogurt, lemon, hummus, and salsa-style sauces separately. Add them after reheating or right before eating." },
      { title: "Store safely", text: settings.days > 4 ? "Keep the refrigerator at 40°F (4°C) or below. Refrigerate only portions you will eat within 3 to 4 days and freeze the later portions on prep day. Thaw safely in the refrigerator, cold water, or microwave." : "Keep the refrigerator at 40°F (4°C) or below and use refrigerated portions within 3 to 4 days. Freeze anything you will not eat in that window." },
      { title: "Reheat safely", text: "Reheat leftovers to 165°F (74°C), measured with a food thermometer. Cover and stir microwave-heated food for even heating, then add cold greens, yogurt sauces, avocado, or lemon." },
    ].filter(Boolean);
    dom.prepSchedule.innerHTML = blocks.map((block) => `<section class="prep-block"><h3>${escapeHtml(block.title)}</h3><p>${escapeHtml(block.text)}</p></section>`).join("") + `<p class="safety-source">Storage and reheating guidance: <a href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety" target="_blank" rel="noopener">USDA Leftovers and Food Safety</a>.</p>`;
  }

  function renderFavorites() {
    const names = [...getFavorites()].sort();
    dom.favoritesList.innerHTML = names.length ? `<ul>${names.map((name) => `<li>${escapeHtml(name)}</li>`).join("")}</ul>` : `<p class="empty-state">Saved meals will appear here and get priority in future plans.</p>`;
  }
  return { renderFavorites, renderGroceries, renderMeals, renderPrepSchedule, renderSummary };
}
