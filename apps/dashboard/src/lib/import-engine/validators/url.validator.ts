import { ImportEngineError } from "../types";

// The user pastes an arbitrary public URL and our server fetches it — without
// this guard that fetch is a textbook SSRF vector (e.g. pasting a link that
// resolves to 169.254.169.254 to reach a cloud metadata endpoint, or to
// localhost to probe internal services).
const BLOCKED_HOSTNAMES = new Set(["localhost", "0.0.0.0", "::1"]);

export function assertSafeUrl(rawUrl: string): URL {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new ImportEngineError("URL invalide.", "INVALID_URL");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new ImportEngineError(
      "Seules les URLs http et https sont acceptées.",
      "INVALID_URL",
    );
  }

  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");

  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith(".local")) {
    throw new ImportEngineError("Cette adresse n'est pas autorisée.", "BLOCKED_HOST");
  }

  if (isPrivateOrReservedIp(hostname)) {
    throw new ImportEngineError("Cette adresse n'est pas autorisée.", "BLOCKED_HOST");
  }

  return url;
}

function isPrivateOrReservedIp(hostname: string): boolean {
  const ipv4 = hostname.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) {
    const a = Number(ipv4[1]);
    const b = Number(ipv4[2]);
    return (
      a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168)
    );
  }

  if (hostname.includes(":")) {
    // Conservative IPv6 block: loopback, link-local, and unique-local ranges.
    return (
      hostname === "::1" ||
      hostname.startsWith("fe80:") ||
      hostname.startsWith("fc") ||
      hostname.startsWith("fd")
    );
  }

  return false;
}
