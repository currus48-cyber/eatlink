export function normalizePhone(raw: string): string | null {
  const cleaned = raw.trim().replace(/[^\d+]/g, "");
  const digitCount = cleaned.replace(/\D/g, "").length;

  if (digitCount < 6 || digitCount > 15) {
    return null;
  }

  return cleaned;
}
