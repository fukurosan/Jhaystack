export default class SearchResult {
    constructor(item, path, value) {
        this.item = item
        this.path = path
        this.depth = path.length
        this.value = value
    }
}