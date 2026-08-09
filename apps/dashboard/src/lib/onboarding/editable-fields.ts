import { ALL_DAYS, type OpeningHoursEntry, type RestaurantImportData } from "@/lib/import-engine/types";

export interface EditableRestaurantFields {
  name: string;
  logoUrl: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  country: string;
  openingHours: OpeningHoursEntry[];
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  websiteUrl: string;
  photos: string[];
  menuUrl: string;
  reservationUrl: string;
  reservationProvider: string;
}

export function toEditableFields(data: RestaurantImportData): EditableRestaurantFields {
  return {
    name: data.name.value ?? "",
    logoUrl: data.logoUrl.value ?? "",
    phone: data.phone.value ?? "",
    email: data.email.value ?? "",
    address: data.address.value ?? "",
    city: data.city.value ?? "",
    country: data.country.value ?? "",
    openingHours: data.openingHours.value ?? defaultOpeningHours(),
    instagramUrl: data.instagramUrl.value ?? "",
    facebookUrl: data.facebookUrl.value ?? "",
    tiktokUrl: data.tiktokUrl.value ?? "",
    websiteUrl: data.websiteUrl.value ?? "",
    photos: data.photos.value ?? [],
    menuUrl: data.menuUrl.value ?? "",
    reservationUrl: data.reservationUrl.value ?? "",
    reservationProvider: data.reservationProvider.value ?? "",
  };
}

function defaultOpeningHours(): OpeningHoursEntry[] {
  return ALL_DAYS.map((day) => ({ day, opens: null, closes: null, closed: true }));
}
