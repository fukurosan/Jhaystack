import SearchResult from "../Model/SearchResult"

export const SORT_BY_VALUE = (a: SearchResult, b: SearchResult): number => {
    if (a.value < b.value) return -1
    if (a.value > b.value) return 1
    return 0
}

export const SORT_BY_ATTRIBUTE = (a: SearchResult, b: SearchResult): number => {
    if (a.path[a.path.length - 1] < b.path[b.path.length - 1]) return -1
    if (a.path[a.path.length - 1] > b.path[b.path.length - 1]) return 1
    return 0
}

export const SORT_BY_DEPTH = (a: SearchResult, b: SearchResult): number => {
    if (a.depth < b.depth) return -1
    if (a.depth > b.depth) return 1
    return 0
}

export default {
    SORT_BY_VALUE,
    SORT_BY_ATTRIBUTE,
    SORT_BY_DEPTH
}