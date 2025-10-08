"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getFavoriteProducts } from "@/lib/actions/favorite.action";

interface FavoritesContextType {
  favoritedProductIds: Set<string>;
  isProductFavorited: (productId: string) => boolean;
  refreshFavorites: () => Promise<void>;
  isRefreshing: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

interface FavoritesProviderProps {
  children: ReactNode;
}

export function FavoritesProvider({ children }: FavoritesProviderProps) {
  const [favoritedProductIds, setFavoritedProductIds] = useState<Set<string>>(
    new Set()
  );
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshFavorites = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      const result = await getFavoriteProducts();
      if (result.success && result.favorites) {
        const favoriteIds = new Set(result.favorites.map((fav) => fav.id));
        setFavoritedProductIds(favoriteIds);
      }
    } catch (error) {
      console.error("Error refreshing favorites:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const isProductFavorited = (productId: string) => {
    return favoritedProductIds.has(productId);
  };

  // Load favorites on mount
  useEffect(() => {
    refreshFavorites();
  }, []);

  // Listen for favorites updates
  useEffect(() => {
    const handleFavoritesUpdate = () => {
      refreshFavorites();
    };

    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);
    return () =>
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
  }, []);

  const contextValue: FavoritesContextType = {
    favoritedProductIds,
    isProductFavorited,
    refreshFavorites,
    isRefreshing,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
