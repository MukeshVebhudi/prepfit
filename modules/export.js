export function createExporter({
  document,
  navigator,
  timers = globalThis,
  urlApi = globalThis.URL,
  BlobType = globalThis.Blob,
}) {
  async function copyText(text, button) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.setAttribute("readonly", "");
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    button.textContent = "Copied";
    timers.setTimeout(() => {
      button.textContent = "Copy";
    }, 1300);
  }

  function planText(plan, groceryText) {
    const days = plan.days.map((day) => {
      const meals = day.meals.map((meal) => meal.removed
        ? `  ${meal.label}: Removed`
        : `  ${meal.label}: ${meal.name} (${Math.round(meal.macros.protein)}g protein)`).join("\n");
      return `Day ${day.day}\n${meals}`;
    }).join("\n\n");
    return `${days}\n\nShopping List\n${groceryText}`;
  }

  function downloadText(text, filename = "prepfit-plan.txt") {
    const blob = new BlobType([text], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = urlApi.createObjectURL(blob);
    link.download = filename;
    document.body.append(link);
    link.click();
    urlApi.revokeObjectURL(link.href);
    link.remove();
  }

  return { copyText, downloadText, planText };
}
