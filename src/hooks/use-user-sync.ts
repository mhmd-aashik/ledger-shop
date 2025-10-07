"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export function useUserSync() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
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
  }, [status, session]);

  return { user: session?.user, isLoaded: status !== "loading" };
}
