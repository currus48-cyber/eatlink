"use client";

import { Input } from "@/components/ui/input";
import { DAY_LABELS } from "@/lib/day-labels";
import type { DayOfWeek, OpeningHoursEntry } from "@/lib/import-engine/types";

export function OpeningHoursEditor({
  value,
  onChange,
}: {
  value: OpeningHoursEntry[];
  onChange: (value: OpeningHoursEntry[]) => void;
}) {
  function update(day: DayOfWeek, patch: Partial<OpeningHoursEntry>) {
    onChange(value.map((entry) => (entry.day === day ? { ...entry, ...patch } : entry)));
  }

  return (
    <div className="flex flex-col divide-y divide-border rounded-lg border">
      {value.map((entry) => (
        <div key={entry.day} className="flex flex-wrap items-center gap-3 px-3 py-2 text-sm">
          <span className="w-20 shrink-0 text-muted-foreground">{DAY_LABELS[entry.day]}</span>

          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <input
              type="checkbox"
              className="size-4 accent-foreground"
              checked={entry.closed}
              onChange={(event) => update(entry.day, { closed: event.target.checked })}
            />
            Fermé
          </label>

          {!entry.closed && (
            <div className="flex items-center gap-2">
              <Input
                type="time"
                value={entry.opens ?? ""}
                onChange={(event) => update(entry.day, { opens: event.target.value })}
                className="w-auto"
              />
              <span className="text-muted-foreground">à</span>
              <Input
                type="time"
                value={entry.closes ?? ""}
                onChange={(event) => update(entry.day, { closes: event.target.value })}
                className="w-auto"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
