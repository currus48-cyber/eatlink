"use server";

import { auth } from "@/auth";
import type { ActionState } from "@/lib/action-state";
import { createRestaurantForOwner } from "@/lib/onboarding/create-restaurant-for-owner";
import type { EditableRestaurantFields } from "@/lib/onboarding/editable-fields";
import { restaurantInputSchema } from "@/lib/validations/restaurant";

export async function saveRestaurantAction(
  input: EditableRestaurantFields,
  importSourceUrl: string,
): Promise<ActionState<keyof EditableRestaurantFields>> {
  const session = await auth();
  if (!session?.user) {
    return {
      status: "error",
      message: "Votre session a expiré. Merci de vous reconnecter.",
    };
  }

  const parsed = restaurantInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Certaines informations sont invalides.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await createRestaurantForOwner(session.user.id, parsed.data, importSourceUrl);

  return { status: "success" };
}
