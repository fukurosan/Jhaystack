import SearchResult from "../Model/SearchResult"

export default (a: SearchResult, b: SearchResult): number => {
    if (a.relevance < b.relevance) return 1
    if (a.relevance > b.relevance) return -1
    return 0
}