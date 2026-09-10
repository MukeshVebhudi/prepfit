export function oneOf(value, options, fallback) {
  return options.includes(value) ? value : fallback;
}

export function numberFrom(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

export function seededNoise(value, seed) {
  let hash = Math.floor(seed * 1000);
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 9973;
  }
  return hash / 9973;
}

export function groupBy(items, key) {
  return items.reduce((groups, item) => {
    const value = item[key];
    groups[value] = groups[value] || [];
    groups[value].push(item);
    return groups;
  }, {});
}

export function debounce(callback, delay, timers = window) {
  let timeout;
  return (...args) => {
    timers.clearTimeout(timeout);
    timeout = timers.setTimeout(() => callback(...args), delay);
  };
}

export function plural(word, count) {
  return count === 1 ? word : `${word}s`;
}

export function listWords(values) {
  if (values.length <= 1) return values.join("");
  if (values.length === 2) return values.join(" and ");
  return `${values.slice(0, -1).join(", ")}, and ${values.at(-1)}`;
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;",
  })[char]);
}

export const escapeAttr = escapeHtml;
