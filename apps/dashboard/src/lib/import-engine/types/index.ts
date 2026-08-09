import type { CheerioAPI } from "cheerio";

export const ALL_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
] as const;

export type DayOfWeek = (typeof ALL_DAYS)[number];

export interface OpeningHoursEntry {
  day: DayOfWeek;
  opens: string | null;
  closes: string | null;
  closed: boolean;
}

export type ExtractionSource =
  | "json-ld"
  | "opengraph"
  | "meta-tag"
  | "html-heuristic"
  | "favicon"
  | "none";

export interface ConfidenceField<T> {
  value: T | null;
  confidence: number;
  source: ExtractionSource;
}

export function field<T>(
  value: T | null,
  confidence: number,
  source: ExtractionSource,
): ConfidenceField<T> {
  if (value === null) {
    return { value: null, confidence: 0, source: "none" };
  }
  return { value, confidence, source };
}

export function emptyField<T>(): ConfidenceField<T> {
  return { value: null, confidence: 0, source: "none" };
}

export interface RestaurantImportData {
  name: ConfidenceField<string>;
  logoUrl: ConfidenceField<string>;
  phone: ConfidenceField<string>;
  email: ConfidenceField<string>;
  address: ConfidenceField<string>;
  city: ConfidenceField<string>;
  country: ConfidenceField<string>;
  openingHours: ConfidenceField<OpeningHoursEntry[]>;
  instagramUrl: ConfidenceField<string>;
  facebookUrl: ConfidenceField<string>;
  tiktokUrl: ConfidenceField<string>;
  websiteUrl: ConfidenceField<string>;
  photos: ConfidenceField<string[]>;
  menuUrl: ConfidenceField<string>;
  reservationUrl: ConfidenceField<string>;
  reservationProvider: ConfidenceField<string>;
}

export type JsonLdNode = Record<string, unknown>;

export interface ExtractionContext {
  url: string;
  html: string;
  $: CheerioAPI;
  jsonLdNodes: JsonLdNode[];
  restaurantNode: JsonLdNode | null;
}

export interface Extractor<T> {
  extract(context: ExtractionContext): ConfidenceField<T>;
}

export type ImportEngineErrorCode =
  | "INVALID_URL"
  | "BLOCKED_HOST"
  | "FETCH_FAILED"
  | "TIMEOUT"
  | "PAYLOAD_TOO_LARGE"
  | "UNSUPPORTED_CONTENT_TYPE";

export class ImportEngineError extends Error {
  constructor(
    message: string,
    public readonly code: ImportEngineErrorCode,
  ) {
    super(message);
    this.name = "ImportEngineError";
  }
}
