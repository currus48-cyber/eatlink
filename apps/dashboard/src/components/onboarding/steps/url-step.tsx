"use client";

import type { ImportActionState } from "@/actions/onboarding/run-import";
import { FieldError } from "@/components/forms/field-error";
import { SubmitButton } from "@/components/forms/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function UrlStep({
  action,
  state,
  defaultValue,
}: {
  action: (formData: FormData) => void;
  state: ImportActionState;
  defaultValue?: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Collez l&apos;URL de votre site</CardTitle>
        <CardDescription>
          En quelques secondes, votre page de réservation EatLink est prête.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} className="flex flex-col gap-4" noValidate>
          {state.status === "error" && state.message && (
            <Alert variant="destructive">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="url">URL du site</Label>
            <Input
              id="url"
              name="url"
              type="text"
              inputMode="url"
              placeholder="https://votre-restaurant.com"
              autoComplete="url"
              defaultValue={defaultValue}
              required
            />
            <FieldError errors={state.fieldErrors?.url} />
          </div>

          <SubmitButton>Créer ma page gratuitement</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
