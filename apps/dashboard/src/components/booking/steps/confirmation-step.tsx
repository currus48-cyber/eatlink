"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SummaryRow } from "@/components/forms/summary-row";
import type { CreatedReservationSummary } from "@/lib/booking/actions/create-reservation.action";
import { formatDateFr } from "@/lib/format-date";
import type { ContactDetails } from "../wizard-step";

export function ConfirmationStep({
  restaurantName,
  date,
  time,
  partySize,
  details,
  isSubmitting,
  error,
  confirmed,
  onEdit,
  onConfirm,
}: {
  restaurantName: string;
  date: string;
  time: string;
  partySize: number;
  details: ContactDetails;
  isSubmitting: boolean;
  error: string | null;
  confirmed: CreatedReservationSummary | null;
  onEdit: () => void;
  onConfirm: () => void;
}) {
  if (confirmed) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Réservation confirmée</CardTitle>
          <CardDescription>
            Merci {details.customerName}, votre demande de réservation chez {restaurantName} a
            bien été envoyée.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-1">
          <SummaryRow label="Date" value={formatDateFr(confirmed.date)} />
          <SummaryRow label="Heure" value={confirmed.startTime} />
          <SummaryRow label="Personnes" value={String(confirmed.partySize)} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Confirmez votre réservation</CardTitle>
        <CardDescription>Vérifiez les informations avant de valider.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        {error && (
          <Alert variant="destructive" className="mb-2">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <SummaryRow label="Restaurant" value={restaurantName} />
        <SummaryRow label="Date" value={formatDateFr(date)} />
        <SummaryRow label="Heure" value={time} />
        <SummaryRow label="Personnes" value={String(partySize)} />
        <SummaryRow label="Nom" value={details.customerName} />
        <SummaryRow label="Téléphone" value={details.customerPhone} />
        <SummaryRow label="Email" value={details.customerEmail} />
        <SummaryRow label="Commentaire" value={details.comment} />
      </CardContent>
      <CardFooter className="flex justify-between gap-3">
        <Button type="button" variant="outline" onClick={onEdit} disabled={isSubmitting}>
          Modifier
        </Button>
        <Button type="button" onClick={onConfirm} disabled={isSubmitting}>
          {isSubmitting ? "Envoi..." : "Confirmer la réservation"}
        </Button>
      </CardFooter>
    </Card>
  );
}
