import { z } from "zod";

export const websiteUrlSchema = z
  .string()
  .trim()
  .min(1, "L'URL du site est requise")
  .transform((value) => (/^https?:\/\//i.test(value) ? value : `https://${value}`))
  .pipe(z.url("URL invalide"));
