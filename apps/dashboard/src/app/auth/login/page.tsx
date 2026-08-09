import type { Metadata } from "next";

import { LoginForm } from "@/components/auth/login-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Connexion | EatLink",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const resetSuccess = params.reset === "success";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connexion</CardTitle>
        <CardDescription>
          Connectez-vous à votre espace EatLink.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {resetSuccess && (
          <Alert>
            <AlertDescription>
              Votre mot de passe a été réinitialisé. Vous pouvez vous
              connecter.
            </AlertDescription>
          </Alert>
        )}
        <LoginForm />
      </CardContent>
    </Card>
  );
}
