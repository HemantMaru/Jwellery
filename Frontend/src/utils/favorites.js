const FAVORITES_KEY = "favorites";

export const getFavoriteIds = () => {
  try {
    const favorites = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(favorites) ? favorites : [];
  } catch {
    return [];
  }
};

export const isFavorite = (productId) => {
  return getFavoriteIds().includes(productId);
};

export const toggleFavorite = (productId) => {
  const favorites = getFavoriteIds();
  const exists = favorites.includes(productId);
  const updated = exists
    ? favorites.filter((id) => id !== productId)
    : [...favorites, productId];

  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("favorites:changed"));

  return !exists;
};

export const removeFavorite = (productId) => {
  const updated = getFavoriteIds().filter((id) => id !== productId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event("favorites:changed"));
  return updated;
};
