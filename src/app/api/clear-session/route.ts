import { NextResponse } from "next/server";

export async function POST() {

  // Clear NextAuth cookies
  const nextAuthCookies = [
    "next-auth.session-token",
    "next-auth.csrf-token",
    "next-auth.callback-url",
    "__Secure-next-auth.session-token",
    "__Host-next-auth.csrf-token",
    "__Secure-next-auth.callback-url",
  ];

  const response = NextResponse.json({ success: true });

  nextAuthCookies.forEach((cookieName) => {
    response.cookies.delete(cookieName);
  });

  return response;
}
