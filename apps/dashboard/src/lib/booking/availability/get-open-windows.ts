import type { TimeWindow, Weekday } from "../types";

export interface AvailabilityRuleInput {
  dayOfWeek: Weekday;
  opensAt: string;
  closesAt: string;
}

export interface SpecialClosureInput {
  date: string; // "YYYY-MM-DD"
  startTime: string | null;
  endTime: string | null;
}

export interface GetOpenWindowsInput {
  date: string;
  weekday: Weekday;
  availabilityRules: AvailabilityRuleInput[];
  specialClosures: SpecialClosureInput[];
}

/** Resolves the open windows for a specific date: the recurring weekly
 * rules for that weekday, with any matching SpecialClosure carved out
 * (a full-day closure clears the day entirely; a partial one splits or
 * trims the affected window). */
export function getOpenWindows(input: GetOpenWindowsInput): TimeWindow[] {
  const closuresForDate = input.specialClosures.filter((closure) => closure.date === input.date);
  const isFullyClosed = closuresForDate.some(
    (closure) => closure.startTime === null && closure.endTime === null,
  );
  if (isFullyClosed) {
    return [];
  }

  const baseWindows: TimeWindow[] = input.availabilityRules
    .filter((rule) => rule.dayOfWeek === input.weekday)
    .map((rule) => ({ opensAt: rule.opensAt, closesAt: rule.closesAt }));

  const partialClosures = closuresForDate.filter(
    (closure): closure is { date: string; startTime: string; endTime: string } =>
      closure.startTime !== null && closure.endTime !== null,
  );

  return partialClosures.reduce(
    (windows, closure) =>
      windows.flatMap((window) =>
        subtractWindow(window, { opensAt: closure.startTime, closesAt: closure.endTime }),
      ),
    baseWindows,
  );
}

function subtractWindow(window: TimeWindow, closed: TimeWindow): TimeWindow[] {
  if (closed.closesAt <= window.opensAt || closed.opensAt >= window.closesAt) {
    return [window];
  }

  const remaining: TimeWindow[] = [];
  if (closed.opensAt > window.opensAt) {
    remaining.push({ opensAt: window.opensAt, closesAt: closed.opensAt });
  }
  if (closed.closesAt < window.closesAt) {
    remaining.push({ opensAt: closed.closesAt, closesAt: window.closesAt });
  }
  return remaining;
}
