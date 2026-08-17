import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { ReservationTabs } from "@/components/dashboard/reservation-tabs";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getReservationDashboardView } from "@/lib/booking/services/listing.service";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Réservations | EatLink",
};

export default async function ReservationsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login");
  }

  // V1 assumes one restaurant per owner — the first one created is used.
  const restaurant = await prisma.restaurant.findFirst({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "asc" },
    select: { resourceId: true },
  });

  if (!restaurant?.resourceId) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="font-heading text-3xl font-semibold tracking-tight">Réservations</h1>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Aucun restaurant configuré</CardTitle>
            <CardDescription>
              Importez votre restaurant pour commencer à recevoir des réservations.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const view = await getReservationDashboardView(restaurant.resourceId);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Réservations</h1>
      <ReservationTabs view={view} />
    </div>
  );
}
