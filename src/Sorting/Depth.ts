import SearchResult from "../Model/SearchResult"

export default {
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
