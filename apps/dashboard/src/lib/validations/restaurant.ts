import { z } from "zod";

import { ALL_DAYS, type DayOfWeek } from "@/lib/import-engine/types";

const optionalUrlField = z
  .string()
  .trim()
  .refine((value) => value === "" || z.url().safeParse(value).success, "URL invalide");

const optionalEmailField = z
  .string()
  .trim()
  .refine((value) => value === "" || z.email().safeParse(value).success, "Email invalide");

export const restaurantInputSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères").max(120),
  logoUrl: optionalUrlField,
  phone: z.string().trim().max(30),
  email: optionalEmailField,
  address: z.string().trim().max(200),
  city: z.string().trim().max(100),
  country: z.string().trim().max(100),
  openingHours: z.array(
    z.object({
      day: z.enum(ALL_DAYS as unknown as [DayOfWeek, ...DayOfWeek[]]),
      opens: z.string().nullable(),
      closes: z.string().nullable(),
      closed: z.boolean(),
    }),
  ),
  instagramUrl: optionalUrlField,
  facebookUrl: optionalUrlField,
  tiktokUrl: optionalUrlField,
  websiteUrl: optionalUrlField,
  photos: z.array(z.string()),
  menuUrl: optionalUrlField,
  reservationUrl: optionalUrlField,
  reservationProvider: z.string().trim().max(60),
});

export type RestaurantInput = z.infer<typeof restaurantInputSchema>;
