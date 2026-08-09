import Link from "next/link";

import { buildOnboardingUrl } from "@/lib/dashboard-url";

export function FinalCta() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-2xl bg-zinc-950 px-8 py-14 text-center text-white">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Essayez gratuitement
        </h2>
        <p className="max-w-md text-zinc-300">
          Votre page de réservation, prête en moins d&apos;une minute. Essai gratuit de 30 jours.
        </p>
        <Link
          href={buildOnboardingUrl()}
          className="rounded-full bg-orange-600 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-orange-500"
        >
          Essayer gratuitement
        </Link>
      </div>
    </section>
  );
}
