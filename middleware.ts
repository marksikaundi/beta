import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: [
    "/",
    "/tracks",
    "/tracks/(.*)",
    "/about",
    "/pricing",
    "/api/webhooks/(.*)",
  ],
  ignoredRoutes: [
    "/api/webhooks/(.*)",
  ],
});

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
