// Helper to save/load/remove JSON in localStorage
export const setStorage = (key, value) => {
  try {
    const data = {
      value,
      expiry: Date.now() + 24 * 60 * 60 * 1000, // 1 day
    };
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save to storage:", e);
  }
};

export const getStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const parsed = JSON.parse(item);
    if (Date.now() > parsed.expiry) {
      // expired
      localStorage.removeItem(key);
      return null;
    }

    return parsed.value;
  } catch (e) {
    console.error("Failed to get storage:", e);
    return null;
  }
};

export const removeStorage = (key) => {
  localStorage.removeItem(key);
};