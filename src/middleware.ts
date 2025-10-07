import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Define public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/products",
    "/about",
    "/contact",
    "/sign-in",
    "/sign-up",
    "/api/auth",
  ];

  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Allow access to public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check for session token in cookies
  const sessionToken =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value;

  // If no session token, redirect to sign-in
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // Allow access if session token exists
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
