import "server-only";

import { prisma } from "@/lib/prisma";

import { weeklyHoursToAvailabilityRules } from "../availability/weekly-hours-to-rules";
import { DEFAULT_BOOKING_SETTINGS } from "../domain/booking-defaults";
import type { WeeklyHoursInput } from "../types";

/** Creates a new Resource, seeded with default BookingSettings and, when
 * supplied, AvailabilityRule rows derived from the caller's weekly hours.
 * Returns the new Resource id — the caller is responsible for linking it to
 * whatever vertical-specific entity owns it (the booking engine never does
 * that linking itself). */
export async function provisionResource(input: {
  name: string;
  weeklyHours?: WeeklyHoursInput[] | null;
}): Promise<string> {
  const rules = input.weeklyHours ? weeklyHoursToAvailabilityRules(input.weeklyHours) : [];

  const resource = await prisma.resource.create({
    data: {
      name: input.name,
      bookingSettings: { create: DEFAULT_BOOKING_SETTINGS },
      ...(rules.length > 0 ? { availabilityRules: { create: rules } } : {}),
    },
  });

  return resource.id;
}
