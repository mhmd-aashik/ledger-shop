"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

export default function DebugSessionPage() {
  const { data: session, status } = useSession();
  const [isClearing, setIsClearing] = useState(false);

  const clearSession = async () => {
    setIsClearing(true);
    try {
      const response = await fetch("/api/clear-session", {
        method: "POST",
      });

      if (response.ok) {
        // Clear client-side storage
        localStorage.clear();
        sessionStorage.clear();

        // Reload the page to refresh the session
        window.location.reload();
      }
    } catch (error) {
      console.error("Error clearing session:", error);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Session Debug</h1>

        <div className="bg-gray-100 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-2">Current Session Status</h2>
          <p>
            <strong>Status:</strong> {status}
          </p>
          <p>
            <strong>User:</strong> {session?.user?.email || "Not signed in"}
          </p>
          <p>
            <strong>User ID:</strong> {session?.user?.id || "N/A"}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={clearSession}
            disabled={isClearing}
            className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            {isClearing ? "Clearing..." : "Clear Session"}
          </button>

          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Go to Home
          </Link>
        </div>

        <div className="mt-8 bg-yellow-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li>Click &quot;Clear Session&quot; to remove all session data</li>
            <li>Check if the session status changes</li>
            <li>Go to home page to test if the JWT error is resolved</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
