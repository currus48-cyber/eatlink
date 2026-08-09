"use client";

export function PhotosEditor({
  value,
  onChange,
}: {
  value: string[];
  onChange: (value: string[]) => void;
}) {
  if (value.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucune photo détectée.</p>;
  }

  function remove(url: string) {
    onChange(value.filter((photo) => photo !== url));
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {value.map((url) => (
        <div
          key={url}
          className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary third-party domains from the imported site; can't be pre-declared in next.config remotePatterns */}
          <img src={url} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => remove(url)}
            className="absolute top-1 right-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100"
            aria-label="Retirer cette photo"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
