export type BookingErrorCode =
  | "SLOT_UNAVAILABLE"
  | "PARTY_TOO_LARGE"
  | "RESOURCE_NOT_FOUND"
  | "INVALID_TRANSITION"
  | "NOT_FOUND";

export class BookingError extends Error {
  constructor(
    message: string,
    public readonly code: BookingErrorCode,
  ) {
    super(message);
    this.name = "BookingError";
  }
}
