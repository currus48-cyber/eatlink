import type { OpeningHoursEntry } from "@/lib/import-engine/types";

export interface PublicRestaurant {
  id: string;
  slug: string;
  resourceId: string | null;
  name: string;
  logoUrl: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  openingHours: OpeningHoursEntry[] | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
  websiteUrl: string | null;
  photos: string[];
  menuUrl: string | null;
  reservationUrl: string | null;
  reservationProvider: string | null;
}
