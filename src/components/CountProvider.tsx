"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { getCartItems } from "@/lib/actions/cart.action";
import { getFavoriteProducts } from "@/lib/actions/favorite.action";

interface CountContextType {
  cartCount: number;
  favoritesCount: number;
  setCartCount: (count: number) => void;
  setFavoritesCount: (count: number) => void;
  refreshCounts: () => Promise<void>;
  isRefreshing: boolean;
}

const CountContext = createContext<CountContextType | undefined>(undefined);

interface CountProviderProps {
  children: ReactNode;
  initialCartCount?: number;
  initialFavoritesCount?: number;
}

export function CountProvider({
  children,
  initialCartCount = 0,
  initialFavoritesCount = 0,
}: CountProviderProps) {
  const [cartCount, setCartCount] = useState(initialCartCount);
  const [favoritesCount, setFavoritesCount] = useState(initialFavoritesCount);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
    // Refresh counts after hydration to ensure they're up to date
    refreshCounts();
  }, []);

  const refreshCounts = useCallback(async () => {
    if (isRefreshing) return; // Prevent multiple simultaneous refreshes

    setIsRefreshing(true);
    try {
      // Load cart items
      const cartResult = await getCartItems();
      if (cartResult.success) {
        const newCartCount = cartResult.items?.length || 0;
        setCartCount(newCartCount);
      }

      // Load favorites count using server action
      const favoritesResult = await getFavoriteProducts();
      if (favoritesResult.success) {
        const newFavoritesCount = favoritesResult.favorites?.length || 0;
        setFavoritesCount(newFavoritesCount);
      }
    } catch (error) {
      console.error("Error loading counts:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing]);

  // Listen for custom events to update counts with debouncing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let intervalId: NodeJS.Timeout;

    const debouncedRefresh = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        refreshCounts();
      }, 100); // Debounce by 100ms
    };

    const handleFavoritesUpdate = () => {
      debouncedRefresh();
    };

    const handleCartUpdate = () => {
      debouncedRefresh();
    };

    // Set up periodic refresh every 30 seconds to keep counts in sync
    if (isHydrated) {
      intervalId = setInterval(() => {
        refreshCounts();
      }, 30000); // Refresh every 30 seconds
    }

    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
      window.removeEventListener("cartUpdated", handleCartUpdate);
      clearTimeout(timeoutId);
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [refreshCounts, isHydrated]);

  const contextValue = useMemo(
    () => ({
      cartCount,
      favoritesCount,
      setCartCount,
      setFavoritesCount,
      refreshCounts,
      isRefreshing,
    }),
    [
      cartCount,
      favoritesCount,
      setCartCount,
      setFavoritesCount,
      refreshCounts,
      isRefreshing,
    ]
  );

  return (
    <CountContext.Provider value={contextValue}>
      {children}
    </CountContext.Provider>
  );
}

export function useCounts() {
  const context = useContext(CountContext);
  if (context === undefined) {
    throw new Error("useCounts must be used within a CountProvider");
  }
  return context;
}
