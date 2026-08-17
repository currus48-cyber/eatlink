import { formatDateFr } from "@/lib/format-date";

// Progressive recap of what's been chosen so far in the booking wizard —
// purely presentational, built from data already selected client-side
// (nothing fetched, nothing sent to the server).
export function ReservationSummaryCard({
  restaurantName,
  date,
  time,
  partySize,
}: {
  restaurantName: string;
  date?: string | null;
  time?: string | null;
  partySize?: number | null;
}) {
  const details = [
    date ? formatDateFr(date) : null,
    time,
    partySize ? `${partySize} personne${partySize > 1 ? "s" : ""}` : null,
  ].filter((value): value is string => Boolean(value));

  if (details.length === 0) {
    return null;
  }

  return (
    <div className="rounded-xl bg-accent px-4 py-3 text-sm">
      <p className="font-heading font-semibold text-accent-foreground">{restaurantName}</p>
      <p className="text-accent-foreground/70">{details.join(" · ")}</p>
    </div>
  );
}
