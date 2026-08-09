import type { Weekday, WeeklyHoursInput } from "../types";

export interface AvailabilityRuleData {
  dayOfWeek: Weekday;
  opensAt: string;
  closesAt: string;
}

/** Converts a caller-supplied weekly hours shape into AvailabilityRule rows.
 * Closed days, or days missing either boundary, simply produce no rule
 * (no rule for a day means the Resource is closed that day). */
export function weeklyHoursToAvailabilityRules(
  weeklyHours: WeeklyHoursInput[],
): AvailabilityRuleData[] {
  return weeklyHours
    .filter((entry) => !entry.closed && entry.opens && entry.closes)
    .map((entry) => ({
      dayOfWeek: entry.day,
      opensAt: entry.opens as string,
      closesAt: entry.closes as string,
    }));
}
