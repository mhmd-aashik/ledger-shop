import { clearSession } from "@/lib/actions/session.action";
import { redirect } from "next/navigation";

export default async function ClearSessionServerPage() {
  // This will run on the server and clear the session
  await clearSession();

  // Use client-side redirect instead of server-side redirect
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Session Cleared!</h1>
        <p className="text-gray-600 mb-4">
          Your session has been successfully cleared.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Go to Home Page
        </a>
      </div>
    </div>
  );
}
