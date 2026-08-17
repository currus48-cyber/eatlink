import type { Metadata } from "next";
import Link from "next/link";

import { auth } from "@/auth";
import { ReservationList } from "@/components/dashboard/reservation-list";
import { StatCard } from "@/components/dashboard/stat-card";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getReservationDashboardView } from "@/lib/booking/services/listing.service";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Tableau de bord | EatLink",
};

export default async function DashboardPage() {
  const session = await auth();

  // V1 assumes one restaurant per owner — same lookup as
  // dashboard/reservations/page.tsx.
  const restaurant = session?.user
    ? await prisma.restaurant.findFirst({
        where: { ownerId: session.user.id },
        orderBy: { createdAt: "asc" },
        select: { name: true, resourceId: true },
      })
    : null;

  if (!restaurant) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="font-heading text-3xl font-semibold tracking-tight">Bienvenue 👋</h1>
          <p className="text-muted-foreground">Voici un aperçu de votre compte.</p>
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
      </div>
    );
  }

  const view = restaurant.resourceId
    ? await getReservationDashboardView(restaurant.resourceId)
    : null;

  const confirmedCount = view
    ? [...view.today, ...view.upcoming].filter((r) => r.status === "CONFIRMED").length
    : 0;
  const upcomingReservations = view ? [...view.today, ...view.upcoming].slice(0, 6) : [];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Bonjour 👋</h1>
        <p className="text-muted-foreground">Vue d&apos;ensemble de {restaurant.name}.</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Aujourd'hui" value={view?.today.length ?? 0} />
        <StatCard label="À venir" value={view?.upcoming.length ?? 0} />
        <StatCard label="Confirmées" value={confirmedCount} />
        <StatCard label="Annulations" value={view?.cancelled.length ?? 0} />
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-heading text-xl font-semibold tracking-tight">
          Prochaines réservations
        </h2>
        <ReservationList reservations={upcomingReservations} />
      </div>
    </div>
  );
}
