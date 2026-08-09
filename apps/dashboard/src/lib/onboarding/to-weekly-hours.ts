import type { WeeklyHoursInput } from "@/lib/booking/types";
import type { OpeningHoursEntry } from "@/lib/import-engine/types";

// Explicit adapter from the restaurant-import domain's opening-hours shape to
// the booking engine's own (structurally identical) input type — the
// booking engine never imports from `import-engine`, so this mapping is
// what keeps the two decoupled even though the shapes happen to match today.
export function toWeeklyHoursInput(entries: OpeningHoursEntry[]): WeeklyHoursInput[] {
  return entries.map((entry) => ({
    day: entry.day,
    opens: entry.opens,
    closes: entry.closes,
    closed: entry.closed,
  }));
}
