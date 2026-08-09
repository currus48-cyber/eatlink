import "server-only";

import { BookingError } from "../domain/booking-error";
import { createReservation } from "../reservation/create-reservation";
import { updateReservationStatus } from "../reservation/update-reservation-status";
import type { ReservationInput, ReservationRecord, ReservationStatus } from "../types";
import { reservationInputSchema } from "../validators/reservation-input.schema";

export type CreateReservationResult =
  | { status: "success"; reservation: ReservationRecord }
  | {
      status: "error";
      message: string;
      fieldErrors?: Partial<Record<keyof ReservationInput, string[]>>;
    };

export async function createReservationWithValidation(
  input: ReservationInput,
): Promise<CreateReservationResult> {
  const parsed = reservationInputSchema.safeParse(input);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Certaines informations sont invalides.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const reservation = await createReservation(parsed.data);
    return { status: "success", reservation };
  } catch (error) {
    if (error instanceof BookingError) {
      return { status: "error", message: error.message };
    }
    throw error;
  }
}

export type UpdateReservationStatusResult = { status: "success" } | { status: "error"; message: string };

export async function updateReservationStatusSafely(
  reservationId: string,
  nextStatus: ReservationStatus,
): Promise<UpdateReservationStatusResult> {
  try {
    await updateReservationStatus(reservationId, nextStatus);
    return { status: "success" };
  } catch (error) {
    if (error instanceof BookingError) {
      return { status: "error", message: error.message };
    }
    throw error;
  }
}
