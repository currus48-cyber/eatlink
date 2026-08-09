"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn } from "@/auth";
import { type ActionState } from "@/lib/action-state";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations/auth";

type RegisterFields = "name" | "email" | "password" | "confirmPassword";

export async function registerAction(
  _prevState: ActionState<RegisterFields>,
  formData: FormData,
): Promise<ActionState<RegisterFields>> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
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

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existingUser) {
    return {
      status: "error",
      message: "Un compte existe déjà avec cet email.",
      fieldErrors: { email: ["Cet email est déjà utilisé."] },
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
    },
  });

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        status: "error",
        message:
          "Le compte a été créé, mais la connexion automatique a échoué. Veuillez vous connecter.",
      };
    }
    throw error;
  }

  redirect("/onboarding");
}
