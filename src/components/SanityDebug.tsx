"use client";

import { useEffect, useState } from "react";
import { client, queries, isSanityReady } from "@/lib/sanity";

export default function SanityDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    const testConnection = async () => {
      console.log("Testing Sanity connection...");
      console.log("Project ID:", process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
      console.log("Dataset:", process.env.NEXT_PUBLIC_SANITY_DATASET);
      console.log("Sanity configured:", isSanityReady());

      if (!isSanityReady()) {
        setDebugInfo({
          connected: false,
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "Not set",
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "Not set",
          error: "Sanity not configured - missing environment variables",
        });
        return;
      }

      try {
        // Test basic connection
        const testQuery = `*[_type == "heroSlide"][0]`;
        const result = await client.fetch(testQuery);

        console.log("Sanity test result:", result);
        setDebugInfo({
          connected: true,
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
          testResult: result,
          hasHeroSlides: !!result,
        });
      } catch (error) {
        console.error("Sanity connection test failed:", error);
        setDebugInfo({
          connected: false,
          error: error.message,
          projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
          dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
        });
      }
    };

    testConnection();
  }, []);

  if (!debugInfo) {
    return <div>Testing Sanity connection...</div>;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">Sanity Debug Info</h3>
      <div className="space-y-1">
        <div>Connected: {debugInfo.connected ? "✅" : "❌"}</div>
        <div>Project ID: {debugInfo.projectId || "Not set"}</div>
        <div>Dataset: {debugInfo.dataset || "Not set"}</div>
        {debugInfo.hasHeroSlides && <div>Hero Slides: ✅ Found</div>}
        {debugInfo.error && (
          <div className="text-red-400">Error: {debugInfo.error}</div>
        )}
      </div>
    </div>
  );
}
