import SearchResult from "../Model/SearchResult"

export default {
    DESCENDING: (a: SearchResult, b: SearchResult): number => {
        const aProperty = a.path.length === 0 ? 0 : a.path[a.path.length - 1]
        const bProperty = b.path.length === 0 ? 0 : b.path[b.path.length - 1]
        if (aProperty < bProperty) return 1
        if (aProperty > bProperty) return -1
        return 0
    },
    ASCENDING: (a: SearchResult, b: SearchResult): number => {
        const aProperty = a.path.length === 0 ? 0 : a.path[a.path.length - 1]
        const bProperty = b.path.length === 0 ? 0 : b.path[b.path.length - 1]
        if (aProperty < bProperty) return -1
        if (aProperty > bProperty) return 1
        return 0
    }
}