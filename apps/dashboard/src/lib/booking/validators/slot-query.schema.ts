import { z } from "zod";

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

export const slotQuerySchema = z.object({
  resourceId: z.string().min(1, "Ressource invalide"),
  date: z.string().regex(dateOnlyPattern, "Date invalide"),
  partySize: z.coerce.number().int("Nombre de personnes invalide").min(1).max(200),
});

export type SlotQueryParsed = z.infer<typeof slotQuerySchema>;
