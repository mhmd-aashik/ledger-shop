"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";

export default function TestAuthPage() {
  const { data: session, status } = useSession();
  const [isClearing, setIsClearing] = useState(false);

  const clearSession = async () => {
    setIsClearing(true);
    try {
      const response = await fetch("/api/clear-session", {
        method: "POST",
      });

      if (response.ok) {
        localStorage.clear();
        sessionStorage.clear();
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Authentication Test</h1>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Session Status</h2>
            <div className="space-y-2">
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={
                    status === "loading"
                      ? "text-yellow-600"
                      : status === "authenticated"
                        ? "text-green-600"
                        : "text-red-600"
                  }
                >
                  {status}
                </span>
              </p>
              <p>
                <strong>User Email:</strong>{" "}
                {session?.user?.email || "Not signed in"}
              </p>
              <p>
                <strong>User ID:</strong> {session?.user?.id || "N/A"}
              </p>
              <p>
                <strong>User Name:</strong> {session?.user?.name || "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-blue-100 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="space-y-3">
              <button
                onClick={clearSession}
                disabled={isClearing}
                className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isClearing ? "Clearing..." : "Clear Session"}
              </button>

              <a
                href="/sign-in"
                className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center"
              >
                Sign In
              </a>

              <a
                href="/"
                className="block w-full bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-center"
              >
                Go to Home
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-green-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">✅ Fixed Issues:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>Disabled problematic NextAuth middleware</li>
            <li>
              Created safe HeaderServer component without getServerSession
            </li>
            <li>Session loading now happens on client-side</li>
            <li>JWT decryption errors are handled gracefully</li>
          </ul>
        </div>

        <div className="mt-4 bg-yellow-100 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">🔧 Next Steps:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Clear your session using the button above</li>
            <li>Go to home page - it should load without errors</li>
            <li>Try signing in again</li>
            <li>Test the authentication flow</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
