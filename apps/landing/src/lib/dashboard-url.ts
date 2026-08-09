const DEFAULT_DASHBOARD_URL = "http://localhost:3000";

function getDashboardUrl(): string {
  return process.env.NEXT_PUBLIC_DASHBOARD_URL ?? DEFAULT_DASHBOARD_URL;
}

export function buildDashboardPath(path: string): string {
  return new URL(path, getDashboardUrl()).toString();
}

/** Builds the /onboarding URL on the dashboard app, prefilling the
 * restaurant URL the visitor already typed so they never have to retype it. */
export function buildOnboardingUrl(prefillUrl?: string): string {
  const url = new URL("/onboarding", getDashboardUrl());
  const trimmed = prefillUrl?.trim();
  if (trimmed) {
    url.searchParams.set("url", trimmed);
  }
  return url.toString();
}
