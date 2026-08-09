import "server-only";

import { prisma } from "@/lib/prisma";

import { getOpenWindows } from "../availability/get-open-windows";
import { BookingError } from "../domain/booking-error";
import { DEFAULT_BOOKING_SETTINGS } from "../domain/booking-defaults";
import { addMinutesToTime, dateOnlyToUtcDate, dateOnlyToWeekday } from "../domain/time";
import { filterSlotsByCapacity } from "../slot-generator/filter-slots-by-capacity";
import { generateCandidateSlots } from "../slot-generator/generate-candidate-slots";
import type { ReservationRecord, Weekday } from "../types";
import type { ReservationInputParsed } from "../validators/reservation-input.schema";
import { toReservationRecord } from "./reservation-mapper";

const ACTIVE_STATUSES = ["PENDING", "CONFIRMED"] as const;

/** Re-validates availability inside a Serializable transaction and inserts
 * the reservation — this is the only path a booking can be created through,
 * so a slot can never be double-booked between the client's last availability
 * check and the actual write. */
export async function createReservation(
  input: ReservationInputParsed,
): Promise<ReservationRecord> {
  return prisma.$transaction(
    async (tx) => {
      const dateOnly = dateOnlyToUtcDate(input.date);

      const [resource, settings, rules, closures, existingReservations] = await Promise.all([
        tx.resource.findUnique({ where: { id: input.resourceId } }),
        tx.bookingSettings.findUnique({ where: { resourceId: input.resourceId } }),
        tx.availabilityRule.findMany({ where: { resourceId: input.resourceId } }),
        tx.specialClosure.findMany({ where: { resourceId: input.resourceId, date: dateOnly } }),
        tx.reservation.findMany({
          where: {
            resourceId: input.resourceId,
            date: dateOnly,
            status: { in: [...ACTIVE_STATUSES] },
          },
          select: { startTime: true, endTime: true },
        }),
      ]);

      if (!resource) {
        throw new BookingError("Cette ressource n'existe pas.", "RESOURCE_NOT_FOUND");
      }

      const resolvedSettings = settings ?? DEFAULT_BOOKING_SETTINGS;

      if (input.partySize > resolvedSettings.maxPartySize) {
        throw new BookingError(
          `Ce nombre de personnes dépasse la capacité maximale (${resolvedSettings.maxPartySize}).`,
          "PARTY_TOO_LARGE",
        );
      }

      const windows = getOpenWindows({
        date: input.date,
        weekday: dateOnlyToWeekday(input.date),
        availabilityRules: rules.map((rule) => ({
          dayOfWeek: rule.dayOfWeek as Weekday,
          opensAt: rule.opensAt,
          closesAt: rule.closesAt,
        })),
        specialClosures: closures.map((closure) => ({
          date: input.date,
          startTime: closure.startTime,
          endTime: closure.endTime,
        })),
      });

      const candidates = generateCandidateSlots({
        windows,
        slotIntervalMinutes: resolvedSettings.slotIntervalMinutes,
        durationMinutes: resolvedSettings.averageDurationMinutes,
      });

      const availableSlots = filterSlotsByCapacity({
        candidateSlots: candidates,
        durationMinutes: resolvedSettings.averageDurationMinutes,
        bufferMinutes: resolvedSettings.bufferMinutes,
        maxConcurrentReservations: resolvedSettings.maxConcurrentReservations,
        existingReservations,
      });

      if (!availableSlots.includes(input.startTime)) {
        throw new BookingError("Ce créneau n'est plus disponible.", "SLOT_UNAVAILABLE");
      }

      const endTime = addMinutesToTime(input.startTime, resolvedSettings.averageDurationMinutes);

      const created = await tx.reservation.create({
        data: {
          resourceId: input.resourceId,
          date: dateOnly,
          startTime: input.startTime,
          endTime,
          partySize: input.partySize,
          customerName: input.customerName,
          customerPhone: input.customerPhone,
          customerEmail: input.customerEmail || null,
          comment: input.comment || null,
          status: "PENDING",
        },
      });

      return toReservationRecord(created);
    },
    { isolationLevel: "Serializable" },
  );
}
