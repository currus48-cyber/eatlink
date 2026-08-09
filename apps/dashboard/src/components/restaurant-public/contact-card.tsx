import { MapPin, Phone } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicRestaurant } from "@/lib/smart-link/restaurant-loader/types";

export function ContactCard({ restaurant }: { restaurant: PublicRestaurant }) {
  const address = [restaurant.address, restaurant.city, restaurant.country]
    .filter(Boolean)
    .join(", ");

  if (!restaurant.phone && !address) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Contact</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm">
        {restaurant.phone && (
          <a
            href={`tel:${restaurant.phone}`}
            className="flex items-center gap-2 hover:underline"
          >
            <Phone className="size-4 shrink-0 text-muted-foreground" />
            {restaurant.phone}
          </a>
        )}
        {address && (
          <div className="flex items-start gap-2">
            <MapPin className="size-4 shrink-0 text-muted-foreground" />
            <span>{address}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
