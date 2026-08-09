import {
  parseCompactOpeningHours,
  parseOpeningHoursSpecification,
  type JsonLdOpeningHoursSpec,
} from "../normalizers/opening-hours.normalizer";
import {
  emptyField,
  field,
  type ConfidenceField,
  type Extractor,
  type ExtractionContext,
  type OpeningHoursEntry,
} from "../types";

export const openingHoursExtractor: Extractor<OpeningHoursEntry[]> = {
  extract({ restaurantNode }: ExtractionContext): ConfidenceField<OpeningHoursEntry[]> {
    const spec = restaurantNode?.openingHoursSpecification;
    if (spec) {
      const specs = Array.isArray(spec) ? spec : [spec];
      const parsed = parseOpeningHoursSpecification(specs as JsonLdOpeningHoursSpec[]);
      if (parsed.some((entry) => !entry.closed)) {
        return field(parsed, 0.9, "json-ld");
      }
    }

    const compact = restaurantNode?.openingHours;
    if (compact) {
      const values = Array.isArray(compact) ? compact : [compact];
      const joined = values.filter((value): value is string => typeof value === "string").join("; ");
      if (joined) {
        const parsed = parseCompactOpeningHours(joined);
        if (parsed.some((entry) => !entry.closed)) {
          return field(parsed, 0.75, "json-ld");
        }
      }
    }

    return emptyField();
  },
};
