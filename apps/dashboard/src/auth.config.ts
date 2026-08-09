import type { NextAuthConfig } from "next-auth";

export default {
  pages: {
    signIn: "/auth/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      // `/onboarding` is deliberately public — a prospect can import and
      // preview their restaurant before ever creating an account. Only the
      // authenticated dashboard proper is gated.
      const isOnProtectedRoute = nextUrl.pathname.startsWith("/dashboard");
      const isOnAuthPage = nextUrl.pathname.startsWith("/auth");

      if (isOnProtectedRoute) {
        return isLoggedIn;
      }

      if (isOnAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
