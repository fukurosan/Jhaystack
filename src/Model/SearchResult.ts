interface ObjectLiteral {
    [key: string]: any
}

export default class SearchResult {
    item: ObjectLiteral
    path: (string|number)[]
    depth: number
    
    constructor(item: ObjectLiteral, path: (string|number)[]) {
        this.item = item
        this.path = path
        this.depth = path.length
    }
}