import { normalizeText } from "../normalizers/text.normalizer";
import { emptyField, field, type ConfidenceField, type Extractor, type ExtractionContext } from "../types";

export interface StructuredAddress {
  street: string | null;
  city: string | null;
  country: string | null;
  raw: string;
}

export const addressExtractor: Extractor<StructuredAddress> = {
  extract({ restaurantNode }: ExtractionContext): ConfidenceField<StructuredAddress> {
    const address = restaurantNode?.address;

    if (address && typeof address === "object") {
      const postal = address as Record<string, unknown>;
      const street =
        typeof postal.streetAddress === "string" ? normalizeText(postal.streetAddress) : null;
      const city =
        typeof postal.addressLocality === "string" ? normalizeText(postal.addressLocality) : null;
      const country = extractCountryValue(postal.addressCountry);

      if (street || city || country) {
        const raw = [street, city, country].filter(Boolean).join(", ");
        return field({ street, city, country, raw }, 0.9, "json-ld");
      }
    }

    if (typeof address === "string") {
      const normalized = normalizeText(address);
      if (normalized) {
        return field(
          { street: normalized, city: null, country: null, raw: normalized },
          0.6,
          "json-ld",
        );
      }
    }

    return emptyField();
  },
};

function extractCountryValue(value: unknown): string | null {
  if (typeof value === "string") {
    return normalizeText(value);
  }
  if (value && typeof value === "object" && "name" in value) {
    const name = (value as { name: unknown }).name;
    return typeof name === "string" ? normalizeText(name) : null;
  }
  return null;
}
