import { z } from "zod";

import { openingHoursSchema } from "@/lib/validations/opening-hours";

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
  openingHours: openingHoursSchema,
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
