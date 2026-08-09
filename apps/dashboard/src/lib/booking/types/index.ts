// Deliberately not imported from anywhere restaurant-specific (e.g.
// `import-engine`): the booking engine defines its own vocabulary so it
// never depends on any one vertical's data shapes.

export const WEEKDAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export type Weekday = (typeof WEEKDAYS)[number];

export type ReservationStatus = "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED" | "NO_SHOW";

/** A contiguous open interval, e.g. 12:00-14:00, in "HH:mm" wall-clock time. */
export interface TimeWindow {
  opensAt: string;
  closesAt: string;
}

/** Weekly recurring hours, as supplied by a calling vertical (e.g. a
 * restaurant's opening hours) to seed a Resource's AvailabilityRule rows. */
export interface WeeklyHoursInput {
  day: Weekday;
  opens: string | null;
  closes: string | null;
  closed: boolean;
}

export interface BookingSettingsConfig {
  slotIntervalMinutes: number;
  averageDurationMinutes: number;
  bufferMinutes: number;
  maxPartySize: number;
  maxConcurrentReservations: number;
}

export interface ReservationInput {
  resourceId: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  partySize: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  comment: string;
}

export interface ReservationRecord {
  id: string;
  resourceId: string;
  date: string;
  startTime: string;
  endTime: string;
  partySize: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  comment: string | null;
  status: ReservationStatus;
  createdAt: string;
}
