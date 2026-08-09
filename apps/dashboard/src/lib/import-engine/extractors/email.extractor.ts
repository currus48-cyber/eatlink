import { emptyField, field, type ConfidenceField, type Extractor, type ExtractionContext } from "../types";

const EMAIL_REGEX = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

export const emailExtractor: Extractor<string> = {
  extract({ $, restaurantNode }: ExtractionContext): ConfidenceField<string> {
    const jsonLdEmail =
      typeof restaurantNode?.email === "string" ? restaurantNode.email.trim() : null;
    if (jsonLdEmail && EMAIL_REGEX.test(jsonLdEmail)) {
      return field(jsonLdEmail, 0.95, "json-ld");
    }

    const mailtoLink = $('a[href^="mailto:"]').first().attr("href");
    if (mailtoLink) {
      const email = mailtoLink.replace(/^mailto:/i, "").split("?")[0].trim();
      if (EMAIL_REGEX.test(email)) return field(email, 0.85, "html-heuristic");
    }

    const bodyMatch = $("body").text().match(EMAIL_REGEX);
    if (bodyMatch) {
      return field(bodyMatch[0], 0.4, "html-heuristic");
    }

    return emptyField();
  },
};
