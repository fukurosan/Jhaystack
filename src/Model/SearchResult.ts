interface ObjectLiteral {
    [key: string]: any
}

export default class SearchResult {
    item: ObjectLiteral
    path: (string|number)[]
    depth: number
    value: any
    relevance: number
    
    constructor(item: ObjectLiteral, path: (string|number)[], value: any, relevance: number = 1) {
        this.item = item
        this.path = path
        this.depth = path.length
        this.value = value
        this.relevance = relevance
    }
}