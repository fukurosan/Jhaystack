interface ObjectLiteral {
    [key: string]: any
}

export default class SearchResult {
    item: ObjectLiteral
    path: (string|number)[]
    depth: number
    value: any
    
    constructor(item: ObjectLiteral, path: (string|number)[], value: any) {
        this.item = item
        this.path = path
        this.depth = path.length
        this.value = value
    }
}