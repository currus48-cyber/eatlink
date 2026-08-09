export function BeforeAfter() {
  return (
    <section className="px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          Avant / Après
        </h2>
        <div className="mt-12 grid grid-cols-1 items-center gap-6 sm:grid-cols-[1fr_auto_1fr_auto_1fr]">
          <MockBrowser />
          <Arrow />
          <MockSmartLink />
          <Arrow />
          <MockReservations />
        </div>
      </div>
    </section>
  );
}

function MockBrowser() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex gap-1">
        <span className="size-2 rounded-full bg-zinc-300" />
        <span className="size-2 rounded-full bg-zinc-300" />
        <span className="size-2 rounded-full bg-zinc-300" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="h-2.5 w-3/4 rounded bg-zinc-200" />
        <div className="h-2.5 w-full rounded bg-zinc-200" />
        <div className="h-2.5 w-2/3 rounded bg-zinc-200" />
        <div className="mt-2 h-16 rounded bg-zinc-100" />
        <div className="h-2.5 w-1/2 rounded bg-zinc-200" />
      </div>
      <span className="mt-4 block text-center text-xs font-medium text-zinc-500">
        Site classique
      </span>
    </div>
  );
}

function MockSmartLink() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex h-16 items-end rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 p-2">
        <span className="text-xs font-semibold text-white">Le Petit Paris</span>
      </div>
      <div className="mt-2 rounded-full bg-zinc-950 px-3 py-1.5 text-center text-xs font-semibold text-white">
        Réserver une table
      </div>
      <span className="mt-4 block text-center text-xs font-medium text-zinc-500">EatLink</span>
    </div>
  );
}

const MOCK_RESERVATION_ROWS = ["19:00 · 2 pers.", "19:30 · 4 pers.", "20:00 · 2 pers."];

function MockReservations() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-1.5">
        {MOCK_RESERVATION_ROWS.map((row) => (
          <div
            key={row}
            className="flex items-center justify-between rounded-md bg-emerald-50 px-2 py-1.5 text-xs"
          >
            <span className="font-medium text-emerald-900">{row}</span>
            <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-medium text-white">
              Confirmée
            </span>
          </div>
        ))}
      </div>
      <span className="mt-4 block text-center text-xs font-medium text-zinc-500">
        Réservations
      </span>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      className="mx-auto size-6 shrink-0 rotate-90 text-zinc-300 sm:rotate-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m0 0-6-6m6 6-6 6" />
    </svg>
  );
}
