import { getLastNonNumericItemInArray } from "../Utility/JsonUtility"

export default class Shard {
    constructor(value, path) {
        this.value = value
        this.path = path
        this.depth = this.path.length
        this.key = getLastNonNumericItemInArray(this.path)
    }
}