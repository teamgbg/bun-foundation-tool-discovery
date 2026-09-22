/**
 * @system tool-discovery
 * @status handwritten
 * @edit edit directly
 *
 * Word-level intent matching: splits free text (typically the user's message)
 * into words and returns the catalog entry names whose name/category/description
 * contain any significant word (>= minWordLength chars). This is the chat
 * engine's pre-step intent pre-activation — the model's likely-needed tools are
 * activated before it has to call `search_tools`, saving a round-trip.
 */
import type { ToolCatalogEntry } from "./catalog.ts";

export function matchByIntent(
	catalog: ToolCatalogEntry[],
	text: string,
	minWordLength = 3,
): string[] {
	if (!text) return [];
	const words = text.toLowerCase().split(/\s+/);
	const matched: string[] = [];
	for (const entry of catalog) {
		const name = entry.name.toLowerCase();
		const category = (entry.category ?? "").toLowerCase();
		const description = entry.description.toLowerCase();
		const hit = words.some(
			(w) =>
				w.length >= minWordLength &&
				(name.includes(w) || category.includes(w) || description.includes(w)),
		);
		if (hit) matched.push(entry.name);
	}
	return matched;
}
