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

export function SlotStep({
  slots,
  isLoading,
  error,
  onSelect,
  onBack,
}: {
  slots: string[];
  isLoading: boolean;
  error: string | null;
  onSelect: (slot: string) => void;
  onBack: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choisissez un créneau</CardTitle>
        <CardDescription>Voici les horaires disponibles pour cette date.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading && <p className="text-sm text-muted-foreground">Chargement des créneaux...</p>}

        {!isLoading && error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && !error && slots.length === 0 && (
          <Alert variant="destructive">
            <AlertDescription>Aucun créneau disponible pour cette date.</AlertDescription>
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
      <CardFooter>
        <Button type="button" variant="outline" onClick={onBack}>
          Retour
        </Button>
      </CardFooter>
    </Card>
  );
}
