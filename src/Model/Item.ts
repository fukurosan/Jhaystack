import { flattenObject, deepCopyObject } from "../Utility/JsonUtility"
import { pathValidator } from "../Validation/Validation"

export default class Item {
    constructor(original, includedPaths, excludedPaths, indexes) {
        this.original = deepCopyObject(original)
        this.shards = flattenObject(this.original).filter(shard => pathValidator(shard.path, includedPaths, excludedPaths))
        this.indexes = indexes.map(Index => new Index(shards))
    }
}