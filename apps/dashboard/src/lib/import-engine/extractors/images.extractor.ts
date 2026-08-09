import { resolveUrl } from "../normalizers/url.normalizer";
import { emptyField, field, type ConfidenceField, type Extractor, type ExtractionContext } from "../types";
import { isThirdPartyBookingAsset } from "./shared/third-party-hosts";

const MAX_PHOTOS = 12;
const MIN_DIMENSION = 128;
const NON_CONTENT_HINT_PATTERN =
  /icon|sprite|logo|pixel|spacer|favicon|button|btn|badge|tracker|avatar|placeholder/i;

export const imagesExtractor: Extractor<string[]> = {
  extract({ $, url, restaurantNode }: ExtractionContext): ConfidenceField<string[]> {
    const ordered: string[] = [];
    const seen = new Set<string>();
    let hasJsonLdImage = false;

    const addCandidate = (candidate: string | null): boolean => {
      if (!candidate || seen.has(candidate)) return false;
      if (isRejectedAsset(candidate)) return false;
      seen.add(candidate);
      ordered.push(candidate);
      return true;
    };

    $('meta[property="og:image"]').each((_, element) => {
      const content = $(element).attr("content");
      addCandidate(content ? resolveUrl(content, url) : null);
    });

    const jsonLdImages = restaurantNode?.image;
    if (jsonLdImages) {
      const values = Array.isArray(jsonLdImages) ? jsonLdImages : [jsonLdImages];
      for (const value of values) {
        const src =
          typeof value === "string"
            ? value
            : typeof (value as { url?: unknown })?.url === "string"
              ? (value as { url: string }).url
              : null;
        const resolved = src ? resolveUrl(src, url) : null;
        if (resolved && addCandidate(resolved)) {
          hasJsonLdImage = true;
        }
      }
    }

    $("img[src]").each((_, element) => {
      if (ordered.length >= MAX_PHOTOS) return;

      const $el = $(element);
      const src = $el.attr("src");
      if (!src || NON_CONTENT_HINT_PATTERN.test(src)) return;

      const hint = `${$el.attr("alt") ?? ""} ${$el.attr("class") ?? ""} ${$el.attr("id") ?? ""}`;
      if (NON_CONTENT_HINT_PATTERN.test(hint)) return;

      const width = Number($el.attr("width"));
      const height = Number($el.attr("height"));
      if ((width && width < MIN_DIMENSION) || (height && height < MIN_DIMENSION)) return;

      addCandidate(resolveUrl(src, url));
    });

    // Many restaurant sites render hero/gallery photos as CSS background
    // images (e.g. parallax headers) rather than <img> tags.
    $("[style*='background-image']").each((_, element) => {
      if (ordered.length >= MAX_PHOTOS) return;

      const $el = $(element);
      const style = $el.attr("style") ?? "";
      const match = /background-image\s*:\s*url\((['"]?)(.*?)\1\)/i.exec(style);
      const src = match?.[2];
      if (!src || NON_CONTENT_HINT_PATTERN.test(src)) return;

      const hint = `${$el.attr("class") ?? ""} ${$el.attr("id") ?? ""}`;
      if (NON_CONTENT_HINT_PATTERN.test(hint)) return;

      addCandidate(resolveUrl(src, url));
    });

    const photos = ordered.slice(0, MAX_PHOTOS);
    if (photos.length === 0) {
      return emptyField();
    }

    const confidence = photos.length >= 3 ? 0.8 : 0.5;
    return field(photos, confidence, hasJsonLdImage ? "json-ld" : "html-heuristic");
  },
};

function isRejectedAsset(candidateUrl: string): boolean {
  return NON_CONTENT_HINT_PATTERN.test(candidateUrl) || isThirdPartyBookingAsset(candidateUrl);
}
