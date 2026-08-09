import type { PublicRestaurant } from "@/lib/smart-link/restaurant-loader/types";

export function RestaurantHeader({ restaurant }: { restaurant: PublicRestaurant }) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
      {restaurant.logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary owner-provided domain, can't be pre-declared in next.config remotePatterns
        <img
          src={restaurant.logoUrl}
          alt=""
          className="size-8 rounded-full border object-cover"
        />
      )}
      <span className="font-semibold tracking-tight">{restaurant.name}</span>
    </header>
  );
}
