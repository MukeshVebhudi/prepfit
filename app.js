const STORAGE_KEYS = {
  settings: "prepfit-settings-v2",
  favorites: "prepfit-favorites",
  theme: "prepfit-theme",
  accounts: "prepfit-accounts-v1",
  currentAccount: "prepfit-current-account-v1",
};
const PLANNER_SCHEMA_VERSION = 1;

const DEFAULTS = {
  goalMode: "daily",
  proteinGoal: 150,
  powderProtein: 0,
  people: 1,
  days: 5,
  mealMode: "batch",
  meat: "chicken",
  cuisine: "random",
  budget: "standard",
  avoidIngredients: "",
  calorieGoal: 0,
  carbGoal: 0,
  fatGoal: 0,
};

const CUISINES = {
  american: "American",
  mexican: "Mexican",
  italian: "Italian",
  mediterranean: "Mediterranean",
  indian: "Indian",
  asian: "Asian",
};

const CATEGORIES = ["Protein", "Produce", "Grains", "Dairy", "Pantry", "Spices", "Frozen", "Other"];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner"];

const dom = {
  form: document.querySelector("#planner-form"),
  goalLabel: document.querySelector("#goal-label"),
  plannerNote: document.querySelector("#planner-note"),
  mealPlan: document.querySelector("#meal-plan"),
  groceryList: document.querySelector("#grocery-list"),
  prepSchedule: document.querySelector("#prep-schedule"),
  favoritesList: document.querySelector("#favorites-list"),
  summaryTitle: document.querySelector("#summary-title"),
  summaryText: document.querySelector("#summary-text"),
  summaryStats: document.querySelector("#summary-stats"),
  planStatus: document.querySelector("#plan-status"),
  themeToggle: document.querySelector("#theme-toggle"),
  randomize: document.querySelector("#randomize"),
  printPlan: document.querySelector("#print-plan"),
  downloadPlan: document.querySelector("#download-plan"),
  copyGroceries: document.querySelector("#copy-groceries"),
  resetPlan: document.querySelector("#reset-plan"),
  clearFavorites: document.querySelector("#clear-favorites"),
  authView: document.querySelector("#auth-view"),
  authForm: document.querySelector("#auth-form"),
  authUsername: document.querySelector("#auth-username"),
  authSubmit: document.querySelector("#auth-submit"),
  authMessage: document.querySelector("#auth-message"),
  savedProfiles: document.querySelector("#saved-profiles"),
  accountChip: document.querySelector("#account-chip"),
  accountName: document.querySelector("#account-name"),
  logoutAccount: document.querySelector("#logout-account"),
  guestStart: document.querySelector("#guest-start"),
  guestHint: document.querySelector("#guest-hint"),
  guestUpgrade: document.querySelector("#guest-upgrade"),
  jumpToPlan: document.querySelector("#jump-to-plan"),
};

let favorites = new Set();
let currentAccount = null;
let profileAction = "create";
let state = null;
let lastGroceryText = "";
let purchasedItems = new Map();
let storageMessage = "";

initialize();

function initialize() {
  applyTheme(loadTheme());
  migrateLegacyProfiles();
  bindEvents();
  restoreSession();
  registerServiceWorker();
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (!["http:", "https:"].includes(window.location.protocol)) return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js", {
      scope: "./",
      updateViaCache: "none",
    }).catch(() => {
      // The app still works normally if offline caching is unavailable.
    });
  });
}

function bindEvents() {
  const debouncedGenerate = debounce(() => generatePlan(), 220);

  dom.form.addEventListener("submit", (event) => {
    event.preventDefault();
    generatePlan({ shuffle: true });
  });

  dom.form.addEventListener("input", (event) => {
    updateGoalLabel();
    if (event.target.matches("#avoid-ingredients, #calorie-goal, #carb-goal, #fat-goal")) {
      debouncedGenerate();
      return;
    }
    generatePlan();
  });

  dom.form.addEventListener("change", () => {
    updateGoalLabel();
    generatePlan();
  });

  dom.mealPlan.addEventListener("click", handleMealAction);
  dom.groceryList.addEventListener("change", handleGroceryChange);
  dom.randomize.addEventListener("click", () => generatePlan({ shuffle: true }));
  dom.themeToggle.addEventListener("click", toggleTheme);
  dom.printPlan.addEventListener("click", () => window.print());
  dom.downloadPlan.addEventListener("click", downloadPlan);
  dom.copyGroceries.addEventListener("click", copyGroceries);
  dom.resetPlan.addEventListener("click", resetSettings);
  dom.clearFavorites.addEventListener("click", clearFavorites);
  dom.authForm.addEventListener("submit", handleAuthSubmit);
  dom.savedProfiles.addEventListener("click", handleSavedProfileClick);
  dom.logoutAccount.addEventListener("click", logoutAccount);
  dom.guestStart.addEventListener("click", startGuestSession);
  dom.guestUpgrade.addEventListener("click", beginGuestConversion);
}

function restoreSession() {
  const accounts = loadAccounts();
  const id = localStorage.getItem(STORAGE_KEYS.currentAccount);
  if (id && accounts[id]) {
    signIn(accounts[id]);
    return;
  }

  document.body.classList.remove("is-authenticated");
  dom.accountChip.hidden = true;
  dom.accountName.textContent = "Guest";
  renderSavedProfiles();
  setProfileAction("create");
  dom.authUsername.focus();
}

function handleAuthSubmit(event) {
  event.preventDefault();
  const name = displayUsername(dom.authUsername.value);

  if (name.length < 2) {
    showAuthMessage("Use at least 2 characters for the profile name.", "danger");
    return;
  }

  const accounts = loadAccounts();
  if (profileNameExists(accounts, name, profileAction === "convert" ? "guest" : null)) {
    showAuthMessage("A profile with that name already exists in this browser.", "danger");
    return;
  }

  const id = uniqueProfileId(name, accounts);
  const account = { id, name, createdAt: new Date().toISOString() };
  let convertedGuestId = null;
  if (profileAction === "convert" && currentAccount?.guest) {
    if (!copyProfileData(currentAccount.id, id)) {
      showAuthMessage("The guest plan could not be moved because browser storage is unavailable.", "danger");
      return;
    }
    convertedGuestId = currentAccount.id;
    delete accounts[convertedGuestId];
  }
  accounts[id] = account;
  if (!saveAccounts(accounts)) {
    if (convertedGuestId) removeProfileData(id);
    showAuthMessage("The profile could not be saved in this browser.", "danger");
    return;
  }
  if (convertedGuestId) removeProfileData(convertedGuestId);
  renderSavedProfiles();
  signIn(account);
}

function startGuestSession() {
  const accounts = loadAccounts();
  if (!accounts.guest) {
    accounts.guest = { id: "guest", name: "Guest", guest: true, createdAt: new Date().toISOString() };
    if (!saveAccounts(accounts)) {
      showAuthMessage("The guest profile could not be saved in this browser.", "danger");
      return;
    }
    renderSavedProfiles();
  }

  signIn(accounts.guest);
  showAuthMessage("Continuing as a guest on this device.", "success");
}

function handleSavedProfileClick(event) {
  const button = event.target.closest("button[data-account-id]");
  if (!button) return;

  const accounts = loadAccounts();
  const account = accounts[button.dataset.accountId];
  if (!account) {
    renderSavedProfiles();
    showAuthMessage("That saved profile is no longer available.", "danger");
    return;
  }

  signIn(account);
}

function signIn(account) {
  currentAccount = account;
  safeSetItem(STORAGE_KEYS.currentAccount, account.id);
  document.body.classList.add("is-authenticated");
  dom.accountName.textContent = account.name;
  dom.accountChip.hidden = false;
  dom.guestHint.hidden = !account.guest;
  dom.authForm.reset();
  showAuthMessage("");

  favorites = loadAccountFavorites();
  restoreSettings();
  if (!restorePlannerState()) generatePlan({ shuffle: true });
}

function logoutAccount() {
  currentAccount = null;
  state = null;
  favorites = new Set();
  lastGroceryText = "";
  purchasedItems = new Map();
  storageMessage = "";
  safeRemoveItem(STORAGE_KEYS.currentAccount);
  document.body.classList.remove("is-authenticated");
  dom.accountChip.hidden = true;
  dom.accountName.textContent = "Guest";
  dom.guestHint.hidden = true;
  dom.jumpToPlan.hidden = true;
  dom.authForm.reset();
  renderSavedProfiles();
  setProfileAction("create");
  showAuthMessage("Choose a local profile or create another.");
  dom.authUsername.focus();
}

function setProfileAction(action) {
  profileAction = action;
  dom.authSubmit.textContent = action === "convert" ? "Move guest plan" : "Create local profile";
  showAuthMessage(action === "convert"
    ? "Choose a name. The exact guest plan, favorites, and shopping progress will move with it."
    : "Profiles and their plans remain only in this browser.");
}

function beginGuestConversion() {
  if (!currentAccount?.guest) return;
  document.body.classList.remove("is-authenticated");
  setProfileAction("convert");
  dom.authUsername.focus();
}

function showAuthMessage(message, tone = "") {
  dom.authMessage.textContent = message;
  if (tone) {
    dom.authMessage.dataset.tone = tone;
  } else {
    dom.authMessage.removeAttribute("data-tone");
  }
}

function loadAccounts() {
  const saved = parseJson(safeGetItem(STORAGE_KEYS.accounts));
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) return Object.create(null);
  return Object.entries(saved).reduce((accounts, [key, account]) => {
    if (!account || typeof account !== "object") return accounts;
    const id = String(account.id || key);
    accounts[id] = {
      id,
      name: displayUsername(account.name || id) || "Local profile",
      createdAt: account.createdAt || new Date().toISOString(),
      ...(account.guest || id === "guest" ? { guest: true } : {}),
    };
    return accounts;
  }, Object.create(null));
}

function saveAccounts(accounts) {
  return safeSetItem(STORAGE_KEYS.accounts, JSON.stringify(accounts));
}

function renderSavedProfiles() {
  const accounts = Object.values(loadAccounts());
  if (!accounts.length) {
    dom.savedProfiles.innerHTML = "";
    return;
  }

  dom.savedProfiles.innerHTML = `
    <p class="auth-hint">Saved profiles on this browser</p>
    ${accounts.map((account) => `
      <button class="saved-profile-button" type="button" data-account-id="${escapeAttr(account.id)}">
        <span class="profile-avatar" aria-hidden="true">${escapeHtml(profileInitials(account))}</span>
        <span class="profile-meta">
          <strong>${escapeHtml(account.name)}</strong>
          <span>${escapeHtml(account.guest ? "Guest profile in this browser" : "Local profile in this browser")}</span>
        </span>
      </button>
    `).join("")}
  `;
}

function profileInitials(account) {
  const name = account.name || account.id || "PF";
  const cleanName = name.includes("@") ? name.split("@")[0] : name;
  return cleanName
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("") || "PF";
}

function accountStorageKey(type) {
  if (!currentAccount) {
    return STORAGE_KEYS[type];
  }

  return profileStorageKey(currentAccount.id, type);
}

function loadAccountFavorites() {
  const accountKey = accountStorageKey("favorites");
  const saved = parseJson(localStorage.getItem(accountKey));
  if (Array.isArray(saved)) {
    return new Set(saved);
  }

  return loadSet(STORAGE_KEYS.favorites);
}

function displayUsername(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 24);
}

function uniqueProfileId(name, accounts, prefix = "profile") {
  const slug = String(name || "profile").toLowerCase()
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 32) || "profile";
  let id = `${prefix}:${slug}`;
  let suffix = 2;
  while (Object.prototype.hasOwnProperty.call(accounts, id) || isReservedProfileId(id)) {
    id = `${prefix}:${slug}-${suffix}`;
    suffix += 1;
  }
  return id;
}

function profileNameExists(accounts, name, ignoredId = null) {
  const normalized = displayUsername(name).toLowerCase();
  return Object.values(accounts).some((account) =>
    account.id !== ignoredId && displayUsername(account.name).toLowerCase() === normalized);
}

function isReservedProfileId(id) {
  return ["guest", "__proto__", "prototype", "constructor", "toString"].includes(String(id));
}

function profileStorageKey(id, type) {
  return `prepfit-account:${id}:${type}`;
}

function copyProfileData(fromId, toId) {
  for (const type of ["settings", "planner", "favorites"]) {
    const value = safeGetItem(profileStorageKey(fromId, type));
    if (value !== null && !safeSetItem(profileStorageKey(toId, type), value)) return false;
  }
  return true;
}

function removeProfileData(id) {
  let removed = true;
  ["settings", "planner", "favorites"].forEach((type) => {
    if (!safeRemoveItem(profileStorageKey(id, type))) removed = false;
  });
  return removed;
}

function migrateLegacyProfiles() {
  const raw = parseJson(safeGetItem(STORAGE_KEYS.accounts));
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return;
  const migrated = Object.create(null);
  const idChanges = new Map();
  let changed = false;

  Object.entries(raw).forEach(([key, legacy]) => {
    if (!legacy || typeof legacy !== "object") {
      changed = true;
      return;
    }
    const oldId = String(legacy.id || key);
    const name = displayUsername(legacy.name || legacy.email || oldId) || "Local profile";
    const needsSafeId = isReservedProfileId(oldId) && oldId !== "guest";
    const id = needsSafeId ? uniqueProfileId(name, migrated, "legacy") : oldId;
    if (needsSafeId) {
      copyProfileData(oldId, id);
      idChanges.set(oldId, id);
      changed = true;
    }
    if (legacy.passcodeHash || legacy.email || legacy.provider) changed = true;
    migrated[id] = {
      id,
      name,
      createdAt: legacy.createdAt || new Date().toISOString(),
      ...(oldId === "guest" || legacy.guest ? { guest: true } : {}),
    };
  });

  if (changed && saveAccounts(migrated)) {
    const currentId = safeGetItem(STORAGE_KEYS.currentAccount);
    if (idChanges.has(currentId)) safeSetItem(STORAGE_KEYS.currentAccount, idChanges.get(currentId));
  }
}

function generatePlan(options = {}) {
  if (!currentAccount) {
    return;
  }

  const settings = readSettings();
  const settingsSaved = saveSettings(settings);
  updateGoalLabel(settings);

  let plan;
  try {
    plan = buildPlan(settings, options);
  } catch (error) {
    console.error("PrepFit nutrition calculation failed", error);
    plan = { days: [], missingTypes: [], conflict: "Nutrition could not be calculated from the ingredient references. No plan is shown. Check ingredient units and preparation states before trying again." };
  }
  const groceries = aggregateGroceries(plan.days, settings.people, settings.powderProtein);
  const averages = averageMacros(plan.days);
  const warning = buildWarning(plan, settings, averages);
  purchasedItems = reconcilePurchases(groceries, purchasedItems);

  state = { settings, plan, groceries, averages, warning };
  lastGroceryText = groceryText(groceries);
  const planSaved = savePlannerState();
  renderCurrentState(warning || (settingsSaved && planSaved
    ? "Auto-saved. Changes regenerate the plan."
    : "Plan updated, but browser storage could not save it."));
}

function renderCurrentState(note = "") {
  if (!state) return;
  renderSummary(state.settings, state.plan, state.averages, state.warning);
  renderMeals(state.plan, state.settings);
  renderGroceries(state.groceries);
  renderPrepSchedule(state.plan, state.settings);
  renderFavorites();
  dom.plannerNote.textContent = storageMessage || note || state.warning;
  dom.jumpToPlan.hidden = !state.plan.days.length;
  dom.printPlan.disabled = !state.plan.days.length;
  dom.downloadPlan.disabled = !state.plan.days.length;
  dom.copyGroceries.disabled = !state.groceries.length;
}

function readSettings() {
  const data = new FormData(dom.form);
  const days = integerInRange(data.get("days"), DEFAULTS.days, 1, 7);
  const people = integerInRange(data.get("people"), DEFAULTS.people, 1, 8);
  const goalMode = oneOf(data.get("goalMode"), ["daily", "weekly"], DEFAULTS.goalMode);
  const rawProtein = normalizedProteinGoal(data.get("proteinGoal"), goalMode, days, DEFAULTS.proteinGoal);
  const dailyTarget = goalMode === "weekly" ? rawProtein / days : rawProtein;
  dom.form.elements.days.value = days;
  dom.form.elements.people.value = people;
  dom.form.elements.proteinGoal.value = rawProtein;

  return {
    goalMode,
    proteinGoal: rawProtein,
    dailyTarget,
    powderProtein: clamp(numberFrom(data.get("powderProtein"), 0), 0, 140),
    people,
    days,
    mealMode: oneOf(data.get("mealMode"), ["batch", "variety"], DEFAULTS.mealMode),
    meat: oneOf(data.get("meat"), Object.keys(PROTEINS), DEFAULTS.meat),
    cuisine: oneOf(data.get("cuisine"), ["random", ...Object.keys(CUISINES)], DEFAULTS.cuisine),
    budget: oneOf(data.get("budget"), ["standard", "budget", "high-protein"], DEFAULTS.budget),
    avoidIngredients: String(data.get("avoidIngredients") || "").trim(),
    excluded: excludedTerms(data.get("avoidIngredients")),
    calorieGoal: clamp(numberFrom(data.get("calorieGoal"), 0), 0, 4500),
    carbGoal: clamp(numberFrom(data.get("carbGoal"), 0), 0, 600),
    fatGoal: clamp(numberFrom(data.get("fatGoal"), 0), 0, 250),
  };
}

function buildPlan(settings, options = {}) {
  const usedNames = new Set();
  const days = [];
  const seed = options.shuffle ? Math.random() : 0;
  if (settings.powderProtein && !recipeEligible({
    proteinType: "vegetarian", ingredients: [supplementalPowderIngredient(settings.powderProtein)],
  }, "Breakfast", settings)) {
    return { days, missingTypes: [], conflict: "The supplemental whey powder conflicts with your avoided ingredients. Set supplemental protein to zero or change the exclusion; restrictions have not been relaxed." };
  }
  const missingTypes = MEAL_TYPES.filter((type) => !recipeCandidates(type, settings).length);
  if (missingTypes.length) return { days, missingTypes };

  const batch = settings.mealMode === "batch"
    ? selectDayMeals(settings, usedNames, seed) : null;
  for (let day = 1; day <= settings.days; day += 1) {
    const selected = batch || selectDayMeals(settings, usedNames, seed + day);
    selected.meals.forEach((meal) => usedNames.add(meal.name));
    days.push(makeDay(day, selected, settings));
  }
  return { days, missingTypes: [] };
}

function selectDayMeals(settings, usedNames, seed = 0) {
  const candidates = MEAL_TYPES.map((type) =>
    shortlistCandidates(type, recipeCandidates(type, settings), settings, usedNames, seed));
  let best = null;

  candidates[0].forEach((breakfast) => candidates[1].forEach((lunch) => candidates[2].forEach((dinner) => {
    const rawMeals = [breakfast, lunch, dinner].map(cloneRecipe);
    const meals = scaleMealsToTargets(rawMeals, settings);
    const actual = macrosForDay(meals, settings.powderProtein);
    const preference = rawMeals.reduce((sum, meal, index) =>
      sum + recipeScore(meal, MEAL_TYPES[index], settings, usedNames, seed, index), 0);
    const score = targetFitScore(actual, settings) * 100 + preference;
    if (!best || score < best.score) best = { score, meals };
  })));

  return { meals: best.meals };
}

function shortlistCandidates(type, candidates, settings, usedNames, seed) {
  const foodProtein = Math.max(0, settings.dailyTarget - settings.powderProtein) / 3;
  return [...candidates].sort((a, b) => {
    const score = (recipe) => {
      let value = recipeScore(recipe, type, settings, usedNames, seed, 0);
      value += Math.abs(recipe.macros.protein - foodProtein) * 2;
      if (settings.calorieGoal) value += Math.abs(recipe.macros.calories - settings.calorieGoal / 3) * 0.12;
      if (settings.carbGoal) value += Math.abs(recipe.macros.carbs - settings.carbGoal / 3) * 0.2;
      if (settings.fatGoal) value += Math.abs(recipe.macros.fat - settings.fatGoal / 3) * 0.35;
      return value;
    };
    return score(a) - score(b);
  }).slice(0, 10);
}

function recipeCandidates(type, settings) {
  return RECIPES[type.toLowerCase()].filter((recipe) => recipeEligible(recipe, type, settings));
}

function recipeEligible(recipe, type, settings) {
  const cuisineMatch = settings.cuisine === "random" || recipe.cuisine === settings.cuisine || type === "Breakfast";
  const proteinMatch = settings.meat === "vegetarian"
    ? recipe.proteinType === "vegetarian" && !recipe.ingredients.some((ingredient) =>
      (INGREDIENT_TAGS[ingredient.name] || []).some((tag) => tag === "meat" || tag === "fish"))
    : type === "Breakfast" || recipe.proteinType === settings.meat;
  const avoids = settings.excluded.some((term) => recipe.ingredients.some((ingredient) =>
    (ingredient.name.toLowerCase().includes(term) || (ingredient.componentOf || "").includes(term)) || (INGREDIENT_TAGS[ingredient.name] || []).includes(term)));
  return cuisineMatch && proteinMatch && !avoids;
}

function pickBestRecipe(type, candidates, settings, usedNames, seed) {
  const scored = candidates.map((recipe, index) => ({
    recipe,
    score: recipeScore(recipe, type, settings, usedNames, seed, index),
  }));

  scored.sort((a, b) => a.score - b.score);
  const pickWindow = settings.mealMode === "variety" ? scored.slice(0, 4) : scored.slice(0, 2);
  const selected = pickWindow[Math.floor(Math.random() * Math.max(1, pickWindow.length))] || scored[0];
  return cloneRecipe(selected.recipe);
}

function recipeScore(recipe, type, settings, usedNames, seed, index) {
  let score = index * 0.5 + seededNoise(recipe.name, seed) * 14;
  const macros = recipe.macros;

  if (usedNames.has(recipe.name)) score += 240;
  if (favorites.has(recipe.name)) score -= 55;

  if (settings.budget === "budget") score += recipe.cost * 20;
  if (settings.budget === "high-protein") score -= macros.protein * 1.8;
  if (type === "Breakfast" && recipe.cuisine === "classic") score -= 6;

  return score;
}

function makeDay(day, selected, settings) {
  const meals = selected.meals.map((meal, index) => ({ ...meal, label: MEAL_TYPES[index] }));
  return { day, meals, macros: macrosForDay(meals, settings.powderProtein) };
}

function swapMeal(dayIndex, mealIndex) {
  if (!state) return;
  const settings = state.settings;
  const currentDay = state.plan.days[dayIndex];
  const currentMeal = currentDay.meals[mealIndex];
  const usedNames = new Set(currentDay.meals.map((meal) => meal.name));
  usedNames.add(currentMeal.name);

  const type = MEAL_TYPES[mealIndex];
  const candidates = recipeCandidates(type, settings)
    .filter((meal) => meal.name !== currentMeal.name)
    .filter((meal) => settings.mealMode === "batch" || !usedNames.has(meal.name));

  if (!candidates.length) {
    dom.plannerNote.textContent = `No alternative ${type.toLowerCase()} matches your dietary restrictions and cuisine. Your current meal is unchanged. Change your filters to see more options.`;
    return;
  }
  const baseMeals = currentDay.meals.map(normalizeMealPortion);
  let bestSwap = null;
  candidates.forEach((candidate) => {
    const proposed = baseMeals.map((meal, index) => index === mealIndex ? cloneRecipe(candidate) : cloneRecipe(meal));
    const meals = scaleMealsToTargets(proposed, settings);
    const score = targetFitScore(macrosForDay(meals, settings.powderProtein), settings)
      + recipeScore(candidate, type, settings, usedNames, Math.random(), mealIndex) / 100;
    if (!bestSwap || score < bestSwap.score) bestSwap = { score, meals };
  });
  bestSwap.meals.forEach((meal, index) => { meal.label = MEAL_TYPES[index]; });

  if (settings.mealMode === "batch") {
    state.plan.days.forEach((day) => {
      day.meals = bestSwap.meals.map(cloneRecipe);
      day.macros = macrosForDay(day.meals, settings.powderProtein);
    });
  } else {
    currentDay.meals = bestSwap.meals;
    currentDay.macros = macrosForDay(currentDay.meals, settings.powderProtein);
  }

  state.groceries = aggregateGroceries(state.plan.days, settings.people, settings.powderProtein);
  purchasedItems = reconcilePurchases(state.groceries, purchasedItems);
  state.averages = averageMacros(state.plan.days);
  lastGroceryText = groceryText(state.groceries);
  state.warning = buildWarning(state.plan, settings, state.averages);
  const saved = savePlannerState();
  renderCurrentState(state.warning || (saved
    ? "Meal swapped and saved. Dietary restrictions preserved."
    : "Meal swapped, but browser storage could not save it."));
}

function renderSummary(settings, plan, averages, warning) {
  if (!plan.days.length) {
    dom.summaryTitle.textContent = "No matching plan";
    dom.summaryText.textContent = warning;
    dom.summaryStats.innerHTML = "";
    dom.planStatus.textContent = "No matches";
    dom.planStatus.dataset.status = "unavailable";
    return;
  }
  const results = targetResults(averages, settings);
  const outside = results.filter((result) => result.kind !== "near");
  const status = outside.length
    ? { kind: outside.some((result) => result.kind === "under") ? "under" : "over", label: `${outside.length} ${plural("target", outside.length)} outside range` }
    : { kind: "near", label: "All targets near" };

  dom.summaryTitle.textContent = `${settings.days}-day ${settings.mealMode} plan`;
  dom.summaryText.textContent = warning || `${status.label}. ${settings.people} ${plural("person", settings.people)} with ${settings.days * settings.people * 3} planned meals.`;
  dom.planStatus.textContent = status.label;
  dom.planStatus.dataset.status = status.kind;

  const stats = [
    ["Duration", `${settings.days} ${plural("day", settings.days)}`],
    ["People", settings.people],
    ...results.map((result) => [
      nutritionTargetLabel(result.nutrient),
      `${Math.round(result.actual)}${result.unit} / ${Math.round(result.target)}${result.unit} (${formatTargetDelta(result)})`,
    ]),
    ["Powder", `${settings.powderProtein}g/day`],
    ["Cuisine", settings.cuisine === "random" ? "Mixed" : CUISINES[settings.cuisine]],
    ["Budget", budgetLabel(settings.budget)],
    ["Avg calories", Math.round(averages.calories)],
    ["Avg carbs", `${Math.round(averages.carbs)}g`],
    ["Avg fat", `${Math.round(averages.fat)}g`],
    ["Total meals", settings.days * settings.people * 3],
    ["Target status", outside.length ? `${outside.length} outside tolerance` : "Within tolerance"],
  ];

  dom.summaryStats.innerHTML = stats.map(([label, value]) => `
    <div class="stat">
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `).join("");
}

function renderMeals(plan, settings) {
  if (!plan.days.length) {
    dom.mealPlan.innerHTML = `<div class="empty-state">No complete plan matches your choices. Review the unavailable meal types above and change your filters; avoided ingredients will never be added automatically.</div>`;
    return;
  }

  if (settings.mealMode === "batch") {
    dom.mealPlan.innerHTML = renderBatchPlan(plan.days[0], settings);
    return;
  }

  dom.mealPlan.innerHTML = plan.days.map((day, dayIndex) => `
    <article class="day-card">
      <div class="day-header">
        <div>
          <p class="eyebrow">Day ${day.day}</p>
          <h3>${Math.round(day.macros.protein)}g protein · ${Math.round(day.macros.calories)} calories</h3>
          <p>${settings.mealMode === "batch" ? "Repeated prep set" : "Unique daily set"}</p>
        </div>
        <div class="badge-row">
          <span class="badge protein">${settings.people} ${plural("person", settings.people)}</span>
          <span class="badge calories">${settings.budget.replace("-", " ")}</span>
        </div>
      </div>
      <div class="meal-grid">
        ${day.meals.map((meal, mealIndex) => renderMeal(meal, dayIndex, mealIndex, settings.people)).join("")}
      </div>
    </article>
  `).join("");
}

function renderBatchPlan(day, settings) {
  const servings = settings.people * settings.days;
  return `
    <article class="day-card">
      <div class="day-header">
        <div>
          <p class="eyebrow">Batch cook set</p>
          <h3>${Math.round(day.macros.protein)}g protein/day · ${Math.round(day.macros.calories)} calories/day</h3>
          <p>Cook once for ${settings.days} ${plural("day", settings.days)} and portion ${servings * 3} total meals.</p>
        </div>
        <div class="badge-row">
          <span class="badge protein">${servings} ${plural("serving", servings)}</span>
          <span class="badge calories">${settings.budget.replace("-", " ")}</span>
        </div>
      </div>
      <div class="meal-grid">
        ${day.meals.map((meal, mealIndex) => renderMeal(meal, 0, mealIndex, servings, "batch servings")).join("")}
      </div>
    </article>
  `;
}

function renderMeal(meal, dayIndex, mealIndex, servings, servingLabel = servings === 1 ? "person" : "people") {
  const source = PROTEINS[meal.proteinType]?.source || "mixed protein";
  return `
    <article class="meal-card">
      <div class="meal-top">
        <div class="meal-icon" aria-hidden="true">${meal.label.charAt(0)}</div>
        <div>
          <p class="meal-kicker">${escapeHtml(meal.label)} · ${escapeHtml(CUISINES[meal.cuisine] || "Classic")}</p>
          <h3>${escapeHtml(meal.name)}</h3>
          <small>${escapeHtml(source)}</small>
        </div>
      </div>
      <p class="auth-hint">Estimated nutrition per serving; ingredient quantities below cover all listed servings.</p>
      <div class="badge-row" aria-label="Meal macros">
        <span class="badge protein">${Math.round(meal.macros.protein)}g protein</span>
        <span class="badge calories">${Math.round(meal.macros.calories)} kcal</span>
        <span class="badge carb">${Math.round(meal.macros.carbs)}g carbs</span>
        <span class="badge fat">${Math.round(meal.macros.fat)}g fat</span>
      </div>
      <div class="meal-section">
        <p class="meal-kicker">Ingredients for ${servings} ${servingLabel}</p>
        <ul>${meal.ingredients.map((item) => `<li>${escapeHtml(formatIngredient(item, servings))}</li>`).join("")}</ul>
      </div>
      <div class="meal-section">
        <p class="meal-kicker">Prep</p>
        <ol>${meal.steps.map((step) => `<li>${escapeHtml(step)}</li>`).join("")}</ol>
      </div>
      <div class="meal-actions">
        <button class="icon-button" type="button" data-action="favorite" data-name="${escapeAttr(meal.name)}" aria-label="${favorites.has(meal.name) ? "Remove" : "Save"} ${escapeAttr(meal.name)} ${favorites.has(meal.name) ? "from" : "to"} favorites" aria-pressed="${favorites.has(meal.name)}">
          ${favorites.has(meal.name) ? "Saved" : "Save"}
        </button>
        <button class="icon-button" type="button" data-action="swap" data-day="${dayIndex}" data-meal="${mealIndex}" aria-label="Swap ${escapeAttr(meal.label)} ${escapeAttr(meal.name)}">Swap</button>
      </div>
    </article>
  `;
}

function renderGroceries(groceries) {
  if (!groceries.length) {
    dom.groceryList.innerHTML = `<p class="empty-state">Generate a plan to see the shopping list.</p>`;
    return;
  }

  const groups = groupBy(groceries, "category");
  dom.groceryList.innerHTML = CATEGORIES.filter((category) => groups[category]?.length).map((category) => `
    <section class="grocery-category">
      <h3>${category}<span class="badge">${groups[category].length}</span></h3>
      <ul>
        ${groups[category].map((item) => {
          const key = groceryItemKey(item);
          const checked = purchasedItems.get(key) === groceryQuantitySignature(item);
          return `
          <li>
            <label>
              <input type="checkbox" data-grocery-key="${escapeAttr(key)}" ${checked ? "checked" : ""} aria-label="Mark ${escapeAttr(item.name)} purchased" />
              <span>
                <strong>${escapeHtml(formatIngredient(item, 1))}</strong>
                <small>${escapeHtml(marketHint(item))}</small>
              </span>
            </label>
          </li>
        `; }).join("")}
      </ul>
    </section>
  `).join("");
}

function handleGroceryChange(event) {
  const checkbox = event.target.closest("input[data-grocery-key]");
  if (!checkbox || !state) return;
  const item = state.groceries.find((candidate) => groceryItemKey(candidate) === checkbox.dataset.groceryKey);
  if (!item) return;
  if (checkbox.checked) purchasedItems.set(checkbox.dataset.groceryKey, groceryQuantitySignature(item));
  else purchasedItems.delete(checkbox.dataset.groceryKey);
  const saved = savePlannerState();
  dom.plannerNote.textContent = saved
    ? "Shopping progress saved on this browser."
    : "Shopping progress changed, but browser storage could not save it.";
}

function groceryItemKey(item) {
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

function renderPrepSchedule(plan, settings) {
  if (!plan.days.length) {
    dom.prepSchedule.innerHTML = `<p class="empty-state">A prep schedule will appear when a complete plan matches your choices.</p>`;
    return;
  }
  const meals = uniqueMeals(plan.days);
  const ingredients = new Set(meals.flatMap((meal) => meal.ingredients.map((item) => item.name)));
  const hasSauces = [...ingredients].some((name) => /sauce|salsa|hummus|tzatziki|oil|yogurt/i.test(name));
  const hasGrains = [...ingredients].some((name) => CATEGORY_BY_INGREDIENT[name] === "Grains");
  const hasProduce = [...ingredients].some((name) => CATEGORY_BY_INGREDIENT[name] === "Produce" || CATEGORY_BY_INGREDIENT[name] === "Frozen");
  const proteinNames = [...ingredients].filter((name) => CATEGORY_BY_INGREDIENT[name] === "Protein");

  const blocks = [
    {
      title: "Cook proteins",
      text: proteinNames.length
        ? `Batch cook ${listWords(proteinNames.slice(0, 4))} first. Use wide pans or sheet trays, cook to safe temperature, then rest before slicing or portioning.`
        : "Prepare the main protein components first so the rest of the assembly moves quickly.",
    },
    hasGrains && {
      title: "Cook grains",
      text: "Start grains and potatoes early. Weigh pasta dry and potatoes raw; measure rice, quinoa, and other grains after cooking in water. Follow the preparation state next to each quantity.",
    },
    hasProduce && {
      title: "Chop vegetables",
      text: "Wash, dry, and cut vegetables into similar sizes. Cook sturdy vegetables tender-crisp and keep raw greens separate until serving.",
    },
    {
      title: "Portion meals",
      text: `Set out ${settings.days * settings.people * 3} shallow containers or sections. Add carb base first, vegetables second, protein third, then sauce last or on the side. Refrigerate or freeze perishable food within 2 hours.`,
    },
    hasSauces && {
      title: "Store sauces separately",
      text: "Pack creamy, yogurt, lemon, hummus, and salsa-style sauces separately. Add them after reheating or right before eating.",
    },
    {
      title: "Store safely",
      text: settings.days > 4
        ? "Keep the refrigerator at 40°F (4°C) or below. Refrigerate only portions you will eat within 3 to 4 days and freeze the later portions on prep day. Thaw safely in the refrigerator, cold water, or microwave."
        : "Keep the refrigerator at 40°F (4°C) or below and use refrigerated portions within 3 to 4 days. Freeze anything you will not eat in that window.",
    },
    {
      title: "Reheat safely",
      text: "Reheat leftovers to 165°F (74°C), measured with a food thermometer. Cover and stir microwave-heated food for even heating, then add cold greens, yogurt sauces, avocado, or lemon.",
    },
  ].filter(Boolean);

  dom.prepSchedule.innerHTML = blocks.map((block) => `
    <section class="prep-block">
      <h3>${escapeHtml(block.title)}</h3>
      <p>${escapeHtml(block.text)}</p>
    </section>
  `).join("") + `
    <p class="safety-source">Storage and reheating guidance:
      <a href="https://www.fsis.usda.gov/food-safety/safe-food-handling-and-preparation/food-safety-basics/leftovers-and-food-safety" target="_blank" rel="noopener">USDA Leftovers and Food Safety</a>.
    </p>`;
}

function renderFavorites() {
  const names = [...favorites].sort();
  if (!names.length) {
    dom.favoritesList.innerHTML = `<p class="empty-state">Saved meals will appear here and get priority in future plans.</p>`;
    return;
  }

  dom.favoritesList.innerHTML = `<ul>${names.map((name) => `<li>${escapeHtml(name)}</li>`).join("")}</ul>`;
}

function handleMealAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;

  if (button.dataset.action === "favorite") {
    const name = button.dataset.name;
    if (favorites.has(name)) {
      favorites.delete(name);
    } else {
      favorites.add(name);
    }
    saveSet(accountStorageKey("favorites"), favorites);
    renderMeals(state.plan, state.settings);
    renderFavorites();
    return;
  }

  if (button.dataset.action === "swap") {
    swapMeal(Number(button.dataset.day), Number(button.dataset.meal));
  }
}

function aggregateGroceries(days, people, powderProtein = 0) {
  const map = new Map();
  function add(ingredient) {
    const amount = ingredientGrams(ingredient) * people;
    const current = map.get(ingredient.name) || {
      name: ingredient.name, unit: "g", amount: 0,
      preparation: NUTRITION[ingredient.name].preparation,
      category: groceryCategory(ingredient.name),
    };
    current.amount += amount;
    map.set(ingredient.name, current);
  }
  days.forEach((day) => {
    day.meals.forEach((meal) => meal.ingredients.forEach(add));
    if (powderProtein) add(supplementalPowderIngredient(powderProtein));
  });
  return [...map.values()].sort((a, b) => {
    const categoryDelta = CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category);
    return categoryDelta || a.name.localeCompare(b.name);
  });
}

function groceryText(groceries) {
  const groups = groupBy(groceries, "category");
  return CATEGORIES.filter((category) => groups[category]?.length).map((category) => {
    const lines = groups[category].map((item) => `- ${formatIngredient(item, 1)} (${marketHint(item)})`).join("\n");
    return `${category}\n${lines}`;
  }).join("\n\n");
}

async function copyGroceries() {
  if (!lastGroceryText) return;
  try {
    await navigator.clipboard.writeText(lastGroceryText);
    dom.copyGroceries.textContent = "Copied";
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = lastGroceryText;
    textarea.setAttribute("readonly", "");
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    dom.copyGroceries.textContent = "Copied";
  }
  window.setTimeout(() => {
    dom.copyGroceries.textContent = "Copy";
  }, 1300);
}

function downloadPlan() {
  if (!state || !state.plan.days.length) return;
  const lines = state.plan.days.map((day) => {
    const meals = day.meals.map((meal) => `  ${meal.label}: ${meal.name} (${Math.round(meal.macros.protein)}g protein)`).join("\n");
    return `Day ${day.day}\n${meals}`;
  }).join("\n\n");
  const blob = new Blob([`${lines}\n\nShopping List\n${lastGroceryText}`], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "prepfit-plan.txt";
  document.body.append(link);
  link.click();
  URL.revokeObjectURL(link.href);
  link.remove();
}

function resetSettings() {
  safeRemoveItem(accountStorageKey("settings"));
  safeRemoveItem(accountStorageKey("planner"));
  purchasedItems = new Map();
  applySettings(DEFAULTS);
  generatePlan({ shuffle: true });
}

function clearFavorites() {
  favorites = new Set();
  saveSet(accountStorageKey("favorites"), favorites);
  renderFavorites();
  if (state) renderMeals(state.plan, state.settings);
}

function saveSettings(settings) {
  const safe = { ...settings };
  delete safe.excluded;
  delete safe.dailyTarget;
  return safeSetItem(accountStorageKey("settings"), JSON.stringify(safe));
}

function restoreSettings() {
  const saved = parseJson(safeGetItem(accountStorageKey("settings")))
    || parseJson(safeGetItem(STORAGE_KEYS.settings))
    || DEFAULTS;
  applySettings({ ...DEFAULTS, ...saved });
  updateGoalLabel();
}

function savePlannerState() {
  if (!state || !currentAccount) return false;
  const record = {
    schemaVersion: PLANNER_SCHEMA_VERSION,
    savedAt: new Date().toISOString(),
    settings: (() => {
      const saved = { ...state.settings };
      delete saved.excluded;
      return saved;
    })(),
    plan: state.plan,
    purchases: Object.fromEntries(purchasedItems),
  };
  return safeSetItem(accountStorageKey("planner"), JSON.stringify(record));
}

function restorePlannerState() {
  const raw = safeGetItem(accountStorageKey("planner"));
  if (!raw) return false;
  const record = parseJson(raw);
  if (!record || record.schemaVersion !== PLANNER_SCHEMA_VERSION || !record.settings || !record.plan) {
    storageMessage = "Saved plan data was outdated or damaged, so PrepFit created a fresh plan.";
    safeRemoveItem(accountStorageKey("planner"));
    return false;
  }

  applySettings({ ...DEFAULTS, ...record.settings });
  const settings = readSettings();
  const plan = validatedStoredPlan(record.plan, settings);
  if (!plan) {
    storageMessage = "Saved plan data was unavailable or damaged, so PrepFit created a fresh plan.";
    safeRemoveItem(accountStorageKey("planner"));
    return false;
  }

  const groceries = aggregateGroceries(plan.days, settings.people, settings.powderProtein);
  purchasedItems = reconcilePurchases(groceries, new Map(
    record.purchases && typeof record.purchases === "object" ? Object.entries(record.purchases) : []
  ));
  const averages = averageMacros(plan.days);
  const warning = buildWarning(plan, settings, averages);
  state = { settings, plan, groceries, averages, warning };
  lastGroceryText = groceryText(groceries);
  renderCurrentState(warning || "Saved plan and shopping progress restored.");
  return true;
}

function validatedStoredPlan(savedPlan, settings) {
  if (!savedPlan || !Array.isArray(savedPlan.days) || !Array.isArray(savedPlan.missingTypes)) return null;
  if (savedPlan.days.length !== 0 && savedPlan.days.length !== settings.days) return null;
  try {
    const days = savedPlan.days.map((savedDay, dayIndex) => {
      if (!savedDay || !Array.isArray(savedDay.meals) || savedDay.meals.length !== MEAL_TYPES.length) {
        throw new Error("Invalid stored day");
      }
      const meals = savedDay.meals.map((savedMeal, mealIndex) => {
        const canonical = Object.values(RECIPES).flat().find((recipe) => recipe.name === savedMeal?.name);
        if (!canonical || !recipeEligible(canonical, MEAL_TYPES[mealIndex], settings)) throw new Error("Unavailable stored meal");
        const limits = portionLimits(settings);
        const ratio = savedMeal.portionRatio;
        if (!Number.isFinite(ratio) || ratio < limits.min || ratio > limits.max) {
          throw new Error("Invalid stored portion");
        }
        if (!Array.isArray(savedMeal.ingredients) || savedMeal.ingredients.length !== canonical.ingredients.length) {
          throw new Error("Invalid stored ingredients");
        }
        const meal = cloneRecipe(canonical);
        meal.ingredients = savedMeal.ingredients.map((ingredient, ingredientIndex) => {
          const expected = canonical.ingredients[ingredientIndex];
          const expectedAmount = Number((expected.amount * ratio).toFixed(6));
          if (!ingredient || ingredient.name !== expected.name || !Number.isFinite(ingredient.amount)
            || ingredient.amount <= 0 || Math.abs(ingredient.amount - expectedAmount) > 0.000001) {
            throw new Error("Invalid stored ingredient");
          }
          ingredientGrams(ingredient);
          return { ...expected, amount: ingredient.amount };
        });
        meal.macros = macrosForMeal(meal.ingredients);
        meal.portionRatio = ratio;
        meal.label = MEAL_TYPES[mealIndex];
        return meal;
      });
      return { day: dayIndex + 1, meals, macros: macrosForDay(meals, settings.powderProtein) };
    });
    return {
      days,
      missingTypes: savedPlan.missingTypes.filter((type) => MEAL_TYPES.includes(type)),
      ...(typeof savedPlan.conflict === "string" ? { conflict: savedPlan.conflict } : {}),
    };
  } catch (error) {
    return null;
  }
}

function applySettings(settings) {
  Object.entries(settings).forEach(([key, value]) => {
    const field = dom.form.elements[key];
    if (!field) return;
    if (field instanceof RadioNodeList) {
      [...field].forEach((input) => {
        input.checked = input.value === String(value);
      });
      return;
    }
    field.value = value;
  });
}

function updateGoalLabel(settings = readSettingsNoSave()) {
  const days = integerInRange(dom.form.elements.days.value, DEFAULTS.days, 1, 7);
  const bounds = proteinInputBounds(settings.goalMode, days);
  const input = dom.form.elements.proteinGoal;
  dom.goalLabel.textContent = settings.goalMode === "weekly"
    ? "Protein per person per week"
    : "Protein per person per day";
  input.min = bounds.min;
  input.max = bounds.max;
  input.step = settings.goalMode === "weekly" ? days * 5 : 5;
  const help = document.querySelector("#protein-help");
  if (help) help.textContent = settings.goalMode === "weekly"
    ? `Allowed range: ${bounds.min}–${bounds.max}g/week for ${days} days (40–320g/day).`
    : "Allowed range: 40–320g/day.";
}

function toggleTheme() {
  const next = document.body.dataset.theme === "evening" ? "morning" : "evening";
  if (document.startViewTransition) {
    document.startViewTransition(() => applyTheme(next));
  } else {
    applyTheme(next);
  }
  safeSetItem(STORAGE_KEYS.theme, next);
}

function applyTheme(theme) {
  document.body.dataset.theme = theme;
  const nextLabel = theme === "evening" ? "Morning" : "Evening";
  dom.themeToggle.textContent = nextLabel;
  dom.themeToggle.setAttribute("aria-pressed", String(theme === "evening"));
  dom.themeToggle.setAttribute("aria-label", `Switch to ${nextLabel.toLowerCase()} theme`);
}

function loadTheme() {
  const saved = localStorage.getItem(STORAGE_KEYS.theme);
  if (saved === "morning" || saved === "evening") return saved;
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? "morning" : "evening";
}

function buildWarning(plan, settings, averages = averageMacros(plan.days)) {
  const warnings = [];
  if (plan.conflict) return plan.conflict;
  if (plan.missingTypes?.length) {
    return `No matching ${listWords(plan.missingTypes.map((type) => type.toLowerCase()))} recipes for your protein choice, cuisine, and avoided ingredients. Change your filters to create a complete plan. Restrictions have not been relaxed.`;
  }
  const limits = portionLimits(settings);
  const outside = targetResults(averages, settings).filter((result) => result.kind !== "near");
  if (settings.powderProtein > settings.dailyTarget) {
    warnings.push("Supplemental whey alone exceeds the protein target; food portions stay at the minimum.");
  }
  if (outside.length) {
    const details = outside.map((result) =>
      `${nutritionTargetLabel(result.nutrient).toLowerCase()} is ${formatTargetDelta(result)}`).join(", ");
    warnings.push(`Closest plan within ${limits.min}×–${limits.max}× portion limits: ${details}.`);
  }
  return warnings.join(" ");
}

function nutritionTargetLabel(nutrient) {
  return { protein: "Protein", calories: "Calories", carbs: "Carbs", fat: "Fat" }[nutrient];
}

function formatTargetDelta(result) {
  if (result.kind === "near") return `${Math.abs(Math.round(result.delta))}${result.unit} from target`;
  return `${Math.abs(Math.round(result.delta))}${result.unit} ${result.kind}`;
}

function formatIngredient(ingredient, multiplier) {
  const amount = ingredient.amount * multiplier;
  const grams = ingredientGrams({ ...ingredient, amount });
  const unit = nutritionUnit(ingredient.unit);
  const quantity = `${formatAmount(amount)} ${displayUnit(unit, amount)}`;
  const weight = unit === "g" ? "" : `; ${formatAmount(grams)} g`;
  const purpose = ingredient.componentOf ? `; for ${ingredient.componentOf}` : "";
  return `${quantity} ${ingredient.name} (${NUTRITION[ingredient.name].preparation}${weight}${purpose})`;
}

function marketHint(ingredient) {
  const reference = NUTRITION[ingredient.name];
  if (reference.preparation.startsWith("cooked")) {
    return "Cook enough to yield this cooked weight, or buy ready-cooked. Raw/dry purchase weight depends on cooking yield.";
  }
  if (ingredient.name === "canned tuna") return "Required drained weight. Compare the drained grams on your can; can sizes vary.";
  if (ingredient.name === "protein pasta") return "Buy this dry weight; nutrition uses Barilla Protein+ Penne.";
  return reference.note || "Use the preparation state shown; compare packaged products with the reference nutrition.";
}

function roundUpTo(value, step) {
  return Math.ceil(value / step) * step;
}

function roundUpToDozen(count) {
  const dozens = Math.ceil(count / 12);
  return `${dozens} ${plural("dozen", dozens)}`;
}

function formatAmount(value) {
  if (value > 0 && value < 0.01) return "<0.01";
  return Number(value.toFixed(2)).toString();
}

function normalizeUnit(unit) {
  const normalized = String(unit || "").toLowerCase();
  return {
    cups: "cup",
    cloves: "clove",
    slices: "slice",
    cans: "can",
    scoops: "scoop",
  }[normalized] || normalized;
}

function displayUnit(unit, amount) {
  if (Math.abs(amount - 1) < 0.001) return unit;
  return {
    cup: "cups",
    clove: "cloves",
    slice: "slices",
    can: "cans",
    scoop: "scoops",
    count: "count",
    tbsp: "tbsp",
    tsp: "tsp",
    oz: "oz",
  }[unit] || unit;
}

function groceryCategory(name) {
  return CATEGORY_BY_INGREDIENT[name] || "Other";
}

function uniqueMeals(days) {
  const seen = new Set();
  return days.flatMap((day) => day.meals).filter((meal) => {
    if (seen.has(meal.name)) return false;
    seen.add(meal.name);
    return true;
  });
}

function readSettingsNoSave() {
  const data = new FormData(dom.form);
  return {
    goalMode: oneOf(data.get("goalMode"), ["daily", "weekly"], DEFAULTS.goalMode),
  };
}

function excludedTerms(value) {
  return String(value || "")
    .toLowerCase()
    .split(",")
    .map((term) => term.trim())
    .filter(Boolean);
}

function oneOf(value, options, fallback) {
  return options.includes(value) ? value : fallback;
}

function numberFrom(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function seededNoise(text, seed) {
  let hash = Math.floor(seed * 1000);
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) % 9973;
  }
  return hash / 9973;
}

function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const value = item[key];
    groups[value] = groups[value] || [];
    groups[value].push(item);
    return groups;
  }, {});
}

function loadSet(key) {
  const value = parseJson(localStorage.getItem(key));
  return new Set(Array.isArray(value) ? value : []);
}

function saveSet(key, set) {
  safeSetItem(key, JSON.stringify([...set]));
}

function parseJson(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}

function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.warn(`PrepFit: could not save "${key}" locally.`, error);
    storageMessage = "Browser storage is unavailable. Your latest changes will be lost when this page closes.";
    return false;
  }
}

function safeRemoveItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn(`PrepFit: could not clear "${key}" locally.`, error);
    storageMessage = "Browser storage is unavailable, so saved data could not be cleared.";
    return false;
  }
}

function safeGetItem(key) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.warn(`PrepFit: could not read "${key}" locally.`, error);
    storageMessage = "Browser storage is unavailable. PrepFit could not restore saved data.";
    return null;
  }
}

function debounce(callback, delay) {
  let timeout;
  return (...args) => {
    window.clearTimeout(timeout);
    timeout = window.setTimeout(() => callback(...args), delay);
  };
}

function budgetLabel(value) {
  return {
    standard: "Standard",
    budget: "Budget",
    "high-protein": "High protein",
  }[value] || "Standard";
}

function plural(word, count) {
  return count === 1 ? word : `${word}s`;
}

function listWords(values) {
  if (values.length <= 1) return values.join("");
  if (values.length === 2) return values.join(" and ");
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  }[char]));
}

function escapeAttr(value) {
  return escapeHtml(value);
}
