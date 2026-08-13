import { timeToMinutes, minutesToTime } from "../domain/time";
import type { TimeWindow } from "../types";

export interface GenerateCandidateSlotsInput {
  windows: TimeWindow[];
  slotIntervalMinutes: number;
  durationMinutes: number;
}

const END_OF_DAY_MINUTES = 24 * 60;

/** Every slot start time within the given windows where a full reservation
 * (duration) fits before the window closes — e.g. windows=[{12:00-14:00}],
 * interval=15, duration=90 → 12:00, 12:15, 12:30.
 *
 * A window's `closesAt` of "00:00" means midnight at the END of that same
 * service day (e.g. "08:00-00:00" = open 8am until midnight that night),
 * not minute 0 — timeToMinutes("00:00") is 0, which is numerically before
 * any opening time, so it's special-cased to the end of the day (24:00)
 * instead of minute 0 to avoid producing an inverted, empty window. */
export function generateCandidateSlots(input: GenerateCandidateSlotsInput): string[] {
  const slots: string[] = [];

  for (const window of input.windows) {
    const windowEnd =
      window.closesAt === "00:00" ? END_OF_DAY_MINUTES : timeToMinutes(window.closesAt);
    let cursor = timeToMinutes(window.opensAt);

    while (cursor + input.durationMinutes <= windowEnd) {
      slots.push(minutesToTime(cursor));
      cursor += input.slotIntervalMinutes;
    }
  }

  return slots.sort();
}
