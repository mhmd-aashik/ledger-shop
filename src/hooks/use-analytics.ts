"use client";

import { useCallback } from "react";
import { useSession } from "next-auth/react";

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, string | number | boolean>;
}

export function useAnalytics() {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const track = useCallback(
    async (
      event: string,
      properties?: Record<string, string | number | boolean>
    ) => {
      try {
        // Only track on client side
        if (!mounted || typeof window === "undefined") return;

        const sessionId =
          sessionStorage.getItem("sessionId") || generateSessionId();
        if (!sessionStorage.getItem("sessionId")) {
          sessionStorage.setItem("sessionId", sessionId);
        }

        await fetch("/api/analytics/track", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            event,
            properties: {
              ...properties,
              url: typeof window !== "undefined" ? window.location.href : "",
              timestamp: new Date().toISOString(),
            },
            userId: session?.user?.id,
            sessionId,
          }),
        });
      } catch (error) {
        console.error("Analytics tracking error:", error);
      }
    },
    [session?.user?.id]
  );

  const trackPageView = useCallback(
    (page: string) => {
      if (mounted) {
        track("page_view", { page });
      }
    },
    [track, mounted]
  );

  const trackProductView = useCallback(
    (productId: string, productName: string) => {
      if (mounted) {
        track("product_view", { productId, productName });
      }
    },
    [track, mounted]
  );

  const trackAddToCart = useCallback(
    (
      productId: string,
      productName: string,
      price: number,
      quantity: number = 1
    ) => {
      if (mounted) {
        track("add_to_cart", { productId, productName, price, quantity });
      }
    },
    [track, mounted]
  );

  const trackRemoveFromCart = useCallback(
    (productId: string, productName: string) => {
      if (mounted) {
        track("remove_from_cart", { productId, productName });
      }
    },
    [track, mounted]
  );

  const trackPurchase = useCallback(
    (
      orderId: string,
      total: number,
      items: { id: string; name: string; price: number; quantity: number }[]
    ) => {
      if (mounted) {
        track("purchase", { orderId, total, items });
      }
    },
    [track, mounted]
  );

  const trackSearch = useCallback(
    (query: string, results: number) => {
      if (mounted) {
        track("search", { query, results });
      }
    },
    [track, mounted]
  );

  const trackFilter = useCallback(
    (
      filters: Record<string, string | number | string[] | number[] | undefined>
    ) => {
      if (mounted) {
        track("filter", { filters });
      }
    },
    [track, mounted]
  );

  const trackFavorite = useCallback(
    (productId: string, productName: string, action: "add" | "remove") => {
      if (mounted) {
        track("favorite", { productId, productName, action });
      }
    },
    [track, mounted]
  );

  const trackReview = useCallback(
    (productId: string, rating: number) => {
      if (mounted) {
        track("review", { productId, rating });
      }
    },
    [track, mounted]
  );

  const trackContact = useCallback(
    (formType: string) => {
      if (mounted) {
        track("contact", { formType });
      }
    },
    [track, mounted]
  );

  const trackNewsletter = useCallback(
    (action: "subscribe" | "unsubscribe") => {
      if (mounted) {
        track("newsletter", { action });
      }
    },
    [track, mounted]
  );

  return {
    track,
    trackPageView,
    trackProductView,
    trackAddToCart,
    trackRemoveFromCart,
    trackPurchase,
    trackSearch,
    trackFilter,
    trackFavorite,
    trackReview,
    trackContact,
    trackNewsletter,
  };
}

function generateSessionId(): string {
  // Only generate on client side to prevent hydration mismatch
  if (typeof window === "undefined") {
    return "temp_session_id";
  }
  return (
    "session_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
  );
}
