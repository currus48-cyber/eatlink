import "server-only";

import { provisionResource } from "@/lib/booking/services/resource-provisioning.service";
import { prisma } from "@/lib/prisma";
import { generateUniqueSlug, type SlugAvailabilityChecker } from "@/lib/smart-link/slug/slug-generator";
import type { RestaurantInput } from "@/lib/validations/restaurant";

import { toWeeklyHoursInput } from "./to-weekly-hours";

const slugChecker: SlugAvailabilityChecker = {
  async isSlugTaken(slug) {
    const existing = await prisma.restaurant.findUnique({
      where: { slug },
      select: { id: true },
    });
    return existing !== null;
  },
};

/** Provisions a booking Resource and creates the Restaurant row for a given
 * owner — the one place this happens, shared by the authenticated
 * "add another restaurant" flow and the anonymous onboarding flow (which
 * creates the owner's account in the same request). */
export async function createRestaurantForOwner(
  ownerId: string,
  input: RestaurantInput,
  importSourceUrl: string,
): Promise<{ slug: string }> {
  const resourceId = await provisionResource({
    name: input.name,
    weeklyHours: toWeeklyHoursInput(input.openingHours),
  });

  const data = {
    ownerId,
    resourceId,
    name: input.name,
    logoUrl: input.logoUrl || null,
    phone: input.phone || null,
    email: input.email || null,
    address: input.address || null,
    city: input.city || null,
    country: input.country || null,
    openingHours: input.openingHours,
    instagramUrl: input.instagramUrl || null,
    facebookUrl: input.facebookUrl || null,
    tiktokUrl: input.tiktokUrl || null,
    websiteUrl: input.websiteUrl || null,
    photos: input.photos,
    menuUrl: input.menuUrl || null,
    reservationUrl: input.reservationUrl || null,
    reservationProvider: input.reservationProvider || null,
    importSourceUrl,
  };

  const slug = await generateUniqueSlug(input.name, slugChecker);

  try {
    const restaurant = await prisma.restaurant.create({ data: { ...data, slug } });
    return { slug: restaurant.slug };
  } catch (error) {
    // A concurrent request could have taken `slug` between our check and the
    // insert; fall back to a short unique suffix rather than failing the save.
    if (!isUniqueSlugConflict(error)) {
      throw error;
    }
    const fallbackSlug = `${slug}-${Date.now().toString(36).slice(-4)}`;
    const restaurant = await prisma.restaurant.create({ data: { ...data, slug: fallbackSlug } });
    return { slug: restaurant.slug };
  }
}

function isUniqueSlugConflict(error: unknown): boolean {
  if (!(typeof error === "object" && error !== null && "code" in error)) {
    return false;
  }
  if ((error as { code?: unknown }).code !== "P2002") {
    return false;
  }

  const target = (error as { meta?: { target?: unknown } }).meta?.target;
  if (Array.isArray(target)) return target.includes("slug");
  if (typeof target === "string") return target.includes("slug");
  return false;
}
