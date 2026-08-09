import { WEEKDAYS, type Weekday } from "../types";

// Wall-clock time arithmetic on "HH:mm" strings. Deliberately not
// Date-based: a Resource's slots are local wall-clock times, and comparing
// plain zero-padded strings avoids timezone-conversion bugs entirely.

export function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function minutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function addMinutesToTime(time: string, minutesToAdd: number): string {
  return minutesToTime(timeToMinutes(time) + minutesToAdd);
}

// Resource has a `timezone` field for future use, but nothing here converts
// across timezones yet — these use the server's own local clock as a
// stand-in for "the venue's local time" until real per-resource timezone
// handling lands (tracked as a known V1 limitation).

export function todayDateOnly(): string {
  return toDateOnly(new Date());
}

export function nowTimeOnly(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
}

function toDateOnly(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Round-tripping through Prisma's `@db.Date` columns: Postgres DATE values
// carry no time-of-day, and Prisma represents them as a JS Date at UTC
// midnight — these two always go through UTC to avoid an off-by-one-day
// shift that a local-timezone read/write would introduce.

export function dateOnlyToUtcDate(dateOnly: string): Date {
  const [year, month, day] = dateOnly.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function utcDateToDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function dateOnlyToWeekday(dateOnly: string): Weekday {
  const date = dateOnlyToUtcDate(dateOnly);
  // getUTCDay(): 0=Sunday..6=Saturday. Shift so index 0=Monday..6=Sunday to
  // match WEEKDAYS' order.
  const index = (date.getUTCDay() + 6) % 7;
  return WEEKDAYS[index];
}
