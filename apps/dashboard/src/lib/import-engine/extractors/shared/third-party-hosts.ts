// Scoped to each provider's apex/marketing host only (not every subdomain):
// booking platforms commonly host restaurant-owned content (logos, photos
// uploaded by the owner through the platform's site builder) on their own
// CDN/UGC subdomains, e.g. ugc.zenchef.com. Blocking the whole domain would
// reject the restaurant's own assets on white-label sites built on top of
// these platforms - only the provider's own brand/marketing host should be
// rejected.
const THIRD_PARTY_BOOKING_HOST_PATTERNS: RegExp[] = [
  /^(www\.)?thefork\.(com|fr|rs|io)$/i,
  /^(www\.)?lafourchette\.com$/i,
  /^(www\.)?opentable\.(com|fr|co\.uk)$/i,
  /^(www\.)?resy\.com$/i,
  /^(www\.)?sevenrooms\.com$/i,
  /^(www\.)?zenchef\.(com|io)$/i,
  /^(www\.)?reservewithgoogle\.com$/i,
  /^(www\.)?bookatable\.(com|co\.uk)$/i,
];

export function isThirdPartyBookingHost(hostname: string): boolean {
  return THIRD_PARTY_BOOKING_HOST_PATTERNS.some((pattern) => pattern.test(hostname));
}

export function isThirdPartyBookingAsset(candidateUrl: string): boolean {
  try {
    return isThirdPartyBookingHost(new URL(candidateUrl).hostname);
  } catch {
    return true;
  }
}
