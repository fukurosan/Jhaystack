import SearchResult from "../Model/SearchResult"

export default {
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