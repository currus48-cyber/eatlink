import "server-only";

import { ALL_DAYS, type OpeningHoursEntry } from "@/lib/import-engine/types";
import { prisma } from "@/lib/prisma";

import type { PublicRestaurant } from "./types";

export async function loadRestaurantBySlug(slug: string): Promise<PublicRestaurant | null> {
  const restaurant = await prisma.restaurant.findUnique({ where: { slug } });
  if (!restaurant) {
    return null;
  }

  return {
    id: restaurant.id,
    slug: restaurant.slug,
    resourceId: restaurant.resourceId,
    name: restaurant.name,
    logoUrl: restaurant.logoUrl,
    phone: restaurant.phone,
    email: restaurant.email,
    address: restaurant.address,
    city: restaurant.city,
    country: restaurant.country,
    openingHours: parseOpeningHours(restaurant.openingHours),
    instagramUrl: restaurant.instagramUrl,
    facebookUrl: restaurant.facebookUrl,
    tiktokUrl: restaurant.tiktokUrl,
    websiteUrl: restaurant.websiteUrl,
    photos: restaurant.photos,
    menuUrl: restaurant.menuUrl,
    reservationUrl: restaurant.reservationUrl,
    reservationProvider: restaurant.reservationProvider,
  };
}

// The `openingHours` column is a loosely-typed Json column; this only trusts
// values that structurally match what save-restaurant.ts writes, and drops
// anything malformed rather than letting a bad shape crash the public page.
// Exported for reuse anywhere else that reads this column (e.g. the
// dashboard's hours settings page).
export function parseOpeningHours(value: unknown): OpeningHoursEntry[] | null {
  if (!Array.isArray(value) || value.length === 0) {
    return null;
  }

  const entries = value.filter(isOpeningHoursEntry);
  return entries.length > 0 ? entries : null;
}

function isOpeningHoursEntry(value: unknown): value is OpeningHoursEntry {
  if (!value || typeof value !== "object") {
    return false;
  }

  const entry = value as Record<string, unknown>;
  return (
    typeof entry.day === "string" &&
    (ALL_DAYS as readonly string[]).includes(entry.day) &&
    (entry.opens === null || typeof entry.opens === "string") &&
    (entry.closes === null || typeof entry.closes === "string") &&
    typeof entry.closed === "boolean"
  );
}
