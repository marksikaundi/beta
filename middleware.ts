// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// const isPublicRoute = createRouteMatcher([
//   "/",
//   "/tracks",
//   "/tracks/(.*)",
//   "/about",
//   "/pricing",
//   "/api/webhooks/(.*)",
// ]);

// export default clerkMiddleware(async (auth, req) => {
//   if (!isPublicRoute(req)) {
//     await auth.protect();
//   }
// });

// export const config = {
//   matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
// };

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/dashboard(.*)",
  "/lab",
  "/lab/(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/tracks",
  "/tracks/(.*)",
  "/forgot-password",
  "/reset-password",
  "/terms",
  "/privacy-policy",
  "/404",
  "/api/webhooks/(.*)",
  "/api/changelog",
  "/api/changelog/rss",
  "/changelog(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
