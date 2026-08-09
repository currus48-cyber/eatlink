import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { PublicRestaurant } from "@/lib/smart-link/restaurant-loader/types";

export function GoogleMapCard({ restaurant }: { restaurant: PublicRestaurant }) {
  const query = [restaurant.address, restaurant.city, restaurant.country]
    .filter(Boolean)
    .join(", ");

  if (!query) {
    return null;
  }

  const embedSrc = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Localisation</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-lg border">
          <iframe
            src={embedSrc}
            title={`Carte de ${query}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-56 w-full"
          />
        </div>
        <a
          href={mapLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-primary hover:underline"
        >
          Ouvrir dans Google Maps
        </a>
      </CardContent>
    </Card>
  );
}
