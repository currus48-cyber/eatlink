import "server-only";
import crypto from "node:crypto";

import { prisma } from "@/lib/prisma";

const RESET_TOKEN_TTL_MS = 30 * 60 * 1000;

export async function createPasswordResetToken(userId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await prisma.passwordResetToken.deleteMany({
    where: { userId, usedAt: null },
  });

  await prisma.passwordResetToken.create({
    data: { token, userId, expiresAt },
  });

  return token;
}

export async function validatePasswordResetToken(token: string) {
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return null;
  }

  return resetToken;
}

export async function consumePasswordResetToken(id: string) {
  await prisma.passwordResetToken.update({
    where: { id },
    data: { usedAt: new Date() },
  });
}
