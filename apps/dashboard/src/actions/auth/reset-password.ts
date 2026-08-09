"use server";

import { redirect } from "next/navigation";

import { type ActionState } from "@/lib/action-state";
import { hashPassword } from "@/lib/auth/password";
import {
  consumePasswordResetToken,
  validatePasswordResetToken,
} from "@/lib/auth/tokens";
import { prisma } from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations/auth";

type ResetPasswordFields = "token" | "password" | "confirmPassword";

export async function resetPasswordAction(
  _prevState: ActionState<ResetPasswordFields>,
  formData: FormData,
): Promise<ActionState<ResetPasswordFields>> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Veuillez corriger les erreurs ci-dessous.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const resetToken = await validatePasswordResetToken(parsed.data.token);

  if (!resetToken) {
    return {
      status: "error",
      message: "Ce lien de réinitialisation est invalide ou a expiré.",
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { passwordHash },
  });

  await consumePasswordResetToken(resetToken.id);

  redirect("/auth/login?reset=success");
}
