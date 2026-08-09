"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { EditableRestaurantFields } from "@/lib/onboarding/editable-fields";
import { getSiteUrl } from "@/lib/smart-link/metadata/site-url";
import { slugify } from "@/lib/smart-link/slug/slugify";

export function PreviewStep({
  values,
  onNext,
  onBack,
}: {
  values: EditableRestaurantFields;
  onNext: () => void;
  onBack: () => void;
}) {
  const provisionalSlug = slugify(values.name) || "votre-restaurant";
  const host = getSiteUrl().replace(/^https?:\/\//, "");
  const coverPhoto = values.photos[0];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Votre page EatLink est prête</CardTitle>
        <CardDescription>Voici ce que vos clients verront.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-lg border">
          <div className="relative flex min-h-32 items-end bg-muted p-4">
            {coverPhoto && (
              // eslint-disable-next-line @next/next/no-img-element -- arbitrary owner-provided domain
              <img
                src={coverPhoto}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <span className="relative z-10 text-lg font-semibold text-white">
              {values.name || "Votre restaurant"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 rounded-lg border bg-muted/40 px-3 py-2">
          <span className="truncate font-mono text-sm">
            {host}/r/{provisionalSlug}
          </span>
          <span className="shrink-0 rounded-full bg-foreground px-2 py-0.5 text-xs font-medium text-background">
            Smart Link
          </span>
        </div>

        <Button size="lg" className="w-full" disabled>
          Réserver une table
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Créez votre compte à l&apos;étape suivante pour publier votre page et activer les
          réservations.
        </p>
      </CardContent>
      <CardFooter className="flex justify-between gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Modifier
        </Button>
        <Button type="button" onClick={onNext}>
          Continuer
        </Button>
      </CardFooter>
    </Card>
  );
}
