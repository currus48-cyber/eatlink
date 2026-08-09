import { utcDateToDateOnly } from "../domain/time";
import type { ReservationRecord, ReservationStatus } from "../types";

export interface ReservationRow {
  id: string;
  resourceId: string;
  date: Date;
  startTime: string;
  endTime: string;
  partySize: number;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  comment: string | null;
  status: string;
  createdAt: Date;
}

export function toReservationRecord(row: ReservationRow): ReservationRecord {
  return {
    id: row.id,
    resourceId: row.resourceId,
    date: utcDateToDateOnly(row.date),
    startTime: row.startTime,
    endTime: row.endTime,
    partySize: row.partySize,
    customerName: row.customerName,
    customerPhone: row.customerPhone,
    customerEmail: row.customerEmail,
    comment: row.comment,
    status: row.status as ReservationStatus,
    createdAt: row.createdAt.toISOString(),
  };
}
