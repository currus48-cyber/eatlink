export type BookingTargetType = "external" | "internal-fallback";

export interface BookingTarget {
  type: BookingTargetType;
  href: string;
}

// The public page always links to `/r/[slug]/reserve`, never directly to a
// provider URL — that keeps the booking engine swappable later without any
// change to the public page itself.
export function resolveBookingTarget(restaurant: {
  slug: string;
  reservationUrl: string | null;
}): BookingTarget {
  if (restaurant.reservationUrl) {
    return { type: "external", href: restaurant.reservationUrl };
  }

  return { type: "internal-fallback", href: `/r/${restaurant.slug}/reserve` };
}
