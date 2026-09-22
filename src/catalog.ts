/**
 * @system tool-discovery
 * @status handwritten
 * @edit edit directly
 *
 * The shared catalog-entry contract for tool discovery — the minimal shape a
 * tool contributes to a searchable index: name + description, with an optional
 * category. Both the MCP gateway's server-pool index and the chat engine's
 * per-agent tool catalog conform to it, so the search/match primitives in this
 * package serve both consumers without coupling to either's runtime layer.
 */
export interface ToolCatalogEntry {
	name: string;
	description: string;
	category?: string;
}
