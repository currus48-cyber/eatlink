const FEATURES = [
  {
    title: "Import automatique",
    description: "Toutes les informations de votre restaurant récupérées en un clic.",
  },
  {
    title: "Smart Link",
    description: "Une URL unique et professionnelle pour votre restaurant.",
  },
  {
    title: "Réservation",
    description: "Un moteur de réservation intégré, prêt à l'emploi.",
  },
  {
    title: "Dashboard",
    description: "Toutes vos réservations, claires et centralisées.",
  },
  {
    title: "Aucune installation",
    description: "Rien à télécharger, rien à configurer.",
  },
];

export function Features() {
  return (
    <section className="bg-zinc-50 px-6 py-20 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
          Fonctionnalités
        </h2>
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="rounded-xl border border-zinc-200 bg-white p-5">
              <h3 className="font-semibold">{feature.title}</h3>
              <p className="mt-1.5 text-sm text-zinc-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
