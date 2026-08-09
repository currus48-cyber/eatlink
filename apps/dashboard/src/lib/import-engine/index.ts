import "server-only";
import * as cheerio from "cheerio";

import { fetchPage } from "./crawler/fetch-page";
import { addressExtractor, type StructuredAddress } from "./extractors/address.extractor";
import { emailExtractor } from "./extractors/email.extractor";
import { imagesExtractor } from "./extractors/images.extractor";
import { logoExtractor } from "./extractors/logo.extractor";
import { menuLinkExtractor } from "./extractors/menu-link.extractor";
import { openingHoursExtractor } from "./extractors/opening-hours.extractor";
import { phoneExtractor } from "./extractors/phone.extractor";
import { reservationProviderExtractor, type ReservationInfo } from "./extractors/reservation-provider.extractor";
import { restaurantNameExtractor } from "./extractors/restaurant-name.extractor";
import { extractJsonLdNodes, findRestaurantNode } from "./extractors/shared/json-ld";
import { socialLinksExtractor, type SocialLinks } from "./extractors/social-links.extractor";
import {
  emptyField,
  field,
  ImportEngineError,
  type ConfidenceField,
  type ExtractionContext,
  type RestaurantImportData,
} from "./types";
import { assertSafeUrl } from "./validators/url.validator";
import { websiteUrlSchema } from "./validators/website-url.schema";

export * from "./types";

export async function runImportEngine(inputUrl: string): Promise<RestaurantImportData> {
  const result = websiteUrlSchema.safeParse(inputUrl);
  if (!result.success) {
    throw new ImportEngineError("URL invalide.", "INVALID_URL");
  }

  assertSafeUrl(result.data);

  const page = await fetchPage(result.data);
  const $ = cheerio.load(page.html);
  const jsonLdNodes = extractJsonLdNodes($);
  const restaurantNode = findRestaurantNode(jsonLdNodes);

  const context: ExtractionContext = {
    url: page.url,
    html: page.html,
    $,
    jsonLdNodes,
    restaurantNode,
  };

  const structuredAddress = addressExtractor.extract(context);
  const socialLinks = socialLinksExtractor.extract(context);
  const reservation = reservationProviderExtractor.extract(context);
  const logoUrl = logoExtractor.extract(context);
  const photos = excludeLogoFromPhotos(imagesExtractor.extract(context), logoUrl.value);

  return {
    name: restaurantNameExtractor.extract(context),
    logoUrl,
    phone: phoneExtractor.extract(context),
    email: emailExtractor.extract(context),
    address: deriveField(structuredAddress, (value: StructuredAddress) => value.street ?? value.raw),
    city: deriveField(structuredAddress, (value: StructuredAddress) => value.city),
    country: deriveField(structuredAddress, (value: StructuredAddress) => value.country),
    openingHours: openingHoursExtractor.extract(context),
    instagramUrl: deriveField(socialLinks, (value: SocialLinks) => value.instagram),
    facebookUrl: deriveField(socialLinks, (value: SocialLinks) => value.facebook),
    tiktokUrl: deriveField(socialLinks, (value: SocialLinks) => value.tiktok),
    websiteUrl: field(page.url, 1, "html-heuristic"),
    photos,
    menuUrl: menuLinkExtractor.extract(context),
    reservationUrl: deriveField(reservation, (value: ReservationInfo) => value.url),
    reservationProvider: deriveField(reservation, (value: ReservationInfo) => value.provider),
  };
}

// The logo is never a gallery photo, even if an extractor happened to pick up the same asset.
function excludeLogoFromPhotos(
  photos: ConfidenceField<string[]>,
  logoUrl: string | null,
): ConfidenceField<string[]> {
  if (!logoUrl || !photos.value) {
    return photos;
  }
  const filtered = photos.value.filter((photo) => photo !== logoUrl);
  if (filtered.length === photos.value.length) {
    return photos;
  }
  if (filtered.length === 0) {
    return emptyField();
  }
  return { ...photos, value: filtered };
}

function deriveField<T, U>(
  source: ConfidenceField<T>,
  pick: (value: T) => U | null,
): ConfidenceField<U> {
  if (source.value === null) {
    return emptyField();
  }
  const picked = pick(source.value);
  if (picked === null) {
    return emptyField();
  }
  return { value: picked, confidence: source.confidence, source: source.source };
}
