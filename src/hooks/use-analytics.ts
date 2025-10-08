"use client";

import { useCallback } from "react";
import { useSession } from "next-auth/react";

interface AnalyticsEvent {
  event: string;
  properties?: Record<string, string | number | boolean>;
}

export function useAnalytics() {
  const { data: session } = useSession();

  const track = useCallback(
    async (
      event: string,
      properties?: Record<string, string | number | boolean>
    ) => {
      try {
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
              url: window.location.href,
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
      track("page_view", { page });
    },
    [track]
  );

  const trackProductView = useCallback(
    (productId: string, productName: string) => {
      track("product_view", { productId, productName });
    },
    [track]
  );

  const trackAddToCart = useCallback(
    (
      productId: string,
      productName: string,
      price: number,
      quantity: number = 1
    ) => {
      track("add_to_cart", { productId, productName, price, quantity });
    },
    [track]
  );

  const trackRemoveFromCart = useCallback(
    (productId: string, productName: string) => {
      track("remove_from_cart", { productId, productName });
    },
    [track]
  );

  const trackPurchase = useCallback(
    (
      orderId: string,
      total: number,
      items: { id: string; name: string; price: number; quantity: number }[]
    ) => {
      track("purchase", { orderId, total, items });
    },
    [track]
  );

  const trackSearch = useCallback(
    (query: string, results: number) => {
      track("search", { query, results });
    },
    [track]
  );

  const trackFilter = useCallback(
    (
      filters: Record<string, string | number | string[] | number[] | undefined>
    ) => {
      track("filter", { filters });
    },
    [track]
  );

  const trackFavorite = useCallback(
    (productId: string, productName: string, action: "add" | "remove") => {
      track("favorite", { productId, productName, action });
    },
    [track]
  );

  const trackReview = useCallback(
    (productId: string, rating: number) => {
      track("review", { productId, rating });
    },
    [track]
  );

  const trackContact = useCallback(
    (formType: string) => {
      track("contact", { formType });
    },
    [track]
  );

  const trackNewsletter = useCallback(
    (action: "subscribe" | "unsubscribe") => {
      track("newsletter", { action });
    },
    [track]
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
  return (
    "session_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now()
  );
}
