import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import authConfig from "@/auth.config";
import { verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validations/auth";
import type { AppUserRole } from "@/types/next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  // @auth/prisma-adapter's types target the legacy `@prisma/client` generator output;
  // our schema uses Prisma 7's `prisma-client` generator, which is structurally
  // compatible at runtime but not assignable under that older type.
  adapter: PrismaAdapter(
    prisma as unknown as Parameters<typeof PrismaAdapter>[0],
  ),
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user?.passwordHash) {
          return null;
        }

        const isValid = await verifyPassword(
          parsed.data.password,
          user.passwordHash,
        );

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // `token` is typed against `@auth/core`'s own JWT interface, a
      // pnpm-duplicated copy our module augmentation can't reach, so the
      // custom fields we set in `jwt()` above come back as `unknown` here.
      session.user.id = token.id as string;
      session.user.role = token.role as AppUserRole;
      return session;
    },
  },
});
