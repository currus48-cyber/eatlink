"use server";

import { type ActionState } from "@/lib/action-state";
import { createPasswordResetToken } from "@/lib/auth/tokens";
import { sendPasswordResetEmail } from "@/lib/email/password-reset-email";
import { prisma } from "@/lib/prisma";
import { forgotPasswordSchema } from "@/lib/validations/auth";

type ForgotPasswordFields = "email";

const GENERIC_SUCCESS_MESSAGE =
  "Si un compte existe avec cet email, un lien de réinitialisation vient de lui être envoyé.";

export async function forgotPasswordAction(
  _prevState: ActionState<ForgotPasswordFields>,
  formData: FormData,
): Promise<ActionState<ForgotPasswordFields>> {
  const parsed = forgotPasswordSchema.safeParse({
    email: formData.get("email"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Veuillez corriger les erreurs ci-dessous.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (user) {
    const token = await createPasswordResetToken(user.id);
    const baseUrl = process.env.AUTH_URL ?? "http://localhost:3000";
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

    try {
      await sendPasswordResetEmail(user.email, resetUrl);
    } catch (error) {
      console.error("[forgot-password] failed to send reset email", error);
    }
  }

  // Always respond with the same message, regardless of whether the
  // account exists, to avoid leaking which emails are registered.
  return { status: "success", message: GENERIC_SUCCESS_MESSAGE };
}
