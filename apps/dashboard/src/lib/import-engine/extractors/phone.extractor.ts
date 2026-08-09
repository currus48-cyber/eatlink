import { normalizePhone } from "../normalizers/phone.normalizer";
import { emptyField, field, type ConfidenceField, type Extractor, type ExtractionContext } from "../types";

const PHONE_REGEX = /(\+\d{1,3}[\s.-]?)?(\(?\d{2,4}\)?[\s.-]?){3,5}\d{2,4}/;

export const phoneExtractor: Extractor<string> = {
  extract({ $, restaurantNode }: ExtractionContext): ConfidenceField<string> {
    const jsonLdPhone =
      typeof restaurantNode?.telephone === "string"
        ? normalizePhone(restaurantNode.telephone)
        : null;
    if (jsonLdPhone) {
      return field(jsonLdPhone, 1, "json-ld");
    }

    const telLink = $('a[href^="tel:"]').first().attr("href");
    if (telLink) {
      const normalized = normalizePhone(telLink.replace(/^tel:/i, ""));
      if (normalized) return field(normalized, 0.9, "html-heuristic");
    }

    const match = $("body").text().match(PHONE_REGEX);
    if (match) {
      const normalized = normalizePhone(match[0]);
      if (normalized) return field(normalized, 0.5, "html-heuristic");
    }

    return emptyField();
  },
};
