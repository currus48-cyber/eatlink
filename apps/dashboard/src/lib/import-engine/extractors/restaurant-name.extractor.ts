import { normalizeText } from "../normalizers/text.normalizer";
import { emptyField, field, type ConfidenceField, type Extractor, type ExtractionContext } from "../types";

export const restaurantNameExtractor: Extractor<string> = {
  extract({ $, restaurantNode }: ExtractionContext): ConfidenceField<string> {
    const jsonLdName =
      typeof restaurantNode?.name === "string" ? normalizeText(restaurantNode.name) : null;
    if (jsonLdName) {
      return field(jsonLdName, 0.98, "json-ld");
    }

    const ogSiteName = normalizeText($('meta[property="og:site_name"]').attr("content") ?? "");
    if (ogSiteName) {
      return field(ogSiteName, 0.85, "opengraph");
    }

    const ogTitle = normalizeText($('meta[property="og:title"]').attr("content") ?? "");
    if (ogTitle) {
      return field(ogTitle, 0.75, "opengraph");
    }

    const titleTag = normalizeText($("title").first().text());
    if (titleTag) {
      return field(stripTitleSuffix(titleTag), 0.55, "html-heuristic");
    }

    const h1 = normalizeText($("h1").first().text());
    if (h1) {
      return field(h1, 0.45, "html-heuristic");
    }

    return emptyField();
  },
};

function stripTitleSuffix(title: string): string {
  return title.split(/[|\-–—]/)[0]?.trim() || title;
}
