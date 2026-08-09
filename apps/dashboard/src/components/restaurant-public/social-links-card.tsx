import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { PublicRestaurant } from "@/lib/smart-link/restaurant-loader/types";

const SOCIAL_LINKS: { key: "instagramUrl" | "facebookUrl" | "tiktokUrl"; label: string }[] = [
  { key: "instagramUrl", label: "Instagram" },
  { key: "facebookUrl", label: "Facebook" },
  { key: "tiktokUrl", label: "TikTok" },
];

export function SocialLinksCard({ restaurant }: { restaurant: PublicRestaurant }) {
  const links = SOCIAL_LINKS.map(({ key, label }) => ({ label, url: restaurant[key] })).filter(
    (link): link is { label: string; url: string } => Boolean(link.url),
  );

  if (links.length === 0 && !restaurant.menuUrl && !restaurant.websiteUrl) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Liens</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        {links.map((link) => (
          <Button
            key={link.label}
            variant="outline"
            size="sm"
            render={<a href={link.url} target="_blank" rel="noopener noreferrer" />}
          >
            {link.label}
          </Button>
        ))}
        {restaurant.menuUrl && (
          <Button
            variant="outline"
            size="sm"
            render={<a href={restaurant.menuUrl} target="_blank" rel="noopener noreferrer" />}
          >
            Menu
          </Button>
        )}
        {restaurant.websiteUrl && (
          <Button
            variant="outline"
            size="sm"
            render={<a href={restaurant.websiteUrl} target="_blank" rel="noopener noreferrer" />}
          >
            Site web
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
