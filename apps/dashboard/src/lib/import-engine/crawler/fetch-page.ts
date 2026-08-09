import "server-only";

import { ImportEngineError } from "../types";
import { assertSafeUrl } from "../validators/url.validator";

const FETCH_TIMEOUT_MS = 8000;
const MAX_HTML_BYTES = 3 * 1024 * 1024;
const USER_AGENT = "EatLinkImportBot/1.0 (+https://eatlink.app)";

export interface CrawledPage {
  url: string;
  html: string;
}

export async function fetchPage(url: string): Promise<CrawledPage> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "text/html,application/xhtml+xml",
      },
    });

    if (!response.ok) {
      throw new ImportEngineError(
        `Le site a répondu avec le statut ${response.status}.`,
        "FETCH_FAILED",
      );
    }

    // Re-validate after redirects: the initial URL can be safe while a
    // redirect chain lands on a blocked host.
    assertSafeUrl(response.url);

    const contentType = response.headers.get("content-type") ?? "";
    if (
      !contentType.includes("text/html") &&
      !contentType.includes("application/xhtml+xml")
    ) {
      throw new ImportEngineError(
        "Le contenu de la page n'est pas du HTML.",
        "UNSUPPORTED_CONTENT_TYPE",
      );
    }

    const html = await readBodyWithLimit(response, MAX_HTML_BYTES);

    return { url: response.url, html };
  } catch (error) {
    if (error instanceof ImportEngineError) {
      throw error;
    }
    if (error instanceof Error && error.name === "AbortError") {
      throw new ImportEngineError(
        "Le site met trop de temps à répondre.",
        "TIMEOUT",
      );
    }
    throw new ImportEngineError("Impossible de récupérer le site.", "FETCH_FAILED");
  } finally {
    clearTimeout(timeout);
  }
}

async function readBodyWithLimit(
  response: Response,
  maxBytes: number,
): Promise<string> {
  const reader = response.body?.getReader();
  if (!reader) {
    return response.text();
  }

  const chunks: Uint8Array[] = [];
  let received = 0;

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;

    received += value.byteLength;
    if (received > maxBytes) {
      await reader.cancel();
      throw new ImportEngineError("La page est trop volumineuse.", "PAYLOAD_TOO_LARGE");
    }
    chunks.push(value);
  }

  return Buffer.concat(chunks.map((chunk) => Buffer.from(chunk))).toString("utf-8");
}
