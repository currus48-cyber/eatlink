"use client";

import { useState, useTransition } from "react";

import { updateDashboardReservationStatus } from "@/actions/dashboard/update-reservation-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RESERVATION_STATUS_LABELS } from "@/lib/booking/domain/reservation-status";
import type { ReservationRecord, ReservationStatus } from "@/lib/booking/types";
import { formatDateFr } from "@/lib/format-date";

const STATUS_BADGE_VARIANT: Record<
  ReservationStatus,
  "success" | "secondary" | "destructive" | "warning"
> = {
  PENDING: "warning",
  CONFIRMED: "success",
  CANCELLED: "destructive",
  COMPLETED: "secondary",
  NO_SHOW: "destructive",
};

export function ReservationRow({
  reservation,
  readOnly,
}: {
  reservation: ReservationRecord;
  readOnly: boolean;
}) {
  const [status, setStatus] = useState(reservation.status);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleUpdate(next: ReservationStatus) {
    setError(null);
    startTransition(async () => {
      const result = await updateDashboardReservationStatus(reservation.id, next);
      if (result.status === "success") {
        setStatus(next);
      } else {
        setError(result.message);
      }
    });
  }

  return (
    <Card size="sm">
      <div className="flex flex-col gap-3 px-4 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-semibold tabular-nums">{reservation.startTime}</span>
            <span className="text-muted-foreground">{formatDateFr(reservation.date)}</span>
            <Badge variant={STATUS_BADGE_VARIANT[status]}>{RESERVATION_STATUS_LABELS[status]}</Badge>
          </div>
          <span className="font-medium text-foreground">
            {reservation.customerName} · {reservation.partySize}{" "}
            {reservation.partySize > 1 ? "personnes" : "personne"}
          </span>
          <span className="text-muted-foreground">{reservation.customerPhone}</span>
          {reservation.customerEmail && (
            <span className="text-muted-foreground">{reservation.customerEmail}</span>
          )}
          {reservation.comment && (
            <span className="text-muted-foreground italic">« {reservation.comment} »</span>
          )}
          {error && <span className="text-destructive">{error}</span>}
        </div>

        {!readOnly && (
          <div className="flex flex-wrap gap-2">
            {status === "PENDING" && (
              <>
                <Button size="sm" disabled={isPending} onClick={() => handleUpdate("CONFIRMED")}>
                  Confirmer
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => handleUpdate("CANCELLED")}
                >
                  Annuler
                </Button>
              </>
            )}
            {status === "CONFIRMED" && (
              <>
                <Button size="sm" disabled={isPending} onClick={() => handleUpdate("COMPLETED")}>
                  Terminée
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => handleUpdate("NO_SHOW")}
                >
                  Absence
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={isPending}
                  onClick={() => handleUpdate("CANCELLED")}
                >
                  Annuler
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
