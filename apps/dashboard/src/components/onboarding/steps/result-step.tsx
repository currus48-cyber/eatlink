"use client";

import { ConfidenceBadge } from "@/components/onboarding/confidence-badge";
import { OpeningHoursEditor } from "@/components/onboarding/opening-hours-editor";
import { PhotosEditor } from "@/components/onboarding/photos-editor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EditableRestaurantFields } from "@/lib/onboarding/editable-fields";
import type { RestaurantImportData } from "@/lib/import-engine/types";

type StringFieldKey = Exclude<keyof EditableRestaurantFields, "openingHours" | "photos">;

const TEXT_FIELDS: { key: StringFieldKey; label: string }[] = [
  { key: "name", label: "Nom" },
  { key: "logoUrl", label: "Logo (URL)" },
  { key: "phone", label: "Téléphone" },
  { key: "email", label: "Email" },
  { key: "address", label: "Adresse" },
  { key: "city", label: "Ville" },
  { key: "country", label: "Pays" },
  { key: "instagramUrl", label: "Instagram" },
  { key: "facebookUrl", label: "Facebook" },
  { key: "tiktokUrl", label: "TikTok" },
  { key: "websiteUrl", label: "Site" },
  { key: "menuUrl", label: "Lien Menu" },
  { key: "reservationUrl", label: "Lien Réservation" },
  { key: "reservationProvider", label: "Plateforme de réservation" },
];

export function ResultStep({
  values,
  confidence,
  onChange,
  onNext,
  onBack,
}: {
  values: EditableRestaurantFields;
  confidence: RestaurantImportData;
  onChange: (values: EditableRestaurantFields) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  function updateField(key: StringFieldKey, value: string) {
    onChange({ ...values, [key]: value });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vérifiez les informations détectées</CardTitle>
        <CardDescription>
          Corrigez si besoin les champs détectés automatiquement avant de continuer.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {TEXT_FIELDS.map(({ key, label }) => (
            <div key={key} className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor={key}>{label}</Label>
                <ConfidenceBadge confidence={confidence[key].confidence} />
              </div>
              <Input
                id={key}
                value={values[key]}
                onChange={(event) => updateField(key, event.target.value)}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label>Vérifiez vos horaires</Label>
            {confidence.openingHours.confidence > 0 ? (
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                Détectés automatiquement
              </span>
            ) : (
              <span className="text-xs font-medium text-amber-600 dark:text-amber-400">
                Horaires standards proposés
              </span>
            )}
          </div>
          <OpeningHoursEditor
            value={values.openingHours}
            onChange={(value) => onChange({ ...values, openingHours: value })}
            notice={
              confidence.openingHours.confidence > 0
                ? undefined
                : "Nous n'avons pas pu détecter vos horaires : voici une proposition par défaut. Vérifiez-les et ajustez-les avant de continuer."
            }
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <Label>Photos</Label>
            <ConfidenceBadge confidence={confidence.photos.confidence} />
          </div>
          <PhotosEditor
            value={values.photos}
            onChange={(value) => onChange({ ...values, photos: value })}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Recommencer
        </Button>
        <Button type="button" onClick={onNext}>
          Continuer
        </Button>
      </CardFooter>
    </Card>
  );
}
