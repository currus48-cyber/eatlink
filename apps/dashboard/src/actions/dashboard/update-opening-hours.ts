"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { syncAvailabilityRules } from "@/lib/booking/services/resource-provisioning.service";
import type { OpeningHoursEntry } from "@/lib/import-engine/types";
import { toWeeklyHoursInput } from "@/lib/onboarding/to-weekly-hours";
import { prisma } from "@/lib/prisma";
import { openingHoursSchema } from "@/lib/validations/opening-hours";

export type UpdateOpeningHoursResult = { status: "success" } | { status: "error"; message: string };

// Restaurant.openingHours is the source of truth once a restaurant exists;
// this is the only place that changes it after creation, and it always
// keeps the Booking Engine's AvailabilityRule rows in sync in the same call
// (RFC-008 rule 5) so the two can never drift apart.
export async function updateOpeningHoursAction(
  openingHours: OpeningHoursEntry[],
): Promise<UpdateOpeningHoursResult> {
  const session = await auth();
  if (!session?.user) {
    return { status: "error", message: "Votre session a expiré. Merci de vous reconnecter." };
  }

  const parsed = openingHoursSchema.safeParse(openingHours);
  if (!parsed.success) {
    return { status: "error", message: "Horaires invalides." };
  }

  // V1 assumes one restaurant per owner — same lookup as
  // dashboard/reservations/page.tsx.
  const restaurant = await prisma.restaurant.findFirst({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "asc" },
    select: { id: true, resourceId: true },
  });
  if (!restaurant) {
    return { status: "error", message: "Aucun restaurant à mettre à jour." };
  }

  await prisma.restaurant.update({
    where: { id: restaurant.id },
    data: { openingHours: parsed.data },
  });

  if (restaurant.resourceId) {
    await syncAvailabilityRules(restaurant.resourceId, toWeeklyHoursInput(parsed.data));
  }

  revalidatePath("/dashboard/restaurant");
  revalidatePath("/r/[slug]", "page");

  return { status: "success" };
}
