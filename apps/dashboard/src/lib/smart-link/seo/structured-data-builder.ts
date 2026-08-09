import { getCanonicalUrl } from "../metadata/site-url";
import type { PublicRestaurant } from "../restaurant-loader/types";
import type { DayOfWeek, OpeningHoursEntry } from "@/lib/import-engine/types";

export function buildRestaurantStructuredData(
  restaurant: PublicRestaurant,
): Record<string, unknown> {
  const sameAs = [restaurant.instagramUrl, restaurant.facebookUrl, restaurant.tiktokUrl].filter(
    (url): url is string => Boolean(url),
  );

  const hasAddress = Boolean(restaurant.address || restaurant.city || restaurant.country);
  const openingHoursSpec = restaurant.openingHours
    ? buildOpeningHoursSpecification(restaurant.openingHours)
    : [];

  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    url: getCanonicalUrl(`/r/${restaurant.slug}`),
    ...(restaurant.logoUrl ? { image: restaurant.logoUrl } : {}),
    ...(restaurant.phone ? { telephone: restaurant.phone } : {}),
    ...(hasAddress
      ? {
          address: {
            "@type": "PostalAddress",
            ...(restaurant.address ? { streetAddress: restaurant.address } : {}),
            ...(restaurant.city ? { addressLocality: restaurant.city } : {}),
            ...(restaurant.country ? { addressCountry: restaurant.country } : {}),
          },
        }
      : {}),
    ...(openingHoursSpec.length > 0 ? { openingHoursSpecification: openingHoursSpec } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

function buildOpeningHoursSpecification(entries: OpeningHoursEntry[]) {
  return entries
    .filter((entry) => !entry.closed && entry.opens && entry.closes)
    .map((entry) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: `https://schema.org/${toTitleCase(entry.day)}`,
      opens: entry.opens,
      closes: entry.closes,
    }));
}

function toTitleCase(day: DayOfWeek): string {
  return day.charAt(0) + day.slice(1).toLowerCase();
}
