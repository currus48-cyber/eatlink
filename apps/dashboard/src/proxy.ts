import NextAuth from "next-auth";

import authConfig from "@/auth.config";

// Deliberately built from `auth.config.ts`, which has no Prisma/bcrypt
// imports, so route protection never needs a database round trip.
const { auth } = NextAuth(authConfig);

// Route protection itself happens in the `authorized` callback in
// `auth.config.ts`; this wrapper just needs to exist for Next.js to
// recognize a proxy function.
export default auth(() => undefined);

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
