"use server";

import {
  updateReservationStatusSafely,
  type UpdateReservationStatusResult,
} from "../services/reservation.service";
import type { ReservationStatus } from "../types";

// Generic and unauthenticated by design — this action has no idea what a
// "restaurant" is, so it cannot check restaurant ownership itself. Callers
// that need authorization (e.g. the dashboard) must verify it themselves
// before calling this.
export async function updateReservationStatusAction(
  reservationId: string,
  nextStatus: ReservationStatus,
): Promise<UpdateReservationStatusResult> {
  return updateReservationStatusSafely(reservationId, nextStatus);
}
