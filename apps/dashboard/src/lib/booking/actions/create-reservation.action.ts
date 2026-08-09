"use server";

import type { ActionState } from "@/lib/action-state";

import { createReservationWithValidation } from "../services/reservation.service";
import type { ReservationInput } from "../types";

export interface CreatedReservationSummary {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  partySize: number;
}

export type CreateReservationActionState = ActionState<keyof ReservationInput> & {
  reservation?: CreatedReservationSummary;
};

// Public and generic: creating a reservation is the one operation any
// visitor is meant to trigger directly, with no restaurant/vertical context.
export async function createReservationAction(
  input: ReservationInput,
): Promise<CreateReservationActionState> {
  const result = await createReservationWithValidation(input);

  if (result.status === "error") {
    return { status: "error", message: result.message, fieldErrors: result.fieldErrors };
  }

  return {
    status: "success",
    reservation: {
      id: result.reservation.id,
      date: result.reservation.date,
      startTime: result.reservation.startTime,
      endTime: result.reservation.endTime,
      partySize: result.reservation.partySize,
    },
  };
}
