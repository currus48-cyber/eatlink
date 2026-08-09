"use server";

import { getAvailableSlots } from "../services/availability.service";
import { slotQuerySchema } from "../validators/slot-query.schema";

export interface GetAvailableSlotsResult {
  status: "success" | "error";
  slots: string[];
  maxPartySize?: number;
  message?: string;
}

// Public and generic: no ownership check. Any caller may ask a Resource for
// its available slots — that's the whole point of a public booking flow.
export async function getAvailableSlotsAction(input: {
  resourceId: string;
  date: string;
  partySize: number;
}): Promise<GetAvailableSlotsResult> {
  const parsed = slotQuerySchema.safeParse(input);
  if (!parsed.success) {
    return { status: "error", slots: [], message: "Requête invalide." };
  }

  const result = await getAvailableSlots(parsed.data.resourceId, parsed.data.date, parsed.data.partySize);
  return { status: "success", slots: result.slots, maxPartySize: result.maxPartySize };
}
