import { flattenObject, deepCopyObject } from "../Utility/JsonUtility"
import { findReverseTweenPoint } from "../Utility/Mathematics"
import { pathValidator } from "../Validation/Validation"
import Shard from "./Shard"
import Index from "./Index"
import SearchResult from "./SearchResult"

export default class Item {
    original: object
    shards: Shard[]
    indexes: Index[]

    constructor(original: object, includedPaths: (RegExp|string)[], excludedPaths: (RegExp|string)[], indexes: any[]) {
        this.original = deepCopyObject(original)
        this.shards = flattenObject(this.original).filter(shard => pathValidator(shard.path, includedPaths, excludedPaths))
        this.indexes = indexes.map(IndexImplementation => new IndexImplementation(this.shards))
    }

    indexLookup(term: string): SearchResult|null {
        for (let i = 0; i < this.indexes.length; i++) {
            let result = this.indexes[i].evaluate(term)
            if (result.relevance && result.shard) {
                return new SearchResult(this.original, result.shard.path, result.shard.value, findReverseTweenPoint(this.indexes.length, i + 1, result.relevance))
            }
        }
        return null
    }
}