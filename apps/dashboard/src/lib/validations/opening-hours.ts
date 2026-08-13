import { z } from "zod";

import { ALL_DAYS, type DayOfWeek } from "@/lib/import-engine/types";

export const openingHoursSchema = z.array(
  z.object({
    day: z.enum(ALL_DAYS as unknown as [DayOfWeek, ...DayOfWeek[]]),
    opens: z.string().nullable(),
    closes: z.string().nullable(),
    closed: z.boolean(),
  }),
);
