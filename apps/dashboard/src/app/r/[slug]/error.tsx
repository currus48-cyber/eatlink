"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Next.js error boundary for this route segment (and /r/[slug]/reserve,
// which has no boundary of its own). Catches exceptions that reach here
// unhandled - e.g. a database failure in loadRestaurantBySlug - so a public
// Smart Link page never shows Next's raw, unbranded crash screen. This does
// not change what counts as "not found" (still a clean 404 via notFound());
// it only replaces the fallback for genuine, unexpected failures.
export default function RestaurantPageError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[smart-link] /r/[slug] failed to render", error);
  }, [error]);

  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Page temporairement indisponible</CardTitle>
          <CardDescription>
            Une erreur est survenue de notre côté. Merci de réessayer dans quelques instants.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={reset}>Réessayer</Button>
        </CardContent>
      </Card>
    </div>
  );
}
