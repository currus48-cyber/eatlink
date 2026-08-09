const STEPS = [
  {
    number: "1",
    title: "Collez votre site",
    description: "L'adresse de votre restaurant, rien de plus.",
  },
  {
    number: "2",
    title: "EatLink importe automatiquement",
    description: "Nom, photos, horaires, contact, réseaux sociaux.",
  },
  {
    number: "3",
    title: "Votre page est prête",
    description: "Une page de réservation moderne, en quelques secondes.",
  },
  {
    number: "4",
    title: "Recevez des réservations",
    description: "Vos clients réservent directement, sans appel.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-zinc-50 px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          Comment ça marche
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-4">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="flex flex-col items-center gap-3 text-center sm:items-start sm:text-left"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-950 text-base font-semibold text-white">
                {step.number}
              </span>
              <h3 className="font-semibold">{step.title}</h3>
              <p className="text-sm text-zinc-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
