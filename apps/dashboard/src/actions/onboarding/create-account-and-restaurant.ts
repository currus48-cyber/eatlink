"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn } from "@/auth";
import type { ActionState } from "@/lib/action-state";
import { hashPassword } from "@/lib/auth/password";
import { createRestaurantForOwner } from "@/lib/onboarding/create-restaurant-for-owner";
import type { EditableRestaurantFields } from "@/lib/onboarding/editable-fields";
import { prisma } from "@/lib/prisma";
import { onboardingAccountSchema } from "@/lib/validations/onboarding-account";
import { restaurantInputSchema } from "@/lib/validations/restaurant";

type AccountFields = "email" | "password";

export interface OnboardingAccountPayload {
  email: string;
  password: string;
}

// The anonymous-onboarding counterpart to `saveRestaurantAction`: creates the
// owner's account and their restaurant in one submission, then signs them
// in. This is the only place a Restaurant gets created without an existing
// session — everywhere else (including an already-logged-in user importing
// a second restaurant) goes through `saveRestaurantAction` instead.
export async function createAccountAndRestaurantAction(
  restaurantInput: EditableRestaurantFields,
  importSourceUrl: string,
  account: OnboardingAccountPayload,
): Promise<ActionState<AccountFields>> {
  const parsedAccount = onboardingAccountSchema.safeParse(account);
  if (!parsedAccount.success) {
    return {
      status: "error",
      message: "Veuillez corriger les erreurs ci-dessous.",
      fieldErrors: parsedAccount.error.flatten().fieldErrors,
    };
  }

  const parsedRestaurant = restaurantInputSchema.safeParse(restaurantInput);
  if (!parsedRestaurant.success) {
    return {
      status: "error",
      message: "Certaines informations du restaurant sont invalides. Revenez en arrière pour les corriger.",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsedAccount.data.email },
    select: { id: true },
  });

  if (existingUser) {
    return {
      status: "error",
      message: "Un compte existe déjà avec cet email.",
      fieldErrors: { email: ["Cet email est déjà utilisé. Connectez-vous plutôt."] },
    };
  }

  const passwordHash = await hashPassword(parsedAccount.data.password);

  const user = await prisma.user.create({
    data: { email: parsedAccount.data.email, passwordHash },
  });

  await createRestaurantForOwner(user.id, parsedRestaurant.data, importSourceUrl);

  try {
    await signIn("credentials", {
      email: parsedAccount.data.email,
      password: parsedAccount.data.password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        status: "error",
        message:
          "Votre page a été créée, mais la connexion automatique a échoué. Connectez-vous pour y accéder.",
      };
    }
    throw error;
  }

  redirect("/dashboard");
}
