import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { RestaurantHoursForm } from "@/components/dashboard/restaurant-hours-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { standardOpeningHours } from "@/lib/onboarding/editable-fields";
import { prisma } from "@/lib/prisma";
import { parseOpeningHours } from "@/lib/smart-link/restaurant-loader/restaurant-loader";

export const metadata: Metadata = {
  title: "Horaires | EatLink",
};

export default async function RestaurantSettingsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/auth/login");
  }

  // V1 assumes one restaurant per owner — same lookup as
  // dashboard/reservations/page.tsx.
  const restaurant = await prisma.restaurant.findFirst({
    where: { ownerId: session.user.id },
    orderBy: { createdAt: "asc" },
    select: { name: true, openingHours: true },
  });

  if (!restaurant) {
    return (
      <div className="flex flex-col gap-6">
        <h1 className="text-2xl font-semibold tracking-tight">Horaires</h1>
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Aucun restaurant configuré</CardTitle>
            <CardDescription>
              Importez votre restaurant pour définir ses horaires.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const openingHours = parseOpeningHours(restaurant.openingHours) ?? standardOpeningHours();

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Horaires</h1>
      <RestaurantHoursForm restaurantName={restaurant.name} initialOpeningHours={openingHours} />
    </div>
  );
}
