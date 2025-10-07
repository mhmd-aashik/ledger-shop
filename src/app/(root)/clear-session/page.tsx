"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function ClearSessionPage() {

  useEffect(() => {
    const clearSession = async () => {
      try {
        // Clear all cookies
        document.cookie.split(";").forEach((c) => {
          const eqPos = c.indexOf("=");
          const name = eqPos > -1 ? c.substr(0, eqPos) : c;
          document.cookie =
            name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
          document.cookie =
            name +
            "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=localhost";
        });

        // Clear localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Sign out from NextAuth
        await signOut({ redirect: false });

        // Small delay to ensure everything is cleared
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } catch (error) {
        console.error("Error clearing session:", error);
        // Even if there's an error, redirect to home
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    };

    clearSession();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Clearing Session...</h1>
        <p className="text-gray-600">
          Please wait while we clear your session data.
        </p>
        <div className="mt-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
