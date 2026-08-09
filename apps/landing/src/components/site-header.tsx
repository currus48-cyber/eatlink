import Link from "next/link";

import { buildDashboardPath } from "@/lib/dashboard-url";

export function SiteHeader() {
  return (
    <header className="flex items-center justify-between px-6 py-5 sm:px-10">
      <span className="text-lg font-semibold tracking-tight">EatLink</span>
      <Link
        href={buildDashboardPath("/auth/login")}
        className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950"
      >
        Se connecter
      </Link>
    </header>
  );
}
