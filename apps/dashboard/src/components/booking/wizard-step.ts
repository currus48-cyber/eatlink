export type BookingWizardStep = "date" | "party-size" | "slot" | "details" | "confirmation";

export interface ContactDetails {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  comment: string;
}

export const EMPTY_CONTACT_DETAILS: ContactDetails = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  comment: "",
};
