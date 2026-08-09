"use client";

import { Minus, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function PartySizeStep({
  value,
  onChange,
  onNext,
  onBack,
}: {
  value: number;
  onChange: (value: number) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nombre de personnes</CardTitle>
        <CardDescription>Combien serez-vous pour cette réservation ?</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center gap-6 py-4">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onChange(Math.max(1, value - 1))}
            aria-label="Diminuer le nombre de personnes"
          >
            <Minus />
          </Button>
          <span className="w-12 text-center text-2xl font-semibold tabular-nums">{value}</span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => onChange(value + 1)}
            aria-label="Augmenter le nombre de personnes"
          >
            <Plus />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Retour
        </Button>
        <Button type="button" onClick={onNext}>
          Continuer
        </Button>
      </CardFooter>
    </Card>
  );
}
