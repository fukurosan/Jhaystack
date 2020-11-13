import SearchResult from "../Model/SearchResult"

/**
 * Sorts search results by their relevance.
 * Use the ASCENDING or DESCENDING property to set the direction.
 */
export const RELEVANCE = {
	DESCENDING: (a: SearchResult, b: SearchResult): number => {
		if (a.relevance < b.relevance) return 1
		if (a.relevance > b.relevance) return -1
		return 0
	},
	ASCENDING: (a: SearchResult, b: SearchResult): number => {
		if (a.relevance < b.relevance) return -1
		if (a.relevance > b.relevance) return 1
		return 0
	}
}
