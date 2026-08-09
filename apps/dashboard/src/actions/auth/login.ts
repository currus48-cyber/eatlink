"use server";

import { AuthError } from "next-auth";

import { signIn } from "@/auth";
import { type ActionState } from "@/lib/action-state";
import { loginSchema } from "@/lib/validations/auth";

type LoginFields = "email" | "password";

export async function loginAction(
  _prevState: ActionState<LoginFields>,
  formData: FormData,
): Promise<ActionState<LoginFields>> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Veuillez corriger les erreurs ci-dessous.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email,
      password: parsed.data.password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return {
            status: "error",
            message: "Email ou mot de passe incorrect.",
          };
        default:
          return {
            status: "error",
            message: "Une erreur est survenue lors de la connexion.",
          };
      }
    }
    throw error;
  }

  return { status: "success" };
}
