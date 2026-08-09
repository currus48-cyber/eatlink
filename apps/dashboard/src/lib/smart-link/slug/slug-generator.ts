import { slugify } from "./slugify";

export interface SlugAvailabilityChecker {
  isSlugTaken(slug: string): Promise<boolean>;
}

const FALLBACK_BASE = "restaurant";

export async function generateUniqueSlug(
  name: string,
  checker: SlugAvailabilityChecker,
): Promise<string> {
  const base = slugify(name) || FALLBACK_BASE;
  let candidate = base;
  let attempt = 1;

  while (await checker.isSlugTaken(candidate)) {
    attempt += 1;
    candidate = `${base}-${attempt}`;
  }

  return candidate;
}
