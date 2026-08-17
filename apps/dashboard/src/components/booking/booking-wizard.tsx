"use client";

import { useState, useTransition } from "react";

import { WizardProgress, type WizardStepConfig } from "@/components/forms/wizard-progress";
import { createReservationAction, type CreatedReservationSummary } from "@/lib/booking/actions/create-reservation.action";
import { getAvailableSlotsAction } from "@/lib/booking/actions/get-available-slots.action";
import { todayDateOnly } from "@/lib/booking/domain/time";
import type { ReservationInput } from "@/lib/booking/types";

import { ReservationSummaryCard } from "./reservation-summary-card";
import { ConfirmationStep } from "./steps/confirmation-step";
import { DateStep } from "./steps/date-step";
import { DetailsStep } from "./steps/details-step";
import { PartySizeStep } from "./steps/party-size-step";
import { SlotStep } from "./steps/slot-step";
import { EMPTY_CONTACT_DETAILS, type BookingWizardStep, type ContactDetails } from "./wizard-step";

const STEPS: WizardStepConfig[] = [
  { key: "date", label: "Date" },
  { key: "party-size", label: "Personnes" },
  { key: "slot", label: "Créneau" },
  { key: "details", label: "Coordonnées" },
  { key: "confirmation", label: "Confirmation" },
];

export interface BookingWizardRestaurant {
  slug: string;
  name: string;
  logoUrl: string | null;
}

export function BookingWizard({
  resourceId,
  restaurant,
}: {
  resourceId: string;
  restaurant: BookingWizardRestaurant;
}) {
  const today = todayDateOnly();
  const [step, setStep] = useState<BookingWizardStep>("date");
  const [date, setDate] = useState(today);
  const [partySize, setPartySize] = useState(2);
  const [slots, setSlots] = useState<string[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [slotError, setSlotError] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [details, setDetails] = useState<ContactDetails>(EMPTY_CONTACT_DETAILS);

  const [isSubmitting, startSubmitting] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ReservationInput, string[]>>>();
  const [confirmed, setConfirmed] = useState<CreatedReservationSummary | null>(null);

  async function handlePartySizeNext() {
    setStep("slot");
    setIsLoadingSlots(true);
    setSlotError(null);

    const result = await getAvailableSlotsAction({ resourceId, date, partySize });

    setIsLoadingSlots(false);

    if (result.status === "error") {
      setSlotError(result.message ?? "Une erreur est survenue.");
      return;
    }

    if (result.slots.length === 0 && result.maxPartySize !== undefined && partySize > result.maxPartySize) {
      setSlotError(`Ce nombre de personnes dépasse la capacité maximale (${result.maxPartySize}).`);
    }

    setSlots(result.slots);
  }

  function handleSlotSelect(slot: string) {
    setSelectedSlot(slot);
    setStep("details");
  }

  function handleConfirm() {
    if (!selectedSlot) return;

    setSubmitError(null);
    setFieldErrors(undefined);

    startSubmitting(async () => {
      const result = await createReservationAction({
        resourceId,
        date,
        startTime: selectedSlot,
        partySize,
        customerName: details.customerName,
        customerPhone: details.customerPhone,
        customerEmail: details.customerEmail,
        comment: details.comment,
      });

      if (result.status === "success" && result.reservation) {
        setConfirmed(result.reservation);
        return;
      }

      if (result.fieldErrors && Object.keys(result.fieldErrors).length > 0) {
        // A field-level error (e.g. malformed phone) can only be fixed on
        // the details screen, so send the user back there to see it.
        setFieldErrors(result.fieldErrors);
        setStep("details");
        return;
      }

      setSubmitError(result.message ?? "Une erreur est survenue.");
    });
  }

  return (
    <div className="flex w-full flex-col gap-4">
      <WizardProgress steps={STEPS} currentKey={step} />

      {step !== "date" && step !== "confirmation" && (
        <ReservationSummaryCard
          restaurantName={restaurant.name}
          date={date}
          time={step === "details" ? selectedSlot : null}
          partySize={step !== "party-size" ? partySize : null}
        />
      )}

      {step === "date" && (
        <DateStep
          value={date}
          minDate={today}
          onChange={setDate}
          onNext={() => setStep("party-size")}
        />
      )}

      {step === "party-size" && (
        <PartySizeStep
          value={partySize}
          onChange={setPartySize}
          onNext={handlePartySizeNext}
          onBack={() => setStep("date")}
        />
      )}

      {step === "slot" && (
        <SlotStep
          slots={slots}
          isLoading={isLoadingSlots}
          error={slotError}
          onSelect={handleSlotSelect}
          onBack={() => setStep("party-size")}
          onBackToDate={() => setStep("date")}
        />
      )}

      {step === "details" && (
        <DetailsStep
          values={details}
          fieldErrors={fieldErrors}
          onChange={setDetails}
          onNext={() => setStep("confirmation")}
          onBack={() => setStep("slot")}
        />
      )}

      {step === "confirmation" && selectedSlot && (
        <ConfirmationStep
          restaurant={restaurant}
          date={date}
          time={selectedSlot}
          partySize={partySize}
          details={details}
          isSubmitting={isSubmitting}
          error={submitError}
          confirmed={confirmed}
          onEdit={() => setStep("details")}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
