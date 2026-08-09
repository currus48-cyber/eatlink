const MAX_SLUG_LENGTH = 80;
// Matches combining diacritical marks (U+0300-U+036F) left behind after
// NFD-normalizing accented characters, e.g. "é" -> "e" + U+0301.
const COMBINING_DIACRITICS = /[̀-ͯ]/g;

export function slugify(text: string): string {
  return text
    .normalize("NFD")
    .replace(COMBINING_DIACRITICS, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX_SLUG_LENGTH)
    .replace(/-+$/g, "");
}
