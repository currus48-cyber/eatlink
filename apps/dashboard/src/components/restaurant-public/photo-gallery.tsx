export function PhotoGallery({ photos }: { photos: string[] }) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {photos.map((url) => (
        // eslint-disable-next-line @next/next/no-img-element -- arbitrary owner-provided domain, can't be pre-declared in next.config remotePatterns
        <img
          key={url}
          src={url}
          alt=""
          className="aspect-square w-full rounded-lg border object-cover"
        />
      ))}
    </div>
  );
}
