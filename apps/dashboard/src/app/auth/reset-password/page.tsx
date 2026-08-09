import type { Metadata } from "next";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Réinitialiser le mot de passe | EatLink",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const token = typeof params.token === "string" ? params.token : undefined;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Réinitialiser le mot de passe</CardTitle>
        <CardDescription>Choisissez un nouveau mot de passe.</CardDescription>
      </CardHeader>
      <CardContent>
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <Alert variant="destructive">
            <AlertDescription>
              Ce lien de réinitialisation est invalide. Merci de refaire une
              demande.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
