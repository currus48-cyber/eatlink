import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DAY_LABELS } from "@/lib/day-labels";
import type { OpeningHoursEntry } from "@/lib/import-engine/types";

export function OpeningHoursCard({
  openingHours,
}: {
  openingHours: OpeningHoursEntry[] | null;
}) {
  if (!openingHours) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Horaires</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1 text-sm">
        {openingHours.map((entry) => (
          <div key={entry.day} className="flex justify-between">
            <span className="text-muted-foreground">{DAY_LABELS[entry.day]}</span>
            <span>{entry.closed ? "Fermé" : `${entry.opens} - ${entry.closes}`}</span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
