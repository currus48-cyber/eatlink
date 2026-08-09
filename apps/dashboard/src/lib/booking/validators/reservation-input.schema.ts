import { z } from "zod";

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;
const timeOnlyPattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const reservationInputSchema = z.object({
  resourceId: z.string().min(1, "Ressource invalide"),
  date: z.string().regex(dateOnlyPattern, "Date invalide"),
  startTime: z.string().regex(timeOnlyPattern, "Heure invalide"),
  partySize: z.coerce
    .number()
    .int("Nombre de personnes invalide")
    .min(1, "Au moins 1 personne")
    .max(200, "Nombre de personnes trop élevé"),
  customerName: z
    .string()
    .trim()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(100, "Le nom ne peut pas dépasser 100 caractères"),
  customerPhone: z
    .string()
    .trim()
    .min(6, "Numéro de téléphone invalide")
    .max(30, "Numéro de téléphone invalide"),
  customerEmail: z
    .string()
    .trim()
    .refine((value) => value === "" || z.email().safeParse(value).success, "Email invalide"),
  comment: z.string().trim().max(500, "Le commentaire ne peut pas dépasser 500 caractères"),
});

export type ReservationInputParsed = z.infer<typeof reservationInputSchema>;
