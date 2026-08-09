"use client";

import { FieldError } from "@/components/forms/field-error";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContactDetails } from "../wizard-step";

export function DetailsStep({
  values,
  fieldErrors,
  onChange,
  onNext,
  onBack,
}: {
  values: ContactDetails;
  fieldErrors?: Partial<Record<keyof ContactDetails, string[]>>;
  onChange: (values: ContactDetails) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Vos coordonnées</CardTitle>
        <CardDescription>Pour confirmer et vous recontacter si besoin.</CardDescription>
      </CardHeader>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          onNext();
        }}
      >
        <CardContent className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customerName">Nom</Label>
            <Input
              id="customerName"
              value={values.customerName}
              onChange={(event) => onChange({ ...values, customerName: event.target.value })}
              autoComplete="name"
              required
            />
            <FieldError errors={fieldErrors?.customerName} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customerPhone">Téléphone</Label>
            <Input
              id="customerPhone"
              type="tel"
              value={values.customerPhone}
              onChange={(event) => onChange({ ...values, customerPhone: event.target.value })}
              autoComplete="tel"
              required
            />
            <FieldError errors={fieldErrors?.customerPhone} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="customerEmail">Email (optionnel)</Label>
            <Input
              id="customerEmail"
              type="email"
              value={values.customerEmail}
              onChange={(event) => onChange({ ...values, customerEmail: event.target.value })}
              autoComplete="email"
            />
            <FieldError errors={fieldErrors?.customerEmail} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="comment">Commentaire (optionnel)</Label>
            <Input
              id="comment"
              value={values.comment}
              onChange={(event) => onChange({ ...values, comment: event.target.value })}
              placeholder="Allergies, occasion spéciale..."
            />
            <FieldError errors={fieldErrors?.comment} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-3">
          <Button type="button" variant="outline" onClick={onBack}>
            Retour
          </Button>
          <Button type="submit">Continuer</Button>
        </CardFooter>
      </form>
    </Card>
  );
}
