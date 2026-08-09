import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { PublicRestaurant } from "@/lib/smart-link/restaurant-loader/types";

export function RestaurantHero({ restaurant }: { restaurant: PublicRestaurant }) {
  const coverPhoto = restaurant.photos[0];
  const location = [restaurant.city, restaurant.country].filter(Boolean).join(", ");

  if (coverPhoto) {
    return (
      <section className="relative flex min-h-[50vh] items-end overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary owner-provided domain, can't be pre-declared in next.config remotePatterns */}
        <img src={coverPhoto} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="relative z-10 flex w-full flex-col gap-3 px-4 py-8 text-white sm:px-6">
          <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {restaurant.name}
          </h1>
          {location && <p className="text-sm text-white/80">{location}</p>}
          <Button
            size="lg"
            className="w-fit"
            render={<Link href={`/r/${restaurant.slug}/reserve`} />}
          >
            Réserver une table
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="flex min-h-[40vh] flex-col items-center justify-center gap-4 bg-muted px-4 py-10 text-center sm:px-6">
      {restaurant.logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary owner-provided domain, can't be pre-declared in next.config remotePatterns
        <img
          src={restaurant.logoUrl}
          alt={restaurant.name}
          className="h-20 w-20 rounded-full object-cover shadow-sm sm:h-24 sm:w-24"
        />
      )}
      <h1 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {restaurant.name}
      </h1>
      {location && <p className="text-sm text-muted-foreground">{location}</p>}
      <Button size="lg" render={<Link href={`/r/${restaurant.slug}/reserve`} />}>
        Réserver une table
      </Button>
    </section>
  );
}
