/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  getFavoriteIds,
  removeFavorite as removeStoredFavorite,
  toggleFavorite as toggleStoredFavorite,
} from "../utils/favorites";

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
  const [favoriteIds, setFavoriteIds] = useState(() => getFavoriteIds());

  const syncFavorites = useCallback(() => {
    setFavoriteIds(getFavoriteIds());
  }, []);

  useEffect(() => {
    window.addEventListener("favorites:changed", syncFavorites);
    window.addEventListener("storage", syncFavorites);

    return () => {
      window.removeEventListener("favorites:changed", syncFavorites);
      window.removeEventListener("storage", syncFavorites);
    };
  }, [syncFavorites]);

  const isFavorite = useCallback(
    (productId) => favoriteIds.includes(productId),
    [favoriteIds],
  );

  const toggleFavorite = useCallback((productId) => {
    const saved = toggleStoredFavorite(productId);
    setFavoriteIds(getFavoriteIds());
    return saved;
  }, []);

  const removeFavorite = useCallback((productId) => {
    const updated = removeStoredFavorite(productId);
    setFavoriteIds(updated);
  }, []);

  const value = useMemo(
    () => ({
      favoriteIds,
      favoriteCount: favoriteIds.length,
      isFavorite,
      toggleFavorite,
      removeFavorite,
    }),
    [favoriteIds, isFavorite, removeFavorite, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }

  return context;
};
