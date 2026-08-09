"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DateStep({
  value,
  minDate,
  onChange,
  onNext,
}: {
  value: string;
  minDate: string;
  onChange: (value: string) => void;
  onNext: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Choisissez une date</CardTitle>
        <CardDescription>Sélectionnez le jour de votre réservation.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="booking-date">Date</Label>
          <Input
            id="booking-date"
            type="date"
            min={minDate}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
        <Button disabled={!value} onClick={onNext}>
          Continuer
        </Button>
      </CardContent>
    </Card>
  );
}
