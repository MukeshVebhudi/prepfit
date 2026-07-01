const STORAGE_KEYS = {
  settings: "prepfit-settings-v2",
  favorites: "prepfit-favorites",
  theme: "prepfit-theme",
  accounts: "prepfit-accounts-v1",
  currentAccount: "prepfit-current-account-v1",
};

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

const PROTEINS = {
  chicken: { label: "Chicken", source: "chicken breast", cost: 2 },
  beef: { label: "Beef", source: "lean beef", cost: 4 },
  turkey: { label: "Turkey", source: "lean turkey", cost: 2 },
  fish: { label: "Fish", source: "salmon or tuna", cost: 4 },
  vegetarian: { label: "Vegetarian", source: "tofu, legumes, dairy", cost: 1 },
};

const CATEGORIES = ["Protein", "Produce", "Grains", "Dairy", "Pantry", "Spices", "Frozen", "Other"];
const MEAL_TYPES = ["Breakfast", "Lunch", "Dinner"];
const MAX_MEAL_CALORIES = 620;

const CATEGORY_BY_INGREDIENT = {
  "chicken breast": "Protein",
  "lean ground beef": "Protein",
  "sirloin steak": "Protein",
  "lean ground turkey": "Protein",
  "salmon fillet": "Protein",
  "canned tuna": "Protein",
  "extra firm tofu": "Protein",
  "tempeh": "Protein",
  "paneer cheese": "Protein",
  "egg whites": "Protein",
  "whole eggs": "Protein",
  "turkey slices": "Protein",
  edamame: "Frozen",
  broccoli: "Produce",
  spinach: "Produce",
  zucchini: "Produce",
  asparagus: "Produce",
  "green beans": "Produce",
  "bell peppers": "Produce",
  onion: "Produce",
  lemon: "Produce",
  avocado: "Produce",
  "sweet potato": "Produce",
  "baby potatoes": "Produce",
  "fajita vegetables": "Frozen",
  "stir fry vegetables": "Frozen",
  "snap peas": "Produce",
  "romaine lettuce": "Produce",
  "slaw mix": "Produce",
  corn: "Frozen",
  rice: "Grains",
  "brown rice": "Grains",
  "basmati rice": "Grains",
  quinoa: "Grains",
  farro: "Grains",
  couscous: "Grains",
  "protein pasta": "Grains",
  pita: "Grains",
  naan: "Grains",
  "whole grain bread": "Grains",
  oats: "Grains",
  "rolled oats": "Grains",
  "black beans": "Pantry",
  "pinto beans": "Pantry",
  "kidney beans": "Pantry",
  chickpeas: "Pantry",
  lentils: "Pantry",
  peas: "Frozen",
  salsa: "Pantry",
  "marinara sauce": "Pantry",
  "tomato sauce": "Pantry",
  "crushed tomatoes": "Pantry",
  "teriyaki sauce": "Pantry",
  "soy sauce": "Pantry",
  "barbecue sauce": "Pantry",
  "tikka masala sauce": "Pantry",
  "curry simmer sauce": "Pantry",
  "cauliflower rice": "Frozen",
  hummus: "Pantry",
  "olive oil": "Pantry",
  garlic: "Produce",
  "taco seasoning": "Spices",
  "chili seasoning": "Spices",
  "steak seasoning": "Spices",
  "masala spices": "Spices",
  ginger: "Produce",
  "plain Greek yogurt": "Dairy",
  "Greek yogurt": "Dairy",
  "cottage cheese": "Dairy",
  "shredded cheese": "Dairy",
  "mozzarella cheese": "Dairy",
  "parmesan cheese": "Dairy",
  "light Alfredo sauce": "Dairy",
  "coconut cream": "Pantry",
  "whey protein powder": "Pantry",
  blueberries: "Produce",
  "peanut butter": "Pantry",
  tzatziki: "Dairy",
  "yogurt sauce": "Dairy",
};

const MACROS = {
  "chicken breast": { protein: 8, calories: 46, carbs: 0, fat: 1 },
  "lean ground beef": { protein: 7, calories: 52, carbs: 0, fat: 2.5 },
  "sirloin steak": { protein: 7, calories: 54, carbs: 0, fat: 2.4 },
  "lean ground turkey": { protein: 7, calories: 42, carbs: 0, fat: 1.5 },
  "salmon fillet": { protein: 6, calories: 58, carbs: 0, fat: 3.6 },
  "canned tuna": { protein: 22, calories: 105, carbs: 0, fat: 1 },
  "extra firm tofu": { protein: 3, calories: 26, carbs: 1, fat: 1.6 },
  tempeh: { protein: 5, calories: 55, carbs: 3, fat: 2.5 },
  "paneer cheese": { protein: 5, calories: 88, carbs: 1, fat: 7 },
  "egg whites": { protein: 26, calories: 126, carbs: 2, fat: 0 },
  "whole eggs": { protein: 6, calories: 72, carbs: 1, fat: 5 },
  "turkey slices": { protein: 5, calories: 30, carbs: 1, fat: 1 },
  "plain Greek yogurt": { protein: 24, calories: 145, carbs: 9, fat: 0 },
  "Greek yogurt": { protein: 22, calories: 140, carbs: 9, fat: 0 },
  "cottage cheese": { protein: 25, calories: 220, carbs: 8, fat: 5 },
  "whey protein powder": { protein: 24, calories: 120, carbs: 2, fat: 1 },
  edamame: { protein: 17, calories: 188, carbs: 14, fat: 8 },
  lentils: { protein: 18, calories: 230, carbs: 40, fat: 1 },
  chickpeas: { protein: 14, calories: 210, carbs: 35, fat: 4 },
  "black beans": { protein: 14, calories: 220, carbs: 40, fat: 1 },
  "pinto beans": { protein: 15, calories: 245, carbs: 45, fat: 1 },
  "kidney beans": { protein: 15, calories: 225, carbs: 40, fat: 1 },
  rice: { protein: 4, calories: 205, carbs: 45, fat: 0 },
  "brown rice": { protein: 5, calories: 215, carbs: 45, fat: 2 },
  "basmati rice": { protein: 4, calories: 205, carbs: 45, fat: 0 },
  quinoa: { protein: 8, calories: 222, carbs: 39, fat: 4 },
  farro: { protein: 6, calories: 170, carbs: 34, fat: 1 },
  couscous: { protein: 6, calories: 176, carbs: 36, fat: 0 },
  "protein pasta": { protein: 13, calories: 190, carbs: 34, fat: 2 },
  pita: { protein: 6, calories: 170, carbs: 33, fat: 1 },
  naan: { protein: 7, calories: 260, carbs: 44, fat: 6 },
  "whole grain bread": { protein: 4, calories: 95, carbs: 18, fat: 1.5 },
  oats: { protein: 5, calories: 150, carbs: 27, fat: 3 },
  "rolled oats": { protein: 5, calories: 150, carbs: 27, fat: 3 },
  broccoli: { protein: 3, calories: 55, carbs: 11, fat: 0 },
  spinach: { protein: 1, calories: 14, carbs: 2, fat: 0 },
  zucchini: { protein: 2, calories: 25, carbs: 5, fat: 0 },
  asparagus: { protein: 3, calories: 30, carbs: 5, fat: 0 },
  "green beans": { protein: 2, calories: 38, carbs: 8, fat: 0 },
  "bell peppers": { protein: 1, calories: 30, carbs: 7, fat: 0 },
  onion: { protein: 1, calories: 45, carbs: 11, fat: 0 },
  "sweet potato": { protein: 4, calories: 112, carbs: 26, fat: 0 },
  "baby potatoes": { protein: 5, calories: 175, carbs: 40, fat: 0 },
  "fajita vegetables": { protein: 2, calories: 70, carbs: 12, fat: 1 },
  "stir fry vegetables": { protein: 3, calories: 70, carbs: 12, fat: 1 },
  "snap peas": { protein: 2, calories: 40, carbs: 7, fat: 0 },
  "romaine lettuce": { protein: 1, calories: 10, carbs: 2, fat: 0 },
  "slaw mix": { protein: 1, calories: 25, carbs: 5, fat: 0 },
  corn: { protein: 3, calories: 75, carbs: 17, fat: 1 },
  peas: { protein: 4, calories: 67, carbs: 11, fat: 0 },
  avocado: { protein: 1, calories: 80, carbs: 4, fat: 7 },
  blueberries: { protein: 1, calories: 84, carbs: 21, fat: 0 },
  "peanut butter": { protein: 4, calories: 95, carbs: 3, fat: 8 },
  salsa: { protein: 1, calories: 18, carbs: 4, fat: 0 },
  "marinara sauce": { protein: 2, calories: 70, carbs: 10, fat: 2 },
  "tomato sauce": { protein: 2, calories: 60, carbs: 10, fat: 1 },
  "crushed tomatoes": { protein: 2, calories: 60, carbs: 12, fat: 0 },
  "teriyaki sauce": { protein: 1, calories: 35, carbs: 7, fat: 0 },
  "soy sauce": { protein: 1, calories: 10, carbs: 1, fat: 0 },
  "barbecue sauce": { protein: 0, calories: 55, carbs: 13, fat: 0 },
  "tikka masala sauce": { protein: 1, calories: 45, carbs: 5, fat: 2 },
  "curry simmer sauce": { protein: 2, calories: 90, carbs: 8, fat: 5 },
  hummus: { protein: 2, calories: 55, carbs: 4, fat: 3 },
  tzatziki: { protein: 2, calories: 30, carbs: 2, fat: 2 },
  "yogurt sauce": { protein: 2, calories: 35, carbs: 3, fat: 1 },
  "olive oil": { protein: 0, calories: 119, carbs: 0, fat: 14 },
  lemon: { protein: 0, calories: 8, carbs: 2, fat: 0 },
  garlic: { protein: 0, calories: 5, carbs: 1, fat: 0 },
  ginger: { protein: 0, calories: 5, carbs: 1, fat: 0 },
  "taco seasoning": { protein: 0, calories: 18, carbs: 3, fat: 0 },
  "chili seasoning": { protein: 0, calories: 18, carbs: 3, fat: 0 },
  "steak seasoning": { protein: 0, calories: 8, carbs: 1, fat: 0 },
  "masala spices": { protein: 0, calories: 18, carbs: 3, fat: 0 },
  "shredded cheese": { protein: 7, calories: 110, carbs: 1, fat: 9 },
  "mozzarella cheese": { protein: 7, calories: 85, carbs: 1, fat: 6 },
  "parmesan cheese": { protein: 5, calories: 45, carbs: 0, fat: 3 },
  "light Alfredo sauce": { protein: 2, calories: 60, carbs: 4, fat: 4 },
  "coconut cream": { protein: 1, calories: 60, carbs: 1, fat: 6 },
};

const RECIPES = buildRecipeLibrary();

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
  authPasscode: document.querySelector("#auth-passcode"),
  authSubmit: document.querySelector("#auth-submit"),
  authMessage: document.querySelector("#auth-message"),
  authLoginTab: document.querySelector("#auth-login-tab"),
  authRegisterTab: document.querySelector("#auth-register-tab"),
  savedProfiles: document.querySelector("#saved-profiles"),
  gmailForm: document.querySelector("#gmail-form"),
  gmailAddress: document.querySelector("#gmail-address"),
  gmailSubmit: document.querySelector("#gmail-submit"),
  accountChip: document.querySelector("#account-chip"),
  accountName: document.querySelector("#account-name"),
  logoutAccount: document.querySelector("#logout-account"),
};

let favorites = new Set();
let currentAccount = null;
let authMode = "login";
let state = null;
let lastGroceryText = "";

initialize();

function initialize() {
  applyTheme(loadTheme());
  bindEvents();
  restoreSession();
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
  dom.randomize.addEventListener("click", () => generatePlan({ shuffle: true }));
  dom.themeToggle.addEventListener("click", toggleTheme);
  dom.printPlan.addEventListener("click", () => window.print());
  dom.downloadPlan.addEventListener("click", downloadPlan);
  dom.copyGroceries.addEventListener("click", copyGroceries);
  dom.resetPlan.addEventListener("click", resetSettings);
  dom.clearFavorites.addEventListener("click", clearFavorites);
  dom.authForm.addEventListener("submit", handleAuthSubmit);
  dom.gmailForm.addEventListener("submit", handleGmailSubmit);
  dom.savedProfiles.addEventListener("click", handleSavedProfileClick);
  dom.authLoginTab.addEventListener("click", () => setAuthMode("login"));
  dom.authRegisterTab.addEventListener("click", () => setAuthMode("register"));
  dom.logoutAccount.addEventListener("click", logoutAccount);
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
  setAuthMode("login");
  dom.authUsername.focus();
}

async function handleAuthSubmit(event) {
  event.preventDefault();
  const username = normalizeUsername(dom.authUsername.value);
  const passcode = dom.authPasscode.value;

  if (username.length < 3) {
    showAuthMessage("Use at least 3 characters for the username.", "danger");
    return;
  }

  if (passcode.length < 4) {
    showAuthMessage("Use at least 4 characters for the passcode.", "danger");
    return;
  }

  const accounts = loadAccounts();
  const passcodeHash = await hashPasscode(username, passcode);

  if (authMode === "register") {
    if (accounts[username]) {
      showAuthMessage("That username already exists on this device.", "danger");
      return;
    }

    accounts[username] = {
      id: username,
      name: displayUsername(dom.authUsername.value),
      passcodeHash,
      createdAt: new Date().toISOString(),
    };
    saveAccounts(accounts);
    renderSavedProfiles();
    signIn(accounts[username]);
    showAuthMessage("Account created.", "success");
    return;
  }

  if (!accounts[username] || accounts[username].passcodeHash !== passcodeHash) {
    showAuthMessage("Username or passcode is incorrect.", "danger");
    return;
  }

  signIn(accounts[username]);
}

function handleGmailSubmit(event) {
  event.preventDefault();
  const email = normalizeEmail(dom.gmailAddress.value);

  if (!isGmailAddress(email)) {
    showAuthMessage("Enter a valid Gmail address ending in @gmail.com.", "danger");
    return;
  }

  const accounts = loadAccounts();
  const id = gmailAccountId(email);
  if (!accounts[id]) {
    accounts[id] = {
      id,
      name: email,
      email,
      provider: "gmail-local",
      createdAt: new Date().toISOString(),
    };
    saveAccounts(accounts);
    renderSavedProfiles();
  }

  signIn(accounts[id]);
  showAuthMessage("Local Gmail profile opened on this device.", "success");
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
  localStorage.setItem(STORAGE_KEYS.currentAccount, account.id);
  document.body.classList.add("is-authenticated");
  dom.accountName.textContent = account.name;
  dom.accountChip.hidden = false;
  dom.authForm.reset();
  dom.gmailForm.reset();
  showAuthMessage("");

  favorites = loadAccountFavorites();
  restoreSettings();
  generatePlan({ shuffle: true });
}

function logoutAccount() {
  currentAccount = null;
  state = null;
  favorites = new Set();
  lastGroceryText = "";
  localStorage.removeItem(STORAGE_KEYS.currentAccount);
  document.body.classList.remove("is-authenticated");
  dom.accountChip.hidden = true;
  dom.accountName.textContent = "Guest";
  dom.authForm.reset();
  dom.gmailForm.reset();
  renderSavedProfiles();
  setAuthMode("login");
  showAuthMessage("Signed out. Choose an account to continue.");
  dom.authUsername.focus();
}

function setAuthMode(mode) {
  authMode = mode;
  const isRegister = mode === "register";
  dom.authLoginTab.setAttribute("aria-pressed", String(!isRegister));
  dom.authRegisterTab.setAttribute("aria-pressed", String(isRegister));
  dom.authSubmit.textContent = isRegister ? "Create account" : "Log in";
  dom.authPasscode.setAttribute("autocomplete", isRegister ? "new-password" : "current-password");
  showAuthMessage(isRegister
    ? "Accounts are stored locally in this browser."
    : "Log in with a local profile on this device.");
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
  return parseJson(localStorage.getItem(STORAGE_KEYS.accounts)) || {};
}

function saveAccounts(accounts) {
  localStorage.setItem(STORAGE_KEYS.accounts, JSON.stringify(accounts));
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
          <span>${escapeHtml(account.provider === "gmail-local" ? "Local Gmail profile" : "Local PrepFit account")}</span>
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

  return `prepfit-account:${currentAccount.id}:${type}`;
}

function loadAccountFavorites() {
  const accountKey = accountStorageKey("favorites");
  const saved = parseJson(localStorage.getItem(accountKey));
  if (Array.isArray(saved)) {
    return new Set(saved);
  }

  return loadSet(STORAGE_KEYS.favorites);
}

function normalizeUsername(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "");
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isGmailAddress(value) {
  return /^[^\s@]+@gmail\.com$/.test(value);
}

function gmailAccountId(email) {
  return `gmail:${email}`;
}

function displayUsername(value) {
  return String(value || "").trim().replace(/\s+/g, " ").slice(0, 24);
}

async function hashPasscode(username, passcode) {
  const text = `prepfit:${username}:${passcode}`;
  if (window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(text);
    const digest = await window.crypto.subtle.digest("SHA-256", bytes);
    return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
  }

  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = ((hash << 5) - hash + text.charCodeAt(index)) | 0;
  }
  return String(hash);
}

function generatePlan(options = {}) {
  if (!currentAccount) {
    return;
  }

  const settings = readSettings();
  saveSettings(settings);
  updateGoalLabel(settings);

  const plan = buildPlan(settings, options);
  const groceries = aggregateGroceries(plan.days, settings.people);
  const averages = averageMacros(plan.days);
  const warning = buildWarning(plan, settings);

  state = { settings, plan, groceries, averages, warning };
  lastGroceryText = groceryText(groceries);

  renderSummary(settings, plan, averages, warning);
  renderMeals(plan, settings);
  renderGroceries(groceries);
  renderPrepSchedule(plan, settings);
  renderFavorites();
  dom.plannerNote.textContent = warning || "Auto-saved. Changes regenerate the plan.";
}

function readSettings() {
  const data = new FormData(dom.form);
  const days = clamp(numberFrom(data.get("days"), DEFAULTS.days), 1, 7);
  const people = clamp(numberFrom(data.get("people"), DEFAULTS.people), 1, 8);
  const goalMode = oneOf(data.get("goalMode"), ["daily", "weekly"], DEFAULTS.goalMode);
  const rawProtein = clamp(numberFrom(data.get("proteinGoal"), DEFAULTS.proteinGoal), 0, 9999);
  const dailyTarget = goalMode === "weekly" ? rawProtein / days : rawProtein;

  return {
    goalMode,
    proteinGoal: rawProtein,
    dailyTarget: clamp(dailyTarget, 30, 340),
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
  const dayCount = settings.days;
  const usedNames = new Set();
  const days = [];
  const seed = options.shuffle ? Math.random() : 0;

  if (settings.mealMode === "batch") {
    const selected = selectDayMeals(settings, usedNames, seed);
    for (let day = 1; day <= dayCount; day += 1) {
      days.push(makeDay(day, selected, settings));
    }
    return { days, relaxed: selected.relaxed, unavailable: selected.unavailable };
  }

  let relaxed = false;
  let unavailable = false;
  for (let day = 1; day <= dayCount; day += 1) {
    const selected = selectDayMeals(settings, usedNames, seed + day);
    selected.meals.forEach((meal) => usedNames.add(meal.name));
    relaxed = relaxed || selected.relaxed;
    unavailable = unavailable || selected.unavailable;
    days.push(makeDay(day, selected, settings));
  }

  return { days, relaxed, unavailable };
}

function selectDayMeals(settings, usedNames, seed = 0) {
  const meals = MEAL_TYPES.map((type) => {
    const candidates = recipeCandidates(type, settings);
    const relaxedCandidates = candidates.length ? candidates : recipeCandidates(type, { ...settings, excluded: [] });
    const usable = relaxedCandidates.length ? relaxedCandidates : RECIPES[type.toLowerCase()];
    return pickBestRecipe(type, usable, settings, usedNames, seed);
  });

  const currentProtein = meals.reduce((sum, meal) => sum + meal.macros.protein, 0);
  const targetFromFood = Math.max(30, settings.dailyTarget - settings.powderProtein);
  const scaledMeals = scaleMealsToProtein(meals, targetFromFood, settings);

  return {
    meals: scaledMeals,
    relaxed: meals.some((meal) => meal.relaxed),
    unavailable: meals.some((meal) => meal.unavailable),
    originalProtein: currentProtein,
  };
}

function recipeCandidates(type, settings) {
  return RECIPES[type.toLowerCase()].filter((recipe) => {
    const cuisineMatch = settings.cuisine === "random" || recipe.cuisine === settings.cuisine || type === "Breakfast";
    const proteinMatch = type === "Breakfast" || recipe.proteinType === settings.meat;
    const avoids = settings.excluded.some((term) => recipe.searchText.includes(term));
    return cuisineMatch && proteinMatch && !avoids;
  });
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
  const targetMealProtein = (settings.dailyTarget - settings.powderProtein) / 3;

  score += Math.abs(macros.protein - targetMealProtein) * 2.2;
  if (macros.calories > MAX_MEAL_CALORIES) score += (macros.calories - MAX_MEAL_CALORIES) * 0.9;
  if (usedNames.has(recipe.name)) score += 240;
  if (favorites.has(recipe.name)) score -= 55;

  if (settings.budget === "budget") score += recipe.cost * 20;
  if (settings.budget === "high-protein") score -= macros.protein * 1.8;
  if (settings.calorieGoal) score += Math.abs(macros.calories - settings.calorieGoal / 3) * 0.16;
  if (settings.carbGoal) score += Math.abs(macros.carbs - settings.carbGoal / 3) * 0.24;
  if (settings.fatGoal) score += Math.abs(macros.fat - settings.fatGoal / 3) * 0.45;
  if (type === "Breakfast" && recipe.cuisine === "classic") score -= 6;

  return score;
}

function scaleMealsToProtein(meals, foodTarget, settings) {
  const current = meals.reduce((sum, meal) => sum + meal.macros.protein, 0);
  if (!Number.isFinite(current) || current <= 0) return meals;

  const ratio = clamp(foodTarget / current, 0.72, settings.budget === "high-protein" ? 1.32 : 1.2);
  return meals.map((meal) => capMeal(scaleMeal(meal, ratio)));
}

function capMeal(meal) {
  if (meal.macros.calories <= MAX_MEAL_CALORIES) return meal;
  const ratio = clamp((MAX_MEAL_CALORIES - 8) / meal.macros.calories, 0.72, 1);
  return scaleMeal(meal, ratio);
}

function makeDay(day, selected, settings) {
  const meals = selected.meals.map((meal, index) => ({ ...meal, label: MEAL_TYPES[index] }));
  const macros = meals.reduce(sumMacros, emptyMacros());
  return {
    day,
    meals,
    macros: addMacros(macros, {
      protein: settings.powderProtein,
      calories: settings.powderProtein ? Math.round(settings.powderProtein * 4.8) : 0,
      carbs: settings.powderProtein ? 3 : 0,
      fat: settings.powderProtein ? 1 : 0,
    }),
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

  const pool = candidates.length ? candidates : RECIPES[type.toLowerCase()].filter((meal) => meal.name !== currentMeal.name);
  const replacement = capMeal(pickBestRecipe(type, pool, settings, usedNames, Math.random()));
  replacement.label = currentMeal.label;

  if (settings.mealMode === "batch") {
    state.plan.days.forEach((day) => {
      day.meals[mealIndex] = cloneRecipe(replacement);
      day.meals[mealIndex].label = currentMeal.label;
      day.macros = macrosForDay(day.meals, settings.powderProtein);
    });
  } else {
    currentDay.meals[mealIndex] = replacement;
    currentDay.macros = macrosForDay(currentDay.meals, settings.powderProtein);
  }

  state.groceries = aggregateGroceries(state.plan.days, settings.people);
  state.averages = averageMacros(state.plan.days);
  lastGroceryText = groceryText(state.groceries);
  renderSummary(settings, state.plan, state.averages, state.warning);
  renderMeals(state.plan, settings);
  renderGroceries(state.groceries);
  renderPrepSchedule(state.plan, settings);
}

function renderSummary(settings, plan, averages, warning) {
  const actual = Math.round(averages.protein);
  const delta = actual - Math.round(settings.dailyTarget);
  const status = targetStatus(delta, settings.dailyTarget);

  dom.summaryTitle.textContent = `${settings.days}-day ${settings.mealMode} plan`;
  dom.summaryText.textContent = warning || `${status.label}. ${settings.people} ${plural("person", settings.people)} with ${settings.days * settings.people * 3} planned meals.`;
  dom.planStatus.textContent = status.label;
  dom.planStatus.dataset.status = status.kind;

  const stats = [
    ["Duration", `${settings.days} ${plural("day", settings.days)}`],
    ["People", settings.people],
    ["Protein target", `${Math.round(settings.dailyTarget)}g/day`],
    ["Actual protein", `${actual}g/day`],
    ["Powder", `${settings.powderProtein}g/day`],
    ["Cuisine", settings.cuisine === "random" ? "Mixed" : CUISINES[settings.cuisine]],
    ["Budget", budgetLabel(settings.budget)],
    ["Avg calories", Math.round(averages.calories)],
    ["Avg carbs", `${Math.round(averages.carbs)}g`],
    ["Avg fat", `${Math.round(averages.fat)}g`],
    ["Total meals", settings.days * settings.people * 3],
    ["Target status", status.short],
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
    dom.mealPlan.innerHTML = `<div class="empty-state">No meals available for those filters. Try removing one avoided ingredient.</div>`;
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
        <button class="icon-button" type="button" data-action="favorite" data-name="${escapeAttr(meal.name)}" aria-pressed="${favorites.has(meal.name)}">
          ${favorites.has(meal.name) ? "Saved" : "Save"}
        </button>
        <button class="icon-button" type="button" data-action="swap" data-day="${dayIndex}" data-meal="${mealIndex}">Swap</button>
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
        ${groups[category].map((item, index) => `
          <li>
            <label>
              <input type="checkbox" aria-label="Mark ${escapeAttr(item.name)} purchased" />
              <span>
                <strong>${escapeHtml(formatIngredient(item, 1))}</strong>
                <small>${escapeHtml(marketHint(item))}</small>
              </span>
            </label>
          </li>
        `).join("")}
      </ul>
    </section>
  `).join("");
}

function renderPrepSchedule(plan, settings) {
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
      text: "Start rice, quinoa, pasta, or potatoes early. Slightly undercook grains for reheating, then spread them on a tray so steam escapes before packing.",
    },
    hasProduce && {
      title: "Chop vegetables",
      text: "Wash, dry, and cut vegetables into similar sizes. Cook sturdy vegetables tender-crisp and keep raw greens separate until serving.",
    },
    {
      title: "Portion meals",
      text: `Set out ${settings.days * settings.people * 3} containers or sections. Add carb base first, vegetables second, protein third, then sauce last or on the side.`,
    },
    hasSauces && {
      title: "Store sauces separately",
      text: "Pack creamy, yogurt, lemon, hummus, and salsa-style sauces separately. Add them after reheating or right before eating.",
    },
    {
      title: "Reheat notes",
      text: "Reheat hot containers loosely covered until steaming. Stir once halfway through, then add cold greens, yogurt sauces, avocado, or lemon.",
    },
  ].filter(Boolean);

  dom.prepSchedule.innerHTML = blocks.map((block) => `
    <section class="prep-block">
      <h3>${escapeHtml(block.title)}</h3>
      <p>${escapeHtml(block.text)}</p>
    </section>
  `).join("");
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

function aggregateGroceries(days, people) {
  const map = new Map();
  days.forEach((day) => {
    day.meals.forEach((meal) => {
      meal.ingredients.forEach((ingredient) => {
        const unit = normalizeUnit(ingredient.unit);
        const key = `${ingredient.name}|${unit}`;
        const current = map.get(key) || { ...ingredient, unit, amount: 0, category: groceryCategory(ingredient.name) };
        current.amount += ingredient.amount * people;
        map.set(key, current);
      });
    });
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
  if (!state) return;
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
  localStorage.removeItem(accountStorageKey("settings"));
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
  localStorage.setItem(accountStorageKey("settings"), JSON.stringify(safe));
}

function restoreSettings() {
  const saved = parseJson(localStorage.getItem(accountStorageKey("settings")))
    || parseJson(localStorage.getItem(STORAGE_KEYS.settings))
    || DEFAULTS;
  applySettings({ ...DEFAULTS, ...saved });
  updateGoalLabel();
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
  dom.goalLabel.textContent = settings.goalMode === "weekly"
    ? "Protein per person per week"
    : "Protein per person per day";
}

function toggleTheme() {
  const next = document.body.dataset.theme === "evening" ? "morning" : "evening";
  if (document.startViewTransition) {
    document.startViewTransition(() => applyTheme(next));
  } else {
    applyTheme(next);
  }
  localStorage.setItem(STORAGE_KEYS.theme, next);
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

function buildWarning(plan, settings) {
  const warnings = [];
  if (plan.relaxed) warnings.push("Some avoided ingredients were relaxed because the filters were too strict.");
  if (plan.unavailable) warnings.push("A fallback recipe was used because there were not enough matches.");
  if (settings.dailyTarget - settings.powderProtein > 230) warnings.push("Protein target is very high, so portions may be larger than a typical prep meal.");
  return warnings.join(" ");
}

function targetStatus(delta, target) {
  const tolerance = Math.max(8, target * 0.08);
  if (Math.abs(delta) <= tolerance) return { kind: "near", label: "Near target", short: "Near" };
  if (delta < 0) return { kind: "under", label: "Under target", short: `${Math.abs(Math.round(delta))}g under` };
  return { kind: "over", label: "Over target", short: `${Math.round(delta)}g over` };
}

function buildRecipeLibrary() {
  const breakfast = [
    recipe("Breakfast", "classic", "vegetarian", "Greek Yogurt Power Oats", [
      item("plain Greek yogurt", 1, "cup"),
      item("rolled oats", 0.5, "cup"),
      item("whey protein powder", 0.5, "scoop"),
      item("blueberries", 0.5, "cup"),
      item("peanut butter", 1, "tbsp"),
    ], ["Stir yogurt, oats, and protein powder together.", "Top with blueberries and peanut butter.", "Chill overnight or portion immediately."], 1),
    recipe("Breakfast", "classic", "turkey", "Egg White Turkey Scramble", [
      item("egg whites", 1, "cup"),
      item("whole eggs", 1, "count"),
      item("turkey slices", 3, "oz"),
      item("spinach", 1, "cup"),
      item("shredded cheese", 0.15, "cup"),
    ], ["Cook turkey and spinach in a nonstick skillet.", "Add eggs and egg whites, then scramble until set.", "Cool before packing."], 2),
    recipe("Breakfast", "classic", "vegetarian", "Cottage Cheese Egg Toast", [
      item("cottage cheese", 0.75, "cup"),
      item("whole eggs", 2, "count"),
      item("whole grain bread", 2, "slices"),
      item("avocado", 0.25, "count"),
    ], ["Toast bread and cook eggs.", "Spread cottage cheese over toast.", "Pack avocado separately and add after reheating."], 2),
    recipe("Breakfast", "classic", "vegetarian", "Paneer Spinach Breakfast Bowl", [
      item("paneer cheese", 3.5, "oz"),
      item("whole eggs", 1, "count"),
      item("spinach", 1.5, "cups"),
      item("baby potatoes", 4, "oz"),
      item("masala spices", 1, "tsp"),
    ], ["Roast potatoes with masala spices.", "Sear paneer and wilt spinach.", "Top with a cooked egg before portioning."], 3),
  ];

  return {
    breakfast,
    lunch: buildCuisineMeals("Lunch"),
    dinner: buildCuisineMeals("Dinner"),
  };
}

function buildCuisineMeals(label) {
  const mealProfiles = {
    Lunch: { proteinOz: 6, format: "Bowl", intensity: 1 },
    Dinner: { proteinOz: 7, format: "Plate", intensity: 1.08 },
  };
  const profile = mealProfiles[label];
  const cuisineTemplates = {
    american: [
      ["Barbecue", "brown rice", 0.75, "cup", "slaw mix", 1.25, "cups", "barbecue sauce", 2, "tbsp"],
      ["Ranch Potato", "baby potatoes", 8, "oz", "green beans", 1.5, "cups", "steak seasoning", 1, "tsp"],
      ["Sweet Potato", "sweet potato", 1, "count", "broccoli", 1.4, "cups", "olive oil", 1, "tbsp"],
      ["Buffalo Rice", "rice", 0.75, "cup", "slaw mix", 1.4, "cups", "barbecue sauce", 1.5, "tbsp"],
      ["Garden Farro", "farro", 0.75, "cup", "asparagus", 1.25, "cups", "lemon", 0.5, "count"],
      ["Harvest Bean", "pinto beans", 0.65, "cup", "corn", 0.75, "cup", "steak seasoning", 1, "tsp"],
      ["Lemon Green", "quinoa", 0.75, "cup", "green beans", 1.6, "cups", "lemon", 0.5, "count"],
    ],
    mexican: [
      ["Fajita", "rice", 0.75, "cup", "fajita vegetables", 1.5, "cups", "salsa", 0.3, "cup"],
      ["Taco Bean", "black beans", 0.75, "cup", "romaine lettuce", 1.2, "cups", "taco seasoning", 1, "tbsp"],
      ["Salsa Verde", "quinoa", 0.75, "cup", "corn", 0.6, "cup", "salsa", 0.3, "cup"],
      ["Burrito", "pinto beans", 0.75, "cup", "fajita vegetables", 1.25, "cups", "salsa", 0.25, "cup"],
      ["Street Corn", "brown rice", 0.75, "cup", "corn", 0.85, "cup", "taco seasoning", 1, "tbsp"],
      ["Chipotle", "black beans", 0.65, "cup", "bell peppers", 1.35, "cups", "taco seasoning", 1, "tbsp"],
      ["Taco Sweet Potato", "sweet potato", 1, "count", "romaine lettuce", 1.25, "cups", "salsa", 0.3, "cup"],
    ],
    italian: [
      ["Marinara", "protein pasta", 2, "oz", "zucchini", 1.25, "cups", "marinara sauce", 0.5, "cup"],
      ["Pesto Farro", "farro", 0.75, "cup", "spinach", 1.5, "cups", "parmesan cheese", 2, "tbsp"],
      ["Tomato Basil", "brown rice", 0.75, "cup", "bell peppers", 1.2, "cups", "tomato sauce", 0.5, "cup"],
      ["Alfredo Broccoli", "protein pasta", 2, "oz", "broccoli", 1.5, "cups", "light Alfredo sauce", 0.35, "cup"],
      ["Arrabbiata", "protein pasta", 2, "oz", "bell peppers", 1.25, "cups", "marinara sauce", 0.55, "cup"],
      ["Garlic Tomato", "quinoa", 0.75, "cup", "zucchini", 1.5, "cups", "garlic", 2, "clove"],
      ["Mozzarella Bake", "protein pasta", 2, "oz", "spinach", 1.5, "cups", "mozzarella cheese", 0.25, "cup"],
    ],
    mediterranean: [
      ["Greek", "quinoa", 0.75, "cup", "romaine lettuce", 1.4, "cups", "tzatziki", 2, "tbsp"],
      ["Hummus Pita", "pita", 1, "count", "spinach", 1.5, "cups", "hummus", 2, "tbsp"],
      ["Lemon Couscous", "couscous", 0.75, "cup", "asparagus", 1.1, "cups", "lemon", 0.5, "count"],
      ["Chickpea Garden", "chickpeas", 0.75, "cup", "bell peppers", 1.25, "cups", "olive oil", 1, "tbsp"],
      ["Za'atar Rice", "brown rice", 0.75, "cup", "green beans", 1.5, "cups", "hummus", 1.5, "tbsp"],
      ["Herbed Farro", "farro", 0.75, "cup", "spinach", 1.7, "cups", "tzatziki", 2, "tbsp"],
      ["Olive Lemon", "quinoa", 0.75, "cup", "asparagus", 1.4, "cups", "olive oil", 1, "tbsp"],
    ],
    indian: [
      ["Tikka Masala", "basmati rice", 0.75, "cup", "bell peppers", 1.5, "cups", "tikka masala sauce", 3, "tbsp"],
      ["Curry", "cauliflower rice", 1.5, "cups", "spinach", 2, "cups", "curry simmer sauce", 0.5, "cup"],
      ["Masala Lentil", "lentils", 0.75, "cup", "onion", 0.5, "count", "masala spices", 1, "tbsp"],
      ["Ginger Naan", "naan", 1, "count", "green beans", 1.2, "cups", "ginger", 1, "tbsp"],
      ["Yogurt Spice", "brown rice", 0.75, "cup", "broccoli", 1.5, "cups", "yogurt sauce", 2, "tbsp"],
      ["Saag", "basmati rice", 0.75, "cup", "spinach", 2.2, "cups", "coconut cream", 2, "tbsp"],
      ["Coconut Quinoa", "quinoa", 0.75, "cup", "cauliflower rice", 1.25, "cups", "coconut cream", 2, "tbsp"],
    ],
    asian: [
      ["Teriyaki", "brown rice", 0.75, "cup", "broccoli", 1.5, "cups", "teriyaki sauce", 2, "tbsp"],
      ["Soy Ginger", "rice", 0.75, "cup", "stir fry vegetables", 1.5, "cups", "soy sauce", 1, "tbsp"],
      ["Edamame", "quinoa", 0.75, "cup", "edamame", 0.75, "cup", "ginger", 1, "tbsp"],
      ["Garlic Snap Pea", "brown rice", 0.75, "cup", "snap peas", 1.25, "cups", "garlic", 2, "clove"],
      ["Sesame Broccoli", "rice", 0.75, "cup", "broccoli", 1.7, "cups", "soy sauce", 1.2, "tbsp"],
      ["Sweet Teriyaki", "rice", 0.75, "cup", "stir fry vegetables", 1.6, "cups", "teriyaki sauce", 2.2, "tbsp"],
      ["Ginger Quinoa", "quinoa", 0.75, "cup", "snap peas", 1.35, "cups", "ginger", 1, "tbsp"],
    ],
  };

  return Object.entries(cuisineTemplates).flatMap(([cuisine, templates]) =>
    Object.keys(PROTEINS).flatMap((proteinType) =>
      templates.map((template) => cuisineRecipe(label, cuisine, proteinType, template, profile))
    )
  );
}

function cuisineRecipe(label, cuisine, proteinType, template, profile) {
  const [style, carbName, carbAmount, carbUnit, produceName, produceAmount, produceUnit, sauceName, sauceAmount, sauceUnit] = template;
  const protein = proteinItem(proteinType, label, profile.proteinOz * profile.intensity);
  const ingredients = [
    ...protein,
    item(carbName, carbAmount, carbUnit),
    item(produceName, produceAmount, produceUnit),
    item(sauceName, sauceAmount, sauceUnit),
  ];

  const proteinLabel = PROTEINS[proteinType].label;
  return recipe(
    label,
    cuisine,
    proteinType,
    `${style} ${proteinLabel} ${profile.format}`,
    ingredients,
    cookingSteps({ cuisine, proteinType, proteinLabel, carbName, produceName, sauceName, format: profile.format }),
    PROTEINS[proteinType].cost
  );
}

function cookingSteps({ cuisine, proteinType, proteinLabel, carbName, produceName, sauceName, format }) {
  return [
    carbStep(carbName),
    produceStep(produceName),
    proteinStep(proteinType, proteinLabel, cuisine, sauceName),
    sauceStep(sauceName),
    `Build each ${format.toLowerCase()} with the carb base first, then ${produceName}, then the cooked ${proteinLabel.toLowerCase()} component.`,
    "Cool uncovered for 10 to 15 minutes, seal containers, refrigerate, and reheat hot items until steaming.",
  ];
}

function carbStep(name) {
  if (name.includes("pasta")) return `Boil ${name} until just al dente, rinse lightly, and toss with a spoon of sauce so it does not clump.`;
  if (name.includes("potato")) return `Roast ${name} at 425 F with a little oil, salt, and pepper until browned and tender.`;
  if (name.includes("naan") || name.includes("pita")) return `Warm ${name} briefly, then pack separately so it stays soft.`;
  if (name.includes("beans") || name.includes("chickpeas") || name.includes("lentils")) return `Drain and rinse ${name}, then simmer 5 minutes with seasoning so they absorb flavor.`;
  if (name.includes("cauliflower rice")) return `Saute ${name} in a wide pan until moisture cooks off and the texture is fluffy.`;
  return `Cook ${name} with a pinch of salt, then spread it out for a few minutes so steam escapes before packing.`;
}

function produceStep(name) {
  if (name.includes("romaine") || name.includes("slaw") || name.includes("spinach")) {
    return `Wash and dry ${name}; keep it cold or add it after reheating if you want it crisp.`;
  }
  if (name.includes("fajita") || name.includes("stir fry")) {
    return `Sear ${name} in a hot pan until lightly charred but still firm.`;
  }
  if (name.includes("broccoli") || name.includes("green beans") || name.includes("asparagus") || name.includes("snap peas")) {
    return `Steam or saute ${name} until bright and tender-crisp so it reheats well.`;
  }
  if (name.includes("corn") || name.includes("peas") || name.includes("edamame")) {
    return `Warm ${name} in a skillet and season lightly before adding to containers.`;
  }
  return `Chop ${name} evenly and cook just until tender so portions stay consistent.`;
}

function proteinStep(type, label, cuisine, sauceName) {
  const seasoning = cuisineSeasoning(cuisine);
  if (type === "chicken") {
    return `Season chicken with ${seasoning}, sear or bake to 165 F, rest 5 minutes, then slice for even portions.`;
  }
  if (type === "beef") {
    return `Season beef with ${seasoning}; brown ground beef fully or sear steak, rest it, then slice or crumble into portions.`;
  }
  if (type === "turkey") {
    return `Brown turkey with ${seasoning}, breaking it into small pieces so it mixes evenly through the ${sauceName}.`;
  }
  if (type === "fish") {
    return label === "Fish"
      ? `Bake salmon until just flaky or drain tuna well; add ${sauceName} after cooking so the fish stays moist.`
      : `Cook fish gently and keep it slightly saucy so it reheats without drying out.`;
  }
  return `Press tofu for 10 minutes, cube it, then sear until golden; warm legumes separately with ${seasoning}.`;
}

function sauceStep(name) {
  if (name.includes("seasoning") || name.includes("spices") || name === "ginger" || name === "garlic") {
    return `Bloom ${name} in the pan for 30 seconds before tossing with the cooked ingredients.`;
  }
  if (name.includes("yogurt") || name.includes("tzatziki") || name.includes("hummus")) {
    return `Pack ${name} in a small side cup and add it after reheating.`;
  }
  if (name.includes("lemon")) {
    return "Squeeze lemon over the meal after reheating for a fresher finish.";
  }
  return `Warm ${name} separately, then spoon it over portions or pack it on the side for better texture.`;
}

function cuisineSeasoning(cuisine) {
  return {
    american: "garlic, paprika, salt, and pepper",
    mexican: "taco seasoning, cumin, and a pinch of salt",
    italian: "garlic, Italian seasoning, salt, and pepper",
    mediterranean: "lemon, oregano, garlic, salt, and pepper",
    indian: "masala spices, ginger, garlic, and salt",
    asian: "soy sauce, ginger, garlic, and black pepper",
  }[cuisine] || "salt, pepper, and garlic";
}

function proteinItem(type, label, ounces) {
  const dinner = label === "Dinner";
  const rounded = Math.round(ounces * 2) / 2;
  const map = {
    chicken: [item("chicken breast", rounded, "oz")],
    beef: [item(dinner ? "sirloin steak" : "lean ground beef", rounded, "oz")],
    turkey: [item("lean ground turkey", rounded, "oz")],
    fish: [item(dinner ? "salmon fillet" : "canned tuna", dinner ? rounded : 1.7, dinner ? "oz" : "cans")],
    vegetarian: dinner
      ? [item("extra firm tofu", rounded, "oz"), item("edamame", 0.5, "cup")]
      : [item("extra firm tofu", Math.max(6, rounded - 1), "oz"), item("chickpeas", 0.5, "cup")],
  };
  return map[type];
}

function recipe(label, cuisine, proteinType, name, ingredients, steps, cost = 2) {
  const normalized = {
    label,
    cuisine,
    proteinType,
    name,
    ingredients,
    steps,
    cost,
  };
  normalized.macros = macrosForMeal(normalized.ingredients);
  normalized.searchText = `${name} ${ingredients.map((ingredient) => ingredient.name).join(" ")}`.toLowerCase();
  return normalized;
}

function item(name, amount, unit) {
  return { name, amount, unit };
}

function cloneRecipe(recipe) {
  return {
    ...recipe,
    ingredients: recipe.ingredients.map((ingredient) => ({ ...ingredient })),
    steps: [...recipe.steps],
    macros: { ...recipe.macros },
  };
}

function scaleMeal(meal, ratio) {
  const scaled = cloneRecipe(meal);
  scaled.ingredients = scaled.ingredients.map((ingredient) => ({
    ...ingredient,
    amount: Math.max(0.05, roundAmount(ingredient.amount * ratio)),
  }));
  scaled.macros = macrosForMeal(scaled.ingredients);
  return scaled;
}

function macrosForDay(meals, powderProtein) {
  const macros = meals.reduce(sumMacros, emptyMacros());
  return addMacros(macros, {
    protein: powderProtein,
    calories: powderProtein ? Math.round(powderProtein * 4.8) : 0,
    carbs: powderProtein ? 3 : 0,
    fat: powderProtein ? 1 : 0,
  });
}

function macrosForMeal(ingredients) {
  return ingredients.reduce((sum, ingredient) => {
    const macro = macrosForIngredient(ingredient);
    return addMacros(sum, macro);
  }, emptyMacros());
}

function macrosForIngredient(ingredient) {
  const base = MACROS[ingredient.name] || { protein: ingredient.protein || 0, calories: 25, carbs: 4, fat: 0 };
  const factor = ingredient.amount;
  return {
    protein: base.protein * factor,
    calories: base.calories * factor,
    carbs: base.carbs * factor,
    fat: base.fat * factor,
  };
}

function averageMacros(days) {
  if (!days.length) return emptyMacros();
  const total = days.reduce((sum, day) => addMacros(sum, day.macros), emptyMacros());
  return {
    protein: total.protein / days.length,
    calories: total.calories / days.length,
    carbs: total.carbs / days.length,
    fat: total.fat / days.length,
  };
}

function sumMacros(sum, meal) {
  return addMacros(sum, meal.macros);
}

function addMacros(a, b) {
  return {
    protein: a.protein + b.protein,
    calories: a.calories + b.calories,
    carbs: a.carbs + b.carbs,
    fat: a.fat + b.fat,
  };
}

function emptyMacros() {
  return { protein: 0, calories: 0, carbs: 0, fat: 0 };
}

function formatIngredient(ingredient, multiplier) {
  const amount = roundAmount(ingredient.amount * multiplier);
  const unit = displayUnit(normalizeUnit(ingredient.unit), amount);
  return `${formatAmount(amount)} ${unit} ${ingredient.name}`;
}

function marketHint(ingredient) {
  const name = ingredient.name;
  const unit = normalizeUnit(ingredient.unit);
  const amount = ingredient.amount;
  const lower = name.toLowerCase();

  if (unit === "oz") {
    const pounds = amount / 16;
    if (pounds >= 0.75) {
      return `${formatAmount(roundUpTo(pounds, 0.25))} lb`;
    }
    return `${Math.ceil(amount)} oz`;
  }

  if (unit === "can") {
    return `${Math.ceil(amount)} ${plural("can", Math.ceil(amount))}`;
  }

  if (unit === "count") {
    return countMarketHint(lower, amount);
  }

  if (unit === "cup") {
    return cupMarketHint(lower, amount);
  }

  if (unit === "tbsp" || unit === "tsp") {
    return pantryMarketHint(lower, amount, unit);
  }

  if (unit === "slice") {
    return `1 loaf/pack`;
  }

  if (unit === "scoop") {
    return `${formatAmount(amount)} ${displayUnit(unit, amount)}`;
  }

  return formatIngredient(ingredient, 1);
}

function countMarketHint(name, amount) {
  const count = Math.ceil(amount);
  if (name.includes("egg")) return `${roundUpToDozen(count)} eggs`;
  if (name.includes("avocado")) return `${count} ${plural("avocado", count)}`;
  if (name.includes("lemon")) return `${count} ${plural("lemon", count)}`;
  if (name.includes("naan") || name.includes("pita")) return "1 pack";
  if (name.includes("sweet potato")) return `${count} medium sweet ${plural("potato", count)}`;
  if (name.includes("onion")) return `${count} medium ${plural("onion", count)}`;
  return `${count} ${plural("piece", count)}`;
}

function cupMarketHint(name, amount) {
  if (["rice", "brown rice", "basmati rice", "quinoa", "farro", "couscous", "lentils"].includes(name)) {
    const dryCups = amount / 3;
    return `${formatAmount(roundUpTo(dryCups, 0.25))} dry cups / 1 lb bag`;
  }

  if (name.includes("beans") || name.includes("chickpeas")) {
    const cans = Math.max(1, Math.ceil(amount / 1.5));
    return `${cans} ${plural("can", cans)} / ${formatAmount(roundUpTo(amount / 3, 0.25))} dry cups`;
  }

  if (name.includes("egg whites")) {
    const cartons = Math.max(1, Math.ceil(amount / 2));
    return `${cartons} 16 oz ${plural("carton", cartons)}`;
  }

  if (name.includes("greek yogurt") || name.includes("cottage cheese")) {
    const ounces = amount * 8;
    return `${Math.ceil(ounces)} oz tub`;
  }

  if (name.includes("shredded cheese") || name.includes("mozzarella") || name.includes("parmesan")) {
    const ounces = amount * 4;
    return `${Math.max(4, Math.ceil(ounces))} oz package`;
  }

  if (name.includes("spinach") || name.includes("romaine") || name.includes("slaw")) {
    const bags = Math.max(1, Math.ceil(amount / 4));
    return `${bags} ${plural("bag", bags)} / clamshell`;
  }

  if (name.includes("broccoli") || name.includes("green beans") || name.includes("asparagus") || name.includes("snap peas")) {
    const pounds = amount / 3;
    return `${formatAmount(roundUpTo(pounds, 0.25))} lb`;
  }

  if (name.includes("bell peppers")) {
    const peppers = Math.max(1, Math.ceil(amount / 1.5));
    return `${peppers} ${plural("bell pepper", peppers)}`;
  }

  if (name.includes("zucchini")) {
    const zucchini = Math.max(1, Math.ceil(amount / 1.5));
    return `${zucchini} medium ${plural("zucchini", zucchini)}`;
  }

  if (name.includes("corn") || name.includes("peas") || name.includes("edamame") || name.includes("cauliflower rice") || name.includes("vegetables")) {
    const bags = Math.max(1, Math.ceil(amount / 3));
    return `${bags} frozen ${plural("bag", bags)}`;
  }

  if (name.includes("salsa") || name.includes("sauce") || name.includes("tomatoes")) {
    const jars = Math.max(1, Math.ceil(amount / 2));
    return `${jars} jar/can`;
  }

  if (name.includes("hummus") || name.includes("tzatziki")) {
    return "1 small tub";
  }

  if (name.includes("blueberries")) {
    const pints = Math.max(1, Math.ceil(amount / 2));
    return `${pints} ${plural("pint", pints)}`;
  }

  return `${formatAmount(amount)} ${displayUnit("cup", amount)}`;
}

function pantryMarketHint(name, amount, unit) {
  if (name.includes("oil") || name.includes("soy sauce") || name.includes("seasoning") || name.includes("spices")) {
    return `${formatAmount(amount)} ${displayUnit(unit, amount)} pantry`;
  }

  if (name.includes("peanut butter") || name.includes("hummus") || name.includes("sauce")) {
    return `1 jar/tub`;
  }

  return `${formatAmount(amount)} ${displayUnit(unit, amount)}`;
}

function roundUpTo(value, step) {
  return Math.ceil(value / step) * step;
}

function roundUpToDozen(count) {
  const dozens = Math.ceil(count / 12);
  return `${dozens} ${plural("dozen", dozens)}`;
}

function formatAmount(value) {
  if (Number.isInteger(value)) return String(value);
  if (value < 1) return value.toFixed(2).replace(/0$/, "");
  return value.toFixed(1).replace(/\.0$/, "");
}

function roundAmount(value) {
  return Math.round(value * 20) / 20;
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
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
  localStorage.setItem(key, JSON.stringify([...set]));
}

function parseJson(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
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
