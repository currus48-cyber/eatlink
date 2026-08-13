import assert from "node:assert/strict";
import { test } from "node:test";

import { generateCandidateSlots } from "./generate-candidate-slots";

const SLOT_INTERVAL_MINUTES = 15;
const DURATION_MINUTES = 90;

test("closesAt '00:00' means midnight at the end of the day — 08:00-00:00 generates slots", () => {
  const slots = generateCandidateSlots({
    windows: [{ opensAt: "08:00", closesAt: "00:00" }],
    slotIntervalMinutes: SLOT_INTERVAL_MINUTES,
    durationMinutes: DURATION_MINUTES,
  });

  assert.notEqual(slots.length, 0, "expected slots for an 08:00-00:00 window, got none");
  assert.equal(slots[0], "08:00");
  assert.equal(slots[slots.length - 1], "22:30");
  assert.equal(slots.length, 59);
});

test("normal same-day window 12:00-22:00 is unaffected", () => {
  const slots = generateCandidateSlots({
    windows: [{ opensAt: "12:00", closesAt: "22:00" }],
    slotIntervalMinutes: SLOT_INTERVAL_MINUTES,
    durationMinutes: DURATION_MINUTES,
  });

  assert.equal(slots[0], "12:00");
  assert.equal(slots[slots.length - 1], "20:30");
  assert.equal(slots.length, 35);
});

test("closed day (no windows) still produces zero slots", () => {
  const slots = generateCandidateSlots({
    windows: [],
    slotIntervalMinutes: SLOT_INTERVAL_MINUTES,
    durationMinutes: DURATION_MINUTES,
  });

  assert.deepEqual(slots, []);
});

test("a window opening at 00:00 (hours after midnight) is unaffected by the midnight-close fix", () => {
  const slots = generateCandidateSlots({
    windows: [{ opensAt: "00:00", closesAt: "02:00" }],
    slotIntervalMinutes: SLOT_INTERVAL_MINUTES,
    durationMinutes: 60,
  });

  assert.deepEqual(slots, ["00:00", "00:15", "00:30", "00:45", "01:00"]);
});
