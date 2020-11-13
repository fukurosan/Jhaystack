import SearchResult from "../Model/SearchResult"

/**
 * Sorts search results by their value.
 * Use the ASCENDING or DESCENDING property to set the direction.
 */
export const VALUE = {
	DESCENDING: (a: SearchResult, b: SearchResult): number => {
		if (a.value < b.value) return 1
		if (a.value > b.value) return -1
		return 0
	},
	ASCENDING: (a: SearchResult, b: SearchResult): number => {
		if (a.value < b.value) return -1
		if (a.value > b.value) return 1
		return 0
	}
}
