import { z } from "zod";

import { emailSchema, passwordSchema } from "@/lib/validations/auth";

export const onboardingAccountSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type OnboardingAccountInput = z.infer<typeof onboardingAccountSchema>;
