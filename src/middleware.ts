// Temporarily disabled middleware to fix JWT session errors
// import { withAuth } from "next-auth/middleware";

// export default withAuth(
//   function middleware() {
//     // Add any additional middleware logic here if needed
//   },
//   {
//     callbacks: {
//       authorized: ({ token, req }) => {
//         // Define public routes that don't require authentication
//         const publicRoutes = [
//           "/",
//           "/products",
//           "/about",
//           "/contact",
//           "/sign-in",
//           "/sign-up",
//           "/api/auth",
//         ];

//         const isPublicRoute = publicRoutes.some((route) =>
//           req.nextUrl.pathname.startsWith(route)
//         );

//         // Allow access to public routes or if user has a valid token
//         return isPublicRoute || !!token;
//       },
//     },
//   }
// );

// export const config = {
//   matcher: [
//     // Skip Next.js internals and all static files, unless found in search params
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     // Always run for API routes
//     "/(api|trpc)(.*)",
//   ],
// };

// Temporary middleware that doesn't use NextAuth
export function middleware() {
  // No authentication checks for now
}

export const config = {
  matcher: [
    // Only run on specific routes that need protection
    "/admin/:path*",
    "/profile/:path*",
    "/cart/:path*",
    "/favorites/:path*",
    "/checkout/:path*",
  ],
};
