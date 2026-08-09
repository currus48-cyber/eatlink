export function normalizeText(raw: string, maxLength = 200): string | null {
  const cleaned = raw.replace(/\s+/g, " ").trim();
  if (!cleaned) {
    return null;
  }
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength).trim() : cleaned;
}
