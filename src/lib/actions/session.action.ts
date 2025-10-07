"use server";

import { cookies } from "next/headers";

/**
 * Clear the user session
 */
export async function clearSession() {
  try {
    // Clear session cookies directly
    const cookieStore = await cookies();
    const nextAuthCookies = [
      "authjs.session-token",
      "authjs.csrf-token", 
      "authjs.callback-url",
      "__Secure-authjs.session-token",
      "__Host-authjs.csrf-token",
      "__Secure-authjs.callback-url",
    ];

    nextAuthCookies.forEach((cookieName) => {
      cookieStore.delete(cookieName);
    });

    return { success: true };
  } catch (error) {
    console.error("Error clearing session:", error);
    return { success: false, error: "Failed to clear session" };
  }
}
