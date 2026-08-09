import { emptyField, field, type ConfidenceField, type Extractor, type ExtractionContext } from "../types";

export interface SocialLinks {
  instagram: string | null;
  facebook: string | null;
  tiktok: string | null;
}

const SOCIAL_PATTERNS: Record<keyof SocialLinks, RegExp> = {
  instagram: /instagram\.com/i,
  facebook: /facebook\.com/i,
  tiktok: /tiktok\.com/i,
};

export const socialLinksExtractor: Extractor<SocialLinks> = {
  extract({ $ }: ExtractionContext): ConfidenceField<SocialLinks> {
    const links: SocialLinks = { instagram: null, facebook: null, tiktok: null };

    $("a[href]").each((_, element) => {
      const href = $(element).attr("href");
      if (!href) return;

      for (const key of Object.keys(SOCIAL_PATTERNS) as (keyof SocialLinks)[]) {
        if (!links[key] && SOCIAL_PATTERNS[key].test(href)) {
          links[key] = href;
        }
      }
    });

    const foundCount = Object.values(links).filter(Boolean).length;
    if (foundCount === 0) {
      return emptyField();
    }

    return field(links, 0.9, "html-heuristic");
  },
};
