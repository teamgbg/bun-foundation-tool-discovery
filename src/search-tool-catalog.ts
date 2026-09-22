/**
 * @system tool-discovery
 * @status handwritten
 * @edit edit directly
 *
 * Ranks a tool catalog by a free-text query using tokenized term scoring: a
 * term matching a tool's NAME scores higher (the strongest signal) than a match
 * anywhere in the haystack (name + description + category). Returns entries
 * ranked by score, zero-score entries dropped. Generic over the entry type so a
 * consumer carrying extra fields (e.g. the gateway's `server`) keeps them.
 *
 * This is the gateway's `search_mcp_tools` ranking, extracted so the gateway and
 * the chat engine's `search_tools` resolve identically.
 */
import type { ToolCatalogEntry } from "./catalog.ts";

function tokenizeQuery(query: string): string[] {
	return query.toLowerCase().split(/\s+/).filter(Boolean);
}

function scoreEntry(entry: ToolCatalogEntry, terms: string[]): number {
	const name = entry.name.toLowerCase();
	const haystack = `${entry.name} ${entry.description} ${entry.category ?? ""}`.toLowerCase();
	let score = 0;
	for (const term of terms) {
		if (name.includes(term)) score += 3;
		if (haystack.includes(term)) score += 1;
	}
	return score;
}

export function searchToolCatalog<T extends ToolCatalogEntry>(
	catalog: T[],
	query: string,
	limit?: number,
): T[] {
	const terms = tokenizeQuery(query);
	const max = limit ?? catalog.length;
	return catalog
		.map((entry) => ({ entry, score: scoreEntry(entry, terms) }))
		.filter((r) => r.score > 0)
		.sort((a, b) => b.score - a.score)
		.slice(0, max)
		.map((r) => r.entry);
}
