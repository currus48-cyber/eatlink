import type { Metadata } from "next";

import type { PublicRestaurant } from "../restaurant-loader/types";
import { getCanonicalUrl } from "./site-url";

export function buildRestaurantMetadata(restaurant: PublicRestaurant): Metadata {
  const canonicalUrl = getCanonicalUrl(`/r/${restaurant.slug}`);
  const description = buildDescription(restaurant);
  const image = restaurant.photos[0] ?? restaurant.logoUrl ?? undefined;

  return {
    title: `${restaurant.name} | EatLink`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "website",
      title: restaurant.name,
      description,
      url: canonicalUrl,
      siteName: "EatLink",
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: restaurant.name,
      description,
      images: image ? [image] : undefined,
    },
  };
}

function buildDescription(restaurant: PublicRestaurant): string {
  const location = [restaurant.city, restaurant.country].filter(Boolean).join(", ");

  if (location) {
    return `Découvrez ${restaurant.name} à ${location}. Horaires, menu, réservation et contact sur EatLink.`;
  }

  return `Découvrez ${restaurant.name} : horaires, menu, réservation et contact sur EatLink.`;
}
