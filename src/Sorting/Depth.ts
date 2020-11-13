import SearchResult from "../Model/SearchResult"

/**
 * Sorts search results by their depth.
 * Use the ASCENDING or DESCENDING property to set the direction.
 */
export const DEPTH = {
	DESCENDING: (a: SearchResult, b: SearchResult): number => {
		if (a.path.length < b.path.length) return 1
		if (a.path.length > b.path.length) return -1
		return 0
	},
	ASCENDING: (a: SearchResult, b: SearchResult): number => {
		if (a.path.length < b.path.length) return -1
		if (a.path.length > b.path.length) return 1
		return 0
	}
}
