import { IIndex } from "./Model/Index"
import SearchResult from "./Model/SearchResult"

export default interface IOptions {
    comparison?: ((term: any, context: any) => number)[]
    traversal?: (itemArray: any, searchString: any, comparisonStrategy: any, limit: any) => any[]
    sorting?: ((a: SearchResult, b: SearchResult) => number)[]
    limit?: number
    index?: IIndex[]
    includedPaths?: (RegExp | string)[]
    excludedPaths?: (RegExp | string)[]
    data?: object[]
}