import type { Metadata } from "next";

import { auth } from "@/auth";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export const metadata: Metadata = {
  title: "Importer votre restaurant | EatLink",
};

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const [session, params] = await Promise.all([auth(), searchParams]);
  const initialUrl = typeof params.url === "string" ? params.url : "";

  return <OnboardingWizard isAuthenticated={!!session?.user} initialUrl={initialUrl} />;
}
