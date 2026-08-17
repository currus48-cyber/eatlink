// Builds a minimal .ics file from data the client already has (a confirmed
// reservation). Purely presentational — no backend call, no new data model.

export function buildIcsContent(input: {
  restaurantName: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
}): string {
  const start = `${input.date.replaceAll("-", "")}T${input.startTime.replace(":", "")}00`;
  const end = `${input.date.replaceAll("-", "")}T${input.endTime.replace(":", "")}00`;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//EatLink//Reservation//FR",
    "BEGIN:VEVENT",
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${escapeIcsText(`Réservation chez ${input.restaurantName}`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function escapeIcsText(value: string): string {
  return value.replaceAll("\\", "\\\\").replaceAll(",", "\\,").replaceAll(";", "\\;");
}
