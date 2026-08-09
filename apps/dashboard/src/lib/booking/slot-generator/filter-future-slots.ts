/** Drops slots that have already passed, when the requested date is today.
 * Slots on any other date are left untouched. */
export function filterFutureSlots(input: {
  slots: string[];
  date: string;
  today: string;
  nowTime: string;
}): string[] {
  if (input.date !== input.today) {
    return input.slots;
  }
  return input.slots.filter((slot) => slot > input.nowTime);
}
