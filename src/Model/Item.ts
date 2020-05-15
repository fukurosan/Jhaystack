import { flattenObject, deepCopyObject } from "../Utility/JsonUtility"
import { pathValidator } from "../Validation/Validation"
import Shard from "./Shard"
import Index from "./Index"

export default class Item {
    original: object
    shards: Shard[]
    indexes: Index[]

    constructor(original, includedPaths, excludedPaths, indexes) {
        this.original = deepCopyObject(original)
        this.shards = flattenObject(this.original).filter(shard => pathValidator(shard.path, includedPaths, excludedPaths))
        this.indexes = indexes.map(IndexImplementation => new IndexImplementation(this.shards))
    }
}