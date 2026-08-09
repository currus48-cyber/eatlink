import { resolveUrl } from "../normalizers/url.normalizer";
import { emptyField, field, type ConfidenceField, type Extractor, type ExtractionContext } from "../types";

const MENU_TEXT_PATTERN = /\b(menu|carte|our food|nos plats)\b/i;
const MENU_HREF_PATTERN = /menu/i;

export const menuLinkExtractor: Extractor<string> = {
  extract({ $, url, restaurantNode }: ExtractionContext): ConfidenceField<string> {
    const jsonLdMenu = restaurantNode?.hasMenu;
    const jsonLdMenuUrl =
      typeof jsonLdMenu === "string"
        ? jsonLdMenu
        : typeof (jsonLdMenu as { url?: unknown })?.url === "string"
          ? (jsonLdMenu as { url: string }).url
          : null;

    if (jsonLdMenuUrl) {
      const resolved = resolveUrl(jsonLdMenuUrl, url);
      if (resolved) return field(resolved, 0.9, "json-ld");
    }

    let found: string | null = null;
    $("a[href]").each((_, element) => {
      if (found) return;
      const $el = $(element);
      const href = $el.attr("href");
      if (!href) return;

      const text = $el.text().toLowerCase();
      if (MENU_TEXT_PATTERN.test(text) || MENU_HREF_PATTERN.test(href)) {
        found = href;
      }
    });

    if (found) {
      const resolved = resolveUrl(found, url);
      if (resolved) return field(resolved, 0.65, "html-heuristic");
    }

    return emptyField();
  },
};
