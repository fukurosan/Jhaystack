export default class SearchResult {
    constructor(item, path, value, relevance=1) {
        this.item = item
        this.path = path
        this.depth = path.length
        this.value = value
        this.relevance = relevance
    }
}