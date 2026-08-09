"use client";

import Link from "next/link";
import { useActionState } from "react";

import { forgotPasswordAction } from "@/actions/auth/forgot-password";
import { FieldError } from "@/components/forms/field-error";
import { SubmitButton } from "@/components/forms/submit-button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialActionState } from "@/lib/action-state";

export function ForgotPasswordForm() {
  const [state, formAction] = useActionState(
    forgotPasswordAction,
    initialActionState,
  );

  if (state.status === "success") {
    return (
      <Alert>
        <AlertDescription>{state.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4" noValidate>
      {state.status === "error" && state.message && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

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

      <SubmitButton>Envoyer le lien de réinitialisation</SubmitButton>

      <p className="text-center text-sm text-muted-foreground">
        <Link
          href="/auth/login"
          className="font-medium text-foreground hover:underline"
        >
          Retour à la connexion
        </Link>
      </p>
    </form>
  );
}
