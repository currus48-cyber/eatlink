import type { CheerioAPI } from "cheerio";

import type { JsonLdNode } from "../../types";

export function extractJsonLdNodes($: CheerioAPI): JsonLdNode[] {
  const nodes: JsonLdNode[] = [];

  $('script[type="application/ld+json"]').each((_, element) => {
    const raw = $(element).text();
    if (!raw.trim()) {
      return;
    }

    try {
      nodes.push(...flattenJsonLd(JSON.parse(raw)));
    } catch {
      // Malformed JSON-LD on the target site is common and non-fatal.
    }
  });

  return nodes;
}

function flattenJsonLd(value: unknown): JsonLdNode[] {
  if (Array.isArray(value)) {
    return value.flatMap(flattenJsonLd);
  }

  if (value && typeof value === "object") {
    const node = value as JsonLdNode;
    const graph = node["@graph"];
    if (Array.isArray(graph)) {
      return graph.flatMap(flattenJsonLd);
    }
    return [node];
  }

  return [];
}

const RESTAURANT_TYPES = new Set([
  "restaurant",
  "foodestablishment",
  "cafeorcoffeeshop",
  "bar",
  "bakery",
  "localbusiness",
  "organization",
]);

export function findRestaurantNode(nodes: JsonLdNode[]): JsonLdNode | null {
  return nodes.find((node) => matchesType(node, RESTAURANT_TYPES)) ?? nodes[0] ?? null;
}

function matchesType(node: JsonLdNode, types: Set<string>): boolean {
  const type = node["@type"];
  const values = Array.isArray(type) ? type : [type];
  return values.some((value) => typeof value === "string" && types.has(value.toLowerCase()));
}
