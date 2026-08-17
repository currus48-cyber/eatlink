"use client";

import { Check } from "lucide-react";
import Link from "next/link";

import { SummaryRow } from "@/components/forms/summary-row";
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
import type { CreatedReservationSummary } from "@/lib/booking/actions/create-reservation.action";
import { buildIcsContent } from "@/lib/calendar/build-ics";
import { formatDateFr } from "@/lib/format-date";

import type { BookingWizardRestaurant } from "../booking-wizard";
import type { ContactDetails } from "../wizard-step";

export function ConfirmationStep({
  restaurant,
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
  restaurant: BookingWizardRestaurant;
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
    const firstName = details.customerName.trim().split(/\s+/)[0] || details.customerName;

    function handleAddToCalendar() {
      if (!confirmed) return;
      const ics = buildIcsContent({
        restaurantName: restaurant.name,
        date: confirmed.date,
        startTime: confirmed.startTime,
        endTime: confirmed.endTime,
      });
      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "reservation.ics";
      link.click();
      URL.revokeObjectURL(url);
    }

    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-5 pt-6 pb-2 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-success-tint text-success">
            <Check className="size-8" strokeWidth={2.5} />
          </span>

          <div className="flex flex-col gap-1.5">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Réservation confirmée
            </p>
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-balance">
              Merci {firstName}, votre table est réservée chez{" "}
              <span className="text-primary">{restaurant.name}</span>
            </h2>
          </div>

          <div className="w-full rounded-lg border bg-muted/40 p-4 text-left">
            <SummaryRow label="Date" value={formatDateFr(confirmed.date)} />
            <SummaryRow label="Heure" value={confirmed.startTime} />
            <SummaryRow label="Personnes" value={String(confirmed.partySize)} />
            <SummaryRow label="Nom" value={details.customerName} />
            <SummaryRow label="Téléphone" value={details.customerPhone} />
            {details.customerEmail && <SummaryRow label="Email" value={details.customerEmail} />}
          </div>

          <p className="text-sm text-muted-foreground">
            Votre réservation a bien été enregistrée auprès du restaurant.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="outline"
            className="w-full sm:flex-1"
            onClick={handleAddToCalendar}
          >
            Ajouter au calendrier
          </Button>
          <Button
            className="w-full sm:flex-1"
            render={<Link href={`/r/${restaurant.slug}`} />}
          >
            Retour au restaurant
          </Button>
        </CardFooter>
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

        <SummaryRow label="Restaurant" value={restaurant.name} />
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
          {isSubmitting ? "Confirmation en cours..." : "Confirmer la réservation"}
        </Button>
      </CardFooter>
    </Card>
  );
}
