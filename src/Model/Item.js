import { flattenObject, deepCopyObject } from "../Utility/JsonUtility"
import { attributeValidator } from "../Validation/Validation"

export default class Item {
    constructor(original, includedAttributes, ignoredAttributes) {
        this.original = deepCopyObject(original)
        this.shards = flattenObject(this.original).filter(shard => attributeValidator(shard.path, includedAttributes, ignoredAttributes))
    }
}