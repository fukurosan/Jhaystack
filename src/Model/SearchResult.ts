export default class SearchResult {
    item: any
    path: any
    depth: any
    
    constructor(item: object, path: string[]) {
        this.item = item
        this.path = path
        this.depth = path.length
    }
}