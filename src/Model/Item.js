import { flattenObject, deepCopyObject } from "../Utility/JsonUtility"
import { findReverseTweenPoint } from "../Utility/Mathematics"
import { pathValidator } from "../Validation/Validation"
import SearchResult from "./SearchResult"

export default class Item {
    constructor(original, includedPaths, excludedPaths, indexes) {
        this.original = deepCopyObject(original)
        this.shards = flattenObject(this.original).filter(shard => pathValidator(shard.path, includedPaths, excludedPaths))
        this.indexes = indexes.map(IndexImplementation => new IndexImplementation(this.shards))
    }

    indexLookup(term) {
        for (let i = 0; i < this.indexes.length; i++) {
            let result = this.indexes[i].evaluate(term)
            if (result.relevance) {
                return new SearchResult(this.original, result.shard.path, result.shard.value, findReverseTweenPoint(this.indexes.length, i + 1, result.relevance))
            }
        }
        return null
    }
}