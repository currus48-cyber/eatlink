import type { BookingSettingsConfig } from "../types";

// Mirrors the Prisma `@default(...)` values on BookingSettings — kept here as
// a single named constant so the provisioning service and the schema can't
// silently drift without both being touched.
export const DEFAULT_BOOKING_SETTINGS: BookingSettingsConfig = {
  slotIntervalMinutes: 15,
  averageDurationMinutes: 90,
  bufferMinutes: 15,
  maxPartySize: 12,
  maxConcurrentReservations: 5,
};
