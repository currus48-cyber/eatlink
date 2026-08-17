import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ContactCard } from "@/components/restaurant-public/contact-card";
import { EatLinkFooterNote } from "@/components/restaurant-public/eatlink-footer-note";
import { GoogleMapCard } from "@/components/restaurant-public/google-map-card";
import { OpeningHoursCard } from "@/components/restaurant-public/opening-hours-card";
import { PhotoGallery } from "@/components/restaurant-public/photo-gallery";
import { RestaurantHero } from "@/components/restaurant-public/restaurant-hero";
import { RestaurantIdentityBar } from "@/components/restaurant-public/restaurant-identity-bar";
import { SocialLinksCard } from "@/components/restaurant-public/social-links-card";
import { buildRestaurantMetadata } from "@/lib/smart-link/metadata/metadata-builder";
import { loadRestaurantBySlug } from "@/lib/smart-link/restaurant-loader/restaurant-loader";
import { buildRestaurantStructuredData } from "@/lib/smart-link/seo/structured-data-builder";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await loadRestaurantBySlug(slug);
  if (!restaurant) {
    return {};
  }
  return buildRestaurantMetadata(restaurant);
}

export default async function RestaurantPublicPage({ params }: { params: Params }) {
  const { slug } = await params;
  const restaurant = await loadRestaurantBySlug(slug);

  if (!restaurant) {
    notFound();
  }

  const structuredData = buildRestaurantStructuredData(restaurant);
  const galleryPhotos = restaurant.photos.slice(1);

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <RestaurantIdentityBar
        name={restaurant.name}
        logoUrl={restaurant.logoUrl}
        city={restaurant.city}
        country={restaurant.country}
      />
      <RestaurantHero restaurant={restaurant} />

      <main className="mx-auto flex w-full max-w-3xl flex-col gap-10 px-4 py-12 sm:px-6">
        {galleryPhotos.length > 0 && <PhotoGallery photos={galleryPhotos} />}

        <div className="grid gap-4 sm:grid-cols-2">
          <ContactCard restaurant={restaurant} />
          <OpeningHoursCard openingHours={restaurant.openingHours} />
        </div>

        <GoogleMapCard restaurant={restaurant} />
        <SocialLinksCard restaurant={restaurant} />
      </main>

      <EatLinkFooterNote />
    </div>
  );
}
