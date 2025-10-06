"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { syncUserFromClerk } from "@/lib/actions/user.action";

export function useUserSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    if (isLoaded && user) {
      // Sync user data to database when user is loaded
      syncUserFromClerk({
        id: user.id,
        emailAddresses: user.emailAddresses,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      }).then((result) => {
        if (result.success) {
          console.log("User synced successfully");
        } else {
          console.error("Failed to sync user:", result.error);
        }
      });
    }
  }, [isLoaded, user]);

  return { user, isLoaded };
}
