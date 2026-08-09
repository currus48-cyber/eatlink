import { timeToMinutes, minutesToTime } from "../domain/time";
import type { TimeWindow } from "../types";

export interface GenerateCandidateSlotsInput {
  windows: TimeWindow[];
  slotIntervalMinutes: number;
  durationMinutes: number;
}

/** Every slot start time within the given windows where a full reservation
 * (duration) fits before the window closes — e.g. windows=[{12:00-14:00}],
 * interval=15, duration=90 → 12:00, 12:15, 12:30. */
export function generateCandidateSlots(input: GenerateCandidateSlotsInput): string[] {
  const slots: string[] = [];

  for (const window of input.windows) {
    const windowEnd = timeToMinutes(window.closesAt);
    let cursor = timeToMinutes(window.opensAt);

    while (cursor + input.durationMinutes <= windowEnd) {
      slots.push(minutesToTime(cursor));
      cursor += input.slotIntervalMinutes;
    }
  }

  return slots.sort();
}
