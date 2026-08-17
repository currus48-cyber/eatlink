export function RestaurantIdentityBar({
  name,
  logoUrl,
  city,
  country,
}: {
  name: string;
  logoUrl?: string | null;
  city?: string | null;
  country?: string | null;
}) {
  const location = [city, country].filter(Boolean).join(", ");

  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur sm:px-6">
      {logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary owner-provided domain, can't be pre-declared in next.config remotePatterns
        <img
          src={logoUrl}
          alt=""
          className="size-9 shrink-0 rounded-full border border-border object-cover ring-2 ring-accent"
        />
      )}
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="truncate font-heading text-[15px] font-semibold tracking-tight">
          {name}
        </span>
        {location && (
          <span className="truncate text-xs text-muted-foreground">{location}</span>
        )}
      </div>
    </div>
  );
}
