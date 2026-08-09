import "server-only";

import { prisma } from "@/lib/prisma";

import { getOpenWindows } from "../availability/get-open-windows";
import { DEFAULT_BOOKING_SETTINGS } from "../domain/booking-defaults";
import { dateOnlyToUtcDate, dateOnlyToWeekday, nowTimeOnly, todayDateOnly } from "../domain/time";
import { filterFutureSlots } from "../slot-generator/filter-future-slots";
import { filterSlotsByCapacity } from "../slot-generator/filter-slots-by-capacity";
import { generateCandidateSlots } from "../slot-generator/generate-candidate-slots";
import type { Weekday } from "../types";

const ACTIVE_STATUSES = ["PENDING", "CONFIRMED"] as const;

export interface AvailableSlotsResult {
  slots: string[];
  maxPartySize: number;
}

export async function getAvailableSlots(
  resourceId: string,
  date: string,
  partySize: number,
): Promise<AvailableSlotsResult> {
  const dateOnly = dateOnlyToUtcDate(date);

  const [settings, rules, closures, existingReservations] = await Promise.all([
    prisma.bookingSettings.findUnique({ where: { resourceId } }),
    prisma.availabilityRule.findMany({ where: { resourceId } }),
    prisma.specialClosure.findMany({ where: { resourceId, date: dateOnly } }),
    prisma.reservation.findMany({
      where: { resourceId, date: dateOnly, status: { in: [...ACTIVE_STATUSES] } },
      select: { startTime: true, endTime: true },
    }),
  ]);

  const resolvedSettings = settings ?? DEFAULT_BOOKING_SETTINGS;

  if (partySize > resolvedSettings.maxPartySize) {
    return { slots: [], maxPartySize: resolvedSettings.maxPartySize };
  }

  const windows = getOpenWindows({
    date,
    weekday: dateOnlyToWeekday(date),
    availabilityRules: rules.map((rule) => ({
      dayOfWeek: rule.dayOfWeek as Weekday,
      opensAt: rule.opensAt,
      closesAt: rule.closesAt,
    })),
    specialClosures: closures.map((closure) => ({
      date,
      startTime: closure.startTime,
      endTime: closure.endTime,
    })),
  });

  const candidates = generateCandidateSlots({
    windows,
    slotIntervalMinutes: resolvedSettings.slotIntervalMinutes,
    durationMinutes: resolvedSettings.averageDurationMinutes,
  });

  const capacityFiltered = filterSlotsByCapacity({
    candidateSlots: candidates,
    durationMinutes: resolvedSettings.averageDurationMinutes,
    bufferMinutes: resolvedSettings.bufferMinutes,
    maxConcurrentReservations: resolvedSettings.maxConcurrentReservations,
    existingReservations,
  });

  const slots = filterFutureSlots({
    slots: capacityFiltered,
    date,
    today: todayDateOnly(),
    nowTime: nowTimeOnly(),
  });

  return { slots, maxPartySize: resolvedSettings.maxPartySize };
}
