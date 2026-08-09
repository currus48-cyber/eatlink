import { timeToMinutes } from "../domain/time";

export interface ExistingReservationInterval {
  startTime: string;
  endTime: string;
}

export interface FilterSlotsByCapacityInput {
  candidateSlots: string[];
  durationMinutes: number;
  bufferMinutes: number;
  maxConcurrentReservations: number;
  existingReservations: ExistingReservationInterval[];
}

/** Drops any candidate slot that would push concurrent reservations at that
 * moment past capacity. An existing reservation is treated as occupying
 * [start, end + buffer) so back-to-back bookings always leave turnover time. */
export function filterSlotsByCapacity(input: FilterSlotsByCapacityInput): string[] {
  return input.candidateSlots.filter((slot) => {
    const slotStart = timeToMinutes(slot);
    const slotEnd = slotStart + input.durationMinutes;

    const overlapping = input.existingReservations.filter((reservation) => {
      const reservationStart = timeToMinutes(reservation.startTime);
      const reservationEnd = timeToMinutes(reservation.endTime) + input.bufferMinutes;
      return slotStart < reservationEnd && reservationStart < slotEnd;
    });

    return overlapping.length < input.maxConcurrentReservations;
  });
}
