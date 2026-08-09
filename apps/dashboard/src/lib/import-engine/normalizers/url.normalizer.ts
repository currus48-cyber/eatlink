export function resolveUrl(candidate: string, baseUrl: string): string | null {
  const trimmed = candidate.trim();
  if (!trimmed) {
    return null;
  }

  try {
    const resolved = new URL(trimmed, baseUrl);
    if (resolved.protocol !== "http:" && resolved.protocol !== "https:") {
      return null;
    }
    return resolved.toString();
  } catch {
    return null;
  }
}
