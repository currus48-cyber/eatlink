import type { ReservationStatus } from "../types";

const ALLOWED_TRANSITIONS: Record<ReservationStatus, ReservationStatus[]> = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED", "NO_SHOW"],
  CANCELLED: [],
  COMPLETED: [],
  NO_SHOW: [],
};

export function canTransitionReservationStatus(
  from: ReservationStatus,
  to: ReservationStatus,
): boolean {
  return ALLOWED_TRANSITIONS[from].includes(to);
}

export const RESERVATION_STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  CANCELLED: "Annulée",
  COMPLETED: "Terminée",
  NO_SHOW: "Absence",
};
