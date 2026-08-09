"use client";

import { FieldError } from "@/components/forms/field-error";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/action-state";

export function AccountStep({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onBack,
  isSubmitting,
  state,
}: {
  email: string;
  password: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  onBack: () => void;
  isSubmitting: boolean;
  state: ActionState<"email" | "password">;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Créez votre compte</CardTitle>
        <CardDescription>
          Dernière étape pour publier votre page.{" "}
          <span className="font-medium text-foreground">
            Essai gratuit de 30 jours, sans engagement.
          </span>
        </CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit} noValidate>
        <CardContent className="flex flex-col gap-4">
          {state.status === "error" && state.message && (
            <Alert variant="destructive">
              <AlertDescription>{state.message}</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="account-email">Email</Label>
            <Input
              id="account-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              required
            />
            <FieldError errors={state.fieldErrors?.email} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="account-password">Mot de passe</Label>
            <Input
              id="account-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              required
            />
            <FieldError errors={state.fieldErrors?.password} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-3">
          <Button type="button" variant="outline" onClick={onBack} disabled={isSubmitting}>
            Retour
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer ma page et mon compte"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
