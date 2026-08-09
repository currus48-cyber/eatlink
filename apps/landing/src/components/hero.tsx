"use client";

import { useState, type FormEvent } from "react";

import { buildOnboardingUrl } from "@/lib/dashboard-url";

export function Hero() {
  const [url, setUrl] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    window.location.href = buildOnboardingUrl(url);
  }

  return (
    <section className="px-6 py-20 sm:px-10 sm:py-28">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Recevez plus de réservations.
          <br />
          Sans changer votre site internet.
        </h1>
        <p className="max-w-xl text-lg text-balance text-zinc-600">
          Collez simplement l&apos;adresse de votre restaurant. EatLink crée automatiquement
          votre nouvelle page de réservation.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-2 flex w-full max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="hero-url" className="sr-only">
            URL de votre site
          </label>
          <input
            id="hero-url"
            type="text"
            inputMode="url"
            placeholder="https://monrestaurant.fr"
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            className="h-12 flex-1 rounded-full border border-zinc-300 px-5 text-base outline-none transition-colors focus:border-zinc-950"
          />
          <button
            type="submit"
            className="h-12 shrink-0 rounded-full bg-orange-600 px-6 text-base font-semibold text-white transition-colors hover:bg-orange-500"
          >
            Créer ma page gratuitement
          </button>
        </form>
        <p className="text-xs text-zinc-500">
          Aucune carte bancaire requise. Aucune installation.
        </p>
      </div>
    </section>
  );
}
