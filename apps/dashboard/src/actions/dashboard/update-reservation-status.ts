"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { updateReservationStatusAction } from "@/lib/booking/actions/update-reservation-status.action";
import type { ReservationStatus } from "@/lib/booking/types";
import { prisma } from "@/lib/prisma";

export type UpdateDashboardReservationStatusResult =
  | { status: "success" }
  | { status: "error"; message: string };

// The generic booking action has no concept of "restaurant ownership" — this
// wrapper is where that check belongs, since it's the dashboard (a
// restaurant-specific caller) that needs it, not the engine.
export async function updateDashboardReservationStatus(
  reservationId: string,
  nextStatus: ReservationStatus,
): Promise<UpdateDashboardReservationStatusResult> {
  const session = await auth();
  if (!session?.user) {
    return { status: "error", message: "Non authentifié." };
  }

  const reservation = await prisma.reservation.findUnique({
    where: { id: reservationId },
    select: { resourceId: true },
  });
  if (!reservation) {
    return { status: "error", message: "Réservation introuvable." };
  }

  const restaurant = await prisma.restaurant.findFirst({
    where: { resourceId: reservation.resourceId, ownerId: session.user.id },
    select: { id: true },
  });
  if (!restaurant) {
    return { status: "error", message: "Accès refusé." };
  }

  const result = await updateReservationStatusAction(reservationId, nextStatus);
  if (result.status === "success") {
    revalidatePath("/dashboard/reservations");
  }
  return result;
}
