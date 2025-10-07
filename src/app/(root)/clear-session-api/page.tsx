"use client";

import { useEffect, useState } from "react";

export default function ClearSessionApiPage() {
  const [status, setStatus] = useState<"clearing" | "success" | "error">(
    "clearing"
  );

  useEffect(() => {
    const clearSession = async () => {
      try {
        const response = await fetch("/api/clear-session", {
          method: "POST",
        });

        if (response.ok) {
          // Also clear localStorage and sessionStorage
          localStorage.clear();
          sessionStorage.clear();

          setStatus("success");

          // Redirect after a short delay
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error("Error clearing session:", error);
        setStatus("error");
      }
    };

    clearSession();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {status === "clearing" && (
          <>
            <h1 className="text-2xl font-bold mb-4">Clearing Session...</h1>
            <p className="text-gray-600 mb-4">
              Please wait while we clear your session data.
            </p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </>
        )}

        {status === "success" && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-green-600">
              Session Cleared!
            </h1>
            <p className="text-gray-600 mb-4">
              Your session has been successfully cleared.
            </p>
            <p className="text-sm text-gray-500">Redirecting to home page...</p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
            <p className="text-gray-600 mb-4">
              There was an error clearing your session.
            </p>
            <a
              href="/"
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
            >
              Go to Home Page
            </a>
          </>
        )}
      </div>
    </div>
  );
}
