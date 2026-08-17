import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { BookingWizard } from "@/components/booking/booking-wizard";
import { EatLinkFooterNote } from "@/components/restaurant-public/eatlink-footer-note";
import { RestaurantIdentityBar } from "@/components/restaurant-public/restaurant-identity-bar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { resolveBookingTarget } from "@/lib/smart-link/booking/resolve-booking-target";
import { loadRestaurantBySlug } from "@/lib/smart-link/restaurant-loader/restaurant-loader";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type Params = Promise<{ slug: string }>;

export default async function ReservePage({ params }: { params: Params }) {
  const { slug } = await params;
  const restaurant = await loadRestaurantBySlug(slug);

  if (!restaurant) {
    notFound();
  }

  const target = resolveBookingTarget(restaurant);

  if (target.type === "external") {
    redirect(target.href);
  }

  if (restaurant.resourceId) {
    return (
      <div className="flex min-h-svh flex-col bg-muted/30">
        <RestaurantIdentityBar
          name={restaurant.name}
          logoUrl={restaurant.logoUrl}
          city={restaurant.city}
          country={restaurant.country}
        />
        <div className="flex flex-1 justify-center px-4 py-6 sm:px-6">
          <div className="w-full max-w-xl">
            <BookingWizard
              resourceId={restaurant.resourceId}
              restaurant={{
                slug: restaurant.slug,
                name: restaurant.name,
                logoUrl: restaurant.logoUrl,
              }}
            />
          </div>
        </div>
        <EatLinkFooterNote />
      </div>
    );
  }

  return (
    <div className="flex min-h-svh flex-col bg-muted/30">
      <RestaurantIdentityBar
        name={restaurant.name}
        logoUrl={restaurant.logoUrl}
        city={restaurant.city}
        country={restaurant.country}
      />
      <div className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Réservation bientôt disponible</CardTitle>
            <CardDescription>
              {restaurant.name} n&apos;a pas encore activé la réservation en ligne
              {restaurant.phone ? ". Vous pouvez les appeler directement." : "."}
            </CardDescription>
          </CardHeader>
          {restaurant.phone && (
            <CardContent>
              <a
                href={`tel:${restaurant.phone}`}
                className="font-medium text-primary hover:underline"
              >
                {restaurant.phone}
              </a>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
