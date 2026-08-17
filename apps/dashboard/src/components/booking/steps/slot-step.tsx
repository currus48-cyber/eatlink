"use client";

import { Loader2 } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SlotStep({
  slots,
  isLoading,
  error,
  onSelect,
  onBack,
  onBackToDate,
}: {
  slots: string[];
  isLoading: boolean;
  error: string | null;
  onSelect: (slot: string) => void;
  onBack: () => void;
  onBackToDate: () => void;
}) {
  const isEmpty = !isLoading && !error && slots.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choisissez un créneau</CardTitle>
        <CardDescription>Voici les horaires disponibles pour cette date.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <div className="flex flex-col items-center gap-3 py-10 text-sm text-muted-foreground">
            <Loader2 className="size-5 animate-spin" />
            Chargement des créneaux...
          </div>
        )}

        {!isLoading && error && (
          <Alert variant="destructive">
            <AlertTitle>Réservation impossible</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isEmpty && (
          <Alert>
            <AlertTitle>Aucun créneau disponible</AlertTitle>
            <AlertDescription>
              Le restaurant ne propose plus de disponibilité pour cette date. Essayez une autre
              date ou un nombre de personnes différent.
            </AlertDescription>
          </Alert>
        )}

        {!isLoading && slots.length > 0 && (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {slots.map((slot) => (
              <Button key={slot} type="button" variant="outline" onClick={() => onSelect(slot)}>
                {slot}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap justify-between gap-2">
        <Button type="button" variant="outline" onClick={onBack}>
          Retour
        </Button>
        {isEmpty && (
          <Button type="button" onClick={onBackToDate}>
            Choisir une autre date
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
