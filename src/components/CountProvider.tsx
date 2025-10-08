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

  const refreshCounts = useCallback(async () => {
    if (isRefreshing) return; // Prevent multiple simultaneous refreshes

    setIsRefreshing(true);
    try {
      // Load cart items and favorites in parallel
      const [cartResult, favoritesResult] = await Promise.all([
        getCartItems(),
        getFavoriteProducts(),
      ]);

      if (cartResult.success) {
        const newCartCount = cartResult.items?.length || 0;
        setCartCount(newCartCount);
      }

      if (favoritesResult.success) {
        const newFavoritesCount = favoritesResult.favorites?.length || 0;
        setFavoritesCount(newFavoritesCount);
      }
    } catch (error) {
      console.error("Error loading counts:", error);
    } finally {
      setIsRefreshing(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Remove isRefreshing dependency to prevent infinite loop

  // Handle hydration
  useEffect(() => {
    setIsHydrated(true);
    // Only refresh counts once after hydration if no initial counts provided
    if (initialCartCount === 0 && initialFavoritesCount === 0) {
      refreshCounts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCartCount, initialFavoritesCount]); // Remove refreshCounts dependency

  // Listen for custom events to update counts with debouncing
  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;

    let timeoutId: NodeJS.Timeout;

    const debouncedRefresh = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        if (!isRefreshing) {
          refreshCounts();
        }
      }, 1000); // Increased debounce to 1 second to reduce calls
    };

    const handleFavoritesUpdate = () => {
      debouncedRefresh();
    };

    const handleCartUpdate = () => {
      debouncedRefresh();
    };

    window.addEventListener("favoritesUpdated", handleFavoritesUpdate);
    window.addEventListener("cartUpdated", handleCartUpdate);

    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdate);
      window.removeEventListener("cartUpdated", handleCartUpdate);
      clearTimeout(timeoutId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated, isRefreshing]); // Remove refreshCounts dependency

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
