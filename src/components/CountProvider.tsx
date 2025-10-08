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

    let cartTimeoutId: NodeJS.Timeout;

    const debouncedCartRefresh = () => {
      clearTimeout(cartTimeoutId);
      cartTimeoutId = setTimeout(async () => {
        if (!isRefreshing) {
          try {
            const result = await getCartItems();
            if (result.success) {
              const newCartCount = result.items?.length || 0;
              setCartCount(newCartCount);
            }
          } catch (error) {
            console.error("Error refreshing cart count:", error);
          }
        }
      }, 500); // Faster response for cart
    };

    const handleCartUpdate = () => {
      debouncedCartRefresh();
    };

    const handleFavoritesCountUpdate = (event: CustomEvent) => {
      const count = event.detail?.count || 0;
      setFavoritesCount(count);
    };

    // Listen to cart updates and favorites count updates
    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener(
      "favoritesCountUpdated",
      handleFavoritesCountUpdate as EventListener
    );

    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener(
        "favoritesCountUpdated",
        handleFavoritesCountUpdate as EventListener
      );
      clearTimeout(cartTimeoutId);
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
