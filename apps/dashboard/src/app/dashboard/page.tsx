import type { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Tableau de bord | EatLink",
};

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Bienvenue{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="text-muted-foreground">
          Voici un aperçu de votre compte.
        </p>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Importer votre restaurant</CardTitle>
          <CardDescription>
            Collez l&apos;URL de votre site pour pré-remplir votre fiche EatLink.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button render={<Link href="/onboarding" />}>Importer mon restaurant</Button>
        </CardContent>
      </Card>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Votre compte</CardTitle>
          <CardDescription>
            Informations liées à votre session.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Email</span>
            <span>{session?.user?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Rôle</span>
            <span>{session?.user?.role}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
