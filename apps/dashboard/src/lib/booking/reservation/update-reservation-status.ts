import "server-only";

import { prisma } from "@/lib/prisma";

import { BookingError } from "../domain/booking-error";
import { canTransitionReservationStatus } from "../domain/reservation-status";
import type { ReservationStatus } from "../types";

export async function updateReservationStatus(
  reservationId: string,
  nextStatus: ReservationStatus,
): Promise<void> {
  const reservation = await prisma.reservation.findUnique({ where: { id: reservationId } });

  if (!reservation) {
    throw new BookingError("Réservation introuvable.", "NOT_FOUND");
  }

  const currentStatus = reservation.status as ReservationStatus;
  if (!canTransitionReservationStatus(currentStatus, nextStatus)) {
    throw new BookingError(
      `Impossible de passer du statut "${currentStatus}" à "${nextStatus}".`,
      "INVALID_TRANSITION",
    );
  }

  await prisma.reservation.update({
    where: { id: reservationId },
    data: { status: nextStatus },
  });
}
