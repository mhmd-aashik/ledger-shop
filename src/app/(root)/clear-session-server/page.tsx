import { clearSession } from "@/lib/actions/session.action";
import Link from "next/link";

export default async function ClearSessionServerPage() {
  // This will run on the server and clear the session
  const result = await clearSession();

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {result.success ? (
          <>
            <h1 className="text-2xl font-bold mb-4 text-green-600">
              Session Cleared!
            </h1>
            <p className="text-gray-600 mb-4">
              Your session has been successfully cleared.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
            <p className="text-gray-600 mb-4">
              Failed to clear session: {result.error}
            </p>
          </>
        )}
        <Link
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Go to Home Page
        </Link>
      </div>
    </div>
  );
}
