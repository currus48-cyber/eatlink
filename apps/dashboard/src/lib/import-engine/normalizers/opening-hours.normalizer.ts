import { ALL_DAYS, type DayOfWeek, type OpeningHoursEntry } from "../types";

export interface JsonLdOpeningHoursSpec {
  dayOfWeek?: string | string[];
  opens?: string;
  closes?: string;
}

const DAY_ABBREVIATIONS: Record<string, DayOfWeek> = {
  mo: "MONDAY",
  tu: "TUESDAY",
  we: "WEDNESDAY",
  th: "THURSDAY",
  fr: "FRIDAY",
  sa: "SATURDAY",
  su: "SUNDAY",
};

export function parseOpeningHoursSpecification(
  specs: JsonLdOpeningHoursSpec[],
): OpeningHoursEntry[] {
  const byDay = new Map<DayOfWeek, OpeningHoursEntry>();

  for (const spec of specs) {
    if (!spec.opens || !spec.closes) {
      continue;
    }
    for (const day of toDayList(spec.dayOfWeek)) {
      byDay.set(day, { day, opens: spec.opens, closes: spec.closes, closed: false });
    }
  }

  return fillWeek(byDay);
}

export function parseCompactOpeningHours(compact: string): OpeningHoursEntry[] {
  const byDay = new Map<DayOfWeek, OpeningHoursEntry>();
  const groups = compact
    .split(/[;,]\s*(?=[A-Za-z])/)
    .map((group) => group.trim())
    .filter(Boolean);

  for (const group of groups) {
    const match = group.match(/^([A-Za-z-]+)\s+(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})/);
    if (!match) {
      continue;
    }
    const [, dayToken, opens, closes] = match;
    for (const day of expandDayToken(dayToken)) {
      byDay.set(day, { day, opens: padTime(opens), closes: padTime(closes), closed: false });
    }
  }

  return fillWeek(byDay);
}

function fillWeek(byDay: Map<DayOfWeek, OpeningHoursEntry>): OpeningHoursEntry[] {
  return ALL_DAYS.map(
    (day) => byDay.get(day) ?? { day, opens: null, closes: null, closed: true },
  );
}

function toDayList(dayOfWeek: string | string[] | undefined): DayOfWeek[] {
  if (!dayOfWeek) {
    return [];
  }
  const values = Array.isArray(dayOfWeek) ? dayOfWeek : [dayOfWeek];
  return values
    .map((value) => value.split("/").pop()?.toUpperCase())
    .filter((value): value is DayOfWeek =>
      (ALL_DAYS as readonly string[]).includes(value ?? ""),
    );
}

function expandDayToken(token: string): DayOfWeek[] {
  const result = new Set<DayOfWeek>();

  for (const part of token.split(",").map((p) => p.trim()).filter(Boolean)) {
    if (part.includes("-")) {
      const [startAbbr, endAbbr] = part.split("-");
      const start = DAY_ABBREVIATIONS[startAbbr.toLowerCase().slice(0, 2)];
      const end = DAY_ABBREVIATIONS[endAbbr.toLowerCase().slice(0, 2)];
      if (!start || !end) continue;

      const startIdx = ALL_DAYS.indexOf(start);
      const endIdx = ALL_DAYS.indexOf(end);
      if (startIdx <= endIdx) {
        for (let i = startIdx; i <= endIdx; i++) result.add(ALL_DAYS[i]);
      } else {
        for (let i = startIdx; i < ALL_DAYS.length; i++) result.add(ALL_DAYS[i]);
        for (let i = 0; i <= endIdx; i++) result.add(ALL_DAYS[i]);
      }
    } else {
      const day = DAY_ABBREVIATIONS[part.toLowerCase().slice(0, 2)];
      if (day) result.add(day);
    }
  }

  return [...result];
}

function padTime(time: string): string {
  const [hours, minutes] = time.split(":");
  return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
}
