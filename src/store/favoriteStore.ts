import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FavoriteProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  slug: string;
  category: string;
  rating: number;
  reviewCount: number;
  addedAt: string;
}

interface FavoriteStore {
  favorites: FavoriteProduct[];
  isFavorite: (productId: string) => boolean;
  addToFavorites: (product: Omit<FavoriteProduct, "addedAt">) => void;
  removeFromFavorites: (productId: string) => void;
  toggleFavorite: (product: Omit<FavoriteProduct, "addedAt">) => void;
  clearFavorites: () => void;
  getFavoritesCount: () => number;
}

export const useFavoriteStore = create<FavoriteStore>()(
  persist(
    (set, get) => ({
      favorites: [],

      isFavorite: (productId: string) => {
        return get().favorites.some((fav) => fav.id === productId);
      },

      addToFavorites: (product: Omit<FavoriteProduct, "addedAt">) => {
        const { favorites } = get();
        const isAlreadyFavorite = favorites.some(
          (fav) => fav.id === product.id
        );

        if (!isAlreadyFavorite) {
          const newFavorite: FavoriteProduct = {
            ...product,
            addedAt: new Date().toISOString(),
          };
          set({ favorites: [...favorites, newFavorite] });
        }
      },

      removeFromFavorites: (productId: string) => {
        const { favorites } = get();
        set({
          favorites: favorites.filter((fav) => fav.id !== productId),
        });
      },

      toggleFavorite: (product: Omit<FavoriteProduct, "addedAt">) => {
        const { isFavorite, addToFavorites, removeFromFavorites } = get();

        if (isFavorite(product.id)) {
          removeFromFavorites(product.id);
        } else {
          addToFavorites(product);
        }
      },

      clearFavorites: () => {
        set({ favorites: [] });
      },

      getFavoritesCount: () => {
        return get().favorites.length;
      },
    }),
    {
      name: "favorites-storage",
      version: 1,
    }
  )
);
