import "server-only";

import { prisma } from "@/lib/prisma";

import { todayDateOnly } from "../domain/time";
import { toReservationRecord } from "../reservation/reservation-mapper";
import type { ReservationRecord } from "../types";

export interface ReservationDashboardView {
  today: ReservationRecord[];
  upcoming: ReservationRecord[];
  completed: ReservationRecord[];
  cancelled: ReservationRecord[];
}

const ACTIVE_STATUSES = new Set(["PENDING", "CONFIRMED"]);

/** Loads every reservation for a resource and buckets it the way the
 * dashboard displays it — the engine owns what "today"/"upcoming" means so
 * the dashboard UI never has to reimplement that logic. */
export async function getReservationDashboardView(
  resourceId: string,
): Promise<ReservationDashboardView> {
  const rows = await prisma.reservation.findMany({
    where: { resourceId },
    orderBy: [{ date: "asc" }, { startTime: "asc" }],
  });

  const records = rows.map(toReservationRecord);
  const today = todayDateOnly();

  const view: ReservationDashboardView = {
    today: [],
    upcoming: [],
    completed: [],
    cancelled: [],
  };

  for (const record of records) {
    if (record.status === "COMPLETED") {
      view.completed.push(record);
    } else if (record.status === "CANCELLED" || record.status === "NO_SHOW") {
      view.cancelled.push(record);
    } else if (ACTIVE_STATUSES.has(record.status) && record.date <= today) {
      // Also catches active reservations from a past date that were never
      // resolved to Completed/Cancelled/NoShow — surfaced here rather than
      // silently vanishing from every list.
      view.today.push(record);
    } else if (ACTIVE_STATUSES.has(record.status) && record.date > today) {
      view.upcoming.push(record);
    }
  }

  return view;
}
