import {
  debounce, escapeAttr, escapeHtml, numberFrom, oneOf,
} from "./modules/utils.js";
import { createStorage, parseJson } from "./modules/storage.js";
import { createGroceryTools } from "./modules/groceries.js";
import { createExporter } from "./modules/export.js";
import { createPlanner } from "./modules/planner.js";
import { createProfileStore } from "./modules/profiles.js";
import { createPersistence } from "./modules/persistence.js";
import { createRenderer } from "./modules/render.js";

const STORAGE_KEYS = {
  settings: "prepfit-settings-v2",
  favorites: "prepfit-favorites",
  theme: "prepfit-theme",
  accounts: "prepfit-accounts-v1",
  currentAccount: "prepfit-current-account-v1",
};
const PLANNER_SCHEMA_VERSION = 2;

const DEFAULTS = {
  goalMode: "daily",
  proteinGoal: 150,
  powderProtein: 0,
  supplementMode: "reference",
  supplementLabel: "Whey protein powder",
  supplementAmount: 30,
  supplementCalories: 0,
  supplementCarbs: 0,
  supplementFat: 0,
  supplementAllergens: "dairy",
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
  undoPlanEdit: document.querySelector("#undo-plan-edit"),
  themeToggle: document.querySelector("#theme-toggle"),
  randomize: document.querySelector("#randomize"),
  printPlan: document.querySelector("#print-plan"),
  downloadPlan: document.querySelector("#download-plan"),
  copyGroceries: document.querySelector("#copy-groceries"),
  manualGroceryForm: document.querySelector("#manual-grocery-form"),
  manualGrocerySubmit: document.querySelector("#manual-grocery-submit"),
  manualGroceryCancel: document.querySelector("#manual-grocery-cancel"),
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
let pantryItems = new Set();
let manualGroceries = [];
let editingManualId = null;
let mealEditSnapshot = null;
let storageMessage = "";

const browserStorage = globalThis.localStorage || {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};
const storage = createStorage(browserStorage, (message) => {
  storageMessage = message;
});
const safeGetItem = storage.get;
const safeSetItem = storage.set;
const safeRemoveItem = storage.remove;
const loadSet = storage.loadSet;
const saveSet = storage.saveSet;
const profileStore = createProfileStore({ storage, keys: STORAGE_KEYS });
const loadAccounts = profileStore.load;
const saveAccounts = profileStore.save;
const displayUsername = profileStore.displayName;
const uniqueProfileId = profileStore.uniqueId;
const profileNameExists = profileStore.nameExists;
const isReservedProfileId = profileStore.isReservedId;
const profileStorageKey = profileStore.dataKey;
const copyProfileData = profileStore.copyData;
const removeProfileData = profileStore.removeData;
const migrateLegacyProfiles = profileStore.migrateLegacy;

const {
  aggregateGroceries,
  formatIngredient,
  combineGroceries,
  groceryItemKey,
  groceryQuantitySignature,
  groceryText,
  marketHint,
  reconcilePurchases,
} = createGroceryTools({
  categories: CATEGORIES,
  categoryByIngredient: CATEGORY_BY_INGREDIENT,
  nutrition: NUTRITION,
  ingredientGrams,
  nutritionUnit,
  supplementalPowderIngredient,
});
const exporter = createExporter({ document, navigator: globalThis.navigator || {} });
const {
  buildPlan, buildWarning, formatTargetDelta, nutritionTargetLabel,
  recipeCandidates, recipeEligible, recipeScore,
} = createPlanner({
  recipes: RECIPES,
  mealTypes: MEAL_TYPES,
  ingredientTags: INGREDIENT_TAGS,
  cloneRecipe,
  scaleMealsToTargets,
  macrosForDay,
  targetFitScore,
  supplementalPowderIngredient,
  averageMacros,
  portionLimits,
  targetResults,
  getFavorites: () => favorites,
});
const persistence = createPersistence({
  storage,
  schemaVersion: PLANNER_SCHEMA_VERSION,
  mealTypes: MEAL_TYPES,
  recipes: RECIPES,
  recipeEligible,
  portionLimits,
  cloneRecipe,
  ingredientGrams,
  macrosForMeal,
  macrosForDay,
});
const validatedStoredPlan = persistence.validatePlan;
const { renderFavorites, renderGroceries, renderMeals, renderPrepSchedule, renderSummary } = createRenderer({
  dom, cuisines: CUISINES, categories: CATEGORIES, proteins: PROTEINS, categoryByIngredient: CATEGORY_BY_INGREDIENT,
  targetResults, nutritionTargetLabel, formatTargetDelta, formatIngredient, marketHint,
  groceryItemKey, groceryQuantitySignature, getFavorites: () => favorites,
  getPurchases: () => purchasedItems, getPantry: () => pantryItems,
});

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
  dom.undoPlanEdit.addEventListener("click", undoMealEdit);
  dom.groceryList.addEventListener("change", handleGroceryChange);
  dom.groceryList.addEventListener("click", handleGroceryAction);
  dom.manualGroceryForm.addEventListener("submit", handleManualGrocerySubmit);
  dom.manualGroceryCancel.addEventListener("click", cancelManualGroceryEdit);
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
  const id = safeGetItem(STORAGE_KEYS.currentAccount);
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
  mealEditSnapshot = null;
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
  pantryItems = new Set();
  manualGroceries = [];
  editingManualId = null;
  mealEditSnapshot = null;
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
  const saved = parseJson(safeGetItem(accountKey));
  if (Array.isArray(saved)) {
    return new Set(saved);
  }

  return loadSet(STORAGE_KEYS.favorites);
}

function generatePlan(options = {}) {
  if (!currentAccount) {
    return;
  }

  const settings = readSettings();
  mealEditSnapshot = null;
  const settingsSaved = saveSettings(settings);
  updateGoalLabel(settings);

  let plan;
  try {
    plan = buildPlan(settings, options);
  } catch (error) {
    console.error("PrepFit nutrition calculation failed", error);
    plan = { days: [], missingTypes: [], conflict: "Nutrition could not be calculated from the ingredient references. No plan is shown. Check ingredient units and preparation states before trying again." };
  }
  const groceries = combineGroceries(aggregateGroceries(plan.days, settings.people, settings), manualGroceries);
  const averages = averageMacros(plan.days);
  const warning = buildWarning(plan, settings, averages);
  purchasedItems = reconcilePurchases(groceries, purchasedItems);
  const validGroceryKeys = new Set(groceries.map(groceryItemKey));
  pantryItems = new Set([...pantryItems].filter((key) => validGroceryKeys.has(key)));

  state = { settings, plan, groceries, averages, warning };
  lastGroceryText = groceryText(groceries, purchasedItems, pantryItems);
  const planSaved = savePlannerState();
  const groceryNote = manualGroceries.length
    ? `${manualGroceries.length} custom grocery ${manualGroceries.length === 1 ? "item was" : "items were"} preserved.`
    : "Changes regenerate the plan.";
  renderCurrentState(warning || (settingsSaved && planSaved
    ? `Auto-saved. ${groceryNote}`
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
  dom.undoPlanEdit.hidden = !mealEditSnapshot;
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
    supplementMode: oneOf(data.get("supplementMode"), ["reference", "custom"], DEFAULTS.supplementMode),
    supplementLabel: String(data.get("supplementLabel") || DEFAULTS.supplementLabel).trim().slice(0, 40) || DEFAULTS.supplementLabel,
    supplementAmount: clamp(numberFrom(data.get("supplementAmount"), DEFAULTS.supplementAmount), 0, 300),
    supplementCalories: clamp(numberFrom(data.get("supplementCalories"), 0), 0, 1200),
    supplementCarbs: clamp(numberFrom(data.get("supplementCarbs"), 0), 0, 200),
    supplementFat: clamp(numberFrom(data.get("supplementFat"), 0), 0, 120),
    supplementAllergens: String(data.get("supplementAllergens") || "").trim().slice(0, 100),
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
  let bestSwap = null;
  candidates.forEach((candidate) => {
    const replacement = scaleMeal(cloneRecipe(candidate), currentMeal.portionRatio || 1);
    replacement.label = type;
    const proposed = currentDay.meals.map((meal, index) => index === mealIndex ? replacement : meal);
    const score = targetFitScore(macrosForDay(proposed.filter((meal) => !meal.removed), settings), settings)
      + recipeScore(candidate, type, settings, usedNames, Math.random(), mealIndex) / 100;
    if (!bestSwap || score < bestSwap.score) bestSwap = { score, replacement };
  });
  captureMealEdit();
  if (settings.mealMode === "batch") {
    state.plan.days.forEach((day) => {
      day.meals[mealIndex] = cloneRecipe(bestSwap.replacement);
    });
  } else {
    currentDay.meals[mealIndex] = bestSwap.replacement;
  }
  recomputeEditedPlan("Meal swapped and saved. Dietary restrictions preserved.");
}

function captureMealEdit() {
  mealEditSnapshot = {
    plan: JSON.parse(JSON.stringify(state.plan)),
    purchases: [...purchasedItems],
    pantry: [...pantryItems],
  };
}

function editMeal(dayIndex, mealIndex, action) {
  if (!state) return;
  const meal = state.plan.days[dayIndex]?.meals[mealIndex];
  if (!meal) return;
  captureMealEdit();
  const affected = state.settings.mealMode === "batch"
    ? state.plan.days.map((day) => day.meals[mealIndex])
    : [meal];
  if (action === "remove" || action === "restore") {
    affected.forEach((item) => { item.removed = action === "remove"; });
    recomputeEditedPlan(action === "remove" ? "Meal removed. Use Undo or Restore meal to recover it." : "Meal restored.");
    return;
  }
  const limits = portionLimits(state.settings);
  const direction = action === "portion-up" ? 0.05 : -0.05;
  const nextRatio = clamp(Math.round(((meal.portionRatio || 1) + direction) * 20) / 20, limits.min, limits.max);
  if (Math.abs(nextRatio - (meal.portionRatio || 1)) < 0.001) {
    mealEditSnapshot = null;
    renderCurrentState(`Portions are limited to ${Math.round(limits.min * 100)}%–${Math.round(limits.max * 100)}% for this budget mode.`);
    return;
  }
  affected.forEach((item, index) => {
    const adjusted = scaleMeal(normalizeMealPortion(item), nextRatio);
    adjusted.label = item.label;
    adjusted.removed = item.removed;
    if (state.settings.mealMode === "batch") state.plan.days[index].meals[mealIndex] = adjusted;
    else state.plan.days[dayIndex].meals[mealIndex] = adjusted;
  });
  recomputeEditedPlan(`Portion adjusted to ${Math.round(nextRatio * 100)}% and saved.`);
}

function recomputeEditedPlan(message) {
  state.plan.days.forEach((day) => {
    day.macros = macrosForDay(day.meals.filter((meal) => !meal.removed), state.settings);
  });
  state.groceries = combineGroceries(aggregateGroceries(state.plan.days, state.settings.people, state.settings), manualGroceries);
  purchasedItems = reconcilePurchases(state.groceries, purchasedItems);
  const validKeys = new Set(state.groceries.map(groceryItemKey));
  pantryItems = new Set([...pantryItems].filter((key) => validKeys.has(key)));
  state.averages = averageMacros(state.plan.days);
  state.warning = buildWarning(state.plan, state.settings, state.averages);
  lastGroceryText = groceryText(state.groceries, purchasedItems, pantryItems);
  const saved = savePlannerState();
  renderCurrentState(saved ? message : `${message} Browser storage could not save it.`);
}

function undoMealEdit() {
  if (!state || !mealEditSnapshot) return;
  const snapshot = mealEditSnapshot;
  mealEditSnapshot = null;
  state.plan = snapshot.plan;
  purchasedItems = new Map(snapshot.purchases);
  pantryItems = new Set(snapshot.pantry);
  recomputeEditedPlan("Last meal edit undone.");
}

function handleGroceryChange(event) {
  const pantryCheckbox = event.target.closest("input[data-pantry-key]");
  if (pantryCheckbox && state) {
    if (pantryCheckbox.checked) pantryItems.add(pantryCheckbox.dataset.pantryKey);
    else pantryItems.delete(pantryCheckbox.dataset.pantryKey);
    purchasedItems.delete(pantryCheckbox.dataset.pantryKey);
    lastGroceryText = groceryText(state.groceries, purchasedItems, pantryItems);
    renderGroceries(state.groceries);
    const saved = savePlannerState();
    dom.plannerNote.textContent = saved ? "Pantry items saved on this browser." : "Pantry changed, but browser storage could not save it.";
    return;
  }
  const checkbox = event.target.closest("input[data-grocery-key]");
  if (!checkbox || !state) return;
  const item = state.groceries.find((candidate) => groceryItemKey(candidate) === checkbox.dataset.groceryKey);
  if (!item) return;
  if (checkbox.checked) purchasedItems.set(checkbox.dataset.groceryKey, groceryQuantitySignature(item));
  else purchasedItems.delete(checkbox.dataset.groceryKey);
  pantryItems.delete(checkbox.dataset.groceryKey);
  lastGroceryText = groceryText(state.groceries, purchasedItems, pantryItems);
  const saved = savePlannerState();
  dom.plannerNote.textContent = saved
    ? "Shopping progress saved on this browser."
    : "Shopping progress changed, but browser storage could not save it.";
}

function refreshGroceryState(message) {
  if (!state) return;
  state.groceries = combineGroceries(
    aggregateGroceries(state.plan.days, state.settings.people, state.settings), manualGroceries);
  purchasedItems = reconcilePurchases(state.groceries, purchasedItems);
  const validKeys = new Set(state.groceries.map(groceryItemKey));
  pantryItems = new Set([...pantryItems].filter((key) => validKeys.has(key)));
  lastGroceryText = groceryText(state.groceries, purchasedItems, pantryItems);
  renderGroceries(state.groceries);
  const saved = savePlannerState();
  dom.plannerNote.textContent = saved ? message : `${message} Browser storage could not save it.`;
}

function handleManualGrocerySubmit(event) {
  event.preventDefault();
  if (!state) return;
  const data = new FormData(dom.manualGroceryForm);
  const name = String(data.get("manualName") || "").trim().replace(/\s+/g, " ").slice(0, 50);
  const amount = clamp(numberFrom(data.get("manualAmount"), 1), 0.01, 9999);
  const unit = String(data.get("manualUnit") || "count").trim().replace(/\s+/g, " ").slice(0, 16) || "count";
  if (!name) return;
  const wasEditing = Boolean(editingManualId);
  if (editingManualId) {
    const index = manualGroceries.findIndex((item) => item.id === editingManualId);
    if (index >= 0) {
      const key = `manual:${editingManualId}`;
      manualGroceries[index] = { id: editingManualId, name, amount, unit };
      purchasedItems.delete(key);
    }
  } else {
    const id = globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    manualGroceries.push({ id, name, amount, unit });
  }
  cancelManualGroceryEdit();
  refreshGroceryState(wasEditing ? "Custom grocery item updated." : "Custom grocery item added.");
}

function handleGroceryAction(event) {
  const button = event.target.closest("button[data-grocery-action]");
  if (!button) return;
  const item = manualGroceries.find((candidate) => candidate.id === button.dataset.manualId);
  if (!item) return;
  if (button.dataset.groceryAction === "edit") {
    editingManualId = item.id;
    dom.manualGroceryForm.elements.manualName.value = item.name;
    dom.manualGroceryForm.elements.manualAmount.value = item.amount;
    dom.manualGroceryForm.elements.manualUnit.value = item.unit;
    dom.manualGrocerySubmit.textContent = "Save item";
    dom.manualGroceryCancel.hidden = false;
    dom.manualGroceryForm.elements.manualName.focus();
    return;
  }
  const key = `manual:${item.id}`;
  manualGroceries = manualGroceries.filter((candidate) => candidate.id !== item.id);
  purchasedItems.delete(key);
  pantryItems.delete(key);
  cancelManualGroceryEdit();
  refreshGroceryState("Custom grocery item removed.");
}

function cancelManualGroceryEdit() {
  editingManualId = null;
  dom.manualGroceryForm.reset();
  dom.manualGroceryForm.elements.manualAmount.value = 1;
  dom.manualGroceryForm.elements.manualUnit.value = "count";
  dom.manualGrocerySubmit.textContent = "Add item";
  dom.manualGroceryCancel.hidden = true;
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
    return;
  }
  if (["remove", "restore", "portion-up", "portion-down"].includes(button.dataset.action)) {
    editMeal(Number(button.dataset.day), Number(button.dataset.meal), button.dataset.action);
  }
}

async function copyGroceries() {
  await exporter.copyText(lastGroceryText, dom.copyGroceries);
}

function downloadPlan() {
  if (!state || !state.plan.days.length) return;
  exporter.downloadText(exporter.planText(state.plan, lastGroceryText));
}

function resetSettings() {
  safeRemoveItem(accountStorageKey("settings"));
  safeRemoveItem(accountStorageKey("planner"));
  purchasedItems = new Map();
  pantryItems = new Set();
  manualGroceries = [];
  editingManualId = null;
  mealEditSnapshot = null;
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
  return persistence.saveSettings(accountStorageKey("settings"), settings);
}

function restoreSettings() {
  applySettings(persistence.loadSettings(
    accountStorageKey("settings"), STORAGE_KEYS.settings, DEFAULTS));
  updateGoalLabel();
}

function savePlannerState() {
  if (!state || !currentAccount) return false;
  return persistence.savePlanner(accountStorageKey("planner"), state, purchasedItems, {
    pantry: pantryItems,
    manual: manualGroceries,
  });
}

function restorePlannerState() {
  const result = persistence.loadPlanner(accountStorageKey("planner"));
  if (result.kind === "missing") return false;
  if (result.kind === "invalid") { storageMessage = result.message; return false; }
  const { record } = result;

  applySettings({ ...DEFAULTS, ...record.settings });
  const settings = readSettings();
  const plan = validatedStoredPlan(record.plan, settings);
  if (!plan) {
    storageMessage = "Saved plan data was unavailable or damaged, so PrepFit created a fresh plan.";
    safeRemoveItem(accountStorageKey("planner"));
    return false;
  }

  manualGroceries = record.grocery.manual;
  const groceries = combineGroceries(aggregateGroceries(plan.days, settings.people, settings), manualGroceries);
  purchasedItems = reconcilePurchases(groceries, new Map(
    Object.entries(record.grocery.purchases)
  ));
  const validKeys = new Set(groceries.map(groceryItemKey));
  pantryItems = new Set(record.grocery.pantry.filter((key) => validKeys.has(key)));
  const averages = averageMacros(plan.days);
  const warning = buildWarning(plan, settings, averages);
  state = { settings, plan, groceries, averages, warning };
  lastGroceryText = groceryText(groceries, purchasedItems, pantryItems);
  renderCurrentState(warning || "Saved plan and shopping progress restored.");
  return true;
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
  const saved = safeGetItem(STORAGE_KEYS.theme);
  if (saved === "morning" || saved === "evening") return saved;
  const hour = new Date().getHours();
  return hour >= 6 && hour < 18 ? "morning" : "evening";
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
