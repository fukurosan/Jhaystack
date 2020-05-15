import { getLastNonNumericItemInArray } from "../Utility/JsonUtility"

export default class Shard {
    value: any
    path: String[]
    depth: number
    key: String

    constructor(value: any, path: String[]) {
        this.value = value
        this.path = path
        this.depth = this.path.length
        this.key = <String> getLastNonNumericItemInArray(this.path)
    }
}