const GRAMS_PER_OUNCE = 28.349523125;
const GRAMS_PER_POUND = 453.59237;

export function normalizeUnitSystem(value) {
  return value === "imperial" ? "imperial" : "metric";
}

export function loadUnitSystem(storage, key) {
  return normalizeUnitSystem(storage.get(key));
}

export function saveUnitSystem(storage, key, value) {
  return storage.set(key, normalizeUnitSystem(value));
}

export function massInGrams(amount, unit) {
  if (unit === "kg") return amount * 1000;
  if (unit === "oz") return amount * GRAMS_PER_OUNCE;
  if (unit === "lb") return amount * GRAMS_PER_POUND;
  return amount;
}

export function displayMass(grams, unitSystem, formatAmount) {
  if (normalizeUnitSystem(unitSystem) === "imperial") {
    const ounces = grams / GRAMS_PER_OUNCE;
    return ounces >= 16
      ? `${formatAmount(grams / GRAMS_PER_POUND)} lb`
      : `${formatAmount(ounces)} oz`;
  }
  return grams >= 1000 ? `${formatAmount(grams / 1000)} kg` : `${formatAmount(grams)} g`;
}
