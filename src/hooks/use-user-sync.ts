"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export function useUserSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Sync user data to database when user is loaded
      fetch("/api/sync-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((result) => {
          if (result.success) {
            console.log("User synced successfully");
          } else {
            console.error("Failed to sync user:", result.error);
          }
        })
        .catch((error) => {
          console.error("Error syncing user:", error);
        });
    }
  }, [isLoaded, user]);

  return { user, isLoaded };
}
