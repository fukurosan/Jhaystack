export default class SearchResult {
    constructor(item, path) {
        this.item = item
        this.path = path
        this.depth = path.length
    }
}