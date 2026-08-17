import type { ReservationRecord } from "@/lib/booking/types";

import { ReservationRow } from "./reservation-row";

export function ReservationList({
  reservations,
  readOnly = false,
}: {
  reservations: ReservationRecord[];
  readOnly?: boolean;
}) {
  if (reservations.length === 0) {
    return (
      <p className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground">
        Aucune réservation.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {reservations.map((reservation) => (
        <ReservationRow key={reservation.id} reservation={reservation} readOnly={readOnly} />
      ))}
    </div>
  );
}
