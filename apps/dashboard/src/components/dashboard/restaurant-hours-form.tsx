"use client";

import { useState, useTransition } from "react";

import { updateOpeningHoursAction } from "@/actions/dashboard/update-opening-hours";
import { OpeningHoursEditor } from "@/components/onboarding/opening-hours-editor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OpeningHoursEntry } from "@/lib/import-engine/types";

export function RestaurantHoursForm({
  restaurantName,
  initialOpeningHours,
}: {
  restaurantName: string;
  initialOpeningHours: OpeningHoursEntry[];
}) {
  const [openingHours, setOpeningHours] = useState(initialOpeningHours);
  const [isSaving, startSaving] = useTransition();
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function handleSave() {
    setFeedback(null);
    startSaving(async () => {
      const result = await updateOpeningHoursAction(openingHours);
      if (result.status === "success") {
        setFeedback({ type: "success", text: "Horaires enregistrés ✓" });
      } else {
        setFeedback({ type: "error", text: result.message });
      }
    });
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{restaurantName}</CardTitle>
        <CardDescription>
          Ces horaires déterminent les disponibilités proposées à vos clients, ainsi que ce qui
          s&apos;affiche sur votre page publique.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <OpeningHoursEditor value={openingHours} onChange={setOpeningHours} />
        {feedback && (
          <p
            className={
              feedback.type === "success"
                ? "text-sm font-medium text-success"
                : "text-sm text-destructive"
            }
          >
            {feedback.text}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Enregistrement..." : "Enregistrer les horaires"}
        </Button>
      </CardFooter>
    </Card>
  );
}
