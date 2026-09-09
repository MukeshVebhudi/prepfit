export function parseJson(value) {
  try {
    return value ? JSON.parse(value) : null;
  } catch (error) {
    return null;
  }
}

export function createStorage(storage, reportError = () => {}) {
  function get(key) {
    try {
      return storage.getItem(key);
    } catch (error) {
      console.warn(`PrepFit: could not read "${key}" locally.`, error);
      reportError("Browser storage is unavailable. PrepFit could not restore saved data.");
      return null;
    }
  }

  function set(key, value) {
    try {
      storage.setItem(key, value);
      return true;
    } catch (error) {
      console.warn(`PrepFit: could not save "${key}" locally.`, error);
      reportError("Browser storage is unavailable. Your latest changes will be lost when this page closes.");
      return false;
    }
  }

  function remove(key) {
    try {
      storage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`PrepFit: could not clear "${key}" locally.`, error);
      reportError("Browser storage is unavailable, so saved data could not be cleared.");
      return false;
    }
  }

  function loadSet(key) {
    const value = parseJson(get(key));
    return new Set(Array.isArray(value) ? value : []);
  }

  function saveSet(key, values) {
    return set(key, JSON.stringify([...values]));
  }

  return { get, set, remove, loadSet, saveSet };
}
