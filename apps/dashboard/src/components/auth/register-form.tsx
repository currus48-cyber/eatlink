"use client";

import Link from "next/link";
import { useActionState } from "react";

import { registerAction } from "@/actions/auth/register";
import { FieldError } from "@/components/forms/field-error";
import { SubmitButton } from "@/components/forms/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialActionState } from "@/lib/action-state";

export function RegisterForm() {
  const [state, formAction] = useActionState(
    registerAction,
    initialActionState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      {state.status === "error" && state.message && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nom complet</Label>
        <Input id="name" name="name" type="text" autoComplete="name" required />
        <FieldError errors={state.fieldErrors?.name} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
        <FieldError errors={state.fieldErrors?.email} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="password">Mot de passe</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
        />
        <FieldError errors={state.fieldErrors?.password} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
        />
        <FieldError errors={state.fieldErrors?.confirmPassword} />
      </div>

      <SubmitButton>Créer mon compte</SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        Déjà un compte ?{" "}
        <Link
          href="/auth/login"
          className="font-medium text-foreground hover:underline"
        >
          Se connecter
        </Link>
      </p>
    </form>
  );
}
