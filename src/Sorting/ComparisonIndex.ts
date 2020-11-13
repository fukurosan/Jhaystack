import SearchResult from "../Model/SearchResult"

/**
 * Sorts search results by their comparison index.
 * Use the ASCENDING or DESCENDING property to set the direction.
 */
export const COMPARISON_INDEX = {
	DESCENDING: (a: SearchResult, b: SearchResult): number => {
		if (a.comparisonIndex < b.comparisonIndex) return 1
		if (a.comparisonIndex > b.comparisonIndex) return -1
		return 0
	},
	ASCENDING: (a: SearchResult, b: SearchResult): number => {
		if (a.comparisonIndex < b.comparisonIndex) return -1
		if (a.comparisonIndex > b.comparisonIndex) return 1
		return 0
	}
}
