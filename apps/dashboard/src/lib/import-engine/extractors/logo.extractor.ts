import type { CheerioAPI } from "cheerio";

import { resolveUrl } from "../normalizers/url.normalizer";
import {
  emptyField,
  field,
  type ConfidenceField,
  type Extractor,
  type ExtractionContext,
  type ExtractionSource,
} from "../types";
import { isThirdPartyBookingHost } from "./shared/third-party-hosts";

export const logoExtractor: Extractor<string> = {
  extract({ $, restaurantNode, url }: ExtractionContext): ConfidenceField<string> {
    const jsonLdField = toOwnedLogoField(extractImageUrl(restaurantNode?.logo), url, 0.95, "json-ld");
    if (jsonLdField) return jsonLdField;

    const ogLogo = $('meta[property="og:logo"]').first().attr("content") ?? null;
    const ogLogoField = toOwnedLogoField(ogLogo, url, 0.85, "opengraph");
    if (ogLogoField) return ogLogoField;

    const htmlLogoField = toOwnedLogoField(findHtmlLogoSrc($), url, 0.65, "html-heuristic");
    if (htmlLogoField) return htmlLogoField;

    const appleTouchIcon = $('link[rel="apple-touch-icon"]').first().attr("href") ?? null;
    const appleTouchField = toOwnedLogoField(appleTouchIcon, url, 0.55, "favicon");
    if (appleTouchField) return appleTouchField;

    const iconLink = $('link[rel="icon"]').first().attr("href") ?? null;
    const iconField = toOwnedLogoField(iconLink, url, 0.4, "favicon");
    if (iconField) return iconField;

    const fallbackFavicon = resolveUrl("/favicon.ico", url);
    if (fallbackFavicon) {
      return field(fallbackFavicon, 0.3, "favicon");
    }

    return emptyField();
  },
};

// Rejects the reservation platform's own brand/marketing assets (Zenchef,
// TheFork, OpenTable, ...). Restaurant-owned assets served from the same
// platform's CDN (e.g. white-label sites hosting the owner's uploaded logo
// on ugc.zenchef.com) are accepted - only the provider's own host is opaque.
function toOwnedLogoField(
  candidate: string | null,
  pageUrl: string,
  confidence: number,
  source: ExtractionSource,
): ConfidenceField<string> | null {
  const resolved = candidate ? resolveUrl(candidate, pageUrl) : null;
  if (!resolved) return null;

  const hostname = new URL(resolved).hostname;
  if (isThirdPartyBookingHost(hostname)) {
    return null;
  }

  return field(resolved, confidence, source);
}

function findHtmlLogoSrc($: CheerioAPI): string | null {
  const linkLogo = $('link[rel="logo"]').first().attr("href");
  if (linkLogo) return linkLogo;

  let logoSrc: string | null = null;
  $("img").each((_, element) => {
    if (logoSrc) return;
    const $el = $(element);
    const hint = `${$el.attr("alt") ?? ""} ${$el.attr("class") ?? ""} ${$el.attr("id") ?? ""}`;
    if (/logo/i.test(hint)) {
      logoSrc = $el.attr("src") ?? null;
    }
  });
  return logoSrc;
}

function extractImageUrl(value: unknown): string | null {
  if (typeof value === "string") {
    return value;
  }
  if (value && typeof value === "object" && "url" in value) {
    const url = (value as { url: unknown }).url;
    return typeof url === "string" ? url : null;
  }
  return null;
}
