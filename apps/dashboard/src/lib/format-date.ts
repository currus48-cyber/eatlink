import { dateOnlyToUtcDate } from "@/lib/booking/domain/time";

export function formatDateFr(dateOnly: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(dateOnlyToUtcDate(dateOnly));
}
