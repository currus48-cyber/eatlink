import { emptyField, field, type ConfidenceField, type Extractor, type ExtractionContext } from "../types";

export interface ReservationInfo {
  provider: string;
  url: string;
}

const RESERVATION_PROVIDERS: { provider: string; pattern: RegExp }[] = [
  { provider: "TheFork", pattern: /thefork\.(com|fr|rs)|lafourchette\.com/i },
  { provider: "OpenTable", pattern: /opentable\.(com|fr|co\.uk)/i },
  { provider: "Resy", pattern: /resy\.com/i },
  { provider: "SevenRooms", pattern: /sevenrooms\.com/i },
  { provider: "Zenchef", pattern: /zenchef\.com/i },
  { provider: "Google Reservations", pattern: /reservewithgoogle\.com/i },
  { provider: "Bookatable", pattern: /bookatable\.(com|co\.uk)/i },
];

// A reservation URL is never a downloadable document - sites commonly link
// their menu PDF (or other docs) from the same provider domain (e.g. a
// Zenchef-hosted "userdocs" menu), which would otherwise be mistaken for the
// booking link since it matches the provider's domain pattern too.
const DOCUMENT_FILE_PATTERN = /\.(pdf|docx?|xlsx?)(\?|#|$)/i;

export const reservationProviderExtractor: Extractor<ReservationInfo> = {
  extract({ $ }: ExtractionContext): ConfidenceField<ReservationInfo> {
    let match: ReservationInfo | null = null;

    $("a[href]").each((_, element) => {
      if (match) return;
      const href = $(element).attr("href");
      if (!href || DOCUMENT_FILE_PATTERN.test(href)) return;

      const provider = RESERVATION_PROVIDERS.find((entry) => entry.pattern.test(href));
      if (provider) {
        match = { provider: provider.provider, url: href };
      }
    });

    if (!match) {
      return emptyField();
    }

    return field(match, 0.9, "html-heuristic");
  },
};
